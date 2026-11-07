/**
 * Ações em vários textos de uma vez, a partir das caixas marcadas na lista
 * (publicar, voltar a rascunho, apagar). Veio da seleção em massa do CMS de
 * origem; aqui é um formulário comum, que funciona sem JavaScript.
 *
 * Apagar em lote pede a caixa "confirmo" (com JavaScript, um `confirm()`
 * preenche por ela): é a única ação do painel que some com vários textos
 * num clique só.
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { avisoDoGancho, disparaRebuild, responde } from '~/lib/painel-artigo';

export const prerender = false;

const ACOES = ['publicar', 'rascunho', 'apagar'] as const;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, '/painel/?erro=salvar', 'salvar');
  }

  const acao = String(dados.get('acao') ?? '') as (typeof ACOES)[number];
  const slugs = [...new Set(dados.getAll('slugs').map((s) => String(s).trim().slice(0, 80)).filter(Boolean))].slice(0, 200);

  if (!ACOES.includes(acao)) return responde(request, '/painel/?erro=salvar', 'salvar');
  if (slugs.length === 0) return responde(request, '/painel/?erro=nenhum', 'nenhum');
  if (acao === 'apagar' && dados.get('confirma') !== '1') {
    return responde(request, '/painel/?erro=confirma', 'confirma');
  }

  const tabela = editor.cliente.from('artigos');
  const { data, error } =
    acao === 'apagar'
      ? await tabela.delete().in('slug', slugs).select('estado')
      : await tabela
          .update({ estado: acao === 'publicar' ? 'publicado' : 'rascunho' })
          .in('slug', slugs)
          .select('estado');

  if (error) {
    console.error('[painel] falha na ação em lote', error.message);
    return responde(request, '/painel/?erro=salvar', 'salvar');
  }

  if (!data || data.length === 0) return responde(request, '/painel/?erro=nao-achei', 'nao-achei');

  /* Publicar ou despublicar sempre mexe no site; apagar só se algum dos
     apagados estava publicado. */
  const mexeuNoSite = acao !== 'apagar' || data.some((a) => a.estado === 'publicado');
  const gancho = mexeuNoSite ? await disparaRebuild() : 'ok';
  return responde(request, `/painel/?feito=${acao === 'apagar' ? 'apagado' : 'lote'}${avisoDoGancho(gancho)}`);
};
