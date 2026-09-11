# Referências — 36 sites de advocacia, um a um

Levantamento de sites de escritórios de advocacia com ficha individual: abas do
menu, paleta, tipografia, fotografia, padrão de apresentação, o que funciona e o
que não funciona. Complementa a `docs/PESQUISA.md`, que traz o panorama e as
regras da OAB; aqui o recorte é por link, para consulta durante o design.

**Data do levantamento:** 11 de setembro de 2026.

**Como foi feito.** Leitura programática do HTML e do CSS de cada site, com
extração de hex de cor e de famílias de fonte direto do código quando disponível.
Cinco sites bloquearam ou falharam — Mattos Filho, Cescon Barrieu e Wachtell por
Cloudflare (403), Wilson Sonsini por redirecionamento bloqueado, e Minerva
Advocaten por certificado SSL vencido. Esses estão marcados e não recebem
julgamento visual.

**Limite honesto desta pesquisa.** Não houve inspeção visual em navegador. As
observações de cor e tipografia vêm do código; as de layout, da estrutura do
HTML. Antes de fechar direção de design, vale abrir no navegador os que
interessarem — em especial os cinco bloqueados.

---

## Panorama das abas

| # | Escritório | Nº de abas | Primeira aba |
|---|---|---|---|
| 1 | Mattos Filho | ~7 (inferido) | Áreas de Atuação |
| 2 | Pinheiro Neto | 12 | Home |
| 3 | Machado Meyer | 6 | Quem Somos |
| 4 | TozziniFreire | 8 | Quem somos |
| 5 | Lefosse | 5 | Expertises |
| 6 | Demarest | 4 | Sobre nós |
| 7 | Cescon Barrieu | ~5 (inferido) | Sobre nós |
| 8 | Souto Correa | 6 | Sobre nós |
| 9 | Trench Rossi | 10 | O Escritório |
| 10 | Veirano | 7 | Home |
| 11 | BMA | 8 | Sobre o BMA |
| 12 | Stocche Forbes | 3 | **Pessoas & Cultura** |
| 13 | Slaughter and May | 5 | **People** |
| 14 | Freshfields | 9 | **Find a Lawyer** |
| 15 | Clifford Chance | 9 | **People & places** |
| 16 | Linklaters | 5 | **Find a Lawyer** |
| 17 | A&O Shearman | 6 | Home Page |
| 18 | Macfarlanes | 5 | **Our people** |
| 19 | Wachtell Lipton | n/d | n/d |
| 20 | Cravath | 4 | Practices |
| 21 | Sullivan & Cromwell | 6 | **Lawyers** |
| 22 | Paul Weiss | 9 | **Lawyers** |
| 23 | Latham & Watkins | 5 | **People** |
| 24 | Kirkland & Ellis | 7 | **Lawyers** |
| 25 | Cooley | 7 | About |
| 26 | Gunderson Dettmer | 7 | **People** |
| 27 | Goodwin | 8 | Expertise |
| 28 | Wilson Sonsini | n/d | n/d |
| 29 | Orrick | 6 | **People** |
| 30 | Fenwick | 6 | Services |
| 31 | Bersay | 6 | Le cabinet |
| 32 | Kanzlei am Kai | 0 — página única | — |
| 33 | Kümmerlein | 7 | Expertise |
| 34 | Minerva Advocaten | n/d | n/d |
| 35 | Walder Wyss | 7 | **Lawyers** |
| 36 | Schellenberg Wittmer | 6 | **Team** |

**O que essa tabela mostra de imediato.** Quinze dos sites acessíveis abrem o
menu por **pessoas** — People, Lawyers, Team, Find a Lawyer, Our people. Só que,
dos doze brasileiros, **apenas um** faz isso (Stocche Forbes). No Brasil o padrão
é abrir por "Sobre nós" ou "O Escritório": o site fala primeiro de si.

A mediana é de seis abas. Os extremos são instrutivos: Pinheiro Neto com doze e
Trench Rossi com dez transformaram o menu em organograma; Stocche Forbes com três
e Demarest com quatro provaram que dá para ser banca grande com menu curto.

---
## Brasil — as grandes bancas

São o benchmark que o cliente brasileiro conhece, e por isso valem menos como
modelo do que como mapa do que já está ocupado. Três achados aqui contrariam o
que estava escrito na `docs/PESQUISA.md` e ficam registrados abaixo.

---

### 1. Mattos Filho — https://www.mattosfilho.com.br

**Status: bloqueado (403).** Menu recuperado por slugs indexados, sem ordem
confirmada: Áreas de Atuação → Profissionais → Carreiras → Jovens Talentos →
30 Anos → ESG → Contato.

**O que dá para registrar.** A firma passou por rebranding em 2022 com a
Interbrand, e a imprensa da época descreve paleta de **laranja, roxo e cinza** —
ou seja, a maior banca do país não é azul-marinho. Mantém o relatório anual
"Pulso" em subdomínio próprio, tratando publicação institucional como produto
separado. Os grupos por país (China, Japão, Portugal, nórdicos…) são uma forma
inteligente de segmentar sem inflar a lista de áreas.

**Ressalva.** Nada de visual pode ser afirmado sem abrir no navegador.

---

### 2. Pinheiro Neto — https://www.pinheironeto.com.br

**Abas:** Home → O Escritório → Profissionais → Áreas de Atuação → Conhecimento
Jurídico → Eventos → Responsabilidade Socioambiental → Programa de Estágio →
Reconhecimentos → Carreira → Contato → Cadastro

**Visual.** Azul-petróleo escuro `#093145` nos títulos, `#3d6579` no corpo, e
**terracota** `#9a2618`/`#c12f1e`/`#ce5949` como acento. Tipografia via Typekit:
**Capitolium 2, serifada, em todos os títulos h1–h6**, com Proxima Nova no corpo.

**Padrão de apresentação.** Não há hero de imagem: a primeira dobra é um **campo
de busca** — "O que você quer encontrar? Conheça melhor o que fazemos".

**O que gostei.** Três coisas concretas. Primeira: **a serifada nos títulos**.
Segunda: o **widget VLibras** embutido — tradução para Libras num site de banca
brasileira é acessibilidade de verdade, e é o único caso nos 30. Terceira:
hreflang em cinco idiomas, incluindo chinês, japonês e coreano — decisão de
negócio visível na estrutura.

**O que não gostei.** Doze itens de menu, com "Programa de Estágio" e
"Reconhecimentos" no mesmo nível de "Áreas de Atuação". A busca como hero assume
que o visitante já sabe o que procurar. E é uma SPA Angular: o HTML bruto chega
quase vazio, o que atrapalha SEO.

**Para o B&M.** Confirma que **serifada em título é viável e legítimo no Brasil**,
e que terracota funciona como acento quente sobre azul escuro. VLibras entra na
lista de coisas a considerar.

> **Correção à `docs/PESQUISA.md`:** aquele documento afirma que "nenhum site
> pesquisado usa serifada como fonte de interface". O CSS do Pinheiro Neto declara
> `capitolium-2` para h1–h6. A afirmação precisa ser corrigida lá.

---

### 3. Machado Meyer — https://www.machadomeyer.com.br

**Abas:** Quem Somos → Áreas de Atuação → Advogados → Prêmios e Reconhecimentos →
Contato → Newsletter (mais "50 anos de história")

**Visual.** Grafite `#27292A` e cinzas `#505353`/`#707372`, fundos gelo `#f4f4f4`,
e **amarelo `#fae100`** como acento — segunda banca grande fora do azul. Fonte
"Cera" (sans) em título e corpo, com "Ariata Stencil" carregada à parte.
Retratos de estúdio posados.

**O que gostei.** O **card do diretório é o mais completo de todo o levantamento**:
foto, nome, cargo, cidade, e-mail, telefone, área, PDF do currículo, vCard e
LinkedIn — e filtros por nome, área, escritório e alfabeto. Isso é ferramenta,
não vitrine. O amarelo sobre grafite é uma combinação com personalidade.

**O que não gostei.** O hero é um slideshow de prêmio (Chambers Awards 2026) —
autoelogio na primeira dobra. Os retratos posados de estúdio são exatamente o
clichê que os premiados abandonaram. E o botão fixo "INTELIGÊNCIA JURÍDICA" no
header dá a uma seção de conteúdo o peso de CTA principal.

**Para o B&M.** O **card de advogado é o modelo a copiar** — nele cabe, com
naturalidade, o número de inscrição na OAB que o Provimento 205 exige. Resolve
compliance e usabilidade no mesmo componente.

---

### 4. TozziniFreire — https://www.tozzinifreire.com.br

**Abas:** Quem somos → Atuação → Nossos profissionais → Publicações → TFInclusão →
ThinkFuture → Contato → Área de Clientes

**Visual.** A paleta mais bem montada entre as brasileiras: azul-marinho
`#101f2d`, azul-petróleo `#52a2b8`, **coral `#f2665e`** como acento e **bege
`#e7e6de`** como neutro quente. Fonte customizada "Author" via `@font-face`.

**Padrão de apresentação.** Hero de aniversário ("50 anos", "Celebre conosco este
novo capítulo") → institucional → logos de clientes → atuação → diversidade →
3 cards (Escritório, TFInclusão, ThinkFuture) → contato → publicações →
newsletter.

**O que gostei.** O bege como neutro é o detalhe que impede a paleta de ficar
fria — mesma lógica do Freshfields, executada no Brasil. **TFInclusão e ThinkFuture
como abas de primeiro nível** continua sendo o melhor exemplo brasileiro de
transformar iniciativa interna em produto. E o filtro de advogados por nível, área,
setor e cidade é sólido.

**O que não gostei.** A home inteira girando em torno dos 50 anos fala do
escritório, não de quem chega. Carrega a biblioteca **Odometer**, de contadores
animados — número crescendo na tela é estética de landing page de infoproduto.
Logos de cliente na home, no Brasil, tangenciam a proibição de divulgar carteira.
E não encontrei número de OAB nem registro da sociedade.

**Para o B&M.** Paleta: melhor referência nacional. Contadores animados: fora.

---

### 5. Lefosse — https://lefosse.com

**Abas:** Expertises (40+ práticas em submenu alfabético) → Advogados →
O Escritório → Radar Lefosse → Contato

**Padrão de apresentação.** Hero textual com tagline própria — "Crescer é mais
seguro com quem entende seus desafios" — e CTA **"Encontre um advogado"** já na
primeira dobra. Depois: estatísticas (+400 bilhões, +600 reconhecimentos),
expertises com filtro, Radar Lefosse, newsletter, prêmios.

**O que gostei.** A tagline é a melhor do conjunto brasileiro: fala do medo do
cliente ("é mais seguro"), não da grandeza do escritório. O CTA da primeira dobra
é **encontrar uma pessoa**, o que está certo. E o **Radar Lefosse** — publicação
com nome próprio, vídeos, podcasts, guias e infográficos — é jornalismo, não
"seção de notícias".

**O que não gostei.** "+400 bilhões" e "+600 reconhecimentos" como grafismo
grande: é vitrine de resultado, que no Brasil é terreno proibido. Quarenta e tantas
expertises em lista alfabética é catálogo, não navegação. E o crédito de agência
no rodapé rouba espaço da marca.

**Para o B&M.** Copiar a **estrutura da tagline** (endereçar a insegurança de quem
contrata) e o CTA de primeira dobra. Descartar os números.

---

### 6. Demarest — https://www.demarest.com.br

**Abas:** Sobre nós → Áreas de Atuação → Profissionais → Insights → EN

**Padrão de apresentação.** Não há hero identificável: a página começa em
notícias e boletins. Depois "Insights", "Nós, Demarest", **linha do tempo desde
1948**, localidades e contato.

**O que gostei.** O menu de quatro itens é o mais enxuto entre as bancas
brasileiras, e a linha do tempo desde 1948 é uma forma honesta de comunicar
solidez — história é fato verificável, diferente de número de resultado.

**O que não gostei.** Home que abre em boletim tributário não apresenta o
escritório a ninguém. E o CTA — **"Construa conosco uma história de sucesso"** —
promete resultado, que é precisamente o que o art. 40 do Provimento 205/2021 não
admite. Se uma banca desse porte escorrega nisso, vale dobrar a atenção no B&M.

**Para o B&M.** Serve principalmente como alerta de compliance.

---

> **Achado transversal de compliance.** Em nenhuma das seis grandes bancas
> encontrei número de inscrição na OAB ou registro da sociedade na home ou no
> rodapé (parte delas bloqueou leitura completa, então não é conclusão fechada).
> Isso significa que **não há padrão de mercado para copiar** nesse ponto — o B&M
> vai ter que desenhar a própria solução, e o card de advogado do Machado Meyer é
> o melhor lugar para ela.
## Brasil — bancas médias e full-service

Grupo mais revelador que o das gigantes, porque aqui aparecem tanto os melhores
detalhes técnicos encontrados no Brasil quanto os deslizes mais constrangedores.

---

### 7. Cescon Barrieu — https://www.cesconbarrieu.com.br

**Status: bloqueado (403).** Menu inferido de URLs indexadas, sem ordem
confirmada: Sobre nós → Áreas de Atuação → Advogados → Centro de Inteligência →
Carreira. PT e EN.

**O que dá para registrar.** O nome da seção de conteúdo — **"Centro de
Inteligência Jurídica"** — repete a fórmula do "Radar Lefosse" e da "Inteligência
Jurídica" do Machado Meyer: dar nome próprio à publicação já é padrão consolidado
entre as bancas brasileiras de topo. Nada de visual é afirmável.

---

### 8. Souto Correa — https://www.soutocorrea.com.br

**Abas:** Sobre nós → Atuação → Profissionais → Em Foco → Carreira → Contato

**Visual.** Paleta com **laranja `#ff5527`** como destaque sobre azul-acinzentado
`#586873` e cinzas escuros — outra banca brasileira longe do azul-marinho puro.
Família Avenir customizada via `@font-face`, mesma fonte em título e corpo,
variando só o peso. Banners com pessoas e headshots posados individuais.

**Padrão de apresentação.** Banner → Em Foco → Sobre nós → Publicações →
Diversidade → ESG → Pro Bono → Áreas → Profissionais → Reconhecimentos →
Newsletter. Treze blocos.

**O que gostei.** Seis abas, limpas. O hero tem duas frases com voz própria —
"Juntos, somos potência. E nos tornamos únicos." e o lema "Ir longe, chegar
juntos." — e o lema é bom: fala de percurso, não de vitória. Usar **uma família
só, variando peso**, é uma decisão tipográfica madura e barata de manter. O card
do diretório com **download de V-Card** é gentileza prática.

**O que não gostei.** Treze seções na home diluem tudo. O contador "+200
advogados" e a fileira de selos (Chambers, Legal 500, Leaders League, IFLR1000,
GDR 100, BRALLAW) é a mesma vitrine de sempre. E o rodapé ainda diz **"© 2022"**
— quatro anos desatualizado, num site que fala de excelência.

> **Correção à `docs/PESQUISA.md`:** lá está escrito que o Souto Correa "usa
> fotografia abstrata com texto sobreposto em vez de pessoas de terno". O que o
> site mostra hoje são banners com pessoas e headshots posados individuais. O
> elogio precisa ser revisto.

**Para o B&M.** Uma família tipográfica em vários pesos é caminho seguro se o
orçamento de fonte for curto. E o "© 2022" é lembrete de automatizar o ano no
rodapé.

---

### 9. Trench Rossi Watanabe — https://trenchrossi.com

**Abas:** O Escritório → Áreas de Atuação → Advogados → Novidades →
Responsabilidade Social Corporativa → **Move** → Carreiras → Canal de Ética →
Transparência → Contato

**Visual.** Branco predominante, vermelho nos ícones, cinzas de apoio.
Fotografia corporativa posada.

**O que gostei.** O gráfico de diversidade de gênero — **45% masculino / 55%
feminino** — exposto na home é dado verificável sobre quem o escritório é, e não
sobre o que conquistou. É o tipo raro de número que constrói confiança sem
prometer resultado, e passa longe da proibição da OAB. A sub-marca "Move" tem aba
própria, de novo o padrão de nomear iniciativa.

**O que não gostei.** **Dez abas** — o menu mais inchado entre os brasileiros,
com "Canal de Ética" e "Transparência" no mesmo nível de "Áreas de Atuação".
O hero é o anúncio de sete novos sócios: notícia interna ocupando a primeira
dobra. E onze logos de premiação enfileirados.

**Para o B&M.** O dado de diversidade é a prova de que **existe número que pode
ser publicado**: fatos sobre composição e método, nunca sobre resultado.

---

### 10. Veirano — https://www.veirano.com.br

**Abas:** Home → Mídia → Profissionais → Expertise → Escritório → Carreira →
Contato (+ CTA "Cadastre-se")

**Visual.** Azul `#0d3779` como principal, mais `#01629b`, `#76a8f1`, verde
`#268854` e vermelho `#be0f1e` — cinco cores fortes, paleta larga demais.
**Merriweather serifada nos títulos com Open Sans no corpo.** Carrossel de
banners institucionais.

**O que gostei.** Duas coisas relevantes de verdade. Primeira: os **filtros do
diretório** são os mais completos do Brasil — categoria, letra, escritório,
expertise, tipo de profissional, **idioma** e palavra-chave. Filtrar advogado por
idioma falado é utilidade real que quase ninguém oferece. Segunda: é **o único
site brasileiro que menciona OAB no perfil individual**, no campo "Admissões"
("OAB – Rio de Janeiro").

**O que não gostei.** Cinco cores fortes sem hierarquia clara. Carrossel
institucional no hero. E a menção à OAB fica pela metade: cita o estado, não o
número de inscrição, que é justamente o que o Provimento 205 exige.

**Para o B&M.** O campo "Admissões" no perfil é o **lugar natural do número de
OAB** — a estrutura já existe no mercado, falta preencher direito. E o par
Merriweather + Open Sans é a segunda confirmação de serifada em título no Brasil.

---

### 11. BMA — https://www.bmalaw.com.br

**Abas:** Sobre o BMA → Áreas de atuação → Profissionais → Compromisso ESG →
Conteúdo → Carreiras → Contato → BMA PI

**Visual.** Fundo **bege `#f7f4f2`** com vermelho `#b41e28` de destaque e texto
`#231f20`. Tipografia Montserrat + Red Hat Display, ambas do Google Fonts.

**Padrão de apresentação.** Sem hero: três cards (Atuação, Profissionais,
Conteúdo) → grid de 40+ áreas → conteúdo → LinkedIn → reconhecimentos → ESG →
newsletter.

**O que gostei.** O **fundo bege** é a melhor decisão cromática entre as
brasileiras: o site inteiro fica mais quente que os concorrentes sem perder
sobriedade, e é exatamente o efeito que o Freshfields persegue. O selo **ISO
27001** no rodapé comunica segurança da informação com um fato auditável — bom
sinal para quem entrega documento sensível. Filtros do diretório incluem idioma.

**O que não gostei.** Montserrat com Red Hat Display é combinação de fontes
gratuitas populares: funciona, mas não assina nada. Grid com 40+ especialidades
logo na abertura é catálogo. E a home não tem hero — nenhuma frase diz quem é o
escritório antes da lista.

**Para o B&M.** **Bege como base de fundo entra direto na proposta de paleta.**
E Montserrat fica fora, pelo mesmo motivo do Playfair Display: é fonte de template.

---

### 12. Stocche Forbes — https://www.stoccheforbes.com.br

**Abas:** Pessoas & Cultura → Áreas de Atuação → Inteligência (Publicações,
Eventos, Comunicação, Radar, Newsletter)

**Visual.** Hero com **fotografia de banco de imagens**, e os créditos estão
visíveis no código — "Image by David Werbrouck", "Scott Webb", "Verne Ho". Nos
perfis, fotos de estúdio.

**O que gostei.** Três abas só, e **"Pessoas & Cultura" em primeiro lugar**,
antes de áreas de atuação — hierarquia corajosa para uma banca desse porte.
"Inteligência" agrupa bem publicações, eventos e newsletter num guarda-chuva só.

**O que não gostei.** A stock photo do hero com crédito de Unsplash exposto no
código é o clichê que a `docs/PESQUISA.md` mandou evitar, praticado por um dos
maiores escritórios do país. O texto de abertura — "um dos principais escritórios
de advocacia do Brasil" — é autoproclamação sem fonte, e no Brasil isso é terreno
escorregadio. E o diretório lista **250+ advogados em grid sequencial, sem filtro
nem busca**: encontrar alguém exige rolar a página inteira. Os perfis dizem
"Membro da Ordem dos Advogados do Brasil" **sem o número de inscrição**.

**Para o B&M.** Menu de três abas é o modelo mais próximo do que uma sociedade de
dois sócios precisa. O resto é lição do avesso.
## Reino Unido — Magic Circle e vizinhança

O grupo mais interessante de estudar, porque é onde a advocacia tradicionalíssima
foi obrigada a se modernizar sem perder a gravidade. Duas dessas casas fugiram do
azul-marinho, o que derruba a ideia de que azul é obrigatório na categoria.

---

### 13. Slaughter and May — https://www.slaughterandmay.com

**Abas:** People → Services → Perspectives → Careers → Our Firm

**Visual.** Paleta roxa — `#50316d` e `#311f4a` no escuro, `#4f32c9` no acento,
lilás `#dbd9e7` nos fundos, com respiros em pêssego `#ffe4d7`. Fundo branco.
Título em serifada proprietária ("Feature Deck"), corpo em Open Sans. Fotografia
candid em ambiente real, gente trabalhando, nada de braços cruzados.

**Padrão de apresentação.** Carrossel de 3 no hero → "Advice that stands out" →
Insights → People → Careers → Recent work. Rodapé com os 4 endereços por extenso.

**O que gostei.** Três coisas. Primeira: **People é a primeira aba**, antes de
áreas de atuação — a firma mais antiga do grupo decidiu que a porta de entrada é
gente, não serviço. Segunda: o roxo. É a prova de que dá para ser secular e não
ser azul-marinho, e o roxo escuro carrega a mesma autoridade sem o clichê.
Terceira: os blogs têm nome próprio — *The Lens*, *Sustainable Matters*,
*Pensions Pointers*, *European Tax* — publicação tratada como produto de mídia,
não como "Artigos".

**O que não gostei.** O carrossel de 3 slides no hero: rotação automática dilui a
mensagem e o visitante raramente vê o slide 2. "Advice that stands out" é tagline
que qualquer escritório do mundo poderia assinar. E o "2.500+ alumni em 75 países"
é vaidade — mede tamanho, não qualidade.

**Para o B&M.** O par serifada no título + sans no corpo é exatamente a estrutura
tipográfica que queremos. E a decisão de abrir por pessoas é o modelo certo para
uma sociedade de dois sócios.

---

### 14. Freshfields — https://www.freshfields.com

**Abas:** Find a Lawyer → Our Capabilities → Your Career → People → Locations →
Our Thinking → About Us → News → Search

**Visual.** O achado aqui é a paleta: bege-oliva `#9D9785` como cor mais recorrente
no CSS, cinzas quentes, branco quebrado `#efefec`, e um verde `#46bb51` só de
acento. Nada de azul. Tipografia proprietária de verdade — "FreshfieldsHeadline"
serifada nos títulos, "FreshfieldsText" sans no corpo. Imagens abstratas (salas
vazias, trânsito, remo) em vez de pessoas posadas.

**Padrão de apresentação.** Hero com frase de posicionamento → Featured Insights
em carrossel → "Your world, our expertise" em abas → notícias.

**O que gostei.** A paleta quente é a melhor resposta que encontrei para
"sofisticado sem ser frio". Bege e oliva fazem o que o azul-marinho não faz:
soam humanos. Fonte própria é o grau máximo de investimento em identidade, e o
fato de ser serifada no título confirma que serifada não é sinônimo de antiquado.
Substituir retrato por imagem abstrata também elimina o clichê do terno.

**O que não gostei.** Nove itens no menu principal, com "Find a Lawyer" e "People"
competindo — duas portas para a mesma coisa. A tagline "Law never stops moving
forward – neither do we" é vazia, o tipo de frase que sobrevive a qualquer comitê.
E carrossel em toda seção cansa.

**Para o B&M.** É a referência número um de paleta. Bege/oliva/branco quebrado
resolve a tensão entre elegante e acolhedor melhor do que qualquer azul.

---

### 15. Clifford Chance — https://www.cliffordchance.com

**Abas:** People & places → Expertise → Insights → Briefings → Innovation →
About us → Careers → Client Portal → Search

**Visual.** Preto `#000000` e branco, escala de cinzas larga, azul só no acento
(`#009fda` no CSS legado, `#4453F4` nos componentes novos). Helvetica Neue no
corpo e — detalhe bom — **New Baskerville em itálico bold** nos destaques.
Fotografia stock de negócio e infraestrutura.

**Padrão de apresentação.** Banner hero → 4 cards de destaque → Perspectives →
Thought Leadership (6 cards) → transações recentes → rodapé enorme.

**O que gostei.** O monocromático preto e branco é disciplinado e envelhece bem.
A serifada itálica como único ornamento tipográfico é um gesto elegante e barato
— um acento, não uma segunda identidade. Os filtros do diretório por região e por
escritório são bem resolvidos.

**O que não gostei.** Nove abas, duas delas ("Insights" e "Briefings") dizendo
praticamente a mesma coisa — isso é organograma interno vazando para o menu.
Fotografia de banco de imagem em site desse porte é preguiça. E convivem no CSS
dois azuis de acento diferentes, sinal de redesign pela metade.

**Para o B&M.** Serve como aviso: menu que reflete a estrutura interna do
escritório confunde quem vem de fora. E como bom exemplo do uso econômico da
serifada itálica.

---

### 16. Linklaters — https://www.linklaters.com

**Abas:** Find a Lawyer → Expertise → Insights → Our Firm → Your Career

**Visual.** Branco com acento azul-marinho. Fotografia corporativa profissional
de aparência stock. Carrossel de 3 cards no hero.

**Padrão de apresentação.** Hero rotativo (contratação de sócio) → cards
secundários → "client impact" com deals → painel "Applied Intelligence" → equipe
global.

**O que gostei.** Cinco abas só, e "Find a Lawyer" em primeiro — o menu mais
enxuto do grupo. Nomear a iniciativa de tecnologia ("Applied Intelligence") em
vez de chamá-la "Inovação" dá a ela identidade de produto.

**O que não gostei.** A home é um mural de troféus: Alibaba HK$80bi, Prologis/SEGRO
£14bi, "#1 global legal team". Funciona para impressionar CFO, não para gerar
confiança em pessoa física. A fotografia é indistinguível de banco de imagem.
E a manchete do hero é uma contratação interna — notícia que interessa ao mercado
jurídico, não ao cliente.

**Para o B&M.** Contraindicado quase inteiro. No Brasil, esse tipo de exibição de
resultado esbarra direto no Provimento 205/2021 da OAB. O aproveitável é só a
lógica de menu curto.

---

### 17. A&O Shearman — https://www.aoshearman.com

**Abas:** Home Page → Expertise → Industries → Global coverage → Insights → About us

**Visual.** Fotografia de banco de imagem assumida, com crédito Getty visível —
surfista, frasco de remédio, símbolo químico. Estrutura de home longuíssima:
expertise, 11 setores, 6 regiões, insights, hero, sobre, notícias, carreiras.

**O que gostei.** As sub-marcas nomeadas — **Fuse** (incubadora) e **Markets
Innovation Group** — repetem o acerto da TozziniFreire: dar nome próprio a uma
iniciativa a transforma em produto. A busca de pessoas com full-text é boa.

**O que não gostei.** Muita coisa. "Home Page" como rótulo de menu é erro de
revisão publicado no ar de uma firma bilionária. A metáfora stock literal
(surfista para "ondas de mudança") é o clichê que os premiados eliminaram. E a
home tem tantas seções que nenhuma tem peso — é sumário, não página.

**Para o B&M.** Caso de estudo do que evitar: quando tudo é destaque, nada é.

---

### 18. Macfarlanes — https://www.macfarlanes.com

**Abas:** Our people → What we do → Who we are → Insights → Join us

**Visual.** Tons neutros, fotografia entre stock e reportagem. Hero com uma frase
longa de posicionamento em vez de tagline.

**Padrão de apresentação.** Quatro áreas de atuação logo na abertura (Private
Capital, Private Wealth, M&A, Disputes) → carrossel de casos → quem somos →
insights → notícias → carreiras → 3 escritórios.

**O que gostei.** É o mais transferível do grupo. **Só quatro áreas de atuação**,
declaradas na primeira dobra — uma firma de Londres com séculos de história se
apresenta com quatro áreas, enquanto boutiques brasileiras listam cinquenta. O
hero é uma frase que diz o que a firma faz e para quem, não um slogan. E os
rótulos do menu são em linguagem humana: "Our people", "What we do", "Who we are",
"Join us" — nenhum jargão institucional.

**O que não gostei.** A fotografia não acompanha a qualidade do texto: continua
genérica. E o destaque de fundo de €15bi no carrossel volta ao mural de troféus.

**Para o B&M.** A melhor referência de **arquitetura de conteúdo** do grupo inteiro.
Poucas áreas, rótulos em português coloquial, hero que explica em vez de
sloganizar. É quase o mapa do site que o B&M precisa.
## Estados Unidos — a elite de Wall Street

Aqui está o extremo oposto do que se espera: as firmas mais caras do mundo têm,
em geral, os sites mais austeros. Duas delas praticamente não usam fotografia.

---

### 19. Wachtell Lipton — https://www.wlrk.com

**Status: inacessível.** Cloudflare bloqueia leitura automatizada (HTTP 403,
inclusive com user-agent de navegador). A estrutura recuperada por busca indica
algo como The Firm → Practices → Litigation → Careers → Contact, mas não dá para
confirmar, e não vou descrever visual que não consegui ver.

**O que dá para registrar com honestidade:** a firma mais lucrativa por sócio do
mundo opera em um domínio só, com sigla em vez de nome, e sem qualquer esforço de
marketing digital. Vale visitar manualmente no navegador antes de decidir direção.

---

### 20. Cravath — https://www.cravath.com

**Abas:** Practices → People → Careers → News & Insights

**Visual.** Azul profundíssimo `#011230` e `#021431`, azul de trabalho `#15406a`,
azul vivo `#348ffe` no acento, azuis claros `#dbeeff`/`#f2f9ff` nos fundos.
Tipografia: **Bembo** (serifada renascentista) nos títulos, Franklin Gothic no
corpo. E o dado mais forte: **nenhuma fotografia na home** — a página inteira tem
duas imagens, provavelmente logo e ícone.

**Padrão de apresentação.** Sem hero de imagem. Abre com o *Alumni Journal*,
carrossel numerado de casos ("1/6"), notícias, visão geral, práticas, carreiras,
bicentenário.

**O que gostei.** A ausência total de fotografia é a decisão mais corajosa do
levantamento inteiro, e funciona: sem imagem, a tipografia precisa carregar tudo,
e Bembo + Franklin Gothic aguenta. É a prova definitiva de que não existe
obrigação de ter foto de gente de terno. O carrossel numerado, em vez de pontinhos,
respeita o leitor — ele sabe onde está.

**O que não gostei.** Não há headline. O visitante cai numa página cujo primeiro
elemento é um informativo de ex-funcionários — a firma assume que você já sabe
quem ela é. Para o B&M, que ninguém conhece ainda, isso seria suicídio.

**Para o B&M.** Guardar o princípio (tipografia no lugar da imagem), descartar a
execução (site que não se apresenta só funciona para quem tem 200 anos de nome).

---

### 21. Sullivan & Cromwell — https://www.sullcrom.com

**Abas:** Lawyers → Practices → Insights → About → Careers → Alumni

**Visual.** Tipografia boa — FF Graphik nos pesos fortes, FF Real Text no
secundário. Mas o CSS de produção entrega paleta padrão do Bootstrap
(`#0d6efd`, `#6c757d`, `#dc3545`), ou seja, a cor da marca não foi sistematizada.
Mistura formas 3D abstratas com headshots de sócios.

**Padrão de apresentação.** O hero é um **prêmio**: "Litigation Department of the
Year – Finance". Depois insights, vídeos e podcasts, notícias.

**O que gostei.** Pouco. A seção dedicada a vídeo e podcast, separada dos artigos,
é uma boa ideia — formatos diferentes merecem vitrines diferentes.

**O que não gostei.** Abrir com troféu é o erro clássico: fala de si, não do
cliente. Misturar esferas 3D genéricas com retrato formal cria duas linguagens
visuais brigando na mesma página. E azul do Bootstrap vazando no CSS de uma firma
desse porte é desleixo técnico.

**Para o B&M.** Além de feio, é proibido por aqui: hero de premiação e listagem de
resultados batem de frente com o Provimento 205/2021 da OAB.

---

### 22. Paul Weiss — https://www.paulweiss.com

**Abas:** Lawyers → Practices → Industries → Offices → Careers → Insights →
Our Firm → Inclusion → Alumni

**Visual.** O melhor sistema de cor do grupo americano: azul-marinho `#03203D`
dominante (51 ocorrências no CSS), apoio em `#0B3D71` e `#B9C8DA`, verde-acinzentado
`#DCE3E1`, e vermelho `#E63131` como acento único. Tipografia de assinatura —
**ABC Diatype** (sans contemporânea) com **Untitled Serif**. Quase nenhuma foto.

**O que gostei.** Paleta sistematizada de verdade, com um acento só e um vermelho
usado com parcimônia. O par Diatype + Untitled Serif é escolha de estúdio de
design, não de template — foge do óbvio sem ser exótico.

**O que não gostei.** O H1 é "Effective solutions to the most complex legal and
business challenges", que é o grau zero da frase institucional. Nove abas. E
citações da Chambers usadas como depoimento — no Brasil isso seria infração.

**Para o B&M.** Referência de **sistema de cor**: um marinho dominante, dois apoios,
um acento quente. É estrutura de paleta replicável com as cores da marca do B&M.

---

### 23. Latham & Watkins — https://www.lw.com

**Abas:** People → Capabilities → Achievements → Insights → Global Citizenship

**Visual.** Vermelho `#ac0000` como cor de marca dominante — 116 ocorrências no
CSS, o compromisso cromático mais forte de todos. Avenir Next no texto. Imagens
mistas: render 3D de data center, detalhe arquitetônico da Suprema Corte, e
fotografia stock (bandeira americana em camuflagem).

**O que gostei.** O vermelho, aplicado com consistência de verdade. E o **Book of
Jargon** — glossário de termos jurídicos que a firma mantém como ferramenta
pública. É conteúdo que serve ao leitor em vez de elogiar o autor; o melhor
exemplo de utilidade real do levantamento.

**O que não gostei.** "Achievements" como aba de menu principal é vitrine de
troféu institucionalizada: 98 rankings Band 1, 24 anos consecutivos na A-List.
E a stock de bandeira/camuflagem destoa de tudo.

**Para o B&M.** O Book of Jargon é o modelo certo de conteúdo — um glossário claro
de termos jurídicos para leigos serve quem procura advogado e não fere nenhuma
regra da OAB.

---

### 24. Kirkland & Ellis — https://www.kirkland.com

**Abas:** Lawyers → Services → Social Commitment → Careers → News & Insights →
Locations → About

**Visual.** Branco e cinza-claro `#E3E3E3`, sem cor de marca extraível.
Tipografia: **Playfair Display + Rubik, via Google Fonts.** Nenhuma foto
identificável no HTML — a home é renderizada por Vue.js e chega praticamente vazia
ao carregar.

**O que gostei.** A limpeza do branco. E o card do diretório é bem especificado:
nome, cargo, nível, escritório e e-mail — informação que resolve a pergunta de
quem busca.

**O que não gostei.** Playfair Display com Rubik é o par de fontes gratuitas mais
usado da internet — a maior firma do mundo em faturamento com tipografia de
template. O CTA principal é um botão "Watch Video" sem nenhuma headline ao lado,
então o visitante não sabe o que vai assistir nem por quê. E depender inteiramente
de JS para renderizar conteúdo é ruim para SEO e para leitor de tela.

**Para o B&M.** Serve de alerta duplo: **fugir de Playfair Display** (vai parecer
template), e garantir que o conteúdo exista no HTML — para SEO local em Maringá,
isso é decisivo.
## Estados Unidos — as firmas de tecnologia e venture capital

Grupo que atende startup e fundo, e por isso fala a língua do cliente em vez da
língua do foro. É de longe o mais útil em **arquitetura de conteúdo**, ainda que
boa parte do que fazem seja proibida pela OAB no Brasil.

---

### 25. Cooley — https://www.cooley.com

**Abas:** About → People → Services → Insights → Diversity → Careers → Geographies

**Padrão de apresentação.** Hero em carrossel com **controle "Pause motion"** →
hub de recursos (Public Company Resource Hub, IPO GO, Cooley Go) → insights →
vídeo → serviços-chave → cadastro de newsletter → rodapé.

**O que gostei.** A tagline "Counsel, beyond convention." é curta, tem ritmo e
promete uma postura — muito acima da média institucional. O botão **"Pause motion"
no carrossel** é acessibilidade feita direito, e quase ninguém faz. E o
**Cooley Go**, biblioteca gratuita de documentos e guias para fundador de startup,
é conteúdo que resolve problema de quem lê.

**O que não gostei.** Sete abas, com "Geographies" em rótulo que ninguém usa
falando. O CTA principal da home é assinar newsletter, repetido duas vezes — para
quem entra com um problema jurídico, é o pedido errado.

**Para o B&M.** O controle de pausa entra direto no nosso checklist se houver
qualquer movimento automático. E o modelo Cooley Go — material útil e gratuito —
é o tipo de conteúdo que gera confiança sem esbarrar em publicidade.

---

### 26. Gunderson Dettmer — https://www.gunder.com

**Abas:** People → Services → News & Insights → Catalyze → About → Careers → Offices

**Visual.** Sem foto nenhuma de pessoa na home — só a marca gráfica em cerulean.
Hero é texto: "We represent what matters.", seguido de um subtítulo que descreve
o cliente, não a firma ("Our clients are the forward-thinkers, the dealmakers and
the achievers; those who challenge, change and improve").

**Padrão de apresentação — e o achado do levantamento.** Logo abaixo do hero, os
cards **não são áreas de atuação: são estágios do cliente** — Early-Stage,
Late-Stage, Public Company, Private Fund. O visitante não precisa saber que
precisa de "societário": ele sabe em que fase está.

**O que gostei.** Essa inversão. Organizar a navegação pela **situação de quem
chega**, e não pelo organograma do escritório, é a melhor ideia estrutural que
encontrei em 30 sites. Também gostei do subtítulo falar do cliente na segunda
pessoa e de "Catalyze" ser sub-marca nomeada com aba própria.

**O que não gostei.** O selo "#1 VC law firm globally by PitchBook, twelfth year
in a row" ocupa lugar nobre, e o depoimento de sócio na home soa ensaiado.
People primeiro no menu, mas sem nenhum rosto na home — contradição.

**Para o B&M.** **A referência estrutural principal.** Em vez de "Direito de
Família / Cível / Trabalhista", organizar por momento de vida: "Estou me
separando", "Recebi uma cobrança indevida", "Perdi meu emprego". Muda o site de
catálogo para porta de entrada.

---

### 27. Goodwin — https://www.goodwinlaw.com

**Abas:** Expertise → People → Careers → Insights & Resources → About Us →
Locations → News & Events → Alumni

**Padrão de apresentação.** Hero textual "We Live Your Business" → 3 cards de
insights → "The Goodwin Platform" (6 verticais de indústria) → "The Goodwin
Commitment" → rodapé. Laranja como cor de destaque nos ícones.

**O que gostei.** Home curta — quatro blocos e acabou, num universo onde todo
mundo empilha dez seções. Não tem contador, não tem selo de prêmio, não tem
carrossel de premiação: contenção rara. E a tagline coloca o negócio do cliente
no centro.

**O que não gostei.** O subtítulo estraga o acerto da tagline: "unprecedented
client value through a unique combination of industry knowledge, legal excellence,
and business advisory expertise — all powered by our high-performance culture" é
uma frase que não sobrevive à leitura em voz alta. Oito abas. E chamar a estrutura
de "The Goodwin Platform" transforma áreas de atuação em jargão de software.

**Para o B&M.** Bom argumento a favor de uma **home curta**. E lembrete de que
tagline boa morre se o parágrafo seguinte for corporativês.

---

### 28. Wilson Sonsini — https://www.wilsonsonsini.com

**Status: inacessível.** O domínio redireciona para `wsgr.com`, que responde 403 a
leitura automatizada. Estrutura recuperada por busca, sem ordem confirmada:
People → Practice Areas → Industries → Offices → Careers → Insights.

**O que dá para registrar.** A firma mantém dois domínios, um redirecionando para
o outro com sigla — mesma herança de "wlrk.com". Não há nada de visual que eu possa
afirmar. Fica para verificação manual no navegador.

---

### 29. Orrick — https://www.orrick.com

**Abas:** People → Practices → Insights → Careers → About → Orrick Tech Studio

**Padrão de apresentação.** Sem hero. A primeira dobra é uma **grade de "Sector
Insights"** → "The Latest" → tiles promocionais (Tech Studio, iniciativa na
Virgínia Ocidental, Observatory) → redes → rodapé com 24 escritórios.

**O que gostei.** Os artigos trazem **tempo estimado de leitura** — cortesia
pequena que muda a taxa de clique. O menu tem só seis itens e um deles é uma
sub-marca própria ("Orrick Tech Studio"), o que dá a ela o mesmo peso de uma área
de atuação. Centros temáticos nomeados (AI Law Center, Online Safety Law Center)
funcionam como produto editorial.

**O que não gostei.** Abrir direto numa grade de insights, sem uma linha dizendo
quem é o escritório, transfere para o visitante o trabalho de descobrir. Serve
para leitor recorrente, não para quem chega pela primeira vez. E os selos ("A-List
por 14 anos consecutivos") reaparecem.

**Para o B&M.** Tempo de leitura nos artigos: adotar. Home sem apresentação:
descartar — no nosso caso o visitante nunca ouviu falar do escritório.

---

### 30. Fenwick — https://www.fenwick.com

**Abas:** Services → Industries → People → About Us → Careers → Insights

**Visual.** Fundo preto com acento verde. Nenhuma pessoa fotografada: o lugar da
imagem é ocupado por logos de cliente e material de caso (Figma, Wiz, Wealthfront,
CoreWeave, Lashify).

**O que gostei.** "Purpose-Built for Tech & Life Sciences" é o **posicionamento
mais afiado dos 30 sites**. Em cinco palavras exclui a maior parte do mercado e
diz exatamente para quem serve — e escritório que consegue dizer para quem *não*
serve é escritório que se escolhe. O diretório com filtro por prática é limpo.

**O que não gostei.** As métricas "40%" e "25B+" aparecem sem contexto nenhum;
número grande sem frase é ruído. E a home inteira é construída sobre caso de
cliente, o que, além de ser autocentrado, é justamente o que a OAB proíbe aqui.

**Para o B&M.** O princípio do posicionamento estreito vale muito: dizer com
clareza para quem o escritório é feito. A execução — logo de cliente, caso de
sucesso, número de resultado — é proibida pelo Provimento 205/2021 e fica fora.
## Europa continental — boutiques e firmas médias

O grupo mais próximo da realidade do B&M em tamanho. Também o mais irregular:
tem a melhor tagline do levantamento e o único site com certificado vencido.

---

### 31. Bersay — https://bersay.com

*(o endereço `bersay-associes.com` não resolve mais; o domínio atual é `bersay.com`)*

**Abas:** Le cabinet → International → Expertises → Équipes → Newsroom → Talents

**Visual.** Branco, texto preto, acentos azuis. Retratos corporativos combinados
com padrões geométricos abstratos, em cores. Carrossel de 6 fotos no hero.

**Padrão de apresentação.** Hero → sobre → 13 expertises → newsroom → distinções →
equipes (~50 pessoas, card com foto, nome e cargo) → CTA de contato → recrutamento.

**O que gostei.** Os rótulos do menu são humanos em francês — "Le cabinet",
"Équipes", "Talents" — sem jargão. A Newsroom tem filtro **por advogado**, além de
área e formato: dá para ler tudo que uma pessoa específica escreveu, o que é um
jeito elegante de construir autoridade individual. Treze expertises, não quarenta.

**O que não gostei.** Seção inteira dedicada a distinções (Legal 500, Décideurs).
O carrossel de 6 fotos no hero não diz nada em imagem nenhuma. E os padrões
geométricos convivem com retrato corporativo sem que fique claro por quê.

**Para o B&M.** O filtro de publicações por autor é aproveitável e barato — com
dois sócios, permite a cada um ter um corpo de texto identificável.

---

### 32. Kanzlei am Kai — https://www.kanzlei-am-kai.at

*(o endereço `.ch` da `docs/PESQUISA.md` não existe; o domínio é `.at` e a firma
fica em **Viena**, não em Zurique)*

**Abas:** nenhuma. O site não tem menu superior: é **página única com rolagem**.

**Visual.** Branco/off-white, azul-marinho e tons dourados quentes em divisores
gráficos em forma de onda. Sans-serif. Retratos corporativos coloridos dos cinco
advogados.

**Padrão de apresentação.** Cabeçalho → endereço e introdução → direito
imobiliário → direito empresarial → equipe → bios com "VITA" expansível → mapa →
rodapé com impressum completo.

**O que gostei.** É o exemplo mais direto de **escritório pequeno que não finge ser
grande**: uma página, duas áreas de atuação, cinco pessoas, endereço e telefone
visíveis. O "VITA" expansível resolve bem a tensão entre card curto e biografia
longa. E a linguagem usa marcação de gênero inclusiva de forma consistente.

**O que não gostei.** Sem menu, a rolagem é o único meio de navegar — a partir de
certo volume de conteúdo isso trava. A headline ("Especialistas em direito
imobiliário e empresarial") é descrição, não posicionamento. E as ondas douradas
são ornamento sem função.

> **Correção à `docs/PESQUISA.md`:** lá consta que esta banca usa preto e branco
> integral e fonte própria "Voltaire". Não é o que o site `.at` mostra — as fotos
> são coloridas e a paleta tem dourado. O trecho precisa ser revisto.

**Para o B&M.** A estrutura de página única com duas áreas e bio expansível é
plausível para uma sociedade de dois sócios, se o volume de conteúdo for pequeno.

---

### 33. Kümmerlein — https://www.kuemmerlein.de

**Abas:** Expertise → Anwälte → Notare → Über uns → Karriere → News → Kontakt

**Visual.** Minimalismo moderno, retratos profissionais dos advogados.

**Padrão de apresentação.** Hero → "Ihr Benefit" (seu benefício) → por que
trabalhar conosco → soluções → equipe (80+) → news → logos de clientes → CTA de
carreira.

**O que gostei.** Duas coisas fortes. A tagline — **"Make it simple, but
significant"** — é a melhor dos 30 sites: curta, memorável, e promete uma postura
que o cliente reconhece (advogado que descomplica). E o CTA:
**"Unverbindlich kennenlernen"**, ou seja, *nos conhecer sem compromisso*. Remove
o medo de que o primeiro contato já vire cobrança, sem nunca dizer "consulta
gratuita" — que aqui seria infração. Tirar o atrito sem prometer preço é
exatamente a linha que o B&M precisa andar. A seção chamada "Ihr Benefit" também
inverte o ponto de vista para o do cliente.

**O que não gostei.** Sete abas, com Anwälte e Notare separados por razão interna.
Logos de cliente usados como prova social. E os selos (azur100, Legal500,
"18 rankings") ocupam espaço demais para uma casa que prega simplicidade.

**Para o B&M.** **A melhor referência de texto do levantamento.** A dupla
tagline-curta + convite-sem-compromisso é adaptável quase direto para o português.

---

### 34. Minerva Advocaten — https://minerva-advocaten.nl

**Status: site quebrado.** O endereço com `www.` apresenta **certificado SSL
vencido**, e o navegador bloqueia a entrada com aviso de segurança. Boutique
fundada em 2019 por três sócios, em Roterdã (a `docs/PESQUISA.md` diz Amsterdã),
com áreas em transporte, aviação, marítimo, responsabilidade civil, seguros e
arbitragem. Seções recuperadas: Team, Expertise, News, Contact.

**O que gostei.** Nada avaliável — o site não abre de forma confiável.

**O que não gostei.** Justamente isso. Certificado vencido em site de escritório
de advocacia transmite, para quem chega, o oposto de cuidado com o detalhe. É o
tipo de falha que custa cliente em silêncio.

**Para o B&M.** Lembrete operacional: renovação automática de certificado e
monitoramento de expiração entram no escopo de manutenção, não são detalhe de
infraestrutura.

---

### 35. Walder Wyss — https://www.walderwyss.com

**Abas:** Lawyers → News & Publications → Practice Areas → **Legal Tech: WW++** →
Responsible business practice → About us → Career

**Padrão de apresentação.** Sem hero. A página abre em um bloco de **rankings
recentes** (Legal 500 EMEA 2026, Chambers Europe 2026), seguido de acessos
rápidos, eventos, news, newsletter e sobre.

**O que gostei.** A estratégia de **sites-satélite temáticos** — `startuplaw.ch`,
`dataprotection.ch`, `lifesciencelaw.ch` — é a ideia de conteúdo mais ambiciosa do
levantamento: em vez de enterrar a área numa aba, cada especialidade ganha
domínio próprio e disputa busca sozinha. Para SEO, é muito eficaz. "Legal Tech:
WW++" como aba dá nome e peso à iniciativa tecnológica.

**O que não gostei.** Abrir a home com prêmios é a versão mais crua do
autoelogio — antes mesmo de dizer o que a firma faz. E o CTA principal é assinar
newsletter, de novo o pedido errado para quem chega com um problema.

**Para o B&M.** A ideia de satélite não cabe agora (dois sócios, um site), mas
**vale guardar para conteúdo local**: uma página forte e específica por área,
otimizada para busca em Maringá, tem o mesmo efeito em escala menor.

---

### 36. Schellenberg Wittmer — https://www.swlegal.com

*(o domínio `schellenbergwittmer.com` redireciona para `swlegal.com`)*

**Abas:** Team → Expertise → Insights → Career → CSR → About

**Visual.** Azul-marinho e branco, sans-serif com hierarquia clara, fotografia
corporativa colorida de ambiente de escritório e equipe.

**Padrão de apresentação.** Notícias/casos → CSR → expertise → sobre → escritório
de Singapura → insights → carreiras → plataformas especializadas (takeoverpractice.ch,
FlexLaw) → contato com os três escritórios.

**O que gostei.** **"Your leading Swiss business law firm"** é posicionamento
completo em cinco palavras: o quê, onde e para quem. Seis abas, com **Team em
primeiro**. E a assinatura de newsletter permite **escolher os temas** — respeita
o leitor em vez de despejar tudo.

**O que não gostei.** É o site mais convencional do grupo: azul-marinho, fotografia
corporativa, nenhum gesto próprio. Cumpre tudo, não arrisca nada. Selos de
Chambers e IFLR presentes, como em quase todos.

**Para o B&M.** O modelo da headline é aproveitável quase literalmente — "o
escritório de [área] de Maringá" diz mais do que qualquer tagline abstrata. E a
newsletter com escolha de tema é detalhe de respeito que custa pouco.

---

## Síntese — o que fazer com isso no B&M

### Cinco padrões que se repetem e valem adotar

1. **Publicação com nome próprio.** Radar Lefosse, Inteligência Jurídica,
   Centro de Inteligência, Perspectives, Em Foco, Insights. É praticamente
   unânime, e o motivo é bom: "Artigos" é uma pasta, um nome é um produto.
2. **Iniciativa nomeada vira aba.** TFInclusão, ThinkFuture, Move, Catalyze,
   Fuse, Orrick Tech Studio, WW++. Quando algo importa, ganha nome e lugar no
   menu — não vira parágrafo enterrado no "Sobre nós".
3. **Diretório com filtro é padrão técnico.** Todos os que têm volume oferecem
   busca e filtro. O melhor conjunto é o do Veirano (inclui idioma falado); o
   melhor card é o do Machado Meyer (foto, cargo, cidade, e-mail, telefone, área,
   PDF, vCard, LinkedIn).
4. **Neutro quente no lugar do cinza.** Freshfields (bege-oliva), BMA (bege),
   TozziniFreire (bege como apoio). É o que separa "elegante e acolhedor" de
   "elegante e frio" — a tensão exata que o Juscelino pediu.
5. **Um acento só.** Paul Weiss (vermelho sobre marinho), TozziniFreire (coral),
   Pinheiro Neto (terracota), Souto Correa (laranja), Machado Meyer (amarelo).
   Nunca dois. Quem usa cinco, como o Veirano, perde hierarquia.

### Sete ideias específicas para roubar

| Ideia | Onde vi | Por que serve ao B&M |
|---|---|---|
| Navegação por **situação do cliente**, não por área do direito | Gunderson Dettmer (Early-Stage, Late-Stage…) | "Estou me separando", "Recebi cobrança indevida" — quem procura advogado descreve o problema, não a área |
| **Convite sem compromisso** como CTA | Kümmerlein ("Unverbindlich kennenlernen") | Tira o atrito do primeiro contato sem dizer "consulta gratuita", que a OAB proíbe |
| **Glossário jurídico para leigos** | Latham (Book of Jargon) | Conteúdo que serve ao leitor, gera busca orgânica e não fere nenhuma regra |
| **Campo "Admissões"** no perfil | Veirano | Lugar natural para o número de inscrição na OAB que o Provimento 205 exige |
| **Tempo de leitura** no artigo | Orrick | Cortesia barata que aumenta clique |
| **Filtro de publicações por autor** | Bersay | Com dois sócios, cada um constrói um corpo de texto identificável |
| **Botão de pausar movimento** | Cooley | Acessibilidade real; obrigatório se houver qualquer animação automática |

### O que evitar, com nome e endereço

- **Prêmio no hero** — Sullivan & Cromwell, Machado Meyer, Walder Wyss. Fala de
  si antes de falar do problema de quem chega. No Brasil, ainda esbarra na OAB.
- **Contador animado e número grande** — TozziniFreire (Odometer), Lefosse
  (+400 bilhões), Souto Correa (+200 advogados), Fenwick (40%, 25B+).
- **Logo de cliente como prova social** — TozziniFreire, Kümmerlein, Fenwick.
  Aqui tangencia a proibição de divulgar carteira de clientes.
- **Foto de banco de imagens** — Stocche Forbes (com crédito Unsplash visível no
  código), A&O Shearman (Getty), Latham. O divisor de águas mais claro entre site
  premiado e site mediano.
- **Menu-organograma** — Pinheiro Neto (12 abas), Trench Rossi (10), Freshfields
  e Paul Weiss (9). O visitante não conhece a estrutura interna do escritório.
- **Newsletter como CTA principal** — Cooley, Goodwin, Walder Wyss, BMA. Quem
  chega com um problema jurídico não quer assinar boletim.
- **Playfair Display e Montserrat** — Kirkland e BMA. São as fontes gratuitas mais
  usadas da web; em site de escritório, leem como template.
- **Promessa de resultado** — Demarest ("Construa conosco uma história de
  sucesso"). Se uma banca desse porte escorrega, o B&M precisa de revisão dupla.
- **Certificado vencido** — Minerva. Renovação automática entra no escopo de
  manutenção.

### O achado de compliance

**Nenhum dos doze sites brasileiros exibe o número de inscrição na OAB.** O
Veirano chega mais perto, citando o estado de admissão no perfil; o Stocche Forbes
escreve "Membro da Ordem dos Advogados do Brasil" sem número. Registro da
sociedade também não aparece em nenhum.

Ou seja: **não há padrão de mercado para copiar** nesse ponto. Duas leituras.
A primeira é que o B&M vai desenhar isso do zero — e o card do Machado Meyer é o
melhor lugar, já que comporta o dado sem poluir. A segunda é que cumprir o
Provimento 205 à risca é, por si só, um diferencial visível de seriedade num
mercado onde ninguém cumpre.

### Correções à `docs/PESQUISA.md`

Quatro afirmações daquele documento não se sustentam nos dados coletados agora:

1. **"Nenhum site pesquisado usa serifada como fonte de interface."** Pinheiro
   Neto usa `capitolium-2` em h1–h6 e Veirano usa Merriweather nos títulos. No
   exterior, Cravath (Bembo), Slaughter and May, Freshfields, Paul Weiss
   (Untitled Serif), Clifford Chance (New Baskerville itálico) e Kirkland
   (Playfair) fazem o mesmo. **Serifada em título é caminho legítimo, não exceção.**
2. **"Azul-marinho + branco + cinza domina esmagadoramente."** Vale menos do que
   parecia: Machado Meyer usa amarelo sobre grafite, Souto Correa usa laranja,
   BMA usa bege, Pinheiro Neto usa terracota, Mattos Filho foi rebrandeado em
   laranja e roxo. Fora do Brasil, Slaughter and May é roxo, Freshfields é
   bege-oliva e Latham é vermelho.
3. **"Souto Correa usa fotografia abstrata com texto sobreposto."** O site hoje
   mostra banners com pessoas e headshots posados individuais.
4. **Kanzlei am Kai e Minerva.** A primeira fica em **Viena**, no domínio `.at`
   (não em Zurique, `.ch`), e usa fotos coloridas com dourado — não preto e branco.
   A segunda fica em **Roterdã** (não Amsterdã) e está com o certificado vencido.

Essas correções ainda **não** foram aplicadas na `docs/PESQUISA.md`.
