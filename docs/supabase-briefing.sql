-- Tabela do formulário de briefing do Bertoncini & Mendonça.
-- Rodar uma vez no SQL Editor do projeto qoifhphjfjykweqymqxi.
--
-- RLS fica LIGADA e sem policy nenhuma de propósito: ninguém alcança esta
-- tabela com a chave pública. Quem escreve é a rota /api/briefing, que usa a
-- SECRET_KEY do servidor e passa por cima da RLS. É o desenho que mantém a
-- chave fora do HTML.

create table if not exists public.briefing_bertoncini_mendonca (
  id           text primary key,
  respostas    jsonb       not null default '{}'::jsonb,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.briefing_bertoncini_mendonca enable row level security;
