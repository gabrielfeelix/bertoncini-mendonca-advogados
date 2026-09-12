// tools/verifica.mjs
// Abre o protótipo em dois tamanhos e checa o que não pode quebrar.
// Sai com 1 se algo falhar. Capturas em tools/shots/ para revisão visual.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const URL = "file://" + path.join(RAIZ, "prototipo", "index.html");
const SHOTS = path.join(RAIZ, "tools", "shots");
mkdirSync(SHOTS, { recursive: true });

const SECOES = ["hero","areas","socios","metodo","publicacoes","perguntas","contato","rodape"];
const falhas = [];
function checa(cond, msg){ if (!cond) falhas.push(msg); }

const nav = await chromium.launch();

for (const [nome, vp] of [["desktop",{width:1440,height:900}],["celular",{width:390,height:844}]]){
  const pg = await nav.newPage({ viewport: vp });
  const erros = [];
  pg.on("pageerror", e => erros.push(e.message));
  pg.on("console", m => { if (m.type() === "error") erros.push(m.text()); });
  await pg.goto(URL, { waitUntil: "load" });
  await pg.waitForTimeout(1600);

  checa(erros.length === 0, `${nome}: erros de console: ${erros.join(" | ")}`);

  const largo = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  checa(!largo, `${nome}: rolagem horizontal`);

  for (const id of SECOES){
    const ok = await pg.locator("#" + id).count();
    checa(ok === 1, `${nome}: falta #${id}`);
  }

  const corpo = await pg.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  checa(corpo >= 18, `${nome}: corpo de texto ${corpo}px, mínimo 18`);

  // alvos de toque: todo link e botão visível com pelo menos 44px de altura
  const baixos = await pg.evaluate(() =>
    [...document.querySelectorAll("a,button")]
      .filter(e => e.offsetParent && e.getBoundingClientRect().height < 44 && e.getBoundingClientRect().height > 0)
      .filter(e => !e.closest(".rodape") && !e.closest(".pe"))   // links de texto corrido ficam de fora
      .map(e => (e.textContent || e.getAttribute("aria-label") || "?").trim().slice(0,30)));
  checa(baixos.length === 0, `${nome}: alvos abaixo de 44px: ${baixos.join(", ")}`);

  // capturas em fatias
  const alt = await pg.evaluate(() => document.documentElement.scrollHeight);
  await pg.evaluate(() => document.querySelectorAll(".sobe").forEach(n => n.classList.add("visivel")));
  const n = Math.min(12, Math.ceil(alt / vp.height));
  for (let i = 0; i < n; i++){
    await pg.evaluate(y => scrollTo(0, y), i * vp.height);
    await pg.waitForTimeout(350);
    await pg.screenshot({ path: path.join(SHOTS, `${nome}-${String(i).padStart(2,"0")}.png`) });
  }
  await pg.close();
}

// reduced-motion: nada de Lenis, .sobe já visível, vídeo parado
{
  const pg = await nav.newPage({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
  await pg.goto(URL, { waitUntil:"load" });
  await pg.waitForTimeout(800);
  const estado = await pg.evaluate(() => ({
    lenis: document.documentElement.classList.contains("lenis"),
    escondidos: [...document.querySelectorAll(".sobe")].filter(n => getComputedStyle(n).opacity === "0").length,
    entrada: (function(){ var e = document.querySelector(".entrada"); return !!e && getComputedStyle(e).display !== "none"; })(),
    video: [...document.querySelectorAll("video[autoplay]")].some(v => !v.paused)
  }));
  checa(!estado.lenis, "reduced-motion: Lenis ligado");
  checa(estado.escondidos === 0, `reduced-motion: ${estado.escondidos} elementos .sobe escondidos`);
  checa(!estado.entrada, "reduced-motion: entrada da página apareceu");
  checa(!estado.video, "reduced-motion: vídeo em autoplay tocando");
  await pg.close();
}

// sem JS: tudo visível
{
  const ctx = await nav.newContext({ javaScriptEnabled:false, viewport:{width:1440,height:900} });
  const pg = await ctx.newPage();
  await pg.goto(URL, { waitUntil: "load" });
  const escondidos = await pg.evaluate(() =>
    [...document.querySelectorAll(".sobe,.display")].filter(n => getComputedStyle(n).opacity === "0").length);
  checa(escondidos === 0, `sem JS: ${escondidos} elementos escondidos`);
  await ctx.close();
}

await nav.close();

if (falhas.length){
  console.error("FALHOU\n  " + falhas.join("\n  "));
  process.exit(1);
}
console.log("OK: capturas em tools/shots/");
