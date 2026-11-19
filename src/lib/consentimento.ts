/**
 * Consentimento de cookies, por categoria.
 *
 * A regra que este arquivo existe para cumprir: **nada que não seja
 * necessário roda antes da autorização**. Nenhum script de medição, de
 * anúncio ou de conteúdo de terceiros está no HTML; se um dia existir, ele é
 * criado em tempo de execução, e só depois de `permitido(categoria)`.
 *
 * As quatro categorias vêm da Política de Cookies do escritório (versão 1.0,
 * vigente a partir de 11/09/2026, recebida em 18/11/2026), com o banner e a
 * central de preferências que ela descreve (ver AvisoCookies.astro):
 *
 * - `necessarios`  Necessários (sempre ativos; não há como desligar)
 * - `analiticos`   Analíticos (Google Analytics via Google Tag Manager;
 *                  é também onde entra o Microsoft Clarity, se for adotado,
 *                  depois de a política passar a citá-lo)
 * - `publicidade`  Publicidade e mensuração (Pixel da Meta, Google Ads, LinkedIn Insight Tag)
 * - `terceiros`    Conteúdo de terceiros (YouTube, Instagram, LinkedIn incorporados)
 *
 * Nenhuma não essencial nasce marcada (Guia Orientativo de Cookies da ANPD).
 *
 * Onde fica guardado: localStorage, chave `consentimento` (a mesma desde o
 * protótipo). O valor agora é um JSON com as três categorias opcionais e a
 * data da escolha. A política de privacidade diz que o registro vale 12
 * meses; depois disso `lerPreferencias()` devolve `null` e o banner volta.
 *
 * Compatibilidade com o formato antigo (três escolhas em texto puro:
 * `todos`, `necessarios`, `nenhum`):
 * - `necessarios` e `nenhum` viram "tudo desligado" e continuam valendo:
 *   uma recusa antiga continua sendo recusa.
 * - `todos` NÃO é aproveitado: aquele aceite foi dado com outro texto, que
 *   não falava de publicidade, de conteúdo de terceiros nem de envio de
 *   dados para fora do Brasil. A pessoa é perguntada de novo.
 *
 * A API antiga (`Escolha`, `lerEscolha`, `gravarEscolha`, `aceitouMedicao`,
 * `registrar`) continua exportada e funcionando, traduzida para as novas
 * categorias, para nada que a use quebrar. Código novo deve usar
 * `lerPreferencias`, `salvarPreferencias` e `permitido`.
 *
 * Eventos no `document` depois de cada escolha:
 * - `consentimento` com `detail` = `Escolha` (texto antigo), o contrato do
 *   protótipo;
 * - `consentimento:preferencias` com `detail` = `Preferencias`, o novo.
 */

const CHAVE = 'consentimento';

/** Prazo do registro da escolha: 12 meses (Política de Privacidade). */
const VALIDADE_MS = 365 * 24 * 60 * 60 * 1000;

/** As quatro categorias da Política de Cookies. */
export type Categoria = 'necessarios' | 'analiticos' | 'publicidade' | 'terceiros';

/** As categorias que dependem de autorização, na ordem da central. */
export const CATEGORIAS_OPCIONAIS = ['analiticos', 'publicidade', 'terceiros'] as const;
export type CategoriaOpcional = (typeof CATEGORIAS_OPCIONAIS)[number];

/** O que a pessoa autorizou. `necessarios` não entra: é sempre verdadeiro. */
export type Preferencias = Record<CategoriaOpcional, boolean>;

interface Registro extends Preferencias {
  /** Versão do formato gravado. */
  v: 1;
  /** Quando a escolha foi feita (ISO 8601). */
  data: string;
}

/**
 * Aliases de nomes antigos para as categorias novas. `medicao` era como o
 * código chamava a única categoria opcional que existia ("cookies de
 * medição"); hoje ela é `analiticos`.
 */
const ALIASES: Record<string, Categoria> = {
  medicao: 'analiticos',
};

export const NADA_AUTORIZADO: Readonly<Preferencias> = Object.freeze({
  analiticos: false,
  publicidade: false,
  terceiros: false,
});

export const TUDO_AUTORIZADO: Readonly<Preferencias> = Object.freeze({
  analiticos: true,
  publicidade: true,
  terceiros: true,
});

function normalizar(valor: unknown): Preferencias | null {
  if (!valor || typeof valor !== 'object') return null;
  const r = valor as Partial<Registro>;
  if (r.v !== 1 || typeof r.data !== 'string') return null;
  const quando = Date.parse(r.data);
  if (Number.isNaN(quando) || Date.now() - quando > VALIDADE_MS) return null;
  return {
    analiticos: r.analiticos === true,
    publicidade: r.publicidade === true,
    terceiros: r.terceiros === true,
  };
}

/**
 * Lê as preferências guardadas. `null` quando a pessoa ainda não respondeu,
 * quando o registro passou de 12 meses ou quando o navegador bloqueia o
 * localStorage. Falhar para o lado de não carregar nada é o certo.
 */
export function lerPreferencias(): Preferencias | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    /* Formato antigo: recusa continua recusa; aceite antigo é perguntado de novo. */
    if (bruto === 'necessarios' || bruto === 'nenhum') return { ...NADA_AUTORIZADO };
    if (bruto === 'todos') return null;
    return normalizar(JSON.parse(bruto));
  } catch {
    return null;
  }
}

/** Grava as preferências e avisa o resto da página. */
export function salvarPreferencias(preferencias: Preferencias): void {
  const p: Preferencias = {
    analiticos: preferencias.analiticos === true,
    publicidade: preferencias.publicidade === true,
    terceiros: preferencias.terceiros === true,
  };
  const registro: Registro = { v: 1, data: new Date().toISOString(), ...p };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(registro));
  } catch {
    /* Sem localStorage a escolha vale só para esta página. É melhor do que
       quebrar o clique no botão. */
  }
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('consentimento', { detail: resumir(p) }));
    document.dispatchEvent(new CustomEvent('consentimento:preferencias', { detail: p }));
  }
}

export function aceitarTodos(): void {
  salvarPreferencias(TUDO_AUTORIZADO);
}

export function rejeitarNaoEssenciais(): void {
  salvarPreferencias(NADA_AUTORIZADO);
}

/**
 * true quando a categoria pode rodar agora. `necessarios` é sempre true;
 * as demais só com autorização registrada. Aceita os aliases antigos.
 */
export function permitido(categoria: Categoria | 'medicao'): boolean {
  const c = (ALIASES[categoria] ?? categoria) as Categoria;
  if (c === 'necessarios') return true;
  const p = lerPreferencias();
  return p ? p[c as CategoriaOpcional] === true : false;
}

/* ---------- API antiga, mantida por compatibilidade ---------- */

/** As três escolhas do aviso antigo. */
export type Escolha = 'todos' | 'necessarios' | 'nenhum';

/** Traduz as preferências para a escolha antiga mais próxima. */
function resumir(p: Preferencias): Escolha {
  if (p.analiticos && p.publicidade && p.terceiros) return 'todos';
  if (!p.analiticos && !p.publicidade && !p.terceiros) return 'nenhum';
  return 'necessarios';
}

/** @deprecated use `lerPreferencias`. */
export function lerEscolha(): Escolha | null {
  const p = lerPreferencias();
  return p ? resumir(p) : null;
}

/** @deprecated use `salvarPreferencias`. Não dispara evento, como antes. */
export function gravarEscolha(escolha: Escolha): void {
  const p = escolha === 'todos' ? TUDO_AUTORIZADO : NADA_AUTORIZADO;
  const registro: Registro = { v: 1, data: new Date().toISOString(), ...p };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(registro));
  } catch {
    /* sem localStorage: vale só para esta página */
  }
}

/**
 * @deprecated use `permitido('analiticos')`. Antes era "true só para o
 * aceite amplo"; agora é true quando a categoria Analíticos foi autorizada.
 */
export function aceitouMedicao(escolha: Escolha | null): boolean {
  if (escolha === null) return false;
  return escolha === 'todos' || permitido('analiticos');
}

/** @deprecated use `salvarPreferencias`, `aceitarTodos` ou `rejeitarNaoEssenciais`. */
export function registrar(escolha: Escolha): void {
  salvarPreferencias(escolha === 'todos' ? TUDO_AUTORIZADO : NADA_AUTORIZADO);
}

/**
 * Cria as tags do Google Analytics. Só pode ser chamada com
 * `permitido('analiticos')`.
 *
 * `ja` evita injetar duas vezes se a função for chamada de novo.
 *
 * ATENÇÃO: hoje nenhuma chamada a esta função existe no site. O escritório
 * vai anunciar (decisão de 18/11/2026) e a Política de Cookies já cita Google
 * Analytics/Tag Manager, Google Ads, Pixel da Meta e LinkedIn Insight Tag,
 * mas nenhum deles está instalado. Quando entrarem, é aqui (Analytics e,
 * no futuro, Microsoft Clarity, com `permitido('analiticos')`) ou ao lado
 * (Ads, Meta, LinkedIn, com `permitido('publicidade')`) que entram, ouvindo
 * o evento `consentimento:preferencias` para ligar sem recarregar a página.
 * A tabela "Cookies utilizados" já tem as linhas padrão: conferir nomes e
 * durações reais quando as tags forem instaladas.
 */
let ja = false;

export function ligarMedicao(ga4?: string): void {
  if (ja || typeof document === 'undefined' || !ga4) return;
  if (!permitido('analiticos')) return;
  ja = true;

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
  document.head.appendChild(tag);

  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  const gtag = (...args: unknown[]) => { w.dataLayer!.push(args); };
  gtag('js', new Date());
  /* IP anonimizado mesmo com consentimento. */
  gtag('config', ga4, { anonymize_ip: true });
}
