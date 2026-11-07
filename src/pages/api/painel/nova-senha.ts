/**
 * Gravar a senha nova.
 *
 * O link do e-mail traz a sessão de recuperação na âncora da URL
 * (`#access_token=...&refresh_token=...&type=recovery`). A âncora não chega
 * ao servidor, então a página /painel/nova-senha/ a lê no navegador e manda
 * os dois tokens junto com a senha nova, num POST. Aqui eles viram sessão,
 * a senha é trocada, e a pessoa já entra no painel.
 */
import type { APIRoute } from 'astro';
import { clienteAnonimo, gravaSessao } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const anon = clienteAnonimo();
  if (!anon) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, '/painel/esqueci/?erro=link', 'link');
  }

  const acesso = String(dados.get('access_token') ?? '');
  const atualiza = String(dados.get('refresh_token') ?? '');
  const senha = String(dados.get('senha') ?? '');
  const senha2 = String(dados.get('senha2') ?? '');

  if (!acesso || !atualiza) return responde(request, '/painel/esqueci/?erro=link', 'link');
  /* A página confere as duas regras antes de enviar; esta é a conferência
     que vale, para quem chegar aqui sem passar por ela. */
  if (senha.length < 8) return responde(request, '/painel/esqueci/?erro=senha-curta', 'senha-curta');
  if (senha !== senha2) return responde(request, '/painel/esqueci/?erro=senha-diferente', 'senha-diferente');

  const { data: sessao, error: erroSessao } = await anon.auth.setSession({
    access_token: acesso,
    refresh_token: atualiza,
  });
  if (erroSessao || !sessao.session) return responde(request, '/painel/esqueci/?erro=link', 'link');

  const { error } = await anon.auth.updateUser({ password: senha });
  if (error) {
    const codigo = /different/i.test(error.message) ? 'senha-igual' : 'link';
    return responde(request, `/painel/esqueci/?erro=${codigo}`, codigo);
  }

  gravaSessao(cookies, sessao.session);
  return responde(request, '/painel/?feito=senha');
};
