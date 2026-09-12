/**
 * Login do painel.
 *
 * Recebe o `<form>` da tela de entrada, autentica no Supabase e grava a
 * sessão em cookie HttpOnly (ver `~/lib/painel-auth`). Responde sempre com
 * 303 para `/painel/`, com ou sem JavaScript: o painel inteiro funciona
 * como formulário HTML.
 *
 * O destino do 303 é fixo, escrito aqui — não vem do formulário nem do
 * `referer`. É a mesma regra da newsletter: destino que o cliente escolhe é
 * redirecionador aberto esperando acontecer.
 */
import type { APIRoute } from 'astro';
import { clienteAnonimo, configSupabase, gravaSessao } from '~/lib/painel-auth';

export const prerender = false;

function voltaCom(parametro: string): Response {
  return new Response(null, {
    status: 303,
    headers: { location: `/painel/?${parametro}` },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return voltaCom('erro=sem-banco');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return voltaCom('erro=campos');
  }

  const email = String(dados.get('email') ?? '').trim().slice(0, 254);
  const senha = String(dados.get('senha') ?? '');
  if (!email || !senha) return voltaCom('erro=campos');

  const cliente = clienteAnonimo();
  if (!cliente) return voltaCom('erro=sem-banco');

  const { data, error } = await cliente.auth.signInWithPassword({ email, password: senha });

  /* Mensagem única para e-mail inexistente e senha errada: dizer qual dos
     dois falhou conta a quem tenta adivinhar se aquele e-mail é editor. */
  if (error || !data.session) {
    console.error('[painel] falha ao entrar', error?.message);
    return voltaCom('erro=credenciais');
  }

  gravaSessao(cookies, data.session);
  return new Response(null, { status: 303, headers: { location: '/painel/' } });
};
