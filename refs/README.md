# refs/ — clones de referência

Baixados em 11/09/2026 com a skill `clonar-site` (wget, uma página + assets).
**Material de estudo, não versionado** (`refs/` está no `.gitignore`).

Servir qualquer um:

```bash
cd refs/NOME && python3 -m http.server 8000
```

| Pasta | Site | Tamanho | Stack / animação |
|---|---|---|---|
| `balera/` | balera.com.br | 4.9M | WordPress + Divi · Swiper · 3 `.mp4` de hero |
| `martinelli/` | martinelli.adv.br | 44M | WordPress + Elementor Pro · Swiper (e-swiper) |
| `japontelaw/` | japontelaw.com | 42M | WordPress · Slick · fontes Typekit |
| `bergeson/` | be-law.com | 1.8M | WordPress (tema PaperStreet) · `sliders.js` · fonte Outfit self-hosted |
| `arauz/` | arauz.com.br | 4.6M | WordPress + WP Rocket · parallax do próprio tema |
| `oliveirapitta/` | oliveirapitta.adv.br | 13M | custom · Swiper bundle · AOS · fonte Tomato Grotesk |
| `moreiracruz/` | moreiracruz.com | 5.7M | WordPress + Elementor · AOS |
| `medina/` | medina.adv.br | 3.2M | Joomla · Smart Slider 3 (`n2.min.js`) |
| `apple/` | apple.com/br | 28M | build próprio (`september-event2026.built.js`) |
| `cocacola/` | coca-colacompany.com | 15M | Adobe AEM · Swiper + Slick · marquee em CSS |

Nomes de arquivo com `@ver=` são efeito do `--restrict-file-names=windows`
(troca `?` por `@`). São `.js` e `.css` normais.

## Nenhum usa GSAP, Lenis, Locomotive ou Framer Motion

Dez sites, zero. O movimento é todo AOS, Swiper, Slick e parallax de tema —
scroll reveal e carrossel. Confirma a leitura de `docs/REFERENCIAS-CLIENTE.md`:
o gosto do Juscelino por movimento é discreto.

## O marquee da Coca-Cola

É o único efeito que ele citou por nome (*"as frases se movem horizontalmente"*).
Mora em `cocacola/static-*/**/theme.css` — são 4 linhas de CSS, sem biblioteca:

```css
@keyframes marquee       { 0% { transform: translateX(0)     } to { transform: translateX(-50%) } }
@keyframes marquee-left  { 0% { transform: translateX(0)     } to { transform: translateX(-50%) } }
@keyframes marquee-right { 0% { transform: translateX(-50%)  } to { transform: translateX(0)    } }

.state_theme    { animation: marquee 20s linear infinite; display: flex; gap: 20px; white-space: nowrap }
.marquee-left   { animation-direction: normal }
.marquee-right  { animation-direction: reverse }
```

A técnica: duplicar o conteúdo, animar até `-50%` e repetir — o loop fica
invisível. Linhas alternadas usam `animation-direction: reverse` para correr em
sentido contrário. Duração entre **20s e 25s**, `linear`, infinito.

Se o B&M usar isso, é com uma faixa só, devagar, e com
`@media (prefers-reduced-motion: reduce) { animation: none }`.
