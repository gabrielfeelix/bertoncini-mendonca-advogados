/**
 * Caminhos para os quais o 303 da newsletter pode devolver quem está sem
 * JavaScript.
 *
 * Lista fechada, e não filtro de caractere. A primeira versão da rota
 * filtrava caracteres (`//` e `..`) e era furada: o parser de URL normaliza
 * a barra invertida para barra, então `origem=/\evil.com` virava
 * `Location: http://evil.com/`, um redirecionador aberto a partir de um
 * `<input type="hidden">` que qualquer site consegue forjar. Com lista
 * fechada não há o que normalizar: valor fora da lista cai em `/`.
 *
 * Mora aqui, e não na rota, porque `Newsletter.astro` precisa da mesma
 * lista para conferir, no build, que a página onde ele está sendo montado
 * é um destino válido. Sem essa conferência, acrescentar a newsletter a uma
 * página nova falha em silêncio: a inscrição funciona, mas quem está sem
 * JavaScript é jogado para a home em vez de voltar para onde estava.
 * Foi o que aconteceu com `/textos/`.
 */
export const VOLTAS_PERMITIDAS = ['/', '/contato/', '/textos/'] as const;

export function voltaPermitida(valor: string): boolean {
  return (VOLTAS_PERMITIDAS as readonly string[]).includes(valor);
}
