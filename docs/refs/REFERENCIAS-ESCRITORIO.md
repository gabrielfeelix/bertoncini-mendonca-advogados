# Referências para a página "O escritório"

Só mecânica e medidas. Nada de texto/imagem deles no repo. Capturas em `~/dev/refs/<slug>/{frames,sheets,mech.json}` (1440x900; Y = scroll em px). Efeitos do Framer medidos via `getComputedStyle` em vários Y.

## A. Quadro /about (PRIMÁRIA) — `~/dev/refs/quadro/sheets/sheetNN.jpg`

Página 10.344px. Fonte Figtree. Tom: branco + coral `#FF595C` + preto; seções "cinemáticas" azul-aço com foto (stories/serviços). Muito scroll-linked: quase tudo é função de `scrollY`, não de tempo.

**Tokens.** Títulos Figtree 900 UPPERCASE 58px, ls -0.02em (-1.16px), lh ~1. Corpo 17px/500 (15 e 14 secundários), opacidade .7. Rótulos 14px/800 uppercase ls .04em (pílula "ABOUT", "SERVICES"). Watermark 380px/900 uppercase. Cores: `#fff`, `#000`, coral `#FF595C` (palavra de destaque no título, botões, filetes), azul-gelo `#ECF2F7` (watermark/pílulas), `rgba(0,37,69,.25)`. Raios: pílula 200px (botões/tags), 20px, 8px. Palavra de destaque em coral em quase todo título (ex.: "DIREÇÃO.").

**Global.** Nav fixa: logo à esq., links uppercase 12px/800, CTA pílula coral. Sobre as seções escuras o CTA vira branco e o logo troca por variante clara (dois logos "Light" com crossfade de opacidade, Y 4750→5000 entra, 7250→7500 sai). Appear inicial: spring, y 20→0, duration .6, bounce 0, delay 1.2s. Hover de link: cor `#000`→`rgba(0,0,0,.7)` (só isso).

1. **Hero (Y 0–350)** — pílula + H1 centrado 2 linhas + parágrafo. Ao rolar, sobe e sai normal. `sheet01`.
2. **Watermark "ABOUT /" gigante** (Y 0–5500) — texto 380px azul-gelo, `position:absolute` num container 450px alto com `overflow:hidden`, atrás de tudo; `translateX` = -482 + (-0.43 × scrollY) (0→-482, 1000→-913). Parallax horizontal contínuo. Gradiente branco→azul-claro no fundo (Gradient 900px). `sheet01`.
3. **Manifesto com revelação palavra a palavra (Y 500–1250)** — bloco 58px/900 uppercase, ~8 linhas, alinhado à esq. Palavras começam cinza-claro (~`#d5dbe3`) e escurecem em sequência amarradas ao scroll (scrub, ~0.4–0.5 viewport por bloco). Parágrafos embaixo fazem fade opacity 0→1 em 250px de scroll (Y 1000→1250). `sheet01`.
4. **Meet Clara (Y 1750–3300)** — seção 1023px; coluna esq. texto (rótulo cinza, título 2 linhas com 1ª linha coral, corpo, citação com filete vertical coral 2px). Coluna dir.: foto `position:sticky; top:120px; height:588px` (pai 1023px) com 2 "folhas" atrás giradas ~±4–6° (efeito pilha de fotos), a foto rola presa enquanto o texto passa. Texto: opacity 0→1 em Y 1750→2000 e 3500 sai. `sheet02`.
5. **"A clearer way forward" + 3 pilares (Y 3000–4000)** — título centrado 50px com 2ª metade coral; watermark "THE APPROACH" 120px azul-gelo atrás. 3 colunas separadas por filete coral 1px vertical, ícone de linha, título duas cores, texto 15px. Cada coluna: translateY 60→0 + opacity 0→1 (Y 3250–4000). `sheet03`.
6. **Contadores (Y 3750–4250)** — 4 números 40px/900 sobre filete coral 1px, legenda 13px; entram translateY -20→0 e opacity; os dígitos fazem count-up/roll (frame Y 3850 pega o "42" cortado no meio). `sheet03`/`sheet04`.
7. **CTA "Bring the question" (Y 4000–4500)** — centrado, pílula coral. Fade-in scrub (0.6→1 em 250px). `sheet04`.
8. **Success Story / depoimentos (Y 4300–7250) — o efeito mais forte.** Camada `position:fixed` full-screen (foto azul-aço com gradiente rosado, retrato recortado, 6 colunas verticais translúcidas como grid), revelada por **`clip-path: inset(100% 0 0)`→`inset(0)` entre Y≈4300 e 4750** (cortina que sobe, tamanho de 1 viewport). Fica "pinned" ~2500px; 5 histórias em sequência: cada uma com tags pílula, filete coral vertical 8px, citação 58px/900 uppercase **com escurecimento palavra a palavra** (branco 100% vs 35%), botão pílula branca; troca de história = opacity 1→0 em ~250px (Y 5500→5750 etc.) com a foto mudando. Saída (Y 7000–7250): o painel se parte em **5 faixas verticais** (as colunas do grid, `sheet06`) que somem em stagger e a camada sobe (`translateY` 0→-191→-691 em 250px steps) revelando a próxima seção branca. `sheet04`, `sheet05`, `sheet06`.
9. **Serviços "Choose the support…" (Y 5750–7100)** — título 58px, trecho em marca-texto (retângulo coral atrás de "THE SUPPORT"), pílula "SERVICES" acima. 3 cards (≈145px de largura útil × ~250px) sobre as colunas do grid, em **escada**: card esq. `translateY -160→0`, centro 0, dir. +160→0, amarrado ao scroll (-154→-125→-95→-66… ≈ 0.12px por px, de Y 5500 a ~7000). Card: fundo `rgba(0,37,69,.25)` + blur, raio 0, tag pílula ("90 Minutes"), título 20px/900 uppercase, corpo 13px, preço, botão pílula branca "BOOK NOW". `sheet05`.
10. **Insights/blog (Y 7250–8750)** — o título "THOUGHTS ON BUILDING A CAREER." faz **scale 1.6→1** (transform-origin centro) + **letras `translateY 63.8→0` em máscara** (char reveal) em Y 7000→7500. Duas colunas de post (data, título 17px/700, trecho, foto com filete coral lateral de 40px), assimétricas (esq. sobe mais que a dir.). Fade-in 0→1 em 250px. `sheet06`, `sheet07`.
11. **Newsletter (Y 8500–9000)** — título duas cores, input só com sublinhado, botão pílula coral.
12. **Rodapé (Y 9000–10344)** — sitemap em 4 colunas + legal, crédito 12px; **watermark "QUADRO" 380px azul-gelo** cortado embaixo, `translateX` ligado ao scroll (-0.4 → -315 de Y 9000→9750). `sheet07`.

**Resumo de mecânica.** Fades/translate de bloco = scroll-linked (opacity 0→1 em ~250–500px). Sticky real só na foto da seção 4 (top 120). O resto "pinned" é `position:fixed` + wrapper alto (`height` ≈ nº de histórias × ~500px) — não sticky.

## B. Green Volt /service (SECUNDÁRIA) — `~/dev/refs/greenvolt/sheets/mosaico.jpg`

**Paleta:** verde-floresta `#1B4332` (botões, painéis), verde-médio `#376F58`, hover `#267C57`, quase-preto `#111111`, fundo `#F2F2F2`/`#F1F1F1`, branco, texto secundário `#6C6C6C`, bordas `rgba(255,255,255,.1)`. Inter 16/400 corpo, títulos 40–50px/500 (sem negrito; palavra-chave em *itálico serifado*), rótulos `{ 01 }` entre chaves com 12–14px. Raios: 10px (maioria), 20px (painéis), 6–8px (botões), 100px/pílula (tags, ícones circulares).

**Componentes.** Botão: retângulo 6–8px verde, hover `#1B4332→#267C57` (nav) ou →`#111` (CTA), transição suave. Nav pílula branca com sublinhado/cor `#111→#1B4332` no hover. Card de logo: branco, raio 10, borda fina. Card de depoimento: branco, estrelas amarelas, avatar redondo, contador "/001". FAQ: linhas brancas raio 8; hover → raio 14, fundo branco, ícone "+" em círculo escuro; imagem grande à esq.

**Serviços "rolando".** (a) Faixa de imagens no hero (`Image Ticker`, 3433px largura, gap 32px, raio ~20): `translateX` amarrado ao scroll (-250 → -372 clamp, ≈ -0.1px/px nos primeiros 1200px). (b) Item de serviço: `/01` grande à esq., foto raio 10 com overlay de lista de benefícios sobre a imagem, texto + lista + botão à dir.; entra com scale .8→1 + opacity (por viewport). Nav some ao rolar (translateY 0→-120, opacity→0 em 500px) — nav só reaparece no topo.
**Seção "heurísticas"/processo** ("Our Proven Four-Step Process"): painel `#1B4332` raio 20, rótulo `{ 02 }`, título 40px branco com palavra em itálico serif, 4 cards translúcidos (`rgba(255,255,255,.1)`, borda `rgba(255,255,255,.1)`, raio 10) com miniatura no topo, pílula "Week 1-2", título 16/500, descrição cinza-claro, ícone circular no canto que desliza ±8px no scroll (parallax: ícone y -8, texto x +8). Cards entram translateY 60→0 + opacity (stagger .2s/.4s). Appear: spring y 60, delay 0/.2/.4/1s.
Rodapé: cartão branco raio 20 sobre foto de montanhas (parallax), CTA branco sobre foto escurecida.

## C. Architectro /about — final

Não achei um swap literal de frases no DOM; o final tem (sheet `~/dev/refs/architectro/sheets/sheet05.jpg`, `favorite-team.jpg`): (1) título "Favorite / Team" 171px/400: cada linha é um `div overflow` com `translateY(90px→0)`, **decaimento exponencial** (7.5→0.49→0.035 px a cada 75px de scroll, ≈ lerp 0.93) — as linhas "assentam" no lugar uma depois da outra, a 2ª 160px abaixo; (2) rodapé: linhas de texto `translateY 20→0`; (3) wordmark "ARCH" 500px+ cortada, desliza lateralmente (x 750→0) conforme sobe. Se o que o cliente chama de "frases trocando de lugar" for outro trecho, confirmar com ele (a lista "Location" tem linhas `translateY 90→0` em stagger de ~55–64px por item, Y 1100–2500).

## Como portar (GSAP + Lenis já no projeto)

- **Watermark parallax horizontal:** `gsap.to(el,{x:-k,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:true}})` com `k ≈ 0.43×altura da seção`. CSS: `font-size:clamp(14rem,26vw,24rem); color:var(--azul-gelo); overflow:hidden` no wrapper.
- **Revelação palavra a palavra:** dividir texto em `<span>` (SplitText ou script de 10 linhas); `gsap.fromTo(words,{opacity:.2},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{scrub:true,start:'top 80%',end:'bottom 40%'}})`.
- **Foto sticky com pilha de folhas:** `.col{position:sticky;top:7.5rem}` dentro de wrapper alto; 2 pseudo-elementos `rotate(±5deg)` atrás. Zero JS.
- **Cortina clip-path pinned (story):** wrapper `height:N*60vh`; filho `position:sticky;top:0;height:100vh`; `fromTo(inner,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0)'},scrub)` nos primeiros 20% do trigger; troca de itens por timeline `scrub` com `opacity 1→0` e `autoAlpha` stagger; saída em colunas = N divs de 1/6 de largura com `scaleY 1→0 origin top` em stagger.
- **Escada de cards:** `gsap.fromTo(cardEsq,{y:-160},{y:0,scrollTrigger:{scrub:true,start:'top bottom',end:'bottom top'}})`, idem `+160` à direita.
- **Título com scale + letras subindo:** `fromTo(h,{scale:1.6},{scale:1})` + chars em máscara `overflow:hidden`, `yPercent:100→0`, stagger .02; um único ScrollTrigger scrub de ~500px.
- **Fade de bloco / pilares:** `y:60→0, opacity:0→1`, `scrollTrigger:{start:'top 85%',end:'+=250',scrub:true}` (ou `once` + ease `power3.out` .6s se preferir não-scrub; spring ≈ `power3.out`).
- **Nav invertendo sobre seção escura:** ScrollTrigger `onToggle` adiciona `data-tema="escuro"` na nav; CSS troca cor e crossfade do logo (.3s).
- **Contador:** `gsap.to(obj,{val:n,snap:{val:1},onUpdate})` em `once` quando entra.
- **Faixa de imagens / marquee:** `x` scrub clamp, ou CSS `@keyframes` translateX(-50%) linear infinite com lista duplicada.
- **Linhas assentando (C):** `y:90→0` por linha, `power4.out`, stagger .1, scrub curto ou `toggleActions`.
- **Lenis:** `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(t=>lenis.raf(t*1000))`; `lagSmoothing(0)`. Respeitar `prefers-reduced-motion` com `gsap.matchMedia()`.
