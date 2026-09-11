# Decisões de design

Registro append-only: o que foi decidido, quando, e por quê. Entrada nova vai no
topo. Decisão revogada não é apagada — é marcada como revogada, com a data.

---

## 11/09/2026 (tarde) — A textura é a personalidade do site

Decisão do Gabriel ao revisar o segundo protótipo: **a textura granulada aplicada
sobre o azul é o elemento de identidade do site** e vai se repetir em vários
momentos. Não é enfeite de uma seção, é assinatura.

### O que é, tecnicamente

Ruído gerado em SVG, sem imagem e sem arquivo externo:

```html
<filter id="grao">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>
```

Aplicado como `filter:url(#grao)` numa camada sobreposta ao gradiente azul, com
opacidade entre `.22` e `.42` conforme o fundo. Custo zero de rede, escala em
qualquer tela, e não pixela como textura em PNG.

### Onde já está em uso

- Seção de áreas de atuação, sobre o gradiente azul (`opacity:.26`)
- Hero, sobre o vídeo (`opacity:.22`)
- Barra de navegação no estado preso (`opacity:.42`, com `mix-blend-mode:overlay`)

### Regra de uso

Textura só sobre superfície azul escura. Em fundo branco ela suja a leitura, que
foi exatamente a crítica que matou o off-white `#F8F7F2`. Sobre branco, o
contraste vem do vazio, não da textura.

### Decorrência

O off-white `#F8F7F2` da paleta oficial **sai do site**. A crítica foi que lê como
bege encardido ao lado do branco puro. Contraste do site passa a ser branco contra
chapa azul texturizada, sem meio-termo. A paleta oficial continua válida no
material impresso; esta decisão vale para a web.

---

## 11/09/2026 (tarde) — Registro de linguagem

O site fala em primeira pessoa do plural, sem gíria e sem informalidade forçada.
"A gente" foi removido de todo o texto: um escritório de advocacia escrevendo
"o que a gente faz" perde a autoridade que o resto do design constrói.

A régua: **formal no registro, simples no vocabulário.** Nem juridiquês, nem
conversa de rede social. "Áreas de atuação", não "O que a gente faz".
"As perguntas que mais recebemos", não "Perguntas que a gente ouve sempre".
"Explicamos antes de agir", não "a gente explica".

---

## 11/09/2026 — Direção de design definida pelo Gabriel

Fonte: mensagem do Gabriel após a leitura das referências do Juscelino
(`docs/REFERENCIAS-CLIENTE.md`) e dos 10 clones em `refs/`.

### O que foi decidido

**1. Fundo branco. Azul só onde importa.**
A paleta oficial (`docs/PLANEJAMENTO.md` §2) é azul: `#0B1E3F`, `#004369`,
`#517493`, mais os cinzas `#AFAFAF`/`#D9D9D9` e o off-white `#F8F7F2`. A decisão
é usar **branco como base**, não o off-white, e reservar o azul profundo para os
pontos de ação e de ancoragem. Isso fecha parcialmente a lacuna registrada em
`PLANEJAMENTO.md:160` ("sem definição de papel de cada cor").

Papéis propostos a partir dessa decisão:

| Cor | Papel |
|---|---|
| `#FFFFFF` | Fundo padrão de toda a página |
| `#F8F7F2` | Faixa alternada, para separar seção sem usar borda |
| `#0B1E3F` | CTA, links, marcador de seção, uma faixa cheia por página |
| `#004369` | Estado de hover e apoio ao primário |
| `#517493` | Texto secundário, legendas, metadados |
| `#AFAFAF` / `#D9D9D9` | Bordas e divisórias apenas |

**Efeito colateral favorável:** azul sobre branco não colide com os dois
concorrentes de Maringá — Oliveira Pitta é creme com vinho, Medina é vinho. O
alerta de território registrado em `REFERENCIAS-CLIENTE.md` fica resolvido.

**2. "Apple advocacia" — premium, mas nunca à custa da usabilidade.**
O público é dona Euzira, dona Cláudia, senhor José. Cinematográfico demais é
**defeito**, não qualidade. Simples demais também é defeito. A régua:

> Efeito nenhum pode carregar informação nem bloquear acesso. Animação é camada
> decorativa; conteúdo e ação funcionam sem ela.

Consequências práticas:
- A página tem que ser legível e clicável com o JS desligado e sem animação
  nenhuma. Progressive enhancement, não dependência.
- **Nada de scroll-jacking**, narrativa em rolagem horizontal, ou seção que só
  revela conteúdo depois de animar. É onde site cinematográfico quebra para
  usuário mais velho.
- `prefers-reduced-motion: reduce` desliga todo movimento.
- Corpo de texto a partir de 18px, contraste alto, alvo de toque generoso.

**3. Variação vem de ritmo e imagem, não de quantidade de widget.**
O pedido é "muita variabilidade de elementos e componentes". O caminho que
entrega isso sem virar colcha de retalhos: um conjunto fechado de arquétipos de
seção (na casa de oito), todos construídos com os mesmos tokens de cor, tipo e
espaçamento, alternados ao longo da página. **Layout varia; tipografia, cor e
espaçamento não.** É assim que a Apple parece variada usando pouquíssimos
componentes — a variedade está na escala da imagem e no ritmo, não no número de
peças diferentes.

**4. Seções na diagonal.**
Faixas cortadas na diagonal em vez de só retângulos empilhados. Implementação por
`clip-path` na faixa, com o texto dentro de um contêiner reto — assim a diagonal
não desalinha as linhas nem encurta medida de leitura. Regra: a diagonal nunca
corta texto, botão ou rosto em foto.

**5. Foto dos sócios tratada com intenção, inclusive na marca.**
Vídeo e fotografia dos dois como matéria-prima principal, e uso criativo da foto
deles junto à logo.

### Dependências que isso cria

1. **Logo vetorial — bloqueador.** Só existem 15 PNGs de 1080×1350 (tamanho de
   post de Instagram). Não dá para fazer tratamento premium de marca, nem
   composição de logo com foto, sem arquivo vetorial. É o primeiro pedido a
   fazer à designer da identidade.
2. **Composição de foto com a logo altera a marca.** A identidade foi feita por
   uma parceira do escritório. Alterar o lockup precisa de aval — dela e dos
   sócios.
3. **Vídeo não existe ainda.** O ensaio previsto com o irmão da Bia era de foto.
   Se entra vídeo, o roteiro precisa ser definido antes do ensaio: b-roll de
   ambiente, mãos, cidade, os dois conversando em movimento — a estratégia B da
   `docs/PESQUISA.md` §3 (candid, luz natural), nunca retrato parado de braços
   cruzados.
4. **A paleta é fria de ponta a ponta.** Três azuis e dois cinzas, sem nenhum tom
   quente além do off-white. "Premium e acolhedor ao mesmo tempo" vai depender de
   fotografia quente e de uso generoso do branco, ou de um acento quente novo —
   que seria acréscimo à identidade e precisa de aval.
5. **Tipografia ainda não existe** na identidade. Direção: display serifado de
   alto contraste nos títulos com grotesca neutra no corpo, self-hosted em woff2.
   Fora de cogitação: Playfair Display e Montserrat — são as fontes de template
   mais usadas da web (ver `docs/REFERENCIAS.md`, fichas de Kirkland e BMA).

### Correção de premissa anterior

As referências do Juscelino usam só AOS, Swiper e Slick, e eu havia concluído que
GSAP ficaria acima do gosto dele. **Está errado:** o conceito que ele declarou
favorito (Neural Atlas, no Dribbble) usa GSAP. GSAP está liberado — desde que
respeite a régua do item 2.
