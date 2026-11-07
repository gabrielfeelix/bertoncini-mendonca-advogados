/**
 * Carga inicial do CMS: leva os textos de `src/content/artigos/*.md` para a
 * tabela `artigos` do Supabase.
 *
 *   npm run cms:importa              # insere os que faltam no banco
 *   npm run cms:importa -- --seco    # só mostra o que faria (não precisa de banco)
 *   npm run cms:importa -- --sobrescreve   # regrava os que já existem
 *
 * Idempotente: rodar duas vezes dá o mesmo banco. Por padrão um texto que
 * já está no banco NÃO é tocado — depois da carga, quem manda é o painel, e
 * repetir a importação não pode desfazer o que os sócios editaram.
 * `--sobrescreve` existe para corrigir uma carga feita errada.
 *
 * Mapeamento do frontmatter (camelCase) para as colunas (snake_case), o
 * inverso do que o loader faz (src/lib/loader-supabase.ts):
 *
 *   titulo, resumo                → titulo, resumo
 *   capa, capaLargura, capaAltura → capa, capa_largura, capa_altura
 *   capaAlt, capaCredito          → capa_alt, capa_credito (migração 005)
 *   categoria                     → categoria, na grafia da área (ver abaixo)
 *   autor                         → autor ("Nome, Nome"; vazio = escritório)
 *   formato                       → formato (padrão "artigo")
 *   publicadoEm                   → publicado_em, ao meio-dia UTC
 *   tempoLeitura                  → tempo_leitura (calculado se faltar)
 *   estado                        → estado (padrão "publicado")
 *   seoTitulo, seoDescricao       → seo_titulo, seo_descricao
 *   o corpo (markdown)            → corpo, como está
 *
 * A capa continua apontando para o arquivo do site (`/media/capas/...`),
 * que o schema aceita: não há por que copiar para o Storage uma imagem que
 * já está no repositório.
 *
 * A categoria é gravada na grafia oficial da área quando bate sem caixa e
 * sem acento ("Direito digital" → "Direito Digital"): é a lista que o
 * painel oferece, e duas grafias da mesma área virariam duas opções no
 * filtro de /conteudos/.
 *
 * Usa a chave de serviço (ignora a RLS): é ferramenta de administração, roda
 * na máquina de quem administra e nunca vai para a Vercel.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { exige } from './cms-ambiente.mjs';

const seco = process.argv.includes('--seco');
const sobrescreve = process.argv.includes('--sobrescreve');

const DIR = 'src/content/artigos';
const FORMATOS = ['artigo', 'noticia', 'video'];
const ESTADOS = ['rascunho', 'publicado'];

const normaliza = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/* As áreas com página, lidas dos mesmos JSON da coleção `areas`. As áreas
   de "Também atuamos em" (site.ts) não aparecem nos textos de largada. */
const AREAS = readdirSync('src/content/areas')
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/content/areas', f), 'utf8')))
  .filter((a) => !a.aConfirmar)
  .map((a) => a.nome);
const categoriaCanonica = (texto) => AREAS.find((a) => normaliza(a) === normaliza(texto)) ?? texto;

/** Frontmatter de chave: valor numa linha, que é o que estes arquivos usam. */
function leFrontmatter(texto) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(texto);
  if (!m) throw new Error('sem frontmatter');
  const dados = {};
  for (const linha of m[1].split(/\r?\n/)) {
    const mm = /^([a-zA-Z_]+):\s*(.*)$/.exec(linha);
    if (!mm) continue;
    const [, chave, bruto] = mm;
    const valor = bruto.trim();
    if (valor.startsWith('"')) dados[chave] = JSON.parse(valor);
    else if (valor.startsWith("'")) dados[chave] = valor.slice(1, -1).replace(/''/g, "'");
    else dados[chave] = valor;
  }
  return { dados, corpo: texto.slice(m[0].length).trim() };
}

const inteiro = (v) => (v === undefined || v === '' ? null : Number.parseInt(String(v), 10));

/** Mesmo cálculo do painel (src/lib/markdown-editor.ts): 200 palavras/min. */
const minutos = (md) =>
  Math.max(1, Math.min(120, Math.round(md.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).length / 200) || 1));

function dataDe(valor) {
  const texto = String(valor ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return `${texto}T12:00:00.000Z`;
  const data = new Date(texto);
  if (Number.isNaN(data.valueOf())) throw new Error(`publicadoEm inválido: "${texto}"`);
  return data.toISOString();
}

/** As mesmas regras das constraints da tabela, conferidas antes de enviar. */
function confere(l) {
  const problemas = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.slug)) problemas.push('slug fora do padrão');
  if (!l.titulo || l.titulo.length > 120) problemas.push('título vazio ou com mais de 120 caracteres');
  if (!l.resumo || l.resumo.length > 300) problemas.push('resumo vazio ou com mais de 300 caracteres');
  if (l.capa && !(l.capa_largura && l.capa_altura && l.capa_alt)) problemas.push('capa sem largura, altura ou descrição');
  if (l.capa_credito && !l.capa) problemas.push('crédito sem capa');
  if (!FORMATOS.includes(l.formato)) problemas.push(`formato "${l.formato}" desconhecido`);
  if (!ESTADOS.includes(l.estado)) problemas.push(`estado "${l.estado}" desconhecido`);
  if (l.seo_titulo && l.seo_titulo.length > 60) problemas.push('seoTitulo com mais de 60 caracteres');
  if (l.seo_descricao && l.seo_descricao.length > 160) problemas.push('seoDescricao com mais de 160 caracteres');
  if (l.tempo_leitura < 1 || l.tempo_leitura > 120) problemas.push('tempoLeitura fora de 1–120');
  return problemas;
}

const linhas = [];
for (const arquivo of readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
  const slug = basename(arquivo, '.md');
  const { dados: d, corpo } = leFrontmatter(readFileSync(join(DIR, arquivo), 'utf8'));
  const capa = d.capa || null;
  const linha = {
    slug,
    titulo: d.titulo,
    resumo: d.resumo,
    corpo,
    capa,
    capa_largura: capa ? inteiro(d.capaLargura) : null,
    capa_altura: capa ? inteiro(d.capaAltura) : null,
    capa_alt: capa ? d.capaAlt || null : null,
    capa_credito: capa ? d.capaCredito || null : null,
    categoria: categoriaCanonica(d.categoria || 'Informativo'),
    autor: d.autor ?? '',
    formato: d.formato || 'artigo',
    publicado_em: dataDe(d.publicadoEm),
    tempo_leitura: inteiro(d.tempoLeitura) ?? minutos(corpo),
    estado: d.estado || 'publicado',
    seo_titulo: d.seoTitulo || null,
    seo_descricao: d.seoDescricao || null,
  };
  const problemas = confere(linha);
  if (problemas.length) {
    console.error(`✗ ${arquivo}: ${problemas.join('; ')}`);
    process.exitCode = 1;
    continue;
  }
  linhas.push(linha);
}

if (process.exitCode) {
  console.error('\nNada foi enviado: corrija os arquivos acima e rode de novo.');
  process.exit(1);
}

if (seco) {
  for (const l of linhas) {
    console.log(`·  ${l.slug}\n     ${l.categoria} · ${l.formato} · ${l.estado} · ${l.publicado_em.slice(0, 10)} · ${l.tempo_leitura} min` +
      `${l.autor ? ` · ${l.autor}` : ''}${l.capa ? ` · capa ${l.capa_largura}×${l.capa_altura}` : ''}${l.capa_credito ? ' · com crédito' : ''}`);
  }
  console.log(`\nsimulação: ${linhas.length} texto(s) prontos para o banco`);
  process.exit(0);
}

const [url, servico] = exige('PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(url, servico, { auth: { persistSession: false } });

/* `ignoreDuplicates` vira `on conflict do nothing`: o que já está no banco
   fica como está. Com --sobrescreve, `on conflict do update`. */
const { data, error } = await supabase
  .from('artigos')
  .upsert(linhas, { onConflict: 'slug', ignoreDuplicates: !sobrescreve })
  .select('slug');

if (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}

const gravados = new Set((data ?? []).map((l) => l.slug));
for (const l of linhas) console.log(`${gravados.has(l.slug) ? '✓' : '·'}  ${l.slug}${gravados.has(l.slug) ? '' : ' (já estava no banco)'}`);
console.log(`\n${gravados.size} gravado(s), ${linhas.length - gravados.size} já existia(m).`);
