/**
 * Imagem no meio do texto (botão "Imagem" do editor).
 *
 * Só com JavaScript: o editor envia o arquivo, recebe a URL pública e
 * insere a imagem no texto. Vai para `corpo/` no mesmo bucket das capas,
 * com o mesmo tratamento (ver `enviaImagem`).
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { ERROS, ErroPainel, arquivoDoCampo, enviaImagem } from '~/lib/painel-artigo';
import { slugDoTitulo } from '~/lib/markdown-editor';

export const prerender = false;

const json = (corpo: object, status = 200) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return json({ ok: false, mensagem: ERROS['sem-banco'] }, 503);

  const editor = await editorAtual(cookies);
  if (!editor) return json({ ok: false, mensagem: ERROS.sessao }, 401);

  let arquivo: File | null = null;
  try {
    arquivo = arquivoDoCampo(await request.formData(), 'arquivo');
  } catch {
    /* segue nulo */
  }
  if (!arquivo) return json({ ok: false, mensagem: ERROS['imagem-envio'] }, 400);

  const base = slugDoTitulo(arquivo.name.replace(/\.[^.]+$/, '')) || 'imagem';
  try {
    const enviada = await enviaImagem(editor.cliente, arquivo, `corpo/${Date.now()}-${base}`);
    return json({ ok: true, ...enviada });
  } catch (e) {
    const codigo = e instanceof ErroPainel ? e.codigo : 'imagem-envio';
    return json({ ok: false, mensagem: ERROS[codigo] ?? ERROS['imagem-envio'] }, 400);
  }
};
