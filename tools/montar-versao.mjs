#!/usr/bin/env node
/**
 * Monta uma versão do site dentro de /<pasta>/ do build da versão atual.
 * Generaliza tools/montar-v2.mjs da branch v2 (que fixava "/v2").
 *
 * Uso: node tools/montar-versao.mjs <pasta> <static-da-versao> <static-de-destino>
 *   ex.: node tools/montar-versao.mjs v3 .vercel/output/static ../v1/.vercel/output/static
 *
 * A versão precisa ser construída com PREVIA_ESTATICA=1, para as páginas
 * de contato saírem pré-geradas (dentro da pasta não há função de servidor).
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

const [pasta, origem, destinoRaiz] = process.argv.slice(2);
if (!pasta || !origem || !destinoRaiz || !/^[a-z0-9-]+$/.test(pasta)) {
  console.error('uso: node tools/montar-versao.mjs <pasta> <static-da-versao> <static-de-destino>');
  process.exit(1);
}
const destino = join(destinoRaiz, pasta);

const PULA = new RegExp(`^/(?:/|${pasta}/|api/|_vercel/)`);
const prefixa = (url) => (url.startsWith('/') && !PULA.test(url) ? `/${pasta}${url}` : url);

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
    /* Páginas de redirecionamento (/blog/ → /conteudos/): meta-refresh. */
    .replace(/(content="\d+;\s*url=)(\/[^"]*)"/gi, (_, a, url) => `${a}${prefixa(url)}"`)
    .replace(/<head>/, '<head><meta name="robots" content="noindex, nofollow">');

const reescreveCss = (css) =>
  css.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, url) => `url(${q}${prefixa(url)}${q})`);

const reescreveJs = (js) => js.replace('return`/`+e', `return\`/${pasta}/\`+e`);

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
console.log(`${pasta} montada em ${destino}: ${html} páginas, ${css} folhas de estilo.`);
