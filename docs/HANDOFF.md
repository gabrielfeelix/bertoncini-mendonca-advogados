# Handoff — 10/09/2026

> Para o próximo agente. Lê este arquivo primeiro, depois os quatro que ele aponta.
> Estado: **planejamento e descoberta. Nada de site ainda.**

---

## Em uma frase

Site institucional para o escritório de advocacia **Bertoncini & Mendonça** (Maringá/PR),
que está nascendo. O cliente é amigo do Gabriel. A fase atual é **entender** — o
questionário de briefing está pronto e publicado, esperando resposta.

---

## Leia nesta ordem

| Arquivo | O que tem |
|---|---|
| **`CONTEXTO-CLIENTE.md`** | Quem são, acordo comercial em aberto, o que o cliente pensa sobre marca, **e como o Gabriel trabalha** (§6 — leia antes de escrever qualquer texto) |
| **`PLANEJAMENTO.md`** | Estado do projeto, paleta oficial, CMS reaproveitável, lacunas, 33 passos em 6 fases, riscos |
| **`PESQUISA.md`** | Regras da OAB, padrões do setor BR, referências internacionais, dados de conversão |
| **`REFERENCIAS.md`** | Ficha individual de 36 sites: abas do menu, paleta com hex, tipografia, crítica |
| **`PERGUNTAS.md`** | Conteúdo do questionário (o formulário web é a versão viva) |
| `ESCOPO.md` | As 7 frentes de trabalho, sem valores |

---

## O que está pronto

**Documentação** — cinco arquivos em `docs/`, cobrindo tudo que foi conversado.

**Material de marca organizado** — `marca/identidade-visual.pdf`, `marca/CMYK.pdf` e
15 PNGs em `marca/logos/`.

**Pesquisa** — 4 agentes em paralelo, ~60 sites, consolidada em `PESQUISA.md`.

**Formulário de briefing** — página web publicada no portfólio do Gabriel:

```
/home/gabfelix/dev/portfolio/briefing/bertoncini-mendonca/index.html
→ gabrielfelix-ux.4yu.com.br/briefing/bertoncini-mendonca
```

9 blocos, ~75 perguntas priorizadas (essencial / importante / complementar / talvez já
respondida). Salva sozinho no navegador, barra de progresso, índice, exporta `.txt` ou
copia. Usa a identidade do Gabriel de verdade: Switzer + Geist Mono servidas de
`/volume/fonts/v2/`, tokens e escala do `tokens.css` do portfólio, vermelho `#E4231B`
só como grafismo. Tem um avião de papel que desce a lateral conforme a leitura avança.

**Como foi encaixado sem risco:** HTML estático puro, servido pelo caminho real — e
arquivos estáticos são resolvidos **antes** do rewrite catch-all do `vercel.json` que
manda todo o resto para `rota.html`. Não toca na SPA React, não entra no sitemap, tem
`noindex`. A única mudança em código do portfólio foram 3 linhas em `build.mjs`
sincronizando a pasta `briefing/` em `copyAssets()`.

---

## ⚠ Estado do repositório do portfólio

**Nada foi commitado nem publicado.** Em `/home/gabfelix/dev/portfolio`, na branch
`main`:

```
 M build.mjs      (3 linhas, sincroniza briefing/)
?? briefing/      (a página nova)
```

O build roda e passa. **O Gabriel vai revisar antes de decidir o deploy.** Não commite
nem publique sem ele pedir.

Havia um servidor local em background na porta 4600 servindo `dist/`
(`_servir-briefing.mjs`, na raiz do portfólio, **não versionado — apagar quando não
precisar mais**). Pode ter morrido junto com a sessão; para subir de novo:
`cd /home/gabfelix/dev/portfolio && node _servir-briefing.mjs`

---

## As cinco coisas que mais importam

### 1. "Sem cara de IA" é o critério de aceite, não um detalhe

É pedido do Gabriel **e** do cliente, que chegou nisso sozinho olhando um site de
advogada feito por outra pessoa. Ele articulou bem: assim como em texto dá pra tirar os
vícios de escrita da IA, dá pra tirar os visuais — e ligou isso a ter design system
próprio derivado da identidade real.

O primeiro artifact de escopo que eu fiz **foi reprovado exatamente por isso** — ficou
com tom de "frase de efeito" e "militância". Está engavetado. `CONTEXTO-CLIENTE.md` §6
explica a régua de voz do Gabriel, que vem do `VOZ.md` do portfólio dele. **Leia antes
de escrever.**

### 2. A OAB restringe o design, e mais do que parece

Provimento 205/2021. Proibido: depoimento de cliente, caso de sucesso, número de
processos, "consulta gratuita", "especialista" sem título certificado, qualquer CTA com
urgência, promessa de resultado. **Obrigatório:** número da OAB de cada advogado e o
registro da sociedade no site.

Detalhamento com citação de artigo em `PESQUISA.md` §1. O bloco 9 do questionário pede
a leitura do Juscelino, que é a fonte melhor que a nossa — ele trabalha com compliance.

### 3. O ensaio fotográfico é a coisa mais irreversível do projeto

O irmão da Bia vai fotografar. **Data não definida.** Se acontecer sem direção, as fotos
não servem e refazer ensaio é caro.

A pesquisa já respondeu o que fazer (`PESQUISA.md` §3): nenhum site de advocacia premiado
usa banco de imagens nem retrato formal de braços cruzados. Os bons usam candid em
ambiente real, luz natural, pessoa em movimento.

**Isso não depende de resposta nenhuma.** Dá pra escrever e mandar já. O Gabriel foi
oferecido e ainda não respondeu.

### 4. A Bia está fora da conversa

Sócia com poder de decisão, nunca falou com o Gabriel. O Juscelino ficou de intermediar.
Quanto mais tarde ela entrar, maior o retrabalho.

### 5. O acordo comercial está em aberto

Pagamento diferido (quando entrar cliente), permissão para divulgar nos grupos de
advogados dos dois, e a disposição declarada dele de "ajudar financeiramente como
puder". **Nenhum respondido pelo Gabriel.** Detalhes em `CONTEXTO-CLIENTE.md` §2.

Decisão tomada: o escopo visual sai **sem valores**, para mostrar o tamanho do trabalho
antes de a conversa chegar em preço.

---

## Próximos passos, em ordem

1. **Gabriel revisa o formulário** e decide o deploy *(aguardando ele)*
2. **Enviar o link** ao Juscelino e à Bia
3. **Direção de fotografia** — pode escrever agora, não depende de resposta
4. **Pedir o logo em vetor** — os PNGs atuais são 1080×1350, tamanho de post; não servem
   para web nem impressão
5. Esperar as respostas + o arquivo do marketing
6. Só então: `BRIEFING.md` consolidado, e refazer o escopo visual com UI melhor

Depois disso: tipografia, tom de voz, manual de marca, arquitetura de informação, design
system, UI, e só aí código. Sequência completa em `PLANEJAMENTO.md` §5.

---

## Coisas que economizam tempo

**O CMS já existe.** `/home/gabfelix/dev/isabella-pires-arquitetura` — Astro 7 + Supabase
+ TipTap, com painel em `/painel` (login, recuperação de senha, editor rico), migrations
de artigos/permissões/capa/tempo-de-leitura, e tools de importação. Reaproveitamento
alto. Muda identidade, taxonomia (áreas do direito) e passa a ter dois autores.

**A paleta oficial já foi extraída** do PDF: `#0B1E3F`, `#004369`, `#517493`, `#AFAFAF`,
`#D9D9D9`, `#F8F7F2`. Está em `PLANEJAMENTO.md` §2.

**O Gabriel tem infra 4YU** com segredos, service account do Google (GTM, GA4, Firebase,
Search Console), Vercel e Supabase. Ver `/home/gabfelix/dev/4yu-apps/CLAUDE.md`.

**Ele pede subagentes em paralelo** para pesquisa, e aceita Sonnet. Foi assim que
`PESQUISA.md` foi feito.

---

## Onde eu erraria de novo se não tivesse anotado

- Escrever texto com punchline no fim de parágrafo. Ele reprova.
- Responder longo demais. Ele reclamou explicitamente.
- Propor infraestrutura nova (subdomínio, projeto separado) sem necessidade real. Ele
  rejeitou com força.
- Mandar `.md` para ele ler na IDE. Prefere ver publicado.
- Assumir o posicionamento de valores (recusa de causas discriminatórias) como decidido.
  **Está em aberto, é decisão dos sócios**, e tem consequência comercial nos dois sentidos.
