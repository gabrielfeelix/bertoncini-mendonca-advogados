-- ─────────────────────────────────────────────────────────────────────────
--  007: lista de editores com e-mail, para /painel/usuarios/
--
--  O e-mail (que é o login) mora em `auth.users`, fora do alcance da API.
--  Em vez de a página usar a chave secreta só para ler, esta função
--  `security definer` junta `editores` com `auth.users` e devolve a lista
--  apenas para quem já é editor (`e_editor()`, migração 002). Para qualquer
--  outro, devolve vazio. A chave secreta fica restrita às rotas que criam e
--  removem acesso (`/api/painel/usuarios`).
--
--  Idempotente. Aplicar com `npm run cms:migra`.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.editores_com_email()
returns table (id uuid, nome text, email text, criado_em timestamptz, ultimo_acesso timestamptz)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select e.id, e.nome, u.email::text, e.criado_em, u.last_sign_in_at
    from public.editores e
    join auth.users u on u.id = e.id
   where public.e_editor()
   order by e.nome;
$$;

comment on function public.editores_com_email() is
  'Editores com e-mail e último acesso. Só devolve linhas para quem é editor.';

revoke all on function public.editores_com_email() from public, anon;
grant execute on function public.editores_com_email() to authenticated;
