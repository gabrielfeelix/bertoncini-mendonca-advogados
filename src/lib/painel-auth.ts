/**
 * Sessão do painel, no servidor.
 *
 * O CMS veio do site da Isabella, onde a sessão mora no `localStorage` e o
 * navegador fala direto com o Supabase. Aqui a sessão mora em cookie
 * `HttpOnly`, posto pelo servidor, e o navegador só fala com as rotas
 * `/api/painel/*`. Três razões, todas herdadas do painel anterior deste site:
 *
 * 1. Token em `localStorage` é legível por qualquer script da página: um
 *    XSS no painel viraria acesso de publicação. `HttpOnly` tira o token do
 *    alcance do JavaScript.
 * 2. A conversão HTML → markdown do corpo (a defesa de XSS do site) precisa
 *    rodar no servidor. Com o navegador gravando direto no banco, ela seria
 *    opcional para quem fizesse a requisição à mão.
 * 3. O painel continua funcionando sem JavaScript: login, lista, edição em
 *    markdown, publicar e apagar são formulários HTML comuns.
 *
 * ── O que este arquivo NÃO decide ───────────────────────────────────────
 *
 * Quem é editor. Isso é do banco: a RLS pergunta `public.e_editor()` a cada
 * operação (`supabase/migracoes/002-permissoes.sql`). A verificação daqui é
 * conveniência de interface — a defesa real está no banco. Nenhuma chave de
 * serviço passa por aqui: o painel não tem poder que a RLS não conceda.
 */
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import { env } from './ambiente';
import { VARIAVEIS_SUPABASE } from './loader-supabase';

const COOKIE_ACESSO = 'sb-acesso';
const COOKIE_ATUALIZA = 'sb-atualiza';

/** Configuração do Supabase, ou `null` quando o banco ainda não existe. */
export function configSupabase(): { url: string; chave: string } | null {
  const url = env(VARIAVEIS_SUPABASE.url);
  const chave = env(VARIAVEIS_SUPABASE.chaveAnonima);
  return url && chave ? { url, chave } : null;
}

/** Cliente sem sessão (login, recuperação de senha). */
export function clienteAnonimo(): SupabaseClient | null {
  const cfg = configSupabase();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.chave, {
    auth: { persistSession: false, autoRefreshToken: false, flowType: 'implicit' },
  });
}

/**
 * Cliente que chega ao banco como o editor: toda consulta feita por ele
 * passa pela RLS com o token da sessão.
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
  const comum = {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    path: '/',
  };
  /* `setSession` (troca de senha) calcula `expires_in` como "expira em menos
     agora", com fração de segundo; o cookie só aceita inteiro. */
  const segundos = Math.max(1, Math.floor(sessao.expires_in ?? 3600));
  cookies.set(COOKIE_ACESSO, sessao.access_token, { ...comum, maxAge: segundos });
  cookies.set(COOKIE_ATUALIZA, sessao.refresh_token, { ...comum, maxAge: 60 * 60 * 24 * 30 });
}

export function apagaSessao(cookies: AstroCookies): void {
  cookies.delete(COOKIE_ACESSO, { path: '/' });
  cookies.delete(COOKIE_ATUALIZA, { path: '/' });
}

export interface Editor {
  id: string;
  email: string;
  nome: string;
  /** Token de acesso válido, já renovado se preciso. */
  token: string;
  /** Cliente que fala com o banco como este editor. */
  cliente: SupabaseClient;
}

/**
 * Confere o token de acesso; se ele venceu, renova com o de atualização.
 *
 * A renovação existe para o editor não perder o texto: o token dura uma
 * hora, e um artigo longo leva mais que isso. Sem ela, o "Publicar" no fim
 * da escrita mandaria para a tela de login.
 */
async function sessaoValida(cookies: AstroCookies): Promise<{ token: string; usuario: User } | null> {
  const anon = clienteAnonimo();
  if (!anon) return null;

  const acesso = cookies.get(COOKIE_ACESSO)?.value;
  const atualiza = cookies.get(COOKIE_ATUALIZA)?.value;

  if (acesso) {
    const { data, error } = await anon.auth.getUser(acesso);
    if (!error && data.user) return { token: acesso, usuario: data.user };
  }

  if (atualiza) {
    const { data, error } = await anon.auth.refreshSession({ refresh_token: atualiza });
    if (!error && data.session && data.user) {
      gravaSessao(cookies, data.session);
      return { token: data.session.access_token, usuario: data.user };
    }
  }

  if (acesso || atualiza) apagaSessao(cookies);
  return null;
}

/**
 * Quem está pedindo, se for editor; `null` em qualquer outro caso (sem
 * banco, sem sessão, sessão vencida, conta fora de `editores`).
 */
export async function editorAtual(cookies: AstroCookies): Promise<Editor | null> {
  const sessao = await sessaoValida(cookies);
  if (!sessao) return null;

  const cliente = clienteComSessao(sessao.token);
  if (!cliente) return null;

  /* Conveniência de interface, não a defesa: serve para dizer "esta conta
     não tem acesso ao painel" em vez de mostrar uma lista vazia. */
  const { data: linha } = await cliente
    .from('editores')
    .select('nome')
    .eq('id', sessao.usuario.id)
    .maybeSingle();
  if (!linha) return null;

  return {
    id: sessao.usuario.id,
    email: sessao.usuario.email ?? '',
    nome: linha.nome as string,
    token: sessao.token,
    cliente,
  };
}
