/**
 * Loader de conteúdo do Astro que lê os artigos do blog no Supabase durante
 * o build. É o ponto de troca da fonte de conteúdo: a coleção `artigos` em
 * src/content.config.ts aponta para cá, e as páginas que consomem
 * getCollection('artigos') não sabem de onde o artigo veio.
 *
 * Três decisões que valem saber antes de mexer:
 *
 * 1. **Nomes.** O banco usa `snake_case`, convenção do Postgres; o schema do
 *    Astro usa `camelCase`. A tradução acontece aqui, num lugar só.
 *
 * 2. **O corpo é markdown, e o HTML cru é neutralizado antes de renderizar.**
 *    No projeto anterior o corpo era HTML cru, que o loader repassava direto
 *    ao navegador: um `<script>` gravado no banco virava script executado no
 *    site. Aqui o corpo é markdown — mas markdown **não basta sozinho**:
 *    medido neste projeto, o renderizador do Astro deixa passar HTML inline
 *    escrito dentro do markdown (um `<img onerror=...>` chegou intacto ao
 *    HTML final). Por isso `neutralizaHtmlCru` roda antes do
 *    `renderMarkdown`. Não remova essa passagem sem pôr um sanitizador de
 *    verdade no lugar.
 *
 * 3. **Sem cliente do Supabase.** A leitura é uma requisição HTTP ao
 *    PostgREST, que é o protocolo que o `@supabase/supabase-js` fala por
 *    baixo. Para ler uma tabela pública no build, a biblioteca inteira não
 *    se paga, e esta tarefa não acrescenta dependência ao projeto.
 *
 * ── Comportamento quando o banco não responde ───────────────────────────
 *
 * Herdado como decisão consciente do projeto anterior, e mantido:
 * **se o Supabase estiver configurado e cair durante o build, o build
 * FALHA.** Publicar o site com o blog vazio seria pior do que não publicar,
 * porque a falha passaria despercebida e as URLs dos artigos virariam 404
 * silenciosos, com o custo de SEO que isso traz.
 *
 * A exceção, e ela é deliberada: quando as variáveis de ambiente **não
 * existem**, o loader devolve zero artigo e o build segue. Não é o mesmo
 * caso. Banco configurado que cai é incidente; banco ainda não criado é o
 * estado normal do projeto enquanto o CMS não entra no ar, e o resto do
 * site (áreas, escritório, contato, políticas) não pode ficar refém disso.
 * Quem mantiver isto depois: ao configurar as variáveis na Vercel, você
 * está ligando o modo em que o build falha junto com o banco. É de
 * propósito.
 */
import type { Loader } from 'astro/loaders';
import { env } from './ambiente';

/** Nomes das variáveis de ambiente, num lugar só. */
export const VARIAVEIS_SUPABASE = {
  url: 'PUBLIC_SUPABASE_URL',
  chaveAnonima: 'PUBLIC_SUPABASE_ANON_KEY',
} as const;

/** Uma linha da tabela `artigos`, como o PostgREST a devolve. */
type LinhaArtigo = {
  slug: string;
  titulo: string;
  resumo: string;
  corpo: string | null;
  capa: string | null;
  capa_largura: number | null;
  capa_altura: number | null;
  capa_alt: string | null;
  categoria: string;
  autor: string | null;
  publicado_em: string;
  atualizado_em: string | null;
  tempo_leitura: number | null;
  estado: string;
  seo_titulo: string | null;
  seo_descricao: string | null;
};

/**
 * Escapa o que parecer marcação HTML dentro do markdown, para que o corpo
 * gravado no banco não consiga injetar tag nenhuma na página.
 *
 * Por que é preciso: markdown não é, por si, uma defesa contra XSS. O
 * renderizador do Astro repassa HTML inline escrito dentro do markdown, o
 * que foi verificado neste projeto com um `<img src=x onerror=...>` de
 * teste — ele chegou intacto ao HTML final. Como o corpo é escrito por
 * editor autenticado no painel, o risco é menor que o de um campo público,
 * mas continua real: basta uma conta de editor comprometida.
 *
 * O que a função faz: troca `<` por `&lt;` apenas quando ele abre algo com
 * cara de tag (`<div`, `</p`, `<!--`). Um `<` solto de texto corrido, como
 * em "3 < 5", segue intocado, e o markdown de verdade não usa `<` nessas
 * posições. Blocos de código cercados por crase não precisam de tratamento
 * especial: o markdown já os escapa, e escapar duas vezes só mudaria o que
 * aparece na tela, sem abrir buraco.
 *
 * **Escapar `<` não basta sozinho.** A sintaxe de link do markdown não usa
 * `<`, então `[clique](javascript:alert(1))` passava inteiro por aqui e
 * virava `<a href="javascript:alert(1)">` no HTML final — âncora clicável,
 * com rótulo escolhido por quem escreveu. Foi medido, não deduzido: o
 * primeiro teste desta função contra o build real produziu o href
 * executável. O mesmo valia para `data:text/html;base64,...`, que abre
 * documento com script no lugar do site.
 *
 * Por isso a segunda passagem: esquemas de URL perigosos são quebrados
 * dentro do destino do link, antes de o markdown virar HTML. O link continua
 * visível na página, com o texto que o autor deu, mas não navega para nada
 * executável.
 *
 * Isto é uma contenção, não um sanitizador. A troca certa, quando o projeto
 * puder ganhar uma dependência, é `rehype-sanitize` na configuração de
 * markdown, com uma lista de tags permitidas e de protocolos permitidos.
 */

/* Esquemas que executam código ou trocam o documento por outro. `vbscript:`
   entra por histórico de navegador antigo; `data:` porque um data: de
   text/html roda script na origem do site. */
const ESQUEMAS_PERIGOSOS = /^(?:javascript|data|vbscript):/i;

/**
 * Destino de link markdown: `](...)`. Compara o valor já sem espaços e sem
 * entidades de controle, que é como o parser o lerá.
 */
function destinoSeguro(destino: string): string {
  const limpo = destino.replace(/[\s\u0000-\u001f]/g, '');
  return ESQUEMAS_PERIGOSOS.test(limpo) ? '#' : destino;
}

export function neutralizaHtmlCru(markdown: string): string {
  const semTags = markdown.replace(/<(?=[a-zA-Z/!?])/g, '&lt;');
  /* Só o destino do link é reescrito; o rótulo entre colchetes não é tocado. */
  return semTags.replace(/\]\(([^)]*)\)/g, (inteiro, destino: string) => {
    const seguro = destinoSeguro(destino);
    return seguro === destino ? inteiro : `](${seguro})`;
  });
}

/**
 * Monta a URL da consulta: só artigos publicados, do mais novo para o mais
 * velho. O filtro por estado é redundante — a política de leitura pública do
 * banco já esconde rascunho da chave anônima — e é redundante de propósito:
 * deixa a intenção explícita para quem lê, e protege se a política mudar.
 */
function urlDaConsulta(base: string): string {
  const raiz = base.replace(/\/+$/, '');
  return `${raiz}/rest/v1/artigos?select=*&estado=eq.publicado&order=publicado_em.desc`;
}

export function artigosDoSupabase(): Loader {
  return {
    name: 'artigos-supabase',

    async load({ store, logger, parseData, renderMarkdown }) {
      const url = env(VARIAVEIS_SUPABASE.url);
      const chave = env(VARIAVEIS_SUPABASE.chaveAnonima);

      if (!url || !chave) {
        store.clear();
        logger.warn(
          `${VARIAVEIS_SUPABASE.url} ou ${VARIAVEIS_SUPABASE.chaveAnonima} não estão no ambiente. ` +
            'O blog fica vazio neste build. Enquanto o banco do escritório não existe, ' +
            'isto é esperado; depois que existir, é sinal de variável faltando na Vercel.',
        );
        return;
      }

      let resposta: Response;
      try {
        resposta = await fetch(urlDaConsulta(url), {
          headers: {
            apikey: chave,
            Authorization: `Bearer ${chave}`,
            Accept: 'application/json',
          },
        });
      } catch (erro) {
        const motivo = erro instanceof Error ? erro.message : String(erro);
        throw new Error(
          `Não consegui alcançar o Supabase para ler os artigos: ${motivo}. ` +
            'O build para aqui de propósito; publicar o blog vazio seria pior.',
        );
      }

      if (!resposta.ok) {
        const detalhe = (await resposta.text().catch(() => '')).slice(0, 400);
        throw new Error(
          `O Supabase recusou a leitura dos artigos (HTTP ${resposta.status}). ${detalhe}`,
        );
      }

      const linhas = (await resposta.json()) as LinhaArtigo[];

      store.clear();

      for (const linha of linhas) {
        const dados = {
          titulo: linha.titulo,
          resumo: linha.resumo,
          categoria: linha.categoria,
          publicadoEm: linha.publicado_em,
          estado: linha.estado,
          ...(linha.capa ? { capa: linha.capa } : {}),
          ...(linha.capa_largura !== null ? { capaLargura: linha.capa_largura } : {}),
          ...(linha.capa_altura !== null ? { capaAltura: linha.capa_altura } : {}),
          ...(linha.capa_alt ? { capaAlt: linha.capa_alt } : {}),
          ...(linha.autor ? { autor: linha.autor } : {}),
          ...(linha.atualizado_em ? { atualizadoEm: linha.atualizado_em } : {}),
          ...(linha.tempo_leitura !== null ? { tempoLeitura: linha.tempo_leitura } : {}),
          ...(linha.seo_titulo ? { seoTitulo: linha.seo_titulo } : {}),
          ...(linha.seo_descricao ? { seoDescricao: linha.seo_descricao } : {}),
        };

        /* `parseData` roda o mesmo zod do content.config.ts: se um artigo
           vier torto do banco, o build reclama aqui, e não numa página
           quebrada depois. */
        const validado = await parseData({ id: linha.slug, data: dados });

        const corpo = linha.corpo ?? '';
        /* Aqui mora a diferença para o projeto anterior: o corpo é markdown
           e quem o converte é o Astro, com a mesma configuração de markdown
           do resto do site. A passagem por `neutralizaHtmlCru` é o que
           garante que HTML gravado no banco saia escapado, e não executado —
           o markdown sozinho não garante isso. */
        const renderizado = await renderMarkdown(neutralizaHtmlCru(corpo));

        store.set({
          id: linha.slug,
          data: validado,
          body: corpo,
          rendered: renderizado,
        });
      }

      logger.info(`${linhas.length} artigo(s) lidos do Supabase`);
    },
  };
}
