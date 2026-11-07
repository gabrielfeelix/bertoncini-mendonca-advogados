/**
 * O que as rotas do painel têm em comum no servidor: a lista de categorias,
 * os recados, o envio de imagem para o Storage, o gancho de rebuild e a
 * forma de responder (redirecionamento sem JavaScript, JSON com ele).
 *
 * Fica fora das rotas porque três delas usam (salvar, apagar, lote) e
 * porque as páginas leem os mesmos recados que as rotas produzem.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from './ambiente';
import { listarAreasConfirmadas } from './areas';
import { site } from './site';

/** Bucket da migração 003, com `capas/` e `corpo/`. */
export const BUCKET = 'artigos';

/* ── categorias ──────────────────────────────────────────────────────── */

/** Categoria de quem não escolhe nenhuma área (mesmo padrão do banco). */
const CATEGORIA_PADRAO = 'Informativo';

const normaliza = (texto: string) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/**
 * As categorias que o painel oferece: as áreas com página (na ordem do
 * site), as áreas de "Também atuamos em" e "Informativo".
 *
 * É a lista fechada que mantém o filtro de /conteudos/ limpo: a lista de
 * áreas de lá sai dos dados, e "Direito digital" e "Direito Digital"
 * apareceriam como duas opções.
 */
export async function categoriasDoPainel(): Promise<string[]> {
  const principais = (await listarAreasConfirmadas()).map((a) => a.data.nome);
  return [...new Set([...principais, ...site.outrasAreas, CATEGORIA_PADRAO])];
}

/**
 * A grafia oficial de uma categoria, comparando sem caixa e sem acento.
 * Os artigos de largada foram escritos com "Direito digital"; ao abrir um
 * deles, o painel marca "Direito Digital" e grava assim ao salvar.
 */
export function categoriaCanonica(texto: string, lista: readonly string[]): string | undefined {
  const alvo = normaliza(texto);
  return lista.find((c) => normaliza(c) === alvo);
}

/* ── recados ─────────────────────────────────────────────────────────── */

/** Erros que as rotas devolvem em `?erro=` (ou em JSON), com o texto da tela. */
export const ERROS: Record<string, string> = {
  'sem-banco': 'O banco ainda não está configurado neste ambiente.',
  sessao: 'A sessão expirou. Entre de novo.',
  credenciais: 'E-mail ou senha incorretos.',
  'sem-acesso': 'Esta conta não está cadastrada como editora do site.',
  campos: 'Preencha o e-mail e a senha.',
  limite: 'Muitos pedidos seguidos. Espere alguns minutos e tente de novo.',
  link: 'O link de troca de senha venceu ou já foi usado. Peça outro.',
  'senha-curta': 'A senha precisa de pelo menos 8 caracteres.',
  'senha-diferente': 'As duas senhas não são iguais.',
  'senha-igual': 'Essa já é a senha atual. Escolha outra.',
  titulo: 'O texto precisa de um título.',
  resumo: 'O texto precisa de um resumo: ele aparece na lista e no Google.',
  corpo: 'O texto está vazio.',
  slug: 'Não consegui formar um endereço a partir desse título.',
  'slug-existe': 'Já existe um texto com esse endereço. Mude o título ou o endereço.',
  'nao-achei': 'Esse texto não existe mais, ou esta conta não tem permissão para mexer nele.',
  capa: 'Quando há capa, a descrição da imagem e as medidas (largura e altura) são obrigatórias.',
  'capa-url': 'O endereço da capa precisa começar com https:// ou com /.',
  'imagem-tipo': 'A imagem precisa ser JPG, PNG, WebP ou AVIF.',
  'imagem-grande': 'A imagem passa de 4 MB. Reduza o tamanho e envie de novo.',
  'imagem-envio': 'Não consegui enviar a imagem. Tente de novo.',
  confirma: 'Para apagar vários textos de uma vez, marque "confirmo" ao lado do botão.',
  nenhum: 'Nenhum texto foi marcado.',
  gancho: 'O gancho de deploy não está configurado: o site não vai se atualizar sozinho.',
  'gancho-falhou': 'A Vercel não aceitou o pedido de atualização do site. Tente de novo em instantes.',
  salvar: 'Não consegui salvar. Tente de novo.',
};

/** Avisos de sucesso, em `?feito=`. */
export const FEITOS: Record<string, string> = {
  publicado: 'Texto publicado. O site se atualiza em alguns minutos.',
  rascunho: 'Rascunho guardado. Ele não aparece no site.',
  despublicado: 'O texto voltou a ser rascunho e sai do site na próxima atualização, em alguns minutos.',
  apagado: 'Texto apagado.',
  lote: 'Textos atualizados. O site se atualiza em alguns minutos.',
  reconstruindo: 'Pedido enviado. O site se atualiza em alguns minutos.',
  saiu: 'Você saiu do painel.',
  senha: 'Senha trocada.',
};

/* ── resposta ────────────────────────────────────────────────────────── */

/**
 * Responde a um formulário do painel.
 *
 * Sem JavaScript, o navegador segue o 303 e a página mostra o recado de
 * `?erro=`/`?feito=`. Com JavaScript, o script do editor pede JSON
 * (`Accept: application/json`) e mostra o erro ali mesmo, sem recarregar —
 * assim o texto que a pessoa escreveu não se perde por um campo esquecido.
 *
 * `destino` é sempre um caminho montado pela rota, nunca vindo do pedido:
 * destino escolhido pelo cliente é redirecionador aberto.
 */
export function responde(request: Request, destino: string, erro?: string): Response {
  if ((request.headers.get('accept') ?? '').includes('application/json')) {
    const corpo = erro
      ? { ok: false, erro, mensagem: ERROS[erro] ?? ERROS.salvar, destino }
      : { ok: true, destino };
    return new Response(JSON.stringify(corpo), {
      status: erro ? 400 : 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(null, { status: 303, headers: { location: destino } });
}

/* ── imagens ─────────────────────────────────────────────────────────── */

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/* A função da Vercel recusa corpo de requisição acima de 4,5 MB. O script
   do editor reduz a imagem antes de enviar; o limite aqui é para quem envia
   sem JavaScript ter um recado claro em vez de um erro da plataforma. */
const TAMANHO_MAXIMO = 4 * 1024 * 1024;

export class ErroPainel extends Error {
  constructor(public codigo: string) {
    super(codigo);
  }
}

/** Arquivo de um campo `<input type="file">`, ou `null` se veio vazio. */
export function arquivoDoCampo(dados: FormData, campo: string): File | null {
  const valor = dados.get(campo);
  return valor instanceof File && valor.size > 0 ? valor : null;
}

/**
 * Envia uma imagem ao bucket e devolve a URL pública e as medidas.
 *
 * A imagem passa pelo `sharp`: gira conforme o EXIF, encolhe para no máximo
 * 2400 px e vira WebP. O WebP sai sem metadados, e isso importa: foto de
 * celular carrega a localização GPS de onde foi tirada.
 *
 * Se o `sharp` não carregar na função do servidor, a imagem sobe como veio,
 * com as medidas que o navegador mediu (campos `*_largura`/`*_altura`).
 *
 * O envio usa o cliente do editor: a política do bucket (migração 003) é
 * quem autoriza, como em qualquer escrita do painel.
 */
export async function enviaImagem(
  cliente: SupabaseClient,
  arquivo: File,
  caminhoSemExtensao: string,
  medidasDoNavegador: { largura?: number; altura?: number } = {},
): Promise<{ url: string; largura: number; altura: number }> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) throw new ErroPainel('imagem-tipo');
  if (arquivo.size > TAMANHO_MAXIMO) throw new ErroPainel('imagem-grande');

  const bruto = Buffer.from(await arquivo.arrayBuffer());
  let corpo: Buffer = bruto;
  let tipo = arquivo.type;
  let largura = medidasDoNavegador.largura;
  let altura = medidasDoNavegador.altura;

  try {
    const { default: sharp } = await import('sharp');
    const { data, info } = await sharp(bruto)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    corpo = data;
    tipo = 'image/webp';
    largura = info.width;
    altura = info.height;
  } catch (erro) {
    console.warn('[painel] sharp indisponível; a imagem sobe como veio', erro);
  }

  if (!largura || !altura) throw new ErroPainel('capa');

  const extensao = tipo.split('/')[1].replace('jpeg', 'jpg');
  const caminho = `${caminhoSemExtensao}.${extensao}`;
  const { error } = await cliente.storage
    .from(BUCKET)
    .upload(caminho, corpo, { contentType: tipo, upsert: true });
  if (error) {
    console.error('[painel] falha no envio da imagem', error.message);
    throw new ErroPainel('imagem-envio');
  }

  const url = cliente.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
  return { url, largura, altura };
}

/* ── rebuild ─────────────────────────────────────────────────────────── */

/**
 * Pede à Vercel um build novo (Deploy Hook).
 *
 * O site é estático: publicar, despublicar ou apagar só aparece para o
 * visitante depois do build. A URL do gancho é segredo (quem a tiver
 * dispara builds à vontade), por isso mora só no servidor.
 *
 * A falha do gancho não desfaz o que foi salvo: vira recado, e o botão
 * "Atualizar o site" da lista tenta de novo.
 */
export async function disparaRebuild(): Promise<'ok' | 'sem-gancho' | 'falhou'> {
  const gancho = env('VERCEL_DEPLOY_HOOK');
  if (!gancho) {
    console.warn('[painel] VERCEL_DEPLOY_HOOK ausente: salvo no banco, mas o site não se atualiza sozinho.');
    return 'sem-gancho';
  }
  try {
    const resposta = await fetch(gancho, { method: 'POST' });
    return resposta.ok ? 'ok' : 'falhou';
  } catch (erro) {
    console.error('[painel] falha ao disparar o rebuild', erro);
    return 'falhou';
  }
}

/** Sufixo do destino quando o rebuild não aconteceu, para a lista avisar. */
export const avisoDoGancho = (resultado: 'ok' | 'sem-gancho' | 'falhou') =>
  resultado === 'ok' ? '' : `&aviso=${resultado === 'sem-gancho' ? 'gancho' : 'gancho-falhou'}`;
