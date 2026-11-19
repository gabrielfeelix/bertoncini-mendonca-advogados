/**
 * Ações numa mensagem do formulário de contato, a partir de
 * /painel/contatos/: marcar lida, marcar não lida, apagar.
 *
 * Mesmo desenho de `apagar.ts` e `lote.ts`: só POST, sessão do cookie,
 * e a escrita passa pela RLS (migração 006) com o token do editor. Quem não
 * é editor não mexe em nada, mesmo chamando a rota direto. A origem do
 * pedido é conferida pelo próprio Astro (`security.checkOrigin`, ligado por
 * padrão nas rotas de servidor), como nas outras rotas do painel.
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual, podeApagar } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';

export const prerender = false;

const LISTA = '/painel/contatos/';
const ACOES = ['lido', 'nao-lido', 'apagar'] as const;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, `${LISTA}?erro=salvar`, 'salvar');
  }

  const acao = String(dados.get('acao') ?? '') as (typeof ACOES)[number];
  if (acao === 'apagar' && !podeApagar(editor)) return responde(request, `${LISTA}?erro=permissao`, 'permissao');
  const id = Number(dados.get('id'));
  if (!ACOES.includes(acao) || !Number.isSafeInteger(id) || id <= 0) {
    return responde(request, `${LISTA}?erro=salvar`, 'salvar');
  }

  const tabela = editor.cliente.from('contatos');
  const { data, error } =
    acao === 'apagar'
      ? await tabela.delete().eq('id', id).select('id')
      : await tabela.update({ lido: acao === 'lido' }).eq('id', id).select('id');

  if (error) {
    console.error('[painel] falha na ação do contato', error.message);
    return responde(request, `${LISTA}?erro=salvar`, 'salvar');
  }

  /* Zero linhas sem erro: a mensagem já não existia, ou a RLS não deixou. */
  if (!data || data.length === 0) return responde(request, `${LISTA}?erro=contato-nao-achei`, 'contato-nao-achei');

  const feito = acao === 'apagar' ? 'contato-apagado' : `contato-${acao}`;
  /* Volta para a linha mexida (âncora), menos quando ela some. */
  return responde(request, `${LISTA}?feito=${feito}${acao === 'apagar' ? '' : `#contato-${id}`}`);
};
