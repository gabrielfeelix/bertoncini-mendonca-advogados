# Decisões tomadas durante a execução do protótipo

Registro das decisões que o agente executor tomou no lugar do Gabriel enquanto
executava `docs/PLANO-HOMEPAGE.md` (12/09/2026, commits `177a84f..baf5c85`).

Cada uma foi tomada porque parar para perguntar custaria mais que errar e
corrigir. Se alguma estiver errada, o conserto é barato e está descrito.

---

## 1. Executar direto na `main`, sem worktree

O plano manda commitar na `main`. O processo de execução pedia branch isolada.
Perguntei ao Gabriel, que escolheu `main`. Sem push, sem deploy.

## 2. As falhas pré-existentes do protótipo têm dono

Na primeira execução do verificador apareceram três falhas que não eram da
tarefa 1: vídeo em autoplay sob reduced-motion, e dois alvos de toque abaixo de
44px. Roteei cada uma para a tarefa que já mexia naquele código (8, 9 e 11) em
vez de consertar fora de lugar. Todas fechadas.

## 3. O piso de opacidade do reveal subiu de 22% para 62%

**A decisão que mais contraria o plano.** O plano mandava as palavras da
declaração começarem em 22% de opacidade. A revisão mediu que, com a janela de
rolagem maior que a seção, quem parasse de rolar no meio deixava o texto travado
ilegível por tempo indefinido.

A direção de design diz que o público tem 70 anos e que "cinematográfico demais é
defeito". Subi o piso para 62%, que dá contraste de 4.76:1 e passa AA de texto
normal, e encurtei a janela para terminar dentro da seção. O efeito continua; só
deixou de ser hostil.

**Se o Gabriel quiser mais drama no efeito**, é um número: `.js [data-palavras] .w`
em `prototipo/index.html`. Mas abaixo de 62% o contraste deixa de passar AA.

## 4. Um alvo de toque foi corrigido fora da tarefa dele

Eu disse ao implementador da tarefa 9 que os alvos `(44) 0000 0000` e
`contato@exemplo.adv.br` eram do rodapé antigo. Estava errado: vivem em
`#contato`. Ele descobriu, corrigiu no lugar certo e declarou o desvio. Mantive.

## 5. O handler de âncora ignora `href="#"`

As tarefas 9 e 10 introduzem links placeholder com `href="#"`. O handler do Lenis
chamava `document.querySelector("#")`, que lança `SyntaxError` e derruba o script.
Previsto na varredura de conflitos e corrigido na tarefa 9.

## 6. O link de pular passou a mover o foco

A revisão da tarefa 11 encontrou que o link "Pular para o conteúdo" rolava a tela
sem mover o foco do teclado, porque o `preventDefault()` do Lenis mata o
comportamento nativo. Para quem usa teclado ou leitor de tela, o link não pulava
nada. O caminho sem Lenis também estava quebrado. Os dois foram corrigidos.

**O verificador dizia `OK` porque mede geometria, não foco.**

## 7. O vídeo da faixa foi comprimido a CRF 34

O plano sugeria CRF 28. A 28 e a 32 o arquivo continuava acima da meta de 2 MB do
próprio plano. Conferi os quadros extraídos: a faixa é textura de tinta de alto
contraste, o pior caso para compressão, e o resultado é indistinguível do
original no tamanho de exibição. Os originais estão preservados fora do
repositório; o comando é determinístico e regenerável.

## 8. Um commit saiu com linha de coautor divergente

16 dos 21 commits terminam com `Co-Authored-By: Claude Fable 5.1`; o commit
`0963985` saiu com outro nome de modelo. Não reescrevi o histórico para
uniformizar: o custo é cosmético e reescrever quebraria os hashes já registrados
nos relatórios.

---

## Achados conhecidos que não foram consertados

Decididos como aceitáveis para ir ao cliente, pela revisão final do conjunto.

| O quê | Por que fica |
|---|---|
| A exceção de CORS em `tools/verifica.mjs` encadeia por adjacência de evento, não por identidade do recurso | Risco só no harness de teste, nunca no site. Amarrar à URL quando houver mais assets locais |
| `z-index:4` do botão de pausa vence o `.env` do hero por ordem de DOM | Testado com clique real. `isolation:isolate` seria mais robusto; fica para o Astro |
| No celular, o aviso de cookies cobre parte do hero até a pessoa decidir | Inerente ao banner não-modal que o plano pediu. Nada fica bloqueado |
| Os dois ramos do handler de âncora repetem o mesmo `forEach` | Duplicação de leitura, não bug. Os dois foram testados |
| A verificação de acessibilidade foi programática, sem leitor de tela real | **Fazer teste manual com NVDA ou VoiceOver antes de publicar.** O defeito do link de pular é o tipo de coisa que só aparece usando |
