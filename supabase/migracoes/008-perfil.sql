-- ─────────────────────────────────────────────────────────────────────────
--  008: perfil de quem usa o painel (nome e foto)
--
--  (Pedido como "007-perfil"; o 007 já era `editores_com_email`, por isso
--  este é o 008.)
--
--  - `foto` em `editores`: URL da foto do avatar. Ou um caminho do próprio
--    site (`/media/socios/...`, as fotos dos sócios) ou HTTPS (o Storage,
--    pasta `perfis/` do bucket `artigos`, migração 003). Sem foto, o painel
--    mostra as iniciais.
--  - Cada editor altera a PRÓPRIA linha, e só `nome` e `foto`: o grant é por
--    coluna e a política exige `id = auth.uid()`. Dar ou tirar acesso
--    continua fora do alcance do painel comum (é a rota com chave secreta,
--    /api/painel/usuarios).
--  - `editores_com_email()` passa a devolver a foto, para a lista de
--    usuários mostrar o avatar. O tipo de retorno muda, então a função é
--    apagada e recriada.
--
--  Idempotente. Aplicar com `npm run cms:migra`.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.editores
  add column if not exists foto text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'editores_foto_valida') then
    alter table public.editores
      add constraint editores_foto_valida
      check (foto is null
             or (char_length(foto) <= 500 and (foto like 'https://%' or foto like '/%')));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'editores_nome_curto') then
    alter table public.editores
      add constraint editores_nome_curto check (char_length(nome) <= 80);
  end if;
end $$;

comment on column public.editores.foto is
  'Foto do avatar no painel: caminho do site (/media/...) ou URL https do Storage. Nula = iniciais.';

-- ── quem altera o quê ────────────────────────────────────────────────────

revoke update on public.editores from anon, authenticated;
grant update (nome, foto) on public.editores to authenticated;

drop policy if exists editores_alteram_a_si on public.editores;
create policy editores_alteram_a_si on public.editores
  for update to authenticated
  using      (id = auth.uid() and public.e_editor())
  with check (id = auth.uid());

-- ── lista com e-mail e foto ──────────────────────────────────────────────

drop function if exists public.editores_com_email();

create function public.editores_com_email()
returns table (id uuid, nome text, email text, foto text, criado_em timestamptz, ultimo_acesso timestamptz)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select e.id, e.nome, u.email::text, e.foto, e.criado_em, u.last_sign_in_at
    from public.editores e
    join auth.users u on u.id = e.id
   where public.e_editor()
   order by e.nome;
$$;

comment on function public.editores_com_email() is
  'Editores com e-mail, foto e último acesso. Só devolve linhas para quem é editor.';

revoke all on function public.editores_com_email() from public, anon;
grant execute on function public.editores_com_email() to authenticated;
