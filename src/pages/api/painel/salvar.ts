/**
 * Salvar um artigo — rascunho ou publicado.
 *
 * ── A fronteira de segurança fica aqui ──────────────────────────────────
 *
 * O corpo chega em HTML (quando o Tiptap está ligado) ou em markdown
 * (quando não está), e é **aqui** que vira markdown para o banco, por
 * `htmlParaMarkdown`. A conversão derruba tag que o editor não produz e
 * transforma link `javascript:`/`data:` em texto puro.
 *
 * Isso não pode acontecer no navegador: defesa que roda no cliente é defesa
 * que o cliente pode pular — basta um POST feito à mão. O campo `formato`
 * diz o que esperar, mas o conversor é rodado de qualquer jeito no caminho
 * de HTML, e o de markdown ainda passa pela verificação de link.
 *
 * ── Quem pode salvar ────────────────────────────────────────────────────
 *
 * A RLS. Esta rota usa o token do editor, nunca a chave de serviço, então
 * uma requisição sem sessão válida é recusada pelo banco mesmo que chegue
 * até aqui.
 */
import type { APIRoute } from 'astro';
import { clienteComSessao, tokenDaSessao, configSupabase } from '~/lib/painel-auth';
import {
  htmlParaMarkdown,
  minutosDeLeitura,
  slugDoTitulo,
  destinoAceito,
} from '~/lib/markdown-editor';

export const prerender = false;

function voltaPara(caminho: string): Response {
  return new Response(null, { status: 303, headers: { location: caminho } });
}

/** Erro volta para a própria edição, preservando qual artigo era. */
function erro(slugOriginal: string, codigo: string): Response {
  const base = slugOriginal
    ? `/painel/artigo/?slug=${encodeURIComponent(slugOriginal)}&erro=${codigo}`
    : `/painel/artigo/?erro=${codigo}`;
  return voltaPara(base);
}

/**
 * Remove destino perigoso de link markdown digitado à mão.
 *
 * O caminho de HTML já resolve isso na conversão; este é o caminho de quem
 * está sem JavaScript e escreveu markdown direto.
 */
function limpaLinksDeMarkdown(markdown: string): string {
  /* Um nível de parêntese aninhado é aceito dentro do destino. Sem isso,
     `[x](javascript:alert(1))` casava só até o primeiro `)` e sobrava um
     `)` solto no texto publicado: `[x](#))`. O link já ficava inofensivo,
     mas com lixo visível no meio da frase. */
  return markdown.replace(/\]\(((?:[^()]|\([^()]*\))*)\)/g, (inteiro, destino: string) =>
    destinoAceito(destino) ? inteiro : '](#)',
  );
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!configSupabase()) return voltaPara('/painel/?erro=sem-banco');

  const token = tokenDaSessao(cookies);
  const cliente = token ? clienteComSessao(token) : null;
  if (!cliente) return voltaPara('/painel/?erro=sessao');

  let dados: FormData;
  try {
    dados = await request.formData();
  } catch {
    return voltaPara('/painel/?erro=salvar');
  }

  const texto = (campo: string, limite: number) =>
    String(dados.get(campo) ?? '').trim().slice(0, limite);

  const slugOriginal = texto('slug_original', 80);
  const titulo = texto('titulo', 120);
  const resumo = texto('resumo', 300);
  const corpoBruto = String(dados.get('corpo') ?? '');
  const formato = texto('formato', 10);
  const publicar = texto('acao', 20) === 'publicar';

  if (!titulo) return erro(slugOriginal, 'titulo');
  if (!resumo) return erro(slugOriginal, 'resumo');

  /* HTML do editor vira markdown; markdown digitado à mão só tem os links
     conferidos. Nos dois casos, o que chega ao banco é markdown. */
  const corpo =
    formato === 'html'
      ? htmlParaMarkdown(corpoBruto)
      : limpaLinksDeMarkdown(corpoBruto.trim());

  if (!corpo) return erro(slugOriginal, 'corpo');

  /* O slug de um artigo já existente não muda: mudá-lo quebraria o link que
     já foi compartilhado, e deixaria um 404 para trás. */
  const slug = slugOriginal || slugDoTitulo(titulo);
  if (!slug) return erro(slugOriginal, 'slug');

  const capa = texto('capa', 500) || null;
  const capaAlt = texto('capa_alt', 200) || null;
  const capaLargura = Number(texto('capa_largura', 6)) || null;
  const capaAltura = Number(texto('capa_altura', 6)) || null;

  /* Mesma regra da constraint do banco, verificada antes para virar recado
     em português em vez de erro do Postgres. */
  if (capa && (!capaAlt || !capaLargura || !capaAltura)) {
    return erro(slugOriginal, 'capa');
  }

  const linha = {
    slug,
    titulo,
    resumo,
    corpo,
    categoria: texto('categoria', 60) || 'Informativo',
    autor: texto('autor', 80),
    estado: publicar ? 'publicado' : 'rascunho',
    capa,
    capa_alt: capa ? capaAlt : null,
    capa_largura: capa ? capaLargura : null,
    capa_altura: capa ? capaAltura : null,
    seo_titulo: texto('seo_titulo', 60) || null,
    seo_descricao: texto('seo_descricao', 160) || null,
    tempo_leitura: minutosDeLeitura(corpo),
  };

  const { error } = await cliente.from('artigos').upsert(linha, { onConflict: 'slug' });

  if (error) {
    console.error('[painel] falha ao salvar', error.message);
    return erro(slugOriginal, 'salvar');
  }

  /* Publicar dispara o rebuild, se o gancho existir. O site é estático: sem
     rebuild, o texto fica no banco e não aparece para ninguém. A falha do
     gancho não desfaz o que foi salvo — vira log, e o texto continua lá. */
  if (publicar) await disparaRebuild();

  return voltaPara(`/painel/?feito=${publicar ? 'publicado' : 'rascunho'}`);
};

/**
 * Deploy Hook da Vercel.
 *
 * Opcional de propósito: enquanto o site não está publicado, não existe
 * gancho nenhum, e o painel precisa funcionar assim mesmo. Quando existir,
 * basta a variável no ambiente.
 */
async function disparaRebuild(): Promise<void> {
  const gancho = (typeof process !== 'undefined' ? process.env?.VERCEL_DEPLOY_HOOK : undefined) ||
    (import.meta.env as Record<string, string | undefined>).VERCEL_DEPLOY_HOOK;
  if (!gancho) {
    console.warn('[painel] VERCEL_DEPLOY_HOOK ausente: o texto foi salvo, mas o site não será reconstruído sozinho.');
    return;
  }
  try {
    await fetch(gancho, { method: 'POST' });
  } catch (e) {
    console.error('[painel] falha ao disparar o rebuild', e);
  }
}
