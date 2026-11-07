/**
 * Login do painel.
 *
 * Recebe o `<form>` de /painel/entrar/, autentica no Supabase e grava a
 * sessão em cookie HttpOnly (ver `~/lib/painel-auth`). Funciona sem
 * JavaScript: responde sempre com 303.
 *
 * Mensagem única para e-mail inexistente e senha errada: dizer qual dos dois
 * falhou conta a quem tenta adivinhar quais e-mails têm conta.
 */
import type { APIRoute } from 'astro';
import { clienteAnonimo, clienteComSessao, gravaSessao } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const volta = (erro: string) => responde(request, `/painel/entrar/?erro=${erro}`, erro);

  const anon = clienteAnonimo();
  if (!anon) return volta('sem-banco');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return volta('campos');
  }

  const email = String(dados.get('email') ?? '').trim().slice(0, 254);
  const senha = String(dados.get('senha') ?? '');
  if (!email || !senha) return volta('campos');

  const { data, error } = await anon.auth.signInWithPassword({ email, password: senha });
  if (error || !data.session) {
    console.error('[painel] falha ao entrar', error?.message);
    return volta('credenciais');
  }

  /* Conta válida, mas fora de `editores`: não ganha cookie. A RLS barraria
     tudo de qualquer jeito; isto só evita uma tela vazia sem explicação. */
  const { data: editor } = await clienteComSessao(data.session.access_token)!
    .from('editores')
    .select('id')
    .eq('id', data.session.user.id)
    .maybeSingle();
  if (!editor) return volta('sem-acesso');

  gravaSessao(cookies, data.session);
  return responde(request, '/painel/');
};
