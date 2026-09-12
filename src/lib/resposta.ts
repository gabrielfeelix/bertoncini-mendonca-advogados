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
export function responde(
  request: Request,
  resultado: { ok: boolean; erro?: string; codigo?: string },
  status: number,
  caminhoDeVolta: string,
): Response {
  const querJson = (request.headers.get('accept') ?? '').includes('application/json');

  if (querJson) {
    return new Response(JSON.stringify({ ok: resultado.ok, erro: resultado.erro }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const destino = new URL(caminhoDeVolta, request.url);
  destino.searchParams.set('envio', resultado.ok ? 'ok' : 'erro');
  // O código identifica a mensagem de erro a mostrar na página. O texto em
  // si mora no .astro, para a página sem JS conseguir renderizá-lo.
  if (!resultado.ok && resultado.codigo) destino.searchParams.set('motivo', resultado.codigo);
  destino.hash = 'resultado-envio';
  return new Response(null, { status: 303, headers: { location: destino.toString() } });
}
