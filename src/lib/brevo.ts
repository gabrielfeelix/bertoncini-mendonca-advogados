/**
 * Cliente mínimo da API da Brevo. Só o que o site usa: e-mail transacional
 * (formulário de contato) e criação de contato em lista (newsletter).
 *
 * Adaptado de `src/lib/brevo.ts` da Isabella. O que mudou:
 *
 * 1. Os campos do contato são outros. Lá havia "serviço" escolhido numa
 *    lista de serviços de arquitetura. Aqui o campo é "assunto", e ele é um
 *    texto livre curto, porque a lista de áreas do escritório ainda está
 *    sendo fechada e oferecer uma lista incompleta induz a pessoa a
 *    enquadrar o caso na caixa errada.
 * 2. A voz dos e-mails é a do escritório: primeira pessoa do plural, formal
 *    no registro e simples no vocabulário. Nada de "a gente" (a Isabella
 *    usava), nada de travessão em texto visível.
 * 3. Nenhum e-mail promete prazo de resposta. O protótipo marca o prazo de
 *    "um dia útil" como placeholder a confirmar com os sócios, e o
 *    Provimento 205/2021 da OAB proíbe promessa de resultado. Os e-mails
 *    dizem que a mensagem chegou, e só.
 *
 * Atenção operacional (herdada e ainda válida): a Brevo tem um recurso de
 * "IPs autorizados" que, quando ligado, recusa a chave vinda de qualquer IP
 * fora da lista. As funções da Vercel saem por IPs dinâmicos, então esse
 * recurso precisa ficar DESLIGADO em app.brevo.com/security/authorised_ips.
 * O sintoma é 401 com code "unauthorized" citando o IP.
 */

const BASE = 'https://api.brevo.com/v3';

export class ErroBrevo extends Error {
  constructor(
    readonly status: number,
    readonly corpo: string,
  ) {
    super(`Brevo respondeu ${status}: ${corpo}`);
    this.name = 'ErroBrevo';
  }
}

async function chama(caminho: string, chave: string, corpo: unknown): Promise<unknown> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    method: 'POST',
    headers: {
      'api-key': chave,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(corpo),
  });

  const texto = await resposta.text();
  if (!resposta.ok) throw new ErroBrevo(resposta.status, texto);
  return texto ? JSON.parse(texto) : null;
}

export interface Contato {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
}

/** Encaminha a mensagem do formulário para a caixa do escritório. */
export function enviaEmailDeContato(
  chave: string,
  remetente: { nome: string; email: string },
  destino: string,
  dados: Contato,
) {
  const linhas: [string, string][] = [
    ['Nome', dados.nome],
    ['E-mail', dados.email],
    ['Telefone', dados.telefone || 'não informado'],
    ['Assunto', dados.assunto || 'não informado'],
  ];

  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email: destino }],
    // Responder no e-mail encaminhado responde direto para quem escreveu.
    replyTo: { email: dados.email, name: dados.nome },
    subject: `Contato pelo site: ${dados.nome}`,
    textContent: [
      ...linhas.map(([r, v]) => `${r}: ${v}`),
      '',
      'Mensagem:',
      dados.mensagem,
    ].join('\n'),
    htmlContent: [
      '<div style="font-family:Georgia,serif;font-size:15px;line-height:1.6">',
      '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">',
      ...linhas.map(
        ([r, v]) =>
          `<tr><td style="padding:2px 12px 2px 0;color:#517493">${r}</td>` +
          `<td style="padding:2px 0"><strong>${escapa(v)}</strong></td></tr>`,
      ),
      '</table>',
      '<p style="margin:16px 0 4px;color:#517493">Mensagem</p>',
      `<p style="margin:0;white-space:pre-wrap">${escapa(dados.mensagem)}</p>`,
      '</div>',
    ].join(''),
    tags: ['formulario-contato'],
  });
}

/**
 * Registra quem escreveu como contato na Brevo, além do e-mail.
 *
 * Só roda se `BREVO_LISTA_CONTATOS_ID` estiver configurada. A mensagem vai
 * truncada: o texto íntegro está no e-mail, aqui é só contexto na listagem.
 *
 * Como na Isabella, atributo que não existe na conta a Brevo descarta em
 * silêncio, sem erro. Os nomes abaixo precisam ser criados na conta antes de
 * a rota ir ao ar, ou o dado se perde sem aviso.
 */
export function registraContato(chave: string, listaId: number, dados: Contato) {
  return chama('/contacts', chave, {
    email: dados.email,
    listIds: [listaId],
    updateEnabled: true,
    attributes: {
      NOME: dados.nome,
      TELEFONE: dados.telefone,
      ASSUNTO: dados.assunto,
      ULTIMA_MENSAGEM: dados.mensagem.slice(0, 250),
      ORIGEM: 'formulario-contato',
    },
  });
}

/**
 * Confirma para quem escreveu que a mensagem chegou.
 *
 * TEXTO PROVISÓRIO. Como o texto das políticas, este vem do escritório. Ele
 * foi escrito para não prometer nada: diz que a mensagem chegou e que o
 * escritório responde, sem prazo e sem antecipar qualquer avaliação do caso.
 * Nenhuma frase aqui pode virar promessa de resultado.
 */
export function confirmaRecebimento(
  chave: string,
  remetente: { nome: string; email: string },
  dados: Contato,
) {
  const primeiroNome = dados.nome.split(' ')[0] ?? dados.nome;
  const corpo = [
    `Prezado(a) ${primeiroNome},`,
    '',
    'Confirmamos o recebimento da sua mensagem. Um dos sócios vai lê-la e',
    'responder pelo e-mail que você informou.',
    '',
    'Esta mensagem é apenas um aviso automático de recebimento. Ela não',
    'constitui orientação jurídica nem estabelece relação de patrocínio.',
    '',
    'Foi isto que chegou até nós:',
    dados.mensagem,
  ];

  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email: dados.email, name: dados.nome }],
    subject: 'Recebemos sua mensagem',
    textContent: corpo.join('\n'),
    htmlContent:
      '<div style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#0B1E3F">' +
      `<p>Prezado(a) ${escapa(primeiroNome)},</p>` +
      '<p>Confirmamos o recebimento da sua mensagem. Um dos sócios vai lê-la e ' +
      'responder pelo e-mail que você informou.</p>' +
      '<p style="color:#517493">Esta mensagem é apenas um aviso automático de ' +
      'recebimento. Ela não constitui orientação jurídica nem estabelece relação ' +
      'de patrocínio.</p>' +
      '<p style="color:#517493;margin-bottom:4px">Foi isto que chegou até nós:</p>' +
      `<p style="margin:0;white-space:pre-wrap;padding-left:12px;border-left:2px solid #E3E6EA">${escapa(dados.mensagem)}</p>` +
      '</div>',
    tags: ['confirmacao-contato'],
  });
}

/**
 * Boas-vindas da newsletter.
 *
 * Opt-in simples, como na Isabella: o contato entra na lista na hora e
 * recebe este e-mail. Sem link de confirmação. A consequência conhecida é
 * que alguém pode inscrever o endereço de terceiro, e por isso o e-mail diz
 * explicitamente o que fazer nesse caso.
 *
 * TEXTO PROVISÓRIO: o definitivo vem do escritório.
 */
export function enviaBoasVindas(
  chave: string,
  remetente: { nome: string; email: string },
  email: string,
) {
  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email }],
    subject: 'Inscrição confirmada',
    textContent: [
      'Sua inscrição está confirmada.',
      '',
      'Você vai receber os textos que publicamos, escritos para quem não é da',
      'área. Para sair da lista, use o link no rodapé de qualquer envio.',
      '',
      'Se não foi você quem se inscreveu, ignore esta mensagem. Sem uma',
      'confirmação sua, nada mais será enviado depois do descadastro.',
    ].join('\n'),
    htmlContent:
      '<div style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#0B1E3F">' +
      '<p>Sua inscrição está confirmada.</p>' +
      '<p>Você vai receber os textos que publicamos, escritos para quem não é da área. ' +
      'Para sair da lista, use o link no rodapé de qualquer envio.</p>' +
      '<p style="color:#517493">Se não foi você quem se inscreveu, ignore esta mensagem.</p>' +
      '</div>',
    tags: ['boas-vindas-newsletter'],
  });
}

/** Inscreve um e-mail na lista da newsletter. */
export function inscreveNaNewsletter(chave: string, listaId: number, email: string) {
  return chama('/contacts', chave, {
    email,
    listIds: [listaId],
    // Reinscrever um contato já existente não pode virar erro 400.
    updateEnabled: true,
  });
}

function escapa(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
