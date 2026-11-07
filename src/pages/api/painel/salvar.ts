/**
 * Salvar um texto: rascunho ou publicado.
 *
 * Recebe o formulário de /painel/artigo/ (multipart, por causa da capa).
 * Sem JavaScript, responde com 303; com ele, o script do editor pede JSON e
 * mostra o erro na própria tela, sem perder o que foi escrito.
 *
 * ── A fronteira de segurança fica aqui ──────────────────────────────────
 *
 * O corpo chega em HTML (Tiptap ligado) ou em markdown (sem JavaScript, ou
 * com o botão "Markdown" do editor), e é **aqui** que vira markdown para o
 * banco, por `htmlParaMarkdown`. A conversão derruba tag que o editor não
 * produz e transforma link `javascript:`/`data:` em texto puro. No caminho
 * de markdown, os destinos de link e imagem também são conferidos.
 *
 * Isso não pode acontecer no navegador: defesa que roda no cliente é defesa
 * que o cliente pode pular — basta um POST feito à mão. E o loader ainda
 * neutraliza HTML cru no build (`neutralizaHtmlCru`), que é a segunda camada.
 *
 * ── Quem pode salvar ────────────────────────────────────────────────────
 *
 * A RLS. Esta rota usa o token do editor, nunca a chave de serviço.
 */
import type { APIRoute } from 'astro';
import { configSupabase, editorAtual } from '~/lib/painel-auth';
import {
  ErroPainel,
  arquivoDoCampo,
  avisoDoGancho,
  categoriaCanonica,
  categoriasDoPainel,
  disparaRebuild,
  enviaImagem,
  responde,
} from '~/lib/painel-artigo';
import {
  destinoAceito,
  htmlParaMarkdown,
  imagemAceita,
  minutosDeLeitura,
  slugDoTitulo,
} from '~/lib/markdown-editor';
import { FORMATOS } from '~/lib/artigos';
import { site } from '~/lib/site';

export const prerender = false;

/**
 * Confere os destinos de link e imagem de markdown digitado à mão.
 *
 * Um nível de parêntese aninhado é aceito dentro do destino. Sem isso,
 * `[x](javascript:alert(1))` casava só até o primeiro `)` e sobrava um `)`
 * solto no texto publicado.
 */
function limpaDestinosDeMarkdown(markdown: string): string {
  return markdown.replace(/(!?)\[([^\]]*)\]\(((?:[^()]|\([^()]*\))*)\)/g, (inteiro, bang: string, rotulo: string, destino: string) => {
    if (bang) return imagemAceita(destino) ? inteiro : '';
    return destinoAceito(destino) ? inteiro : `[${rotulo}](#)`;
  });
}

/** "2026-11-07" → meio-dia UTC: o dia gravado é o digitado, em qualquer fuso. */
function dataDoCampo(valor: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const data = new Date(`${valor}T12:00:00Z`);
  return Number.isNaN(data.valueOf()) ? null : data.toISOString();
}

const inteiro = (valor: string) => {
  const n = Number.parseInt(valor, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

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

  const texto = (campo: string, limite: number) =>
    String(dados.get(campo) ?? '').trim().slice(0, limite);

  const slugOriginal = texto('slug_original', 80);
  const erro = (codigo: string) =>
    responde(
      request,
      slugOriginal
        ? `/painel/artigo/?slug=${encodeURIComponent(slugOriginal)}&erro=${codigo}`
        : `/painel/artigo/?erro=${codigo}`,
      codigo,
    );

  const titulo = texto('titulo', 120);
  const resumo = texto('resumo', 300);
  const publicar = texto('acao', 20) === 'publicar';

  if (!titulo) return erro('titulo');
  if (!resumo) return erro('resumo');

  /* HTML do editor vira markdown; markdown digitado só tem os destinos
     conferidos. Nos dois casos, o que chega ao banco é markdown. */
  const corpoBruto = String(dados.get('corpo') ?? '');
  const corpo =
    texto('corpo_tipo', 10) === 'html'
      ? htmlParaMarkdown(corpoBruto)
      : limpaDestinosDeMarkdown(corpoBruto.replace(/\r\n/g, '\n').trim());
  if (!corpo) return erro('corpo');

  /* O endereço de um texto já existente não muda: mudá-lo quebraria o link
     já compartilhado e deixaria um 404 para trás. */
  const slug = slugOriginal || slugDoTitulo(texto('slug', 80) || titulo);
  if (!slug) return erro('slug');

  const { cliente } = editor;

  let anterior: { estado: string } | null = null;
  if (slugOriginal) {
    const { data, error } = await cliente
      .from('artigos')
      .select('estado')
      .eq('slug', slugOriginal)
      .maybeSingle();
    if (error) {
      console.error('[painel] falha ao ler o texto', error.message);
      return erro('salvar');
    }
    if (!data) return erro('nao-achei');
    anterior = data;
  }

  // ── capa ─────────────────────────────────────────────────────────────
  let capa: string | null = texto('capa', 500) || null;
  let capaLargura = inteiro(texto('capa_largura', 6));
  let capaAltura = inteiro(texto('capa_altura', 6));
  const capaAlt = texto('capa_alt', 200) || null;
  const arquivoCapa = arquivoDoCampo(dados, 'capa_arquivo');

  if (dados.get('remover_capa') === '1') {
    capa = null;
  } else if (arquivoCapa) {
    try {
      const enviada = await enviaImagem(cliente, arquivoCapa, `capas/${slug}-${Date.now()}`, {
        largura: capaLargura ?? undefined,
        altura: capaAltura ?? undefined,
      });
      capa = enviada.url;
      capaLargura = enviada.largura;
      capaAltura = enviada.altura;
    } catch (e) {
      return erro(e instanceof ErroPainel ? e.codigo : 'imagem-envio');
    }
  }

  /* Mesmas regras das constraints do banco, conferidas antes para virar
     recado em português em vez de erro do Postgres. */
  /* HTTPS, caminho do site, ou o Storage do próprio Supabase configurado
     (que é `http://` quando o banco roda local, com `supabase start`). */
  const doStorage = `${configSupabase()!.url.replace(/\/+$/, '')}/storage/v1/object/public/`;
  const capaAceita = (url: string) =>
    /^https:\/\/[^/]/i.test(url) || /^\/[^/]/.test(url) || url.startsWith(doStorage);
  if (capa && !capaAceita(capa)) return erro('capa-url');
  if (capa && (!capaAlt || !capaLargura || !capaAltura)) return erro('capa');

  // ── demais campos ────────────────────────────────────────────────────
  const categorias = await categoriasDoPainel();
  const marcados = dados.getAll('autores').map(String);
  const formato = texto('formato', 10);
  const tempoDigitado = inteiro(texto('tempo_leitura', 3));
  const publicadoEm = dataDoCampo(texto('publicado_em', 10));

  const linha = {
    titulo,
    resumo,
    corpo,
    categoria: categoriaCanonica(texto('categoria', 80), categorias) ?? 'Informativo',
    /* Autores marcados, na ordem do site; só nomes de sócio. É o texto que
       `autoresDoArtigo` (lib/artigos) lê. */
    autor: site.socios.map((s) => s.nome).filter((nome) => marcados.includes(nome)).join(', '),
    formato: Object.hasOwn(FORMATOS, formato) ? formato : 'artigo',
    estado: publicar ? 'publicado' : 'rascunho',
    capa,
    capa_alt: capa ? capaAlt : null,
    capa_largura: capa ? capaLargura : null,
    capa_altura: capa ? capaAltura : null,
    capa_credito: capa ? texto('capa_credito', 200) || null : null,
    seo_titulo: texto('seo_titulo', 60) || null,
    seo_descricao: texto('seo_descricao', 160) || null,
    /* "Calcular sozinho" marcado (o padrão, também sem JavaScript) ou número
       fora da faixa: sai do corpo. Desmarcado: vale o que foi digitado. */
    tempo_leitura:
      dados.get('tempo_auto') || !tempoDigitado || tempoDigitado > 120
        ? minutosDeLeitura(corpo)
        : tempoDigitado,
    ...(publicadoEm ? { publicado_em: publicadoEm } : {}),
  };

  const { error } = anterior
    ? await cliente.from('artigos').update(linha).eq('slug', slugOriginal)
    : await cliente.from('artigos').insert({ ...linha, slug, criado_por: editor.id });

  if (error) {
    console.error('[painel] falha ao salvar', error.code, error.message);
    return erro(error.code === '23505' ? 'slug-existe' : 'salvar');
  }

  /* O site é estático: publicar, e também tirar do ar um texto publicado,
     só aparece depois do build. Rascunho de rascunho não precisa. */
  const eraPublicado = anterior?.estado === 'publicado';
  const gancho = publicar || eraPublicado ? await disparaRebuild() : 'ok';
  const feito = publicar ? 'publicado' : eraPublicado ? 'despublicado' : 'rascunho';

  return responde(request, `/painel/?feito=${feito}${avisoDoGancho(gancho)}`);
};
