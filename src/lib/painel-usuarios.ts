/**
 * O que /api/painel/usuarios passa para /painel/usuarios/ depois de criar
 * um acesso: a senha provisória e o link de definir senha, mostrados UMA vez.
 *
 * Vai num cookie HttpOnly de vida curta, preso ao caminho da lista, e não
 * na URL: senha em query string fica no histórico do navegador e nos logs.
 */
export const COOKIE_NOVO = 'pnl-novo-usuario';
export const CAMINHO_USUARIOS = '/painel/usuarios/';

export interface NovoUsuario {
  nome: string;
  email: string;
  senha: string;
  link: string | null;
  /** 'enviado', 'sem-brevo' (variáveis ausentes) ou 'falhou'. */
  boasVindas: 'enviado' | 'sem-brevo' | 'falhou';
}
