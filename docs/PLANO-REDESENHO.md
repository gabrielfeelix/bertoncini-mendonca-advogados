# Plano do redesenho visual

> Escrito em 12/09/2026, depois da conversa em que o Gabriel trouxe seis
> referências e nomeou o defeito. Substitui a direção que eu havia proposto
> no começo daquela conversa, que estava errada — ver "O que mudou" abaixo.
>
> **O conteúdo não se refaz.** Texto de área, bios, história da sociedade,
> perguntas frequentes e políticas ficam como estão. O que muda é a forma
> que os apresenta.

---

## 1. O diagnóstico, na palavra do Gabriel

> *"O site está com muita cara de inteligência artificial. Pra você
> entender o que é cara de inteligência artificial: essa tipografia, a
> gente só tem tipografia. O que dá um aspecto bonito pro site normalmente
> é a presença de imagens, ilustrações, de componentes visuais. E aí
> quando falta isso, fica só texto texto texto."*

A medida, contada no HTML que o build emite:

| Rota | Parágrafos | Imagens | SVG |
|---|---|---|---|
| `/areas/planejamento-patrimonial-e-sucessorio/` | 24 | 1 | 5 |
| `/escritorio/` | 30 | 3 | 4 |
| `/areas/` | 11 | 1 | 6 |

Os SVG são setas de interface, não peça gráfica.

### O que mudou na minha leitura

Minha primeira proposta tratou isso como **problema de organização de
texto**: dar rubrica aos parágrafos, agrupar em blocos, criar um índice
lateral. Isso reduz massa, mas **não resolve o que ele apontou** — no fim
ainda é texto, só que mais bem arrumado.

As seis referências mostraram o que é de fato: **problema de forma.**

**Nenhuma das seis empilha faixas de conteúdo.** Todas constroem a página
com objetos que têm forma própria — placas, cápsulas, blocos de cor,
faixas verticais. O nosso site empilha faixas. É literalmente isso a
"cara de inteligência artificial": conteúdo correto, dentro de nada.

### O aperto real, que a direção precisa respeitar

O acervo visual do site é: **dois retratos, dois vídeos, um logo.** Só.

Um redesenho que dependa de fotografia esbarra nisso em duas páginas. Por
isso a direção escolhida é a que as referências provam ser possível:
**presença visual construída com cor, forma e composição, sem exigir mais
imagem.** O mosaico de áreas do Oliveira Pitta e as faixas verticais da
Adrian Vale são as duas demonstrações mais diretas — a primeira não tem
nenhuma imagem, a segunda tem uma só em quatro faixas.

---

## 2. As referências e o que sai de cada uma

Fonte: `docs/REFERENCIAS-CLIENTE.md` (12 links do Juscelino, 11/09) e as
quatro imagens de conceito que o Gabriel trouxe na conversa. Os dez sites
estão clonados em `refs/` (fora do versionamento) — **foram abertos em
navegador nesta análise**, ao contrário do levantamento anterior, que foi
só leitura de HTML/CSS e diz isso textualmente.

### Neural Atlas — o favorito declarado do cliente

> *"acho que esse foi meu favorito"* — Juscelino, 13:56 e 14:09
> https://dribbble.com/shots/27445476-Neural-Atlas-Website

É a referência mais importante das seis, e a que estrutura o plano inteiro.

**1. Navegação em cápsula flutuante.** O menu é um grupo de pílulas
centralizado que flutua **sobre** o conteúdo em todas as seções — sobre o
hero claro, sobre o cinza, sobre o verde, sobre o preto. Nunca ganha uma
barra própria. A pílula ativa muda conforme a seção.

**2. Seções são placas arredondadas sobre um fundo.** Cada seção é um
retângulo de cantos arredondados, com margem visível em volta, assentado
sobre um fundo que aparece nas bordas. A seção seguinte é outra placa, com
cor própria. É isto que faz o site parecer "tecnológico" sem nenhum efeito:
as seções são **objetos empilhados**, não faixas coladas.

**3. Fundo em tom de papel, um acento só.** O fundo é um cinza-claro
levemente esverdeado; o acento (verde) aparece em dois lugares apenas.

**O que NÃO vem:** verde néon, campo de partículas, fumaça, produto 3D, e
os números de performance. É linguagem de produto de tecnologia e ficaria
ridículo num escritório de advocacia.

### Brian Anderson — o full viewport

O cabeçalho está **dentro** da imagem, não acima dela. A foto começa no
topo absoluto da tela e o menu flutua por cima, transparente. O conteúdo se
distribui nos **quatro cantos** — título embaixo à esquerda, apoio em cima
à direita, assinatura no rodapé, ação embaixo à direita — deixando o meio
livre. As cores saem todas da própria foto, com um acento único.

**O que NÃO vem:** "96% Success Rate" e "150+ Successful Cases" — taxa de
êxito e volume de casos, vedados pelo Provimento 205/2021.

### Adrian Vale — o relevo tipográfico

**Dois pesos de cor na mesma frase:** "TRUSTED LEGAL REPRESENTATION" em
branco seguido de "BACKED BY EXPERIENCE & PROFESSIONAL INTEGRITY" em cinza
escuro — mesmo tamanho, hierarquia feita só por cor. É o que o Gabriel
chamou de *"as fontes brincam mais na página"*. Não custa imagem: custa
decisão.

**Áreas como faixas verticais estreitas**, numeradas `[ 01 ]` a `[ 04 ]`,
com imagem em **apenas uma** delas. Resolve o nosso problema de acervo.

**Rótulos entre colchetes** dão assinatura e custam nada.

**O que NÃO vem:** "15+ Years Experience", "500+ Cases Managed", selos de
certificação. Os círculos como forma servem; o conteúdo deles não.

### LexCore — a forma que articula duas seções

Um selo circular fica na divisa entre a seção clara e a foto escura de
baixo, e **a seção de baixo se acomoda ao redor dele** em vez de passar por
trás. O círculo vira a articulação entre as duas. CSS puro, sem imagem.

### Oliveira Pitta — o mosaico de blocos de cor

Maringá, concorrência direta. As áreas de atuação são um **mosaico de
blocos de alturas desiguais** — uns vinho, uns creme, título grande dentro,
texto embaixo, encaixados como quebra-cabeça. **Sem uma única imagem.**

**Alerta que continua valendo:** creme + vinho é o território que ele já
ocupa na mesma cidade. Vem o mecanismo, não a paleta.

### Medina — o mosaico com imagem, e a aba do sócio

Mesma estrutura de blocos desiguais, com imagem de fundo escurecida. E
**"Professor Medina" é uma aba inteira do menu** — o escritório assume que
a autoridade mora numa pessoa com nome e obra. Para uma sociedade de dois
sócios construindo reputação, é o modelo mais próximo que existe na cidade.

### O traço desenhado (2ª imagem de conceito)

Sublinhado torto, feito à mão, sob palavras-chave. Um SVG de dez linhas.
O carrossel de advogados dessa mesma referência **não vem**: com dois
sócios, expõe o tamanho em vez de resolvê-lo.

---

## 3. A direção

### O que "personalidade" quer dizer aqui, e o que não quer

Registrado porque o Gabriel levantou o ponto e ele é justo:

> *"Toda vez que eu peço pra uma IA uma assinatura, ela leva a ferro e fogo
> e começa a colocar isso em tudo no site, e é sempre muito vergonhoso."*

O erro que ele descreve é tratar personalidade como **tempero que se
espalha**. O que ele pediu é outra coisa: *"tem uma personalidade o site,
ele seguiu uma linha de raciocínio, uma linha mais sóbria, bonita e ainda
assim moderna."* Isso é **coerência de decisões**, não um elemento repetido.

**Regra deste plano:** poucas decisões, aplicadas com consistência. Se em
algum momento houver uma lista de oito "elementos de assinatura", o plano
foi traído. A Adrian Vale não é boa porque tem colchetes nos rótulos; ela é
boa porque tudo ali segue a mesma lógica, e os colchetes são consequência.

### As quatro decisões (e só estas quatro)

**1. Seções são placas, não faixas.** Cantos arredondados, margem em volta,
fundo aparecendo nas bordas. É a decisão estruturante: muda o que uma seção
*é*, e o resto decorre.

**2. Três superfícies: branco, azul da marca, papel.** O azul **chapado**,
sem degradê — decisão do Gabriel:

> *"Colocar um azul, aquele azul da marca mesmo, muito interessante. Não
> colocar aquele degradê de azul com vermelho, mas aquele azul."*

Isso corrige o `radial-gradient` que hoje mistura `--apoio` com
`--imperial` no fundo das áreas. O papel entra **em componentes, não em
seções inteiras** — precisão do próprio Gabriel: *"não sei se
necessariamente em sessões, mas em componentes"*. Papel como tema é o
território do Oliveira Pitta; papel como material de um componente é
discreto e não colide com ninguém.

**3. Hierarquia por cor dentro da frase.** Dois pesos na mesma linha, como
na Adrian Vale. É o recurso que dá relevo sem custar imagem.

**4. Composição em quatro cantos na primeira dobra**, com o menu
sobreposto. A tela inteira é a peça.

### A paleta

Continua a do protótipo aprovado, com duas correções:

| Token | Valor | Papel |
|---|---|---|
| `--tinta` | `#0B1E3F` | azul da marca, chapado |
| `--apoio` | `#004369` | azul de apoio |
| `--imperial` | `#9B1C2E` | acento — **um só**, com parcimônia |
| `--branco` | `#FFFFFF` | superfície neutra |
| `--papel` | **a definir** | superfície de componente (nova) |

Correções: (a) o degradê azul+vermelho sai; (b) entra `--papel`.

---

## 4. Os cinco requisitos — como cada decisão passa

São requisito, não estética. `npm run verifica` cobra parte deles.

| Requisito | Como a direção respeita |
|---|---|
| **OAB legível** (19px home, 22px `/escritorio/`) | Sobe de tamanho. A composição em quatro cantos abre um lugar de destaque na primeira dobra que hoje não existe — é candidato natural, e é a tese do projeto |
| **Alvo de toque 44px** (largura **e** altura) | Pílulas do menu e blocos do mosaico nascem acima de 44px. O gate cobra |
| **Contraste AA** | Toda combinação nova é medida antes de entrar. Ver Tarefa 0 |
| **Sem JavaScript** | `<details>`, `position: sticky`, `:hover`, `:focus-within`, `border-radius`, animação CSS. **Nenhuma das quatro decisões precisa de JS.** Placas que deslizam ao rolar são `sticky` + `border-radius` |
| **`prefers-reduced-motion`** | Kill-switch global já existe; peça nova entra sob ele |

**Tensão declarada:** o público tem 70 anos. Componente pode expandir,
revelar e reagir — mas o que ele mostra tem de estar lá sem isso. Dá mais
trabalho e o resultado é melhor, porque força o componente a ser bom nos
dois estados.

**As referências não têm essas restrições.** São conceitos de Dribbble:
três usam números que a OAB veda e nenhuma precisa funcionar sem JS. Vou
traduzir a forma e recusar parte do conteúdo. As quatro decisões acima
passam todas — nenhuma depende de JS, quebra contraste ou encolhe alvo.

---

## 5. O defeito da primeira dobra

Diagnosticado na conversa, e é a menor correção de maior efeito.

**Causa:** `padding-top: 88px` no `<main>`, em `src/layouts/Base.astro:102`.

O raciocínio de quem escreveu está tecnicamente certo (a navbar é `fixed`,
sai do fluxo, reserva-se o espaço) e **visualmente errado**: esse padding é
branco, e o vídeo começa 88px abaixo do topo.

Três sintomas, um defeito:

1. **A faixa branca** entre cabeçalho e vídeo — é o padding.
2. **A primeira dobra não é full viewport** — o hero é `100svh`
   (`Hero.astro:106`) **mais** os 88px empurrados. Já nasce cortada.
3. **A barra nunca muda de cor** — `background: var(--tinta)` fixo
   (`Navbar.astro:104`), sem regra de transparência no topo. Parece pregada
   em cima do site em vez de fazer parte dele.

**A causa raiz é uma só:** a navbar foi tratada como bloco *acima* do
conteúdo, não como algo *sobreposto* a ele.

**Correção:** menu sobreposto e transparente sobre o hero, ganhando fundo
ao rolar; `<main>` sem reserva de espaço na home. É exatamente o que a
Brian Anderson e o Neural Atlas fazem.

> Vale registrar: a **primeira** referência que o Juscelino mandou e a
> **favorita** dele apontam para o mesmo defeito por caminhos diferentes, e
> o Gabriel chegou nele sozinho reclamando do branco. Três leituras
> independentes, o mesmo ponto. É o melhor sinal de onde começar.

---

## 6. As tarefas

Uma por vez, com `npm run verifica` depois de cada uma
(`npm run dev` num terminal, `npm run verifica` noutro —
**`npm run preview` não funciona neste projeto**).

### Tarefa 0 — Fechar o portão antes de mexer no visual

O `verifica.mjs` **não cobra contraste nem o tamanho da OAB**, apesar de a
documentação afirmar que cobra os cinco. Conferido: ele cobra console,
rolagem, 44px, corpo ≥18px no `<body>`, títulos, meta, alt, links, sem-JS e
reduced-motion.

Acrescentar as duas checagens **antes** de qualquer mudança de layout, para
que o redesenho seja vigiado de verdade nos dois pontos que são exigência
legal. Custa pouco e é a única tarefa que precisa vir primeiro.

### Tarefa 1 — A primeira dobra da home, em três versões

**É a tarefa que decide o resto.** A menor peça que prova a direção
inteira, e é onde está o defeito que o Gabriel apontou primeiro.

Corrige o `padding-top`, o menu sobreposto e o full viewport, e aplica as
quatro decisões em três variantes para ele escolher. Entrego as três lado a
lado para ele apontar — **texto sobre design é fácil de concordar e difícil
de acertar; a gente descobre mais rápido olhando.**

Nada segue enquanto esta não for aprovada.

### Tarefa 2 — A escala tipográfica

Os tamanhos de texto abaixo de 18px, resolvidos junto com o layout porque é
onde custa menos (decisão registrada no handoff).

**Números reais, medidos agora** — o handoff diz 35, que era a contagem do
protótipo; o site cresceu:

| | declarações abaixo de 18px |
|---|---|
| site público | **72** |
| painel (interno, não é site público) | 13 |
| e-mail em `brevo.ts` | 3 |

Distribuição no público: 22 em 16px, 16 em 15px, 11 em 16,5px, 11 em 17px,
e uma cauda de 12–14px (9 casos).

**Recomendação — três faixas, não 18px chapado:**

- **Corpo de texto → 18px, sem exceção.** Prosa que o cliente de 70 anos
  precisa *ler*: bios, respostas das perguntas, corpo das políticas, corpo
  do artigo, resumos. São os 16,5px e 17px e boa parte dos 16px.
- **Interface → piso de 16px.** Rótulos, chips, migalhas, legendas,
  categorias. Não é prosa, é etiqueta: o olho não percorre, reconhece. 16px
  também é o que impede zoom automático no iOS.
- **A cauda de 12–13px morre.** Pequeno demais em qualquer leitura, e são
  poucos casos.

**Por que não 18px em tudo:** 18px numa migalha ou num chip não ajuda
ninguém a ler — engorda o componente, quebra a linha e come o espaço que
deixaria o texto de verdade respirar. A spec diz *"corpo de texto a partir
de 18px"*, e é literalmente isso que está proposto.

**Execução:** trocar os valores fixos por variáveis CSS (`--corpo`,
`--corpo-apoio`, `--interface`, `--legenda`). A decisão vira quatro números
num lugar só, revisável depois mexendo em quatro linhas em vez de 72.

### Tarefa 3 — O repertório de componentes

Os componentes que as páginas passam a consumir. Derivados das referências,
não inventados:

| Componente | De onde | Resolve |
|---|---|---|
| **Placa de seção** | Neural Atlas | A estrutura inteira do site |
| **Mosaico de blocos** | Oliveira Pitta / Medina | Áreas, sem exigir imagem |
| **Faixas verticais numeradas** | Adrian Vale | Áreas com uma imagem só |
| **Ficha** | — | Registro da sociedade, formação, contatos (hoje `<dl>` corrido) |
| **Barras que expandem** | Moreira Cruz | Trajetória do Juscelino (hoje um parágrafo com cinco posições) |
| **Forma que articula seções** | LexCore | Transição entre duas seções |

Todos sem JavaScript, todos acima de 44px, todos sob o kill-switch de
movimento.

### Tarefa 4 — Página de área

Primeiro consumidor real do repertório, e onde o ganho é maior: 24
parágrafos e 1 imagem hoje.

**O conteúdo não muda.** As áreas são JSON com campos separados
(`assuntos`, `corpo`, `perguntas`) — o layout novo consome os mesmos
campos. Os 9 parágrafos do corpo de `direito-digital.json` são 9 blocos
temáticos distintos (LGPD, propriedade intelectual, contratos eletrônicos,
crimes cibernéticos, IA, compliance digital, onde atendem, como começa).
A estrutura já está no dado; o layout de hoje é que a joga fora.

**Decisão pendente:** acrescentar ao schema um campo opcional de rubrica
por parágrafo, ou derivar dos `assuntos` por ordem (batem quase um a um).
O campo opcional é mais robusto e **não altera uma palavra do texto**.
Precisa de OK do Gabriel.

### Tarefa 5 — `/escritorio/`

30 parágrafos e 3 imagens. Consome ficha, barras que expandem e o título
intercalado na grade de retratos (Bergeson). A OAB a 22px continua — e
**preservar a nota de especificidade** em `Socios.astro:286-291`: aquele
bug em que a regra da home derrubava a do escritório para 19px vai querer
voltar.

### Tarefa 6 — A home inteira

Por último, de propósito: ela reusa as seções, então redesenhar antes seria
redesenhar duas vezes. E é a página que o Gabriel reservou para si.

### Tarefa 7 — As demais rotas

`/areas/`, `/contato/`, `/textos/`, políticas. Herdam o repertório.

### Tarefa 8 — Tarefa 15 do plano original

Varredura de voz, inventário de placeholders, Lighthouse, README. Estava
adiada esperando o redesenho; é o fecho.

---

## 7. Fora de escopo

- **Revisão jurídica** do conteúdo das duas áreas novas — é de advogado,
  não de agente, e independe do visual.
- **Aplicar migrações e provar a RLS** — espera credencial.
- **Teste com leitor de tela real** (NVDA/VoiceOver) — é de pessoa, não de
  agente, e precisa acontecer antes de publicar.

## 8. Pendências que continuam abertas

- **As referências da Beatriz nunca chegaram.** O Juscelino disse que ela
  mandaria. A lista de hoje representa **um dos dois sócios**. O Gabriel
  decidiu não esperar — registrado aqui porque é informação, não bloqueio.
- **Coisas que o cliente gostou e a OAB veda:** Japonte e Bergeson usam
  depoimento de cliente; Martinelli publica resultados numéricos; três das
  quatro imagens de conceito usam taxa de êxito. Vale explicar ao Juscelino
  antes que ele peça algo parecido — e que o substituto legítimo é método
  descrito com clareza, não a fala do cliente.
- **O valor de `--papel`** ainda não foi escolhido.

## 9. Regras que continuam valendo

- Commit por tarefa, na `main`, **sem push e sem deploy**. Mensagem em
  português, no formato do histórico.
- **Não mexer em `prototipo/`.**
- **Nunca inventar dado real.** Placeholder marcado com
  `data-placeholder="1"`.
- **Provimento 205/2021.** Proibido: depoimento, caso de sucesso, número de
  processos, "consulta gratuita", "especialista" sem título, superlativo,
  urgência, promessa de resultado, menção a tamanho. Obrigatório: OAB de
  cada sócio e registro da sociedade visíveis.
- **Não acrescentar áreas.** Quatro é o teto.
- **O blog se chama "Em português claro"**, nunca "Blog".
- Testar contra o que `npm run build` emite, nunca contra `/previa`.
