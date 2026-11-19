/**
 * Foto de perfil do painel: recorte quadrado de 320 px, no servidor.
 *
 * Mesmo caminho da capa (`enviaImagem` em painel-artigo.ts): `sharp` gira
 * conforme o EXIF, recorta e grava WebP sem metadados (foto de celular
 * carrega a localização GPS). Vai para a pasta `perfis/` do bucket
 * `artigos` (migração 003), com o cliente do editor: a política do bucket
 * é quem autoriza.
 *
 * O nome do arquivo leva a hora do envio: a URL muda a cada troca, e o
 * navegador não fica mostrando a foto antiga do cache.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { BUCKET, ErroPainel } from './painel-artigo';

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const TAMANHO_MAXIMO = 4 * 1024 * 1024;
const LADO = 320;
const PASTA = 'perfis';

export async function enviaFotoPerfil(
  cliente: SupabaseClient,
  arquivo: File,
  editorId: string,
): Promise<string> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) throw new ErroPainel('imagem-tipo');
  if (arquivo.size > TAMANHO_MAXIMO) throw new ErroPainel('imagem-grande');

  const bruto = Buffer.from(await arquivo.arrayBuffer());
  let corpo: Buffer = bruto;
  let tipo = arquivo.type;
  try {
    const { default: sharp } = await import('sharp');
    corpo = await sharp(bruto)
      .rotate()
      .resize(LADO, LADO, { fit: 'cover', position: 'attention' })
      .webp({ quality: 84 })
      .toBuffer();
    tipo = 'image/webp';
  } catch (erro) {
    /* Sem sharp, sobe como veio; o círculo do avatar recorta com CSS. */
    console.warn('[painel] sharp indisponível; a foto sobe como veio', erro);
  }

  const extensao = tipo.split('/')[1].replace('jpeg', 'jpg');
  const caminho = `${PASTA}/${editorId}-${Date.now()}.${extensao}`;
  const { error } = await cliente.storage.from(BUCKET).upload(caminho, corpo, { contentType: tipo, upsert: true });
  if (error) {
    console.error('[painel] falha no envio da foto', error.message);
    throw new ErroPainel('imagem-envio');
  }
  return cliente.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}

/**
 * Apaga do bucket a foto antiga, se ela for uma foto de perfil nossa.
 * Melhor esforço: falhar aqui não desfaz a troca. Fotos do site
 * (`/media/...`) nunca são tocadas.
 */
export async function apagaFotoAntiga(cliente: SupabaseClient, url: string | null): Promise<void> {
  if (!url) return;
  const marca = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marca);
  if (i < 0) return;
  const caminho = decodeURIComponent(url.slice(i + marca.length));
  if (!caminho.startsWith(`${PASTA}/`)) return;
  const { error } = await cliente.storage.from(BUCKET).remove([caminho]);
  if (error) console.warn('[painel] foto antiga ficou no bucket', error.message);
}
