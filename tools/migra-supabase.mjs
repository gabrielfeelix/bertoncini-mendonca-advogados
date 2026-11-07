/**
 * Aplica os .sql de `supabase/migracoes/` no banco, em ordem de nome.
 *
 *   SUPABASE_DB_URL=postgresql://... npm run cms:migra
 *
 * `SUPABASE_DB_URL` é a connection string do Postgres do projeto (no painel
 * do Supabase: Connect → Session pooler; a senha é a do banco, definida ao
 * criar o projeto). Fala o protocolo do Postgres direto, porque o PostgREST
 * não executa DDL e não precisamos de psql instalado.
 *
 * Cada arquivo roda numa transação e fica registrado em
 * `cms_controle.migracoes` — schema fora do `public`, para a tabela de
 * controle não ficar exposta pela API do Supabase. Rodar de novo não repete
 * o que já passou; e cada migração é idempotente por si, então reaplicar uma
 * à mão (`--forcar 003-bucket-capas.sql`) também é seguro.
 */
import pg from 'pg';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { exige } from './cms-ambiente.mjs';

const [url] = exige('SUPABASE_DB_URL');
const i = process.argv.indexOf('--forcar');
const forcar = i > -1 ? process.argv[i + 1] : undefined;

const cliente = new pg.Client({
  connectionString: url,
  // O certificado do pooler do Supabase não está na cadeia padrão do Node.
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000,
});

await cliente.connect();
await cliente.query(`
  create schema if not exists cms_controle;
  create table if not exists cms_controle.migracoes (
    arquivo     text primary key,
    aplicada_em timestamptz not null default now()
  );
`);

const jaFeitas = new Set(
  (await cliente.query('select arquivo from cms_controle.migracoes')).rows.map((r) => r.arquivo),
);

const dir = 'supabase/migracoes';
const arquivos = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
if (forcar && !arquivos.includes(forcar)) {
  console.error(`não existe ${dir}/${forcar}`);
  process.exit(1);
}

let aplicadas = 0;
for (const arquivo of arquivos) {
  if (jaFeitas.has(arquivo) && arquivo !== forcar) {
    console.log(`·  ${arquivo} (já aplicada)`);
    continue;
  }
  const sql = readFileSync(join(dir, arquivo), 'utf8');
  try {
    await cliente.query('begin');
    await cliente.query(sql);
    await cliente.query(
      `insert into cms_controle.migracoes (arquivo) values ($1)
       on conflict (arquivo) do update set aplicada_em = now()`,
      [arquivo],
    );
    await cliente.query('commit');
    console.log(`✓  ${arquivo}`);
    aplicadas++;
  } catch (e) {
    await cliente.query('rollback');
    console.error(`✗  ${arquivo}\n   ${e.message}`);
    await cliente.end();
    process.exit(1);
  }
}

console.log(aplicadas ? `\n${aplicadas} migração(ões) aplicada(s).` : '\nO banco já estava em dia.');
await cliente.end();
