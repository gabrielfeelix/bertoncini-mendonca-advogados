/**
 * Pedir o link de troca de senha.
 *
 * Responde igual para e-mail cadastrado ou não: dizer "esse e-mail não
 * existe" entregaria a estranhos quem tem conta no painel. Só erro de limite
 * do Supabase (pedidos demais) vira recado.
 *
 * O link do e-mail leva a /painel/nova-senha/ deste mesmo endereço. Esse
 * destino precisa estar em Authentication → URL Configuration → Redirect
 * URLs no Supabase, senão o Supabase manda para a Site URL.
 */
import type { APIRoute } from 'astro';
import { clienteAnonimo } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const anon = clienteAnonimo();
  if (!anon) return responde(request, '/painel/esqueci/?erro=sem-banco', 'sem-banco');

  let email = '';
  try {
    email = String((await request.formData()).get('email') ?? '').trim().slice(0, 254);
  } catch {
    /* segue vazio */
  }
  if (!email) return responde(request, '/painel/esqueci/?erro=campos', 'campos');

  const { error } = await anon.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('/painel/nova-senha/', url.origin).toString(),
  });

  if (error && error.status === 429) {
    return responde(request, '/painel/esqueci/?erro=limite', 'limite');
  }
  if (error) console.error('[painel] pedido de nova senha', error.status, error.message);

  return responde(request, '/painel/esqueci/?enviado=1');
};
