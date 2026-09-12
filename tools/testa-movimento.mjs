// Testes da camada de movimento (Tarefa 5).
//
// Rode com o dev server no ar:  npm run dev  e, noutro terminal,
//   node tools/testa-movimento.mjs
//
// Cobre o que o handoff listava como pendência verificada:
//  1. sob prefers-reduced-motion o vídeo do hero fica PAUSADO, não só com
//     o botão escondido;
//  2. o kill-switch desliga transição em .pular, .botao e .sobe;
//  3. GSAP e Lenis não são nem baixados nesse modo;
//  4. "Pular para o conteúdo" MOVE O FOCO, nos dois modos — o defeito que
//     já voltou duas vezes nesta migração.
import { chromium } from 'playwright';

const nav = await chromium.launch();
const falhas = [];
const nota = (m) => falhas.push(m);

// ── 1. COM reduced-motion: o vídeo tem que estar PAUSADO ──
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const pg = await ctx.newPage();
  const baixados = [];
  pg.on('request', (r) => baixados.push(r.url()));
  await pg.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(2500);

  const v = await pg.evaluate(() => {
    const f = document.querySelector('.hero .filme');
    if (!f) return null;
    return { pausado: f.paused, autoplay: f.hasAttribute('autoplay'), tempo: f.currentTime };
  });
  if (!v) nota('calmo: não achei o vídeo do hero');
  else {
    if (!v.pausado) nota('calmo: o vídeo do hero NÃO está pausado');
    if (v.autoplay) nota('calmo: o atributo autoplay continua no vídeo');
  }

  // botão de pausa escondido
  const botaoVisivel = await pg.locator('#pausa').isVisible().catch(() => false);
  if (botaoVisivel) nota('calmo: o botão de pausa continua visível com o vídeo parado');

  // kill-switch: nada de transição/animação
  const transicoes = await pg.evaluate(() => {
    const alvos = ['.pular', '.botao', '.sobe'];
    const out = [];
    for (const s of alvos) {
      const el = document.querySelector(s);
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.transitionDuration !== '0s' || cs.animationDuration !== '0s') {
        out.push(`${s}: transition=${cs.transitionDuration} animation=${cs.animationDuration}`);
      }
    }
    return out;
  });
  for (const t of transicoes) nota('calmo: ainda anima -> ' + t);

  // conteúdo visível mesmo sem reveals
  const invisiveis = await pg.evaluate(() =>
    [...document.querySelectorAll('.sobe')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9).length,
  );
  if (invisiveis) nota(`calmo: ${invisiveis} elementos .sobe ficaram invisíveis`);

  // gsap/lenis não podem nem ter sido baixados
  const pesados = baixados.filter((u) => /gsap|lenis|ScrollTrigger/i.test(u));
  if (pesados.length) nota('calmo: baixou biblioteca de movimento: ' + pesados.map((u) => u.split('/').pop()).join(', '));

  await ctx.close();
}

// ── 2. SEM reduced-motion: o movimento funciona ──
{
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  const erros = [];
  pg.on('pageerror', (e) => erros.push(e.message));
  await pg.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(3000);

  const v = await pg.evaluate(() => {
    const f = document.querySelector('.hero .filme');
    return f ? { pausado: f.paused } : null;
  });
  if (v && v.pausado) nota('normal: o vídeo do hero não está tocando');

  const temJs = await pg.evaluate(() => document.documentElement.classList.contains('js'));
  if (!temJs) nota('normal: a classe .js não foi aplicada');

  /* Antes de rolar, nada deve ter revelado: é o comportamento certo, o
     reveal acontece na aproximação. Rola de verdade para conferir. */
  const antes = await pg.evaluate(() => document.querySelectorAll('.sobe.visivel').length);
  if (antes > 0) nota(`normal: ${antes} .sobe já revelaram sem rolagem nenhuma`);
  for (let i = 0; i < 6; i++) { await pg.mouse.wheel(0, 900); await pg.waitForTimeout(650); }
  const depois = await pg.evaluate(() => document.querySelectorAll('.sobe.visivel').length);
  if (!depois) nota('normal: nenhum .sobe revelou depois de rolar');
  /* O fade dura .8s; espera ele terminar antes de medir, senão o que se
     mede é a animação em curso, não o estado final. */
  await pg.waitForTimeout(1600);
  const opacosDepois = await pg.evaluate(() =>
    [...document.querySelectorAll('.sobe.visivel')].filter((e) => Number(getComputedStyle(e).opacity) < 0.9).length);
  if (opacosDepois) nota(`normal: ${opacosDepois} .sobe revelados continuam transparentes depois do fade`);

  if (erros.length) nota('normal: erros de JS -> ' + erros.join(' | '));
  await ctx.close();
}

// ── 3. O LINK DE PULAR MOVE O FOCO? (o defeito que voltou duas vezes) ──
for (const [nome, opts] of [['normal', {}], ['calmo', { reducedMotion: 'reduce' }]]) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await pg.waitForTimeout(2200);

  await pg.keyboard.press('Tab'); // chega no .pular
  const focoAntes = await pg.evaluate(() => document.activeElement?.className || '');
  if (!focoAntes.includes('pular')) { nota(`${nome}: o primeiro Tab não foi para .pular (foi para "${focoAntes}")`); await ctx.close(); continue; }

  await pg.keyboard.press('Enter');
  await pg.waitForTimeout(1400);

  const depois = await pg.evaluate(() => {
    const a = document.activeElement;
    return { id: a?.id || '', tag: a?.tagName || '', classe: a?.className || '' };
  });
  if (depois.id !== 'conteudo') {
    nota(`${nome}: PULAR NÃO MOVEU O FOCO — foco ficou em <${depois.tag} id="${depois.id}" class="${depois.classe}">`);
  }
  await ctx.close();
}

await nav.close();
console.log(falhas.length ? 'FALHAS:\n' + falhas.map((f) => '  ' + f).join('\n') : 'OK: movimento passou nos dois modos');
if (falhas.length) process.exit(1);
