/**
 * Acesso à coleção `artigos`, num lugar só, para a lista (`/blog/`) e para
 * a página do artigo (`/blog/[slug]/`) não repetirem a mesma leitura nem
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

/**
 * Como o blog se chama na interface.
 *
 * Era "Em português claro", nome próprio, e a palavra "blog" não aparecia
 * para o leitor. O cliente reverteu: "tudo BLOG, sempre, textos nunca" —
 * a rota virou /blog/ e o rótulo é Blog em todo lugar. Nome próprio de
 * seção obriga o leitor a descobrir o que a seção é; "Blog" ele já sabe.
 */
export const NOME_DO_BLOG = 'Blog';

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

/*
  `tomDaCapa()` saiu daqui.

  Ela devolvia uma cor por categoria para o `mix-blend-mode: color` que
  tingia a capa do cartão — mecanismo herdado do protótipo. O cliente
  reprovou tratamento de cor sobre imagem em qualquer lugar do site: a
  foto sai com a cor dela, e no cartão sobrou só uma vinheta sutil, que
  existe para o rótulo de categoria ter contraste.

  Removida em vez de deixada sem uso: função exportada que ninguém chama é
  convite para alguém reaplicar o efeito sem saber que ele foi revogado.
*/
