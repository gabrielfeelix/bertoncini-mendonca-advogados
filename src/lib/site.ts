/**
 * Dados canônicos do site. Fonte única para SEO, cabeçalho e rodapé.
 *
 * ATENÇÃO: telefone, e-mail, OAB de cada sócio, CNPJ e registro da
 * sociedade AINDA NÃO EXISTEM. Os valores abaixo são exatamente os
 * placeholders do protótipo aprovado (`prototipo/index.html`) e cada um
 * está marcado com `placeholder: true` para a Tarefa 15 conseguir
 * inventariá-los antes da publicação. Nunca substituir por um dado
 * inventado — só pelo dado real, quando o escritório fornecer.
 *
 * O domínio `bertoncinimendonca.adv.br` também é placeholder; já está
 * marcado como tal em `astro.config.mjs`.
 */

/** Um campo de contato que pode ainda não ter valor definitivo. */
interface CampoPlaceholder {
  valor: string;
  placeholder: boolean;
}

export const site = {
  nome: 'Bertoncini & Mendonça Advogados',
  nomeCurto: 'Bertoncini & Mendonça',
  nomeSociedade: 'Bertoncini & Mendonça Sociedade de Advogados',
  // Placeholder: domínio final ainda não confirmado com o escritório
  // (mesmo valor de astro.config.mjs).
  url: 'https://www.bertoncinimendonca.adv.br',
  descricao:
    'Advocacia com atuação em Planejamento Patrimonial e Sucessório e em ' +
    'Direito Digital. Atendimento online para todo o país e presencial em Maringá, PR.',
  idioma: 'pt-BR',
  locale: 'pt_BR',
  // Placeholder: imagem de Open Graph genérica (fundo azul + nome em texto),
  // criada só para a tag og:image nunca apontar para um arquivo inexistente
  // (o WhatsApp é o canal principal do escritório e usa essa prévia). Não é
  // arte aprovada pelo cliente — troca por uma foto/arte real antes de
  // publicar.
  imagemPadrao: { valor: '/og-padrao.jpg', placeholder: true } satisfies CampoPlaceholder,

  cidade: 'Maringá',
  estado: 'PR',
  atendimento: 'Online, para todo o país',
  // Mesma informação de `atendimento`, já na forma de frase para o rodapé
  // (protótipo, linha 862), escrita à mão em vez de derivada por
  // .toLowerCase()/.toUpperCase(). Briefing q2_5: atendem todo o país,
  // presencialmente em Maringá.
  atendimentoRodape: 'Atendimento online para todo o país',

  // Placeholders do protótipo (`(44) 0000 0000`, `contato@exemplo.adv.br`).
  telefone: { valor: '(44) 0000 0000', placeholder: true } satisfies CampoPlaceholder,
  telefoneE164: { valor: '+5544000000000', placeholder: true } satisfies CampoPlaceholder,
  whatsapp: {
    valor: 'https://wa.me/5544000000000?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20um%20caso.',
    placeholder: true,
  } satisfies CampoPlaceholder,
  email: { valor: 'contato@exemplo.adv.br', placeholder: true } satisfies CampoPlaceholder,

  horario: 'Segunda a sexta, 9h às 18h',

  // Registro da sociedade: exigência do Provimento 205/2021 da OAB.
  // Placeholders do protótipo, marcados para a Tarefa 15 substituir.
  registro: {
    oabSociedade: { valor: 'OAB/PR nº 0.000', placeholder: true } satisfies CampoPlaceholder,
    cnpj: { valor: '00.000.000/0001-00', placeholder: true } satisfies CampoPlaceholder,
  },

  socios: [
    {
      nome: 'Juscelino Bertoncini',
      oab: { valor: 'OAB/PR 000.000', placeholder: true } satisfies CampoPlaceholder,
    },
    {
      nome: 'Beatriz Mendonça',
      oab: { valor: 'OAB/PR 000.000', placeholder: true } satisfies CampoPlaceholder,
    },
  ],

  redes: {
    // Placeholder: link do Instagram ainda não fornecido (o protótipo usa "#").
    instagram: { valor: '#', placeholder: true } satisfies CampoPlaceholder,
  },
} as const;

/**
 * Menu do cabeçalho. Cinco itens, na ordem decidida com o cliente: a
 * navbar em ilhas do protótipo foi revogada, esta é a navbar nova (barra
 * cheia fixa), com links para páginas reais em vez de âncoras.
 */
export const navegacao = [
  /* `submenu: 'areas'` diz à navbar que este item abre o menu das áreas ao
     passar o mouse. As áreas em si vêm da coleção, não daqui: a navbar as
     lê para uma terceira área aparecer sozinha. */
  { rotulo: 'Áreas de atuação', href: '/areas/', submenu: 'areas' },
  { rotulo: 'O escritório', href: '/escritorio/' },
  { rotulo: 'Blog', href: '/blog/' },
  { rotulo: 'Contato', href: '/contato/' },
] as const;

/**
 * Colunas do rodapé.
 *
 * Os rótulos eram "Navegar", "Falar", "Onde" e "Legal", e o cliente
 * reprovou os quatro. O defeito não era o texto de cada um, era a classe
 * gramatical: três são verbo ou advérbio onde a convenção brasileira usa
 * SUBSTANTIVO — o rótulo nomeia uma categoria de conteúdo, não dá uma
 * instrução ao leitor. "Legal" tem um problema a mais: em português
 * colide com o coloquial ("que legal"), e o leitor precisa reler para
 * entender que se trata de documento jurídico.
 *
 * Levantamento de seis escritórios brasileiros (Velloza, Demarest,
 * Lefosse, BMA, Galvão & Silva, Daniel Frederighi): o vocabulário é
 * consistente — "Institucional" para o bloco sobre o escritório,
 * "Áreas de atuação", "Contato". Nenhum deles tem coluna "Legal": as
 * políticas são links soltos na barra de baixo, que é onde elas entraram
 * aqui.
 *
 * `institucional` também não repete o menu do cabeçalho item a item: uma
 * coluna que só espelha a navegação principal não acrescenta caminho
 * nenhum.
 */
export const rodape = {
  institucional: [
    { rotulo: 'O escritório', href: '/escritorio/' },
    { rotulo: 'Blog', href: '/blog/' },
    { rotulo: 'Contato', href: '/contato/' },
  ],
  /* Barra de baixo, junto do copyright — não é coluna. */
  legal: [
    { rotulo: 'Política de privacidade', href: '/politica-de-privacidade/' },
    { rotulo: 'Política de cookies', href: '/politica-de-cookies/' },
  ],
} as const;
