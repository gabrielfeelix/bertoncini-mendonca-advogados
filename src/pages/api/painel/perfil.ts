/**
 * Nome e foto de quem está logado, a partir de /painel/conta/.
 *
 * `acao=salvar`: grava o nome e, se veio arquivo em `foto`, troca a foto
 * (recorte 320×320 no servidor, ver lib/painel-perfil.ts).
 * `acao=remover-foto`: volta para as iniciais.
 *
 * A escrita usa o cliente do editor: a migração 008 só deixa cada um
 * alterar a própria linha de `editores`, e só nome e foto. Mesma checagem
 * das outras rotas do painel (POST, sessão no cookie, origem pelo Astro).
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { arquivoDoCampo, ErroPainel, responde } from '~/lib/painel-artigo';
import { apagaFotoAntiga, enviaFotoPerfil } from '~/lib/painel-perfil';

export const prerender = false;

const CONTA = '/painel/conta/';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    /* Corpo grande demais para a função também cai aqui. */
    return responde(request, `${CONTA}?erro=imagem-grande`, 'imagem-grande');
  }

  const acao = String(dados.get('acao') ?? 'salvar');
  const fotoAntiga = editor.foto;
  let mudancas: { nome?: string; foto?: string | null };

  if (acao === 'remover-foto') {
    mudancas = { foto: null };
  } else {
    const nome = String(dados.get('nome') ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
    if (!nome) return responde(request, `${CONTA}?erro=usuario-nome`, 'usuario-nome');
    mudancas = { nome };
    const arquivo = arquivoDoCampo(dados, 'foto');
    if (arquivo) {
      try {
        mudancas.foto = await enviaFotoPerfil(editor.cliente, arquivo, editor.id);
      } catch (erro) {
        const codigo = erro instanceof ErroPainel ? erro.codigo : 'imagem-envio';
        return responde(request, `${CONTA}?erro=${codigo}`, codigo);
      }
    }
  }

  const { data, error } = await editor.cliente.from('editores').update(mudancas).eq('id', editor.id).select('id');
  if (error || !data || data.length === 0) {
    console.error('[painel] falha ao salvar perfil', error?.message ?? 'nenhuma linha');
    return responde(request, `${CONTA}?erro=salvar`, 'salvar');
  }

  if ('foto' in mudancas && fotoAntiga !== mudancas.foto) await apagaFotoAntiga(editor.cliente, fotoAntiga);

  const feito = acao === 'remover-foto' ? 'foto-removida' : 'perfil';
  return responde(request, `${CONTA}?feito=${feito}`);
};
