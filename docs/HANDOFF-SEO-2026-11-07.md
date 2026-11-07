# Handoff: SEO, encontrabilidade e desempenho (07/11/2026)

Para o próximo agente. **Escopo exclusivo: SEO técnico e de conteúdo,
encontrabilidade por buscadores e por agentes de IA, e desempenho
(PageSpeed/Core Web Vitals).** Não mexa no visual: ele foi aprovado peça por
peça pelo Gabriel nesta semana. Se uma otimização exigir mudança visível,
proponha antes.

**Missão agora (antes do lançamento):** deixar **tudo o que é de SEO e
desempenho pronto dentro da v3** (seções 5.1 a 5.5), para que o site já suba
certo. O Gabriel publica a v3 no domínio oficial em **08/11/2026**.
Indexação, Search Console, Bing e Google Business Profile ficam para depois
do lançamento: estão no roteiro da seção 7, para o agente que cuidar da
publicação saber exatamente o que fazer.

Responda ao Gabriel em português. Comentários de código e mensagens de commit
também vão em português.

---

## 1. Ler antes de mexer

1. `docs/HANDOFF-V3-2026-11-07.md`: arquitetura, como publicar, armadilhas
   do ambiente e pendências. As seções do fim descrevem o que mudou na tarde
   de 07/11 e o CMS.
2. Memórias do projeto em
   `/home/gabfelix/.claude/projects/-home-gabfelix-dev-bertoncini-mendonca-advogados/memory/`:
   - `visual-sem-cara-de-ia`;
   - `deploy-versoes-no-mesmo-site`.
3. `docs/BRIEFING-RESPOSTAS.md` e `docs/CONTEXTO-CLIENTE.md`: quem é o
   cliente, o público e como ele fala. Base para as palavras-chave.

---

## 2. Onde está

- **Branch `v3`** (GitHub `gabrielfeelix/bertoncini-mendonca-advogados`).
  É a versão que vai substituir o site atual.
- **No ar como prévia:** https://bertoncini-mendonca-advogados.vercel.app/v3/
  (inglês em `/v3/en/`). A raiz do domínio ainda é a v1 (branch `main`).
- **A prévia `/v3/` é `noindex, nofollow` de propósito.**
  `tools/montar-versao.mjs` injeta a meta em todas as páginas. Use a prévia
  para medir desempenho e validar marcação. Indexação e Search Console só
  valem quando a v3 virar a raiz.
- **Domínio final confirmado (07/11/2026): `bertoncinimendonca.adv.br`.**
  `site` em `astro.config.mjs` e `site.url` em `src/lib/site.ts` já usam
  `https://www.bertoncinimendonca.adv.br`. Canonical, hreflang, sitemap e
  JSON-LD partem daí.
  - O que falta decidir é o domínio principal: **com `www` ou sem**. O
    código usa `www`.
  - Se na Vercel o principal for o sem `www`, troque nos dois arquivos e
    confira canonical, sitemap e JSON-LD. O outro endereço deve redirecionar
    (301) para o principal.
  - Ver seção 7.
  - O `CampoPlaceholder` de `site.url` em `site.ts` pode deixar de ser
    placeholder.
- **Local:** `npx astro dev --port 4391 --host` → http://localhost:4391/.
  Se aparecer CSS velho, reinicie o servidor; está nas armadilhas do outro
  handoff.
- **Stack:** Astro 7 em saída estática, adaptador Vercel, CSS próprio
  (`src/styles/v3.css`) e Roboto local em `public/fonts/`.
  - Conteúdo de artigos: `src/content/artigos/*.md`, ou o Supabase quando
    ligado (`src/lib/loader-artigos.ts`).
  - Áreas: `src/content/areas*/*.json`.
  - Textos fixos: `src/lib/i18n.ts` (pt e en).
  - Dados do escritório: `src/lib/site.ts`.

### Páginas (pt | en)

| Página | pt | en |
|---|---|---|
| Home | `/` | `/en/` |
| O escritório | `/escritorio/` | `/en/firm/` |
| Áreas de atuação | `/areas/` | `/en/practice-areas/` |
| Áreas (2) | `/areas/planejamento-patrimonial-e-sucessorio/` e `/areas/direito-digital/` | equivalentes em `/en/practice-areas/...` |
| Central de Conteúdos | `/conteudos/` e `/conteudos/<slug>/` (7 artigos) | **sem versão em inglês** |
| Contato | `/contato/` | `/en/contact/` |
| Políticas | `/politica-de-privacidade/`, `/politica-de-cookies/` | equivalentes |

- `/blog/...` e `/textos/...` são redirecionamentos (meta-refresh com
  canonical) para `/conteudos/...`.
- `/painel/` é o CMS: fora do sitemap, com `Disallow` no robots e `noindex`.

---

## 3. O que já existe (não refazer)

- **`<head>`** (`src/layouts/Base.astro`): `title` e `description` por
  página, `canonical`, `hreflang` pt/en com `x-default` quando há página
  equivalente, Open Graph básico, `twitter:card`, `noindex` opcional por
  página e favicons.
- **JSON-LD `LegalService`** só na home: nome, url, logo, imagem,
  telefone, e-mail, endereço (Maringá/PR), `areaServed` Brasil, idiomas e
  `sameAs` Instagram.
- **Sitemap:** `@astrojs/sitemap`, que exclui `/painel`, `/previa`,
  `/textos` e `/blog`.
- **robots.txt:** `src/pages/robots.txt.ts`, que bloqueia `/painel/`,
  `/previa/` e `/api/` e declara o sitemap.
- **Prefetch:** `prefetch: { prefetchAll: true, defaultStrategy: 'viewport' }`
  em `astro.config.mjs`.
- **Imagens:** só a capa do artigo usa `astro:assets` (`<Image>`, com
  srcset). O resto usa `<img>` simples com JPG/WebP. Existem variantes
  `.avif`/`.webp` em `public/media/novas/` que quase nada usa.
- **Vídeos de capa** (`public/media/videos/`): WebM de 1,3–2,5 MB e MP4 de
  2,9–3,9 MB, com `preload="metadata"`, imagem de espera e pausa com
  `prefers-reduced-motion`.
  - Só nas capas de Planejamento e de Direito Digital
    (`src/components/BannerPagina.astro`, prop `video`).
- **Cookies e LGPD:** aviso de consentimento em `AvisoCookies.astro` e
  `src/lib/consentimento.ts`. Nenhuma ferramenta de medição está instalada.
- **Instagram:** as imagens são servidas do nosso domínio, sem script da
  Meta.

---

## 4. Regras que não podem ser quebradas

- **Provimento 205/2021 da OAB:** nada de superlativo ("melhor", "maior",
  "especialistas em..."), promessa de resultado, "caso de sucesso",
  depoimentos ou preço.
  - Isso vale também para title, description, alt e textos de schema.
  - Sem "doutor". Proibido: "Nos chame no WhatsApp", "orçamento", "planos".
- **Texto visível:** não reescreva o texto das páginas para encaixar
  palavra-chave sem aprovação. Os textos vêm do briefing e passam pelos
  sócios.
  - Pode propor ajustes, de preferência em title, description, alt e
    H2/H3, numa lista para o Gabriel aprovar.
  - Tudo o que está marcado como provisório também precisa de aprovação
    (`outras-areas.ts`, perguntas dos painéis).
- **Pontuação:** sem travessão (—) em texto do site; o Gabriel acha que
  tem cara de IA. Use vírgula, dois-pontos ou parênteses.
- **LGPD:** qualquer script de medição (GA4, Clarity, Pixel) só pode
  carregar depois do consentimento, ligado a `src/lib/consentimento.ts`.
  Prefira uma opção sem cookie (Vercel Web Analytics ou Plausible).
- **Visual:** não mexer, como dito no topo.
- **Publicação:** só publicar com pedido do Gabriel. O roteiro de deploy
  está no outro handoff: build da v3 numa cópia limpa da branch, montagem
  com a main e a v2, e `vercel deploy --prebuilt --prod --scope 4-yu-mkt`.
  - Commit e push também só com pedido dele.
  - A raiz (v1) não muda sem ordem.

---

## 5. O que fazer

### 5.1 Diagnóstico (primeiro)

1. **Lighthouse** (mobile e desktop) na prévia, nas páginas: `/v3/`,
   `/v3/areas/`, `/v3/areas/planejamento-patrimonial-e-sucessorio/`,
   `/v3/escritorio/`, `/v3/conteudos/` e um artigo.
   - Use `npx lighthouse` ou o porte do `tools/audita-lighthouse.mjs` do
     projeto da Isabella (`/home/gabfelix/dev/isabella-pires-arquitetura/tools/`).
   - Registre LCP, CLS, INP/TBT e o peso total.
   - Faça um relatório curto, com antes e depois, para o Gabriel.
2. **Validar a marcação:**
   - HTML: `npx html-validate` ou similar.
   - JSON-LD: Schema Markup Validator, schema.org.
   - hreflang: cada par pt↔en apontando um para o outro.
   - Canonical sem barra dupla nem `/v3` (na prévia o canonical aponta para
     o domínio final, o que está certo).

### 5.2 SEO técnico

- **Metatags de todas as páginas, pt e en:** revisar `title` (≤ 60
  caracteres, com "Maringá/PR" onde fizer sentido) e `description`
  (≤ 155–160), sem duplicatas entre páginas.
  - Artigos usam `seoTitulo`/`seoDescricao` quando existem.
- **Open Graph:** `og:image` usa um placeholder genérico (`public/og-padrao.jpg`,
  marcado como placeholder em `site.ts`). Crie imagens OG 1200×630 por
  tipo de página:
  - home e O escritório: a foto da placa com o logo, em
    `public/media/novas/escritorio-placa.jpg`;
  - áreas: a foto da área;
  - artigos: a capa.
  - Inclua `og:image:alt`, largura e altura, `og:locale:alternate` e
    `article:published_time` nos artigos.
- **JSON-LD a acrescentar:**
  - `Organization`/`LegalService` completo e coerente em todas as páginas.
    Use NAP idêntico ao de `site.ts`: CNPJ 69.076.965/0001-64, OAB/PR nº
    24.788, telefone e e-mail reais.
  - `Person` para os dois sócios, com `jobTitle`, `worksFor`, `alumniOf` e
    `identifier` com a OAB. Na página O escritório e como `author` nos
    artigos assinados.
  - `BreadcrumbList` nas páginas internas (as migalhas já existem na capa).
  - `Article`/`BlogPosting` nos artigos: `headline`, `datePublished`,
    `dateModified`, `image`, `author` (sócio ou a organização) e
    `publisher`.
  - `FAQPage` nas páginas de área, que têm 11 perguntas cada. O Google
    restringe o rich result de FAQ, mas a marcação ajuda buscadores de IA.
  - `WebSite` com `SearchAction`: a Central tem busca por
    `/conteudos/?busca={termo}`, que o script lê ao abrir.
  - `Service` ou `OfferCatalog` para os serviços de cada área, **sem
    preço**.
- **Sitemap:** conferir que traz todas as páginas pt e en, com
  `xhtml:link` de hreflang (o `@astrojs/sitemap` aceita a opção `i18n`) e
  `lastmod` dos artigos (`publicadoEm`/`atualizadoEm`).
- **robots.txt:** decidir com o Gabriel a política para os rastreadores de
  IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot).
  - Para encontrabilidade em IA, o normal é permitir.
  - Deixe a escolha explícita no arquivo, com comentário.
- **404:** não existe página 404 própria (`src/pages/404.astro`). Criar
  uma no visual do site, com links úteis e `noindex`. É mudança visível,
  então mostre ao Gabriel antes.
- **Redirecionamentos:** `/blog/*` e `/textos/*` usam meta-refresh porque o
  adaptador da Vercel não casa a barra final (ver
  `src/pages/textos/[...caminho].astro`).
  - Avaliar 301 de verdade por `vercel.json`/rotas quando a v3 for a raiz.
  - O outro handoff conta o que já foi tentado.

### 5.3 Palavras-chave e conteúdo (propor, não publicar sozinho)

- **Mapear 1 a 3 termos principais por página**, com intenção local e
  nacional. Pontos de partida:
  - Home e O escritório: "advogado em Maringá", "escritório de advocacia
    Maringá", "advogado online".
  - Planejamento: "planejamento sucessório", "planejamento patrimonial",
    "holding familiar", "inventário extrajudicial", "testamento", "doação
    com reserva de usufruto", "ITCMD", "acordo de sócios".
  - Digital: "advogado de direito digital", "registro de marca INPI",
    "LGPD para empresas", "advogado para influenciador", "contrato de
    publicidade", "conta do Instagram hackeada / recuperação de conta",
    "perfil falso", "prova digital / ata notarial".
  - Validar volume e concorrência com uma ferramenta de busca, ou pelo
    menos com as sugestões e o "As pessoas também perguntam" do Google.
- **Entregar uma planilha ou tabela** com: página, termo principal,
  secundários, title e description propostos e H2 sugerido. É para o
  Gabriel aprovar.
- **Meta keywords:** o Google ignora há anos e o Bing usa como sinal de
  spam. **Não recomendamos.** Se o Gabriel quiser mesmo assim, uma lista
  curta e coerente por página, sem repetir termos.
- **Links internos:**
  - artigos → área correspondente, e área → artigos da categoria;
  - a página da área tem espaço para uma seção "Conteúdos sobre esta
    área", mas isso muda o visual, então proponha antes;
  - âncoras descritivas em vez de "clique aqui".
- **Pautas de artigos** a partir das perguntas frequentes das áreas, que
  já estão escritas: cada pergunta forte pode virar um artigo da Central.
- **Imagens:** revisar `alt` de todas. Muitas são decorativas com `alt=""`
  de propósito, o que está correto. Os nomes de arquivo podem ser mais
  descritivos para as imagens de conteúdo.

### 5.4 Agentes de IA e buscadores generativos (GEO/AEO)

- Criar `public/llms.txt` (e talvez `llms-full.txt`):
  - quem é o escritório, as áreas, o atendimento (online no Brasil,
    presencial em Maringá) e os sócios com a OAB;
  - links das páginas principais e dos artigos;
  - os avisos (caráter informativo e Provimento).
- **Conteúdo legível sem JavaScript:** o site já funciona sem JS, mas
  confirme que FAQ, abas e acordeões entregam o texto no HTML. Eles usam
  `<details>`, que fica no HTML.
- **Resposta direta nos artigos:** um resumo no topo já existe. Avalie
  propor um bloco "Em resumo" curto, sem cara de IA (sem caixa com filete
  lateral).
- **Consistência de entidade:** o mesmo nome, endereço, telefone, OAB e
  CNPJ em todo lugar (site, JSON-LD, Instagram, Google Business Profile).

### 5.5 Desempenho (PageSpeed)

- **LCP da home:** a primeira imagem do `HeroSlides` deveria ter
  `fetchpriority="high"`, sem `loading="lazy"`, e talvez
  `<link rel="preload">`.
  - Os outros slides devem carregar depois.
  - Use AVIF/WebP com `srcset` por largura (as variantes existem em
    `public/media/novas/`), ou passe a usar `astro:assets`.
- **Imagens em geral:** trocar `<img>` JPG fixos (áreas, painéis da home,
  Sobre nós, cartões) por `<picture>` com AVIF/WebP e `srcset`/`sizes`.
  - Conferir `width`/`height` em todas, para evitar CLS.
- **Vídeos de capa:** não baixar o vídeo no celular nem com
  `navigator.connection.saveData`; nesses casos fica só a imagem de espera.
  - Avaliar uma versão 720p para telas menores.
  - A imagem de espera deve ser a LCP e precisa estar otimizada (hoje é
    JPG de 1920px).
- **Fontes:**
  - Hoje o `<head>` só faz preload de `roboto-400` e `roboto-700`; os
    títulos grandes usam o 300.
  - Avaliar o preload da 300 (e da itálica onde ela é usada) e
    `font-display: swap`.
  - Considerar unificar em Roboto variável, se reduzir o peso.
- **Cache:** criar cabeçalhos `Cache-Control: public, max-age=31536000,
  immutable` para `/fonts/`, `/media/` e `/_astro/` (`vercel.json` ou
  configuração do adaptador).
  - Na montagem `/v3` isso precisa valer também sob o prefixo.
- **Prefetch:** `prefetchAll` com `viewport` pode baixar páginas demais no
  celular. Avaliar trocar para `hover` ou desligar em `saveData`.
- **JavaScript:** medir o peso dos scripts das ilhas (Seletor, Central de
  Conteúdos, OutrasAreas, Topo). Não tem framework; deve ser pequeno, mas
  confira.
- **CSS:** `v3.css` mais o CSS por componente. Verificar CSS não usado
  e se o crítico está inline (o Astro faz inline de folhas pequenas).
- **CLS:** a cortina de entrada (`Entrada.astro`) é fixa e não desloca
  layout. O cabeçalho é fixo. Conferir o banner de cookies e o widget de
  acessibilidade (VLibras só carrega no clique).

### 5.6 Fora do site

Fica para depois do lançamento: está no roteiro da seção 7. Não faça agora.

---

## 6. Como entregar

1. Trabalhe na branch `v3`. Faça commits pequenos e temáticos (ex.:
   "seo: JSON-LD de sócios e breadcrumbs"), mas só faça commit e push
   quando o Gabriel pedir.
2. Antes de dizer que terminou:
   - `npx astro check` com 0 erros, 0 avisos e 0 dicas (é o estado atual);
   - `npx astro build` e `PREVIA_ESTATICA=1 npx astro build` passando;
   - Lighthouse de antes e depois.
3. Deixe no fim deste arquivo uma seção "Feito" com:
   - o que mudou e onde;
   - as métricas;
   - o que precisa de decisão do Gabriel (domínio, robôs de IA, meta
     keywords, textos propostos);
   - o que só pode ser feito depois que a v3 virar a raiz.

---

## 7. Roteiro de lançamento (para o agente que publicar a v3 na raiz)

Nada disto deve ser feito antes do pedido do Gabriel. Ele publica em
08/11/2026.

### 7.1 Antes de publicar

1. **Domínio principal:** confirmar com o Gabriel se é `www` ou sem `www`
   e alinhar `astro.config.mjs` (`site`) e `src/lib/site.ts` (`url`).
2. **Rotas antigas:** todas as URLs da v1 (branch `main`) já têm destino na
   v3. Foi conferido em 07/11:
   - `/`, `/escritorio/`, `/areas/`, as 2 áreas (mesmos slugs), `/contato/`
     e as 2 políticas existem iguais;
   - `/blog/...` e `/textos/...` redirecionam para `/conteudos/...` (os 6
     artigos da v1 existem na v3, que tem 7).
3. **Como a v3 vira a raiz:** levar a branch `v3` para a `main` (merge) ou
   apontar o projeto da Vercel para a `v3`. Isso é decisão do Gabriel.
   - A publicação normal da raiz **não** passa por
     `tools/montar-versao.mjs`, então **não leva o `noindex`** da prévia.
     Confira no HTML publicado que não há `<meta name="robots"
     content="noindex`.
   - As prévias `/v2/` e `/v3/` saem do ar ou ficam com `noindex`; não
     podem ser indexadas como cópia do site.
4. **O painel (CMS) e os formulários** precisam de servidor: com a v3 na
   raiz eles passam a funcionar.
   - Variáveis do Supabase e do Brevo na Vercel (ver
     `docs/HANDOFF-V3-2026-11-07.md`, seção do CMS).
   - Rodar `npm run cms:importa` para levar os 7 artigos ao banco.

### 7.2 Logo depois de publicar

1. **Conferências no domínio:**
   - `https://bertoncinimendonca.adv.br/robots.txt`: sitemap com o domínio
     certo e a política de robôs de IA decidida;
   - `/sitemap-index.xml` abrindo e listando pt e en;
   - canonical, hreflang e JSON-LD de 3 ou 4 páginas;
   - 301 do domínio sem `www` para o com `www` (ou o contrário);
   - HTTPS e certificado.
2. **Google Search Console:**
   - propriedade de domínio, com verificação por registro TXT no DNS;
   - enviar `sitemap-index.xml`;
   - pedir indexação da home, das 2 áreas e de O escritório;
   - acompanhar Cobertura e Core Web Vitals.
3. **Bing Webmaster Tools:** importar do Search Console e enviar o sitemap.
4. **Google Business Profile em Maringá:**
   - categoria "Escritório de advocacia";
   - o mesmo nome, endereço, telefone e e-mail do site e do JSON-LD;
   - horário de `site.horario`;
   - link para o site e fotos (a placa com o logo serve).
   - Sem avaliações pedidas com promessa (Provimento 205).
5. **Instagram do escritório** (@bertoncinimendonca.adv, a partir de
   17/11/2026):
   - link para o site na bio;
   - trocar a lista curada em `src/lib/instagram-posts.ts` (hoje com os
     posts da Beatriz) e o `sameAs` do JSON-LD.
6. **Medição, só com consentimento (LGPD):** ligar Vercel Web Analytics ou
   Plausible (sem cookie), ou GA4 condicionado a `src/lib/consentimento.ts`.
   - Combinar com o Gabriel antes.
   - Atualizar a política de cookies se entrar qualquer ferramenta.
7. **Uma semana depois:**
   - revisar no Search Console os erros de rastreamento, os 404 e as
     páginas não indexadas;
   - ajustar title e description das páginas com muita impressão e pouco
     clique;
   - repetir o Lighthouse no domínio real.

