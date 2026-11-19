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
  nav: [
    { rotulo: 'Início', chave: '/' },
    { rotulo: 'O escritório', chave: '/escritorio/' },
    { rotulo: 'Áreas de atuação', chave: '/areas/', submenu: true },
    { rotulo: 'Central de Conteúdos', chave: '/conteudos/' },
  ],
  topo: {
    inicioAria: 'página inicial',
    menu: 'Menu',
    menuAria: 'Menu principal',
    faleConosco: 'Contato',
    idiomaAria: 'Idioma do site',
  },
  rodape: {
    redesAria: 'Redes e canais',
    institucional: 'Institucional',
    inicio: 'Início',
    links: [
      { rotulo: 'O escritório', chave: '/escritorio/' },
      { rotulo: 'Central de Conteúdos', chave: '/conteudos/' },
      { rotulo: 'Contato', chave: '/contato/' },
    ],
    areas: 'Áreas de atuação',
    contato: 'Contato',
    inscrita: 'Sociedade de advogados',
    preferencias: 'Preferências de cookies',
    /* Aviso do golpe reescrito em 18/11/2026: aguarda aprovação dos sócios. */
    golpe: 'Golpe do falso advogado',
    golpeTexto: 'O escritório nunca pede pagamento para liberar valores de processo. Só falamos com você pelo telefone',
    golpeE: 'e pelo e-mail',
    encarregado: 'Encarregado',
    politicas: [
      { rotulo: 'Política de privacidade', chave: '/politica-de-privacidade/' },
      { rotulo: 'Política de cookies', chave: '/politica-de-cookies/' },
    ],
  },
  migalhas: { inicio: 'Início', aria: 'Você está em' },
  chamada: {
    titulo: 'Precisa de <strong>orientação jurídica?</strong>',
    texto: 'Conte o seu caso e retornaremos o contato.',
    botao: 'Fale conosco',
  },
  hero: {
    aria: 'Destaques',
    slide: (n: number, total: number) => `${n} de ${total}`,
    /* Capa institucional: Opção 2 dos sócios (18/11/2026). */
    institucionalTitulo: 'Uma nova perspectiva sobre a advocacia.',
    institucionalTexto:
      'Unimos conhecimento jurídico, inovação e visão estratégica para atender às necessidades de pessoas e empresas em um mundo em constante transformação.',
    conhecaEscritorio: 'Conheça o escritório',
    conhecaArea: 'Conheça a área',
    faleConosco: 'Fale conosco',
    anterior: 'Slide anterior',
    proximo: 'Próximo slide',
    irPara: (n: number) => `Ir para o slide ${n}`,
  },
  socio: { o: 'Sócio', a: 'Sócia', retrato: 'Retrato de' },
  home: {
    titulo: `${site.nome} | Maringá/PR`,
    areasTitulo: 'Áreas de <strong>Atuação</strong>',
    areasApoio: 'Conheça abaixo as áreas em que o escritório atua.',
    bentoTitulo: 'Não sabe por onde <strong>começar?</strong>',
    bentoTexto: 'Conte o seu caso e o escritório indica a área e os próximos passos.',
    bentoBotao: 'Fale com o escritório',
    paraQuem: 'Para quem:',
    verMais: 'Ver mais →',
    sobreRotulo: 'O escritório',
    sobreTitulo: 'Sobre <strong>nós</strong>',
    /* Texto dos sócios de 18/11/2026, palavra por palavra. */
    sobre: [
      'O Bertoncini & Mendonça Advogados é um escritório de advocacia sediado em Maringá/PR, fundado pelos sócios Juscelino Bertoncini e Beatriz Mendonça.',
      'Nossa atuação é pautada pela combinação entre conhecimento jurídico, visão estratégica e compreensão das necessidades de cada cliente. Trabalhamos com pessoas, famílias e empresas, oferecendo assessoria jurídica em diferentes áreas do Direito, com soluções personalizadas para seus desafios, projetos e objetivos.',
      'Acreditamos em uma advocacia próxima, atual e comprometida com a construção de relações sólidas e soluções que geram valor.',
    ],
    saibaMais: 'Saiba mais',
    sociosTitulo: 'Nossos <strong>Sócios</strong>',
    fotoSobre: 'Os sócios Beatriz Mendonça e Juscelino Bertoncini no escritório, diante de uma estante.',
    servicos: 'Serviços',
    conhecaSocios: 'Conheça os sócios',
    ondeRotulo: 'Onde atendemos',
    ondeTitulo: 'Online em todo o <strong>Brasil</strong>, presencial em <strong>Maringá</strong>',
    ondeTexto: [
      'O atendimento é online, por mensagem e por chamada de vídeo, e cobre todas as etapas do caso, para clientes de qualquer cidade do país.',
      'Quando um encontro presencial for necessário, ele acontece em Maringá, no Paraná.',
    ],
    ondeOnline: 'Online',
    ondeOnlineTexto: 'Todo o Brasil, por mensagem e vídeo',
    ondePresencial: 'Presencial',
    ondePresencialTexto: 'Maringá, Paraná',
    mapaDescricao: 'Mapa do Brasil com o Paraná em destaque e Maringá marcada, ligada por linhas a capitais de todas as regiões do país.',
    fotoMaringa: 'A Catedral de Maringá ao anoitecer, vista da avenida.',
    faqTitulo: 'Perguntas <strong>Frequentes</strong>',
    atendimento: [
      { pergunta: 'Quanto custa uma consulta?', resposta: 'Depende do caso. Na primeira conversa entendemos a situação e informamos o valor antes de você assumir qualquer compromisso.' },
      { pergunta: 'Como funciona do primeiro contato até o caso andar?', resposta: 'Você envia uma mensagem contando o que aconteceu. Respondemos marcando uma conversa por vídeo. Nela você recebe as opções, os prazos e o custo. Se decidir seguir, assumimos o caso e informamos cada movimentação.' },
      { pergunta: 'Preciso ir até o escritório?', resposta: 'Não. O atendimento é online, por mensagem e por chamada de vídeo, e isso cobre todas as etapas do caso. Quando um encontro presencial for necessário, combinamos o lugar em Maringá.' },
      { pergunta: 'Quanto tempo demora um processo?', resposta: 'Varia com a vara e com a complexidade. Você recebe uma estimativa realista, com a ressalva de que prazo de tribunal não depende de advogado.' },
      { pergunta: 'Vocês atendem fora de Maringá?', resposta: 'Sim. O atendimento é online e o processo tramita de forma eletrônica na maior parte do tempo, então atendemos clientes de todo o país.' },
    ],
    newsTitulo: 'Receba as nossas <strong>publicações</strong>',
    newsTexto: 'Um e-mail por mês com os textos novos do escritório. Sem propaganda, e você sai quando quiser.',
    newsEmail: 'Seu e-mail',
    newsBotao: 'Inscrever',
    newsOk: 'Inscrição feita. O próximo e-mail chega no início do mês.',
    newsErros: {
      email: 'Confira o e-mail informado.',
      limite: 'Muitos envios seguidos deste aparelho. Tente de novo em alguns minutos.',
      envio: 'Não foi possível inscrever agora. Tente de novo em instantes.',
      formato: 'Não foi possível ler o formulário. Recarregue a página e tente de novo.',
    } as Record<string, string>,
    newsNota: 'Os dados são tratados como descreve a',
  },
  escritorio: {
    titulo: `O escritório | ${site.nome}`,
    descricao:
      'Quem somos: os sócios de Bertoncini & Mendonça Advogados, em Maringá/PR, com formação, inscrição na OAB e áreas de atuação.',
    /* Apresentação: Opção 2 dos sócios (18/11/2026). */
    bannerRotulo: 'O escritório',
    banner: 'Conhecimento jurídico e visão estratégica para o que importa.',
    bannerApoio: 'Conectamos técnica, estratégia e proximidade para dar segurança às suas decisões e solidez aos seus projetos.',
    migalha: 'O escritório',
    rotulo: 'Quem somos',
    /* "Quem somos": texto dos sócios de 18/11/2026, palavra por palavra. */
    quemSomos: [
      'O Bertoncini & Mendonça Advogados é um escritório de advocacia sediado em Maringá/PR, fundado pelos sócios Juscelino Bertoncini e Beatriz Mendonça, com atuação voltada à assessoria jurídica de pessoas, famílias e empresas.',
      'Acreditamos em uma advocacia que alia conhecimento técnico, visão estratégica e compreensão dos objetivos de cada cliente. Nosso trabalho parte de uma análise individualizada de cada situação, buscando compreender não apenas a questão jurídica apresentada, mas também seu contexto e suas implicações.',
      'Nossa atuação abrange cinco áreas: Planejamento Patrimonial e Sucessório, Direito Digital, Assessoria Empresarial, Direito Civil e Contratual e Direito Imobiliário. Essa diversidade permite uma abordagem multidisciplinar, integrando diferentes perspectivas do Direito para atender às necessidades de nossos clientes de maneira coordenada e abrangente.',
      'Valorizamos a proximidade, a clareza na comunicação e o acompanhamento contínuo. Buscamos construir relações profissionais duradouras, participando das decisões de nossos clientes e oferecendo suporte jurídico em diferentes momentos de suas trajetórias pessoais e empresariais.',
      'Com atenção às transformações do mercado e às novas demandas da sociedade, investimos no aprimoramento constante de nossa atuação, aliando tradição jurídica, inovação e novas tecnologias na construção de soluções.',
    ],
    fotoSocios: 'Juscelino Bertoncini e Beatriz Mendonça, sócios do escritório.',
    missaoTitulo: 'Nossa <strong>Missão</strong>',
    missao:
      'Construir relações de confiança e oferecer suporte jurídico em cada etapa da trajetória de nossos clientes.',
    valores: [
      { nome: 'Respeito', texto: 'Tratamos cada pessoa, a sua história, as suas escolhas e os seus interesses com consideração, escuta e seriedade.' },
      { nome: 'Igualdade', texto: 'Toda pessoa merece o mesmo respeito e a mesma dedicação, qualquer que seja a sua origem, condição ou posição social.' },
      { nome: 'Dignidade', texto: 'Por trás de cada patrimônio, conflito ou decisão jurídica existe uma pessoa, uma família e uma história, e é assim que as tratamos.' },
    ],
    atuacaoTitulo: 'Como atuamos',
    valoresAtuacao: [
      { nome: 'Clareza', texto: 'Conhecimento jurídico não deve criar distância entre o advogado e o cliente.' },
      { nome: 'Proximidade', texto: 'Conhecer a realidade do cliente para além do problema jurídico.' },
      { nome: 'Segurança', texto: 'Mais do que resolver problemas, buscar evitar que eles aconteçam.' },
      { nome: 'Planejamento', texto: 'Decisões importantes pensadas antes de se tornarem urgências.' },
      { nome: 'Responsabilidade', texto: 'Cada patrimônio tem uma história, e cada decisão tem consequências.' },
      { nome: 'Estratégia', texto: 'A melhor solução é a que faz sentido para o contexto de quem a recebe.' },
    ],
    atuacaoApoio: 'Os princípios que guiam cada atendimento, do primeiro contato ao fim do caso.',
    recusaRotulo: 'O que não aceitamos',
    recusa: 'Não atuamos em casos que favoreçam a propagação do machismo, do racismo ou da homofobia.',
    sociosTitulo: 'Nossos <strong>Sócios</strong>',
    formacao: 'Formação',
    bios: [
      // PROVISÓRIO: aguardando bio do Jus (só a formação, sem a divisão consultivo × judicial).
      'Especialista em Direito Empresarial pela PUC/RS e em Advocacia Consultiva pela Legale, e pós-graduando em Direito Imobiliário.',
      // Texto dos sócios de 18/11/2026.
      'Advogada com atuação consultiva, preventiva e contenciosa, especialmente nas áreas de Direito Digital, Contratos e Direito Civil. Assessora empresas, profissionais e criadores de conteúdo na estruturação de negócios e relações jurídicas, proteção de ativos intelectuais, registro de marcas e adequação de atividades ao ambiente digital. Também atua na prevenção e resolução de conflitos, tanto na esfera extrajudicial quanto judicial.',
    ],
    formacoes: [
      [
        'Bacharel em Direito pela Universidade Estadual de Maringá (UEM)',
        'Especialista em Direito Empresarial pela PUC/RS',
        'Especialista em Advocacia Consultiva pela Legale',
        'Pós-graduando em Direito Imobiliário pela i9',
      ],
      // Texto dos sócios de 18/11/2026.
      [
        'Graduada em Direito pela Universidade Estadual de Maringá (UEM)',
        'Especialista em Direito Processual Civil pela PUC/RS',
        'Pós-graduanda em Direito Digital',
      ],
    ],
  },
  areas: {
    titulo: `Áreas de atuação | ${site.nome}`,
    descricao:
      'As áreas de atuação de Bertoncini & Mendonça Advogados: Planejamento Patrimonial e Sucessório, Direito Digital, Direito Civil e Contratual, Direito Empresarial e Direito Imobiliário.',
    banner: 'Áreas de <strong>Atuação</strong>',
    bannerApoio: 'Conheça as áreas em que o escritório atua.',
    migalha: 'Áreas de atuação',
    servicos: 'Serviços',
    paraQuem: 'Para quem',
    oQueFazemos: 'O que fazemos',
    perguntas: 'Perguntas frequentes',
    listaAreas: 'Áreas de atuação',
    quemAtende: 'Quem atende',
    faleTitulo: 'Fale conosco',
    faleTexto: 'Conte o seu caso e retornaremos o contato.',
    enviar: 'Enviar mensagem',
    verMais: 'Ver mais',
    conhecaArea: 'Conheça a área',
    faleConosco: 'Fale conosco',
  },
  contato: {
    titulo: `Contato | ${site.nome}`,
    descricao:
      'Fale com Bertoncini & Mendonça Advogados. Atendimento online para todo o país e presencial em Maringá/PR.',
    banner: 'Fale <strong>Conosco</strong>',
    migalha: 'Contato',
    h2: 'Envie sua mensagem',
    apoio: 'Preencha o formulário. Ao enviar, a mensagem também abre no WhatsApp do escritório, pronta para você mandar.',
    nome: 'Nome',
    telefone: 'Telefone',
    cidade: 'Cidade',
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
    /* Aviso do formulário: texto da Política de Cookies dos sócios (18/11/2026). */
    nota: 'Usaremos estes dados apenas para responder ao seu contato e, se for o caso, preparar uma proposta. Por favor, não inclua informações de saúde ou outros dados sensíveis; trataremos dos detalhes do seu caso em reunião, sob sigilo profissional. Saiba mais na nossa',
    notaLink: 'Política de Privacidade',
    notaPatrocinio: 'Enviar esta mensagem não estabelece relação de patrocínio nem substitui uma consulta.',
    newsletter: 'Quero receber artigos e conteúdos jurídicos do Bertoncini & Mendonça Advogados por e-mail. Posso cancelar quando quiser.',
    canais: 'Contato',
    fone: 'Telefone e WhatsApp',
    whats: 'Conversar pelo WhatsApp',
    instagram: 'Instagram',
    horarioRotulo: 'Horário',
    atendimentoRotulo: 'Atendimento',
    ok: 'Recebemos a sua mensagem. Retornaremos pelo contato que você informou.',
    okWhats: 'Recebemos a sua mensagem. O WhatsApp do escritório abriu em outra aba com ela pronta: é só enviar.',
    whatsBloqueado: 'Recebemos a sua mensagem. Para mandá-la também pelo WhatsApp:',
    whatsFalhou: 'Você ainda pode mandá-la pelo WhatsApp:',
    abrirWhats: 'Abrir o WhatsApp',
    /* Mensagem montada para o WhatsApp a partir do formulário. */
    zap: {
      bomDia: 'Bom dia,',
      boaTarde: 'Boa tarde,',
      boaNoite: 'Boa noite,',
      meuNome: 'meu nome é',
    },
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
    'Law firm in Maringá, Paraná, practicing Estate and Succession Planning, Digital Law, Civil and Contract Law, Corporate Law and Real Estate Law. Online service throughout Brazil and in person in Maringá, Paraná.',
  atendimento: 'Online service throughout Brazil',
  presencialEm: 'and in person in',
  horario: 'Monday to Friday, 9 a.m. to 6 p.m. (Brasília time)',
  aviso:
    'The information on this website is for informational purposes only and does not replace a legal analysis of each individual situation.',
  nav: [
    { rotulo: 'Home', chave: '/' },
    { rotulo: 'The firm', chave: '/escritorio/' },
    { rotulo: 'Practice areas', chave: '/areas/', submenu: true },
  ],
  topo: {
    inicioAria: 'home page',
    menu: 'Menu',
    menuAria: 'Main menu',
    faleConosco: 'Contact',
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
    inscrita: 'Law partnership',
    preferencias: 'Cookie preferences',
    golpe: 'Fake-lawyer scam',
    golpeTexto: 'The firm never asks for payment to release funds from a lawsuit. We only contact you from the phone number',
    golpeE: 'and the e-mail address',
    encarregado: 'Data protection officer',
    politicas: [
      { rotulo: 'Privacy policy', chave: '/politica-de-privacidade/' },
      { rotulo: 'Cookie policy', chave: '/politica-de-cookies/' },
    ],
  },
  migalhas: { inicio: 'Home', aria: 'You are here' },
  chamada: {
    titulo: 'Need <strong>legal guidance?</strong>',
    texto: 'Tell us about your case and we will get back to you.',
    botao: 'Contact us',
  },
  hero: {
    aria: 'Highlights',
    slide: (n, total) => `${n} of ${total}`,
    institucionalTitulo: 'A new perspective on legal practice.',
    institucionalTexto:
      'We combine legal knowledge, innovation and strategic vision to meet the needs of individuals and companies in a constantly changing world.',
    conhecaEscritorio: 'About the firm',
    conhecaArea: 'About this area',
    faleConosco: 'Contact us',
    anterior: 'Previous slide',
    proximo: 'Next slide',
    irPara: (n) => `Go to slide ${n}`,
  },
  socio: { o: 'Partner', a: 'Partner', retrato: 'Portrait of' },
  home: {
    titulo: `${site.nome} | Maringá, Brazil`,
    areasTitulo: 'Practice <strong>Areas</strong>',
    areasApoio: 'The areas in which the firm practices.',
    bentoTitulo: 'Not sure where to <strong>start?</strong>',
    bentoTexto: 'Tell us about your situation and the firm will point out the area and the next steps.',
    bentoBotao: 'Talk to the firm',
    paraQuem: 'For:',
    verMais: 'Learn more →',
    sobreRotulo: 'The firm',
    sobreTitulo: 'About <strong>us</strong>',
    sobre: [
      'Bertoncini & Mendonça Advogados is a law firm based in Maringá, Paraná, Brazil, founded by partners Juscelino Bertoncini and Beatriz Mendonça.',
      'Our practice is guided by a combination of legal knowledge, strategic vision and an understanding of each client’s needs. We work with individuals, families and companies, providing legal advice across different areas of law, with tailored solutions for their challenges, projects and goals.',
      'We believe in a law practice that is close, current and committed to building solid relationships and solutions that create value.',
    ],
    saibaMais: 'Learn more',
    sociosTitulo: 'Our <strong>Partners</strong>',
    fotoSobre: 'The partners Beatriz Mendonça and Juscelino Bertoncini at the office, in front of a bookcase.',
    servicos: 'Services',
    conhecaSocios: 'Meet the partners',
    ondeRotulo: 'Where we work',
    ondeTitulo: 'Online throughout <strong>Brazil</strong>, in person in <strong>Maringá</strong>',
    ondeTexto: [
      'We work online, by message and video call, through every stage of the case, for clients in any city in Brazil.',
      'When an in-person meeting is needed, it takes place in Maringá, in the state of Paraná.',
    ],
    ondeOnline: 'Online',
    ondeOnlineTexto: 'All of Brazil, by message and video',
    ondePresencial: 'In person',
    ondePresencialTexto: 'Maringá, Paraná',
    mapaDescricao: 'Map of Brazil with the state of Paraná highlighted and Maringá marked, connected by lines to state capitals in every region of the country.',
    fotoMaringa: 'Maringá Cathedral at dusk, seen from the avenue.',
    faqTitulo: 'Frequently Asked <strong>Questions</strong>',
    atendimento: [
      { pergunta: 'How much does a consultation cost?', resposta: 'It depends on the case. In the first conversation we understand the situation and tell you the fee before you make any commitment.' },
      { pergunta: 'What happens from the first contact until the case moves forward?', resposta: 'You send us a message describing what happened. We reply by scheduling a video call, in which you learn the options, the timeframes and the cost. If you decide to proceed, we take on the case and keep you informed of every development.' },
      { pergunta: 'Do I need to come to the office?', resposta: 'No. We work online, by message and video call, through every stage of the case. When an in-person meeting is needed, we arrange a place in Maringá.' },
      { pergunta: 'How long does a lawsuit take?', resposta: 'It depends on the court and on the complexity of the case. You will get a realistic estimate, bearing in mind that court timeframes do not depend on the lawyer.' },
      { pergunta: 'Do you work with clients outside Maringá?', resposta: 'Yes. We work online and most proceedings are handled electronically, so we serve clients throughout Brazil.' },
    ],
    newsTitulo: 'Get our <strong>articles</strong>',
    newsTexto: 'One e-mail a month with the firm’s new articles (in Portuguese). No advertising; unsubscribe anytime.',
    newsEmail: 'Your e-mail',
    newsBotao: 'Subscribe',
    newsOk: 'You are subscribed. The next e-mail arrives at the beginning of the month.',
    newsErros: {
      email: 'Please check the e-mail address.',
      limite: 'Too many attempts from this device. Please try again in a few minutes.',
      envio: 'We could not subscribe you right now. Please try again in a moment.',
      formato: 'The form could not be read. Please reload the page and try again.',
    },
    newsNota: 'Your data is handled as described in our',
  },
  escritorio: {
    titulo: `The firm | ${site.nome}`,
    descricao:
      'About us: the partners of Bertoncini & Mendonça Advogados, in Maringá, Brazil, with their education, Bar registration and practice areas.',
    bannerRotulo: 'The firm',
    banner: 'Legal knowledge and strategic vision for what matters.',
    bannerApoio: 'We bring together technical skill, strategy and closeness to give security to your decisions and solidity to your projects.',
    migalha: 'The firm',
    rotulo: 'About us',
    quemSomos: [
      'Bertoncini & Mendonça Advogados is a law firm based in Maringá, Paraná, Brazil, founded by partners Juscelino Bertoncini and Beatriz Mendonça, providing legal advice to individuals, families and companies.',
      'We believe in a law practice that combines technical knowledge, strategic vision and an understanding of each client’s goals. Our work starts from an individual analysis of each situation, seeking to understand not only the legal question presented, but also its context and implications.',
      'Our practice covers five areas: Estate and Succession Planning, Digital Law, Corporate Advisory, Civil and Contract Law, and Real Estate Law. This diversity allows a multidisciplinary approach, bringing together different perspectives of the law to meet our clients’ needs in a coordinated and comprehensive way.',
      'We value closeness, clear communication and ongoing support. We seek to build lasting professional relationships, taking part in our clients’ decisions and providing legal support at different moments of their personal and business journeys.',
      'Attentive to changes in the market and to new demands of society, we constantly invest in improving our practice, combining legal tradition, innovation and new technologies in building solutions.',
    ],
    fotoSocios: 'Juscelino Bertoncini and Beatriz Mendonça, the firm’s partners.',
    missaoTitulo: 'Our <strong>Mission</strong>',
    missao:
      'To build relationships of trust and provide legal support at every stage of our clients’ journeys.',
    valores: [
      { nome: 'Respect', texto: 'We treat every person, their story, their choices and their interests with consideration, attentive listening and seriousness.' },
      { nome: 'Equality', texto: 'Every person deserves the same respect and the same dedication, whatever their origin, circumstances or social position.' },
      { nome: 'Dignity', texto: 'Behind every estate, dispute or legal decision there is a person, a family and a story, and that is how we treat them.' },
    ],
    atuacaoTitulo: 'How we work',
    valoresAtuacao: [
      { nome: 'Clarity', texto: 'Legal knowledge should not create distance between lawyer and client.' },
      { nome: 'Closeness', texto: 'Understanding the client’s situation beyond the legal problem.' },
      { nome: 'Security', texto: 'More than solving problems, trying to prevent them from happening.' },
      { nome: 'Planning', texto: 'Important decisions thought through before they become urgent.' },
      { nome: 'Responsibility', texto: 'Every estate has a story, and every decision has consequences.' },
      { nome: 'Strategy', texto: 'The best solution is the one that makes sense for the person receiving it.' },
    ],
    atuacaoApoio: 'The principles behind every engagement, from the first contact to the end of the case.',
    recusaRotulo: 'What we do not accept',
    recusa: 'We do not take on cases that promote sexism, racism or homophobia.',
    sociosTitulo: 'Our <strong>Partners</strong>',
    formacao: 'Education',
    bios: [
      // PROVISÓRIO: aguardando bio do Jus (só a formação, sem a divisão consultivo × judicial).
      'Specialist in Business Law (PUC/RS) and in Advisory Legal Practice (Legale), and graduate student in Real Estate Law.',
      'Lawyer with an advisory, preventive and litigation practice, especially in Digital Law, Contracts and Civil Law. Advises companies, professionals and content creators on structuring businesses and legal relationships, protecting intellectual assets, registering trademarks and adapting their activities to the digital environment. Also works on preventing and resolving disputes, both out of court and in court.',
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
        'Graduate studies in Digital Law (in progress)',
      ],
    ],
  },
  areas: {
    titulo: `Practice areas | ${site.nome}`,
    descricao:
      'The practice areas of Bertoncini & Mendonça Advogados: Estate and Succession Planning, Digital Law, Civil and Contract Law, Corporate Law and Real Estate Law.',
    banner: 'Practice <strong>Areas</strong>',
    bannerApoio: 'The areas in which the firm practices.',
    migalha: 'Practice areas',
    servicos: 'Services',
    paraQuem: 'Who it is for',
    oQueFazemos: 'What we do',
    perguntas: 'Frequently asked questions',
    listaAreas: 'Practice areas',
    quemAtende: 'Your attorneys',
    faleTitulo: 'Contact us',
    faleTexto: 'Tell us about your case and we will get back to you.',
    enviar: 'Send a message',
    verMais: 'Learn more',
    conhecaArea: 'About this area',
    faleConosco: 'Contact us',
  },
  contato: {
    titulo: `Contact | ${site.nome}`,
    descricao:
      'Contact Bertoncini & Mendonça Advogados. Online service throughout Brazil and in person in Maringá, Paraná.',
    banner: 'Contact <strong>Us</strong>',
    migalha: 'Contact',
    h2: 'Send us a message',
    apoio: 'Fill in the form. When you send it, the message also opens in the firm’s WhatsApp, ready for you to send. You may write in English.',
    nome: 'Name',
    telefone: 'Phone',
    cidade: 'City',
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
    nota: 'We will use this information only to reply to your message and, where applicable, to prepare a proposal. Please do not include health information or other sensitive data; we will discuss the details of your case in a meeting, under professional confidentiality. Learn more in our',
    notaLink: 'Privacy Policy',
    notaPatrocinio: 'Sending this message does not create an attorney-client relationship and does not replace a consultation.',
    newsletter: 'I would like to receive legal articles and content from Bertoncini & Mendonça Advogados by e-mail. I can unsubscribe at any time.',
    canais: 'Contact',
    fone: 'Phone and WhatsApp',
    whats: 'Chat on WhatsApp',
    instagram: 'Instagram',
    horarioRotulo: 'Office hours',
    atendimentoRotulo: 'Service',
    ok: 'We have received your message. We will get back to you using the contact details you provided.',
    okWhats: 'We have received your message. The firm’s WhatsApp opened in another tab with it ready: just send it.',
    whatsBloqueado: 'We have received your message. To also send it on WhatsApp:',
    whatsFalhou: 'You can still send it on WhatsApp:',
    abrirWhats: 'Open WhatsApp',
    zap: {
      bomDia: 'Good morning,',
      boaTarde: 'Good afternoon,',
      boaNoite: 'Good evening,',
      meuNome: 'my name is',
    },
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
    preferencias: 'Cookie preferences',
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
