# Site institucional: plano de execução

> **Para o agente que executa:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development`. Os passos usam checkbox (`- [ ]`).

**Objetivo:** transformar o protótipo de página única em site institucional multipágina, em Astro, com CMS para o blog.

**O que já existe e não se joga fora:** `prototipo/index.html` é um protótipo de homepage com 19 commits, verificador automatizado passando, Lighthouse mobile 94. Ele é a **fonte do sistema de design** e vira a home. Tipografia, paleta, textura, reveals, botão magnético, entrada da página, aviso de cookies e a seção "Como trabalhamos" migram para componentes Astro.

**Spec:** este documento. A direção de design está em `docs/DECISOES.md` (leia a entrada de 12/09/2026 primeiro); a voz em `/home/gabfelix/dev/portfolio/docs/VOZ.md`; as regras da OAB em `docs/PESQUISA.md` §1.

---

## Leia antes, nesta ordem

1. `docs/DECISOES.md`, a entrada de 12/09/2026 e depois o resto.
2. `docs/PLANO-HOMEPAGE.md`, as "Restrições globais". Elas continuam valendo inteiras.
3. `prototipo/index.html`, uma vez, inteiro. É de onde sai tudo.
4. `/home/gabfelix/dev/isabella-pires-arquitetura`, os `HANDOFF*.md`. É de onde sai o CMS.

## Restrições globais

Herdadas do plano anterior e ainda vinculantes. Não as repita, cumpra-as.

- **Progressive enhancement.** Legível e clicável sem JS. Nenhum efeito carrega informação.
- **`prefers-reduced-motion: reduce` desliga todo movimento.**
- **Nada de scroll-jacking.** Sticky por CSS pode; pin do GSAP não.
- **Corpo de texto a partir de 18px, alvo de toque 44px, contraste AA.** O público tem 70 anos.
- **Cores.** Branco base. `#0B1E3F` chapa e CTA, `#004369` hover, `#517493` secundário, `#E3E6EA` bordas, `#9B1C2E` ação e foco. O off-white `#F8F7F2` está fora.
- **Textura** (`filter:url(#grao)`) só sobre azul escuro.
- **Tipografia.** Newsreader e Archivo, self-hosted. Playfair e Montserrat são proibidas.
- **Voz.** Primeira pessoa do plural, formal no registro, simples no vocabulário. Sem "a gente", sem travessão em texto visível. A frase termina quando a informação termina.
- **OAB, Provimento 205/2021.** Proibido: depoimento, caso de sucesso, número de processos, "consulta gratuita", "especialista" sem título, superlativo, urgência, promessa de resultado, menção a tamanho. Obrigatório: OAB de cada sócio e registro da sociedade.
- **Placeholders marcados** com `data-placeholder="1"`. Nunca inventar dado real.
- **Commit por tarefa, na `main`, sem push.** Mensagem em português, formato do histórico, terminando com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## A arquitetura decidida

Decisões do Gabriel em 12/09/2026, informadas por um levantamento de 44 escritórios (`docs/REFERENCIAS.md` e `REFERENCIAS-CLIENTE.md`).

| Rota | Página | O que carrega |
|---|---|---|
| `/` | Home | Resumo de tudo. Cada seção aprofunda numa página interna |
| `/areas/` | Áreas de atuação | As quatro áreas, com chamada para cada |
| `/areas/familia/` | Família | Texto, assuntos, perguntas da área, CTA |
| `/areas/compliance/` | Compliance | Idem |
| `/areas/[3]/`, `/areas/[4]/` | A confirmar | Placeholder até o briefing |
| `/escritorio/` | O escritório | História da sociedade e os dois sócios com bio, OAB e contato |
| `/textos/` | Em português claro | Lista de artigos |
| `/textos/[slug]/` | Artigo | Um por texto, vindo do CMS |
| `/contato/` | Contato | Formulário, WhatsApp, endereço, horário |
| `/politica-de-privacidade/`, `/politica-de-cookies/` | Legal | Exigidas pela LGPD |
| `/painel/` | Administração | Onde os sócios publicam. Fora do sitemap, `noindex` |

**A régua de conteúdo, nas palavras do cliente:** a home explica a maior parte; quem quiser saber mais entra na página dedicada. Nem tão grande que canse, nem tão pequena que pareça faltar coisa.

**Menu:** 5 itens. `Áreas de atuação · O escritório · Textos · Contato` mais o botão de WhatsApp. Com 4 áreas não há submenu (o levantamento mostra que submenu só se justifica acima de ~6 áreas).

**Navbar:** barra cheia fixa no topo, logo à esquerda, links no meio, WhatsApp à direita. As três ilhas flutuantes estão revogadas.

**Áreas:** o levantamento mostra que o setor infla o número de áreas (Bergeson: 14 áreas para 10 advogados). Com 2 sócios, 4 áreas é o teto saudável. **Não acrescente áreas.**

**Sócios:** uma página só, com os dois dentro. Diretório com perfil individual é estrutura demais para 2 pessoas.

**Blog:** tem nome próprio ("Em português claro"), como é norma entre os bons. Não chamar de "Blog".

---

## Stack

Copiada do projeto da Isabella, que já resolveu estes problemas em produção.

- **Astro 7**, TypeScript strict, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/vercel`, `sharp`.
- **CSS próprio**, sem Tailwind, com tokens vindos do protótipo.
- **Supabase** para os artigos: Postgres, Auth e Storage.
- **Deploy na Vercel**, `output: 'static'` com rotas serverless para o painel e as APIs.
- **Sem push e sem deploy neste plano.** Só `npm run build` local.

## Armadilhas conhecidas do CMS da Isabella

Levantadas do handoff dela. Cada uma tem que ser evitada desde o início, não descoberta de novo.

1. **RLS recursiva.** Política em `editores` que consulta a própria `editores` dá "infinite recursion". Já comece com função `security definer`.
2. **`innerHTML` não herda `data-astro-cid`.** CSS escopado não alcança HTML injetado por JS: use `is:global` nesses blocos.
3. **`<Image>` remoto exige `width`/`height`.** Guarde as dimensões da capa no banco, medidas no upload.
4. **Corpo em HTML cru é risco de XSS.** Lá o corpo é HTML sem sanitização visível. **Aqui o corpo é markdown**, renderizado no build.
5. **Editor de texto rico não ficou pronto lá**, e os sócios escreviam `<p>` à mão. O handoff dela diz que é o que mais atrapalha o uso diário. **Aqui o editor entra no dia 1.**
6. **O painel nunca foi testado no celular lá.** Teste cedo.
7. **Variável de ambiente nova precisa existir na Vercel antes do push.**
8. **Build falha se o Supabase cair.** Decisão consciente dela; herdamos e documentamos.

---

## Tarefas

Quinze tarefas. Cada uma termina com `npm run build` passando e um commit.

### Tarefa 1: Esqueleto do Astro
Criar o projeto na raiz (o `prototipo/` continua onde está, intocado, como referência). `package.json`, `astro.config.mjs`, `tsconfig.json`, estrutura de pastas, `.gitignore`. Copiar `src/lib/ambiente.ts` da Isabella. Produz: `npm run build` passando com uma página vazia.

### Tarefa 2: Sistema de design
Extrair do protótipo para `src/styles/`: `tokens.css` (as variáveis de cor, tipo e espaçamento), `fontes.css` (os oito `@font-face`), `base.css`. Copiar `prototipo/fonts/` para `public/fonts/`. Produz: as variáveis disponíveis em qualquer página.

### Tarefa 3: Layout base, navbar nova e rodapé
`src/layouts/Base.astro` com `<head>` completo (SEO, Open Graph, favicon), o `<svg>` do filtro `#grao`, e os componentes `Navbar.astro` e `Rodape.astro`. **A navbar é nova**: barra cheia fixa, não as três ilhas. O rodapé migra do protótipo quase direto. Produz: toda página nasce com cabeçalho e rodapé.

### Tarefa 4: Componentes de seção migrados
Migrar do protótipo para `src/components/`: `Hero`, `Declaracao`, `Areas`, `Socios`, `Faixa`, `Metodo`, `Newsletter`, `Perguntas`, `Contato`, `Entrada`, `AvisoCookies`. Cada um recebe conteúdo por props, não hardcoded. Produz: as peças da home como componentes reutilizáveis.

### Tarefa 5: Camada de movimento
Migrar o JS do protótipo para `src/scripts/`: Lenis, `aoRolar`, reveals, botão magnético, entrada, controle de vídeo, e o handler de âncora **com a correção de foco** (o `.pular` tem que mover o foco, não só rolar). Tudo continua desligando sob `calmo`. Produz: o movimento do protótipo funcionando em todas as páginas.

### Tarefa 6: A home
`src/pages/index.astro`, montando os componentes. Cada seção ganha "saiba mais" apontando para a página interna correspondente. Produz: a home do protótipo, agora multipágina.

### Tarefa 7: Conteúdo das áreas
`src/content/areas/` com um arquivo por área (Família e Compliance com conteúdo; a terceira e a quarta como placeholder). Schema Zod: nome, slug, resumo, assuntos, corpo, perguntas, ordem. Produz: o conteúdo das áreas fora do código.

### Tarefa 8: Páginas de área
`/areas/` (lista) e `/areas/[slug]/` (uma por área, gerada do conteúdo). A página de área tem: título, resumo, texto, os assuntos como chips, perguntas frequentes da área, e CTA de WhatsApp já com o assunto. Produz: a arquitetura que traz gente do Google.

### Tarefa 9: Página do escritório
`/escritorio/`: história da sociedade, os dois sócios com retrato, bio completa, **OAB visível** e contato direto. O levantamento mostra que nenhum dos 44 escritórios exibe a OAB; é exigência do Provimento 205/2021 e é onde a Bertoncini acerta primeiro. Produz: a página que responde "quem são vocês".

### Tarefa 10: Banco e CMS
Migrações do Supabase adaptadas da Isabella: tabela `artigos`, tabela `editores`, RLS **com função `security definer` desde o início**, bucket de capas. `src/lib/loader-supabase.ts` adaptado. `content.config.ts` com schema compatível entre markdown e Supabase. Produz: o banco pronto e o Astro lendo dele no build.

### Tarefa 11: Páginas do blog
`/textos/` (lista, com destaque e paginação) e `/textos/[slug]/` (artigo). Migrar `artigo.css` adaptado. Produz: o blog navegável.

### Tarefa 12: Painel de publicação
`/painel/` com login (Supabase Auth), lista de artigos, e formulário de edição **com editor de texto rico (Tiptap) desde o dia 1**, não textarea de HTML. `/api/publica` que valida o editor e dispara o Deploy Hook. **Testar no celular.** Produz: os sócios publicando sozinhos.

### Tarefa 13: Contato, newsletter e legal
`/contato/` com formulário (reaproveitar `antispam.ts` e `contato.astro` da Isabella), `/politica-de-privacidade/`, `/politica-de-cookies/`. Newsletter ligada ao Brevo (`brevo.ts` da Isabella). O aviso de cookies passa a usar `consentimento.ts`. Produz: os caminhos de conversão e o mínimo legal.

### Tarefa 14: Verificação automatizada
Adaptar `tools/verifica.mjs` para rodar em **todas as rotas**, não só numa página: console, overflow, alvo de toque, reduced-motion, sem JS, e agora também links quebrados e `<title>`/meta por página. Produz: o portão que protege as 11 rotas.

### Tarefa 15: Revisão final
Varredura de OAB e de voz em todas as páginas, inventário de placeholders, Lighthouse em cada rota, e atualização de `HANDOFF.md` e `README.md`. Produz: o site pronto para o briefing preencher.

---

## O que este plano não faz

- **Não faz push nem deploy.** Só build local.
- **Não inventa dado.** OAB, CNPJ, telefone, bio da Beatriz, terceira e quarta área e os textos do blog seguem placeholder até o briefing.
- **Não cria as páginas de carreira, ESG ou sub-marca.** O levantamento mostra que são de escritório grande.
- **Não mexe em `prototipo/`.** Ele fica como referência do que foi aprovado.
