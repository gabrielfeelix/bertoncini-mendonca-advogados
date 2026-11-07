/**
 * Imagens dos posts do Instagram que vieram da Graph API, servidas do
 * nosso domínio (/media/ig/<id>.webp). No build, cada uma vira um arquivo
 * estático; a página nunca aponta para o CDN da Meta. Ver src/lib/instagram.ts.
 *
 * Sem token (ou com a API fora do ar) não há imagem nenhuma aqui: a seção
 * usa as imagens da lista curada, em public/media/instagram/.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { imagensDoInstagram } from '~/lib/instagram';

export const getStaticPaths = (async () => {
  const imagens = await imagensDoInstagram();
  return [...imagens.keys()].map((id) => ({ params: { id } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const imagem = (await imagensDoInstagram()).get(params.id ?? '');
  if (!imagem) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(imagem), {
    headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=86400' },
  });
};
