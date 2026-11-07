/**
 * Dados canônicos do site. Fonte única para SEO, cabeçalho e rodapé.
 *
 * Todos reais: OAB dos sócios, domínio e Instagram vieram do briefing de
 * 23/09/2026; telefone/WhatsApp, e-mail, CNPJ e registro da sociedade, do
 * retorno do escritório de 06/11/2026. Só a imagem de Open Graph continua
 * marcada `placeholder: true`. Nunca substituir por dado inventado.
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
  // Domínio confirmado no briefing (q8.4).
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

  // Confirmados pelo escritório no retorno de 06/11/2026 (docs/RETORNO-2026-11-06.md, branch v2).
  telefone: { valor: '(44) 98815-7540', placeholder: false } satisfies CampoPlaceholder,
  telefoneE164: { valor: '+5544988157540', placeholder: false } satisfies CampoPlaceholder,
  whatsapp: {
    valor: 'https://wa.me/5544988157540?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20um%20caso.',
    placeholder: false,
  } satisfies CampoPlaceholder,
  email: { valor: 'contato@bertoncinimendonca.adv.br', placeholder: false } satisfies CampoPlaceholder,

  horario: 'Segunda a sexta, 9h às 18h',

  // Registro da sociedade: exigência do Provimento 205/2021 da OAB.
  // Confirmados no retorno de 06/11/2026.
  registro: {
    oabSociedade: { valor: 'OAB/PR nº 24.788', placeholder: false } satisfies CampoPlaceholder,
    cnpj: { valor: '69.076.965/0001-64', placeholder: false } satisfies CampoPlaceholder,
  },

  /* `area` e `linha` alimentam o bloco "Quem atende" da página de cada
     área. A divisão vem do briefing (q2_3) e é a mesma que /escritorio/
     imprime em `atuacao`; `linha` é a bio curta de lá, sem texto novo. */
  socios: [
    {
      nome: 'Juscelino Bertoncini',
      // Briefing q1.7.
      oab: { valor: 'OAB/PR 124.838', placeholder: false } satisfies CampoPlaceholder,
      retrato: '/media/socios/juscelino',
      area: 'planejamento-patrimonial-e-sucessorio',
      linha:
        'Especialista em Direito Empresarial e em Advocacia Consultiva. Trabalha na fase que antecede o processo: contratos, sociedades, imóveis e a organização do patrimônio.',
    },
    {
      nome: 'Beatriz Mendonça',
      oab: { valor: 'OAB/PR 124.839', placeholder: false } satisfies CampoPlaceholder,
      retrato: '/media/socios/beatriz',
      area: 'direito-digital',
      linha:
        'Especialista em Direito Processual Civil e pós-graduanda em Direito Digital. Conduz os casos que precisam ir ao Judiciário e atende quem trabalha na internet.',
    },
  ],

  redes: {
    // Briefing q8.6: @bertoncinimendonca.adv, no ar em 17/11/2026.
    instagram: {
      valor: 'https://www.instagram.com/bertoncinimendonca.adv/',
      placeholder: false,
    } satisfies CampoPlaceholder,
    instagramArroba: '@bertoncinimendonca.adv',
  },

  /* Áreas em que o escritório também atua, fora das duas com página
     própria (retorno de 06/11/2026): ninguém deve concluir que o
     escritório só faz Planejamento Patrimonial e Direito Digital. */
  outrasAreas: [
    'Contratos',
    'Direito societário',
    'Direito imobiliário',
    'Assessoria jurídica empresarial',
    'Compliance e governança',
    'Direito civil',
  ],

  /* Os dois avisos que o escritório pediu como obrigatórios (briefing q9.3).
     O primeiro é o texto deles, palavra por palavra. */
  avisoInformativo:
    'As informações disponibilizadas neste site possuem caráter exclusivamente informativo e não substituem a análise jurídica individualizada de cada situação.',
} as const;

/**
 * Menu do cabeçalho (v3). Ordem clássica de site institucional de
 * escritório: Início, quem somos, o que fazemos, conteúdo, contato.
 * `submenu: 'areas'` abre a lista das áreas, lida da coleção.
 */
export const navegacao = [
  { rotulo: 'Início', href: '/' },
  { rotulo: 'O escritório', href: '/escritorio/' },
  { rotulo: 'Áreas de atuação', href: '/areas/', submenu: 'areas' },
  { rotulo: 'Blog', href: '/blog/' },
  { rotulo: 'Contato', href: '/contato/' },
] as const;

/**
 * Formação de cada sócio, como veio do briefing (q1.7a e q1.7b), palavra
 * por palavra. Vai para os perfis em /escritorio/.
 */
export const formacao: Record<string, readonly string[]> = {
  'Juscelino Bertoncini': [
    'Bacharel em Direito pela Universidade Estadual de Maringá (UEM)',
    'Especialista em Direito Empresarial pela PUC/RS',
    'Especialista em Advocacia Consultiva pela Legale',
    'Pós-graduando em Direito Imobiliário pela i9',
  ],
  'Beatriz Mendonça': [
    'Bacharel em Direito pela Universidade Estadual de Maringá (UEM)',
    'Especialista em Direito Processual Civil pela PUC/RS',
    'Pós-graduanda em Direito Digital pela i9',
  ],
};

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
