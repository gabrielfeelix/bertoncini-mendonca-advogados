/**
 * Movimento da página O escritório (26/10/2026). Plano em
 * docs/PLANO-ESCRITORIO.md; números de referência em
 * docs/refs/REFERENCIAS-ESCRITORIO.md (quadro-template.framer.website/about).
 *
 * A página funciona inteira sem este arquivo: o CSS só monta a cena
 * cinematográfica (palco sticky, camadas sobrepostas) quando a classe
 * `.movimento-escritorio` existe no <html>, e ela só é posta aqui, depois de
 * checar `prefers-reduced-motion`. Sem ela, valores e princípios aparecem
 * um abaixo do outro, como documento.
 *
 * Gatilhos sempre em elementos que NÃO são sticky: com gatilho sticky o
 * ScrollTrigger mede a posição já grudada (ver SociosPilha.astro).
 */

const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Embrulha cada palavra (ou letra) do texto em <span>, preservando os
 * elementos internos (<em>, <mark>). Devolve os spans criados.
 */
function divide(raiz: HTMLElement, modo: 'palavra' | 'letra'): HTMLElement[] {
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

async function liga(): Promise<void> {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('movimento-escritorio');

  /* Subida simples de bloco, uma vez, ao entrar. */
  gsap.utils.toArray<HTMLElement>('.escritorio [data-sobe]').forEach((el) => {
    gsap.from(el, {
      y: 44,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  /* Marca-d'água andando para o lado com a rolagem. */
  const desliza = document.querySelector<HTMLElement>('[data-desliza]');
  if (desliza) {
    gsap.to(desliza, {
      x: () => -window.innerWidth * 0.9,
      ease: 'none',
      scrollTrigger: { trigger: '.escritorio .topo', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  }

  /* Manifesto: as palavras se acendem presas à rolagem. O piso é .3 (a
     Quadro usa quase transparente); a janela termina com o bloco no meio da
     tela, então ninguém lê o texto apagado parado no centro. */
  document.querySelectorAll<HTMLElement>('[data-acende]').forEach((el) => {
    const palavras = divide(el, 'palavra');
    gsap.fromTo(
      palavras,
      { opacity: 0.3 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.5 },
      },
    );
  });

  /* Números que rolam até o valor ao entrar. */
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

  /* Título que encolhe de 1,6 para 1 enquanto as letras sobem pela máscara. */
  document.querySelectorAll<HTMLElement>('[data-cresce]').forEach((el) => {
    const letras = divide(el, 'letra');
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 50%', scrub: 0.6 } })
      .fromTo(el, { scale: 1.6 }, { scale: 1, ease: 'none' }, 0)
      .fromTo(letras, { yPercent: 105 }, { yPercent: 0, stagger: 0.012, ease: 'power2.out' }, 0);
  });

  ligaCena(gsap, ScrollTrigger);
}

/**
 * A cena: cortina que sobe sobre a foto, os três valores um de cada vez com
 * as palavras se acendendo, os princípios em escada e a saída em faixas.
 */
function ligaCena(gsap: typeof import('gsap').gsap, ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger): void {
  const cena = document.querySelector<HTMLElement>('.escritorio .cena');
  if (!cena) return;
  const palco = cena.querySelector<HTMLElement>('.palco-cena')!;
  const fundo = cena.querySelector<HTMLElement>('.cena-fundo img');
  const valores = gsap.utils.toArray<HTMLElement>('.valor-cena', cena);
  const escada = cena.querySelector<HTMLElement>('.escada-cena')!;
  const degraus = gsap.utils.toArray<HTMLElement>('.degrau', cena);
  const faixas = gsap.utils.toArray<HTMLElement>('.faixas-saida span', cena);

  /* Cortina: a cena aparece de baixo para cima enquanto entra na tela. */
  gsap.fromTo(
    palco,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: cena, start: 'top bottom', end: 'top top', scrub: true },
    },
  );

  gsap.set([...valores, escada], { autoAlpha: 0 });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: cena, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });

  if (fundo) tl.fromTo(fundo, { scale: 1.08 }, { scale: 1, duration: 9.5 }, 0);

  let t = 0.2;
  valores.forEach((valor) => {
    const palavras = divide(valor.querySelector<HTMLElement>('[data-acende-claro]')!, 'palavra');
    tl.fromTo(valor, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, t);
    tl.fromTo(palavras, { opacity: 0.3 }, { opacity: 1, stagger: 0.05, duration: 0.9 }, t + 0.25);
    tl.to(valor, { autoAlpha: 0, y: -40, duration: 0.4 }, t + 1.75);
    t += 2.2;
  });

  /* Os princípios: a escada (−160 / 0 / +160) se alinha com a rolagem. */
  tl.to(escada, { autoAlpha: 1, duration: 0.4 }, t);
  degraus.forEach((d, i) => {
    tl.fromTo(d, { y: (i - 1) * 160 }, { y: 0, duration: 1.6 }, t);
  });
  t += 2.3;

  /* Saída: seis faixas brancas descem em sequência e cobrem a cena. */
  tl.to(faixas, { scaleY: 1, stagger: 0.1, duration: 0.6, ease: 'power2.in' }, t);

  ScrollTrigger.refresh();
}

if (!menosMovimento) void liga();

export {};
