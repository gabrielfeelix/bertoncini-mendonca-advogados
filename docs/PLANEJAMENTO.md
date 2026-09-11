# Planejamento — Site Bertoncini & Mendonça Advogados

> Documento interno. Fonte da verdade sobre o que sabemos, o que falta e em que ordem fazer.
> Atualizado em 10/09/2026. Ver também `PERGUNTAS.md` e `PESQUISA.md`.

---

## 1. O que é o projeto

Site institucional para o escritório **Bertoncini & Mendonça Advogados** — sociedade
nova entre **Juscelino Bertoncini** e **Beatriz (Bia) Mendonça**, em Maringá/PR.

O escritório está em fase de abertura: contrato social aprovado, registro na OAB pago,
CNPJ sai em setembro/2026. O site precisa estar pronto para o lançamento da operação,
junto com o Instagram do escritório (perfil ainda não criado — sai perto da saída do
Juscelino do escritório atual).

**O que o site precisa entregar:** autoridade e confiança, sem o visual genérico que
domina o setor jurídico; captação de clientes via conteúdo (blog/artigos indexados no
Google); e um canal de publicação que o próprio Juscelino opere sem depender de mim.

---

## 2. O que JÁ está resolvido

### Identidade visual (parcial)
Feita por uma parceira do escritório. Entregou **apenas logos e paleta** — não há
manual de marca, tipografia definida, nem direção de fotografia.

**Paleta oficial** (extraída do PDF de identidade):

| Cor | Hex | Papel provável |
|---|---|---|
| Azul profundo | `#0B1E3F` | Cor primária, fundos escuros |
| Azul médio | `#004369` | Apoio, elementos de destaque |
| Azul acinzentado | `#517493` | Secundária, estados intermediários |
| Cinza médio | `#AFAFAF` | Texto de apoio, bordas |
| Cinza claro | `#D9D9D9` | Divisórias, fundos sutis |
| Off-white | `#F8F7F2` | Fundo claro principal |

**Leitura da marca:** monograma "B\|" em traço fino e linear, com sobreposição das
letras. Tipografia do logotipo é uma sans geométrica de traço fino, em caixa alta com
tracking largo. A construção é elegante, minimalista e contida — **não** é o jurídico
clássico (sem serifa pesada, sem balança, sem martelo, sem dourado). Isso é uma
vantagem enorme: a marca já aponta para um território mais sofisticado que a média
do setor.

Os mockups do PDF (papelaria, carimbo de cera, placa acrílica) reforçam um
posicionamento premium e tátil.

### CMS — reaproveitável de `isabella-pires-arquitetura`
Já existe, funcionando, e cobre exatamente o que o Juscelino pediu (painel próprio,
sem plugin):

- **Stack:** Astro 7 + Supabase + TipTap (editor rico)
- **Painel** em `/painel`: login, recuperação de senha, listagem e edição de artigos
- **Migrations prontas:** artigos, permissões (RLS), dimensões de capa, tempo de leitura
- **Tools:** importação de artigos, migração Supabase, otimização de imagens
- **Deploy:** Vercel (`@astrojs/vercel`), com sitemap e MDX já configurados

Reaproveitamento estimado: alto. O que muda é identidade visual, taxonomia de
conteúdo (categorias jurídicas em vez de arquitetura) e campos específicos (área do
direito, autor — são dois sócios publicando).

### Situação societária e operacional
- Contrato social aprovado, registro OAB pago, **CNPJ sai em setembro/2026**
- Contabilidade contratada (com parceria OAB, valor reduzido)
- Handle do Instagram reservado, perfil ainda não criado
- **Ensaio fotográfico profissional agendado** — o irmão da Bia é fotógrafo
- Produção de vídeo encaminhada (roteiro + edição, com terceiro)
- Juscelino já está **escrevendo artigos** para ter conteúdo no lançamento

---

## 3. O que o cliente já sinalizou (tratar como requisito, não como pergunta)

Extraído dos áudios e mensagens de 10/09. São direções que ele já deu — perguntar de
novo seria desperdiçar a boa vontade dele.

**Direção de marca e tom**
- Quer **sofisticado e elegante, mas com proximidade**. Não frio, não distante.
- **Linguagem acessível é pilar.** Palavras dele: "advogado que vai tentar explicar
  uma coisa e só complica tudo". Ele já está escrevendo os artigos com esse cuidado.
- Quer equilibrar: acessível na explicação, **técnico o suficiente para ter autoridade**,
  apresentado de forma elegante.

**Pessoalidade como diferencial estratégico**
- Raciocínio dele: advocacia é serviço de confiança; ninguém segue perfil de escritório
  como segue Adidas ou Magazine Luiza. O que faz o cliente escolher é **ver a pessoa**.
- Por isso vão postar sempre em colaboração entre perfil do escritório e perfis pessoais.
- **Implicação para o site:** a página "Sobre" não pode ser bio genérica. Precisa de
  história real, foto real, personalidade. Ele gostou muito da ideia de trazer partes
  da história de vida dele e da Bia.

**Blog como motor de captação — ele já entendeu o funil**
- Palavras dele: a pessoa busca no Google, acha o artigo, vê que ele domina o assunto,
  e eventualmente entra em contato para contratar.
- Ele hesitou no nome "blog" ("me senti velho falando blogue"). **Sugestão:** chamar de
  *Artigos* ou *Conteúdo*.

**Valores como filtro de causas — o ativo de posicionamento mais forte**
- Ele não aceita causa que fira os princípios dele: exemplo que deu foi planejamento
  sucessório para excluir filho por ser gay; e qualquer coisa envolvendo homofobia,
  machismo ou racismo.
- Reconhece que no começo vai precisar pegar o que chegar, mas há linhas que não cruza
  mesmo precisando do dinheiro.
- Ele disse: **"nunca tinha parado pra pensar que isso poderia estar no site"**, e
  reagiu muito bem à ideia de ser um escritório que preza por igualdade e respeito.
- **Status:** decisão deles, está no questionário (bloco 3). Não assumir sem confirmação
  — é escolha de posicionamento com consequências comerciais reais, tem que partir deles.

**Referência que ele mandou — e a crítica dele**
- `https://thayrinemedeiro.app/` — site de advogada criminalista, feito pelo irmão dela.
- Reação dele: achou bonito, **mas "muito cara de IA"**. Reconhece que a maior parte dos
  sites está assim hoje.
- Ele fez uma analogia precisa: assim como em texto dá pra evitar os vícios de escrita
  de IA, dá pra evitar os vícios visuais. E ligou isso a ter **design system próprio
  com a identidade visual** — tipografia certa, menos "cara de template".
- **Isso é literalmente o pedido central do projeto.** Tratar como critério de aceite.

**LGPD e jurídico do site**
- O Juscelino **redige** política de privacidade e aviso de cookies (é a área dele,
  trabalha com compliance). Não precisamos escrever.
- **Nós implementamos** o banner de cookies com as três opções: aceitar todos,
  apenas necessários, rejeitar.
- Ele declarou que não sabe a parte operacional disso no site — é nossa.

**Negócio**
- Juscelino vai atuar bastante em **Direito de Família**. Demais áreas a confirmar.
- Regra societária que estão definindo: toda demanda precisa de acordo dos dois sócios,
  e recusa precisa ser fundamentada.

---

## 4. Lacunas conhecidas — o que falta

### Do cliente (ele já prometeu enviar)
- [ ] **Missão e valores** — vai mandar por texto
- [ ] **História do Juscelino** — quais partes da vida fazem sentido no site
- [ ] **História da Bia** — ela manda separado (áudio ou texto)
- [ ] **Arquivo do marketing** — o briefing que preencheram para a amiga da Bia, com
      público-alvo, tom de voz e imagem pretendida. **Pode responder boa parte do
      questionário** — conferir antes de cobrar respostas repetidas.
- [ ] **Compilado de sites de inspiração** — ele vai reunir referências de advocacia
      que achar interessantes
- [ ] Contato da Bia (ele vai intermediar)

### Da identidade visual — lacunas técnicas reais
- [ ] **Não há arquivo vetorial.** Os 15 arquivos entregues são PNG 1080×1350 (formato
      de post de Instagram), não arquivos de marca. **Precisamos de SVG/AI/EPS** da
      parceira, ou vetorizar a partir do PDF.
- [ ] **Não há PNG do logo recortado** com fundo transparente e margem correta
- [ ] **Tipografia não definida** — o logotipo usa uma sans geométrica fina, mas não
      há fonte institucional para textos, títulos e corpo
- [ ] **Sem manual de marca** — sem regras de uso, área de respiro, tamanho mínimo,
      usos proibidos, versões monocromáticas
- [ ] **Sem direção de fotografia** — o ensaio precisa de direção ANTES. A pesquisa
      já apontou o caminho (candid em ambiente, luz natural — ver PESQUISA.md §3)
- [ ] **Sem tom de voz documentado**
- [ ] Sem definição de papel de cada cor da paleta (qual é primária de ação, qual é
      fundo, contraste em texto)

### Nossa
- [x] ~~Pesquisa de referências~~ — feita, em `PESQUISA.md`
- [ ] Definição de domínio
- [ ] Arquitetura de informação do site
- [x] ~~Onde hospedar o questionário~~ — feito, ver seção 6

---

## 5. Ordem de execução

### Fase 0 — Preparação (AGORA, sem depender do cliente)
1. ✅ Organizar repositório e catalogar identidade visual
2. ✅ Escrever este planejamento
3. ✅ Escrever `PERGUNTAS.md` — conteúdo do questionário
4. ✅ Pesquisa de referências — ver `PESQUISA.md`
5. ✅ Construir o formulário em `gabrielfelix-ux.4yu.com.br/briefing/bertoncini-mendonca`
6. [ ] Gabriel revisar o formulário e fazer deploy
7. [ ] Enviar o link ao Juscelino e à Bia
8. [ ] Pedir à parceira os arquivos vetoriais do logo
9. [ ] **Direção de fotografia** — mandar antes do ensaio, independente das respostas

### Fase 1 — Descoberta (depende do cliente responder)
10. [ ] Receber respostas dos dois sócios
11. [ ] Receber o arquivo do marketing + missão/valores + histórias
12. [ ] Escrever `ESCOPO.md` visual — refazer o artifact com UI melhor
      *(o primeiro ficou com tom de frase de efeito; engavetado)*

### Fase 2 — Estratégia e marca
11. [ ] Consolidar `BRIEFING.md` — respostas + pesquisa + decisões
12. [ ] Definir tipografia institucional
13. [ ] Definir tom de voz
14. [ ] **Direção de fotografia — prioridade alta**, o ensaio depende disso
15. [ ] Manual de marca (documentar em .md, depois materializar visualmente)
16. [ ] Arquitetura de informação e mapa do site

### Fase 3 — Design
17. [ ] Design system (tokens, tipografia, espaçamento, componentes)
18. [ ] Wireframes / estrutura das páginas
19. [ ] UI — desktop e mobile
20. [ ] Validação com os sócios

### Fase 4 — Construção
21. [ ] Setup do projeto (Astro, a partir da base do CMS)
22. [ ] Adaptar CMS: identidade, taxonomia jurídica, dois autores
23. [ ] Supabase — projeto novo, migrations adaptadas
24. [ ] Desenvolvimento das páginas
25. [ ] Banner de cookies + páginas legais (texto vem do Juscelino)
26. [ ] SEO técnico: metadados, sitemap, dados estruturados, Open Graph
27. [ ] Performance e acessibilidade

### Fase 5 — Lançamento
28. [ ] Domínio e DNS
29. [ ] Deploy Vercel
30. [ ] GA4 + Clarity + Search Console
31. [ ] Google Meu Negócio
32. [ ] Treinar o Juscelino no painel de publicação
33. [ ] Publicação dos primeiros artigos

---

## 6. Decisões tomadas

| Decisão | Escolha | Razão |
|---|---|---|
| Questionário antes do briefing | Sim | O briefing consolidado precisa das respostas para existir |
| Escopo visual antes das respostas | Sim | Não depende do cliente, e ele precisa ver o tamanho do trabalho antes de falarem em valores |
| Onde hospedar o questionário | Rota no portfólio: `gabrielfelix-ux.4yu.com.br/briefing/bertoncini-mendonca` | URL profissional na marca do Gabriel. Subdomínio foi descartado — criar infra nova para um entregável só não se justifica. Implementado como HTML estático em `briefing/`, servido antes do rewrite catch-all: não toca na SPA, não entra no sitemap, tem `noindex` |
| Formato do escopo visual | Artifact, **mas depois das respostas** | A primeira versão ficou com tom de frase de efeito e foi engavetada. O briefing consolidado só faz sentido depois do questionário respondido |
| Extensão do questionário | Completo e aprofundado, organizado em blocos | Decisão do Gabriel. Blocos com tempo estimado para poderem responder em sessões |
| Stack do site | Astro + Supabase + Vercel | Reaproveita o CMS existente, deploy gratuito, performance alta (bom para SEO) |
| Posicionamento de valores explícito | **Em aberto** — perguntado no bloco 3 | Decisão de negócio com consequência comercial; tem que partir dos sócios |
| Nome da seção de conteúdo | Sugerir "Artigos" | Ele mesmo estranhou a palavra "blog" |

---

## 7. Riscos e atenções

**Publicidade advocatícia tem regra, e ela é mais dura que o esperado.** Pesquisa
completa em `PESQUISA.md` §1. Os impactos diretos no design: proibido depoimento de
cliente, casos de sucesso, número de processos, "consulta gratuita", "especialista"
sem título, e qualquer CTA com urgência. É **obrigatório** exibir número da OAB de cada
advogado e o registro da sociedade. Confirmar tudo com o Juscelino no bloco 9.

**O ensaio fotográfico pode acontecer antes da direção de arte.** Se rolar sem briefing
visual, perdemos fotos que conversem com o site. A pesquisa já deu a direção (candid,
luz natural, ambiente real — `PESQUISA.md` §3), então dá para mandar **antes** das
respostas chegarem. **Alinhar a data do ensaio na próxima conversa.**

**Ausência de vetor trava o design.** Sem SVG, o logo não escala bem, não vira favicon
decente e limita animação. Pedir à parceira o quanto antes.

**Dois sócios, duas opiniões.** A Bia ainda não entrou na conversa. Quanto mais tarde
ela entrar, maior o risco de retrabalho. Vale incluí-la desde o questionário.

**Prazo amarrado à saída dele do escritório atual.** O site, o Instagram e a saída
estão acoplados. Confirmar a data no questionário (bloco 8).
