/**
 * Resposta das rotas de API em dois formatos.
 *
 * Adaptado de `src/lib/resposta.ts` da Isabella. O motivo é o mesmo: os
 * formulários precisam funcionar com e sem JavaScript. Quem tem JS manda
 * `accept: application/json` e recebe JSON; quem não tem postou o `<form>`
 * direto e precisa voltar para uma página de verdade, não olhar um JSON cru.
 *
 * Diferença em relação à Isabella: lá o destino do 303 saía do cabeçalho
 * `referer`, que é falsificável e pode vir de outro site. Aqui o destino é
 * fixo (o caminho passado por quem chama) e só o parâmetro varia, então uma
 * requisição forjada não consegue nos usar como redirecionador aberto.
 */
/* Corte por campo na volta do 303. Conservador de propósito: a URL inteira
   precisa caber no limite de cabeçalho do servidor, e há cinco campos. */
const LIMITE_VALOR = 1800;

export function responde(
  request: Request,
  resultado: { ok: boolean; erro?: string; codigo?: string },
  status: number,
  caminhoDeVolta: string,
  /*
    Qual formulário respondeu. Vira o nome do parâmetro na volta
    (`?envio-contato=ok`, `?envio-newsletter=ok`) e o alvo da âncora.

    Não pode ser um `?envio=` só para os dois: a mesma página pode conter o
    formulário de contato E a newsletter, e aí um envio de contato bem
    sucedido faria a newsletter anunciar "inscrição confirmada" junto, sem
    ninguém ter se inscrito.
  */
  formulario: 'contato' | 'newsletter',
  /*
    O que a pessoa digitou, para a página repreencher os campos na volta sem
    JavaScript. Só é usado no caminho de erro: sem isto, quem erra o e-mail
    redigita a mensagem inteira.

    Vai na query porque o 303 não tem corpo. É dado da própria pessoa
    voltando para ela mesma, no mesmo pedido, e o Astro escapa o `value` ao
    renderizar.

    Um relato muito longo não cabe na URL (servidor e navegador recusam
    cabeçalho acima de alguns KB), então ele é cortado em `LIMITE_VALOR`.
    Quando isso acontece, a página é avisada por `?corte=1` e mostra um
    aviso visível: cortar o relato de alguém em silêncio, de forma que a
    pessoa reenvie sem perceber que falta metade, é pior do que não
    repreencher nada.
  */
  valores?: Record<string, string>,
): Response {
  const querJson = (request.headers.get('accept') ?? '').includes('application/json');

  if (querJson) {
    return new Response(JSON.stringify({ ok: resultado.ok, erro: resultado.erro }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const destino = new URL(caminhoDeVolta, request.url);
  destino.searchParams.set(`envio-${formulario}`, resultado.ok ? 'ok' : 'erro');
  // O código identifica a mensagem de erro a mostrar na página. O texto em
  // si mora no .astro, para a página sem JS conseguir renderizá-lo.
  if (!resultado.ok && resultado.codigo) {
    destino.searchParams.set(`motivo-${formulario}`, resultado.codigo);
    let cortou = false;
    for (const [campo, valor] of Object.entries(valores ?? {})) {
      if (!valor) continue;
      if (valor.length > LIMITE_VALOR) cortou = true;
      destino.searchParams.set(`v-${campo}`, valor.slice(0, LIMITE_VALOR));
    }
    if (cortou) destino.searchParams.set(`corte-${formulario}`, '1');
  }
  destino.hash = `resultado-${formulario}`;
  return new Response(null, { status: 303, headers: { location: destino.toString() } });
}
