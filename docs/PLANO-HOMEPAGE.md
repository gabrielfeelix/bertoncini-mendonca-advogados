# Homepage: plano de execução do que falta

> **Para o agente que executa:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para implementar tarefa por tarefa. Os passos usam checkbox (`- [ ]`) para acompanhamento.

**Objetivo:** levar `prototipo/index.html` de protótipo bom a homepage de nível Awwwards, sem quebrar a regra de usabilidade do projeto: tudo funciona sem JavaScript, sem animação e para quem tem 70 anos.

**Arquitetura:** um arquivo HTML com CSS e JS embutidos, como já está. Sem framework, sem build. Bibliotecas (GSAP, Lenis) entram vendorizadas em `prototipo/vendor/`, nunca por CDN. Fontes em `prototipo/fonts/`. Cada seção nova segue os arquétipos que já existem no arquivo: `.secao` + `.env` para faixa branca, `.lastro` + `.grao` + `clip-path` para chapa azul.

**Stack:** HTML, CSS, JS vanilla. GSAP 3 + ScrollTrigger e Lenis, ambos como camada opcional. Playwright para verificação.

**Spec:** este documento é a spec e o plano. A direção de design está em `docs/DECISOES.md`; a voz em `/home/gabfelix/dev/portfolio/docs/VOZ.md`; as regras da OAB em `docs/PESQUISA.md` §1.

---

## Leia antes, nesta ordem

1. `docs/DECISOES.md` inteiro. É a direção de design e tem as regras que este plano não repete.
2. `docs/CONTEXTO-CLIENTE.md` §6 (como o Gabriel trabalha) e `/home/gabfelix/dev/portfolio/docs/VOZ.md`. Toda linha de texto que você escrever passa por essa régua.
3. `docs/PESQUISA.md` §1 (OAB) e §4 (conversão).
4. `prototipo/index.html` inteiro, uma vez, antes de tocar em qualquer coisa.

## Restrições globais

Valem em toda tarefa. Copiadas dos documentos acima.

- **Progressive enhancement.** A página é legível e clicável com JS desligado. Nenhum efeito carrega informação nem bloqueia acesso. Conteúdo e ação funcionam sem animação.
- **`prefers-reduced-motion: reduce` desliga todo movimento**, inclusive Lenis, GSAP, parallax, autoplay de vídeo e a entrada da página.
- **Nada de scroll-jacking**, rolagem horizontal narrativa, ou seção que só revela conteúdo depois de animar. Sticky por CSS pode; pin do GSAP não.
- **Corpo de texto a partir de 18px**, alvo de toque mínimo de 44px, contraste AA.
- **Cores.** Branco `#FFFFFF` como base. `#0B1E3F` para chapa azul, CTA e âncora. `#004369` hover. `#517493` texto secundário. `#E3E6EA` bordas. `#9B1C2E` (`--imperial`) só em ponto de ação e foco. **O off-white `#F8F7F2` saiu do site.**
- **Textura** (`filter:url(#grao)`) só sobre azul escuro. Nunca sobre branco.
- **Diagonal** por `clip-path` na faixa, texto em contêiner reto. A diagonal nunca corta texto, botão ou rosto.
- **Tipografia.** Newsreader (display, pesos 200 e 300, itálico) e Archivo (corpo, 400 a 600). Self-hosted em woff2. Playfair e Montserrat são proibidas.
- **Registro de linguagem:** primeira pessoa do plural, formal no registro, simples no vocabulário. "A gente" não existe no site. Nome do sócio no site é **Juscelino** (o apelido "Jus" é só da conversa com o cliente).
- **Voz** (VOZ.md): sujeito, verbo, predicado. Alguém dentro da frase. Substantivo concreto. A frase termina quando a informação termina; se o fim do parágrafo arremata, corte. Descreva o que o escritório faz, não anuncie virtude.
- **Sem travessão** em nenhum texto visível. Use ponto, vírgula ou dois-pontos.
- **OAB, Provimento 205/2021.** Proibido: depoimento de cliente, caso de sucesso, número de processos ou de clientes, "consulta gratuita", "especialista" sem título, "o melhor", "líder", "referência", qualquer urgência ("agende já", "não perca"), promessa de resultado, menção a tamanho ou estrutura do escritório. Obrigatório: número da OAB de cada sócio e registro da sociedade no rodapé.
- **Placeholders continuam marcados.** OAB, CNPJ, telefone, e-mail, bio da Beatriz, terceira e quarta área, textos do blog e o compromisso de prazo de resposta dependem do briefing. Todo placeholder leva `data-placeholder="1"` no elemento e continua em `--imperial` onde já está assim. Nunca invente o dado real.
- **Um arquivo.** O trabalho acontece em `prototipo/index.html`. Não crie build, não crie subpasta de componentes, não converta para Astro. Isso vem depois, em outro plano.
- **Commit por tarefa, na `main`, sem push e sem deploy.** Mensagem em português, no formato do histórico (`feat:`, `style:`, `fix:`), corpo explicando o porquê. Termine com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## A página como ela deve ficar

Ordem final das seções, com o ritmo de fundo. Branco e azul se alternam; a página abre e fecha em azul.

| # | Seção | Fundo | Estado | O que carrega |
|---|---|---|---|---|
| 1 | Entrada | azul | **nova** | Monograma sobre chapa texturizada, menos de um segundo, uma vez por sessão |
| 2 | Hero | vídeo + azul | existe | Promessa em uma frase, os dois nomes, CTA WhatsApp |
| 3 | Declaração | branco | existe, ganha reveal | O medo de quem procura advogado e o que o escritório faz com isso |
| 4 | Áreas de atuação | azul, diagonal | existe, ganha subtemas | Quatro áreas, cada uma com os assuntos que a pessoa de fato busca |
| 5 | Sócios | branco | existe, ganha reveal | Retrato, nome, OAB, uma frase de bio |
| 6 | Faixa "quem atende" | vídeo + azul, diagonal | existe | A promessa de contato direto |
| 7 | Como trabalhamos | branco | **nova** | Os quatro passos do primeiro contato até o caso andar, mais três compromissos de processo. É o substituto legítimo do depoimento de cliente, que a OAB veda |
| 8 | Em português claro | branco | existe, ganha hover | Quatro textos do blog |
| 9 | Newsletter | azul, diagonal | existe | Um texto por mês |
| 10 | Perguntas | branco | existe | Cinco perguntas em `details` |
| 11 | Contato | branco | existe | WhatsApp com mensagem pronta, horário, dados |
| 12 | Rodapé | azul, textura | **refazer** | Registro OAB e CNPJ, navegação, política de privacidade, crédito |
| — | Aviso de cookies | flutuante | **novo** | Três opções, sem bloquear a página |

O que muda de sensação, tarefa por tarefa: a página passa a ter uma entrada, rola com inércia, os títulos grandes chegam palavra a palavra, as fotos se revelam de baixo para cima, os botões puxam levemente o cursor, e a seção de método dá à pessoa o que ela mais quer saber antes de mandar mensagem: o que vai acontecer com ela.

---

## Padrões do arquivo que você vai reutilizar

Estão em `prototipo/index.html`. Não reinvente.

```css
.env      /* max-width:1340px, padding-inline:var(--gutter) */
.secao    /* padding-block:var(--bloco) */
.display  /* Newsreader 200, line-height 1.02, tracking -.03em */
.sobe     /* opacity 0 + translateY(20px); vira .visivel pelo IntersectionObserver */
.botao    /* pílula azul com .disco (círculo com seta) */
.lastro   /* gradiente azul de fundo, inset negativo, usado com .grao */
.grao     /* <div class="grao" style="filter:url(#grao)"> sobre chapa azul */
```

Diagonal, copiada de `.areas`:

```css
clip-path:polygon(0 3.6vw,100% 0,100% 100%,0 calc(100% - 3.6vw));
```

O JS marca `html.js` na primeira linha. Tudo que depende de JS fica atrás de `.js` no CSS, e o estado sem JS é o estado final e visível.

`var calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;` já existe. Toda camada de movimento nova checa `calmo` e desliga.

---

### Tarefa 1: Verificação automatizada

Antes de mudar qualquer coisa, um script que diz se a página quebrou. Todas as tarefas seguintes rodam este script no fim.

**Arquivos:**
- Criar: `package.json` (raiz do repositório)
- Criar: `tools/verifica.mjs`
- Modificar: `.gitignore`

**Produz:** o comando `node tools/verifica.mjs`, que sai com código 0 quando passa e 1 quando falha, e grava capturas em `tools/shots/`.

- [ ] **Passo 1: package.json e dependências**

```json
{
  "name": "bertoncini-mendonca-advogados",
  "private": true,
  "type": "module",
  "scripts": {
    "verifica": "node tools/verifica.mjs"
  },
  "devDependencies": {
    "playwright": "^1.47.0"
  }
}
```

Rodar: `npm install`
O navegador do Playwright já existe na máquina (`~/.cache/ms-playwright`, instalado pelo portfólio). Se `verifica.mjs` reclamar de navegador ausente: `npx playwright install chromium`.

- [ ] **Passo 2: .gitignore**

Acrescentar ao `.gitignore` existente:

```
node_modules/
tools/shots/
```

- [ ] **Passo 3: o script**

```js
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
  await pg.goto(URL, { waitUntil:"load" });
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
```

- [ ] **Passo 4: rodar e ver falhar**

Rodar: `node tools/verifica.mjs`
Esperado: `FALHOU` com `falta #metodo` e `falta #rodape` nos dois tamanhos (a seção de método ainda não existe e o `<footer>` não tem id).

Se aparecer `alvos abaixo de 44px` com os links do menu (Áreas, Sócios, Textos, Perguntas), corrija aqui mesmo: em `.centro a` acrescente `min-height:44px;display:inline-flex;align-items:center`. Qualquer outra falha é problema pré-existente do protótipo: anote e corrija na tarefa correspondente, não aqui.

- [ ] **Passo 5: dar id ao rodapé**

Em `prototipo/index.html`, trocar `<footer class="rodape">` por `<footer class="rodape" id="rodape">`.

Rodar: `node tools/verifica.mjs`
Esperado: só `falta #metodo`.

- [ ] **Passo 6: commit**

```bash
git add package.json package-lock.json tools/verifica.mjs .gitignore prototipo/index.html
git commit -m "chore: verificação automatizada do protótipo

Abre a página em desktop e celular, checa erros de console, rolagem
horizontal, presença das seções, corpo de texto e alvo de toque, e
grava capturas. Testa também reduced-motion e a página sem JS, que
são as duas regras de usabilidade do projeto.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 2: Fontes self-hosted

`docs/DECISOES.md` pede woff2 local. O protótipo ainda carrega do Google Fonts.

**Arquivos:**
- Criar: `prototipo/fonts/` (woff2)
- Modificar: `prototipo/index.html` linhas 7 a 9 (`<link>` do Google) e o bloco `:root`

- [ ] **Passo 1: baixar**

Newsreader é variável (peso e eixo óptico). Archivo também. O helper abaixo entrega instâncias estáticas em woff2, que bastam para o protótipo.

```bash
mkdir -p prototipo/fonts && cd prototipo/fonts
curl -sL "https://gwfh.mranftl.com/api/fonts/newsreader?download=zip&subsets=latin,latin-ext&formats=woff2&variants=200,300,400,200italic,300italic" -o nr.zip
curl -sL "https://gwfh.mranftl.com/api/fonts/archivo?download=zip&subsets=latin,latin-ext&formats=woff2&variants=regular,500,600" -o ar.zip
unzip -o -q nr.zip && unzip -o -q ar.zip && rm nr.zip ar.zip
ls
```

Esperado: arquivos como `newsreader-v*-latin_latin-ext-200.woff2`, `...-200italic.woff2`, `...-300.woff2`, `...-300italic.woff2`, `...-regular.woff2`, e `archivo-v*-latin_latin-ext-regular.woff2`, `...-500.woff2`, `...-600.woff2`.

Se o helper estiver fora do ar: `npm i -D @fontsource/newsreader @fontsource/archivo` e copiar os `.woff2` de `node_modules/@fontsource/*/files/` que tenham `latin` e os pesos acima no nome. Renomeie para o padrão abaixo.

- [ ] **Passo 2: renomear para nomes estáveis**

```bash
cd prototipo/fonts
for f in newsreader-*-200.woff2; do mv "$f" newsreader-200.woff2; done
for f in newsreader-*-200italic.woff2; do mv "$f" newsreader-200i.woff2; done
for f in newsreader-*-300.woff2; do mv "$f" newsreader-300.woff2; done
for f in newsreader-*-300italic.woff2; do mv "$f" newsreader-300i.woff2; done
for f in newsreader-*-regular.woff2; do mv "$f" newsreader-400.woff2; done
for f in archivo-*-regular.woff2; do mv "$f" archivo-400.woff2; done
for f in archivo-*-500.woff2; do mv "$f" archivo-500.woff2; done
for f in archivo-*-600.woff2; do mv "$f" archivo-600.woff2; done
ls
```

- [ ] **Passo 3: trocar o `<link>` por `@font-face`**

Remover as três linhas do Google Fonts (`preconnect` ×2 e o `<link href="https://fonts.googleapis.com/...">`). No lugar, dentro do `<head>` antes do `<style>`:

```html
<link rel="preload" href="fonts/newsreader-200.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/archivo-400.woff2" as="font" type="font/woff2" crossorigin>
```

E no topo do `<style>`, antes de `:root`:

```css
@font-face{font-family:"Newsreader";font-weight:200;font-style:normal;font-display:swap;src:url("fonts/newsreader-200.woff2") format("woff2")}
@font-face{font-family:"Newsreader";font-weight:200;font-style:italic;font-display:swap;src:url("fonts/newsreader-200i.woff2") format("woff2")}
@font-face{font-family:"Newsreader";font-weight:300;font-style:normal;font-display:swap;src:url("fonts/newsreader-300.woff2") format("woff2")}
@font-face{font-family:"Newsreader";font-weight:300;font-style:italic;font-display:swap;src:url("fonts/newsreader-300i.woff2") format("woff2")}
@font-face{font-family:"Newsreader";font-weight:400;font-style:normal;font-display:swap;src:url("fonts/newsreader-400.woff2") format("woff2")}
@font-face{font-family:"Archivo";font-weight:400;font-display:swap;src:url("fonts/archivo-400.woff2") format("woff2")}
@font-face{font-family:"Archivo";font-weight:500;font-display:swap;src:url("fonts/archivo-500.woff2") format("woff2")}
@font-face{font-family:"Archivo";font-weight:600;font-display:swap;src:url("fonts/archivo-600.woff2") format("woff2")}
```

- [ ] **Passo 4: verificar que a fonte carrega de verdade**

Rodar: `node tools/verifica.mjs` e abrir `tools/shots/desktop-00.png`. O hero tem que estar em serifa fina, não em Georgia. Se estiver em Georgia, o caminho do arquivo está errado.

Rodar também: `grep -c "fonts.googleapis" prototipo/index.html`
Esperado: `0`

- [ ] **Passo 5: commit**

```bash
git add prototipo/fonts prototipo/index.html
git commit -m "feat: fontes self-hosted em woff2

Newsreader e Archivo saem do Google Fonts e passam a ser servidas do
próprio site, como a direção de design pede. Preload dos dois pesos
que aparecem na primeira dobra.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 3: Bibliotecas vendorizadas e rolagem suave

Lenis para inércia de rolagem, GSAP + ScrollTrigger para os reveals das tarefas seguintes. Os dois desligam com `calmo`.

**Arquivos:**
- Criar: `prototipo/vendor/gsap.min.js`, `prototipo/vendor/ScrollTrigger.min.js`, `prototipo/vendor/lenis.min.js`
- Modificar: `prototipo/index.html` (final do `<body>`, e o bloco `<script>` existente)

**Produz:** as globais `gsap`, `ScrollTrigger` e `Lenis`, e a função `aoRolar(fn)` descrita no passo 3, que as tarefas 4, 5 e 7 usam.

- [ ] **Passo 1: vendorizar**

```bash
npm i -D gsap@3 lenis@1
mkdir -p prototipo/vendor
cp node_modules/gsap/dist/gsap.min.js prototipo/vendor/
cp node_modules/gsap/dist/ScrollTrigger.min.js prototipo/vendor/
cp node_modules/lenis/dist/lenis.min.js prototipo/vendor/
ls -la prototipo/vendor
```

- [ ] **Passo 2: carregar antes do script da página**

Logo antes do `<script>` existente no fim do `<body>`:

```html
<script src="vendor/gsap.min.js" defer></script>
<script src="vendor/ScrollTrigger.min.js" defer></script>
<script src="vendor/lenis.min.js" defer></script>
```

O `<script>` inline existente roda antes dos `defer`, então as globais ainda não existiriam. Para inverter a ordem, envolva todo o conteúdo dele num listener:

```js
document.addEventListener("DOMContentLoaded", function(){
  /* ...todo o script que já existia, sem mudança... */
});
```

Scripts `defer` executam antes de `DOMContentLoaded`, então as globais já existem quando o código da página roda.

- [ ] **Passo 3: Lenis e o utilitário de rolagem**

No começo do script (dentro do listener), depois de `var calmo = ...`:

```js
/* rolagem suave: inércia leve, desligada para quem pediu menos movimento.
   Lenis usa a rolagem nativa, então âncoras, teclado e leitores de tela
   continuam funcionando; ele só suaviza o caminho. */
var lenis = null;
if (!calmo && window.Lenis){
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
  document.documentElement.classList.add("lenis");
  function tique(t){ lenis.raf(t); requestAnimationFrame(tique); }
  requestAnimationFrame(tique);
  // âncoras do menu passam pelo Lenis para não pular
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var alvo = document.querySelector(a.getAttribute("href"));
      if (!alvo) return;
      e.preventDefault();
      lenis.scrollTo(alvo, { offset: -24, duration: 1.1 });
    });
  });
}

/* GSAP só quando há movimento. `aoRolar(fn)` entrega gsap e ScrollTrigger
   prontos, ou não chama nada. As tarefas seguintes usam isso. */
function aoRolar(fn){
  if (calmo || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  fn(gsap, ScrollTrigger);
}
```

O menu em ilhas já tem um `passo()` que lê `scrollY`; continua valendo, Lenis não muda `scrollY`.

- [ ] **Passo 4: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: só `falta #metodo`. Em especial, a checagem `reduced-motion: Lenis ligado` tem que passar.

Abrir no navegador (`npx playwright open prototipo/index.html` ou pelo VS Code) e rolar com a roda: a rolagem tem que ter inércia curta. Clicar em "Áreas" no menu: rola suave até a seção.

- [ ] **Passo 5: commit**

```bash
git add prototipo/vendor prototipo/index.html package.json package-lock.json
git commit -m "feat: rolagem suave com Lenis e base do GSAP

As duas bibliotecas entram vendorizadas, sem CDN, e só ligam quando o
sistema não pediu menos movimento. Lenis mantém a rolagem nativa por
baixo, então âncora, teclado e leitor de tela seguem iguais.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 4: Entrada da página

Monograma sobre chapa azul texturizada, que sobe e some. Menos de um segundo. Uma vez por sessão. Não existe com `calmo` nem sem JS.

**Arquivos:**
- Modificar: `prototipo/index.html` (CSS, primeiro elemento do `<body>`, JS)

**Consome:** `prototipo/media/marca/mono-branco.png` (já existe).

- [ ] **Passo 1: HTML**

Primeiro filho do `<body>`, antes do `<svg width="0">` do filtro:

```html
<div class="entrada" id="entrada" aria-hidden="true">
  <div class="grao" style="filter:url(#grao)"></div>
  <img src="media/marca/mono-branco.png" alt="" width="56" height="56">
</div>
```

- [ ] **Passo 2: CSS**

```css
/* entrada: só existe com JS e com movimento. Sem os dois, display:none
   e a página abre direto no hero. */
.entrada{display:none}
.js .entrada{display:grid;place-items:center;position:fixed;inset:0;z-index:100;
  background:var(--tinta);color:#fff;
  transition:transform .7s cubic-bezier(.76,0,.24,1) .15s}
.js .entrada .grao{position:absolute;inset:0;opacity:.3;mix-blend-mode:overlay;background:#8AA0BC}
.js .entrada img{width:56px;height:56px;opacity:0;transform:translateY(10px);
  transition:opacity .5s ease .05s,transform .6s cubic-bezier(.2,.8,.2,1) .05s}
.js .entrada.viva img{opacity:.92;transform:none}
.js .entrada.foi{transform:translateY(-101%)}
.js .entrada.foi img{opacity:0;transition-delay:0s}
.js .entrada.pulada{display:none}
@media(prefers-reduced-motion:reduce){.js .entrada{display:none}}
```

- [ ] **Passo 3: JS**

No começo do script, antes do bloco do hero que adiciona `.pronta` (procure por `pronta` no script existente):

```js
/* entrada da página: o hero só começa a animar depois que a chapa sobe.
   sessionStorage evita repetir em todo clique de âncora ou recarga. */
var entrada = document.getElementById("entrada");
var jaViu = false;
try { jaViu = sessionStorage.getItem("entrada") === "1"; } catch(e){}
function liberaHero(){ hero.classList.add("pronta"); }
if (calmo || jaViu){
  entrada.classList.add("pulada");
  liberaHero();
} else {
  requestAnimationFrame(function(){ entrada.classList.add("viva"); });
  setTimeout(function(){
    entrada.classList.add("foi");
    try { sessionStorage.setItem("entrada","1"); } catch(e){}
    setTimeout(liberaHero, 250);
    setTimeout(function(){ entrada.classList.add("pulada"); }, 1100);
  }, 650);
}
```

Depois, **remover** a chamada antiga que adicionava `.pronta` ao hero (ela virou `liberaHero`). Procure `hero.classList.add('pronta')` e apague a linha antiga.

- [ ] **Passo 4: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: passa a checagem `reduced-motion: entrada da página apareceu`. No navegador: chapa azul com o monograma, sobe em menos de um segundo, e o título do hero começa a subir logo depois. Recarregar: não aparece de novo. Abrir em aba anônima: aparece.

- [ ] **Passo 5: commit**

```bash
git add prototipo/index.html
git commit -m "feat: entrada da página com o monograma

Chapa azul texturizada que sobe em menos de um segundo, uma vez por
sessão. Não existe sem JS nem para quem pediu menos movimento; nesses
casos a página abre direto no hero.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 5: Reveals de texto, imagem e botão

Três micro-interações que dão o acabamento de site premiado sem carregar informação nenhuma.

1. A declaração (seção 3) chega palavra a palavra conforme a rolagem passa por ela.
2. Retratos dos sócios e capas do blog se revelam de baixo para cima com `clip-path`.
3. Botões `.botao` e `.fala` puxam levemente o cursor (magnetismo de 6px, não mais).

**Arquivos:**
- Modificar: `prototipo/index.html` (CSS, HTML da declaração, JS)

**Consome:** `aoRolar(fn)` da tarefa 3.

- [ ] **Passo 1: declaração palavra a palavra**

No HTML, o `<h2 class="display sobe">` da `.declaracao` passa a ter `data-palavras`:

```html
<h2 class="display" data-palavras>A parte difícil raramente é a lei. É não saber o que vai acontecer com a sua vida.</h2>
```

(remove `.sobe` dele; o reveal de palavras substitui.)

CSS:

```css
/* palavras: sem JS o h2 é texto normal. Com JS e movimento, cada palavra
   vira um span que vai de 22% a 100% de opacidade conforme a rolagem. */
.js [data-palavras] .w{display:inline-block;opacity:.22;will-change:opacity}
@media(prefers-reduced-motion:reduce){.js [data-palavras] .w{opacity:1}}
```

JS (dentro do listener, depois de `aoRolar` existir):

```js
/* declaração: quebra em palavras só quando vai animar. */
aoRolar(function(gsap, ST){
  document.querySelectorAll("[data-palavras]").forEach(function(h){
    var texto = h.textContent.trim().split(/\s+/);
    h.innerHTML = texto.map(function(p){ return '<span class="w">' + p + '</span>'; }).join(" ");
    gsap.to(h.querySelectorAll(".w"), {
      opacity: 1, stagger: 0.04, ease: "none",
      scrollTrigger: { trigger: h, start: "top 78%", end: "bottom 45%", scrub: 0.6 }
    });
  });
});
```

- [ ] **Passo 2: revelar imagens**

CSS:

```css
.js .revela{clip-path:inset(100% 0 0 0)}
.js .revela.aberta{clip-path:inset(0 0 0 0);transition:clip-path 1.1s cubic-bezier(.2,.8,.2,1)}
@media(prefers-reduced-motion:reduce){.js .revela{clip-path:none}}
```

HTML: acrescentar a classe `revela` em cada `.moldura` dos sócios e em cada `.capa` do blog. Ex.: `<div class="moldura revela">` e `<div class="capa revela">`.

JS: reaproveitar o `IntersectionObserver` que já cuida de `.sobe`. Encontre `document.querySelectorAll('.sobe').forEach(function(n){ olho.observe(n); });` e acrescente logo abaixo:

```js
var olhoImg = new IntersectionObserver(function(es){
  es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("aberta"); olhoImg.unobserve(e.target); } });
}, { rootMargin: "0px 0px -12% 0px" });
document.querySelectorAll(".revela").forEach(function(n){ olhoImg.observe(n); });
```

E no ramo `calmo` que já marca todos `.sobe` como `visivel`, acrescente: `document.querySelectorAll('.revela').forEach(function(n){ n.classList.add('aberta'); });`

- [ ] **Passo 3: botão magnético**

JS:

```js
/* magnetismo: o botão desliza até 6px na direção do cursor. Só com
   apontador fino e com movimento; no toque não existe. */
if (!calmo && matchMedia("(pointer:fine)").matches){
  document.querySelectorAll(".botao, .fala").forEach(function(b){
    b.addEventListener("mousemove", function(e){
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width/2) / r.width;
      var y = (e.clientY - r.top - r.height/2) / r.height;
      b.style.transform = "translate(" + (x*6).toFixed(1) + "px," + (y*6).toFixed(1) + "px)";
    });
    b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
  });
}
```

CSS, junto das regras de `.botao`:

```css
.botao,.fala{transition:background .3s,transform .35s cubic-bezier(.2,.8,.2,1)}
```

(se `.botao` já tem `transition`, some `transform` a ela em vez de duplicar.)

- [ ] **Passo 4: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: só `falta #metodo`. As checagens de reduced-motion e sem-JS têm que continuar passando: com JS desligado o h2 da declaração é texto normal e as imagens aparecem inteiras.

No navegador: rolar até a declaração e ver as palavras clareando; os retratos sobem revelando; passar o mouse no botão do hero e sentir o puxão.

- [ ] **Passo 5: commit**

```bash
git add prototipo/index.html
git commit -m "feat: reveal de palavras, de imagem e botão magnético

Três camadas de acabamento que não carregam informação: a declaração
clareia palavra a palavra com a rolagem, retratos e capas se revelam de
baixo para cima, e os botões puxam o cursor em até 6px. Tudo some sem
JS ou com menos movimento.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 6: Áreas com os assuntos que a pessoa busca

`docs/PESQUISA.md` §4: quem procura advogado busca "divórcio", "guarda", "pensão", não "Direito de Família". Cada área ganha uma fila de assuntos. Os assuntos são âncoras para `#contato` com mensagem de WhatsApp já contextualizada.

**Arquivos:**
- Modificar: `prototipo/index.html` (HTML e CSS de `.areas`)

- [ ] **Passo 1: HTML**

Dentro de cada `<a class="item ...">` confirmado, depois de `.fila`, acrescentar `.assuntos`. Para Família:

```html
<ul class="assuntos" aria-label="Assuntos em Família">
  <li>Divórcio</li><li>Guarda</li><li>Pensão alimentícia</li><li>Inventário</li><li>União estável</li>
</ul>
```

Para Compliance:

```html
<ul class="assuntos" aria-label="Assuntos em Compliance">
  <li>Programa de integridade</li><li>Código de conduta</li><li>Canal de denúncias</li><li>LGPD</li><li>Treinamento</li>
</ul>
```

Os dois `.item.aberto` (terceira e quarta área) ficam como estão, com `data-placeholder="1"`.

- [ ] **Passo 2: CSS**

```css
.assuntos{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;padding:0;list-style:none}
.assuntos li{font-size:15px;padding:7px 12px;border:1px solid rgba(255,255,255,.22);border-radius:999px;
  color:rgba(255,255,255,.78);transition:border-color .3s,color .3s}
.item:hover .assuntos li{border-color:rgba(255,255,255,.45);color:#fff}
@media(max-width:560px){.assuntos li{font-size:14px;padding:6px 10px}}
```

- [ ] **Passo 3: mensagem de WhatsApp por área**

O `href` dos dois itens confirmados deixa de ser `#contato` e vira o link do WhatsApp com a área no texto. O número continua placeholder (`5544000000000`) e o `<a>` ganha `data-placeholder="1"`:

```
Família:    https://wa.me/5544000000000?text=Ol%C3%A1%2C%20preciso%20de%20orienta%C3%A7%C3%A3o%20em%20direito%20de%20fam%C3%ADlia.
Compliance: https://wa.me/5544000000000?text=Ol%C3%A1%2C%20preciso%20de%20orienta%C3%A7%C3%A3o%20sobre%20compliance.
```

Acrescentar `target="_blank" rel="noopener"` nos dois.

- [ ] **Passo 4: verificar**

Rodar: `node tools/verifica.mjs` e abrir a captura da seção. Os chips têm que caber dentro da chapa azul sem encostar na diagonal, em desktop e celular. Se no celular a fila de chips empurrar o `.seta` para fora, mude `.fila` para `flex-wrap:wrap` no breakpoint de 560px.

- [ ] **Passo 5: commit**

```bash
git add prototipo/index.html
git commit -m "feat: áreas listam os assuntos que a pessoa procura

Divórcio, guarda, pensão, inventário. É o vocabulário de quem busca no
Google, não o da faculdade. Cada área abre o WhatsApp já com o assunto
na primeira frase.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 7: Seção "Como trabalhamos"

A seção nova mais importante. A OAB veda depoimento e resultado; o que sobra para gerar confiança é descrever o método com clareza. Entra entre a faixa de vídeo (`.corte`) e "Em português claro" (`#publicacoes`).

Layout em desktop: coluna esquerda fixa (`position:sticky`) com o título e um traço de progresso; coluna direita com os quatro passos, um abaixo do outro. Cada passo tem número grande em serifa, título e uma frase. Ao rolar, o passo em foco fica em `--tinta` e os outros em `--secundario`. Fecha com três compromissos em linha.

Sem JS: tudo visível, tudo em `--tinta`. Sem movimento: idem.

**Arquivos:**
- Modificar: `prototipo/index.html` (HTML entre `.corte` e `#publicacoes`, CSS, JS, menu)

**Consome:** `aoRolar(fn)` da tarefa 3.

- [ ] **Passo 1: HTML**

Logo depois de `</section>` da `.corte` e antes de `<section class="secao leitor" id="publicacoes">`:

```html
<section class="secao metodo" id="metodo">
  <div class="env">
    <div class="fixa">
      <h2 class="display sobe">Como trabalhamos</h2>
      <p class="sobe">Do primeiro contato até o caso andar, o caminho é o mesmo para todo mundo.</p>
      <div class="traco" aria-hidden="true"><i></i></div>
    </div>
    <ol class="passos">
      <li class="passo sobe">
        <span class="n">01</span>
        <h3>Você escreve o que aconteceu</h3>
        <p>Pelo WhatsApp ou pelo formulário, do seu jeito. Não existe questionário longo nem triagem automática.</p>
      </li>
      <li class="passo sobe">
        <span class="n">02</span>
        <h3>Marcamos uma conversa</h3>
        <p>Por vídeo, ou presencial em Maringá se você preferir. Nela ouvimos a história inteira antes de opinar.</p>
      </li>
      <li class="passo sobe">
        <span class="n">03</span>
        <h3>Você recebe as opções, os prazos e o custo</h3>
        <p>Em português claro, antes de qualquer compromisso. Se não valer a pena entrar com o processo, dizemos isso também.</p>
      </li>
      <li class="passo sobe">
        <span class="n">04</span>
        <h3>O caso anda, e você acompanha</h3>
        <p>Cada movimentação chega para você, inclusive quando a notícia é que nada mudou.</p>
      </li>
    </ol>
    <ul class="valem sobe" aria-label="O que vale em todos os casos">
      <li><b>Quem atende é quem assina.</b> Não há atendente nem estagiário entre você e o sócio.</li>
      <li><b>O custo vem antes do compromisso.</b> Nenhuma cobrança que você não tenha visto por escrito.</li>
      <li data-placeholder="1"><b>Resposta em até um dia útil.</b> <span style="color:var(--imperial)">Prazo a confirmar com os sócios antes de publicar.</span></li>
    </ul>
  </div>
</section>
```

- [ ] **Passo 2: CSS**

```css
/* método: coluna fixa à esquerda, passos à direita. Sem JS o passo em
   foco não existe, todos ficam em --tinta. */
.metodo .env{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(40px,7vw,120px);align-items:start}
.metodo .fixa{position:sticky;top:calc(var(--bloco) * .55)}
.metodo .fixa p{margin-top:18px;max-width:34ch;color:var(--secundario)}
.metodo .traco{margin-top:40px;width:1px;height:120px;background:var(--linha);position:relative;overflow:hidden}
.metodo .traco i{position:absolute;inset:0;background:var(--imperial);transform:scaleY(0);transform-origin:top}
.passos{list-style:none;margin:0;padding:0;display:grid;gap:clamp(36px,5vw,72px)}
.passo{display:grid;grid-template-columns:auto 1fr;gap:clamp(18px,3vw,40px);align-items:start;
  padding-top:clamp(20px,2.4vw,28px);border-top:1px solid var(--linha);
  color:var(--tinta);transition:color .5s}
.passo .n{font-family:var(--serif);font-weight:200;font-size:clamp(40px,5vw,72px);line-height:.9;letter-spacing:-.03em;
  color:var(--imperial);opacity:.9}
.passo h3{font-family:var(--serif);font-weight:300;font-size:clamp(24px,2.4vw,34px);letter-spacing:-.02em;line-height:1.1}
.passo p{margin-top:10px;max-width:46ch;color:var(--secundario)}
.js .metodo.viva .passo{color:var(--secundario)}
.js .metodo.viva .passo.foco{color:var(--tinta)}
.valem{grid-column:1 / -1;list-style:none;margin:clamp(48px,6vw,88px) 0 0;padding:clamp(28px,3vw,40px) 0 0;
  border-top:1px solid var(--tinta);display:grid;grid-template-columns:repeat(3,1fr);gap:32px;font-size:17px;line-height:1.5}
.valem b{display:block;font-weight:600;color:var(--tinta);margin-bottom:6px}
.valem li{color:var(--secundario)}
@media(max-width:900px){
  .metodo .env{grid-template-columns:1fr;gap:40px}
  .metodo .fixa{position:static}
  .metodo .traco{display:none}
  .valem{grid-template-columns:1fr;gap:22px}
}
```

- [ ] **Passo 3: JS do foco e do traço**

```js
/* método: o passo mais perto do centro da tela fica em foco; o traço da
   coluna fixa cresce com o avanço pela seção. */
aoRolar(function(gsap, ST){
  var sec = document.getElementById("metodo"); if (!sec) return;
  sec.classList.add("viva");
  var passos = sec.querySelectorAll(".passo");
  passos.forEach(function(p){
    ST.create({ trigger: p, start: "top 62%", end: "bottom 38%",
      onToggle: function(s){ if (s.isActive){ passos.forEach(function(q){ q.classList.remove("foco"); }); p.classList.add("foco"); } }
    });
  });
  gsap.to(sec.querySelector(".traco i"), { scaleY: 1, ease: "none",
    scrollTrigger: { trigger: sec.querySelector(".passos"), start: "top 60%", end: "bottom 60%", scrub: true } });
});
```

- [ ] **Passo 4: menu**

Na ilha central do `<nav>`, acrescentar entre Sócios e Textos:

```html
<a href="#metodo" data-alvo="metodo">Método</a>
```

E no `.lencol` (menu do celular), na mesma posição:

```html
<a href="#metodo">Como trabalhamos</a>
```

Procure no JS a lista de ids que o indicador do menu percorre (algo como `["areas","socios","publicacoes","perguntas"]`) e acrescente `"metodo"` depois de `"socios"`.

- [ ] **Passo 5: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: `OK` pela primeira vez. Abrir `tools/shots/desktop-*.png` na altura da seção: a coluna da esquerda fica presa enquanto os passos passam; nenhum passo atravessa a diagonal da faixa de vídeo acima.

No celular (`celular-*.png`): uma coluna, título em cima, passos empilhados, compromissos empilhados.

Leia os textos em voz alta contra o VOZ.md: nenhuma frase termina arrematando. Se alguma terminar, corte o arremate.

- [ ] **Passo 6: commit**

```bash
git add prototipo/index.html
git commit -m "feat: seção Como trabalhamos

Os quatro passos do primeiro contato até o caso andar, mais três
compromissos de processo. A OAB veda depoimento e resultado; o que
sobra para gerar confiança é descrever o método, e é isso que a seção
faz. Coluna fixa à esquerda, passos à direita, foco acompanha a rolagem.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 8: Hover dos textos e controle do vídeo

Duas coisas pequenas na mesma passada.

1. Cartões do blog: capa cresce 4% e o título ganha sublinhado animado no hover.
2. Vídeo do hero em autoplay precisa de botão de pausa (WCAG 2.2.2) e de `poster` para quem carrega devagar.

**Arquivos:**
- Modificar: `prototipo/index.html`

- [ ] **Passo 1: hover dos cartões**

CSS:

```css
.texto .capa{overflow:hidden}
.texto .capa img{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.texto:hover .capa img{transform:scale(1.04)}
.texto h4{background:linear-gradient(currentColor,currentColor) no-repeat 0 100% / 0 1px;
  transition:background-size .5s cubic-bezier(.2,.8,.2,1)}
.texto:hover h4{background-size:100% 1px}
```

Atenção: alguns `<img>` das capas já têm `transform:scale(1.3)` inline para enquadrar. Para esses, o hover precisa multiplicar, não substituir. Troque o inline por uma variável: `style="--zoom:1.3"` e no CSS `.texto .capa img{transform:scale(var(--zoom,1))} .texto:hover .capa img{transform:scale(calc(var(--zoom,1) * 1.04))}`.

- [ ] **Passo 2: poster e pausa do hero**

Gerar o poster a partir do próprio vídeo (precisa de ffmpeg; se não houver, `sudo apt-get install -y ffmpeg`):

```bash
ffmpeg -y -i prototipo/media/hero.mp4 -ss 00:00:01 -frames:v 1 -vf scale=1440:-1 -q:v 4 prototipo/media/hero-poster.jpg
```

No `<video class="filme" ...>` do hero: acrescentar `poster="media/hero-poster.jpg"`.

Botão, dentro de `.hero`, depois de `.marcas`:

```html
<button class="pausa" id="pausa" aria-pressed="false" aria-label="Pausar o vídeo de fundo">Pausar vídeo</button>
```

CSS:

```css
.hero .pausa{position:absolute;z-index:3;right:var(--gutter);bottom:22px;font:500 13px/1 var(--sans);letter-spacing:.02em;
  color:rgba(255,255,255,.72);background:rgba(9,23,48,.35);border:1px solid rgba(255,255,255,.22);
  border-radius:999px;padding:12px 16px;cursor:pointer;backdrop-filter:blur(10px)}
.hero .pausa:hover{color:#fff}
@media(prefers-reduced-motion:reduce){.hero .pausa{display:none}}
```

JS:

```js
/* vídeo de fundo: com menos movimento ele nem toca; com movimento, dá
   para pausar. Estado guardado na sessão. */
var filme = hero.querySelector(".filme"), pausa = document.getElementById("pausa");
if (calmo){ filme.removeAttribute("autoplay"); filme.pause(); }
else if (pausa){
  var parado = false;
  try { parado = sessionStorage.getItem("video") === "pausado"; } catch(e){}
  function aplica(){
    if (parado){ filme.pause(); } else { filme.play().catch(function(){}); }
    pausa.setAttribute("aria-pressed", parado ? "true" : "false");
    pausa.setAttribute("aria-label", parado ? "Retomar o vídeo de fundo" : "Pausar o vídeo de fundo");
    pausa.textContent = parado ? "Retomar vídeo" : "Pausar vídeo";
  }
  pausa.addEventListener("click", function(){
    parado = !parado;
    try { sessionStorage.setItem("video", parado ? "pausado" : "tocando"); } catch(e){}
    aplica();
  });
  aplica();
}
```

O mesmo `removeAttribute("autoplay")` + `pause()` sob `calmo` vale para o vídeo da `.corte`. Aplique aos dois: `document.querySelectorAll("video[autoplay]")`.

- [ ] **Passo 3: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: `OK`, incluindo `reduced-motion: vídeo em autoplay tocando`. No navegador: clicar em "Pausar vídeo" para o hero; recarregar mantém pausado.

- [ ] **Passo 4: commit**

```bash
git add prototipo/index.html prototipo/media/hero-poster.jpg
git commit -m "feat: hover nos textos e controle do vídeo do hero

Capa cresce e título sublinha ao passar o mouse. O vídeo de fundo ganha
poster e um botão de pausa, que a acessibilidade exige para autoplay
acima de cinco segundos.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 9: Rodapé

O rodapé atual é um parágrafo. Vira a última chapa azul da página, com o que a OAB obriga e o que uma pessoa procura no fim: como falar, onde fica, o que o site faz com os dados dela.

**Arquivos:**
- Modificar: `prototipo/index.html` (substituir o `<footer>` inteiro, CSS)

- [ ] **Passo 1: HTML**

Substituir o `<footer class="rodape" id="rodape">...</footer>` por:

```html
<footer class="rodape" id="rodape">
  <div class="lastro"></div>
  <div class="grao" style="filter:url(#grao)"></div>
  <div class="env">
    <div class="marca-pe">
      <img src="media/marca/lockup-branco.png" alt="Bertoncini & Mendonça" width="180" loading="lazy">
      <p class="registro" data-placeholder="1">Bertoncini &amp; Mendonça Sociedade de Advogados<br>
        Registro OAB/PR nº 0.000 · CNPJ 00.000.000/0001-00<br>
        Juscelino Bertoncini, OAB/PR 000.000 · Beatriz Mendonça, OAB/PR 000.000<br>
        <span style="color:var(--imperial)">Inscrições são placeholder. Entram as reais antes de publicar.</span></p>
    </div>
    <nav class="pe-nav" aria-label="Rodapé">
      <div>
        <h4>Navegar</h4>
        <a href="#areas">Áreas de atuação</a>
        <a href="#socios">Sócios</a>
        <a href="#metodo">Como trabalhamos</a>
        <a href="#publicacoes">Textos</a>
        <a href="#perguntas">Perguntas</a>
      </div>
      <div>
        <h4>Falar</h4>
        <a href="https://wa.me/5544000000000?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20um%20caso." target="_blank" rel="noopener" data-placeholder="1">WhatsApp</a>
        <a href="mailto:contato@exemplo.adv.br" data-placeholder="1">contato@exemplo.adv.br</a>
        <a href="tel:+5544000000000" data-placeholder="1">(44) 0000 0000</a>
        <p>Segunda a sexta, 9h às 18h</p>
      </div>
      <div>
        <h4>Onde</h4>
        <p>Maringá, Paraná<br>Atendimento online para todo o estado</p>
        <a href="#" data-placeholder="1">Instagram</a>
      </div>
      <div>
        <h4>Legal</h4>
        <a href="#" data-placeholder="1">Política de privacidade</a>
        <a href="#" data-placeholder="1">Aviso de cookies</a>
        <p>Os textos deste site são informativos e não substituem uma consulta.</p>
      </div>
    </nav>
    <div class="pe-fim">
      <p>© <span id="ano">2026</span> Bertoncini &amp; Mendonça</p>
      <p><a href="https://gabrielfelix-ux.4yu.com.br" rel="noopener">Site por Gabriel Felix</a></p>
    </div>
  </div>
</footer>
```

O crédito no fim é decisão do Gabriel e tem valor comercial para ele (`docs/CONTEXTO-CLIENTE.md` §2). Fica; ele tira se quiser.

- [ ] **Passo 2: CSS**

Substituir as regras de `.rodape` existentes por:

```css
.rodape{position:relative;overflow:hidden;background:var(--tinta);color:#fff;padding-block:clamp(64px,8vw,120px) 32px;
  clip-path:polygon(0 2.6vw,100% 0,100% 100%,0 100%)}
.rodape .lastro{position:absolute;inset:-16% -8%;background:linear-gradient(160deg,#0B1E3F 30%,#1a3358 70%,#2a2540)}
.rodape .grao{position:absolute;inset:0;opacity:.26;mix-blend-mode:overlay;background:#8AA0BC}
.rodape .env{position:relative;z-index:1;display:grid;gap:clamp(40px,5vw,72px)}
.rodape .marca-pe{display:grid;grid-template-columns:auto 1fr;gap:32px;align-items:start}
.rodape .marca-pe img{opacity:.92}
.rodape .registro{font-size:15px;line-height:1.6;color:rgba(255,255,255,.72);margin:0}
.pe-nav{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;padding-top:40px;border-top:1px solid rgba(255,255,255,.14)}
.pe-nav h4{font:500 12px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin:0 0 18px}
.pe-nav a,.pe-nav p{display:block;font-size:16px;line-height:1.5;color:rgba(255,255,255,.86);text-decoration:none;margin:0 0 10px}
.pe-nav a{padding-block:4px}
.pe-nav a:hover{color:#fff;text-decoration:underline;text-underline-offset:4px}
.pe-fim{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:24px;
  border-top:1px solid rgba(255,255,255,.14);font-size:14px;color:rgba(255,255,255,.55)}
.pe-fim a{color:inherit}
@media(max-width:900px){.pe-nav{grid-template-columns:repeat(2,1fr)}.rodape .marca-pe{grid-template-columns:1fr;gap:20px}}
@media(max-width:560px){.pe-nav{grid-template-columns:1fr}}
```

- [ ] **Passo 3: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: `OK`. Na captura, o rodapé é azul texturizado com diagonal em cima, quatro colunas, registro OAB visível. No celular, uma coluna.

- [ ] **Passo 4: commit**

```bash
git add prototipo/index.html
git commit -m "feat: rodapé com registro, navegação e aviso legal

Última chapa azul da página. Registro da sociedade e OAB dos dois
sócios, que a OAB obriga. Quatro colunas: navegar, falar, onde, legal.
A página abre e fecha em azul.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 10: Aviso de cookies

`docs/CONTEXTO-CLIENTE.md` §4: o texto é do Juscelino, a implementação é nossa. Três opções, sem bloquear a página, sem escurecer o fundo. Só existe com JS (sem JS não há rastreamento nenhum para consentir).

**Arquivos:**
- Modificar: `prototipo/index.html`

**Produz:** `localStorage["consentimento"]` com `"todos"`, `"necessarios"` ou `"nenhum"`, e o evento `consentimento` no `document` para o futuro GA4/Clarity escutar.

- [ ] **Passo 1: HTML**

Antes do `</body>`, depois do rodapé:

```html
<div class="aviso" id="aviso" role="region" aria-label="Aviso de cookies" hidden>
  <p data-placeholder="1">Este site usa cookies para medir visitas. Você escolhe o que aceita.
    <a href="#" data-placeholder="1">Saiba mais</a>
    <span style="color:var(--imperial)">Texto provisório. O definitivo vem do Juscelino.</span></p>
  <div class="opcoes">
    <button type="button" data-consente="todos">Aceitar todos</button>
    <button type="button" data-consente="necessarios">Apenas necessários</button>
    <button type="button" data-consente="nenhum">Rejeitar</button>
  </div>
</div>
```

- [ ] **Passo 2: CSS**

```css
.aviso{position:fixed;z-index:90;left:16px;bottom:16px;max-width:420px;padding:20px 22px;
  background:#fff;color:var(--tinta);border:1px solid var(--linha);border-radius:18px;
  box-shadow:0 20px 60px rgba(11,30,63,.16);font-size:15px;line-height:1.55}
.aviso p{margin:0 0 16px}
.aviso a{color:var(--apoio)}
.aviso .opcoes{display:flex;gap:8px;flex-wrap:wrap}
.aviso button{font:500 14px/1 var(--sans);padding:13px 16px;border-radius:999px;cursor:pointer;
  border:1px solid var(--tinta);background:#fff;color:var(--tinta);min-height:44px}
.aviso button[data-consente="todos"]{background:var(--tinta);color:#fff}
.aviso button:hover{background:var(--apoio);color:#fff;border-color:var(--apoio)}
@media(max-width:560px){.aviso{left:12px;right:12px;bottom:12px;max-width:none}}
```

- [ ] **Passo 3: JS**

```js
/* consentimento: três escolhas, guardadas no aparelho. O que ligar
   rastreador depois escuta o evento `consentimento` no document. */
(function(){
  var caixa = document.getElementById("aviso"); if (!caixa) return;
  var atual = null;
  try { atual = localStorage.getItem("consentimento"); } catch(e){}
  if (!atual){ caixa.hidden = false; }
  caixa.querySelectorAll("[data-consente]").forEach(function(b){
    b.addEventListener("click", function(){
      var v = b.dataset.consente;
      try { localStorage.setItem("consentimento", v); } catch(e){}
      caixa.hidden = true;
      document.dispatchEvent(new CustomEvent("consentimento", { detail: v }));
    });
  });
})();
```

- [ ] **Passo 4: verificar**

Rodar: `node tools/verifica.mjs`
Esperado: `OK`. Se a checagem de alvo de toque reclamar do link "Saiba mais", é texto corrido dentro de `<p>`: acrescente `.aviso p a` à lista de exclusões do script (`!e.closest(".aviso p")`).

No navegador: o aviso aparece no canto; clicar em qualquer opção some e não volta ao recarregar. `localStorage.removeItem("consentimento")` no console faz voltar.

- [ ] **Passo 5: commit**

```bash
git add prototipo/index.html tools/verifica.mjs
git commit -m "feat: aviso de cookies com três opções

Aceitar todos, apenas necessários, rejeitar. Não bloqueia a página nem
escurece o fundo. A escolha fica no aparelho e dispara um evento que o
GA4 e o Clarity vão escutar quando entrarem. Texto provisório até o
Juscelino mandar o dele.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 11: Acessibilidade e teclado

O que o script não pega sozinho.

**Arquivos:**
- Modificar: `prototipo/index.html`

- [ ] **Passo 1: link de pular**

Primeiro filho do `<body>`, antes da `.entrada`:

```html
<a class="pular" href="#hero">Pular para o conteúdo</a>
```

```css
.pular{position:fixed;z-index:110;top:12px;left:12px;padding:12px 16px;background:#fff;color:var(--tinta);
  border-radius:999px;font:500 14px/1 var(--sans);transform:translateY(-200%);transition:transform .2s}
.pular:focus{transform:none}
```

- [ ] **Passo 2: menu do celular**

O `.lencol` abre por `#abre`. Garantir: `Escape` fecha; ao abrir, o foco vai para o primeiro link; ao fechar, volta para o botão. Procure o handler do `#abre` no script e acrescente:

```js
document.addEventListener("keydown", function(e){
  if (e.key === "Escape" && lencol.dataset.aberto === "1"){ abre.click(); abre.focus(); }
});
abre.addEventListener("click", function(){
  if (lencol.dataset.aberto === "1"){ var p = lencol.querySelector("a"); if (p) p.focus(); }
});
```

(ajuste os nomes `lencol`/`abre` aos que o script já usa.)

- [ ] **Passo 3: `details` das perguntas**

Já é acessível por natureza. Confirmar que `summary` tem foco visível: o `:focus-visible` global cobre. Acrescentar transição suave ao abrir sem JS:

```css
.q .resposta{padding-block:4px 22px}
```

- [ ] **Passo 4: contraste**

Rodar no navegador, no console, para achar texto secundário claro demais sobre branco:

```js
[...document.querySelectorAll("p,span,li,a")].filter(e=>getComputedStyle(e).color==="rgb(81, 116, 147)"&&parseFloat(getComputedStyle(e).fontSize)<16).map(e=>e.textContent.trim().slice(0,40))
```

`#517493` sobre branco tem contraste 4.6:1, que passa AA em texto de 16px para cima e falha abaixo. Todo elemento que a lista devolver sobe para 16px ou muda para `--tinta`.

- [ ] **Passo 5: verificar e commit**

Rodar: `node tools/verifica.mjs` → `OK`. Navegar a página inteira só com `Tab`: o foco é sempre visível e a ordem faz sentido.

```bash
git add prototipo/index.html
git commit -m "fix: teclado, foco e contraste

Link de pular, Escape fecha o menu, foco vai e volta do lugar certo, e
texto secundário abaixo de 16px sobe de tamanho para passar AA.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Tarefa 12: Desempenho

Vídeo e fontes são o peso da página. Meta: Lighthouse mobile de Performance 90 ou mais, sem cortar o vídeo.

**Arquivos:**
- Modificar: `prototipo/index.html`, `prototipo/media/*.mp4`

- [ ] **Passo 1: medir antes**

```bash
npx --yes lighthouse "file://$PWD/prototipo/index.html" --preset=perf --form-factor=mobile --screenEmulation.mobile --output=json --output-path=/tmp/lh-antes.json --chrome-flags="--headless" --quiet
node -e "const r=require('/tmp/lh-antes.json');console.log('perf',Math.round(r.categories.performance.score*100),'| LCP',r.audits['largest-contentful-paint'].displayValue,'| peso',r.audits['total-byte-weight'].displayValue)"
```

Se o Lighthouse recusar `file://`, sirva a pasta: `npx --yes serve prototipo -l 4700` em outro terminal e use `http://localhost:4700`.

- [ ] **Passo 2: comprimir os vídeos**

```bash
for v in hero faixa; do
  ffmpeg -y -i prototipo/media/$v.mp4 -vf "scale=1440:-2" -c:v libx264 -crf 28 -preset slow -movflags +faststart -an prototipo/media/$v.mp4.tmp && mv prototipo/media/$v.mp4.tmp prototipo/media/$v.mp4
done
ls -la prototipo/media/*.mp4
```

Meta: cada um abaixo de 2 MB. Sem áudio (`-an`), porque o autoplay é mudo de qualquer forma.

- [ ] **Passo 3: carregamento tardio**

- Vídeo da `.corte`: já tem `preload="none"`. Acrescentar `loading="lazy"` não vale para vídeo; em vez disso, só definir o `src` quando a seção se aproximar. No JS:

```js
var tardio = document.querySelector(".corte .filme");
if (tardio && !calmo){
  var olhoV = new IntersectionObserver(function(es){
    if (es[0].isIntersecting){ tardio.src = tardio.dataset.src; tardio.play().catch(function(){}); olhoV.disconnect(); }
  }, { rootMargin: "600px 0px" });
  olhoV.observe(tardio);
}
```

E no HTML da `.corte`: trocar `src="media/faixa.mp4"` por `data-src="media/faixa.mp4"`.

- Todas as `<img>` fora da primeira dobra já têm `loading="lazy"`; confirme com `grep -c 'loading="lazy"' prototipo/index.html` (esperado: 7 ou mais).

- [ ] **Passo 4: medir depois**

Mesmo comando do passo 1, salvando em `/tmp/lh-depois.json`. Esperado: Performance ≥ 90. Se ficar abaixo, o relatório diz o que pesa; ataque o maior item e meça de novo. Não remova o vídeo do hero.

- [ ] **Passo 5: commit**

```bash
git add prototipo/index.html prototipo/media
git commit -m "perf: vídeos comprimidos e faixa carregada sob demanda

Os dois vídeos caem para menos de 2 MB cada, sem áudio. O da faixa só
recebe src quando a seção chega perto. Lighthouse mobile: NN antes, NN
depois.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

(substitua os `NN` pelos números medidos.)

---

### Tarefa 13: Revisão de texto, OAB e handoff

Última passada. Sem código novo além de correção de texto.

**Arquivos:**
- Modificar: `prototipo/index.html` (só texto), `docs/HANDOFF.md`, `README.md`

- [ ] **Passo 1: varredura da OAB**

```bash
grep -niE "gratuit|especialista|melhor|líder|lider|referência em|garant|resultado|clientes atendidos|processos ganhos|agende já|não perca|urgente|sucesso" prototipo/index.html | grep -v "<!--"
```

Esperado: nenhuma linha de texto visível. Se aparecer, reescreva. ("sucesso" pode aparecer em `class` ou comentário; só o texto visível importa.)

- [ ] **Passo 2: varredura de voz**

```bash
grep -nE "—|–" prototipo/index.html | grep -vE "^\s*[0-9]+:\s*(/\*|//|<!--)" | head
grep -niE "a gente|não é só|não é apenas|mais do que" prototipo/index.html | head
```

Esperado: vazio nos dois. Depois, leia todo texto visível uma vez, em voz alta. Para cada parágrafo, pergunte: a última frase informa ou arremata? Se arremata, corte.

- [ ] **Passo 3: inventário de placeholders**

```bash
grep -c 'data-placeholder="1"' prototipo/index.html
grep -n 'data-placeholder="1"' prototipo/index.html | sed -E 's/^([0-9]+):.*/\1/' | tr '\n' ' '
```

Copie a lista para o handoff (passo 4).

- [ ] **Passo 4: atualizar o handoff**

Em `docs/HANDOFF.md`, mudar a linha de estado no topo para:

```
> Estado: **protótipo da homepage completo, aguardando dados reais do briefing.**
```

E acrescentar uma seção logo depois de "Em uma frase":

```markdown
## Protótipo da homepage (12/09/2026)

`prototipo/index.html`, um arquivo. Doze seções, entrada, rolagem suave, reveals,
método, rodapé, aviso de cookies. Funciona sem JS e sem movimento.

Verificar: `node tools/verifica.mjs` (capturas em `tools/shots/`).

**Placeholders que dependem do briefing** (todos marcados com `data-placeholder="1"`,
N ocorrências): OAB dos sócios, registro da sociedade, CNPJ, telefone, e-mail,
Instagram, bio da Beatriz, terceira e quarta área, textos e capas do blog, prazo
de resposta, texto do aviso de cookies, política de privacidade.

**Próximo plano:** migrar para Astro a partir do CMS de `isabella-pires-arquitetura`,
páginas de área e de artigo, formulário de contato, GA4 e Clarity ligados ao
evento `consentimento`.
```

(substitua `N` pelo número do passo 3.)

Em `README.md`, na tabela de arquivos, acrescentar a linha:

```
| `docs/PLANO-HOMEPAGE.md` | Plano executado do protótipo da homepage; o que cada seção carrega e por quê |
```

- [ ] **Passo 5: verificação final e commit**

Rodar: `node tools/verifica.mjs` → `OK`. Abrir as capturas de desktop e celular, todas, e olhar cada uma. Se algo estiver errado visualmente, corrija antes de commitar.

```bash
git add prototipo/index.html docs/HANDOFF.md README.md
git commit -m "docs: revisão de texto e handoff do protótipo

Varredura da OAB e da voz, inventário de placeholders, e o handoff
passa a descrever o protótipo pronto e o que falta do briefing.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## O que este plano não faz, de propósito

- Não migra para Astro nem cria páginas internas. Outro plano.
- Não liga GA4, Clarity ou envio real da newsletter. Dependem de conta e de consentimento; o evento `consentimento` já deixa o gancho.
- Não inventa dado real. OAB, telefone, bio da Beatriz, áreas três e quatro continuam placeholder até o briefing chegar.
- Não muda fonte, paleta ou logo. Decisões registradas em `docs/DECISOES.md`; qualquer mudança passa pelo Gabriel.
- Não faz push nem deploy.
