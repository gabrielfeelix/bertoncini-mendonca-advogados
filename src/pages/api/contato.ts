import type { APIRoute } from 'astro';
import { confirmaRecebimento, enviaEmailDeContato, ErroBrevo, registraContato } from '~/lib/brevo';
import { caiuNaIsca, emailPlausivel, excedeuLimite, texto } from '~/lib/antispam';
import { responde } from '~/lib/resposta';
import { env, envObrigatoria } from '~/lib/ambiente';

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
  if (caiuNaIsca(dados)) return responde(request, { ok: true }, 200, DE_VOLTA, 'contato');

  const contato = {
    nome: texto(dados, 'nome', 120),
    email: texto(dados, 'email', 254),
    telefone: texto(dados, 'telefone', 40),
    assunto: texto(dados, 'assunto', 120),
    mensagem: texto(dados, 'mensagem', 5000),
  };

  if (!contato.nome || !contato.mensagem) {
    return responde(
      request,
      { ok: false, erro: 'Informe seu nome e escreva a mensagem.', codigo: 'faltando' },
      422,
      DE_VOLTA,
      'contato',
      contato,
    );
  }
  if (!emailPlausivel(contato.email)) {
    return responde(
      request,
      { ok: false, erro: 'Confira o e-mail informado.', codigo: 'email' },
      422,
      DE_VOLTA,
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
      DE_VOLTA,
      'contato',
      contato,
    );
  }

  /* `envObrigatoria` explode quando a variável não existe, e explodir aqui
     devolveria um 500 cru para quem está sem JavaScript, em vez de trazer a
     pessoa de volta ao formulário com uma frase legível. Configuração
     faltando é falha nossa, não dela: vira log e mensagem comum. */
  let chave: string;
  let remetente: { nome: string; email: string };
  let destino: string;
  try {
    chave = envObrigatoria('BREVO_API_KEY');
    remetente = {
      nome: env('BREVO_REMETENTE_NOME') ?? 'Site Bertoncini & Mendonça',
      email: envObrigatoria('BREVO_REMETENTE_EMAIL'),
    };
    destino = envObrigatoria('BREVO_DESTINO_EMAIL');
  } catch (erro) {
    console.error('[contato] configuração ausente', erro);
    return responde(
      request,
      { ok: false, erro: 'Não foi possível enviar a mensagem agora. Tente novamente em instantes.', codigo: 'envio' },
      500,
      DE_VOLTA,
      'contato',
      contato,
    );
  }

  /* Só o aviso para o escritório é obrigatório: se ele falhar, a mensagem se
     perdeu e a pessoa precisa saber para escrever de novo. */
  try {
    await enviaEmailDeContato(chave, remetente, destino, contato);
  } catch (erro) {
    /* O corpo da resposta da Brevo diz o motivo real (domínio não
       autenticado, IP recusado, cota estourada). Fica no log da função,
       nunca na resposta: o motivo interno não é assunto de quem escreveu. */
    console.error('[contato] falha ao enviar', erro instanceof ErroBrevo ? erro.corpo : erro);
    return responde(
      request,
      { ok: false, erro: 'Não foi possível enviar agora. Tente novamente em instantes.', codigo: 'envio' },
      502,
      DE_VOLTA,
      'contato',
    );
  }

  /* O registro na lista e a confirmação são secundários. Falha aqui vira
     log, não erro na tela: o e-mail já chegou ao escritório, e dizer "não
     consegui enviar" faria a pessoa escrever tudo de novo. */
  const lista = env('BREVO_LISTA_CONTATOS_ID');
  const resultados = await Promise.allSettled([
    lista ? registraContato(chave, Number(lista), contato) : Promise.resolve(null),
    confirmaRecebimento(chave, remetente, contato),
  ]);
  for (const r of resultados) {
    if (r.status === 'rejected') {
      console.error(
        '[contato] etapa secundária falhou',
        r.reason instanceof ErroBrevo ? r.reason.corpo : r.reason,
      );
    }
  }

  return responde(request, { ok: true }, 200, DE_VOLTA, 'contato');
};
