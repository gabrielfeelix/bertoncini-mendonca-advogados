/**
 * O formulário de um texto no navegador: editor rico, endereço automático,
 * tempo de leitura, capa, contadores e envio sem recarregar.
 *
 * Veio do `painel-editor.ts` do CMS de origem, com duas diferenças de
 * fundo:
 *
 * 1. **Nada fala com o Supabase daqui.** Lá o navegador gravava direto no
 *    banco; aqui o formulário vai para /api/painel/salvar, que converte o
 *    corpo para markdown no servidor (a defesa de XSS) e grava com a sessão
 *    do cookie HttpOnly. Imagem do corpo vai para /api/painel/imagem.
 * 2. **Tudo é melhoria sobre um formulário que já funciona.** A página
 *    nasce com um <textarea> de markdown visível; este script só o troca
 *    pelo Tiptap depois de o editor montar. Se o script falhar, o textarea
 *    continua lá e o texto ainda pode ser escrito e publicado.
 *
 * O botão "Markdown" da barra (no lugar do "ver o HTML" de lá) mostra o
 * mesmo textarea com o texto convertido, para quem quer escrever direto
 * em markdown. O campo `corpo_tipo` diz ao servidor qual dos dois chegou.
 */
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  destinoAceito,
  htmlParaMarkdown,
  imagemAceita,
  markdownParaHtml,
  minutosDeLeitura,
  slugDoTitulo,
} from './markdown-editor';

type Estado = 'limpo' | 'mexido' | 'salvando' | 'salvo';

/* O servidor da Vercel recusa corpo acima de 4,5 MB; a capa é reduzida
   antes de sair do navegador. 2400 px é o mesmo teto do servidor. */
const LADO_MAXIMO = 2400;

/** O HTML com que o editor abre (ver o <script type="application/json"> da página). */
function conteudoInicial(): string {
  const caixa = document.querySelector('#painel-conteudo');
  if (!caixa?.textContent) return '';
  try {
    return JSON.parse(caixa.textContent) as string;
  } catch {
    return '';
  }
}

/** Mede uma imagem pelo navegador. */
function mede(src: string): Promise<{ largura: number; altura: number }> {
  return new Promise((ok, falha) => {
    const img = new window.Image();
    img.onload = () => ok({ largura: img.naturalWidth, altura: img.naturalHeight });
    img.onerror = () => falha(new Error('não consegui ler a imagem'));
    img.src = src;
  });
}

/**
 * Reduz a imagem para no máximo 2400 px e WebP, no navegador. Devolve o
 * arquivo original quando ele já é pequeno ou quando o navegador não sabe
 * gerar WebP.
 */
async function reduz(arquivo: File): Promise<{ arquivo: File; largura: number; altura: number }> {
  const url = URL.createObjectURL(arquivo);
  try {
    const { largura, altura } = await mede(url);
    const escala = Math.min(1, LADO_MAXIMO / Math.max(largura, altura));
    if (escala === 1 && arquivo.size < 1.5 * 1024 * 1024) return { arquivo, largura, altura };

    const w = Math.round(largura * escala);
    const h = Math.round(altura * escala);
    const tela = document.createElement('canvas');
    tela.width = w;
    tela.height = h;
    const img = new window.Image();
    img.src = url;
    await img.decode();
    tela.getContext('2d')!.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((ok) => tela.toBlob(ok, 'image/webp', 0.85));
    if (!blob || blob.type !== 'image/webp') return { arquivo, largura, altura };
    const nome = arquivo.name.replace(/\.[^.]+$/, '') + '.webp';
    return { arquivo: new File([blob], nome, { type: 'image/webp' }), largura: w, altura: h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function montaEditor(): void {
  const form = document.querySelector<HTMLFormElement>('#form-artigo');
  if (!form) return;

  const $ = <T extends HTMLElement>(sel: string) => form.querySelector(sel) as T;
  const salvo = document.querySelector<HTMLElement>('#salvo');
  const estado = $<HTMLElement>('#estado');
  const novo = form.dataset.novo !== undefined;

  // ── estado "salvo / não salvo" ────────────────────────────────────────
  let mexido = false;
  const marca = (e: Estado) => {
    mexido = e === 'mexido';
    if (!salvo) return;
    salvo.className = 'pnl-salvo';
    salvo.textContent = { limpo: '', mexido: 'Não salvo', salvando: 'Salvando…', salvo: 'Salvo' }[e];
    if (e === 'mexido') salvo.classList.add('pnl-salvo--mexido');
    if (e === 'salvo') salvo.classList.add('pnl-salvo--ok');
  };
  const mexeu = () => { if (!mexido) marca('mexido'); };
  form.addEventListener('input', mexeu);
  form.addEventListener('change', mexeu);
  // Sair da página com texto não salvo pede confirmação do navegador.
  window.addEventListener('beforeunload', (e) => { if (mexido) e.preventDefault(); });

  // ── editor rico ───────────────────────────────────────────────────────
  const textarea = $<HTMLTextAreaElement>('#corpo-md');
  const area = $<HTMLElement>('#ed-area');
  const barra = $<HTMLElement>('.ed__barra');
  const bloco = $<HTMLSelectElement>('#ed-bloco');
  const corpoTipo = $<HTMLInputElement>('#corpo-tipo');
  const recado = $<HTMLElement>('#ed-recado');

  const editor = new Editor({
    element: area,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, // o título do texto é o h1 da página
        codeBlock: false, // o site não usa, e o conversor não cobre
        underline: false, // idem: sublinhado se confunde com link
        link: false, // configurado abaixo, com a lista de destinos aceitos
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        // Mesma lista do conversor. Aqui é conveniência: quem decide é o servidor.
        isAllowedUri: (url) => destinoAceito(url),
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Escreva o texto aqui…' }),
    ],
    content: conteudoInicial() || '',
    editorProps: {
      attributes: { 'aria-labelledby': 'rotulo-corpo', role: 'textbox', 'aria-multiline': 'true' },
    },
    onUpdate: () => { recalcula(); mexeu(); },
  });

  /** Modo markdown: o textarea visível no lugar do editor. */
  const emMarkdown = () => !textarea.hidden;
  const corpoAtual = () => (emMarkdown() ? textarea.value : htmlParaMarkdown(editor.getHTML()));

  /* Só agora o textarea sai de cena: se algo acima tivesse falhado, ele
     seguiria visível e utilizável. `required` sai junto, porque um campo
     escondido e obrigatório trava o envio do formulário. */
  textarea.hidden = true;
  textarea.required = false;
  area.hidden = false;
  barra.hidden = false;
  corpoTipo.value = 'html';
  recado.textContent = 'Selecione um trecho para formatar. "Markdown" mostra o texto cru.';

  function sincroniza() {
    barra.querySelectorAll<HTMLButtonElement>('.ed__b[data-cmd]').forEach((b) => {
      const c = b.dataset.cmd!;
      if (c === 'imagem') return;
      const ativo = c === 'markdown' ? emMarkdown() : editor.isActive(c);
      b.setAttribute('aria-pressed', String(ativo));
    });
    bloco.value = editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p';
    bloco.disabled = emMarkdown();
  }
  editor.on('selectionUpdate', sincroniza);
  editor.on('transaction', sincroniza);

  barra.querySelectorAll<HTMLButtonElement>('.ed__b[data-cmd]').forEach((b) => {
    b.addEventListener('mousedown', (e) => e.preventDefault()); // não perde o cursor
    b.addEventListener('click', () => {
      const cmd = b.dataset.cmd!;
      if (cmd === 'markdown') return alternaMarkdown();
      if (emMarkdown()) return; // no modo markdown, a formatação é escrita à mão
      const c = editor.chain().focus();
      switch (cmd) {
        case 'bold': c.toggleBold().run(); break;
        case 'italic': c.toggleItalic().run(); break;
        case 'blockquote': c.toggleBlockquote().run(); break;
        case 'bulletList': c.toggleBulletList().run(); break;
        case 'orderedList': c.toggleOrderedList().run(); break;
        case 'link': {
          if (editor.isActive('link')) { c.unsetLink().run(); break; }
          const destino = window.prompt('Endereço do link (começando com https://)', 'https://');
          if (!destino || destino === 'https://') break;
          if (!destinoAceito(destino)) { window.alert('Esse endereço não é aceito.'); break; }
          c.extendMarkRange('link').setLink({ href: destino.trim() }).run();
          break;
        }
        case 'imagem': $<HTMLInputElement>('#ed-arquivo').click(); break;
      }
      sincroniza();
    });
  });

  bloco.addEventListener('change', () => {
    const c = editor.chain().focus();
    if (bloco.value === 'p') c.setParagraph().run();
    else c.setHeading({ level: bloco.value === 'h2' ? 2 : 3 }).run();
  });

  function alternaMarkdown() {
    if (emMarkdown()) {
      editor.commands.setContent(markdownParaHtml(textarea.value), { emitUpdate: false });
      textarea.hidden = true;
      area.hidden = false;
      corpoTipo.value = 'html';
      editor.commands.focus();
    } else {
      textarea.value = htmlParaMarkdown(editor.getHTML());
      textarea.hidden = false;
      area.hidden = true;
      corpoTipo.value = 'markdown';
      textarea.focus();
    }
    sincroniza();
  }
  textarea.addEventListener('input', recalcula);

  // Imagem no meio do texto: vai para o bucket pelo servidor.
  const arquivoImagem = $<HTMLInputElement>('#ed-arquivo');
  arquivoImagem.addEventListener('change', async () => {
    const escolhido = arquivoImagem.files?.[0];
    arquivoImagem.value = '';
    if (!escolhido) return;
    recado.textContent = 'Enviando a imagem…';
    try {
      const { arquivo } = await reduz(escolhido);
      const dados = new FormData();
      dados.set('arquivo', arquivo);
      const resposta = await fetch('/api/painel/imagem', { method: 'POST', body: dados, headers: { Accept: 'application/json' } });
      const r = (await resposta.json()) as { ok: boolean; url?: string; mensagem?: string };
      if (!r.ok || !r.url || !imagemAceita(r.url)) throw new Error(r.mensagem ?? 'envio recusado');
      const alt = window.prompt('O que esta imagem mostra? (para quem usa leitor de tela)') ?? '';
      editor.chain().focus().setImage({ src: r.url, alt: alt.trim() }).run();
      recado.textContent = '';
    } catch (e) {
      recado.textContent = `Não consegui enviar a imagem: ${(e as Error).message}`;
    }
  });

  // ── tempo de leitura ──────────────────────────────────────────────────
  const campoTempo = $<HTMLInputElement>('#c-tempo');
  const tempoAuto = $<HTMLInputElement>('#c-tempo-auto');
  function recalcula() {
    if (tempoAuto.checked) campoTempo.value = String(minutosDeLeitura(corpoAtual()));
  }
  tempoAuto.addEventListener('change', () => {
    campoTempo.readOnly = tempoAuto.checked;
    recalcula();
  });
  campoTempo.readOnly = tempoAuto.checked;
  recalcula();

  // ── endereço ──────────────────────────────────────────────────────────
  const titulo = $<HTMLInputElement>('#c-titulo');
  const slug = $<HTMLInputElement>('#c-slug');
  const previaUrl = $<HTMLElement>('#previa-url');
  const mostraUrl = () => {
    previaUrl.textContent = slug.value ? `${slug.dataset.base}${slug.value}/` : '';
  };
  if (novo) {
    let slugNaMao = false;
    slug.addEventListener('input', () => {
      slugNaMao = slug.value !== '';
      mostraUrl();
    });
    slug.addEventListener('blur', () => { slug.value = slugDoTitulo(slug.value); mostraUrl(); });
    titulo.addEventListener('input', () => {
      // Ao editar um texto existente, o endereço não muda: quebraria o link publicado.
      if (!slugNaMao) { slug.value = slugDoTitulo(titulo.value); mostraUrl(); }
    });
  }

  // ── contadores ────────────────────────────────────────────────────────
  form.querySelectorAll<HTMLElement>('[data-conta]').forEach((saida) => {
    const campo = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${saida.dataset.conta}`)!;
    const max = Number(saida.dataset.max);
    const conta = () => {
      saida.textContent = String(campo.value.length);
      saida.classList.toggle('pnl-conta--passou', campo.value.length >= max);
    };
    campo.addEventListener('input', conta);
  });

  // ── capa ──────────────────────────────────────────────────────────────
  const previaCapa = $<HTMLImageElement>('#previa-capa');
  const arquivoCapa = $<HTMLInputElement>('#c-capa-arquivo');
  const urlCapa = $<HTMLInputElement>('#c-capa');
  const largura = $<HTMLInputElement>('#c-capa-largura');
  const altura = $<HTMLInputElement>('#c-capa-altura');
  const capaRecado = $<HTMLElement>('#capa-recado');

  const mostraCapa = (src: string) => {
    previaCapa.src = src;
    previaCapa.hidden = false;
  };

  arquivoCapa.addEventListener('change', async () => {
    const escolhido = arquivoCapa.files?.[0];
    if (!escolhido) return;
    try {
      const reduzido = await reduz(escolhido);
      if (reduzido.arquivo !== escolhido) {
        const caixa = new DataTransfer();
        caixa.items.add(reduzido.arquivo);
        arquivoCapa.files = caixa.files;
      }
      largura.value = String(reduzido.largura);
      altura.value = String(reduzido.altura);
      mostraCapa(URL.createObjectURL(reduzido.arquivo));
      capaRecado.textContent = `Pronta para enviar: ${reduzido.largura} × ${reduzido.altura} px. Sobe quando você salvar.`;
    } catch {
      capaRecado.textContent = 'Não consegui ler essa imagem. Tente outra, em JPG, PNG ou WebP.';
    }
  });

  urlCapa.addEventListener('change', async () => {
    const src = urlCapa.value.trim();
    if (!src) { previaCapa.hidden = true; return; }
    if (!imagemAceita(src)) return;
    try {
      const medida = await mede(src);
      largura.value = String(medida.largura);
      altura.value = String(medida.altura);
      mostraCapa(src);
    } catch {
      capaRecado.textContent = 'Não consegui abrir a imagem desse endereço.';
    }
  });

  // ── envio ─────────────────────────────────────────────────────────────
  /* Com JavaScript, o formulário vai por fetch e o servidor responde JSON:
     um erro (resumo vazio, capa sem descrição) aparece aqui, sem recarregar
     a página e sem perder o texto. */
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = evento.submitter as HTMLButtonElement | null;

    if (emMarkdown()) {
      corpoTipo.value = 'markdown';
    } else {
      corpoTipo.value = 'html';
      textarea.value = editor.isEmpty ? '' : editor.getHTML();
    }
    if (!corpoAtual().trim()) {
      estado.textContent = 'O texto está vazio.';
      return;
    }

    const dados = new FormData(form);
    if (botao?.name) dados.set(botao.name, botao.value);

    const botoes = document.querySelectorAll<HTMLButtonElement>('button[type="submit"]');
    botoes.forEach((b) => { b.disabled = true; });
    estado.textContent = '';
    marca('salvando');

    try {
      const resposta = await fetch(form.action, { method: 'POST', body: dados, headers: { Accept: 'application/json' } });
      const r = (await resposta.json()) as { ok: boolean; mensagem?: string; destino: string; erro?: string };
      if (r.ok) {
        marca('salvo');
        location.href = r.destino;
        return;
      }
      if (r.erro === 'sessao' || r.erro === 'sem-banco') {
        estado.textContent = `${r.mensagem} Copie o texto antes de sair desta página.`;
      } else {
        estado.textContent = r.mensagem ?? 'Não consegui salvar. Tente de novo.';
      }
      marca('mexido');
    } catch {
      estado.textContent = 'Sem conexão com o servidor. O texto continua aqui; tente de novo.';
      marca('mexido');
    } finally {
      botoes.forEach((b) => { b.disabled = false; });
    }
  });

  // ── apagar ────────────────────────────────────────────────────────────
  const formApagar = document.querySelector<HTMLFormElement>('#form-apagar');
  formApagar?.addEventListener('submit', (e) => {
    const nome = formApagar.querySelector<HTMLButtonElement>('button')?.dataset.titulo ?? 'este texto';
    if (!window.confirm(`Apagar "${nome}"? Isso não tem volta.`)) e.preventDefault();
    else mexido = false;
  });

  sincroniza();
  marca('limpo');
}
