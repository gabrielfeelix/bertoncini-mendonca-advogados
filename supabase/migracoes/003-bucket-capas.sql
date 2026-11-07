-- ─────────────────────────────────────────────────────────────────────────
--  Bucket das capas de artigo
--
--  Público para leitura, porque as capas aparecem no site e o build do
--  Astro precisa baixá-las para otimizar. Escrita e remoção só de editor,
--  pela mesma função `security definer` da migração 002 — o bucket usa a
--  mesma porta que as tabelas, e não uma segunda regra que pode divergir.
--
--  Depois de aplicar esta migração, o host do Storage precisa ser
--  autorizado em `image.domains` no astro.config.mjs, senão o <Image> não
--  otimiza a capa remota. O host é `<projeto>.supabase.co`.
--
--  Aplicar com `npm run cms:migra` (ver docs/HANDOFF-V3-2026-11-07.md).
-- ─────────────────────────────────────────────────────────────────────────

-- Capas em `capas/` e imagens do corpo em `corpo/`, as duas pelo painel.
-- Limite de 10 MB e só formatos de imagem: o painel já reduz a imagem
-- antes de enviar, e o bucket recusa o resto mesmo que alguém o chame
-- direto com a chave anônima e um token de editor.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artigos', 'artigos', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists capas_todos_leem on storage.objects;
create policy capas_todos_leem on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'artigos');

drop policy if exists capas_editores_enviam on storage.objects;
create policy capas_editores_enviam on storage.objects
  for insert to authenticated
  with check (bucket_id = 'artigos' and public.e_editor());

-- Trocar a capa é UPDATE no objeto; sem esta política, reenviar com upsert
-- falha para quem não é dono do arquivo.
drop policy if exists capas_editores_trocam on storage.objects;
create policy capas_editores_trocam on storage.objects
  for update to authenticated
  using      (bucket_id = 'artigos' and public.e_editor())
  with check (bucket_id = 'artigos' and public.e_editor());

drop policy if exists capas_editores_apagam on storage.objects;
create policy capas_editores_apagam on storage.objects
  for delete to authenticated
  using (bucket_id = 'artigos' and public.e_editor());
