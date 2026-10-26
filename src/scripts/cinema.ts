/**
 * Camada "cinema" (26/10/2026): os efeitos de rolagem que as páginas do
 * redesenho dividem, tirados de quadro-template.framer.website (mecânica em
 * docs/refs/REFERENCIAS-ESCRITORIO.md). Cada efeito é ligado por atributo,
 * então a página só marca o elemento:
 *
 * - `data-sobe`     sobe 44px e aparece, uma vez, ao entrar;
 * - `data-desliza`  anda para o lado com a rolagem da seção (marca-d'água);
 * - `data-acende`   as palavras vão de 30% a 100% presas à rolagem;
 * - `data-conta`    o número conta de 0 até o valor ao entrar;
 * - `data-cresce`   o título encolhe de 1,6 para 1 com as letras subindo
 *                   por uma máscara (CSS da máscara fica na página);
 * - `data-trilho`   seção alta com um palco sticky: a faixa `[data-faixa]`
 *                   dentro dela anda para a esquerda até o fim, e a barra
 *                   `[data-progresso]` acompanha.
 *
 * Quem chama checa `prefers-reduced-motion` antes; aqui só se liga.
 * Gatilhos nunca em elemento sticky: o ScrollTrigger mede a posição já
 * grudada (ver SociosPilha.astro).
 */

type Gsap = typeof import('gsap').gsap;

/**
 * Embrulha cada palavra (ou letra) do texto em <span>, preservando os
 * elementos internos (<em>, <mark>). Devolve os spans criados.
 */
export function divide(raiz: HTMLElement, modo: 'palavra' | 'letra'): HTMLElement[] {
  const criados: HTMLElement[] = [];
  const percorre = (no: Node) => {
    if (no.nodeType === Node.TEXT_NODE) {
      const partes = (no.textContent ?? '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      partes.forEach((parte) => {
        if (!parte) return;
        if (/^\s+$/.test(parte)) {
          frag.append(document.createTextNode(parte));
          return;
        }
        const palavra = document.createElement('span');
        palavra.className = 'palavra';
        if (modo === 'palavra') {
          palavra.textContent = parte;
          criados.push(palavra);
        } else {
          [...parte].forEach((c) => {
            const letra = document.createElement('span');
            letra.className = 'letra';
            letra.textContent = c;
            palavra.append(letra);
            criados.push(letra);
          });
        }
        frag.append(palavra);
      });
      (no as Text).replaceWith(frag);
    } else if (no.nodeType === Node.ELEMENT_NODE && (no as Element).tagName !== 'BR') {
      [...no.childNodes].forEach(percorre);
    }
  };
  [...raiz.childNodes].forEach(percorre);
  return criados;
}

export async function ligaCinema(): Promise<Gsap> {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray<HTMLElement>('[data-sobe]').forEach((el) => {
    gsap.from(el, {
      y: 44,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-desliza]').forEach((el) => {
    gsap.to(el, {
      x: () => -window.innerWidth * 0.9,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });

  /* O piso é .3 (a Quadro usa quase transparente); a janela termina com o
     bloco no meio da tela, então ninguém lê o texto apagado parado ali. */
  document.querySelectorAll<HTMLElement>('[data-acende]').forEach((el) => {
    gsap.fromTo(
      divide(el, 'palavra'),
      { opacity: 0.3 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.5 },
      },
    );
  });

  document.querySelectorAll<HTMLElement>('[data-conta]').forEach((el) => {
    const alvo = Number(el.dataset.conta) || 0;
    const estado = { n: 0 };
    el.textContent = '0';
    gsap.to(estado, {
      n: alvo,
      duration: 1.4,
      ease: 'power2.out',
      snap: { n: 1 },
      onUpdate: () => {
        el.textContent = String(estado.n);
      },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-cresce]').forEach((el) => {
    const letras = divide(el, 'letra');
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 50%', scrub: 0.6 } })
      .fromTo(el, { scale: 1.6 }, { scale: 1, ease: 'none' }, 0)
      .fromTo(letras, { yPercent: 105 }, { yPercent: 0, stagger: 0.012, ease: 'power2.out' }, 0);
  });

  document.querySelectorAll<HTMLElement>('[data-trilho]').forEach((secao) => {
    const faixa = secao.querySelector<HTMLElement>('[data-faixa]');
    const barra = secao.querySelector<HTMLElement>('[data-progresso]');
    if (!faixa) return;
    const distancia = () => Math.max(0, faixa.scrollWidth - faixa.parentElement!.clientWidth);
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
      })
      .to(faixa, { x: () => -distancia() }, 0)
      .fromTo(barra, { scaleX: 0 }, { scaleX: 1 }, 0);
  });

  return gsap;
}
