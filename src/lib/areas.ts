/**
 * Acesso à coleção `areas`, num lugar só, para a lista (`/areas/`) e para
 * as páginas de área (`/areas/[slug]/`) não repetirem a mesma leitura nem
 * discordarem sobre a ordem.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from './site';

export type Area = CollectionEntry<'areas'>;

/** Todas as áreas, na ordem definida pelo campo `ordem`. */
export async function listarAreas(): Promise<Area[]> {
  const areas = await getCollection('areas');
  return areas.sort((a, b) => a.data.ordem - b.data.ordem);
}

/** Só as áreas confirmadas com os sócios, que têm conteúdo e página. */
export async function listarAreasConfirmadas(): Promise<Area[]> {
  return (await listarAreas()).filter((area) => !area.data.aConfirmar);
}

/**
 * Link do WhatsApp com o assunto da área já escrito, como no protótipo
 * (linhas 566 e 577). O texto vem do conteúdo; a codificação acontece
 * aqui, para nenhum arquivo de conteúdo precisar guardar percent-encoding.
 */
export function whatsappDaArea(mensagem: string): string {
  const base = site.whatsapp.valor.split('?')[0];
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}
