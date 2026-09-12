/**
 * Camada de movimento (Tarefa 5). Migrada de `prototipo/index.html`,
 * linhas 871-1180.
 *
 * ── O que ela assume ────────────────────────────────────────────────────
 *
 * Que o site já funciona inteiro sem ela. Nada aqui é necessário para ler,
 * navegar ou enviar formulário: o CSS de `movimento.css` só se aplica
 * depois que a classe `.js` existe, e ela é posta na primeira linha deste
 * arquivo. Script bloqueado = site parado, e legível.
 *
 * ── `calmo` é o interruptor ─────────────────────────────────────────────
 *
 * Uma checagem só, no topo, e todo o resto se pendura nela. Quem pediu
 * menos movimento não recebe Lenis, nem reveals, nem parallax, nem
 * magnetismo, nem vídeo tocando — e o CSS desliga o que sobrar.
 *
 * O GSAP e o Lenis são carregados sob demanda, e só quando há movimento:
 * quem pediu `prefers-reduced-motion` não paga o download de biblioteca
 * que não vai rodar.
 */

const raiz = document.documentElement;
raiz.classList.add('js');

const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── o ano do rodapé ──────────────────────────────────────────────────── */
const ano = document.getElementById('ano');
if (ano) ano.textContent = String(new Date().getFullYear());

/* ─────────────────────────────────────────────────────────────────────────
   VÍDEO

   A correção que o handoff pedia: sob `prefers-reduced-motion` o vídeo
   precisa ser PAUSADO, não só ter o botão escondido. Antes ele rodava sem
   controle nenhum justamente para quem pediu menos movimento.

   `autoplay` é removido antes do `pause()` porque o atributo sozinho faz o
   navegador retomar a reprodução depois, em algumas situações (troca de
   aba, mudança de rede).
   ──────────────────────────────────────────────────────────────────────── */
function acalmaVideos(): void {
  document.querySelectorAll<HTMLVideoElement>('video').forEach((v) => {
    v.removeAttribute('autoplay');
    v.autoplay = false;
    v.pause();
  });
}

function ligaBotaoDePausa(): void {
  const filme = document.querySelector<HTMLVideoElement>('.hero .filme');
  const botao = document.getElementById('pausa');
  if (!filme || !botao) return;

  let parado = false;
  try {
    parado = sessionStorage.getItem('video') === 'pausado';
  } catch {
    /* modo privado: segue com o padrão */
  }

  const aplica = () => {
    if (parado) filme.pause();
    else void filme.play().catch(() => {});
    botao.setAttribute('aria-pressed', parado ? 'true' : 'false');
    botao.setAttribute('aria-label', parado ? 'Retomar o vídeo de fundo' : 'Pausar o vídeo de fundo');
    botao.textContent = parado ? 'Retomar vídeo' : 'Pausar vídeo';
  };

  botao.addEventListener('click', () => {
    parado = !parado;
    try {
      sessionStorage.setItem('video', parado ? 'pausado' : 'tocando');
    } catch {
      /* idem */
    }
    aplica();
  });

  aplica();
}

if (calmo) {
  acalmaVideos();
  /* O botão de pausa não serve para nada com o vídeo parado, e um controle
     que não controla confunde mais do que ajuda. */
  document.getElementById('pausa')?.setAttribute('hidden', '');
} else {
  ligaBotaoDePausa();
}

/* ─────────────────────────────────────────────────────────────────────────
   ÂNCORAS, COM A CORREÇÃO DE FOCO

   Migrado do protótipo (linhas 903-918), não reescrito: o handoff avisa
   que este handler já foi descartado uma vez nesta migração e o defeito
   voltou.

   O defeito: `preventDefault()` mata o movimento nativo de foco do
   navegador ao seguir uma âncora. Sem repor à mão, "Pular para o conteúdo"
   rola a página e deixa o foco onde estava — ou seja, não pula nada para
   quem usa teclado ou leitor de tela.

   O caso sem Lenis também precisa da reposição: o navegador só move o foco
   para elementos nativamente focáveis, e as seções são `<section>`/`<header>`.
   ──────────────────────────────────────────────────────────────────────── */
function poeFoco(alvo: HTMLElement): void {
  alvo.setAttribute('tabindex', '-1');
  alvo.focus({ preventScroll: true });
}

function alvoDaAncora(a: HTMLAnchorElement): HTMLElement | null {
  const href = a.getAttribute('href');
  /* `href="#"` sozinho quebraria o querySelector com SyntaxError. */
  if (!href || href.length < 2) return null;
  try {
    return document.querySelector<HTMLElement>(href);
  } catch {
    return null;
  }
}

function ancorasSemLenis(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      const alvo = alvoDaAncora(a);
      if (!alvo) return;
      /* Sem preventDefault: a rolagem nativa já acontece. Só o foco é
         reposto, no fim da fila, depois de o navegador ter rolado. */
      setTimeout(() => poeFoco(alvo), 0);
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   REVEALS

   Threshold 0 e a rede de segurança do `focusin` vêm do protótipo com os
   comentários originais: são duas correções de acessibilidade que já
   custaram caro uma vez.
   ──────────────────────────────────────────────────────────────────────── */
function revelaTudo(): void {
  document.querySelectorAll('.sobe').forEach((n) => n.classList.add('visivel'));
  document.querySelectorAll('.revela').forEach((n) => n.classList.add('aberta'));
}

function ligaReveals(): void {
  if (!('IntersectionObserver' in window)) {
    revelaTudo();
    return;
  }

  /* threshold 0: um elemento que só encostou a borda da viewport já revela.
     Um `.sobe` alto (o acordeão de perguntas, por exemplo) pode ganhar foco
     por Tab com só uma fatia visível; com threshold alto isso nunca passava
     do limite e a seção ficava opacity:0 sob o foco. */
  const olho = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visivel');
          olho.unobserve(e.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -6% 0px' },
  );
  document.querySelectorAll('.sobe').forEach((n) => olho.observe(n));

  const olhoImg = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('aberta');
          olhoImg.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  document.querySelectorAll('.revela').forEach((n) => olhoImg.observe(n));
}

/* Rede de segurança: o foco nunca pode pousar num elemento ainda invisível.
   Cobre (1) o Observer não ter disparado a tempo de um Tab que salta para
   dentro de uma seção alta, e (2) ele ter disparado junto com o salto, mas
   o fade de .8s ainda estar correndo — nesse instante o elemento já tem a
   classe e ainda está quase transparente, apagando o foco por quase 1s. */
document.addEventListener('focusin', (e) => {
  const alvo = (e.target as HTMLElement | null)?.closest<HTMLElement>('.sobe, .revela');
  if (!alvo) return;
  alvo.style.transition = 'none';
  alvo.classList.add(alvo.classList.contains('sobe') ? 'visivel' : 'aberta');
  void alvo.offsetHeight; /* força o reflow antes de devolver a transição */
  alvo.style.transition = '';
});

/* ─────────────────────────────────────────────────────────────────────────
   ENTRADA

   A chapa de abertura sobe uma vez por sessão. `sessionStorage` evita
   repetir a cada clique de âncora ou recarga — ver o mesmo pano subir dez
   vezes irrita quem está tentando ler.
   ──────────────────────────────────────────────────────────────────────── */
function ligaEntrada(): void {
  const entrada = document.getElementById('entrada');
  const hero = document.getElementById('hero');
  const liberaHero = () => hero?.classList.add('pronta');

  if (!entrada) {
    liberaHero();
    return;
  }

  let jaViu = false;
  try {
    jaViu = sessionStorage.getItem('entrada') === '1';
  } catch {
    /* idem */
  }

  if (calmo || jaViu) {
    entrada.classList.add('pulada');
    liberaHero();
    return;
  }

  requestAnimationFrame(() => entrada.classList.add('viva'));
  setTimeout(() => {
    entrada.classList.add('foi');
    try {
      sessionStorage.setItem('entrada', '1');
    } catch {
      /* idem */
    }
    setTimeout(liberaHero, 250);
    setTimeout(() => entrada.classList.add('pulada'), 1100);
  }, 650);
}

/* ─────────────────────────────────────────────────────────────────────────
   O QUE SÓ EXISTE COM MOVIMENTO
   ──────────────────────────────────────────────────────────────────────── */

/** Vídeo da faixa: só recebe `src` quando a seção se aproxima da tela. */
function ligaVideoTardio(): void {
  const tardio = document.querySelector<HTMLVideoElement>('.corte .filme');
  if (!tardio?.dataset.src) return;
  const olho = new IntersectionObserver(
    (es) => {
      if (es[0].isIntersecting) {
        tardio.src = tardio.dataset.src!;
        void tardio.play().catch(() => {});
        olho.disconnect();
      }
    },
    { rootMargin: '600px 0px' },
  );
  olho.observe(tardio);
}

/** Magnetismo: o botão desliza até 6px na direção do cursor. */
function ligaMagnetismo(): void {
  if (!matchMedia('(pointer:fine)').matches) return;
  document.querySelectorAll<HTMLElement>('.botao, .fala').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = `translate(${(x * 6).toFixed(1)}px,${(y * 6).toFixed(1)}px)`;
    });
    b.addEventListener('mouseleave', () => {
      b.style.transform = '';
    });
  });
}

/** Parallax do vídeo do hero. */
function ligaParallax(): void {
  const filme = document.querySelector<HTMLElement>('.hero .filme');
  if (!filme) return;
  let agendado = false;
  addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        if (y < innerHeight * 1.2) filme.style.translate = `0 ${(y * 0.18).toFixed(1)}px`;
        agendado = false;
      });
    },
    { passive: true },
  );
}

/** O vídeo que segue o cursor sobre as áreas. */
function ligaEspia(): void {
  const caixa = document.getElementById('espia');
  if (!caixa || matchMedia('(pointer:coarse)').matches) return;
  const tv = caixa.querySelector('video');
  if (!tv) return;
  let atual = '';
  document.querySelectorAll<HTMLElement>('.item[data-espia]').forEach((it) => {
    it.addEventListener('mouseenter', () => {
      const src = it.dataset.espia!;
      if (src !== atual) {
        tv.src = src;
        atual = src;
        void tv.play().catch(() => {});
      }
      caixa.classList.add('viva');
    });
    it.addEventListener('mouseleave', () => caixa.classList.remove('viva'));
    it.addEventListener('mousemove', (e) => {
      caixa.style.left = `${e.clientX}px`;
      caixa.style.top = `${e.clientY}px`;
    });
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   MONTAGEM
   ──────────────────────────────────────────────────────────────────────── */
ligaEntrada();

if (calmo) {
  /* Sem Lenis, sem GSAP, sem observers: tudo já visível, e as âncoras com
     a reposição de foco. */
  revelaTudo();
  ancorasSemLenis();
} else {
  ligaReveals();
  ligaVideoTardio();
  ligaMagnetismo();
  ligaParallax();
  ligaEspia();

  /* Lenis e GSAP entram sob demanda. Se a importação falhar (rede, bloqueio
     de script), as âncoras ainda ganham o handler nativo com foco — o site
     perde a inércia, não a navegação. */
  void (async () => {
    try {
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: true });
      raiz.classList.add('lenis');

      const tique = (t: number) => {
        lenis.raf(t);
        requestAnimationFrame(tique);
      };
      requestAnimationFrame(tique);

      /* Âncoras pelo Lenis, com a mesma reposição de foco do protótipo. */
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          const alvo = alvoDaAncora(a);
          if (!alvo) return;
          e.preventDefault();
          lenis.scrollTo(alvo, { offset: -24, duration: 1.1 });
          poeFoco(alvo);
        });
      });

      await ligaGsap(lenis);
    } catch {
      ancorasSemLenis();
    }
  })();
}

/**
 * GSAP: a declaração palavra a palavra e o método.
 *
 * O piso de opacidade da declaração é .62, e a janela do scrub é curta de
 * propósito (protótipo, linhas 425-432): a .62 o contraste do título fica
 * em 4.76:1, que passa AA de texto normal. Quem para de rolar no meio
 * nunca vê o texto travado ilegível. **Não baixar o piso nem alongar a
 * janela** — o público do site tem 70 anos.
 */
async function ligaGsap(lenis: { on: (evento: 'scroll', fn: () => void) => void }): Promise<void> {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);

  document.querySelectorAll<HTMLElement>('[data-palavras]').forEach((h) => {
    const palavras = h.textContent?.trim().split(/\s+/) ?? [];
    h.innerHTML = palavras.map((p) => `<span class="w">${p}</span>`).join(' ');
    gsap.to(h.querySelectorAll('.w'), {
      opacity: 1,
      stagger: 0.04,
      ease: 'none',
      scrollTrigger: { trigger: h, start: 'top 78%', end: 'bottom 75%', scrub: 0.6 },
    });
  });

  const sec = document.getElementById('metodo');
  if (!sec) return;
  sec.classList.add('viva');
  const passos = sec.querySelectorAll<HTMLElement>('.passo');
  passos.forEach((p) => {
    ScrollTrigger.create({
      trigger: p,
      start: 'top 62%',
      end: 'bottom 38%',
      onToggle: (s) => {
        if (s.isActive) {
          passos.forEach((q) => q.classList.remove('foco'));
          p.classList.add('foco');
        }
      },
    });
  });

  const traco = sec.querySelector('.traco i');
  const lista = sec.querySelector('.passos');
  if (traco && lista) {
    gsap.to(traco, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: lista, start: 'top 60%', end: 'bottom 60%', scrub: true },
    });
  }
}
