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
 * O valor é validado aqui, e não confiado: só aceitamos um caminho absoluto
 * do próprio site, sem "//" no início (que o navegador leria como outro
 * domínio) e sem "..". Assim um campo forjado não transforma esta rota num
 * redirecionador aberto.
 */
function origemSegura(valor: string): string {
  if (!valor.startsWith('/') || valor.startsWith('//') || valor.includes('..')) return '/';
  return valor;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, { ok: false, erro: 'Não foi possível ler o formulário.', codigo: 'formato' }, 400, '/');
  }

  const volta = origemSegura(texto(dados, 'origem', 200));

  if (caiuNaIsca(dados)) return responde(request, { ok: true }, 200, volta);

  const email = texto(dados, 'email', 254);
  if (!emailPlausivel(email)) {
    return responde(request, { ok: false, erro: 'Confira o e-mail informado.', codigo: 'email' }, 422, volta);
  }

  if (excedeuLimite(clientAddress ?? 'desconhecido')) {
    return responde(
      request,
      { ok: false, erro: 'Muitos envios seguidos deste aparelho. Tente novamente em alguns minutos.', codigo: 'limite' },
      429,
      volta,
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

  return responde(request, { ok: true }, 200, volta);
};
