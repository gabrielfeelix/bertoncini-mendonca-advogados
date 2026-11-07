/**
 * "Atualizar o site": pede o rebuild à mão.
 *
 * Veio do `/api/publica` do CMS de origem. Lá era o único caminho do
 * rebuild (o navegador salvava no banco e depois chamava esta rota); aqui
 * salvar, apagar e as ações em lote já pedem o rebuild sozinhas, no
 * servidor. Esta rota fica para o caso de o gancho ter falhado, ou de alguém
 * ter mexido no banco direto pelo console do Supabase.
 *
 * Confere que quem pede é editor: a URL do gancho é segredo, e sem a
 * conferência qualquer visitante poderia pedir build em looping.
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { disparaRebuild, responde } from '~/lib/painel-artigo';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  const resultado = await disparaRebuild();
  if (resultado === 'sem-gancho') return responde(request, '/painel/?erro=gancho', 'gancho');
  if (resultado === 'falhou') return responde(request, '/painel/?erro=gancho-falhou', 'gancho-falhou');
  return responde(request, '/painel/?feito=reconstruindo');
};
