/**
 * Acesso à coleção `artigos`, num lugar só, para a lista (`/conteudos/`) e
 * para a página do artigo (`/conteudos/[slug]/`) não repetirem a mesma leitura nem
 * discordarem sobre a ordem.
 *
 * A coleção vem do Supabase pelo loader em `loader-supabase.ts`, e **pode
 * vir vazia**: enquanto o banco do escritório não existe, o loader devolve
 * zero artigo e o build segue. Quem consome estas funções precisa tratar a
 * lista vazia, não supor que há pelo menos um artigo.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from './site';

export type Artigo = CollectionEntry<'artigos'>;

/** Quantos artigos cabem numa página da lista, além do destaque. */
export const POR_PAGINA = 6;

/**
 * Como a seção de textos se chama na interface, e onde ela mora.
 *
 * Histórico: "Em português claro" (/textos/) → "Blog" (/blog/, pedido do
 * cliente: "tudo BLOG, sempre, textos nunca") → "Central de Conteúdos"
 * (/conteudos/, pedido do Gabriel em 07/11/2026, na linha do TozziniFreire).
 * Os endereços antigos redirecionam (src/pages/blog e src/pages/textos).
 * Se os sócios pedirem "Blog" de volta, é trocar o rótulo aqui.
 */
export const NOME_CONTEUDOS = 'Central de Conteúdos';
export const ROTA_CONTEUDOS = '/conteudos/';

/** Endereço de um artigo. */
export const hrefArtigo = (id: string) => `${ROTA_CONTEUDOS}${id}/`;

/**
 * Formatos de publicação. A chave é o que o banco grava; o rótulo é o que
 * o leitor vê (singular no cartão, plural no filtro).
 */
export const FORMATOS = {
  artigo: { singular: 'Artigo', plural: 'Artigos' },
  noticia: { singular: 'Notícia', plural: 'Notícias' },
  video: { singular: 'Vídeo', plural: 'Vídeos' },
} as const;
export type Formato = keyof typeof FORMATOS;

/** Minúsculas e sem acento, para comparar nomes. */
const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Chave curta de cada sócio ("juscelino", "beatriz"): âncora do perfil e valor do filtro. */
export const chaveDoSocio = (nome: string) => normalizar(nome.split(' ')[0]);

/**
 * Sócios que assinam o artigo.
 *
 * O campo `autor` é texto (o painel grava os nomes marcados, separados por
 * vírgula). Cada sócio entra se o primeiro nome dele aparece no campo, então
 * "Beatriz Mendonça", "Beatriz" e "Juscelino Bertoncini, Beatriz Mendonça"
 * funcionam. Vazio = texto do escritório, sem assinatura individual.
 */
export function autoresDoArtigo(autor: string) {
  const campo = normalizar(autor);
  if (!campo.trim()) return [];
  return site.socios.filter((s) => campo.includes(chaveDoSocio(s.nome)));
}

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
