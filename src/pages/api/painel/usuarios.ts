/**
 * Criar e remover acessos ao painel, a partir de /painel/usuarios/.
 *
 * É a única rota do site que usa a chave secreta do Supabase
 * (`SUPABASE_SERVICE_ROLE_KEY`): criar conta em `auth.users` e gerar o link
 * de definir senha são operações de administração, que a chave pública não
 * faz. Por isso:
 *
 * - a chave é lida aqui, com `env()`, só no servidor, e o cliente admin é
 *   criado aqui dentro e não sai deste arquivo. Nunca `PUBLIC_`, nunca no
 *   navegador;
 * - antes de qualquer coisa, a mesma checagem das outras rotas do painel:
 *   só POST, sessão de editor no cookie (`editorAtual`), origem conferida
 *   pelo Astro (`security.checkOrigin`). Quem não é editor não chega a
 *   tocar no cliente admin.
 *
 * A lógica de criar é a de `tools/cria-editor.mjs`: procura a conta pelo
 * e-mail; se não existe, cria já confirmada; se existe (alguém removido do
 * painel antes), redefine a senha; e grava em `editores`, que é o que dá
 * acesso (migração 002).
 *
 * Boas-vindas: e-mail pela Brevo com o login, o endereço do painel e um
 * link de definir senha (`generateLink` do tipo `recovery`, que leva a
 * /painel/nova-senha/). A senha provisória NUNCA vai por e-mail: aparece
 * uma vez na tela de quem criou, por um cookie de vida curta, e some.
 */
import { randomBytes } from 'node:crypto';
import type { APIRoute, AstroCookies } from 'astro';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '~/lib/ambiente';
import { emailPlausivel } from '~/lib/antispam';
import { enviaBoasVindasAoPainel, ErroBrevo } from '~/lib/brevo';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import { responde } from '~/lib/painel-artigo';
import { CAMINHO_USUARIOS, COOKIE_NOVO, type NovoUsuario } from '~/lib/painel-usuarios';

export const prerender = false;

const LISTA = CAMINHO_USUARIOS;

function clienteAdmin(url: string): SupabaseClient | null {
  const chave = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!chave) return null;
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Procura a conta pelo e-mail, página a página (como em cria-editor.mjs). */
async function procura(admin: SupabaseClient, alvo: string) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const achado = data.users.find((u) => u.email?.toLowerCase() === alvo);
    if (achado || data.users.length < 200) return achado;
  }
}

function guardaNovo(cookies: AstroCookies, novo: NovoUsuario) {
  cookies.set(COOKIE_NOVO, novo, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: LISTA,
    // Só o tempo de o 303 voltar para a lista; a página apaga ao ler.
    maxAge: 300,
  });
}

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const cfg = configSupabase();
  if (!cfg) return responde(request, '/painel/entrar/?erro=sem-banco', 'sem-banco');

  const editor = await editorAtual(cookies);
  if (!editor) return responde(request, '/painel/entrar/?erro=sessao', 'sessao');

  const admin = clienteAdmin(cfg.url);
  if (!admin) {
    console.error('[painel] SUPABASE_SERVICE_ROLE_KEY ausente: criar/remover usuário indisponível');
    return responde(request, `${LISTA}?erro=sem-chave`, 'sem-chave');
  }

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return responde(request, `${LISTA}?erro=salvar`, 'salvar');
  }

  const acao = String(dados.get('acao') ?? '');

  /* ── remover ───────────────────────────────────────────────────────── */
  if (acao === 'remover') {
    const id = String(dados.get('id') ?? '').trim();
    if (!/^[0-9a-f-]{36}$/i.test(id)) return responde(request, `${LISTA}?erro=salvar`, 'salvar');
    if (id === editor.id) return responde(request, `${LISTA}?erro=usuario-si`, 'usuario-si');

    /* Só remove quem é editor: a rota não serve para apagar qualquer conta
       do projeto por id. */
    const { data: linha } = await admin.from('editores').select('id').eq('id', id).maybeSingle();
    if (!linha) return responde(request, `${LISTA}?erro=usuario-nao-achei`, 'usuario-nao-achei');

    /* Apaga a conta inteira; `editores` cai junto (on delete cascade). Se a
       conta não puder ser apagada, ao menos tira o acesso. */
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) {
      console.error('[painel] falha ao apagar conta', error.message);
      const { error: erroEditor } = await admin.from('editores').delete().eq('id', id);
      if (erroEditor) {
        console.error('[painel] falha ao remover de editores', erroEditor.message);
        return responde(request, `${LISTA}?erro=usuario-remover`, 'usuario-remover');
      }
    }
    return responde(request, `${LISTA}?feito=usuario-removido`);
  }

  if (acao !== 'criar') return responde(request, `${LISTA}?erro=salvar`, 'salvar');

  /* ── criar ─────────────────────────────────────────────────────────── */
  const nome = String(dados.get('nome') ?? '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const email = String(dados.get('email') ?? '').trim().toLowerCase().slice(0, 254);
  let senha = String(dados.get('senha') ?? '');
  if (!nome) return responde(request, `${LISTA}?erro=usuario-nome`, 'usuario-nome');
  if (!emailPlausivel(email)) return responde(request, `${LISTA}?erro=usuario-email`, 'usuario-email');
  /* Sem JavaScript não há botão "gerar senha": campo vazio, o servidor gera. */
  if (!senha) senha = randomBytes(12).toString('base64url');
  if (senha.length < 8) return responde(request, `${LISTA}?erro=senha-curta`, 'senha-curta');

  let id: string;
  try {
    const existente = await procura(admin, email);
    if (existente) {
      const { data: jaEditor } = await admin.from('editores').select('id').eq('id', existente.id).maybeSingle();
      if (jaEditor) return responde(request, `${LISTA}?erro=usuario-existe`, 'usuario-existe');
      const { error } = await admin.auth.admin.updateUserById(existente.id, {
        password: senha,
        email_confirm: true,
        user_metadata: { nome },
      });
      if (error) throw error;
      id = existente.id;
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: { nome },
      });
      if (error) throw error;
      id = data.user.id;
    }
  } catch (erro) {
    console.error('[painel] falha ao criar conta', erro instanceof Error ? erro.message : erro);
    return responde(request, `${LISTA}?erro=usuario-criar`, 'usuario-criar');
  }

  const { error: erroEditor } = await admin.from('editores').upsert({ id, nome }, { onConflict: 'id' });
  if (erroEditor) {
    console.error('[painel] falha ao gravar em editores', erroEditor.message);
    return responde(request, `${LISTA}?erro=usuario-criar`, 'usuario-criar');
  }

  /* Link de definir senha. O destino precisa estar nas Redirect URLs do
     Supabase (o mesmo que "Esqueci minha senha" já exige). */
  let link: string | null = null;
  const { data: gerado, error: erroLink } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: new URL('/painel/nova-senha/', url.origin).toString() },
  });
  if (erroLink) console.error('[painel] falha ao gerar link de senha', erroLink.message);
  else link = gerado.properties.action_link;

  let boasVindas: NovoUsuario['boasVindas'] = 'sem-brevo';
  const chave = env('BREVO_API_KEY');
  const remetenteEmail = env('BREVO_REMETENTE_EMAIL');
  if (chave && remetenteEmail && link) {
    try {
      await enviaBoasVindasAoPainel(
        chave,
        { nome: env('BREVO_REMETENTE_NOME') ?? 'Site Bertoncini & Mendonça', email: remetenteEmail },
        { nome, email, painel: new URL('/painel/', url.origin).toString(), linkSenha: link, quemCriou: editor.nome },
      );
      boasVindas = 'enviado';
    } catch (erro) {
      console.error('[painel] boas-vindas não enviadas', erro instanceof ErroBrevo ? erro.corpo : erro);
      boasVindas = 'falhou';
    }
  } else if (!chave || !remetenteEmail) {
    console.error('[painel] Brevo não configurada: boas-vindas do novo usuário não enviadas');
  } else {
    boasVindas = 'falhou';
  }

  guardaNovo(cookies, { nome, email, senha, link, boasVindas });
  return responde(request, `${LISTA}?feito=usuario-criado`);
};
