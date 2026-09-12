/**
 * Autenticação do painel.
 *
 * Aqui entra o `@supabase/supabase-js`, que o resto do site não usa: o
 * loader do blog fala PostgREST por `fetch` porque só precisa ler uma tabela
 * pública no build, e a biblioteca inteira não se pagaria. O painel é outro
 * caso — precisa de login, de renovação de token e de escrita autenticada,
 * que é justamente o que a biblioteca resolve.
 *
 * ── Onde a sessão mora ──────────────────────────────────────────────────
 *
 * Em cookie `HttpOnly`, posto pelo servidor, e **não** no `localStorage`.
 * É a diferença que importa para um painel: token em `localStorage` é
 * legível por qualquer script da página, então um XSS no painel viraria
 * acesso de publicação. `HttpOnly` tira o token do alcance do JavaScript.
 *
 * Isso também é o que permite a página do painel ser renderizada no
 * servidor já autenticada, em vez de piscar um formulário de login antes de
 * o JavaScript descobrir que havia sessão.
 *
 * ── O que este arquivo NÃO decide ───────────────────────────────────────
 *
 * Quem é editor. Isso é do banco: a RLS pergunta `public.e_editor()` a cada
 * operação (`supabase/migracoes/002-permissoes.sql`). Uma sessão válida de
 * alguém que não está em `editores` consegue entrar na tela e não consegue
 * ler rascunho nem gravar nada. A verificação daqui é conveniência de
 * interface — a defesa real está no banco, onde ela não depende de o
 * navegador cooperar.
 *
 * **Aviso herdado do handoff, que continua valendo:** as políticas de RLS
 * nunca foram aplicadas a banco nenhum. A sintaxe foi validada; o
 * comportamento, não. Este módulo assume o contrato descrito na migração.
 * Ao ligar o banco de verdade, confira primeiro que editor autenticado lê
 * rascunho e anônimo não.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import { env } from './ambiente';

const COOKIE_ACESSO = 'sb-acesso';
const COOKIE_ATUALIZA = 'sb-atualiza';

/** Configuração do Supabase, ou `null` quando o banco ainda não existe. */
export function configSupabase(): { url: string; chave: string } | null {
  const url = env('PUBLIC_SUPABASE_URL');
  const chave = env('PUBLIC_SUPABASE_ANON_KEY');
  return url && chave ? { url, chave } : null;
}

/** Cliente sem sessão, para a tela de login. */
export function clienteAnonimo(): SupabaseClient | null {
  const cfg = configSupabase();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cliente já autenticado com a sessão do cookie.
 *
 * Toda consulta feita por ele chega ao banco como o editor, então a RLS
 * decide o que ele pode ver e mudar. Nenhuma chave de serviço passa por
 * aqui: o painel não tem poder que a RLS não conceda.
 */
export function clienteComSessao(token: string): SupabaseClient | null {
  const cfg = configSupabase();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.chave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

/** Grava a sessão em cookies HttpOnly. `secure` só fora do dev. */
export function gravaSessao(
  cookies: AstroCookies,
  sessao: { access_token: string; refresh_token: string; expires_in?: number },
): void {
  const producao = import.meta.env.PROD;
  const comum = {
    httpOnly: true,
    secure: producao,
    sameSite: 'lax' as const,
    path: '/',
  };
  cookies.set(COOKIE_ACESSO, sessao.access_token, {
    ...comum,
    maxAge: sessao.expires_in ?? 3600,
  });
  cookies.set(COOKIE_ATUALIZA, sessao.refresh_token, {
    ...comum,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function apagaSessao(cookies: AstroCookies): void {
  cookies.delete(COOKIE_ACESSO, { path: '/' });
  cookies.delete(COOKIE_ATUALIZA, { path: '/' });
}

export interface Editor {
  id: string;
  email: string;
  nome: string;
}

/**
 * Quem está pedindo, ou `null`.
 *
 * Renova o token quando o de acesso expirou e o de atualização ainda vale,
 * para o editor não ser deslogado no meio de um texto — perder o que se
 * estava escrevendo é o tipo de coisa que faz um painel deixar de ser
 * usado.
 */
export async function editorAtual(cookies: AstroCookies): Promise<Editor | null> {
  const cfg = configSupabase();
  if (!cfg) return null;

  const acesso = cookies.get(COOKIE_ACESSO)?.value;
  const atualiza = cookies.get(COOKIE_ATUALIZA)?.value;
  if (!acesso && !atualiza) return null;

  let token = acesso;

  if (!token && atualiza) {
    const anon = clienteAnonimo();
    if (!anon) return null;
    const { data, error } = await anon.auth.refreshSession({ refresh_token: atualiza });
    if (error || !data.session) {
      apagaSessao(cookies);
      return null;
    }
    gravaSessao(cookies, data.session);
    token = data.session.access_token;
  }

  if (!token) return null;

  const cliente = clienteComSessao(token);
  if (!cliente) return null;

  const { data: usuario, error } = await cliente.auth.getUser(token);
  if (error || !usuario.user) {
    apagaSessao(cookies);
    return null;
  }

  /* Conveniência de interface, não a defesa: a RLS já barra quem não é
     editor. Serve para dizer "esta conta não tem acesso ao painel" em vez
     de mostrar uma lista vazia e deixar a pessoa achando que quebrou. */
  const { data: linha } = await cliente
    .from('editores')
    .select('nome')
    .eq('id', usuario.user.id)
    .maybeSingle();

  if (!linha) return null;

  return {
    id: usuario.user.id,
    email: usuario.user.email ?? '',
    nome: linha.nome,
  };
}

/** Token de acesso corrente, para as rotas de API do painel. */
export function tokenDaSessao(cookies: AstroCookies): string | null {
  return cookies.get(COOKIE_ACESSO)?.value ?? null;
}
