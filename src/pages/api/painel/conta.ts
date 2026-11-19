/**
 * Trocar a própria senha, a partir de /painel/conta/.
 *
 * Pede a senha atual e confere com `signInWithPassword` antes de trocar:
 * sem isso, quem achasse o painel aberto num computador alheio trocaria a
 * senha e tomaria a conta. A troca é feita pela sessão que esse login
 * acabou de abrir, ou seja, pela própria pessoa, sem chave secreta.
 *
 * Mesma checagem das outras rotas do painel: só POST, sessão de editor no
 * cookie, origem conferida pelo Astro (`security.checkOrigin`).
 */
import type { APIRoute } from 'astro';
import { clienteAnonimo, configSupabase, editorAtual, gravaSessao } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';

export const prerender = false;

const CONTA = '/painel/conta/';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, `${CONTA}?erro=salvar`, 'salvar');
  }

  const atual = String(dados.get('senha_atual') ?? '');
  const senha = String(dados.get('senha') ?? '');
  const senha2 = String(dados.get('senha2') ?? '');

  if (!atual) return responde(request, `${CONTA}?erro=senha-atual`, 'senha-atual');
  if (senha.length < 8) return responde(request, `${CONTA}?erro=senha-curta`, 'senha-curta');
  if (senha !== senha2) return responde(request, `${CONTA}?erro=senha-diferente`, 'senha-diferente');
  if (senha === atual) return responde(request, `${CONTA}?erro=senha-igual`, 'senha-igual');

  /* Cliente novo, só para esta troca: o login abaixo guarda a sessão nele
     (em memória), e o `updateUser` usa essa sessão. */
  const anon = clienteAnonimo()!;
  const { data: login, error: erroLogin } = await anon.auth.signInWithPassword({ email: editor.email, password: atual });
  if (erroLogin) {
    if (erroLogin.status === 429) return responde(request, `${CONTA}?erro=limite`, 'limite');
    return responde(request, `${CONTA}?erro=senha-atual`, 'senha-atual');
  }

  const { error } = await anon.auth.updateUser({ password: senha });
  if (error) {
    console.error('[painel] troca de senha', error.status, error.message);
    const codigo = /different/i.test(error.message) ? 'senha-igual' : 'salvar';
    return responde(request, `${CONTA}?erro=${codigo}`, codigo);
  }

  /* Trocar a senha encerra as outras sessões da conta, inclusive a do
     cookie. A sessão aberta pelo login acima é a que sobrevive: ela passa a
     ser a do cookie, e a pessoa continua no painel. */
  if (login.session) gravaSessao(cookies, login.session);
  return responde(request, `${CONTA}?feito=senha`);
};
