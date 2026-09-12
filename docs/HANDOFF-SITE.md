# Handoff: site multipágina, tarefas 12 a 15

> Escrito em 12/09/2026, ao fim da sessão que executou as tarefas 1 a 11 de
> `docs/PLANO-SITE.md`. Para o agente que continua.

## Antes de tocar em código, faça isto

**1. Leia as respostas do briefing.** O Juscelino já respondeu parte do
questionário e há informação ali que resolve placeholders espalhados pelo site.
As respostas **não estão no repositório**: vivem na tabela
`briefing_bertoncini_mendonca`, no projeto Supabase `qoifhphjfjykweqymqxi`
(ver `docs/supabase-briefing.sql`). As perguntas que foram feitas estão em
`docs/PERGUNTAS.md`, em nove blocos.

**A credencial desse projeto não está na máquina.** Procurei: este repositório
não tem `.env`; o `.env` do projeto da Isabella
(`/home/gabfelix/dev/isabella-pires-arquitetura/.env`) aponta para outro projeto
Supabase (`bnvjvletrqbvmxgsptpw`), e uma consulta à tabela do briefing lá
devolve **HTTP 404**; nenhum outro `.env` em `~/dev` referencia
`qoifhphjfjykweqymqxi`. **Peça ao Gabriel a chave desse projeto ou uma
exportação da tabela** antes de começar. Note que o Gabriel acredita que a
credencial está acessível por um `.env`, então vale dizer a ele exatamente o que
foi procurado.

Isso é a primeira tarefa, não uma nota de rodapé: o site tem hoje **mais de 60
marcações `data-placeholder="1"`**, e cada resposta do briefing apaga uma.

**2. Leia, nesta ordem:** `docs/PLANO-SITE.md` (a spec e as 15 tarefas),
`docs/DECISOES.md` (a entrada de 12/09/2026 primeiro), `docs/DECISOES-EXECUCAO.md`,
e `prototipo/index.html` inteiro, uma vez. O protótipo é o sistema de design e
não se modifica: é a referência do que o cliente aprovou.

**3. Use a skill `superpowers:subagent-driven-development`**, uma tarefa por vez,
com revisão depois de cada uma. Funcionou: as revisões pegaram defeitos que
nenhum verificador automatizado pegaria, incluindo um que descartava mensagem de
cliente em silêncio.

---

## O que está pronto (tarefas 1 a 11)

| Tarefa | Estado | Commit |
|---|---|---|
| 1. Esqueleto Astro | pronta, revisada | `63e1123` |
| 2. Sistema de design | pronta, revisada | `41a30e4` |
| 3. Layout, navbar nova, rodapé | pronta, revisada | `e47b46d` |
| 4. Onze componentes de seção | pronta, revisada | `0277952` |
| 5. Camada de movimento | **NÃO FEITA** | — |
| 6. A home | **NÃO FEITA** | — |
| 7. Conteúdo das áreas | pronta, revisada | `5554d80` |
| 8. Páginas de área | pronta, revisada | `6b1d86a` |
| 9. Página do escritório | pronta, revisada | `d7f0355` |
| 10. Banco e CMS | pronta, sem revisão formal | `9400474` |
| 11. Páginas do blog | em execução ao fim da sessão | — |
| 12. Painel de publicação | **NÃO FEITA** | — |
| 13. Contato, newsletter, legal | **em correção** | `2e7756f`, `c1dfa6e` |
| 14. Verificação automatizada | **NÃO FEITA** | — |
| 15. Revisão final | **NÃO FEITA** | — |

**Rotas que existem:** `/areas/`, `/areas/familia/`, `/areas/compliance/`,
`/escritorio/`, `/contato/`, `/politica-de-privacidade/`, `/politica-de-cookies/`,
e `/previa` (página de trabalho, ver abaixo).

A navbar nova é **barra cheia fixa que some ao descer e volta ao subir**, decidida
pelo Gabriel em 12/09. As três ilhas do protótipo estão revogadas.

---

## Duas coisas em voo quando a sessão acabou

Confira o estado destas antes de planejar:

1. **Tarefa 13, rodada de correção 1.** Três achados Críticos foram despachados
   ao implementador e o resultado não chegou a ser verificado. Os três estão
   descritos abaixo, em "Defeitos conhecidos". **Reverifique você mesmo, contra
   as rotas que `npm run build` emite.**
2. **Tarefa 11 (blog)** estava em execução. Confira `git log` e o estado de
   `src/pages/textos/`.

Arquivos não commitados no fim da sessão pertencem a essas duas tarefas.

---

## O que falta, e a ordem que eu sugiro

### Primeiro: fechar o que está pela metade
Verifique a correção da tarefa 13 e o resultado da 11. Nenhuma das duas pode ser
dada como pronta sem revisão.

### Tarefa 6: a home
**Requisito que a revisão levantou e que é obrigatório aqui:** a OAB aparece em
**14px na home** e em 22px em `/escritorio/`. É o dado que o Provimento 205/2021
exige exibir e é a tese central do projeto (nenhum dos 44 escritórios do
levantamento mostra a OAB). Exibi-la no menor tamanho do site, na página mais
vista, contradiz o argumento. **Suba.**

Cada seção da home ganha "saiba mais" apontando para a página interna
correspondente. Os componentes da tarefa 4 já recebem conteúdo por props.

### Tarefa 12: o painel
Leia as armadilhas em `docs/PLANO-SITE.md`, seção "Armadilhas conhecidas do CMS
da Isabella". Duas que importam muito:
- **O editor de texto rico (Tiptap) entra no dia 1.** No projeto da Isabella ele
  nunca ficou pronto e os sócios escreviam `<p>` à mão; o handoff dela diz que é
  o que mais atrapalhou o uso diário.
- **Teste no celular cedo.** Lá isso nunca foi feito.
- O loader da tarefa 10 fala PostgREST por `fetch`, sem `@supabase/supabase-js`.
  O painel provavelmente vai querer a biblioteca de verdade, por causa da
  autenticação.

### Tarefa 5: a camada de movimento
Foi adiada a pedido do Gabriel ("o movimento fica para depois"), porque é
polimento e não desbloqueia rota nenhuma. Duas pendências herdadas, verificadas:
- **O vídeo do hero precisa ser PAUSADO sob `prefers-reduced-motion`,** não só
  ter o botão de pausa escondido. Hoje ele roda sem controle nenhum para quem
  pediu menos movimento.
- **O kill-switch global de reduced-motion** (protótipo, linhas 411-415) precisa
  vir, senão `.pular` e os links da navbar continuam animando.
- O handler de âncora **com a correção de foco** já existe no protótipo (linhas
  903-918). Migre-o, não o reinvente: ele já foi descartado uma vez nesta
  migração e o defeito voltou.

### Tarefas 14 e 15
Adaptar `tools/verifica.mjs` para rodar em todas as rotas, e a revisão final.
Duas correções que a 15 tem que fazer em documento:
- **`docs/PLANO-SITE.md` está errado numa premissa de segurança.** Ele diz que a
  armadilha de XSS se resolve porque "aqui o corpo é markdown". **Foi medido:
  não se resolve.** O renderizador do Astro repassa HTML inline escrito dentro
  do markdown, e um `<img src=x onerror=...>` chega intacto ao HTML final. Há
  uma contenção em `neutralizaHtmlCru()` no loader. Corrija o texto do plano.
- Inventariar os placeholders para o briefing preencher.

---

## Defeitos conhecidos e pendências

### Em aberto, despachados mas não verificados (tarefa 13)
1. **O campo "Sobre o que é" descarta a mensagem em silêncio.** `assunto` está
   em `CAMPOS_ISCA` (`src/lib/antispam.ts`) **e** é um campo real rotulado no
   formulário. Quem o preenche vê "Recebemos a sua mensagem" e o escritório não
   recebe nada. Perda silenciosa de cliente.
2. **Redirecionador aberto na newsletter.** `origemSegura`
   (`src/pages/api/newsletter.ts`) bloqueia `//` e `..` mas não a barra
   invertida: `origem=/\evil.com` redireciona para fora. Pedi correção por lista
   fechada de caminhos, não por filtro de caractere.
3. **O aviso de cookies e a newsletter não existem em nenhuma página
   publicada** — só na página de prévia, que não é versionada. Agravante legal:
   a `/politica-de-cookies/` publicada **afirma** que o aviso aparece na
   primeira visita.

### Decisão que é do Gabriel e continua pendente
**Conflito entre a spec e o protótipo aprovado quanto ao tamanho de texto.** As
Restrições globais exigem "corpo de texto a partir de 18px, o público tem 70
anos". O protótipo aprovado usa **35 declarações abaixo disso**: 16,5px nas bios
e nas respostas das perguntas, 15px nos chips de assunto, 12px em legendas e na
pílula "a confirmar". Nada foi alterado, porque mudar isso muda a quebra de linha
e o ritmo de seis seções, e o Gabriel reservou para si a revisão do visual da
home. **Ele precisa decidir.**

### Buraco conhecido no CMS
**As políticas de RLS não foram provadas em execução.** Sem credencial, nada foi
aplicado a banco nenhum. A sintaxe foi validada pelo parser oficial do Postgres;
o comportamento não. Que editor autenticado lê rascunho e anônimo não, **só se
verifica ao aplicar**. Idem o bucket e a trigger. É a primeira coisa a conferir
quando houver credencial.

### Pendências menores registradas
- A defesa de XSS do corpo é **contenção** (escapa `<`), não sanitizador. O certo
  é `rehype-sanitize` com lista de tags permitidas.
- O texto de Família diz que inventário com testamento vai necessariamente para
  o judicial. É a regra geral e é defensável, mas o Provimento CNJ 149/2023 já
  permite a via extrajudicial em alguns casos, e a Resolução CNJ 571/2024 abriu
  hipóteses com incapazes. **Um advogado precisa revisar.**
- Os dois sócios exibem o mesmo e-mail e telefone, porque é o único contato que
  existe. A estrutura já aceita valores por sócio.
- `<summary>` do menu de celular sem `role="button"` é anunciado como "disclosure
  triangle" por alguns leitores de tela.
- "Pausar vídeo" é a única string visível hardcoded (`Hero.astro`).
- Newsletter com opt-in simples, sem duplo aceite. Para LGPD o duplo é o
  defensável.
- 3 vulnerabilidades "high" do `npm audit`, herdadas de `@astrojs/vercel` →
  `path-to-regexp`. Dependência de build, não exposta ao visitante.

---

## Coisas operacionais que vão te economizar tempo

- **`npm run preview` NÃO funciona** neste projeto. O adaptador da Vercel está em
  modo server (por causa das rotas de API) e o preview morre antes de subir. Use
  `npx astro dev --port <porta>` ou sirva estaticamente `.vercel/output/static`
  depois de `npm run build`.
- **`src/pages/previa.astro` é uma página de trabalho** que monta as seções da
  home, criada para o Gabriel acompanhar em `localhost:4321/previa`. Ela **não é
  versionada** e **não deve ir para produção**. Três defeitos Críticos passaram
  despercebidos numa tarefa porque a verificação rodou contra ela em vez das
  rotas reais. **Teste sempre contra o que `npm run build` emite.**
- **Variáveis de ambiente necessárias antes de qualquer deploy:**
  `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `BREVO_API_KEY`,
  `BREVO_REMETENTE_EMAIL`, `BREVO_DESTINO_EMAIL`, `BREVO_LISTA_NEWSLETTER_ID`.
  Opcionais: `BREVO_REMETENTE_NOME`, `BREVO_LISTA_CONTATOS_ID`. Nenhuma chave no
  repositório. Elas precisam existir na Vercel **antes** do push, senão o blog sai
  vazio e ninguém percebe.
- **Um defeito de segurança foi encontrado no projeto da Isabella** e corrigido
  aqui: o redirecionamento pós-envio saía do cabeçalho `referer`, que é
  falsificável, o que fazia da rota um redirecionador aberto. **O defeito
  continua lá.** Vale avisar.
- O ledger completo da execução, com todos os rulings e achados, está em
  `.superpowers/sdd/PLANO-SITE/progress.md` (git-ignored). Os relatórios de cada
  tarefa estão na mesma pasta.

---

## Regras que continuam valendo

- Commit por tarefa, na `main`, **sem push e sem deploy**. Mensagem em português,
  no formato do histórico, terminando com
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- **Não mexer em `prototipo/`.**
- **Nunca inventar dado real**: OAB, CNPJ, telefone, e-mail, endereço, prazo,
  valor, bio, formação. Placeholder marcado com `data-placeholder="1"`.
- **Provimento 205/2021 da OAB.** Proibido: depoimento de cliente, caso de
  sucesso, número de processos, "consulta gratuita", "especialista" sem título,
  superlativo, urgência, promessa de resultado, menção a tamanho do escritório.
  Obrigatório: OAB de cada sócio e registro da sociedade visíveis.
- **Não acrescentar áreas.** Quatro é o teto para dois sócios. A terceira e a
  quarta continuam "a confirmar" até o briefing, e por decisão registrada **não
  têm página própria** — aparecem na lista sem link.
- **O blog se chama "Em português claro"**, nunca "Blog".
- Público de 70 anos: alvo de toque 44px em largura **e** altura, contraste AA,
  tudo legível e clicável sem JS, `prefers-reduced-motion` desliga todo movimento.

## A pendência que é de uma pessoa, não de um agente

**O site precisa ser testado com leitor de tela real (NVDA ou VoiceOver) antes de
publicar.** Toda a verificação até aqui foi programática. O defeito do link de
pular que não movia o foco do teclado — que apareceu duas vezes neste projeto — é
exatamente o tipo de coisa que só aparece usando.
