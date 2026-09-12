/**
 * Consentimento de cookies de medição.
 *
 * Adaptado de `src/lib/consentimento.ts` da Isabella. A regra que este
 * arquivo existe para cumprir é a mesma: **nada de medição roda antes do
 * aceite**. Nenhum script de medição está no HTML; se um dia existir, ele é
 * criado aqui, em tempo de execução, e só depois da escolha.
 *
 * Três diferenças em relação à Isabella:
 *
 * 1. Lá havia duas escolhas ("aceito" / "recusado"). O protótipo aprovado
 *    daqui oferece três botões ("Aceitar todos", "Apenas necessários",
 *    "Rejeitar"), e o cliente viu esses três. Preservamos os três valores
 *    (`todos`, `necessarios`, `nenhum`), que são exatamente os que o
 *    protótipo grava (linhas 1171-1184).
 * 2. A chave do localStorage é `consentimento`, a mesma do protótipo, para
 *    quem já respondeu na prévia não ser perguntado de novo.
 * 3. O protótipo dispara um `CustomEvent('consentimento')` no `document`
 *    após a escolha, e diz em comentário que é esse o evento que um
 *    rastreador futuro deve escutar. Esse contrato fica de pé: `registrar()`
 *    dispara o mesmo evento com o mesmo nome e o mesmo `detail`.
 *
 * "Apenas necessários" e "Rejeitar" são escolhas distintas para quem
 * responde, mas hoje têm o mesmo efeito técnico, porque o site não tem
 * cookie opcional nenhum além da própria escolha. Guardar as duas separadas
 * é deliberado: no dia em que houver uma categoria intermediária, o registro
 * de quem escolheu o quê já existe, e ninguém precisa ser perguntado de novo
 * com uma pergunta diferente.
 */

const CHAVE = 'consentimento';

/** Os três valores do protótipo. `null` quando a pessoa ainda não respondeu. */
export type Escolha = 'todos' | 'necessarios' | 'nenhum';

const VALIDOS: readonly string[] = ['todos', 'necessarios', 'nenhum'];

/**
 * Lê a escolha guardada.
 *
 * Se o navegador bloquear o acesso ao localStorage (aba anônima com dados de
 * site desligados), tudo aqui degrada para "sem resposta": o aviso reaparece
 * e a medição não roda. Falhar para o lado de não rastrear é o certo.
 */
export function lerEscolha(): Escolha | null {
  try {
    const valor = localStorage.getItem(CHAVE);
    return valor && VALIDOS.includes(valor) ? (valor as Escolha) : null;
  } catch {
    return null;
  }
}

export function gravarEscolha(escolha: Escolha): void {
  try {
    localStorage.setItem(CHAVE, escolha);
  } catch {
    /* Sem localStorage a escolha vale só para esta página. É melhor do que
       quebrar o clique no botão. */
  }
}

/** true só para o aceite amplo. É a única escolha que libera medição. */
export function aceitouMedicao(escolha: Escolha | null): boolean {
  return escolha === 'todos';
}

/**
 * Grava a escolha e avisa o resto da página.
 *
 * O evento é o mesmo que o protótipo dispara, no mesmo alvo e com o mesmo
 * `detail`, para que qualquer código que já escute `consentimento` continue
 * funcionando sem alteração.
 */
export function registrar(escolha: Escolha): void {
  gravarEscolha(escolha);
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent('consentimento', { detail: escolha }));
  }
}

/**
 * Cria as tags de medição. Só deve ser chamada depois do aceite amplo.
 *
 * `ja` evita injetar duas vezes se a função for chamada de novo.
 *
 * ATENÇÃO: hoje nenhuma chamada a esta função existe no site, porque o
 * escritório ainda não decidiu se vai medir nem com que ferramenta. A
 * política de cookies marca essa indefinição como placeholder. No dia em que
 * a decisão vier, é aqui que a ferramenta entra, e a política muda junto.
 */
let ja = false;

export function ligarMedicao(ga4?: string): void {
  if (ja || typeof document === 'undefined' || !ga4) return;
  ja = true;

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
  document.head.appendChild(tag);

  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  const gtag = (...args: unknown[]) => { w.dataLayer!.push(args); };
  gtag('js', new Date());
  /* IP anonimizado mesmo com consentimento: não há razão para guardar o
     endereço inteiro de quem lê um texto sobre divórcio. */
  gtag('config', ga4, { anonymize_ip: true });
}
