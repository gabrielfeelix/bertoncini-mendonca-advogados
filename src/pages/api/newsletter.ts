import type { APIRoute } from 'astro';
import { enviaBoasVindas, inscreveNaNewsletter, ErroBrevo } from '~/lib/brevo';
import { caiuNaIsca, emailPlausivel, excedeuLimite, texto } from '~/lib/antispam';
import { env, envObrigatoria } from '~/lib/ambiente';
import { responde } from '~/lib/resposta';

export const prerender = false;

/**
 * A newsletter aparece em mais de uma página, então o 303 de quem está sem
 * JavaScript precisa voltar para a página de onde a pessoa enviou. O
 * formulário manda isso num campo escondido.
 *
 * O valor é validado por LISTA FECHADA, não por filtro de caracteres.
 *
 * A primeira versão filtrava caracteres: recusava `//` no início e `..`. Era
 * furada. O parser de URL normaliza a barra invertida para barra, então
 * `origem=/\evil.com` virava `Location: http://evil.com/`, um
 * redirecionador aberto a partir de um `<input type="hidden">` que qualquer
 * site consegue forjar. Filtro de caractere é jogo que se perde: hoje é a
 * barra invertida, amanhã é outra normalização.
 *
 * Com lista fechada não há o que normalizar. Um valor que não esteja
 * exatamente na lista não é corrigido nem interpretado: cai em `/`.
 *
 * Ao acrescentar a newsletter a uma página nova, acrescente o caminho dela
 * aqui, ou o retorno sem JavaScript cai na home.
 */
const VOLTAS_PERMITIDAS = ['/', '/contato/'] as const;

function origemSegura(valor: string): string {
  return (VOLTAS_PERMITIDAS as readonly string[]).includes(valor) ? valor : '/';
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, { ok: false, erro: 'Não foi possível ler o formulário.', codigo: 'formato' }, 400, '/', 'newsletter');
  }

  const volta = origemSegura(texto(dados, 'origem', 200));

  if (caiuNaIsca(dados)) return responde(request, { ok: true }, 200, volta, 'newsletter');

  const email = texto(dados, 'email', 254);
  if (!emailPlausivel(email)) {
    return responde(request, { ok: false, erro: 'Confira o e-mail informado.', codigo: 'email' }, 422, volta, 'newsletter');
  }

  if (excedeuLimite(clientAddress ?? 'desconhecido')) {
    return responde(
      request,
      { ok: false, erro: 'Muitos envios seguidos deste aparelho. Tente novamente em alguns minutos.', codigo: 'limite' },
      429,
      volta,
      'newsletter',
    );
  }

  /* Mesma razão da rota de contato: configuração faltando não pode virar
     500 cru na cara de quem está sem JavaScript. */
  let chave: string;
  let lista: number;
  try {
    chave = envObrigatoria('BREVO_API_KEY');
    lista = Number(envObrigatoria('BREVO_LISTA_NEWSLETTER_ID'));
    if (!Number.isFinite(lista)) throw new Error('BREVO_LISTA_NEWSLETTER_ID não é um número');
  } catch (erro) {
    console.error('[newsletter] configuração ausente', erro);
    return responde(
      request,
      { ok: false, erro: 'Não foi possível inscrever agora. Tente novamente em instantes.', codigo: 'envio' },
      500,
      volta,
      'newsletter',
    );
  }

  try {
    await inscreveNaNewsletter(chave, lista, email);
  } catch (erro) {
    console.error('[newsletter] falha ao inscrever', erro instanceof ErroBrevo ? erro.corpo : erro);
    return responde(
      request,
      { ok: false, erro: 'Não foi possível inscrever agora. Tente novamente em instantes.', codigo: 'envio' },
      502,
      volta,
      'newsletter',
    );
  }

  /* A inscrição já valeu. Se as boas-vindas falharem, o problema é nosso,
     não de quem se inscreveu: vira log. */
  try {
    await enviaBoasVindas(
      chave,
      {
        nome: env('BREVO_REMETENTE_NOME') ?? 'Site Bertoncini & Mendonça',
        email: envObrigatoria('BREVO_REMETENTE_EMAIL'),
      },
      email,
    );
  } catch (erro) {
    console.error('[newsletter] falha nas boas-vindas', erro instanceof ErroBrevo ? erro.corpo : erro);
  }

  return responde(request, { ok: true }, 200, volta, 'newsletter');
};
