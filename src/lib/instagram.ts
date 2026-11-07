/**
 * Publicações do Instagram para a seção FeedInstagram, resolvidas no BUILD.
 *
 * Ideia herdada do site da Isabella Pires (src/lib/instagram.ts de lá),
 * com uma diferença de propósito: aqui a página não carrega NADA da Meta.
 * Sem embed.js, sem iframe, sem imagem servida pelo CDN do Instagram. Por
 * isso não há cookie de terceiro nem dado do visitante indo para a Meta, e
 * a seção não depende do aviso de cookies (LGPD).
 *
 * Duas fontes, nesta ordem:
 *
 * 1. **Instagram Graph API**, quando INSTAGRAM_TOKEN e INSTAGRAM_CONTA_ID
 *    existem no ambiente do build. Busca os últimos posts e BAIXA a
 *    imagem de cada um (a miniatura, no caso de vídeo), em 4:5 (640×800)
 *    e convertida para WebP. As imagens são servidas do nosso
 *    domínio pela rota src/pages/media/ig/[id].webp.ts, que vira arquivo
 *    estático no build. Exige conta Business/Creator; o token de longa
 *    duração vale 60 dias e precisa ser renovado.
 *
 * 2. **Lista curada à mão** (src/lib/instagram-posts.ts), com imagens em
 *    public/media/instagram/. É o que vale sem token, com token vencido,
 *    com a API fora do ar ou se ela devolver pouca coisa.
 *
 * Nunca derruba o build: qualquer falha da API vira aviso no log e cai na
 * lista curada. Lista vazia e sem API: a seção simplesmente não aparece.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { env } from './ambiente';
import { site } from './site';
import { perfilCurado, postsCurados, type TipoPost } from './instagram-posts';

export type { TipoPost } from './instagram-posts';

export interface PostInstagram {
  /** Identificador estável (id da API ou código do link). */
  id: string;
  link: string;
  tipo: TipoPost;
  legenda: string;
  /** Capa em 4:5 servida do nosso domínio (caminho começando com "/"). */
  imagem: string;
  /** Data ISO da publicação, quando se sabe. */
  data?: string;
  alt?: string;
}

export interface Feed {
  posts: PostInstagram[];
  perfil: { url: string; arroba: string };
  origem: 'api' | 'curadoria';
}

/** Quantos posts pedir à API (a seção mostra até 8). */
const QUANTOS = 8;
/** Abaixo disto, a API "deu pouca coisa" e a lista curada é melhor. */
const MINIMO_DA_API = 3;
/**
 * Tamanho da capa gerada a partir dos posts da API: 4:5, o formato das
 * artes do Instagram (1080×1350), para a arte caber inteira no card.
 * Reels (9:16) são recortados pelo centro.
 */
const LARGURA = 640;
const ALTURA = 800;
/**
 * Versão da Graph API. Cada versão vale cerca de dois anos; quando esta
 * vencer, a Meta passa a responder com erro, o log do build avisa e o
 * site cai na lista curada até alguém atualizar o número aqui.
 */
const VERSAO_API = 'v24.0';
/** Tempo máximo de cada chamada: o build não pode ficar preso num terceiro. */
const TEMPO_LISTA_MS = 8_000;
const TEMPO_IMAGEM_MS = 8_000;

/** O que a Graph API devolve por post (só os campos pedidos). */
interface PostGraph {
  id: string;
  permalink?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp?: string;
}

const TIPO_DA_API: Record<string, TipoPost> = {
  IMAGE: 'imagem',
  VIDEO: 'video',
  CAROUSEL_ALBUM: 'carrossel',
};

/**
 * Começo da legenda, limpo para caber num card: primeira linha, sem
 * hashtags nem menções soltas, cortada numa palavra inteira.
 */
export function legendaCurta(texto: string | undefined, limite = 120): string {
  if (!texto) return '';
  const primeira = texto
    .split(/\n/)
    .map((linha) => linha.replace(/[#][\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim())
    .find((linha) => linha.length > 0) ?? '';
  if (primeira.length <= limite) return primeira;
  const corte = primeira.slice(0, limite);
  const espaco = corte.lastIndexOf(' ');
  return `${(espaco > limite * 0.6 ? corte.slice(0, espaco) : corte).replace(/[\s,.;:!?–—-]+$/u, '')}…`;
}

/** Lista curada, sem os itens cuja imagem não existe em public/. */
function feedCurado(): Feed {
  const publico = join(process.cwd(), 'public');
  const posts = postsCurados.flatMap((p): PostInstagram[] => {
    if (!existsSync(join(publico, p.imagem))) {
      console.warn(`[instagram] imagem não encontrada em public${p.imagem} — post ${p.link} fora da seção.`);
      return [];
    }
    const id = p.link.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)?.[1] ?? p.imagem;
    return [{ id, link: p.link, tipo: p.tipo, legenda: p.legenda, imagem: p.imagem, data: p.data, alt: p.alt }];
  });
  return { posts, perfil: perfilCurado, origem: 'curadoria' };
}

/** Baixa uma imagem e devolve o WebP 4:5, ou null se não der. */
async function baixarImagem(url: string): Promise<Buffer | null> {
  try {
    const resposta = await fetch(url, { signal: AbortSignal.timeout(TEMPO_IMAGEM_MS) });
    if (!resposta.ok) return null;
    /* Carrossel que começa com vídeo devolve o vídeo em media_url: pula. */
    if (!resposta.headers.get('content-type')?.startsWith('image/')) return null;
    const original = Buffer.from(await resposta.arrayBuffer());
    const { default: sharp } = await import('sharp');
    return await sharp(original)
      .resize(LARGURA, ALTURA, { fit: 'cover', position: 'centre' })
      .webp({ quality: 78 })
      .toBuffer();
  } catch {
    return null;
  }
}

interface Carga {
  feed: Feed;
  /** Imagens baixadas da API, por id do post. Vazio quando a fonte é a curadoria. */
  imagens: Map<string, Buffer>;
}

async function carregar(): Promise<Carga> {
  const token = env('INSTAGRAM_TOKEN');
  const conta = env('INSTAGRAM_CONTA_ID');
  const vazio = new Map<string, Buffer>();

  if (!token || !conta) return { feed: feedCurado(), imagens: vazio };

  try {
    /* Token do "Login do Instagram" (começa com IG) fala com
       graph.instagram.com; o do "Login do Facebook", com graph.facebook.com. */
    const host = token.startsWith('IG') ? 'graph.instagram.com' : 'graph.facebook.com';
    const campos = 'id,permalink,media_type,media_url,thumbnail_url,caption,timestamp';
    const url = new URL(`https://${host}/${VERSAO_API}/${conta}/media`);
    url.searchParams.set('fields', campos);
    url.searchParams.set('limit', String(QUANTOS + 4));
    url.searchParams.set('access_token', token);

    const resposta = await fetch(url, { signal: AbortSignal.timeout(TEMPO_LISTA_MS) });
    if (!resposta.ok) {
      /* O corpo traz a mensagem da Meta; o token não aparece nele. */
      const corpo = await resposta.text().catch(() => '');
      throw new Error(`HTTP ${resposta.status} ${corpo.slice(0, 200)}`);
    }
    const { data } = (await resposta.json()) as { data?: PostGraph[] };

    const candidatos = (data ?? [])
      .filter((p) => p.permalink && p.media_type && TIPO_DA_API[p.media_type])
      .slice(0, QUANTOS);

    const imagens = new Map<string, Buffer>();
    const posts: PostInstagram[] = [];
    const baixadas = await Promise.all(
      candidatos.map((p) => {
        const fonte = p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url;
        return fonte ? baixarImagem(fonte) : Promise.resolve(null);
      }),
    );
    candidatos.forEach((p, i) => {
      const imagem = baixadas[i];
      if (!imagem || !/^[0-9A-Za-z_-]+$/.test(p.id)) return;
      imagens.set(p.id, imagem);
      posts.push({
        id: p.id,
        link: p.permalink!,
        tipo: TIPO_DA_API[p.media_type!],
        legenda: legendaCurta(p.caption),
        imagem: `/media/ig/${p.id}.webp`,
        /* A API manda "+0000"; o ISO completo é o que o <time> espera. */
        data: p.timestamp && !Number.isNaN(Date.parse(p.timestamp)) ? new Date(p.timestamp).toISOString() : undefined,
      });
    });

    if (posts.length < MINIMO_DA_API) {
      throw new Error(`só ${posts.length} post(s) utilizáveis`);
    }

    console.log(`[instagram] ${posts.length} posts da API.`);
    return {
      feed: {
        posts,
        perfil: { url: site.redes.instagram.valor, arroba: site.redes.instagramArroba },
        origem: 'api',
      },
      imagens,
    };
  } catch (erro) {
    console.warn(
      `[instagram] API falhou (${erro instanceof Error ? erro.message : erro}) — usando a lista curada.`,
    );
    return { feed: feedCurado(), imagens: vazio };
  }
}

/* Uma busca só por build (e por processo do dev server): a seção e a rota
   das imagens leem o mesmo resultado, então nunca divergem. */
let carga: Promise<Carga> | undefined;
const carregarUmaVez = () => (carga ??= carregar());

/** Posts para a seção, já com imagens do nosso domínio. */
export async function feedInstagram(): Promise<Feed> {
  return (await carregarUmaVez()).feed;
}

/** Imagens baixadas da API, para a rota /media/ig/<id>.webp. */
export async function imagensDoInstagram(): Promise<Map<string, Buffer>> {
  return (await carregarUmaVez()).imagens;
}
