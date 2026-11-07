/**
 * Idiomas do site: português (raiz) e inglês (/en/).
 *
 * Tudo o que é texto fixo de interface mora aqui, nas duas línguas, para
 * os componentes e as "views" (src/views) servirem as duas versões com a
 * mesma marcação. O conteúdo longo fica fora daqui: as áreas em inglês
 * estão em src/content/areas-en, e as políticas em src/pages/en/.
 *
 * O blog é só em português. Na versão em inglês ele não entra no menu, e o
 * seletor PT · EN numa página do blog leva para a home em inglês.
 *
 * REGRA: a versão em inglês diz o mesmo que a portuguesa, nada a mais.
 * Sem promessa de resultado e sem superlativo (Provimento 205/2021 da OAB).
 */
import { site } from './site';

export type Idioma = 'pt' | 'en';

/** Pares de páginas fixas: endereço em português → endereço em inglês. */
const PARES: Record<string, string> = {
  '/': '/en/',
  '/escritorio/': '/en/firm/',
  '/areas/': '/en/practice-areas/',
  '/contato/': '/en/contact/',
  '/politica-de-privacidade/': '/en/privacy-policy/',
  '/politica-de-cookies/': '/en/cookie-policy/',
};

/** Endereço de uma página fixa no idioma pedido. A chave é sempre o endereço em português. */
export function rota(lang: Idioma, caminhoPt: string): string {
  return lang === 'en' ? (PARES[caminhoPt] ?? '/en/') : caminhoPt;
}

/** Endereço da página de uma área. */
export function rotaArea(lang: Idioma, slug: string): string {
  return lang === 'en' ? `/en/practice-areas/${slug}/` : `/areas/${slug}/`;
}

const pt = {
  htmlLang: 'pt-BR',
  locale: 'pt_BR',
  descricao: site.descricao as string,
  atendimento: site.atendimentoRodape as string,
  presencialEm: 'e presencial em',
  horario: site.horario as string,
  aviso: site.avisoInformativo as string,
  outrasAreas: site.outrasAreas as readonly string[],
  nav: [
    { rotulo: 'Início', chave: '/' },
    { rotulo: 'O escritório', chave: '/escritorio/' },
    { rotulo: 'Áreas de atuação', chave: '/areas/', submenu: true },
    { rotulo: 'Blog', chave: '/blog/' },
    { rotulo: 'Contato', chave: '/contato/' },
  ],
  topo: {
    inicioAria: 'página inicial',
    menu: 'Menu',
    menuAria: 'Menu principal',
    faleConosco: 'Fale conosco',
    idiomaAria: 'Idioma do site',
  },
  rodape: {
    redesAria: 'Redes e canais',
    institucional: 'Institucional',
    inicio: 'Início',
    links: [
      { rotulo: 'O escritório', chave: '/escritorio/' },
      { rotulo: 'Blog', chave: '/blog/' },
      { rotulo: 'Contato', chave: '/contato/' },
    ],
    areas: 'Áreas de atuação',
    contato: 'Contato',
    inscrita: 'Sociedade inscrita na',
    politicas: [
      { rotulo: 'Política de privacidade', chave: '/politica-de-privacidade/' },
      { rotulo: 'Política de cookies', chave: '/politica-de-cookies/' },
    ],
  },
  migalhas: { inicio: 'Início', aria: 'Você está em' },
  chamada: {
    titulo: 'Precisa de <strong>orientação jurídica?</strong>',
    texto: 'Conte o seu caso. Respondemos pelo e-mail que você informar.',
    botao: 'Fale conosco',
  },
  hero: {
    aria: 'Destaques',
    slide: (n: number, total: number) => `${n} de ${total}`,
    titulo:
      'Advocacia em <strong>Planejamento Patrimonial e Sucessório</strong> e em <strong>Direito Digital</strong>',
    conhecaEscritorio: 'Conheça o escritório',
    conhecaArea: 'Conheça a área',
    faleConosco: 'Fale conosco',
    anterior: 'Slide anterior',
    proximo: 'Próximo slide',
    irPara: (n: number) => `Ir para o slide ${n}`,
    pausar: 'Pausar a troca automática',
    retomar: 'Retomar a troca automática',
  },
  socio: { o: 'Sócio', a: 'Sócia', retrato: 'Retrato de' },
  home: {
    titulo: `${site.nome} | Maringá/PR`,
    areasTitulo: 'Áreas de <strong>Atuação</strong>',
    areasApoio: 'Conheça abaixo as áreas em que o escritório atua.',
    paraQuem: 'Para quem:',
    verMais: 'Ver mais →',
    tambem: 'Também atuamos em',
    sobreRotulo: 'O escritório',
    sobreTitulo: 'Sobre <strong>nós</strong>',
    sobre: [
      `Bertoncini & Mendonça é um escritório de advocacia de ${site.cidade}/${site.estado}. Os sócios, Juscelino Bertoncini e Beatriz Mendonça, atuam juntos nas duas áreas do escritório.`,
      'Nossa missão é ajudar pessoas, famílias e empresas a construir, proteger e transmitir o seu patrimônio com segurança, planejamento e tranquilidade.',
      `${site.atendimentoRodape}, e presencial em ${site.cidade}.`,
    ],
    saibaMais: 'Saiba mais',
    sociosTitulo: 'Nossos <strong>Sócios</strong>',
    fotoSocios: 'Juscelino Bertoncini e Beatriz Mendonça, sócios do escritório.',
  },
  escritorio: {
    titulo: `O escritório | ${site.nome}`,
    descricao:
      'Quem somos: os sócios de Bertoncini & Mendonça Advogados, em Maringá/PR, com formação, inscrição na OAB e áreas de atuação.',
    banner: 'O <strong>Escritório</strong>',
    migalha: 'O escritório',
    rotulo: 'Quem somos',
    intro: `Escritório de advocacia de ${site.cidade}/${site.estado}. Os sócios, Juscelino Bertoncini e Beatriz Mendonça, atuam juntos nas duas áreas do escritório:`,
    e: 'e',
    tambem: 'Também atuamos em',
    missaoTitulo: 'Nossa <strong>Missão</strong>',
    missao:
      'Ajudar pessoas, famílias e empresas a construir, proteger e transmitir o seu patrimônio com segurança, planejamento e tranquilidade.',
    valores: [
      { nome: 'Respeito', texto: 'Tratamos cada pessoa, a sua história, as suas escolhas e os seus interesses com consideração, escuta e seriedade.' },
      { nome: 'Igualdade', texto: 'Toda pessoa merece o mesmo respeito e a mesma dedicação, qualquer que seja a sua origem, condição ou posição social.' },
      { nome: 'Dignidade', texto: 'Por trás de cada patrimônio, conflito ou decisão jurídica existe uma pessoa, uma família e uma história, e é assim que as tratamos.' },
    ],
    sociosTitulo: 'Nossos <strong>Sócios</strong>',
    formacao: 'Formação',
    bios: [
      'Especialista em Direito Empresarial e em Advocacia Consultiva. Trabalha na fase que antecede o processo (contratos, pareceres, estruturação de operações, imóveis e organização do patrimônio) para que o problema não se consolide.',
      'Especialista em Direito Processual Civil e pós-graduanda em Direito Digital. Tem experiência em processos judiciais estratégicos e conduz os casos que precisam ir ao Judiciário. Atende quem trabalha e ganha dinheiro na internet.',
    ],
    formacoes: [
      [
        'Bacharel em Direito pela Universidade Estadual de Maringá (UEM)',
        'Especialista em Direito Empresarial pela PUC/RS',
        'Especialista em Advocacia Consultiva pela Legale',
        'Pós-graduando em Direito Imobiliário pela i9',
      ],
      [
        'Bacharel em Direito pela Universidade Estadual de Maringá (UEM)',
        'Especialista em Direito Processual Civil pela PUC/RS',
        'Pós-graduanda em Direito Digital pela i9',
      ],
    ],
  },
  areas: {
    titulo: `Áreas de atuação | ${site.nome}`,
    descricao:
      'As áreas de atuação de Bertoncini & Mendonça Advogados: Planejamento Patrimonial e Sucessório e Direito Digital.',
    banner: 'Áreas de <strong>Atuação</strong>',
    migalha: 'Áreas de atuação',
    servicos: 'Serviços',
    paraQuem: 'Para quem',
    oQueFazemos: 'O que fazemos',
    perguntas: 'Perguntas frequentes',
    listaAreas: 'Áreas de atuação',
    quemAtende: 'Quem atende',
    tambem: 'Também atuamos em',
    faleTitulo: 'Fale conosco',
    faleTexto: 'Conte o seu caso. Respondemos pelo e-mail que você informar.',
    enviar: 'Enviar mensagem',
    verMais: 'Ver mais',
    conhecaArea: 'Conheça a área',
    faleConosco: 'Fale conosco',
    tambemApoio: 'Além das duas áreas acima, o escritório também atende em:',
  },
  contato: {
    titulo: `Contato | ${site.nome}`,
    descricao:
      'Fale com Bertoncini & Mendonça Advogados. Atendimento online para todo o país e presencial em Maringá/PR.',
    banner: 'Fale <strong>Conosco</strong>',
    migalha: 'Contato',
    h2: 'Envie sua mensagem',
    apoio: 'Preencha o formulário. Um dos sócios lê e responde pelo e-mail que você informar.',
    nome: 'Nome',
    telefone: 'Telefone',
    email: 'E-mail',
    assunto: 'Assunto',
    perfil: 'Quem está escrevendo',
    perfis: ['Pessoa física', 'Empresa'],
    mensagem: 'Mensagem',
    conheceu: 'Como conheceu o escritório',
    origens: ['Indicação de alguém', 'Instagram', 'Google', 'YouTube', 'LinkedIn', 'Outro'],
    outroAssunto: 'Outro assunto',
    naoSei: 'Ainda não sei',
    selecione: 'Selecione',
    enviar: 'Enviar mensagem',
    nota: 'Enviar esta mensagem não estabelece relação de patrocínio nem substitui uma consulta. Os dados são tratados como descreve a',
    notaLink: 'política de privacidade',
    canais: 'Contato',
    fone: 'Telefone e WhatsApp',
    whats: 'Conversar pelo WhatsApp',
    instagram: 'Instagram',
    horarioRotulo: 'Horário',
    atendimentoRotulo: 'Atendimento',
    ok: 'Recebemos a sua mensagem. A resposta vai para o e-mail que você informou.',
    enviando: 'Enviando a mensagem.',
    semConexao: 'Sem conexão no momento. Tente de novo em instantes.',
    corte: 'o seu relato era longo demais para voltar inteiro e aparece cortado abaixo. Confira antes de enviar de novo.',
    atencao: 'Atenção:',
    erros: {
      faltando: 'Faltou o nome ou a mensagem. Preencha os dois campos e envie de novo.',
      email: 'O e-mail informado não parece completo. Confira e envie de novo.',
      limite: 'Recebemos vários envios seguidos deste aparelho. Aguarde alguns minutos e tente de novo.',
      envio: 'Não foi possível enviar a mensagem agora. Tente de novo em instantes.',
      formato: 'O formulário não chegou completo. Recarregue a página e tente de novo.',
    } as Record<string, string>,
  },
  cookies: undefined as undefined | Record<string, unknown>,
};

type Textos = typeof pt;

const en: Textos = {
  htmlLang: 'en',
  locale: 'en_US',
  descricao:
    'Law firm practicing Estate and Succession Planning and Digital Law. Online service throughout Brazil and in person in Maringá, Paraná.',
  atendimento: 'Online service throughout Brazil',
  presencialEm: 'and in person in',
  horario: 'Monday to Friday, 9 a.m. to 6 p.m. (Brasília time)',
  aviso:
    'The information on this website is for informational purposes only and does not replace a legal analysis of each individual situation.',
  outrasAreas: [
    'Contracts',
    'Corporate law',
    'Real estate law',
    'Corporate legal advisory',
    'Compliance and governance',
    'Civil law',
  ],
  nav: [
    { rotulo: 'Home', chave: '/' },
    { rotulo: 'The firm', chave: '/escritorio/' },
    { rotulo: 'Practice areas', chave: '/areas/', submenu: true },
    { rotulo: 'Contact', chave: '/contato/' },
  ],
  topo: {
    inicioAria: 'home page',
    menu: 'Menu',
    menuAria: 'Main menu',
    faleConosco: 'Contact us',
    idiomaAria: 'Website language',
  },
  rodape: {
    redesAria: 'Social media and channels',
    institucional: 'The firm',
    inicio: 'Home',
    links: [
      { rotulo: 'About us', chave: '/escritorio/' },
      { rotulo: 'Contact', chave: '/contato/' },
    ],
    areas: 'Practice areas',
    contato: 'Contact',
    inscrita: 'Registered with the',
    politicas: [
      { rotulo: 'Privacy policy', chave: '/politica-de-privacidade/' },
      { rotulo: 'Cookie policy', chave: '/politica-de-cookies/' },
    ],
  },
  migalhas: { inicio: 'Home', aria: 'You are here' },
  chamada: {
    titulo: 'Need <strong>legal guidance?</strong>',
    texto: 'Tell us about your case. We reply to the e-mail address you provide.',
    botao: 'Contact us',
  },
  hero: {
    aria: 'Highlights',
    slide: (n, total) => `${n} of ${total}`,
    titulo: 'Practicing <strong>Estate and Succession Planning</strong> and <strong>Digital Law</strong>',
    conhecaEscritorio: 'About the firm',
    conhecaArea: 'About this area',
    faleConosco: 'Contact us',
    anterior: 'Previous slide',
    proximo: 'Next slide',
    irPara: (n) => `Go to slide ${n}`,
    pausar: 'Pause automatic rotation',
    retomar: 'Resume automatic rotation',
  },
  socio: { o: 'Partner', a: 'Partner', retrato: 'Portrait of' },
  home: {
    titulo: `${site.nome} | Maringá, Brazil`,
    areasTitulo: 'Practice <strong>Areas</strong>',
    areasApoio: 'The areas in which the firm practices.',
    paraQuem: 'For:',
    verMais: 'Learn more →',
    tambem: 'We also practice',
    sobreRotulo: 'The firm',
    sobreTitulo: 'About <strong>us</strong>',
    sobre: [
      'Bertoncini & Mendonça is a law firm based in Maringá, in the state of Paraná, Brazil. Its partners, Juscelino Bertoncini and Beatriz Mendonça, work together in both of the firm’s practice areas.',
      'Our mission is to help individuals, families and companies build, protect and pass on their assets with security, planning and peace of mind.',
      'We serve clients throughout Brazil online, and in person in Maringá.',
    ],
    saibaMais: 'Learn more',
    sociosTitulo: 'Our <strong>Partners</strong>',
    fotoSocios: 'Juscelino Bertoncini and Beatriz Mendonça, partners of the firm.',
  },
  escritorio: {
    titulo: `The firm | ${site.nome}`,
    descricao:
      'About us: the partners of Bertoncini & Mendonça Advogados, in Maringá, Brazil, with their education, Bar registration and practice areas.',
    banner: 'The <strong>Firm</strong>',
    migalha: 'The firm',
    rotulo: 'About us',
    intro:
      'A law firm based in Maringá, Paraná, Brazil. Its partners, Juscelino Bertoncini and Beatriz Mendonça, work together in both of the firm’s practice areas:',
    e: 'and',
    tambem: 'We also practice',
    missaoTitulo: 'Our <strong>Mission</strong>',
    missao:
      'To help individuals, families and companies build, protect and pass on their assets with security, planning and peace of mind.',
    valores: [
      { nome: 'Respect', texto: 'We treat every person, their story, their choices and their interests with consideration, attentive listening and seriousness.' },
      { nome: 'Equality', texto: 'Every person deserves the same respect and the same dedication, whatever their origin, circumstances or social position.' },
      { nome: 'Dignity', texto: 'Behind every estate, dispute or legal decision there is a person, a family and a story, and that is how we treat them.' },
    ],
    sociosTitulo: 'Our <strong>Partners</strong>',
    formacao: 'Education',
    bios: [
      'Specialist in Business Law and in Advisory Legal Practice. Works on the stage before any lawsuit (contracts, legal opinions, transaction structuring, real estate and asset organization) so that problems do not take hold.',
      'Specialist in Civil Procedure and graduate student in Digital Law. Has experience in strategic litigation and handles the cases that need to go to court. Advises people who work and earn their living online.',
    ],
    formacoes: [
      [
        'Bachelor of Laws, State University of Maringá (UEM)',
        'Specialization in Business Law, PUC/RS',
        'Specialization in Advisory Legal Practice, Legale',
        'Graduate studies in Real Estate Law (in progress), i9',
      ],
      [
        'Bachelor of Laws, State University of Maringá (UEM)',
        'Specialization in Civil Procedure, PUC/RS',
        'Graduate studies in Digital Law (in progress), i9',
      ],
    ],
  },
  areas: {
    titulo: `Practice areas | ${site.nome}`,
    descricao:
      'The practice areas of Bertoncini & Mendonça Advogados: Estate and Succession Planning and Digital Law.',
    banner: 'Practice <strong>Areas</strong>',
    migalha: 'Practice areas',
    servicos: 'Services',
    paraQuem: 'Who it is for',
    oQueFazemos: 'What we do',
    perguntas: 'Frequently asked questions',
    listaAreas: 'Practice areas',
    quemAtende: 'Your attorneys',
    tambem: 'We also practice',
    faleTitulo: 'Contact us',
    faleTexto: 'Tell us about your case. We reply to the e-mail address you provide.',
    enviar: 'Send a message',
    verMais: 'Learn more',
    conhecaArea: 'About this area',
    faleConosco: 'Contact us',
    tambemApoio: 'Beyond the two areas above, the firm also practices in:',
  },
  contato: {
    titulo: `Contact | ${site.nome}`,
    descricao:
      'Contact Bertoncini & Mendonça Advogados. Online service throughout Brazil and in person in Maringá, Paraná.',
    banner: 'Contact <strong>Us</strong>',
    migalha: 'Contact',
    h2: 'Send us a message',
    apoio: 'Fill in the form. One of the partners will read it and reply to the e-mail address you provide. You may write in English.',
    nome: 'Name',
    telefone: 'Phone',
    email: 'E-mail',
    assunto: 'Subject',
    perfil: 'You are writing as',
    perfis: ['An individual', 'A company'],
    mensagem: 'Message',
    conheceu: 'How did you hear about us',
    origens: ['Referral', 'Instagram', 'Google', 'YouTube', 'LinkedIn', 'Other'],
    outroAssunto: 'Other subject',
    naoSei: 'Not sure yet',
    selecione: 'Select',
    enviar: 'Send message',
    nota: 'Sending this message does not create an attorney-client relationship and does not replace a consultation. Your data is handled as described in our',
    notaLink: 'privacy policy',
    canais: 'Contact',
    fone: 'Phone and WhatsApp',
    whats: 'Chat on WhatsApp',
    instagram: 'Instagram',
    horarioRotulo: 'Office hours',
    atendimentoRotulo: 'Service',
    ok: 'We have received your message. Our reply will go to the e-mail address you provided.',
    enviando: 'Sending your message.',
    semConexao: 'No connection right now. Please try again in a moment.',
    corte: 'your message was too long to come back in full and appears cut off below. Please check it before sending again.',
    atencao: 'Please note:',
    erros: {
      faltando: 'Your name or message is missing. Please fill in both fields and send again.',
      email: 'The e-mail address does not look complete. Please check it and send again.',
      limite: 'We received several messages in a row from this device. Please wait a few minutes and try again.',
      envio: 'We could not send your message right now. Please try again in a moment.',
      formato: 'The form did not arrive complete. Please reload the page and try again.',
    },
  },
  cookies: {
    rotulo: 'Cookie notice',
    texto: 'This website uses cookies to measure visits. You choose what to accept.',
    linkRotulo: 'Learn more',
    linkHref: '/en/cookie-policy/',
    ressalva: '',
    opcoes: [
      { consente: 'todos', rotulo: 'Accept all' },
      { consente: 'necessarios', rotulo: 'Necessary only' },
      { consente: 'nenhum', rotulo: 'Reject' },
    ],
  },
};

const TEXTOS: Record<Idioma, Textos> = { pt, en };

/** Textos de interface do idioma pedido. */
export function t(lang: Idioma): Textos {
  return TEXTOS[lang];
}
