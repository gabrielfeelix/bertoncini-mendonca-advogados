/**
 * Movimento da página O escritório (26/10/2026). Plano em
 * docs/PLANO-ESCRITORIO.md. Os efeitos comuns (subida, marca-d'água,
 * palavras que acendem, números, título que cresce) vêm de `cinema.ts`;
 * aqui fica só a cena, que é desta página.
 *
 * A página funciona inteira sem este arquivo: o CSS só monta a cena
 * (palco sticky, camadas sobrepostas) quando `.movimento-escritorio` existe
 * no <html>, e ela só é posta aqui, depois de checar
 * `prefers-reduced-motion`.
 */
import { divide, ligaCinema } from './cinema';

const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A cena: cortina que sobe sobre a foto, os três valores um de cada vez com
 * as palavras se acendendo, os princípios em escada e a saída em faixas.
 */
function ligaCena(gsap: typeof import('gsap').gsap): void {
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

  /* Os princípios: a escada (−160 / 0 / +160) se alinha com a rolagem. No
     celular os degraus ficam um sobre o outro: a escada só desce (0 / 60 /
     120), senão o primeiro subia por cima do título. */
  const celular = matchMedia('(max-width: 900px)').matches;
  tl.to(escada, { autoAlpha: 1, duration: 0.4 }, t);
  degraus.forEach((d, i) => {
    tl.fromTo(d, { y: celular ? i * 60 : (i - 1) * 160 }, { y: 0, duration: 1.6 }, t);
  });
  t += 2.3;

  /* Saída: seis faixas brancas descem em sequência e cobrem a cena. */
  tl.to(faixas, { scaleY: 1, stagger: 0.1, duration: 0.6, ease: 'power2.in' }, t);

}

if (!menosMovimento) {
  document.documentElement.classList.add('movimento-escritorio');
  void ligaCinema().then(ligaCena);
}

export {};
