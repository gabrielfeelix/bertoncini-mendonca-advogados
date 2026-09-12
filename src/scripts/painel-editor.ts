/**
 * O editor de texto rico do painel (Tiptap).
 *
 * Entra no dia 1 por decisão do plano (armadilha nº 5): no projeto anterior
 * o editor nunca ficou pronto, os sócios escreviam `<p>` à mão e o handoff
 * de lá aponta isso como o que mais atrapalhou o uso diário.
 *
 * ── Como ele convive com quem está sem JavaScript ───────────────────────
 *
 * A página nasce com um `<textarea name="corpo">` visível, em markdown.
 * Este script só o esconde depois de o Tiptap montar de verdade. Se o
 * script não carregar, ou explodir, o textarea continua lá e o editor
 * consegue escrever e salvar — em markdown, como faria num editor simples.
 *
 * O campo enviado é sempre o mesmo `name="corpo"`. Com o editor ligado, o
 * textarea é atualizado antes do envio; sem ele, o textarea já é o que a
 * pessoa digitou. O servidor não precisa saber qual dos dois aconteceu.
 *
 * ── Por que o textarea guarda HTML quando o editor está ligado ──────────
 *
 * A conversão para markdown acontece no servidor (`htmlParaMarkdown`), e
 * não aqui, porque é fronteira de segurança: é ela que impede um link
 * `javascript:` de chegar à coluna `corpo`. Defesa que roda no navegador é
 * defesa que o navegador pode pular. O servidor marca o formato num campo
 * escondido para não ter que adivinhar.
 */
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { destinoAceito } from '~/lib/markdown-editor';

/**
 * O HTML com que o editor abre. Vem de um `<script type="application/json">`
 * na página: o conteúdo do artigo nunca é interpolado dentro de código, onde
 * uma aspa ou um `</script>` no meio do texto quebraria a página.
 */
function conteudoInicial(): string {
  const caixa = document.querySelector('#painel-conteudo');
  if (!caixa?.textContent) return '';
  try {
    return JSON.parse(caixa.textContent) as string;
  } catch {
    return '';
  }
}

const textarea = document.querySelector<HTMLTextAreaElement>('#corpo-md');
const caixa = document.querySelector<HTMLElement>('#editor');
const barra = document.querySelector<HTMLElement>('#barra');
const formulario = textarea?.closest('form');
const dica = document.querySelector<HTMLElement>('#dica-corpo');

if (textarea && caixa && barra && formulario) {
  const editor = new Editor({
    element: caixa,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // O site não usa imagem nem bloco de código dentro do corpo, e o
        // conversor não os cobre. Não oferecer é melhor que oferecer e
        // perder na conversão.
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: false,
        // Mesma lista da conversão e da contenção do loader. Aqui é só
        // conveniência: quem decide de verdade é o servidor.
        validate: (href: string) => destinoAceito(href),
      }),
    ],
    content: conteudoInicial() || '<p></p>',
    editorProps: {
      attributes: {
        'aria-labelledby': 'rotulo-corpo',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
  });

  /* Diz ao servidor que o `corpo` vem em HTML do editor, e não em markdown
     digitado à mão. Sem isto o servidor teria que adivinhar o formato. */
  const formato = document.createElement('input');
  formato.type = 'hidden';
  formato.name = 'formato';
  formato.value = 'html';
  formulario.appendChild(formato);

  interface Ferramenta {
    rotulo: string;
    titulo: string;
    acao: () => void;
    ativo?: () => boolean;
  }

  const ferramentas: Ferramenta[] = [
    { rotulo: 'B', titulo: 'Negrito', acao: () => editor.chain().focus().toggleBold().run(), ativo: () => editor.isActive('bold') },
    { rotulo: 'I', titulo: 'Itálico', acao: () => editor.chain().focus().toggleItalic().run(), ativo: () => editor.isActive('italic') },
    { rotulo: 'Título', titulo: 'Título de seção', acao: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), ativo: () => editor.isActive('heading', { level: 2 }) },
    { rotulo: 'Subtítulo', titulo: 'Subtítulo', acao: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), ativo: () => editor.isActive('heading', { level: 3 }) },
    { rotulo: 'Lista', titulo: 'Lista com marcadores', acao: () => editor.chain().focus().toggleBulletList().run(), ativo: () => editor.isActive('bulletList') },
    { rotulo: 'Numerada', titulo: 'Lista numerada', acao: () => editor.chain().focus().toggleOrderedList().run(), ativo: () => editor.isActive('orderedList') },
    { rotulo: 'Citação', titulo: 'Citação', acao: () => editor.chain().focus().toggleBlockquote().run(), ativo: () => editor.isActive('blockquote') },
    {
      rotulo: 'Link',
      titulo: 'Inserir ou remover link',
      ativo: () => editor.isActive('link'),
      acao: () => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const destino = window.prompt('Endereço do link (começando com https://)');
        if (!destino) return;
        if (!destinoAceito(destino)) {
          window.alert('Esse endereço não é aceito.');
          return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: destino }).run();
      },
    },
  ];

  const botoes = ferramentas.map((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = f.rotulo;
    b.title = f.titulo;
    b.setAttribute('aria-label', f.titulo);
    if (f.ativo) b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => f.acao());
    barra.appendChild(b);
    return { b, f };
  });

  const marcaAtivos = () => {
    for (const { b, f } of botoes) {
      if (f.ativo) b.setAttribute('aria-pressed', String(f.ativo()));
    }
  };
  editor.on('selectionUpdate', marcaAtivos);
  editor.on('transaction', marcaAtivos);

  /* Só agora o textarea some: se algo acima tivesse falhado, ele seguiria
     visível e utilizável. */
  textarea.hidden = true;
  barra.hidden = false;
  caixa.hidden = false;
  if (dica) {
    dica.textContent = 'Selecione um trecho para formatar. O texto é salvo como você vê aqui.';
  }

  formulario.addEventListener('submit', () => {
    textarea.value = editor.getHTML();
  });
}
