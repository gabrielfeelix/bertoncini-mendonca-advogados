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
 * regra para conferir, no build, que a página onde ele está sendo montado é
 * um destino válido. Sem essa conferência, acrescentar a newsletter a uma
 * página nova falha em silêncio: a inscrição funciona, mas quem está sem
 * JavaScript é jogado para a home em vez de voltar para onde estava.
 */

/** Páginas fixas que montam a newsletter. Comparação exata. */
const EXATAS = ['/', '/contato/', '/textos/'] as const;

/**
 * As páginas de artigo também montam a newsletter, e o slug é dinâmico:
 * não há como listá-las uma a uma. Daí a regra de prefixo.
 *
 * Ela continua sendo lista fechada no que importa para a segurança. O valor
 * precisa começar com `/textos/`, terminar em `/` e não conter mais nenhuma
 * barra no meio — ou seja, casa `/textos/algum-slug/` e não casa
 * `/textos/../evil`, `/textos//evil.com` nem `/textos/a/b/`. Como a rota
 * compara o caminho já normalizado pelo parser de URL, não sobra espaço
 * para truque de normalização.
 */
const ARTIGO = /^\/textos\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;

export function voltaPermitida(valor: string): boolean {
  return (EXATAS as readonly string[]).includes(valor) || ARTIGO.test(valor);
}
