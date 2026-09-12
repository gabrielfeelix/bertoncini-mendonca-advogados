-- ─────────────────────────────────────────────────────────────────────────
--  Quem pode ler e quem pode escrever
--
--  A chave anônima do Supabase vai para o navegador — ela é pública por
--  definição. Sem RLS, qualquer visitante poderia apagar o blog com um
--  DELETE. Por isso as tabelas nascem com RLS ligada, negando tudo, e cada
--  permissão é aberta explicitamente.
--
--  ── A armadilha que esta migração já nasce evitando ────────────────────
--  No projeto anterior, a política de `editores` perguntava "existe uma
--  linha em `editores` com o meu id?". Essa pergunta é ela mesma uma
--  leitura de `editores`, que dispara a política de novo, sem fim: toda
--  leitura de editor devolvia "infinite recursion detected in policy for
--  relation editores". Foi preciso uma migração inteira só para consertar.
--
--  Aqui a pergunta nasce numa função `security definer`: ela roda com os
--  privilégios de quem a criou e por isso NÃO passa pela RLS, então não
--  recorre. `search_path` fixo para a função não ser sequestrada por uma
--  tabela homônima em outro schema.
--
--  Esta migração não foi aplicada a banco nenhum.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.editores (
  id         uuid primary key references auth.users (id) on delete cascade,
  nome       text not null check (length(trim(nome)) > 0),
  criado_em  timestamptz not null default now()
);

comment on table public.editores is
  'Quem pode publicar. Entrar aqui é o que dá acesso ao painel.';

alter table public.editores enable row level security;
alter table public.artigos  enable row level security;

-- ── a função que evita a recursão ────────────────────────────────────────

create or replace function public.e_editor()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (select 1 from public.editores where id = auth.uid());
$$;

comment on function public.e_editor() is
  'Diz se quem está pedindo é editor. security definer para não recorrer na RLS.';

revoke all on function public.e_editor() from public;
grant execute on function public.e_editor() to authenticated;

-- ── editores ─────────────────────────────────────────────────────────────
-- Um editor enxerga a lista de editores, para saber quem é quem. Mais
-- ninguém enxerga. Escrita em `editores` fica fora da RLS de propósito: dar
-- acesso ao painel é ato administrativo, feito no console do Supabase com a
-- chave de serviço, não pelo próprio painel.

drop policy if exists editores_leem_editores on public.editores;
create policy editores_leem_editores on public.editores
  for select to authenticated
  using (public.e_editor());

-- ── artigos ──────────────────────────────────────────────────────────────

-- Qualquer um, inclusive o visitante anônimo, lê o que está PUBLICADO.
-- Rascunho não vaza: `estado <> 'publicado'` fica fora desta política.
drop policy if exists artigos_publicos_leem on public.artigos;
create policy artigos_publicos_leem on public.artigos
  for select to anon, authenticated
  using (estado = 'publicado');

-- O editor enxerga tudo, rascunho incluído.
drop policy if exists artigos_editores_leem on public.artigos;
create policy artigos_editores_leem on public.artigos
  for select to authenticated
  using (public.e_editor());

-- Só editor escreve. As três operações são separadas de propósito: é mais
-- fácil auditar, e mais fácil restringir depois se aparecer papel de autor.
drop policy if exists artigos_editores_inserem on public.artigos;
create policy artigos_editores_inserem on public.artigos
  for insert to authenticated
  with check (public.e_editor());

drop policy if exists artigos_editores_alteram on public.artigos;
create policy artigos_editores_alteram on public.artigos
  for update to authenticated
  using      (public.e_editor())
  with check (public.e_editor());

drop policy if exists artigos_editores_apagam on public.artigos;
create policy artigos_editores_apagam on public.artigos
  for delete to authenticated
  using (public.e_editor());
