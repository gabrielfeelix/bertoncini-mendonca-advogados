-- ─────────────────────────────────────────────────────────────────────────
--  CMS do blog — tabela de artigos
--
--  As colunas espelham uma a uma o schema da coleção `artigos` em
--  src/content.config.ts. Isso é deliberado: o loader do Astro lê daqui e
--  entrega ao build o mesmo formato que um glob() de markdown entregaria,
--  então as páginas que consomem getCollection('artigos') servem às duas
--  fontes sem mudar.
--
--  Diferença herdada do projeto anterior, e consciente: lá o corpo era HTML
--  cru, gravado à mão pelos sócios, sem sanitização visível. Aqui o corpo é
--  **markdown**, convertido em HTML no build pelo renderizador do próprio
--  Astro. Nenhum HTML de autor chega ao navegador sem passar por ele.
--
--  Esta migração não foi aplicada a banco nenhum. Ela é um arquivo, para ser
--  aplicada depois, com consentimento, no projeto do escritório.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.artigos (
  -- o `id` do Astro é o slug: é ele que forma a URL /textos/<slug>/
  slug            text primary key
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),

  titulo          text not null check (length(titulo) between 1 and 120),
  resumo          text not null check (length(resumo) between 1 and 300),

  -- Corpo em MARKDOWN, não em HTML. O painel grava markdown e o build
  -- converte. Quem for mudar isto leia antes a nota de XSS no cabeçalho.
  corpo           text not null default '',

  -- ── capa ───────────────────────────────────────────────────────────────
  -- URL pública do arquivo no bucket `artigos`.
  capa            text,
  -- Largura e altura medidas no momento do upload, pelo painel. Ficam aqui
  -- desde a primeira migração porque o <Image> do Astro se recusa a montar
  -- uma imagem REMOTA sem as duas: sem elas a página pula enquanto a capa
  -- carrega (CLS). O Astro mede sozinho arquivo local, nunca URL remota.
  capa_largura    integer check (capa_largura is null or capa_largura > 0),
  capa_altura     integer check (capa_altura is null or capa_altura > 0),
  -- Descrição da imagem. Obrigatória quando existe capa: imagem sem texto
  -- alternativo reprova em acessibilidade, e o banco não deixa entrar.
  capa_alt        text,

  categoria       text not null default 'Informativo',
  autor           text not null default '',

  publicado_em    timestamptz not null default now(),
  atualizado_em   timestamptz,

  -- Minutos de leitura. Calculado do corpo ao salvar (200 palavras/min),
  -- mas gravado em coluna própria para poder ser corrigido à mão. Nulo
  -- quando nunca foi calculado; a lista mostra o campo vazio.
  tempo_leitura   smallint check (tempo_leitura is null or tempo_leitura between 1 and 120),

  -- Estado do artigo. Rascunho não sai do painel: a política de leitura
  -- pública abaixo só enxerga 'publicado'.
  estado          text not null default 'rascunho'
                  check (estado in ('rascunho', 'publicado')),

  seo_titulo      text check (seo_titulo is null or length(seo_titulo) <= 60),
  seo_descricao   text check (seo_descricao is null or length(seo_descricao) <= 160),

  criado_em       timestamptz not null default now(),
  -- quem escreveu; serve para saber de quem é o rascunho
  criado_por      uuid references auth.users (id) on delete set null,

  -- Capa é tudo-ou-nada: ou não há capa, ou há URL, as duas dimensões e a
  -- descrição. Assim a página nunca recebe uma capa que o <Image> recusa.
  constraint artigos_capa_completa check (
    capa is null
    or (capa_largura is not null
        and capa_altura is not null
        and capa_alt is not null
        and length(trim(capa_alt)) > 0)
  )
);

comment on table public.artigos is
  'Artigos do blog. Espelha o schema de src/content.config.ts. Corpo em markdown.';

comment on column public.artigos.corpo is
  'Markdown. Convertido em HTML no build; nunca HTML cru do autor.';

comment on column public.artigos.capa_largura is
  'Largura em px da capa, medida no upload. O <Image> exige para imagem remota.';

comment on column public.artigos.capa_altura is
  'Altura em px da capa, medida no upload. O <Image> exige para imagem remota.';

comment on column public.artigos.tempo_leitura is
  'Minutos de leitura. Calculado do corpo ao salvar, mas editável à mão.';

-- A listagem sempre pede publicados, do mais novo para o mais velho.
create index if not exists artigos_publicados_idx
  on public.artigos (publicado_em desc)
  where estado = 'publicado';

create index if not exists artigos_categoria_idx
  on public.artigos (categoria)
  where estado = 'publicado';

-- `atualizado_em` é mantido pelo banco, não pelo editor: assim ele nunca
-- mente, e o <time> do artigo pode confiar nele.
create or replace function public.toca_atualizado_em()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if to_jsonb(new) - 'atualizado_em' is distinct from to_jsonb(old) - 'atualizado_em' then
    new.atualizado_em := now();
  end if;
  return new;
end;
$$;

drop trigger if exists artigos_atualizado_em on public.artigos;
create trigger artigos_atualizado_em
  before update on public.artigos
  for each row execute function public.toca_atualizado_em();
