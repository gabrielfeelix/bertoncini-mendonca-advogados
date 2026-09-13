/**
 * `/robots.txt` — a terceira camada de proteção das rotas que não devem
 * ser indexadas.
 *
 * O comentário do `astro.config.mjs` já descrevia a política em três
 * camadas para o painel — fora do sitemap, `noindex` na página e
 * `robots.txt` proibindo —, mas a terceira nunca existiu: `/robots.txt`
 * devolvia 404 no site publicado. Isto é a camada que faltava.
 *
 * É rota, e não arquivo em `public/`, por causa do `Sitemap:` no fim: a
 * URL sai de `site` no `astro.config.mjs`, então não há um endereço
 * escrito à mão em dois lugares para divergir quando o domínio entrar.
 *
 * `prerender = true` porque isto é o mesmo texto para todo mundo: não
 * precisa de função a cada pedido, mesmo com o adaptador da Vercel em
 * modo server.
 */
import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * O que fica fora dos buscadores, e por quê:
 *
 * - `/painel/` é a área de publicação do escritório. URL de painel
 *   indexada é convite: fica fora do sitemap, manda `noindex` e é
 *   proibida aqui.
 * - `/previa/` é página de trabalho, não versionada, que só existe na
 *   máquina de quem desenvolve. Ela não deveria chegar à produção — o
 *   `.vercelignore` agora impede —, mas a regra fica como rede: um
 *   deploy feito de outra máquina, com o arquivo presente, não publica
 *   uma home antiga indexável.
 * - `/api/` não tem conteúdo para ninguém ler; são os destinos dos
 *   formulários.
 */
const proibidos = ['/painel/', '/previa/', '/api/'];

export const GET: APIRoute = ({ site }) => {
  const linhas = [
    'User-agent: *',
    ...proibidos.map((caminho) => `Disallow: ${caminho}`),
    '',
    // Sem `site` configurado não há URL absoluta para declarar, e um
    // `Sitemap:` relativo é inválido: melhor omitir a linha.
    ...(site ? [`Sitemap: ${new URL('sitemap-index.xml', site).href}`, ''] : []),
  ];

  return new Response(linhas.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
