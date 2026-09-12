# Plano da v2 — "Apple advocacia"

> Escrito em 11/09/2026 a partir do pedido do Gabriel: v2 do protótipo em estilo
> Apple. Fundo branco, azul só no detalhe, textura de grão sobre o azul quando
> houver azul, primeira dobra com vídeo, e o resto com mais ambição de
> interação. Código em `prototipo/v2/index.html`. A v1 fica em `prototipo/index.html`.

## O que muda em relação à v1

| | v1 | v2 |
|---|---|---|
| Tipografia | Newsreader (serif) + Archivo | Uma família só, Geist, pesos 300–600. Título em tracking negativo, como a Apple faz com SF Pro |
| Ritmo | Seções longas com diagonais | Uma ideia por tela. Títulos centralizados, corpo curto, muito branco |
| Cor | Azul em chapas grandes | Branco como base. Azul `#0B1E3F` como tinta de texto. Azul de ação `#0A5AD6` em link, botão e marcador. Cinza `#F5F5F7` em tile. Textura de grão só em duas chapas azuis |
| Superfície | Retângulo cheio | Tile com raio 28px, sombra zero, cinza claro. Vídeo dentro de moldura arredondada |
| Nav | Ilhas flutuantes | Barra fina de 48px, translúcida, centralizada, como a da Apple |
| Movimento | Reveal em cada bloco | Um momento orquestrado no hero, vídeo que encolhe com o scroll, passos que acendem conforme a leitura, tiles com inclinação leve ao mouse |

## Tokens

```
--branco   #FFFFFF   fundo
--tile     #F5F5F7   superfície secundária (cinza frio, não bege)
--tinta    #0B1E3F   texto e chapa escura (paleta oficial)
--meta     #5C6E84   texto secundário (derivado de #517493, um pouco menos saturado para leitura)
--acao     #0A5AD6   link, botão, marcador de passo. Acréscimo à paleta. Precisa de aval
--linha    #E4E7EC   divisórias
```

Raio: 980px em botão, 28px em tile grande, 18px em cartão, 12px em elemento pequeno.
Curva de movimento: `cubic-bezier(.32,.72,0,1)` (a mesma que a Apple usa em quase tudo).

## Estrutura da página

```
[nav 48px translúcida, centralizada]
[hero: vídeo cheio + título. Ao rolar, o vídeo encolhe para uma moldura arredondada]
[declaração: título grande centralizado, 2 parágrafos curtos]
[áreas: faixa horizontal de tiles, com botões prev/next, snap]
[método: 4 passos. Título fixo à esquerda, passos à direita acendem conforme a rolagem]
[sócios: dois tiles grandes lado a lado, retrato + nome + OAB]
[chapa azul com grão: frase + vídeo em moldura]
[artigos: 3 cartões]
[perguntas: título fixo à esquerda, acordeão à direita, fundo branco]
[contato: chapa azul cheia com a textura, título e botão à esquerda, dados à direita]
[rodapé: cinza claro, três colunas, linha de registro]
```

Alinhamento: título de seção centralizado; texto dentro de tile alinhado à esquerda.

## Regras que continuam valendo

- Conteúdo e ação funcionam com JS desligado. Animação é camada.
- Nada de scroll-jacking. Sticky é permitido; sequestro de rolagem não.
- `prefers-reduced-motion` desliga tudo. Efeito de mouse só em `pointer:fine`.
- Corpo a partir de 17px, contraste AA.
- Texto: registro formal, vocabulário simples, sem "a gente", sem punchline.
- OAB: sem depoimento, resultado, preço, urgência, "especialista".
- Grão só sobre azul escuro. Nunca sobre branco.

## Revisão contra o genérico

O que eu faria por padrão num pedido "site estilo Apple" e troquei:

- **Inter** como fonte. Troquei por Geist: mesma neutralidade, desenho mais próximo do SF Pro, e não é a fonte de todo template.
- **Cards idênticos em grade** para as áreas. Troquei por faixa horizontal com snap, o padrão de vitrine da própria Apple, que também resolve o "ainda não sabemos quantas áreas".
- **Eyebrow em caixa alta** acima de cada título. Fora.
- **Números 01/02/03** decorativos. Só no método, que é uma sequência real.
- **Fade-up em toda seção**. Só o hero tem sequência de entrada; o resto aparece com opacidade simples e curta, e o movimento fica concentrado no vídeo que encolhe e nos passos.

## Revisão de 11/09/2026 (noite), após o Gabriel ver a v2

- **Textura.** A receita é a da v1, sem alteração: gradiente `linear-gradient(158deg,#102A50,#0B1E3F)`
  com dois brilhos radiais (azul-acinzentado `rgba(81,116,147,.52)` no canto superior esquerdo e
  vinho `rgba(155,28,46,.32)` no inferior direito) e o grão aplicado direto, `opacity:.26`, **sem
  `mix-blend-mode`**. Na primeira v2 o grão estava em `soft-light` e sumiu. Classe `.lastro-bm`.
- **Marquee saiu.** Faixa de frases correndo lê como site de IA.
- **Perguntas, contato e rodapé refeitos.** Perguntas em duas colunas com título fixo. Contato virou
  a última chapa texturizada, em duas colunas. Rodapé em cinza claro com três colunas.
