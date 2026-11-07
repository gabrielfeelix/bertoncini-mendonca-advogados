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
 * Conteúdo de largada (07/11/2026): o perfil da Beatriz, porque o do
 * escritório (@bertoncinimendonca.adv) só entra no ar em 17/11/2026.
 * Quando ele estiver no ar, trocar `perfilCurado` e os posts por ele (ou
 * configurar o token, e esta lista vira só reserva).
 */

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
  url: 'https://www.instagram.com/beatrizmendoncadv/',
  arroba: '@beatrizmendoncadv',
};

/* Os 8 posts do perfil em 07/11/2026 (o perfil tem só esses), com a capa original de cada um. */
export const postsCurados: PostCurado[] = [
  {
    link: 'https://www.instagram.com/p/DfaV1G3mz-M/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfaV1G3mz-M.webp',
    legenda: 'Parceria com influenciador precisa de confiança e de contrato claro.',
    data: '2026-11-06',
  },
  {
    link: 'https://www.instagram.com/p/DfX4XedGxZU/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfX4XedGxZU.webp',
    legenda: 'A Black Friday pode ser uma grande oportunidade de vendas, mas sua operação está preparada para os imprevistos?',
    data: '2026-11-05',
  },
  {
    link: 'https://www.instagram.com/reel/DfUu6liREbE/',
    tipo: 'video',
    imagem: '/media/instagram/DfUu6liREbE.webp',
    legenda: 'Fechar uma publicidade é ótimo, mas você sabe exatamente o que está assumindo ao assinar o contrato?',
    data: '2026-11-04',
  },
  {
    link: 'https://www.instagram.com/p/DfSpyXUGyBp/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfSpyXUGyBp.webp',
    legenda: 'Seu perfil está preparado para a nova fiscalização da Meta?',
    data: '2026-11-03',
  },
  {
    link: 'https://www.instagram.com/p/DfIW9d9ieox/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfIW9d9ieox.webp',
    legenda: 'Você já imaginou ter que mudar o nome da sua empresa depois de anos investindo na construção da sua marca?',
    data: '2026-10-30',
  },
  {
    link: 'https://www.instagram.com/p/DfFWu_5kc5q/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfFWu_5kc5q.webp',
    legenda: 'Seu Instagram comercial pode ser um dos ativos mais importantes do seu negócio. Você tem provas do valor que ele gera?',
    data: '2026-10-29',
  },
  {
    link: 'https://www.instagram.com/p/DfDQ3UzGyFr/',
    tipo: 'carrossel',
    imagem: '/media/instagram/DfDQ3UzGyFr.webp',
    legenda: 'O digital abre oportunidades para empresas, empreendedores e criadores de conteúdo.',
    data: '2026-10-28',
  },
  {
    link: 'https://www.instagram.com/reel/De9i83txxBl/',
    tipo: 'video',
    imagem: '/media/instagram/De9i83txxBl.webp',
    legenda: 'Prazer, eu sou a Beatriz! Por aqui, vamos falar sobre Direito Digital de um jeito prático.',
    data: '2026-10-26',
  },
];
