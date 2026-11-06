#!/usr/bin/env node
/**
 * Monta a versão 2 do site dentro de /v2/ do build da versão atual.
 *
 * Uso: node tools/montar-v2.mjs <static-da-v2> <static-de-destino>
 *   ex.: node tools/montar-v2.mjs .vercel/output/static ../v1/.vercel/output/static
 *
 * Por que existe (06/11/2026): o Gabriel quis mostrar a v2 ao escritório no
 * mesmo domínio, em /v2, mantendo a versão atual na raiz. O site usa
 * caminhos absolutos em todo lugar ("/areas/", "/media/..."), então em vez
 * de reescrever o código com `base`, o build estático da v2 é copiado para
 * dentro de /v2/ e os caminhos são prefixados aqui:
 *   - HTML: href, src, action, poster e srcset que começam com "/";
 *   - CSS: url(/...);
 *   - o preload do Vite, que monta "/" + arquivo.
 * Ficam de fora /api/ (formulário e newsletter usam a API da raiz, que é a
 * mesma) e /_vercel/. Cada página da v2 ganha `noindex`: é uma prévia, não
 * pode competir com a raiz no buscador. Sitemap e robots da v2 não sobem.
 */
import { cp, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [origem, destinoRaiz] = process.argv.slice(2);
if (!origem || !destinoRaiz) {
  console.error('uso: node tools/montar-v2.mjs <static-da-v2> <static-de-destino>');
  process.exit(1);
}
const destino = join(destinoRaiz, 'v2');

const PULA = /^\/(?:\/|v2\/|api\/|_vercel\/)/;
const prefixa = (url) => (url.startsWith('/') && !PULA.test(url) ? `/v2${url}` : url);

const reescreveHtml = (html) =>
  html
    .replace(/(\s(?:href|src|action|poster)=")(\/[^"]*)"/g, (_, a, url) => `${a}${prefixa(url)}"`)
    .replace(/(\ssrcset=")([^"]*)"/g, (_, a, lista) =>
      `${a}${lista
        .split(',')
        .map((parte) => parte.replace(/^(\s*)(\S+)/, (_, esp, url) => esp + prefixa(url)))
        .join(',')}"`,
    )
    .replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, url) => `url(${q}${prefixa(url)}${q})`)
    .replace(/<head>/, '<head><meta name="robots" content="noindex, nofollow">');

const reescreveCss = (css) =>
  css.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, url) => `url(${q}${prefixa(url)}${q})`);

const reescreveJs = (js) => js.replace('return`/`+e', 'return`/v2/`+e');

async function* arquivos(dir) {
  for (const nome of await readdir(dir)) {
    const caminho = join(dir, nome);
    if ((await stat(caminho)).isDirectory()) yield* arquivos(caminho);
    else yield caminho;
  }
}

await rm(destino, { recursive: true, force: true });
await cp(origem, destino, { recursive: true });
for (const nome of ['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt']) {
  await rm(join(destino, nome), { force: true });
}

let html = 0;
let css = 0;
for await (const arquivo of arquivos(destino)) {
  const ext = extname(arquivo);
  if (ext === '.html') {
    await writeFile(arquivo, reescreveHtml(await readFile(arquivo, 'utf8')));
    html++;
  } else if (ext === '.css') {
    await writeFile(arquivo, reescreveCss(await readFile(arquivo, 'utf8')));
    css++;
  } else if (ext === '.js' && arquivo.includes('preload-helper')) {
    await writeFile(arquivo, reescreveJs(await readFile(arquivo, 'utf8')));
  }
}
console.log(`v2 montada em ${destino}: ${html} páginas, ${css} folhas de estilo.`);
