# Handoff: o redesenho visual

> Escrito em 12/09/2026, ao fim da sessão que executou as Tarefas 0 e 1 de
> `docs/PLANO-REDESENHO.md`. Para o agente que continua.
>
> **Leia antes:** `docs/PLANO-REDESENHO.md` (a direção e as tarefas),
> `docs/REFERENCIAS-CLIENTE.md` (o que o cliente gostou, na palavra dele),
> `docs/BRIEFING-RESPOSTAS.md` (o conteúdo, que não se refaz).
>
> O `docs/HANDOFF-SITE.md` continua valendo para tudo que **não** é visual:
> estado das 15 tarefas originais, RLS não provada, pendências do briefing.

---

## Em uma frase

A home foi redesenhada por inteiro. O resto do site (`/escritorio/`,
páginas de área, `/contato/`, `/textos/`, políticas) **ainda está no visual
antigo** e agora destoa dela — é o próximo trabalho.

---

## O que foi feito

| Commit | O quê |
|---|---|
| `e7fc844` | Tarefa 0: o portão passa a cobrar contraste AA e tamanho da OAB |
| `fa10d9b` | Primeira dobra: foto dos sócios, navbar sobreposta, placa que encolhe |
| `7289599` | O encolhimento passa a começar no primeiro scroll; parallax removido |
| `31aae40` | Resto da home: mosaico de áreas, faixa em placa, método em cartões |

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

### 1. `/escritorio/` (30 parágrafos, 3 imagens)

A página mais pesada de texto do site. Consome:
- **ficha** para o registro da sociedade (hoje `<dl>` corrido) e formação;
- **barras que expandem** (Moreira Cruz) para a trajetória do Juscelino,
  hoje um parágrafo com cinco posições dentro;
- **título intercalado na grade de retratos** (Bergeson).

**Cuidado:** a OAB é 22px aqui e 19px na home. Preservar a nota de
especificidade em `Socios.astro` (`.par .oab.grande`) — aquele bug em que
a regra da home derrubava a do escritório para 19px vai querer voltar. O
portão agora pega sozinho.

### 2. Páginas de área (24 parágrafos, 1 imagem)

Onde o ganho é maior. Os 9 parágrafos do corpo de `direito-digital.json`
são 9 blocos temáticos distintos — a estrutura já está no dado, o layout
atual é que a joga fora.

**Decisão pendente do Gabriel:** acrescentar ao schema um campo opcional
de rubrica por parágrafo, ou derivar dos `assuntos` por ordem (batem quase
um a um). O campo opcional é mais robusto e **não altera uma palavra do
texto**. Ainda não houve OK.

### 3. Tarefa 2 do plano — a escala tipográfica

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

### 4. `/contato/`, `/textos/`, políticas

Herdam o repertório.

### 5. Tarefa 15 do plano original

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
