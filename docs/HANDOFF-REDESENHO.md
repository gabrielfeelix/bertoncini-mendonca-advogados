# Handoff: o redesenho visual

> Escrito em 12/09/2026, ao fim da sessão que redesenhou a home e
> `/escritorio/`. Para o agente que continua.
>
> **Leia antes, nesta ordem:**
> 1. `docs/PLANO-REDESENHO.md` — a direção, as quatro decisões e as tarefas.
> 2. `docs/REFERENCIAS-CLIENTE.md` — o que o cliente gostou, na palavra dele.
> 3. `docs/BRIEFING-RESPOSTAS.md` — o conteúdo, que **não se refaz**.
>
> O `docs/HANDOFF-SITE.md` continua valendo para tudo que **não** é visual:
> estado das 15 tarefas originais, RLS não provada, pendências do briefing.
> Ele tem um aviso no topo apontando para cá.
>
> **Se for fazer só uma coisa:** as páginas de área
> (`src/pages/areas/[slug].astro`). É onde sobrou o maior ganho — 24
> parágrafos e 1 imagem —, e a decisão pendente que ela exige está descrita
> em "O que falta".

---

## Em uma frase

A home e `/escritorio/` foram redesenhadas. O que **ainda está no visual
antigo**: páginas de área, `/contato/`, `/textos/` e as políticas.

---

## Comece por aqui

```bash
npm run dev          # num terminal, deixe rodando
npm run verifica     # noutro, DEPOIS de cada mudança de layout
npm run check        # tipos e Astro
```

`npm run preview` **não funciona** neste projeto (adaptador Vercel em modo
server). Nunca teste contra `/previa` — é página de trabalho não
versionada, e três defeitos Críticos já passaram por isso.

**Os arquivos que importam para o visual:**

| Onde | O que é |
|---|---|
| `src/styles/tokens.css` | Cores e medidas. `--papel` e a largura da coluna são do redesenho |
| `src/styles/base.css` | `.env` (coluna de 1500px), `.secao`, `.display`, `.botao` |
| `src/layouts/Base.astro` | `heroSobreposto`, a reserva de espaço da navbar |
| `src/components/Hero.astro` | Primeira dobra e o encolhimento (leia as armadilhas antes) |
| `src/components/Ficha.astro` · `Trajetoria.astro` | O repertório novo |
| `src/components/Areas.astro` | O mosaico de blocos |
| `tools/verifica.mjs` | O portão. Leia o cabeçalho dele |

**Antes de escrever CSS novo**, veja se `Ficha` ou `Trajetoria` já
resolvem. O plano pede poucas decisões aplicadas com consistência, não
componentes novos a cada página.

---

## A receita, do que já funcionou duas vezes

Tanto a home quanto `/escritorio/` seguiram o mesmo caminho. Para a
próxima página:

1. **Capture a página como ela está**, em 1600px e em 390px. Olhe. O
   diagnóstico sai da imagem, não do código.
2. **Conte o que existe**: quantos parágrafos seguidos, quantas peças
   visuais. Se houver mais de três `<p>` em sequência, ali há trabalho.
3. **Procure a estrutura que o dado já tem** e o layout joga fora. Na
   trajetória do Juscelino eram cinco posições dentro de um parágrafo; no
   corpo das áreas são nove blocos temáticos dentro de um array. **O
   conteúdo não se reescreve — só se deixa a forma respeitar o que ele já
   é.**
4. **Aplique o vocabulário** (placas, três superfícies, relevo por cor).
   Reuse o repertório.
5. **Capture de novo, nas duas larguras.** O celular quebra de um jeito
   que o desktop não mostra — foi assim nas duas páginas.
6. **Rode o portão.** Depois `npm run check` e `npm run build`.
7. **Commit em português**, explicando o *porquê* de cada decisão, não só
   o quê.

---

## O que foi feito

| Commit | O quê |
|---|---|
| `e7fc844` | Tarefa 0: o portão passa a cobrar contraste AA e tamanho da OAB |
| `fa10d9b` | Primeira dobra: foto dos sócios, navbar sobreposta, placa que encolhe |
| `7289599` | O encolhimento passa a começar no primeiro scroll; parallax removido |
| `31aae40` | Resto da home: mosaico de áreas, faixa em placa, método em cartões |
| `139651f` | `/escritorio/`: abertura com imagem, história em blocos, `Ficha` e `Trajetoria` |
| `99be540` | Retratos reais dos sócios, otimizados (moldura recortada, brilho na imagem) |

Estado: **11 rotas passam no `npm run verifica`**, `astro check` sem erros,
build limpo. Nada foi enviado (sem push, sem deploy), como manda a regra.

---

## O vocabulário visual — as quatro decisões

Estas quatro, e **só** estas quatro. Se aparecer uma lista de oito
"elementos de assinatura", o plano foi traído — o cliente levantou esse
risco explicitamente e ele está registrado no plano.

**1. Seções são placas, não faixas.** Cantos arredondados, margem em volta,
fundo aparecendo nas bordas. É a decisão estruturante, do Neural Atlas (a
referência favorita do cliente). Já aplicada no hero e na Faixa.

**2. Três superfícies: branco, azul chapado (`--tinta`), papel
(`--papel`).** O azul sem degradê — o `radial-gradient` que misturava
`--apoio` com `--imperial` foi removido. O papel entra em **componentes,
nunca como fundo de seção**: papel como tema é o creme do Oliveira Pitta,
concorrente na mesma cidade.

**3. Hierarquia por cor dentro da frase.** Dois pesos na mesma linha, como
na Adrian Vale. Ainda **não aplicado** — é oportunidade nas páginas
internas.

**4. Composição em quatro cantos na primeira dobra**, menu sobreposto.

### Formas que saíram, e não devem voltar

- **Corte diagonal** (`clip-path: polygon(...)`) nas seções. Brigava com a
  placa arredondada; duas linguagens de forma na mesma página era o que
  fazia as seções parecerem coladas de lugares diferentes.
- **Degradê azul+vermelho** em fundo de seção.
- **Véu de cor sobre a foto do hero.** O cliente foi explícito: *"não
  coloca cor em cima da capa, quero que a capa seja essa cor, ponto"*.
  Contraste vem de `text-shadow` e escurecimento **neutro** (preto
  transparente, nunca azul) só nas bordas onde há texto.
- **Parallax do hero** e **vídeo que seguia o cursor** (`.espia`).

---

## Componentes do repertório (reusáveis)

Criados no redesenho e prontos para as páginas que faltam:

| Componente | O que faz | Onde já está |
|---|---|---|
| `Ficha.astro` | Dado tabular em cartões (`<dl>` por dentro). Tem variante de destaque, usada na OAB. | Registro da sociedade em `/escritorio/` |
| `Trajetoria.astro` | Barras que expandem, `<details>` nativo, sem JS. | Trajetória do Juscelino |

Os dois usam `--papel` como material de componente. Ambos com 44px de
alvo, contraste conferido e desligados sob `prefers-reduced-motion`.

**Ainda não existem, e o plano previa:** mosaico de blocos como componente
(hoje vive dentro de `Areas.astro`), faixas verticais numeradas, e a forma
que articula duas seções (LexCore).

---

## Armadilhas medidas nesta sessão

Estão aqui porque custaram tempo e **voltam se alguém repetir o raciocínio**.

### 1. `animation-timeline` não serve para o hero

Tentei três variantes, todas medidas na página real antes de decidir:

| Variante | O que aconteceu |
|---|---|
| `view()` + `animation-range: exit 0%` | `--encolhe` travado em 0 até **900px** de rolagem. O cliente rolava três vezes e nada acontecia. |
| `scroll()` | Mede o documento inteiro: 5% de encolhimento em 300px. Lento demais. |
| `view()` + `animation-range: cover` | O trilho já nasce cobrindo a tela, então o intervalo já estava completo em y=0: a placa nascia encolhida. |

**Nenhum `animation-range` descreve "quanto a página rolou desde o topo"
para um elemento que já nasce cobrindo a tela** — que é exatamente o que
este efeito precisa. Por isso o caminho nativo saiu e ficou só o JS.
Não reintroduza o nativo achando que é otimização.

### 2. O encolhimento é por `scale()`, não por margem

Duas tentativas por margem deixaram **faixa branca no topo**: margem
empurra o elemento e abre vão de um lado antes do outro. `transform:
scale()` encolhe a partir de um ponto de origem sem tirar nada do lugar.
É o mecanismo de `prototipo/v2/index.html`, que o cliente apontou como a
versão em que isso já estava certo.

### 3. Capturas com `scrollTo()` mentem

`window.scrollTo()` pula direto para a posição e o efeito aparece
"pronto". Foi assim que o atraso de 900px passou despercebido em três
rodadas de captura. **Use `pg.mouse.wheel(0, 100)`** para simular scroll
real quando for verificar movimento.

### 4. A faixa branca do `<main>`

`padding-top: 88px` no `<main>` (Base.astro) reservava espaço para a
navbar fixa — e esse padding é branco. Era a causa dos três sintomas que o
cliente apontou: faixa branca, primeira dobra maior que uma tela
(`100svh` + 88px), e barra parecendo pregada. Hoje a reserva é controlada
por `heroSobreposto`; **só a home usa**. Em página sem hero a barra
continua opaca e o `<main>` continua reservando — sem isso o texto nasce
atrás da barra.

---

## O portão (`npm run verifica`)

```bash
npm run dev        # num terminal
npm run verifica   # noutro
```

`npm run preview` **não funciona** neste projeto (adaptador Vercel em modo
server).

**Correção importante do handoff anterior:** ele afirmava que o portão
cobra os cinco requisitos. **Não cobrava** — contraste e tamanho da OAB
estavam de fora. Agora cobra, e foi a primeira coisa feita nesta sessão.

Ele achou **dois defeitos reais** no primeiro uso:

1. **O link "Ver as áreas em detalhe" era invisível na home** — branco
   sobre branco, 1.00:1. `SaibaMais` com `escuro` só trocava a cor do
   texto e herdava o fundo de quem o contivesse; na home isso era o branco
   da página, não o azul da seção, que termina num corte diagonal logo
   acima. Confirmado em captura antes de corrigir.
2. **O aviso de placeholder no rodapé** em `--imperial` sobre azul:
   2.04:1. Vermelho escuro só passa sobre branco (8.6:1, que é como a OAB
   aparece nas páginas).

### `data-contraste="externo"` — leia antes de usar

Texto sobre foto **não é medível** por `getComputedStyle`, que devolve a
cor declarada e não o pixel atrás. Em vez de afrouxar a checagem, esse
atributo declara a condição e o verificador pula o elemento.

**Quem marca assume a responsabilidade pelo contraste.** Hoje está em dois
lugares: o `.env` do hero e a navbar quando sobreposta (só em `/`). Não
espalhe — cada uso é um trecho que o automático deixou de cobrir. Nos dois
casos a legibilidade é garantida por `text-shadow` e pelo escurecimento
das bordas.

### O que o portão ainda NÃO cobre

- Contraste de texto sobre imagem, vídeo ou degradê (declarado acima).
- Leitor de tela real. **Continua pendente e é de pessoa, não de agente.**

---

## A imagem do hero

O cliente gerou com IA a partir de um prompt desta sessão. Fonte em
`public/media/hero/socios-hero.png` (1672×941, 1.6 MB), derivados gerados
com `sharp`:

- **Desktop 16:9**: `socios-{900,1200,1600}.{avif,webp}` + `.jpg` de
  fallback. 33 KB em AVIF na maior largura.
- **Celular 4:5**: `socios-vert-{600,800}.{avif,webp}` — recorte que
  preserva as duas pessoas. A 390px o corte de uma 16:9 as perderia.

**Para regerar** (se a foto mudar), o prompt que funcionou está no
histórico da conversa; o essencial é: 16:9 horizontal, espaço negativo à
esquerda para o texto, fundo azul-marinho, luz suave sem contraste duro, e
**sem balança, livro de direito, martelo ou coluna** (o clichê que a
pesquisa do projeto marcou como o que todo mundo faz).

> **Ressalva registrada:** a foto é gerada por IA com o rosto dos sócios,
> num escritório que não existe (eles usam coworking — briefing q2.6). Não
> é questão de OAB, mas **os sócios precisam aprovar** antes de publicar.

---

## O que falta — na ordem

### ~~1. `/escritorio/`~~ — FEITA (`139651f`)

Abertura com imagem, história em três blocos, `Ficha` no registro e
`Trajetoria` nas cinco posições do Juscelino.

**Os retratos são os reais** (`public/media/socios/`), otimizados em
AVIF/WebP. A foto da Beatriz tinha uma moldura preta desenhada na própria
imagem, recortada, e era muito escura — o brilho saiu do CSS e passou para
a imagem. (Registro de um erro meu: o handoff dizia antes que eram stock.
Não são.)

**O que ficou de fora:** o título intercalado na grade de retratos
(Bergeson) — a seção "Quem assina" continua com o layout de `Socios.astro`
herdado do protótipo. É a oportunidade mais clara que sobrou nesta página.

**Cuidado ao mexer:** a OAB é 22px aqui e 19px na home. A nota de
especificidade em `Socios.astro` (`.par .oab.grande`) precisa sobreviver —
aquele bug em que a regra da home derrubava a do escritório vai querer
voltar. O portão agora pega sozinho.

### 1. Páginas de área (24 parágrafos, 1 imagem)

Onde o ganho é maior. Os 9 parágrafos do corpo de `direito-digital.json`
são 9 blocos temáticos distintos — a estrutura já está no dado, o layout
atual é que a joga fora.

**Decisão pendente do Gabriel:** acrescentar ao schema um campo opcional
de rubrica por parágrafo, ou derivar dos `assuntos` por ordem (batem quase
um a um). O campo opcional é mais robusto e **não altera uma palavra do
texto**. Ainda não houve OK.

### 2. Tarefa 2 do plano — a escala tipográfica

**Não foi feita.** Números medidos nesta sessão (o handoff antigo diz 35,
que era a contagem do protótipo):

| | declarações abaixo de 18px |
|---|---|
| site público | **72** |
| painel (interno) | 13 |
| e-mail em `brevo.ts` | 3 |

Recomendação registrada no plano: **três faixas** — corpo a 18px sem
exceção, interface com piso de 16px, cauda de 12–13px eliminada. Executar
trocando valores fixos por variáveis (`--corpo`, `--corpo-apoio`,
`--interface`, `--legenda`), para a decisão virar quatro números num lugar
só.

### 3. `/contato/`, `/textos/`, políticas

Herdam o repertório.

### 4. Tarefa 15 do plano original

Varredura de voz, inventário de placeholders, Lighthouse, README.

---

## Pendências que não são de agente

- **Revisão jurídica** do conteúdo das duas áreas novas — foi escrito por
  agente, numa sessão, e não passou por advogado.
- **Teste com leitor de tela real** (NVDA/VoiceOver) antes de publicar.
- **Aprovação da foto** pelos sócios (ver ressalva acima).
- **RLS não provada em execução** — ver `docs/HANDOFF-SITE.md`.
- **As referências da Beatriz nunca chegaram.** Toda a direção visual saiu
  das referências de **um** dos dois sócios. O Gabriel decidiu não esperar.
- **Dados que não existem**: OAB de cada sócio, CNPJ, registro da
  sociedade, telefone, e-mail, domínio. Marcados `data-placeholder="1"`.

---

## Como o cliente trabalha

Registrado porque muda o modo de conduzir a sessão.

O Gabriel manda referência, diz o que gosta e o que não gosta, e corrige
**durante** a execução — várias vezes no meio de um turno. Vale:

- **Mostrar, não descrever.** Texto sobre design é fácil de concordar e
  difícil de acertar. Capturar a tela e olhar acha problema que a leitura
  de código não acha.
- **Medir antes de afirmar.** O atraso de 900px no encolhimento só
  apareceu instrumentando a página; três rodadas de captura tinham passado
  por cima dele.
- **Aceitar a correção sem defender o que foi feito.** Ele estava certo
  nas três vezes em que disse que algo estava ruim.

---

## Regras que continuam valendo

- Commit por tarefa, na `main`, **sem push e sem deploy**. Mensagem em
  português, no formato do histórico.
- **Não mexer em `prototipo/`** — mas `prototipo/v2/index.html` é
  referência útil: é de onde veio o mecanismo do encolhimento.
- **Nunca inventar dado real.** Placeholder marcado.
- **Provimento 205/2021.** Proibido: depoimento de cliente, caso de
  sucesso, número de processos, "consulta gratuita", "especialista" sem
  título, superlativo, urgência, promessa de resultado, menção a tamanho.
  Obrigatório: OAB de cada sócio e registro da sociedade visíveis.
  **Três das quatro referências de conceito que o cliente mandou usam
  taxa de êxito** — a forma serve, o conteúdo não.
- **Não acrescentar áreas.** Quatro é o teto.
- **O blog se chama "Em português claro"**, nunca "Blog".
- Testar contra o que `npm run build` emite, nunca contra `/previa`.
- Público de 70 anos: 44px em largura **e** altura, contraste AA, tudo
  legível e clicável **sem JS**, `prefers-reduced-motion` desliga todo
  movimento.
