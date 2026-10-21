# Prompts de imagem — redesenho (21/10/2026)

Para gerar no ChatGPT (gerador de imagem). Fora daqui: fotos do Juscelino,
da Beatriz e o banner do hero, que continuam os atuais.

## Como usar

1. Abra uma conversa nova e cole primeiro o **bloco de estilo**. Ele vale
   para todas as imagens; mandar antes faz a série sair com a mesma luz e a
   mesma paleta.
2. Depois mande um prompt por vez, na ordem. Peça a proporção indicada.
3. Salve com o nome de arquivo indicado (JPG, o maior tamanho que ele der)
   e me mande a pasta. Eu recorto, comprimo e gero AVIF/WebP.

Regra do cliente: **nenhuma cor é aplicada por cima de foto no site**
("nunca coloque", commit `80d73a2`). Por isso a paleta precisa sair da
própria imagem: fundos e luz em azul-marinho, com o vinho só como detalhe.

## Bloco de estilo (cole antes de tudo)

```
I'm going to ask you for a series of photographs for a law firm website.
Every image in the series must share this exact style:

- Editorial still-life photography, shot on a medium-format camera
  (Hasselblad X2D, 80mm), f/2.8, shallow depth of field, real film grain,
  natural imperfections. It must look like a real photograph by a
  commercial photographer, never like CGI or a 3D render.
- Lighting: a single soft directional window light from the left, deep
  soft shadows, calm and quiet mood, late afternoon.
- Palette: deep navy blue (#0B1E3F) and ink blue (#004369) dominate the
  shadows and backgrounds; warm off-white paper tones in the highlights;
  a single small accent of deep wine red (#9B1C2E) somewhere in the frame,
  never more than 5% of the image.
- Composition: minimal, lots of negative space, one clear subject,
  slightly off-center. Premium and restrained, like an Apple product page
  or a Kinfolk magazine spread.
- No people's faces. Hands are allowed only when the prompt asks.
- Absolutely no text, letters, numbers, logos or watermarks anywhere.
- No legal clichés: no gavels, no scales of justice, no Lady Justice
  statues, no handshake, no courtroom.

Reply only "ok" and wait for the first prompt.
```

---

## 1. Áreas de atuação (6 imagens · retrato 4:5)

Aparecem quando a linha do acordeão abre, ao lado do título do tema.

**1.1 · `area-bens.jpg` — Bens**
```
Portrait 4:5. A single brass house key and a folded architectural floor
plan resting on a dark navy linen tablecloth. Window light rakes across
the paper, revealing its texture. A small wine-red wax seal on the corner
of the plan. Calm, quiet, lots of dark negative space at the top.
```

**1.2 · `area-familia.jpg` — Família**
```
Portrait 4:5. An old leather-bound family photo album, closed, with a
pair of reading glasses resting on it, on a wooden table in deep shadow.
A thin wine-red ribbon bookmark hangs out of the album. Soft window light
on the leather. Warm, intimate, no faces, no visible photos.
```

**1.3 · `area-empresa.jpg` — Empresa**
```
Portrait 4:5. Two fountain pens lying parallel on top of a closed navy
blue hardcover document folder, on a dark walnut boardroom table. Behind,
out of focus, the edge of a leather chair and a tall window. One pen has a
wine-red barrel. Composed, serious, symmetrical.
```

**1.4 · `area-contratos.jpg` — Contratos**
```
Portrait 4:5. A thick stack of cream-colored paper documents bound with a
black binder clip, a fountain pen uncapped on top, on a deep navy desk
surface. Raking window light shows the paper edges in fine detail. A tiny
wine-red tab sticks out of the stack. No readable text on the pages.
```

**1.5 · `area-dados.jpg` — Dados**
```
Portrait 4:5. A sleek dark aluminum laptop, half closed, on a navy desk,
with a faint cool glow from the screen leaking through the gap and
lighting the desk surface. Next to it a small closed padlock in matte
black. Night mood, deep blue tones, one small wine-red cable.
```

**1.6 · `area-presenca.jpg` — Presença digital**
```
Portrait 4:5. A smartphone lying face down on a dark navy fabric surface,
its screen light spilling softly around its edges, next to a small brass
stamp seal. Minimal, mysterious, deep shadows, a small wine-red detail on
the stamp handle.
```

---

## 2. Como trabalhamos (4 imagens · retrato 3:5)

Fundo dos quatro cartões, com o número grande por cima e o texto embaixo.
**Deixe o terço de baixo escuro e calmo**: é onde o texto branco vai ficar.

**2.1 · `passo-escreve.jpg` — Você escreve**
```
Portrait 3:5. Close-up of a hand writing a short note with a fountain pen
on cream paper, seen from above at an angle, deep navy desk around it.
The lower third of the frame falls into soft dark shadow. Window light
from the top left.
```

**2.2 · `passo-conversa.jpg` — A conversa**
```
Portrait 3:5. Two ceramic coffee cups on a dark wooden table, one in front
of each empty chair, seen from slightly above. Soft steam rising from one
cup. Deep navy shadows, warm highlight on the cups. The lower third is
dark and calm.
```

**2.3 · `passo-opcoes.jpg` — As opções**
```
Portrait 3:5. Three cream index cards laid side by side on a navy desk,
the middle one slightly pulled forward, a pencil resting next to it. Seen
from above. No text on the cards. The lower third falls into dark shadow.
```

**2.4 · `passo-caso-anda.jpg` — O caso anda**
```
Portrait 3:5. A smartphone on a dark desk with its screen lit, showing
only a soft abstract blue glow (no interface, no text), next to an open
paper planner with a wine-red ribbon. Evening, calm, deep blue. The lower
third is dark.
```

---

## 3. Fundo das perguntas na home (1 imagem · paisagem 16:9)

Fica parado atrás dos cartões de pergunta. Precisa ser **muito escuro**:
texto branco e cartões passam por cima.

**3.1 · `fundo-perguntas.jpg`**
```
Landscape 16:9. A dark, almost black interior of a quiet library at
night, rows of book spines barely visible, one narrow beam of cool moon
light crossing the frame diagonally and catching floating dust. Very low
key, 85% of the image near black navy. No text readable on the spines.
```

---

## 4. Página O escritório (3 imagens)

**4.1 · `escritorio-historia.jpg` — fundo da história (paisagem 16:9)**
Fica parado atrás da linha do tempo de como eles se conheceram (UEM →
mesmo escritório → sociedade). Muito escuro.
```
Landscape 16:9. A long empty university corridor at dusk, seen in deep
perspective, tall windows on one side throwing soft cool light on a
polished floor. Very dark navy overall, one warm wine-red exit light far
at the end. Quiet, cinematic, nobody in the frame.
```

**4.2 · `escritorio-valores.jpg` — valores (paisagem 4:3)**
```
Landscape 4:3. A calm meeting table set for a conversation: two glasses
of water, a closed notebook and a pen, in a minimal room with a big
window and a sheer curtain, soft daylight, navy walls, warm wood. A small
wine-red book on the table. Welcoming, human, no people.
```

**4.3 · `escritorio-simbolo.jpg` — fecho da página (quadrado 1:1)**
Peça-objeto no lugar da "flor 3D" vermelha da referência. **Anexe o
arquivo `public/media/marca/mono-azul.png` junto com este prompt.**
```
Square 1:1. Using the attached monogram as the exact shape, create a
physical sculpture of it: the monogram cut from a single thick piece of
polished dark navy glass with soft beveled edges, standing upright on a
warm off-white surface, studio light from the left, gentle caustic
reflections on the surface in a hint of wine red. Product photography,
clean off-white background, lots of space around it.
```

---

## 5. Página Contato (1 imagem · retrato 4:5)

**5.1 · `contato-lateral.jpg`**
Ao lado do formulário.
```
Portrait 4:5. An elegant desk by a window at blue hour: an open notebook
with a fountain pen, a smartphone face down, and a cup of coffee, the city
of Maringá softly out of focus through the glass (modern buildings, trees,
a tall slender cathedral spire far away). Deep navy tones inside, warm
lights outside. Inviting and calm.
```

---

## Depois de gerar

Pasta sugerida: `public/media/novas/` com os nomes acima. Me avise e eu
coloco cada uma no lugar, com recorte e compressão.
