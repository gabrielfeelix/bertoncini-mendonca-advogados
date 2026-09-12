/**
 * Sair do painel: apaga os cookies de sessão e volta para a tela de entrada.
 *
 * Só POST. Sair por GET faria qualquer `<img src="/api/painel/sair">` em
 * qualquer página deslogar o editor.
 */
import type { APIRoute } from 'astro';
import { apagaSessao } from '~/lib/painel-auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  apagaSessao(cookies);
  return new Response(null, { status: 303, headers: { location: '/painel/?feito=saiu' } });
};
