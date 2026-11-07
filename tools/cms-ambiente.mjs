/**
 * Variáveis de ambiente das ferramentas do CMS (cms:migra, cms:importa,
 * cms:editor).
 *
 * Lê o `.env` da raiz do projeto, se existir, e deixa o ambiente do shell
 * ganhar dele: `SUPABASE_DB_URL=... npm run cms:migra` funciona sem `.env`.
 * O `.env` está no .gitignore e no .vercelignore; nada daqui sai da máquina.
 */
import { existsSync, readFileSync } from 'node:fs';

const doArquivo = existsSync('.env')
  ? Object.fromEntries(
      readFileSync('.env', 'utf8')
        .split('\n')
        .filter((l) => /^[A-Z_][A-Z0-9_]*=/.test(l))
        .map((l) => {
          const i = l.indexOf('=');
          return [l.slice(0, i), l.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
        }),
    )
  : {};

export function variavel(nome) {
  const valor = (process.env[nome] ?? doArquivo[nome] ?? '').trim();
  return valor || undefined;
}

/** Igual a `variavel`, mas encerra com recado claro se faltar. */
export function exige(...nomes) {
  const faltando = nomes.filter((n) => !variavel(n));
  if (faltando.length) {
    console.error(`Faltam no ambiente (ou no .env): ${faltando.join(', ')}`);
    console.error('Ver docs/HANDOFF-V3-2026-11-07.md, seção "CMS (vindo da Isabella)".');
    process.exit(1);
  }
  return nomes.map((n) => variavel(n));
}
