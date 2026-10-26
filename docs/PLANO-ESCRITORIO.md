# Plano — página O escritório, versão cinematográfica (26/10/2026)

Referência principal: quadro-template.framer.website/about. Secundárias:
as cores e componentes de green-volt.framer.website/service e as linhas
assentando no fim de architectro.framer.website/about. A mecânica medida de
cada efeito está em `docs/refs/REFERENCIAS-ESCRITORIO.md`.

Regras que continuam valendo: marca (marinho, Archivo + Newsreader), sem
cor sobre foto (só vinheta preta de contraste), sem promessa de resultado
nem depoimento (Provimento 205/2021), `prefers-reduced-motion` desliga tudo
e deixa o conteúdo legível.

**Tipografia nova:** Archivo 800 (baixada, OFL) para os títulos em caixa
alta, como o Figtree 900 da Quadro. Uma palavra de destaque por título, em
azul médio `#2A62AD` (no lugar do coral). Marca-d'água em azul-gelo
`#EAF0F6`.

## Seções, de cima para baixo

1. **Abertura.** Pílula "O escritório" e um H1 em caixa alta de 2 linhas,
   com destaque em uma palavra. Parágrafo curto. Entra com subida suave.
2. **Marca-d'água.** "BERTONCINI & MENDONÇA /" em ~22vw azul-gelo, atrás
   da abertura e do manifesto, andando para o lado com a rolagem
   (x ≈ −0,43 × scroll).
3. **Manifesto.** A missão em bloco grande, caixa alta e Archivo 800, com
   as palavras escurecendo uma a uma, presas à rolagem. Dois parágrafos
   embaixo, com fade.
4. **Os sócios.** Um bloco por sócio, no padrão "Meet Clara": texto de um
   lado (rótulo, título em duas cores, bio, "por que o Direito" com filete
   vertical) e foto sticky do outro, com duas folhas inclinadas atrás. O
   lado alterna entre Juscelino e Beatriz. Formação em lista.
5. **A história.** As 3 etapas (UEM → o mesmo escritório → a sociedade) em
   3 colunas com filete vertical, sobre a marca-d'água "A HISTÓRIA". As
   colunas sobem e aparecem em sequência.
6. **Números.** 4+ anos de prática, 2 sócios, 2 áreas, 7 títulos de
   formação, com contagem que rola ao entrar. São só fatos, nada de
   resultado.
7. **A cena (o efeito principal).** Uma camada de tela cheia com a foto dos
   sócios, revelada por uma cortina (`clip-path` de baixo para cima). Ela
   fica parada enquanto os 3 valores fundamentais (Respeito, Igualdade,
   Dignidade) passam um de cada vez, em caixa alta grande, com as palavras
   se acendendo e o filete vertical. Na mesma camada entram os 6
   princípios de atuação em 3 colunas em escada, que se alinham com a
   rolagem. A saída é feita em 6 faixas verticais que recolhem em
   sequência.
8. **Registro.** O título cresce de 1,6 para 1 com as letras subindo pela
   máscara, seguido da ficha de registro da sociedade.
9. **Contato.** O componente atual.

## Execução

- `src/pages/escritorio.astro`: markup e estilos novos, com o mesmo
  conteúdo de antes.
- `src/scripts/escritorio.ts`: GSAP + ScrollTrigger (já estão no projeto,
  ligados ao Lenis), carregado só nesta página. Gatilhos sempre em
  wrappers que não são sticky (o ScrollTrigger mede mal elementos sticky,
  como vimos na pilha dos sócios).
- Revisão no Playwright, em 1440 e em 390 de largura, quadro a quadro na
  cena principal.
