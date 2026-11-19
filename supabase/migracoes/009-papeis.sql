-- 009: papéis no painel e controle da newsletter automática (18/11/2026).
--
-- Papéis:
--   administrador: tudo, inclusive gerir usuários.
--   editor:        artigos (criar, editar, publicar, apagar) e contatos;
--                  não gere usuários.
--   estagiario:    cria e edita artigos só como RASCUNHO (não publica, não
--                  despublica, não apaga), lê contatos e marca lido, não
--                  apaga nada, não vê usuários.
-- A troca de papel é feita pelo servidor com a chave secreta (rota de
-- usuários); ninguém altera o próprio papel (o grant de update em
-- editores continua só em nome e foto, migração 008).

alter table public.editores
  add column if not exists papel text not null default 'editor';

do $$ begin
  alter table public.editores
    add constraint editores_papel_valido check (papel in ('administrador', 'editor', 'estagiario'));
exception when duplicate_object then null; end $$;

-- Quem já existia (os sócios e o Gabriel) é administrador.
update public.editores set papel = 'administrador' where papel = 'editor';

create or replace function public.papel_atual()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select papel from public.editores where id = auth.uid();
$$;
revoke all on function public.papel_atual() from public, anon;
grant execute on function public.papel_atual() to authenticated;

-- Artigos: estagiário só mexe em rascunho e não apaga.
drop policy if exists artigos_editores_inserem on public.artigos;
create policy artigos_editores_inserem on public.artigos
  for insert to authenticated
  with check (public.e_editor() and (public.papel_atual() <> 'estagiario' or estado = 'rascunho'));

drop policy if exists artigos_editores_alteram on public.artigos;
create policy artigos_editores_alteram on public.artigos
  for update to authenticated
  using      (public.e_editor() and (public.papel_atual() <> 'estagiario' or estado = 'rascunho'))
  with check (public.e_editor() and (public.papel_atual() <> 'estagiario' or estado = 'rascunho'));

drop policy if exists artigos_editores_apagam on public.artigos;
create policy artigos_editores_apagam on public.artigos
  for delete to authenticated
  using (public.papel_atual() in ('administrador', 'editor'));

-- Contatos: estagiário lê e marca lido, mas não apaga.
drop policy if exists contatos_editores_apagam on public.contatos;
create policy contatos_editores_apagam on public.contatos
  for delete to authenticated
  using (public.papel_atual() in ('administrador', 'editor'));

-- Lista de usuários com o papel.
drop function if exists public.editores_com_email();
create function public.editores_com_email()
returns table (id uuid, nome text, email text, foto text, papel text, criado_em timestamptz, ultimo_acesso timestamptz)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select e.id, e.nome, u.email::text, e.foto, e.papel, e.criado_em, u.last_sign_in_at
    from public.editores e
    join auth.users u on u.id = e.id
   where public.e_editor()
   order by e.nome;
$$;
revoke all on function public.editores_com_email() from public, anon;
grant execute on function public.editores_com_email() to authenticated;

-- Newsletter: marca quando o e-mail do artigo saiu, para nunca reenviar.
alter table public.artigos
  add column if not exists newsletter_enviada_em timestamptz;
