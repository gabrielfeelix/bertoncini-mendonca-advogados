/**
 * Escolhe de onde vêm os artigos do blog: do Supabase, quando o banco
 * existe, ou dos arquivos markdown em `src/content/artigos/`.
 *
 * ── Por que existe ──────────────────────────────────────────────────────
 *
 * O CMS do escritório ainda não tem banco (`PUBLIC_SUPABASE_URL` e
 * `PUBLIC_SUPABASE_ANON_KEY` não existem no ambiente), e enquanto isso o
 * loader do Supabase devolve zero artigo — comportamento correto e
 * deliberado, ver a nota no topo de `loader-supabase.ts`. Só que com zero
 * artigo o blog é uma seção que não aparece, e o site foi para o ar sem
 * nenhum texto.
 *
 * O schema da coleção já previa a segunda fonte desde o começo ("o mesmo
 * objeto valida uma linha do Supabase e um arquivo markdown local com este
 * frontmatter"); isto é o que a liga.
 *
 * ── A regra de precedência, e por que é esta ────────────────────────────
 *
 * O banco MANDA. Havendo credencial no ambiente, é o Supabase que
 * responde, e os arquivos do repositório são ignorados por completo. O
 * contrário — juntar as duas fontes — criaria um blog em que apagar um
 * texto pelo painel não o tira do ar, porque a versão de arquivo continua
 * lá. Um artigo publicado que o escritório não consegue despublicar é
 * defeito grave num site de advocacia, onde o texto tem consequência.
 *
 * Ou seja: os arquivos são o conteúdo de largada, e saem de cena sozinhos
 * no dia em que o painel entrar no ar. Nenhuma migração, nenhum passo
 * manual — é só configurar as variáveis na Vercel.
 */
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { env } from './ambiente';
import { artigosDoSupabase, VARIAVEIS_SUPABASE } from './loader-supabase';

export function artigosDoRepositorioOuSupabase(): Loader {
  const temBanco = Boolean(env(VARIAVEIS_SUPABASE.url) && env(VARIAVEIS_SUPABASE.chaveAnonima));

  if (temBanco) return artigosDoSupabase();

  /* `glob` é o loader de arquivo do próprio Astro: ele já lê o
     frontmatter, valida contra o schema da coleção e renderiza o corpo
     markdown. O `id` sai do nome do arquivo, que é o slug da URL — o
     mesmo papel que a coluna `slug` tem no banco. */
  return glob({ pattern: '**/*.md', base: './src/content/artigos' });
}
