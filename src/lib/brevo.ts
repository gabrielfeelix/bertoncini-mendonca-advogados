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

import { layoutEmail, paragrafo, dados as dadosEmail, citacao, botao, nota, rotuloSecao, escapa, urlAbsoluta } from './email-layout';

const BASE = 'https://api.brevo.com/v3';

/** Link do WhatsApp a partir do telefone digitado no formulário (Brasil). */
function zapDe(telefone: string): string | null {
  let n = telefone.replace(/\D/g, '');
  if (n.length === 10 || n.length === 11) n = '55' + n;
  return n.length >= 12 ? `https://wa.me/${n}` : null;
}

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
  /** Cidade de quem escreve (opcional). */
  cidade: string;
  assunto: string;
  /** Pessoa física ou empresa. Triagem pedida no briefing (q2.7 e q4.5). */
  perfil: string;
  /** Como a pessoa chegou ao escritório: indicação, Instagram, Google etc. (q2.7). */
  conheceu: string;
  mensagem: string;
  /** Versão do site de onde veio a mensagem. 'en' = página /en/contact/. */
  idioma?: 'pt' | 'en';
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
    ['Cidade', dados.cidade || 'não informada'],
    ['Assunto', dados.assunto || 'não informado'],
    ['Quem escreve', dados.perfil || 'não informado'],
    ['Como conheceu', dados.conheceu || 'não informado'],
    ...(dados.idioma === 'en'
      ? ([['Idioma do site', 'inglês (a pessoa escreveu pela versão em inglês)']] as [string, string][])
      : []),
  ];

  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email: destino }],
    // Responder no e-mail encaminhado responde direto para quem escreveu.
    replyTo: { email: dados.email, name: dados.nome },
    subject: `Contato pelo site: ${dados.nome}${dados.assunto ? ` · ${dados.assunto}` : ''}`,
    textContent: [
      ...linhas.map(([r, v]) => `${r}: ${v}`),
      '',
      'Mensagem:',
      dados.mensagem,
    ].join('\n'),
    htmlContent: layoutEmail({
      preheader: `${dados.nome}${dados.assunto ? ` · ${dados.assunto}` : ''}: ${dados.mensagem.slice(0, 90)}`,
      rotulo: 'Novo contato pelo site',
      titulo: dados.nome,
      corpo:
        dadosEmail(linhas) +
        rotuloSecao('Mensagem') +
        citacao(dados.mensagem) +
        botao('Responder por e-mail', `mailto:${dados.email}?subject=${encodeURIComponent('Re: ' + (dados.assunto || 'Contato pelo site'))}`) +
        (zapDe(dados.telefone) ? botao('Chamar no WhatsApp', zapDe(dados.telefone)!, true) : '') +
        nota('Responder a este e-mail também responde direto para quem escreveu. A mensagem está guardada no painel, em Contatos.'),
    }),
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
      PERFIL: dados.perfil,
      CONHECEU: dados.conheceu,
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
  if (dados.idioma === 'en') return confirmaRecebimentoEmIngles(chave, remetente, dados, primeiroNome);
  const corpo = [
    `Prezado(a) ${primeiroNome},`,
    '',
    'Confirmamos o recebimento da sua mensagem. O escritório vai lê-la e',
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
    htmlContent: layoutEmail({
      preheader: 'Confirmamos o recebimento da sua mensagem.',
      rotulo: 'Mensagem recebida',
      titulo: `Obrigado, ${primeiroNome}.`,
      corpo:
        paragrafo('Confirmamos o recebimento da sua mensagem. O escritório vai lê-la e responder pelo e-mail que você informou.') +
        rotuloSecao('O que chegou até nós') +
        citacao(dados.mensagem) +
        botao('Conhecer o escritório', urlAbsoluta('/escritorio/')) +
        nota('Esta mensagem é apenas um aviso automático de recebimento. Ela não constitui orientação jurídica nem estabelece relação de patrocínio. Se precisar complementar algo, responda a este e-mail.'),
    }),
    tags: ['confirmacao-contato'],
  });
}

/** Mesma confirmação, para quem escreveu pela versão em inglês do site. */
function confirmaRecebimentoEmIngles(
  chave: string,
  remetente: { nome: string; email: string },
  dados: Contato,
  primeiroNome: string,
) {
  const corpo = [
    `Dear ${primeiroNome},`,
    '',
    'We confirm that we have received your message. The firm will',
    'read it and reply to the e-mail address you provided.',
    '',
    'This is an automatic acknowledgment of receipt only. It does not',
    'constitute legal advice or create an attorney-client relationship.',
    '',
    'This is what we received:',
    dados.mensagem,
  ];

  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email: dados.email, name: dados.nome }],
    subject: 'We have received your message',
    textContent: corpo.join('\n'),
    htmlContent: layoutEmail({
      preheader: 'We have received your message.',
      rotulo: 'Message received',
      titulo: `Thank you, ${primeiroNome}.`,
      corpo:
        paragrafo('We confirm that we have received your message. The firm will read it and reply to the e-mail address you provided.') +
        rotuloSecao('What we received') +
        citacao(dados.mensagem) +
        botao('About the firm', urlAbsoluta('/en/firm/')) +
        nota('This is an automatic acknowledgment of receipt only. It does not constitute legal advice or create an attorney-client relationship.'),
    }),
    tags: ['confirmacao-contato', 'en'],
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
    htmlContent: layoutEmail({
      preheader: 'Sua inscrição está confirmada.',
      rotulo: 'Newsletter',
      titulo: 'Inscrição confirmada',
      corpo:
        paragrafo('Você vai receber, por e-mail, cada texto novo que o escritório publicar: artigos escritos para quem não é da área, com o essencial de cada assunto.') +
        botao('Ver as publicações', urlAbsoluta('/conteudos/')) +
        nota('Para sair da lista, use o link no rodapé de qualquer envio. Se não foi você quem se inscreveu, ignore esta mensagem.'),
    }),
    tags: ['boas-vindas-newsletter'],
  });
}

/**
 * Boas-vindas de quem ganhou acesso ao painel (criado em /painel/usuarios/).
 *
 * A senha provisória NÃO vai no e-mail: e-mail fica guardado em caixas e
 * servidores de terceiros. Vão o login, o endereço do painel e um link de
 * uso único para a pessoa definir a própria senha (gerado pelo Supabase,
 * vale por uma hora). Vencido o link, "Esqueci minha senha" gera outro.
 */
export function enviaBoasVindasAoPainel(
  chave: string,
  remetente: { nome: string; email: string },
  dados: { nome: string; email: string; painel: string; linkSenha: string; quemCriou: string; papel?: string },
) {
  const primeiroNome = dados.nome.split(' ')[0] || dados.nome;
  return chama('/smtp/email', chave, {
    sender: { name: remetente.nome, email: remetente.email },
    to: [{ email: dados.email, name: dados.nome }],
    subject: 'Seu acesso ao painel do site',
    textContent: [
      `Olá, ${primeiroNome}.`,
      '',
      `${dados.quemCriou} criou o seu acesso ao painel do site, onde se publicam os textos e se leem as mensagens do formulário de contato.`,
      '',
      `Login: ${dados.email}`,
      `Painel: ${dados.painel}`,
      '',
      'Para definir a sua senha, abra o link abaixo. Ele vale por uma hora e só pode ser usado uma vez:',
      dados.linkSenha,
      '',
      'Se o link vencer, use "Esqueci minha senha" na tela de entrada do painel.',
    ].join('\n'),
    htmlContent: layoutEmail({
      preheader: `${dados.quemCriou} criou o seu acesso ao painel do site.`,
      rotulo: 'Acesso ao painel',
      titulo: `Boas-vindas, ${primeiroNome}.`,
      corpo:
        paragrafo(`${escapa(dados.quemCriou)} criou o seu acesso ao painel do site, onde se publicam os textos da Central de Conteúdos e se leem as mensagens do formulário de contato.`) +
        dadosEmail([['Login', dados.email], ...(dados.papel ? ([['Papel', dados.papel]] as [string, string][]) : []), ['Painel', dados.painel]]) +
        botao('Definir minha senha', dados.linkSenha) +
        nota('O link vale por uma hora e só pode ser usado uma vez. Se ele vencer, use "Esqueci minha senha" na tela de entrada do painel.'),
    }),
    tags: ['boas-vindas-painel'],
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


export interface ArtigoNewsletter {
  titulo: string;
  resumo: string;
  categoria: string;
  /** URL absoluta do artigo no site. */
  url: string;
  /** URL da capa (absoluta ou caminho do site); opcional. */
  capa?: string | null;
  capaAlt?: string | null;
}

/** HTML da newsletter de um artigo (também usado no envio de teste). */
export function htmlNewsletter(a: ArtigoNewsletter): string {
  return layoutEmail({
    preheader: a.resumo,
    rotulo: a.categoria || 'Novo texto',
    titulo: a.titulo,
    imagem: a.capa ? { src: urlAbsoluta(a.capa), alt: a.capaAlt || a.titulo } : undefined,
    corpo: paragrafo(escapa(a.resumo)) + botao('Ler o artigo', a.url),
    descadastro: true,
  });
}

/**
 * Newsletter de um artigo recém-publicado: cria uma campanha na Brevo para
 * a lista da newsletter e dispara na hora. Com `teste`, só manda um envio
 * de teste para esse endereço (a campanha fica em rascunho na Brevo).
 * Devolve o id da campanha.
 */
export async function disparaNewsletterDoArtigo(
  chave: string,
  remetente: { nome: string; email: string },
  listaId: number,
  artigo: ArtigoNewsletter,
  teste?: string,
): Promise<number> {
  const campanha = (await chama('/emailCampaigns', chave, {
    name: `Newsletter · ${artigo.titulo}`.slice(0, 250),
    subject: artigo.titulo,
    previewText: artigo.resumo.slice(0, 140),
    sender: { name: remetente.nome, email: remetente.email },
    replyTo: remetente.email,
    htmlContent: htmlNewsletter(artigo),
    recipients: { listIds: [listaId] },
    tag: 'newsletter-artigo',
    /* Agendada para 10 minutos depois: tempo de o site terminar de se
       atualizar, para o botão "Ler o artigo" nunca levar a uma página que
       ainda não existe. No teste não agenda (fica em rascunho). */
    ...(teste ? {} : { scheduledAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() }),
  })) as { id: number };
  if (teste) await chama(`/emailCampaigns/${campanha.id}/sendTest`, chave, { emailTo: [teste] });
  return campanha.id;
}
