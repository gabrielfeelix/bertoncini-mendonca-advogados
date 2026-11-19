/**
 * Modal próprio do painel, no lugar de `alert()`, `confirm()` e `prompt()`.
 *
 * Regra do painel: nada de caixa nativa do navegador (a do sistema destoa,
 * não segue o visual do painel e, no celular, mostra o endereço do site no
 * título). Este módulo monta um <dialog> com as classes `pnl-dialogo` a
 * cada pergunta e o desmonta ao fechar.
 *
 * Só roda no navegador, a partir dos scripts do painel. O <dialog> nativo
 * dá de graça o que importa para acessibilidade: foco preso dentro do
 * modal, Esc para cancelar e o foco de volta para onde estava.
 */

interface Opcoes {
  titulo: string;
  texto?: string;
  /** Com campo, a resposta é o texto digitado (ou `null` se cancelou). */
  campo?: { rotulo: string; valor?: string; tipo?: 'text' | 'url' };
  /** Texto do botão principal. */
  confirmar?: string;
  /** Texto do botão de cancelar; `false` para um aviso só com "Entendi". */
  cancelar?: string | false;
  /** Botão principal em vermelho (apagar). */
  perigo?: boolean;
}

/** Pergunta e espera. Sem campo: `true`/`false`. Com campo: texto ou `null`. */
export function pergunta(opcoes: Opcoes & { campo: NonNullable<Opcoes['campo']> }): Promise<string | null>;
export function pergunta(opcoes: Opcoes): Promise<boolean>;
export function pergunta(opcoes: Opcoes): Promise<boolean | string | null> {
  const { titulo, texto, campo, confirmar = 'Confirmar', cancelar = 'Cancelar', perigo = false } = opcoes;

  const dialogo = document.createElement('dialog');
  dialogo.className = 'pnl-dialogo';
  const id = `pnl-dialogo-${Date.now()}`;
  dialogo.setAttribute('aria-labelledby', `${id}-titulo`);

  const form = document.createElement('form');
  form.method = 'dialog';

  const h = document.createElement('h2');
  h.className = 'pnl-feito__titulo';
  h.id = `${id}-titulo`;
  h.textContent = titulo;
  form.append(h);

  if (texto) {
    const p = document.createElement('p');
    p.textContent = texto;
    form.append(p);
  }

  let entrada: HTMLInputElement | null = null;
  if (campo) {
    const rotulo = document.createElement('label');
    rotulo.className = 'pnl-rotulo';
    rotulo.htmlFor = `${id}-campo`;
    rotulo.textContent = campo.rotulo;
    entrada = document.createElement('input');
    entrada.className = 'pnl-campo';
    entrada.id = `${id}-campo`;
    entrada.type = campo.tipo ?? 'text';
    entrada.value = campo.valor ?? '';
    entrada.autocomplete = 'off';
    const bloco = document.createElement('div');
    bloco.className = 'pnl-dialogo__campo';
    bloco.append(rotulo, entrada);
    form.append(bloco);
  }

  const acoes = document.createElement('div');
  acoes.className = 'pnl-dialogo__acoes';
  if (cancelar !== false) {
    const nao = document.createElement('button');
    nao.type = 'submit';
    nao.value = 'nao';
    nao.className = 'pnl-btn';
    nao.textContent = cancelar;
    acoes.append(nao);
  }
  const sim = document.createElement('button');
  sim.type = 'submit';
  sim.value = 'sim';
  sim.className = perigo ? 'pnl-btn pnl-btn--perigo' : 'pnl-btn pnl-btn--principal';
  sim.textContent = cancelar === false ? (opcoes.confirmar ?? 'Entendi') : confirmar;
  acoes.append(sim);
  form.append(acoes);

  dialogo.append(form);
  document.body.append(dialogo);

  return new Promise((resolve) => {
    dialogo.addEventListener('close', () => {
      const aceitou = dialogo.returnValue === 'sim';
      dialogo.remove();
      if (campo) resolve(aceitou ? (entrada?.value ?? '') : null);
      else resolve(aceitou);
    });
    /* Enter no campo confirma. Sem isto, o envio implícito do formulário
       usaria o primeiro botão, que é o "Cancelar". */
    entrada?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        dialogo.close('sim');
      }
    });
    dialogo.showModal();
    /* Foco: no campo, se houver; senão, no botão seguro (cancelar) quando
       a ação é de perigo, para Enter não apagar sem querer. */
    if (entrada) {
      entrada.focus();
      // Cursor no fim: "https://" já preenchido é começo, não algo a apagar.
      entrada.setSelectionRange(entrada.value.length, entrada.value.length);
    } else if (perigo && cancelar !== false) {
      (acoes.firstElementChild as HTMLButtonElement).focus();
    } else {
      sim.focus();
    }
  });
}

/** Aviso com um botão só, no lugar de `alert()`. */
export function avisa(titulo: string, texto?: string): Promise<boolean> {
  return pergunta({ titulo, texto, cancelar: false, confirmar: 'Entendi' });
}
