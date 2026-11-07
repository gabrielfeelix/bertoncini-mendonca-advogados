-- 005: crédito da capa (CMS vindo do site da Isabella, 07/11/2026).
--
-- O schema da coleção já tinha `capaCredito` (CC BY e CC BY-SA obrigam a
-- creditar autor e licença onde a imagem aparece; ver content.config.ts),
-- e dois dos artigos de largada usam. Faltava a coluna: sem ela, a carga
-- inicial (`npm run cms:importa`) perdia o crédito e a página passava a
-- descumprir a licença da foto. Idempotente.

alter table public.artigos
  add column if not exists capa_credito text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'artigos_capa_credito_valido'
  ) then
    alter table public.artigos
      add constraint artigos_capa_credito_valido
      -- crédito só faz sentido com capa, e cabe numa linha sob a imagem
      check (capa_credito is null
             or (capa is not null and length(trim(capa_credito)) between 1 and 200));
  end if;
end $$;

comment on column public.artigos.capa_credito is
  'Crédito da capa quando a licença exige (ex.: "Foto: Fulano, CC BY 2.0"). Sai sob a imagem.';
