/**
 * Apagar um artigo.
 *
 * Só POST, e a exclusão passa pela RLS como qualquer outra escrita: quem
 * não é editor não apaga nada, mesmo chamando a rota direto.
 */
import type { APIRoute } from 'astro';
import { clienteComSessao, tokenDaSessao, configSupabase } from '~/lib/painel-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return new Response(null, { status: 303, headers: { location: '/painel/?erro=sem-banco' } });

  const token = tokenDaSessao(cookies);
  const cliente = token ? clienteComSessao(token) : null;
  if (!cliente) return new Response(null, { status: 303, headers: { location: '/painel/?erro=sessao' } });

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return new Response(null, { status: 303, headers: { location: '/painel/?erro=salvar' } });
  }

  const slug = String(dados.get('slug') ?? '').trim().slice(0, 80);
  if (!slug) return new Response(null, { status: 303, headers: { location: '/painel/' } });

  const { error } = await cliente.from('artigos').delete().eq('slug', slug);
  if (error) {
    console.error('[painel] falha ao apagar', error.message);
    return new Response(null, {
      status: 303,
      headers: { location: `/painel/artigo/?slug=${encodeURIComponent(slug)}&erro=salvar` },
    });
  }

  return new Response(null, { status: 303, headers: { location: '/painel/?feito=apagado' } });
};
