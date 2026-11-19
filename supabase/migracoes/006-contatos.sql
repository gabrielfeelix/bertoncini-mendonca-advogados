-- ─────────────────────────────────────────────────────────────────────────
--  006: mensagens do formulário de contato
--
--  Até aqui o formulário só mandava e-mail pela Brevo: se a Brevo falhasse
--  (domínio não autenticado, cota estourada), a mensagem se perdia. Agora
--  `/api/contato` grava aqui primeiro, e o e-mail vira aviso.
--
--  Quem grava é o site, com a chave ANÔNIMA (a chave secreta não vai para a
--  Vercel). Por isso o desenho das permissões é o inverso do de `artigos`:
--
--  - anon e authenticated só INSEREM, e só nas colunas do formulário
--    (grant por coluna): ninguém de fora escolhe `id`, `criado_em` nem
--    chega com `lido = true`. A política de insert repete `lido = false`
--    como segunda trava.
--  - anon não LÊ nada: nem select, nem `returning`. Por isso a rota insere
--    sem `.select()`.
--  - editores (`e_editor()`, migração 002) leem, marcam lido e apagam.
--
--  Os limites de tamanho são os mesmos de `texto()` em
--  src/pages/api/contato.ts. Lá o texto já chega cortado; aqui é a defesa
--  para quem chamar o PostgREST direto com a chave pública.
--
--  Idempotente. Aplicar com `npm run cms:migra`.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.contatos (
  id          bigint generated always as identity primary key,
  criado_em   timestamptz not null default now(),
  nome        text not null check (char_length(trim(nome)) between 1 and 120),
  email       text not null check (char_length(email) between 3 and 254),
  telefone    text check (telefone is null or char_length(telefone) <= 40),
  cidade      text check (cidade is null or char_length(cidade) <= 80),
  assunto     text check (assunto is null or char_length(assunto) <= 120),
  perfil      text check (perfil is null or char_length(perfil) <= 40),
  conheceu    text check (conheceu is null or char_length(conheceu) <= 60),
  mensagem    text not null check (char_length(trim(mensagem)) between 1 and 5000),
  newsletter  boolean not null default false,
  idioma      text not null default 'pt' check (idioma in ('pt', 'en')),
  lido        boolean not null default false
);

comment on table public.contatos is
  'Mensagens do formulário de contato do site. O site só insere; editores leem no painel.';

-- A lista do painel ordena por data, mais nova primeiro.
create index if not exists contatos_criado_em_idx on public.contatos (criado_em desc);

alter table public.contatos enable row level security;

-- ── privilégios ──────────────────────────────────────────────────────────
-- O Supabase dá `all` em tabela nova do `public` para anon e authenticated
-- (privilégios padrão do schema). Aqui se começa do zero e se abre só o
-- necessário; a RLS vem por cima.

revoke all on public.contatos from anon, authenticated;

grant insert (nome, email, telefone, cidade, assunto, perfil, conheceu, mensagem, newsletter, idioma)
  on public.contatos to anon, authenticated;

-- Do lado do editor: ler, marcar lido/não lido (só essa coluna) e apagar.
-- Quem não é editor tem o privilégio mas esbarra na RLS abaixo.
grant select, delete on public.contatos to authenticated;
grant update (lido) on public.contatos to authenticated;

-- ── políticas ────────────────────────────────────────────────────────────

drop policy if exists contatos_site_insere on public.contatos;
create policy contatos_site_insere on public.contatos
  for insert to anon, authenticated
  with check (lido = false);

drop policy if exists contatos_editores_leem on public.contatos;
create policy contatos_editores_leem on public.contatos
  for select to authenticated
  using (public.e_editor());

drop policy if exists contatos_editores_alteram on public.contatos;
create policy contatos_editores_alteram on public.contatos
  for update to authenticated
  using      (public.e_editor())
  with check (public.e_editor());

drop policy if exists contatos_editores_apagam on public.contatos;
create policy contatos_editores_apagam on public.contatos
  for delete to authenticated
  using (public.e_editor());
