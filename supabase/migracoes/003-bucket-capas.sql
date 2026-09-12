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
--  Esta migração não foi aplicada a banco nenhum.
-- ─────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('artigos', 'artigos', true)
on conflict (id) do nothing;

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
