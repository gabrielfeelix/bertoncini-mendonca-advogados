// tools/verifica.mjs
//
// O portão que protege as rotas publicadas (Tarefa 14).
//
// ── O que mudou em relação à versão anterior ────────────────────────────
//
// A versão da Tarefa 2 abria `prototipo/index.html` por `file://` e
// verificava uma página só. Isso deixou de bastar: o protótipo não é o
// site, e três defeitos Críticos já passaram despercebidos numa tarefa
// porque a verificação rodou contra uma página de trabalho em vez das
// rotas reais. Agora o alvo é o servidor, e todas as rotas.
//
// Some com isso a exceção de CORS de fonte sob `file://`: em http não há
// esse artefato, e qualquer erro de console volta a ser erro de verdade.
//
// ── Como rodar ──────────────────────────────────────────────────────────
//
//   npm run dev                    (num terminal)
//   npm run verifica               (noutro)
//
// Ou apontando para outro endereço:
//   BASE=http://localhost:4321 npm run verifica
//
// `npm run preview` NÃO funciona neste projeto (adaptador da Vercel em
// modo server), por isso o alvo padrão é o dev server.
//
// ── O que ele verifica, por rota ────────────────────────────────────────
//
//  1. erros de console e de página
//  2. rolagem horizontal, em desktop e em celular
//  3. alvos de toque de 44px em ALTURA E LARGURA
//  4. corpo de texto mínimo
//  5. um <h1> por página, e hierarquia de títulos sem degrau pulado
//  6. <title> e meta description presentes, únicos e dentro do tamanho
//  7. imagem sem alt
//  8. links quebrados (internos, resolvidos de verdade por requisição)
//  9. a página funciona com JavaScript desligado
// 10. reduced-motion: vídeo pausado, nada escondido, sem Lenis
//
// Sai com 1 se qualquer coisa falhar. Capturas em tools/shots/.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.join(RAIZ, 'tools', 'shots');
mkdirSync(SHOTS, { recursive: true });

/**
 * As rotas publicadas.
 *
 * `/painel/` e `/painel/artigo/` ficam de fora: exigem sessão e não são
 * site público. `/previa` fica de fora porque não é versionada nem vai
 * para produção. As páginas de artigo entram dinamicamente, lidas de
 * `/textos/` — assim o verificador cobre o blog quando há banco, e não
 * reclama quando não há.
 */
const ROTAS_FIXAS = [
  '/',
  '/areas/',
  '/areas/planejamento-patrimonial-e-sucessorio/',
  '/areas/direito-digital/',
  '/escritorio/',
  '/contato/',
  '/textos/',
  '/politica-de-privacidade/',
  '/politica-de-cookies/',
];

const TELAS = [
  ['desktop', { width: 1440, height: 900 }],
  ['celular', { width: 390, height: 844 }],
];

const falhas = [];
const checa = (cond, msg) => {
  if (!cond) falhas.push(msg);
};

const nav = await chromium.launch();

/* ── descobre as páginas de artigo, se houver ─────────────────────────── */
let rotas = [...ROTAS_FIXAS];
{
  const pg = await nav.newPage();
  try {
    await pg.goto(BASE + '/textos/', { waitUntil: 'load', timeout: 15000 });
    const artigos = await pg.evaluate(() =>
      [...document.querySelectorAll('a[href^="/textos/"]')]
        .map((a) => new URL(a.href).pathname)
        .filter((p) => p !== '/textos/'),
    );
    rotas = [...rotas, ...[...new Set(artigos)].slice(0, 3)];
  } catch (e) {
    console.error(`Não consegui alcançar ${BASE}. O dev server está no ar?\n  ${e.message}`);
    await nav.close();
    process.exit(1);
  }
  await pg.close();
}

console.log(`Verificando ${rotas.length} rotas em ${BASE}\n`);

/* ── coleta de links, para a checagem de links quebrados no fim ───────── */
const linksInternos = new Map(); // href -> rota onde apareceu

/* ── a varredura principal ────────────────────────────────────────────── */
for (const rota of rotas) {
  for (const [tela, vp] of TELAS) {
    const ctx = await nav.newContext({ viewport: vp });
    const pg = await ctx.newPage();
    const problemas = [];
    pg.on('pageerror', (e) => problemas.push('erro de página: ' + e.message));
    pg.on('console', (m) => {
      if (m.type() === 'error') problemas.push('console: ' + m.text());
    });

    const resp = await pg.goto(BASE + rota, { waitUntil: 'load' });
    checa(resp?.status() === 200, `${rota} ${tela}: status ${resp?.status()}`);
    await pg.waitForTimeout(1200);

    const onde = `${rota} ${tela}`;
    checa(problemas.length === 0, `${onde}: ${problemas.join(' | ')}`);

    /* rolagem horizontal */
    const sobra = await pg.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    checa(sobra <= 1, `${onde}: rolagem horizontal (+${sobra}px)`);

    /* corpo de texto */
    const corpo = await pg.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
    checa(corpo >= 18, `${onde}: corpo de texto ${corpo}px, mínimo 18`);

    /* alvos de toque: 44px nas DUAS dimensões.
       Duas exceções, e só duas:
       - link dentro de texto corrido, que não dá para engordar sem quebrar
         a linha;
       - campo fora da ordem de tabulação (`tabindex="-1"`), que são as
         iscas anti-spam de `~/lib/antispam`: invisíveis de propósito, e
         que ninguém toca. */
    const baixos = await pg.evaluate(() =>
      [...document.querySelectorAll('a[href], button, summary, select, input:not([type=hidden])')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return false;
          if (e.getAttribute('tabindex') === '-1') return false;
          if (e.closest('p, li, .corpo, .bio, .artigo-corpo, .recado')) return false;
          return r.height < 43.5 || r.width < 43.5;
        })
        .map((e) => {
          const r = e.getBoundingClientRect();
          const t = (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 26);
          return `${t} [${Math.round(r.width)}x${Math.round(r.height)}]`;
        }),
    );
    checa(baixos.length === 0, `${onde}: alvos abaixo de 44px: ${baixos.join(', ')}`);

    /* só o desktop faz as checagens que não dependem de largura */
    if (tela === 'desktop') {
      /* <title> e meta description */
      const meta = await pg.evaluate(() => ({
        titulo: document.title,
        descricao: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      }));
      checa(meta.titulo.length > 0, `${rota}: sem <title>`);
      /* 70 é o corte prático do Google. A cobrança é sobre o que o site
         ACRESCENTA ao título: um artigo cujo próprio título já passa de 70
         é decisão de quem escreveu, e cortá-lo seria pior do que exibi-lo
         inteiro — o que se exige é que o sufixo do escritório não seja o
         que estoura a conta. */
      const soTitulo = meta.titulo.split(' | ')[0];
      checa(
        meta.titulo.length <= 70 || soTitulo.length > 70,
        `${rota}: <title> com ${meta.titulo.length} caracteres (máx 70) — o sufixo é que estourou`,
      );
      checa(meta.descricao.length > 0, `${rota}: sem meta description`);
      checa(
        meta.descricao.length <= 200,
        `${rota}: meta description com ${meta.descricao.length} caracteres (máx 200)`,
      );
      checa(meta.h1.length === 1, `${rota}: ${meta.h1.length} <h1> (deve ser 1)`);

      /* Hierarquia de títulos: nenhum degrau pulado.
         O rodapé fica de fora: os `<h4>` dele ("Navegar", "Falar") rotulam
         blocos de navegação que se repetem em toda página, e não são passos
         do sumário do documento. Medir a hierarquia com eles dentro
         acusaria h2→h4 em todas as rotas, sempre pelo mesmo motivo. */
      const degrau = await pg.evaluate(() => {
        const niveis = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
          .filter((h) => !h.closest('footer, .rodape, .pe'))
          .map((h) => Number(h.tagName[1]));
        for (let i = 1; i < niveis.length; i++) {
          if (niveis[i] - niveis[i - 1] > 1) return `h${niveis[i - 1]} seguido de h${niveis[i]}`;
        }
        return null;
      });
      checa(!degrau, `${rota}: degrau de título pulado (${degrau})`);

      /* imagem sem alt */
      const semAlt = await pg.evaluate(() =>
        [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null).length,
      );
      checa(semAlt === 0, `${rota}: ${semAlt} imagens sem atributo alt`);

      /* guarda os links internos para conferir depois */
      const hrefs = await pg.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map((a) => a.getAttribute('href'))
          .filter((h) => h && !/^(https?:|mailto:|tel:|#)/.test(h)),
      );
      for (const h of hrefs) if (!linksInternos.has(h)) linksInternos.set(h, rota);

      /* capturas */
      const nome = rota === '/' ? 'home' : rota.replace(/^\/|\/$/g, '').replace(/\//g, '-');
      await pg.evaluate(() => {
        document.querySelectorAll('.sobe').forEach((n) => n.classList.add('visivel'));
        document.querySelectorAll('.revela').forEach((n) => n.classList.add('aberta'));
      });
      await pg.waitForTimeout(250);
      await pg.screenshot({ path: path.join(SHOTS, `${nome}.png`), fullPage: false });
    }

    await ctx.close();
  }

  /* ── sem JavaScript: a rota tem que continuar servindo ───────────────── */
  {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const pg = await ctx.newPage();
    const resp = await pg.goto(BASE + rota, { waitUntil: 'load' });
    checa(resp?.status() === 200, `${rota} sem-JS: status ${resp?.status()}`);

    const estado = await pg.evaluate(() => ({
      escondidos: [...document.querySelectorAll('.sobe, .display, .revela')].filter(
        (n) => Number(getComputedStyle(n).opacity) < 0.5,
      ).length,
      h1: document.querySelectorAll('h1').length,
      sobra: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    checa(estado.escondidos === 0, `${rota} sem-JS: ${estado.escondidos} elementos invisíveis`);
    checa(estado.h1 === 1, `${rota} sem-JS: ${estado.h1} <h1>`);
    checa(estado.sobra <= 1, `${rota} sem-JS: rolagem horizontal (+${estado.sobra}px)`);
    await ctx.close();
  }

  /* ── reduced-motion ──────────────────────────────────────────────────── */
  {
    const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    const baixados = [];
    pg.on('request', (r) => baixados.push(r.url()));
    await pg.goto(BASE + rota, { waitUntil: 'load' });
    await pg.waitForTimeout(1400);

    const estado = await pg.evaluate(() => ({
      lenis: document.documentElement.classList.contains('lenis'),
      escondidos: [...document.querySelectorAll('.sobe, .revela')].filter(
        (n) => Number(getComputedStyle(n).opacity) < 0.5,
      ).length,
      /* o que importa é não haver vídeo TOCANDO */
      tocando: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
      animando: [...document.querySelectorAll('.pular, .botao, .sobe')].filter((e) => {
        const cs = getComputedStyle(e);
        return cs.transitionDuration !== '0s' || cs.animationDuration !== '0s';
      }).length,
    }));
    checa(!estado.lenis, `${rota} calmo: Lenis ligado`);
    checa(estado.escondidos === 0, `${rota} calmo: ${estado.escondidos} elementos escondidos`);
    checa(estado.tocando === 0, `${rota} calmo: ${estado.tocando} vídeos tocando`);
    checa(estado.animando === 0, `${rota} calmo: ${estado.animando} elementos ainda com transição`);

    const pesados = baixados.filter((u) => /gsap|lenis|ScrollTrigger/i.test(u));
    checa(
      pesados.length === 0,
      `${rota} calmo: baixou biblioteca de movimento (${pesados.map((u) => u.split('/').pop()).join(', ')})`,
    );
    await ctx.close();
  }

  process.stdout.write(`  ${rota}\n`);
}

/* ── links internos quebrados ─────────────────────────────────────────── */
{
  const pg = await nav.newPage();
  for (const [href, origem] of linksInternos) {
    const alvo = new URL(href, BASE).toString();
    try {
      const r = await pg.request.fetch(alvo, { method: 'GET', maxRedirects: 3 });
      checa(r.status() < 400, `link quebrado: ${href} (em ${origem}) -> ${r.status()}`);
    } catch (e) {
      checa(false, `link quebrado: ${href} (em ${origem}) -> ${e.message}`);
    }
  }
  console.log(`\n  ${linksInternos.size} links internos conferidos`);
  await pg.close();
}

await nav.close();

if (falhas.length) {
  console.error(`\nFALHOU (${falhas.length})\n  ` + falhas.join('\n  '));
  process.exit(1);
}
console.log('\nOK: todas as rotas passaram. Capturas em tools/shots/');
