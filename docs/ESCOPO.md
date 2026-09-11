# Escopo do Projeto — Site Bertoncini & Mendonça Advogados

> Documento de escopo. **Sem valores financeiros** — o objetivo é deixar claro tudo
> que compõe o projeto. Serve de base para o material que vai ao cliente.
> Versão de 10/09/2026.

---

## Resumo

O que está sendo contratado não é "um site". É a **presença digital completa** de um
escritório que está nascendo: a fundação de marca que ainda não existe, o site em si,
um sistema de publicação próprio, a infraestrutura que o sustenta, e a estrutura para
ser encontrado no Google.

São **7 frentes** de trabalho.

---

## 1. Estratégia e fundação de marca

A identidade visual entregue até aqui cobre logo e cores. Um site precisa de mais que
isso — precisa saber como fala, o que promete e como se apresenta.

- Briefing estruturado com os dois sócios *(questionário de 9 blocos)*
- Consolidação de missão, valores e posicionamento
- **Definição de tipografia institucional** — não existe hoje; o logo usa uma fonte,
  mas não há fonte definida para títulos e textos
- **Tom de voz documentado** — como o escritório escreve, quais palavras usa e evita
- **Direção de fotografia** — orientação para o ensaio: enquadramento, luz, fundo,
  vestuário, expressão. Feita **antes** do ensaio, para que as fotos sirvam ao site
- **Manual de marca** — regras de uso do logo, área de respiro, tamanho mínimo, usos
  proibidos, aplicação das cores, hierarquia tipográfica
- Pesquisa de referências: escritórios brasileiros e internacionais, e referências
  fora do setor jurídico

**Por que importa:** sem isso, cada peça futura — post, apresentação, proposta,
assinatura de e-mail — é decidida do zero e sai diferente. Com isso, tudo que o
escritório produzir vai ter a mesma cara.

---

## 2. UX — arquitetura e experiência

- Definição de objetivos do site e das ações que o visitante deve tomar
- Arquitetura de informação: quais páginas, o que vai em cada uma, como se conectam
- Fluxo de conversão: do primeiro acesso até o contato
- Estrutura de cada página, seção por seção
- **UX writing** — os textos da interface, escritos para serem entendidos por quem
  não é advogado
- Adaptação para celular pensada desde o início, não como ajuste posterior
- Acessibilidade: contraste, tamanho de texto, navegação por teclado, leitores de tela

---

## 3. UI — design da interface

- **Design system próprio** — cores, tipografia, espaçamentos, botões, cards,
  formulários, todos derivados da identidade do escritório
- Design de todas as páginas, em desktop e celular
- Design da área de artigos: listagem, artigo individual, categorias
- Tratamento visual das fotografias
- Estados de interação: passar o mouse, carregando, erro, formulário enviado
- Movimento e transições — usados com contenção, para dar sofisticação sem distrair

**Sobre o "não parecer feito por IA":** é critério central do projeto. Sites gerados
sem direção têm marcas reconhecíveis — mesmos espaçamentos, mesmos gradientes, mesma
estrutura de seções, ícones genéricos. A defesa contra isso é ter um design system
próprio, derivado da marca real, com decisões tomadas caso a caso.

---

## 4. Desenvolvimento do site

- Programação completa do site
- **Performance** — site estático, carregamento rápido, imagens otimizadas.
  Velocidade afeta diretamente a posição no Google
- Responsividade real, testada em vários tamanhos de tela
- Compatibilidade entre navegadores
- Formulário de contato funcional, com validação e proteção contra spam
- Integração com WhatsApp
- **Banner de cookies** com as três opções: aceitar todos, apenas necessários, rejeitar
  *(o texto da política vem do Juscelino; a implementação é nossa)*
- Páginas legais: política de privacidade, termos de uso

---

## 5. CMS — sistema de publicação próprio

O escritório publica os artigos sozinho, num painel próprio. Sem WordPress, sem plugin,
sem mensalidade de plataforma.

- Painel de administração em endereço próprio
- Login seguro, com recuperação de senha
- **Editor de texto rico** — escrever, formatar, inserir imagens e links, como num
  editor de documentos
- Gestão de artigos: criar, editar, salvar rascunho, publicar, despublicar
- Upload e otimização automática de imagens
- Categorias por área do direito
- **Dois autores** — Juscelino e Bia publicam com assinatura própria
- Cálculo automático de tempo de leitura
- Banco de dados e controle de permissões
- Treinamento de uso ao final

**Vantagem:** o conteúdo é do escritório, num sistema que não cobra mensalidade e não
quebra com atualização de plugin.

---

## 6. Infraestrutura

Criação e configuração de todas as contas e serviços:

| Serviço | Para quê |
|---|---|
| **Domínio** | O endereço do site. Auxílio na escolha e registro *(o `.adv.br` é exclusivo de advogados)* |
| **Hospedagem (Vercel)** | Onde o site fica no ar. Rápida, com certificado de segurança automático |
| **Banco de dados (Supabase)** | Onde os artigos ficam guardados |
| **E-mail profissional** | Orientação para configurar o e-mail no domínio próprio |
| **Certificado SSL** | O cadeado de segurança do navegador |
| **Backup** | Rotina de cópia de segurança do conteúdo |

Todas as contas ficam **no nome do escritório** — vocês são donos de tudo.

---

## 7. SEO e presença no Google

Ser encontrado por quem busca. É aqui que o blog vira captação de cliente.

**SEO técnico**
- Estrutura de endereços limpa e legível
- Títulos e descrições otimizados por página
- Mapa do site enviado ao Google
- **Dados estruturados** — marcação que informa ao Google que isto é um escritório
  de advocacia, onde fica, quem são os advogados. É o que gera os resultados
  destacados na busca
- Otimização de velocidade *(fator direto de posicionamento)*
- Pré-visualização correta ao compartilhar o link no WhatsApp e redes

**SEO de conteúdo**
- Estrutura dos artigos pensada para posicionar
- Orientação de como escrever artigos que rankeiam
- Ligação entre artigos e áreas de atuação

**Ferramentas configuradas**
| Ferramenta | Para quê |
|---|---|
| **Google Search Console** | Como o Google enxerga o site, quais buscas trazem visitantes |
| **Google Analytics 4** | Quantas pessoas visitam, de onde vêm, o que fazem |
| **Microsoft Clarity** | Gravação de sessões e mapa de calor — ver onde as pessoas clicam e onde desistem |
| **Google Meu Negócio** | Aparecer no Google Maps e na busca local por "advogado em Maringá" |

---

## Fora do escopo

Para deixar claro desde já:

- Redação dos artigos do blog *(o Juscelino já está escrevendo)*
- Redação da política de privacidade e termos *(o Juscelino redige)*
- Ensaio fotográfico *(irmão da Bia) — entregamos a direção, não a execução*
- Produção de vídeo
- Gestão de redes sociais e criação de posts
- Campanhas pagas
- Peças gráficas impressas
- Redesenho do logo *(a identidade existente será respeitada)*

---

## Dependências do cliente

O projeto anda na velocidade dessas entregas:

1. Questionário de briefing respondido pelos **dois sócios**
2. Missão, valores e histórias pessoais
3. Arquivo de briefing do marketing *(público-alvo e tom de voz)*
4. **Logo em arquivo vetorial** — os arquivos atuais são PNG em tamanho de post de
   Instagram; não servem para web nem para impressão
5. Referências de sites que gostam e que não gostam
6. Fotografias do ensaio
7. Texto da política de privacidade e aviso de cookies
8. Dados definitivos: endereço, contatos, CNPJ, inscrições na OAB
9. Aprovação nas etapas de validação
