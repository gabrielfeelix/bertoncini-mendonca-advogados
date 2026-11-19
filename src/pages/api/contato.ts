import type { APIRoute } from 'astro';
import { confirmaRecebimento, enviaEmailDeContato, ErroBrevo, inscreveNaNewsletter, registraContato } from '~/lib/brevo';
import { caiuNaIsca, emailPlausivel, excedeuLimite, texto } from '~/lib/antispam';
import { responde } from '~/lib/resposta';
import { env } from '~/lib/ambiente';
import { clienteAnonimo } from '~/lib/painel-auth';

/* Rota de servidor dentro de um site estático: sem isto o build tenta
   pré-renderizar o endpoint e o POST vira 404. */
export const prerender = false;

const DE_VOLTA = '/contato/';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, { ok: false, erro: 'Não foi possível ler o formulário.', codigo: 'formato' }, 400, DE_VOLTA, 'contato');
  }

  /* Robô que preencheu campo-isca recebe sucesso e nada acontece. Devolver
     erro só ensinaria o robô a tentar de novo sem a isca. */
  /* Quem escreveu pela versão em inglês volta para ela (caminho sem JS). Só
     dois destinos fixos: o campo não vira redirecionamento aberto. */
  const idioma = dados.get('idioma') === 'en' ? 'en' : 'pt';
  const deVolta = idioma === 'en' ? '/en/contact/' : DE_VOLTA;

  if (caiuNaIsca(dados)) return responde(request, { ok: true }, 200, deVolta, 'contato');

  const contato = {
    nome: texto(dados, 'nome', 120),
    email: texto(dados, 'email', 254),
    telefone: texto(dados, 'telefone', 40),
    cidade: texto(dados, 'cidade', 80),
    assunto: texto(dados, 'assunto', 120),
    perfil: texto(dados, 'perfil', 40),
    conheceu: texto(dados, 'conheceu', 60),
    mensagem: texto(dados, 'mensagem', 5000),
    idioma,
  } as const;

  if (!contato.nome || !contato.mensagem) {
    return responde(
      request,
      { ok: false, erro: 'Informe seu nome e escreva a mensagem.', codigo: 'faltando' },
      422,
      deVolta,
      'contato',
      contato,
    );
  }
  if (!emailPlausivel(contato.email)) {
    return responde(
      request,
      { ok: false, erro: 'Confira o e-mail informado.', codigo: 'email' },
      422,
      deVolta,
      'contato',
      contato,
    );
  }

  /* O limite fica depois da validação de propósito: o que ele protege é a
     cota diária de envios da Brevo, e envio recusado por validação não
     consome cota. Contar tentativa inválida trancaria por dez minutos quem
     só errou o e-mail. */
  if (excedeuLimite(clientAddress ?? 'desconhecido')) {
    return responde(
      request,
      { ok: false, erro: 'Muitos envios seguidos deste aparelho. Tente novamente em alguns minutos.', codigo: 'limite' },
      429,
      deVolta,
      'contato',
      contato,
    );
  }

  const querNewsletter = dados.get('newsletter') === '1';

  /* Grava no banco antes de qualquer e-mail: a mensagem fica guardada mesmo
     que a Brevo falhe, e os editores a leem em /painel/contatos/. Vai com a
     chave anônima (a secreta não vai para a Vercel); a migração 006 só deixa
     o anônimo inserir, e não ler, por isso o insert é sem `.select()`.
     Sem banco configurado (`clienteAnonimo()` nulo), segue só com o e-mail,
     como antes. */
  const banco = clienteAnonimo();
  let gravou = false;
  if (banco) {
    const { error } = await banco.from('contatos').insert({
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone || null,
      cidade: contato.cidade || null,
      assunto: contato.assunto || null,
      perfil: contato.perfil || null,
      conheceu: contato.conheceu || null,
      mensagem: contato.mensagem,
      newsletter: querNewsletter,
      idioma: contato.idioma,
    });
    if (error) console.error('[contato] falha ao gravar no banco', error.message);
    else gravou = true;
  }

  /* Recusa para quando NADA funcionou: nem banco, nem e-mail. Aí a mensagem
     se perdeu e a pessoa precisa saber para escrever de novo. */
  const falhou = (status: number) =>
    responde(
      request,
      { ok: false, erro: 'Não foi possível enviar a mensagem agora. Tente novamente em instantes.', codigo: 'envio' },
      status,
      deVolta,
      'contato',
      contato,
    );

  /* A Brevo é opcional desde que o banco guarde a mensagem. Configuração
     faltando é falha nossa, não de quem escreveu: vira log, e só vira erro
     na tela se o banco também não gravou. (`envObrigatoria` explodiria em
     500 cru para quem está sem JavaScript; por isso `env` aqui.) */
  const chave = env('BREVO_API_KEY');
  const remetenteEmail = env('BREVO_REMETENTE_EMAIL');
  const destino = env('BREVO_DESTINO_EMAIL');
  if (!chave || !remetenteEmail || !destino) {
    console.error('[contato] Brevo não configurada (BREVO_API_KEY, BREVO_REMETENTE_EMAIL ou BREVO_DESTINO_EMAIL); nenhum e-mail enviado');
    return gravou ? responde(request, { ok: true }, 200, deVolta, 'contato') : falhou(500);
  }
  const remetente = { nome: env('BREVO_REMETENTE_NOME') ?? 'Site Bertoncini & Mendonça', email: remetenteEmail };

  /* O aviso para o escritório. Se ele falhar e o banco tiver gravado, a
     mensagem está guardada: a pessoa recebe sucesso e o escritório lê no
     painel. */
  try {
    await enviaEmailDeContato(chave, remetente, destino, contato);
  } catch (erro) {
    /* O corpo da resposta da Brevo diz o motivo real (domínio não
       autenticado, IP recusado, cota estourada). Fica no log da função,
       nunca na resposta: o motivo interno não é assunto de quem escreveu. */
    console.error('[contato] falha ao enviar', erro instanceof ErroBrevo ? erro.corpo : erro);
    if (!gravou) return falhou(502);
  }

  /* O registro na lista e a confirmação são secundários. Falha aqui vira
     log, não erro na tela: a mensagem já chegou (por e-mail ou no banco), e
     dizer "não consegui enviar" faria a pessoa escrever tudo de novo. */
  const lista = env('BREVO_LISTA_CONTATOS_ID');
  /* Caixa opcional "Quero receber artigos..." (newsletter=1, desmarcada por
     padrão): inscreve na mesma lista e pela mesma função de /api/newsletter.
     Sem a lista configurada, só fica no log. */
  const listaNews = Number(env('BREVO_LISTA_NEWSLETTER_ID'));
  if (querNewsletter && !Number.isFinite(listaNews)) console.error('[contato] newsletter pedida, mas BREVO_LISTA_NEWSLETTER_ID ausente');
  const resultados = await Promise.allSettled([
    lista ? registraContato(chave, Number(lista), contato) : Promise.resolve(null),
    confirmaRecebimento(chave, remetente, contato),
    querNewsletter && Number.isFinite(listaNews) && listaNews > 0
      ? inscreveNaNewsletter(chave, listaNews, contato.email)
      : Promise.resolve(null),
  ]);
  for (const r of resultados) {
    if (r.status === 'rejected') {
      console.error(
        '[contato] etapa secundária falhou',
        r.reason instanceof ErroBrevo ? r.reason.corpo : r.reason,
      );
    }
  }

  return responde(request, { ok: true }, 200, deVolta, 'contato');
};
