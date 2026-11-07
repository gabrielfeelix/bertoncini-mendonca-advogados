/**
 * Cria (ou redefine) um acesso ao painel.
 *
 *   npm run cms:editor -- <email> "<Nome>"
 *
 * Gera uma senha aleatória e a imprime UMA vez: entregue à pessoa por canal
 * seguro; ela troca em "Esqueci minha senha" quando quiser. Entrar na tabela
 * `editores` é o que dá permissão de escrever (migração 002).
 *
 * Usa a chave de serviço (SUPABASE_SERVICE_ROLE_KEY), que ignora a RLS:
 * roda só na máquina de quem administra, nunca vai para a Vercel.
 */
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { exige } from './cms-ambiente.mjs';

const [email, nome] = process.argv.slice(2);
if (!email || !nome) {
  console.error('uso: npm run cms:editor -- <email> "<Nome>"');
  process.exit(1);
}

const [url, servico] = exige('PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
const admin = createClient(url, servico, { auth: { persistSession: false } });

// Forte o bastante para uso único, sem caracteres ambíguos de copiar.
const senha = randomBytes(12).toString('base64url');

/** Procura a conta pelo e-mail, página a página. */
async function procura(alvo) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const achado = data.users.find((u) => u.email?.toLowerCase() === alvo.toLowerCase());
    if (achado || data.users.length < 200) return achado;
  }
}

let id;
const existente = await procura(email);
if (existente) {
  id = existente.id;
  const { error } = await admin.auth.admin.updateUserById(id, { password: senha });
  if (error) { console.error('✗', error.message); process.exit(1); }
  console.log('· a conta já existia: senha redefinida');
} else {
  const { data, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
  if (error) { console.error('✗', error.message); process.exit(1); }
  id = data.user.id;
  console.log('✓ conta criada');
}

const { error } = await admin.from('editores').upsert({ id, nome }, { onConflict: 'id' });
if (error) { console.error('✗ editores:', error.message); process.exit(1); }

console.log(`✓ ${nome} <${email}> pode publicar`);
console.log(`\n  senha desta vez:  ${senha}\n`);
console.log('  Entregue por canal seguro. Ela não aparece de novo.');
