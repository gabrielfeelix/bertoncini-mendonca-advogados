/**
 * Acesso à coleção `artigos`, num lugar só, para a lista (`/textos/`) e para
 * a página do artigo (`/textos/[slug]/`) não repetirem a mesma leitura nem
 * discordarem sobre a ordem.
 *
 * A coleção vem do Supabase pelo loader em `loader-supabase.ts`, e **pode
 * vir vazia**: enquanto o banco do escritório não existe, o loader devolve
 * zero artigo e o build segue. Quem consome estas funções precisa tratar a
 * lista vazia, não supor que há pelo menos um artigo.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Artigo = CollectionEntry<'artigos'>;

/** Quantos artigos cabem numa página da lista, além do destaque. */
export const POR_PAGINA = 6;

/** O nome próprio do blog. Nunca "Blog". */
export const NOME_DO_BLOG = 'Em português claro';

/**
 * Todos os artigos publicados, do mais novo para o mais velho.
 *
 * O filtro por `estado` é redundante com a consulta do loader, e redundante
 * de propósito: se um dia a coleção ganhar uma segunda fonte (um markdown
 * local, que o schema já aceita), o rascunho não vaza para o site por
 * esquecimento.
 */
export async function listarArtigos(): Promise<Artigo[]> {
  const artigos = await getCollection('artigos', ({ data }) => data.estado === 'publicado');
  return artigos.sort((a, b) => b.data.publicadoEm.valueOf() - a.data.publicadoEm.valueOf());
}

/** Data por extenso, em português, para a lista e para o artigo. */
export function dataLegivel(valor: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(valor);
}

/**
 * Cor do tratamento da capa, escolhida pela categoria.
 *
 * O protótipo aplica um `mix-blend-mode: color` sobre a capa com uma das
 * cores do site (linhas 700-730), e cada cartão de lá usa uma cor diferente.
 * Como as capas reais ainda não existem, a escolha aqui é derivada da
 * categoria em vez de sorteada: o mesmo assunto fica com a mesma cor em toda
 * a lista, o que ajuda a reconhecer o tipo de texto de relance. Categoria
 * desconhecida cai na tinta, que é a cor neutra do site.
 */
export function tomDaCapa(categoria: string): string {
  const normalizada = categoria
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (normalizada.includes('familia')) return '#0B1E3F';
  if (normalizada.includes('compliance')) return '#004369';
  if (normalizada.includes('empresa')) return '#9B1C2E';
  return '#517493';
}
