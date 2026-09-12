// Testes da ponte entre o editor e o banco (src/lib/markdown-editor.ts).
//
// Rode com: npm run testa:markdown
//
// A conversão é a fronteira de segurança do painel: o Tiptap edita HTML, a
// coluna `corpo` guarda markdown, e é o markdown que a contenção do loader
// sabe neutralizar no build. Um link `javascript:` que atravesse aqui vira
// âncora executável na página publicada. Por isso os casos de segurança
// abaixo não são opcionais.
import { htmlParaMarkdown, markdownParaHtml, minutosDeLeitura, slugDoTitulo } from '../src/lib/markdown-editor.ts';
import { neutralizaHtmlCru } from '../src/lib/loader-supabase.ts';

let falhas = 0;
const eq = (nome, obtido, esperado) => {
  if (obtido !== esperado) { falhas++; console.log('FALHA ' + nome + '\n  obtido:   ' + JSON.stringify(obtido) + '\n  esperado: ' + JSON.stringify(esperado)); }
};

// ── HTML do Tiptap -> markdown ──
eq('parágrafo', htmlParaMarkdown('<p>Olá mundo.</p>'), 'Olá mundo.');
eq('dois parágrafos', htmlParaMarkdown('<p>Um.</p><p>Dois.</p>'), 'Um.\n\nDois.');
eq('negrito', htmlParaMarkdown('<p>Isto é <strong>forte</strong>.</p>'), 'Isto é **forte**.');
eq('itálico', htmlParaMarkdown('<p>Isto é <em>leve</em>.</p>'), 'Isto é *leve*.');
eq('h2', htmlParaMarkdown('<h2>Título</h2>'), '## Título');
eq('h3', htmlParaMarkdown('<h3>Sub</h3>'), '### Sub');
eq('lista', htmlParaMarkdown('<ul><li><p>um</p></li><li><p>dois</p></li></ul>'), '- um\n- dois');
eq('numerada', htmlParaMarkdown('<ol><li><p>um</p></li><li><p>dois</p></li></ol>'), '1. um\n2. dois');
eq('citação', htmlParaMarkdown('<blockquote><p>citado</p></blockquote>'), '> citado');
eq('regra', htmlParaMarkdown('<p>a</p><hr><p>b</p>'), 'a\n\n---\n\nb');
eq('link bom', htmlParaMarkdown('<p><a href="https://x.com">x</a></p>'), '[x](https://x.com)');
eq('quebra', htmlParaMarkdown('<p>a<br>b</p>'), 'a\nb');

// ── A FRONTEIRA DE SEGURANÇA ──
eq('link javascript vira texto', htmlParaMarkdown('<p><a href="javascript:alert(1)">clique</a></p>'), 'clique');
eq('link data vira texto', htmlParaMarkdown('<p><a href="data:text/html,x">clique</a></p>'), 'clique');
eq('script some', htmlParaMarkdown('<p>a</p><script>alert(1)</script>'), 'a\n\nalert(1)');
eq('img some', htmlParaMarkdown('<p>a<img src=x onerror=alert(1)></p>'), 'a');
eq('onclick some', htmlParaMarkdown('<p onclick="alert(1)">texto</p>'), 'texto');

// ── markdown -> HTML (abrir para editar) ──
eq('md p', markdownParaHtml('Olá.'), '<p>Olá.</p>');
eq('md h2', markdownParaHtml('## T'), '<h2>T</h2>');
eq('md forte', markdownParaHtml('a **b** c'), '<p>a <strong>b</strong> c</p>');
eq('md lista', markdownParaHtml('- um\n- dois'), '<ul><li><p>um</p></li><li><p>dois</p></li></ul>');
eq('md link ruim fica texto', markdownParaHtml('[x](javascript:alert(1))'), '<p>[x](javascript:alert(1))</p>');
eq('md html vira escapado', markdownParaHtml('<img src=x onerror=alert(1)>'), '<p>&lt;img src=x onerror=alert(1)&gt;</p>');

// ── ida e volta ──
const casos = [
  'Um parágrafo simples.',
  'Com **negrito** e *itálico*.',
  '## Um título\n\nE um parágrafo.',
  '- um\n- dois\n- três',
  '1. um\n2. dois',
  '> uma citação',
  'Link [bom](https://exemplo.com) no meio.',
  'Antes.\n\n---\n\nDepois.',
];
for (const md of casos) {
  const volta = htmlParaMarkdown(markdownParaHtml(md));
  if (volta !== md) { falhas++; console.log('FALHA ida-e-volta\n  original: ' + JSON.stringify(md) + '\n  voltou:   ' + JSON.stringify(volta)); }
}

// ── o que o banco recebe nunca produz HTML executável no build ──
for (const perigoso of ['<p><a href="javascript:alert(1)">x</a></p>', '<p><script>alert(1)</script></p>', '<p><img src=x onerror=alert(1)></p>']) {
  const noBanco = htmlParaMarkdown(perigoso);
  const publicado = neutralizaHtmlCru(noBanco);
  if (/javascript:|onerror|<script/i.test(publicado)) { falhas++; console.log('FALHA fronteira: ' + JSON.stringify(perigoso) + ' -> ' + JSON.stringify(publicado)); }
}

// ── utilitários ──
eq('slug', slugDoTitulo('Inventário: o que é a Ação?'), 'inventario-o-que-e-a-acao');
eq('minutos mínimo', minutosDeLeitura('só três palavras'), 1);
eq('minutos 400', minutosDeLeitura('palavra '.repeat(400)), 2);

console.log(falhas === 0 ? 'OK: todos os casos passaram' : falhas + ' falha(s)');
if (falhas > 0) process.exit(1);
