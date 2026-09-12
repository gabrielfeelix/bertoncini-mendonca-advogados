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
    'Advocacia em Maringá, PR, com atuação em Direito de Família e ' +
    'Compliance. Atendimento presencial e online para todo o Paraná.',
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
  atendimento: 'Online, para todo o Paraná',
  // Mesma informação de `atendimento`, já na forma de frase para o rodapé
  // (protótipo, linha 862): escrita à mão para não depender de
  // .toLowerCase()/.toUpperCase() em cima de "Paraná", que é nome próprio.
  atendimentoRodape: 'Atendimento online para todo o estado',

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
  { rotulo: 'Áreas de atuação', href: '/areas/' },
  { rotulo: 'O escritório', href: '/escritorio/' },
  { rotulo: 'Textos', href: '/textos/' },
  { rotulo: 'Contato', href: '/contato/' },
] as const;

/** Colunas do rodapé, migradas do protótipo com rotas reais em vez de âncoras. */
export const rodape = {
  navegar: [
    { rotulo: 'Áreas de atuação', href: '/areas/' },
    { rotulo: 'O escritório', href: '/escritorio/' },
    { rotulo: 'Textos', href: '/textos/' },
    { rotulo: 'Contato', href: '/contato/' },
  ],
  legal: [
    { rotulo: 'Política de privacidade', href: '/politica-de-privacidade/' },
    { rotulo: 'Política de cookies', href: '/politica-de-cookies/' },
  ],
} as const;
