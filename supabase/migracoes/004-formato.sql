-- 004: formato da publicação (Central de Conteúdos, 07/11/2026).
--
-- A lista /conteudos/ filtra por formato (Artigo, Notícia, Vídeo). Os textos
-- que já existem são artigos, daí o padrão. Idempotente.

alter table public.artigos
  add column if not exists formato text not null default 'artigo';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'artigos_formato_valido'
  ) then
    alter table public.artigos
      add constraint artigos_formato_valido
      check (formato in ('artigo', 'noticia', 'video'));
  end if;
end $$;

comment on column public.artigos.formato is
  'artigo | noticia | video. Filtro da Central de Conteúdos.';
comment on column public.artigos.autor is
  'Sócios que assinam, separados por vírgula (ex.: "Beatriz Mendonça"). Vazio = texto do escritório.';
