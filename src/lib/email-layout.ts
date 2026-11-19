/**
 * Layout único dos e-mails do site (18/11/2026): contato, confirmação,
 * boas-vindas (newsletter e painel) e a newsletter de cada artigo.
 *
 * Feito para cliente de e-mail, não para navegador: tabelas, CSS inline,
 * 600px de largura, imagens com URL absoluta e fontes de sistema (Gmail e
 * Outlook ignoram webfont). Cores da marca: azul-noite, petróleo e creme.
 */
import { site } from './site';

const AZUL = '#0B1E3F';
const PETROLEO = '#004369';
const CINZA = '#5B6B7F';
const LINHA = '#E3E6EA';
const CREME = '#F8F7F2';
const FONTE = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapa(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const urlAbsoluta = (caminho: string) => (/^https?:\/\//.test(caminho) ? caminho : new URL(caminho, site.url).toString());

/** Parágrafo de texto corrido. Recebe HTML já escapado. */
export const paragrafo = (html: string, cor = AZUL) =>
  `<p style="margin:0 0 16px;font:16px/1.65 ${FONTE};color:${cor}">${html}</p>`;

/** Lista de rótulo e valor (dados do contato, login etc.). Valores em texto puro. */
export function dados(linhas: [string, string][]) {
  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:4px 0 20px">` +
    linhas
      .map(
        ([rotulo, valor]) =>
          `<tr><td style="padding:10px 0;border-top:1px solid ${LINHA};width:150px;vertical-align:top;font:13px/1.5 ${FONTE};color:${CINZA}">${escapa(rotulo)}</td>` +
          `<td style="padding:10px 0;border-top:1px solid ${LINHA};vertical-align:top;font:600 15px/1.5 ${FONTE};color:${AZUL}">${escapa(valor)}</td></tr>`,
      )
      .join('') +
    '</table>'
  );
}

/** Rótulo pequeno de seção, em caixa alta. */
export const rotuloSecao = (texto: string) =>
  `<p style="margin:0 0 8px;font:600 12px/1 ${FONTE};letter-spacing:.12em;text-transform:uppercase;color:${CINZA}">${escapa(texto)}</p>`;

/** Bloco de citação (a mensagem enviada). Texto puro. */
export const citacao = (texto: string) =>
  `<div style="margin:0 0 20px;padding:18px 20px;background:${CREME};border-radius:8px;font:15px/1.65 ${FONTE};color:${AZUL};white-space:pre-wrap">${escapa(texto)}</div>`;

/** Botão "à prova de Outlook" (tabela com fundo). */
export function botao(rotulo: string, href: string, secundario = false) {
  const fundo = secundario ? '#ffffff' : PETROLEO;
  const cor = secundario ? PETROLEO : '#ffffff';
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;margin:4px 8px 4px 0"><tr>` +
    `<td style="border-radius:6px;background:${fundo};border:1.5px solid ${PETROLEO}">` +
    `<a href="${escapa(href)}" style="display:inline-block;padding:13px 26px;font:600 15px/1 ${FONTE};color:${cor};text-decoration:none;border-radius:6px">${escapa(rotulo)}</a>` +
    '</td></tr></table>'
  );
}

/** Nota pequena, em cinza (avisos legais, validade de link). */
export const nota = (html: string) => `<p style="margin:16px 0 0;font:13px/1.6 ${FONTE};color:${CINZA}">${html}</p>`;

interface Opcoes {
  /** Texto que aparece na prévia da caixa de entrada. */
  preheader: string;
  /** Título grande do e-mail. */
  titulo: string;
  /** Rótulo pequeno acima do título (ex.: "Novo contato pelo site"). */
  rotulo?: string;
  /** Imagem larga no topo do conteúdo (newsletter). URL absoluta. */
  imagem?: { src: string; alt: string };
  /** Corpo, em HTML montado com as funções acima. */
  corpo: string;
  /** Inclui o link de descadastro da Brevo (newsletter). */
  descadastro?: boolean;
}

export function layoutEmail(o: Opcoes): string {
  const logo = urlAbsoluta('/media/marca/logo-email.png');
  const rodapeLegal =
    `${escapa(site.nome)} · Sociedade de advogados ${escapa(site.registro.oabSociedade.valor)}<br>` +
    `${escapa(site.cidade)}/${escapa(site.estado)} · <a href="${site.url}" style="color:${CINZA}">${site.url.replace(/^https?:\/\//, '')}</a>`;
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${escapa(o.titulo)}</title></head>
<body style="margin:0;padding:0;background:${CREME}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapa(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREME}"><tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(11,30,63,.08)">
    <tr><td style="background:${AZUL};padding:26px 36px">
      <a href="${site.url}"><img src="${logo}" alt="${escapa(site.nome)}" width="180" style="display:block;width:180px;height:auto;border:0"></a>
    </td></tr>
    ${o.imagem ? `<tr><td><img src="${escapa(o.imagem.src)}" alt="${escapa(o.imagem.alt)}" width="600" style="display:block;width:100%;height:auto;border:0"></td></tr>` : ''}
    <tr><td style="padding:36px 36px 28px">
      ${o.rotulo ? `<p style="margin:0 0 10px;font:600 12px/1 ${FONTE};letter-spacing:.14em;text-transform:uppercase;color:${PETROLEO}">${escapa(o.rotulo)}</p>` : ''}
      <h1 style="margin:0 0 20px;font:300 28px/1.25 ${FONTE};color:${AZUL}">${escapa(o.titulo)}</h1>
      ${o.corpo}
    </td></tr>
    <tr><td style="padding:22px 36px 28px;border-top:1px solid ${LINHA};font:12px/1.7 ${FONTE};color:${CINZA}">
      ${rodapeLegal}
      ${o.descadastro ? `<br><br>Você recebe este e-mail porque se inscreveu para receber os conteúdos do escritório. <a href="{{ unsubscribe }}" style="color:${CINZA}">Cancelar inscrição</a> · <a href="${urlAbsoluta('/politica-de-privacidade/')}" style="color:${CINZA}">Política de Privacidade</a>` : ''}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}
