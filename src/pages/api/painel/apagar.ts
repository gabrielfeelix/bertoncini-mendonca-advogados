/**
 * Apagar um texto (o CMS de origem só despublicava pela tela do artigo).
 *
 * Só POST, e a exclusão passa pela RLS como qualquer outra escrita: quem
 * não é editor não apaga nada, mesmo chamando a rota direto. Se o texto
 * estava no site, pede o rebuild — sem ele a página continuaria no ar até o
 * próximo build.
 *
 * A capa fica no bucket: pode estar sendo usada em outro texto, e um
 * arquivo órfão custa menos que uma imagem quebrada.
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { avisoDoGancho, disparaRebuild, responde } from '~/lib/painel-artigo';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  let slug = '';
  try {
    slug = String((await request.formData()).get('slug') ?? '').trim().slice(0, 80);
  } catch {
    /* segue vazio */
  }
  if (!slug) return responde(request, '/painel/');

  const { data, error } = await editor.cliente
    .from('artigos')
    .delete()
    .eq('slug', slug)
    .select('estado');

  if (error) {
    console.error('[painel] falha ao apagar', error.message);
    return responde(request, `/painel/artigo/?slug=${encodeURIComponent(slug)}&erro=salvar`, 'salvar');
  }

  /* Zero linhas apagadas sem erro: o texto já não existia, ou a RLS não
     deixou. Dizer "apagado" aqui seria mentir. */
  if (!data || data.length === 0) return responde(request, '/painel/?erro=nao-achei', 'nao-achei');

  const estavaNoSite = data.some((a) => a.estado === 'publicado');
  const gancho = estavaNoSite ? await disparaRebuild() : 'ok';
  return responde(request, `/painel/?feito=apagado${avisoDoGancho(gancho)}`);
};
