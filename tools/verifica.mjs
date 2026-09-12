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
//  8. contraste AA (4.5:1, ou 3:1 em texto grande) — só onde o fundo é
//     cor sólida; texto sobre imagem/vídeo/degradê não é medível daqui
//  9. a OAB visível e no piso da rota (19px na home, 22px em /escritorio/)
// 10. links quebrados (internos, resolvidos de verdade por requisição)
// 11. a página funciona com JavaScript desligado
// 12. reduced-motion: vídeo pausado, nada escondido, sem Lenis
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

      /* ── contraste AA ────────────────────────────────────────────────
         O público tem 70 anos: contraste é requisito, não estética. A
         norma (WCAG 2.1, 1.4.3) pede 4.5:1 para texto normal e 3:1 para
         texto grande (>=24px, ou >=18.66px em negrito).

         O que NÃO dá para medir daqui, e por isso é ignorado de propósito:
         texto sobre imagem, vídeo ou degradê. `getComputedStyle` devolve
         a cor declarada do elemento, não o pixel que está atrás dele —
         medir isso exigiria ler o canvas, e um falso negativo num gate
         que ninguém confia é pior do que uma lacuna declarada. Por isso
         só entram elementos cuja pilha de fundo termina numa cor opaca
         sólida.

         `--imperial` (#9B1C2E) sobre branco dá 8.6:1, e é a cor da OAB:
         essa combinação precisa continuar passando depois do redesenho. */
      const ruins = await pg.evaluate(() => {
        const canal = (c) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
        const rgb = (s) => {
          const m = s.match(/rgba?\(([^)]+)\)/);
          if (!m) return null;
          const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
          return { cor: p.slice(0, 3), alfa: p.length > 3 ? p[3] : 1 };
        };
        /* sobe a árvore até achar um fundo opaco; devolve null se algum
           ancestral tiver imagem/degradê (aí a medida não é confiável) */
        const fundoDe = (el) => {
          for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
            const f = rgb(cs.backgroundColor);
            if (f && f.alfa === 1) return f.cor;
          }
          const cs = getComputedStyle(document.documentElement);
          if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
          const f = rgb(cs.backgroundColor);
          return f && f.alfa === 1 ? f.cor : [255, 255, 255];
        };

        const achados = [];
        for (const el of document.querySelectorAll(
          'p, li, a, span, h1, h2, h3, h4, h5, h6, dt, dd, button, label, summary, figcaption, strong, em, small, td, th',
        )) {
          /* só quem tem texto próprio e está visível */
          const texto = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent.trim())
            .join('')
            .trim();
          if (!texto) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.95) continue;

          const frente = rgb(cs.color);
          const atras = fundoDe(el);
          if (!frente || !atras || frente.alfa < 1) continue;

          const a = lum(frente.cor) + 0.05;
          const b = lum(atras) + 0.05;
          const razao = a > b ? a / b : b / a;

          const px = parseFloat(cs.fontSize);
          const negrito = Number(cs.fontWeight) >= 700;
          const grande = px >= 24 || (negrito && px >= 18.66);
          const exigido = grande ? 3 : 4.5;

          if (razao < exigido - 0.05) {
            achados.push(
              `"${texto.slice(0, 24)}" ${razao.toFixed(2)}:1 (mín ${exigido}, ${px}px)`,
            );
          }
        }
        return [...new Set(achados)].slice(0, 8);
      });
      checa(ruins.length === 0, `${rota}: contraste abaixo de AA: ${ruins.join(' | ')}`);

      /* ── a OAB visível e legível ─────────────────────────────────────
         É a tese do projeto e é exigência do Provimento 205/2021, art. 3º:
         a inscrição de cada sócio tem de estar visível. O levantamento de
         44 escritórios não achou UM que a exibisse.

         Por que um piso por rota: na home ela é 19px e em /escritorio/ é
         22px, porque lá é a página de quem foi conferir quem somos. Já
         houve uma regressão de especificidade que derrubou a do escritório
         para 19px (ver Socios.astro, nota sobre `.par .oab.grande`) — foi
         achada medindo no navegador, que é o que esta checagem passa a
         fazer sozinha.

         O redesenho vai mexer no layout das duas páginas. Este é o ponto
         que não pode encolher no caminho. */
      const PISO_OAB = { '/': 19, '/escritorio/': 22 };
      if (PISO_OAB[rota]) {
        const oabs = await pg.evaluate(() =>
          [...document.querySelectorAll('.oab-numero')].map((n) => {
            const cs = getComputedStyle(n);
            const r = n.getBoundingClientRect();
            return {
              px: parseFloat(cs.fontSize),
              texto: (n.textContent || '').trim().slice(0, 30),
              visivel:
                r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.5,
            };
          }),
        );
        checa(oabs.length >= 2, `${rota}: ${oabs.length} inscrições na OAB exibidas (esperado 2)`);
        for (const o of oabs) {
          checa(o.visivel, `${rota}: OAB "${o.texto}" não está visível`);
          checa(
            o.px >= PISO_OAB[rota],
            `${rota}: OAB "${o.texto}" em ${o.px}px, mínimo ${PISO_OAB[rota]}`,
          );
        }
      }

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
