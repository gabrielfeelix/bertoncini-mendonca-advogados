/**
 * Movimento da página O escritório. Os efeitos (subida, marca-d'água,
 * palavras que acendem) vêm de `cinema.ts`.
 *
 * A cena dos valores (cortina, valores trocando, escada de princípios) saiu
 * em 06/11/2026: o escritório pediu a página mais sóbria a partir dos
 * valores, com tudo visível de uma vez. Ver a seção `.valores` da página.
 */
import { ligaCinema } from './cinema';

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  void ligaCinema();
}

export {};
