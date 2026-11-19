/**
 * Publicações do Instagram escolhidas à mão: o que a seção mostra quando o
 * build não tem acesso à API (sem INSTAGRAM_TOKEN/INSTAGRAM_CONTA_ID, token
 * vencido ou API fora do ar). Ver src/lib/instagram.ts.
 *
 * Como trocar ou acrescentar um post:
 *   1. Salvar a capa do post (a primeira imagem; no reel, a thumbnail) em
 *      public/media/instagram/, em 4:5 (640×800, .webp), o formato das
 *      artes do Instagram: assim a arte aparece inteira no card. Reel
 *      (9:16) é recortado para 4:5 pelo centro; confira se não corta rosto
 *      nem texto.
 *   2. Acrescentar um item abaixo, com o link do post, o tipo, o começo
 *      da legenda (uma ou duas frases, sem hashtags) e a data.
 *   A ordem da lista é a ordem do carrossel: o mais recente primeiro.
 *
 * Lista vazia e nenhum token: a seção não aparece no site.
 *
 * Desde 18/11/2026 o perfil é o institucional (@bertoncinimendonca.adv,
 * de `site.redes`). Os posts da Beatriz que estavam aqui saíram: as
 * publicações dos sócios passam a sair em collab com o perfil do
 * escritório. Lista vazia: a seção mostra só o chamado para seguir o
 * perfil, sem grade. Para mostrar posts, acrescente-os abaixo.
 */

import { site } from './site';

export type TipoPost = 'imagem' | 'video' | 'carrossel';

export interface PostCurado {
  /** Endereço do post no Instagram (/p/<código>/ ou /reel/<código>/). */
  link: string;
  tipo: TipoPost;
  /** Começo da legenda, curto. Aparece embaixo da capa. */
  legenda: string;
  /** Capa em 4:5, caminho a partir de public/, começando com "/". */
  imagem: string;
  /** Data da publicação (AAAA-MM-DD). Opcional. */
  data?: string;
  /**
   * Descrição da imagem para leitor de tela. Opcional: o link já é lido
   * com a legenda, então a imagem fica decorativa quando isto falta.
   */
  alt?: string;
}

/** Perfil para onde o botão "Ver no Instagram" leva quando a lista abaixo é usada. */
export const perfilCurado = {
  url: site.redes.instagram.valor,
  arroba: site.redes.instagramArroba,
};

export const postsCurados: PostCurado[] = [];
