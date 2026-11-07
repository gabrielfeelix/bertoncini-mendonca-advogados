/**
 * As áreas "pequenas" ("Também atuamos em"): o que o escritório atende,
 * mas não leva como bandeira. No briefing (q2.1) os sócios agruparam tudo
 * em dois guarda-chuvas, Planejamento Patrimonial e Sucessório e Direito
 * Digital; estas são as demandas que eles aceitam, listadas no retorno de
 * 06/11/2026. Não têm página própria: abrem um painel curto (PainelArea).
 *
 * TEXTO PROVISÓRIO: as descrições foram escritas a partir do briefing e
 * ainda precisam da aprovação dos sócios. Sem promessa de resultado, sem
 * superlativo (Provimento 205/2021 da OAB).
 *
 * `ligada` aponta para o slug (em português) da área grande a que cada uma
 * pertence; `assunto` é o valor que chega pré-escolhido no formulário de
 * contato (?assunto=<chave>).
 *
 * `perguntas` (07/11/2026): um FAQ rápido no painel lateral, três por
 * área. TAMBÉM PROVISÓRIO, para os sócios aprovarem: só informação geral,
 * sem prazo, sem promessa de resultado.
 */
import type { Idioma } from './i18n';

export interface OutraArea {
  chave: string;
  nome: string;
  texto: string;
  ligada: string[];
  foto: string;
  perguntas: Pergunta[];
}

export interface Pergunta {
  pergunta: string;
  resposta: string;
}

type Base = Omit<OutraArea, 'perguntas'>;

const PT: Base[] = [
  {
    chave: 'contratos',
    nome: 'Contratos',
    texto:
      'Elaboração e revisão dos contratos do dia a dia de pessoas e empresas: compra e venda, prestação de serviços, locação e parcerias. Um contrato bem escrito é o que evita a discussão depois.',
    ligada: ['planejamento-patrimonial-e-sucessorio', 'direito-digital'],
    foto: '/media/novas/area-contratos.jpg',
  },
  {
    chave: 'societario',
    nome: 'Direito societário',
    texto:
      'Constituição e alteração de sociedades, contrato social, acordo de sócios e as regras para a entrada e a saída de sócios, para que a empresa continue funcionando quando alguém muda.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/area-empresa.jpg',
  },
  {
    chave: 'imobiliario',
    nome: 'Direito imobiliário',
    texto:
      'Análise de matrícula, certidões e vendedores antes da compra, contratos de compra e venda e de locação, usufruto e regularização de imóveis.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/area-bens.jpg',
  },
  {
    chave: 'assessoria-empresarial',
    nome: 'Assessoria jurídica empresarial',
    texto:
      'Acompanhamento contínuo da empresa: contratos, decisões do dia a dia e a prevenção de problemas antes que eles virem processo.',
    ligada: ['planejamento-patrimonial-e-sucessorio', 'direito-digital'],
    foto: '/media/novas/escritorio-valores.jpg',
  },
  {
    chave: 'compliance',
    nome: 'Compliance e governança',
    texto:
      'Políticas internas, regras de conduta e rotinas de controle que mantêm a empresa em conformidade com a lei, incluindo a proteção de dados pessoais.',
    ligada: ['direito-digital', 'planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/passo-opcoes.jpg',
  },
  {
    chave: 'civil',
    nome: 'Direito civil',
    texto:
      'Questões entre pessoas e empresas no dia a dia: obrigações, cobranças, indenizações e responsabilidade civil, pela via do acordo ou, quando preciso, na Justiça.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/passo-conversa.jpg',
  },
];

const EN: Base[] = [
  {
    chave: 'contratos',
    nome: 'Contracts',
    texto:
      'Drafting and review of the everyday contracts of individuals and companies: purchase and sale, services, leases and partnerships. A well-written contract is what prevents the dispute later.',
    ligada: ['planejamento-patrimonial-e-sucessorio', 'direito-digital'],
    foto: '/media/novas/area-contratos.jpg',
  },
  {
    chave: 'societario',
    nome: 'Corporate law',
    texto:
      'Incorporation and amendment of companies, articles of association, partners’ agreements and the rules for partners joining and leaving, so the company keeps running when someone changes.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/area-empresa.jpg',
  },
  {
    chave: 'imobiliario',
    nome: 'Real estate law',
    texto:
      'Review of the property record, certificates and sellers before a purchase, purchase and lease agreements, usufruct and regularization of properties.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/area-bens.jpg',
  },
  {
    chave: 'assessoria-empresarial',
    nome: 'Corporate legal advisory',
    texto:
      'Ongoing support for companies: contracts, day-to-day decisions and preventing problems before they become lawsuits.',
    ligada: ['planejamento-patrimonial-e-sucessorio', 'direito-digital'],
    foto: '/media/novas/escritorio-valores.jpg',
  },
  {
    chave: 'compliance',
    nome: 'Compliance and governance',
    texto:
      'Internal policies, codes of conduct and control routines that keep a company compliant with the law, including the protection of personal data.',
    ligada: ['direito-digital', 'planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/passo-opcoes.jpg',
  },
  {
    chave: 'civil',
    nome: 'Civil law',
    texto:
      'Everyday matters between individuals and companies: obligations, debt collection, damages and civil liability, by agreement or, when necessary, in court.',
    ligada: ['planejamento-patrimonial-e-sucessorio'],
    foto: '/media/novas/passo-conversa.jpg',
  },
];

const PERGUNTAS_PT: Record<string, Pergunta[]> = {
  contratos: [
    { pergunta: 'Vale a pena revisar um contrato antes de assinar?', resposta: 'Sim. A revisão aponta obrigações, multas e prazos que não estão claros e sugere ajustes enquanto ainda é possível negociar.' },
    { pergunta: 'Contrato verbal vale?', resposta: 'Em muitos casos, sim, mas é difícil provar o que foi combinado. Por escrito, o que cabe a cada parte fica registrado.' },
    { pergunta: 'O contrato é feito a partir de um modelo?', resposta: 'Não. Ele é redigido a partir da situação concreta: o que está sendo negociado, quem são as partes e quais riscos precisam ser previstos.' },
  ],
  societario: [
    { pergunta: 'Quando é preciso alterar o contrato social?', resposta: 'Sempre que muda algo que ele registra, como sócios, capital, endereço, objeto ou administração. A alteração é registrada na Junta Comercial.' },
    { pergunta: 'O que é acordo de sócios?', resposta: 'Um contrato entre os sócios que complementa o contrato social com regras sobre decisões, saída, venda de quotas e solução de conflitos.' },
    { pergunta: 'E se um sócio quiser sair?', resposta: 'O ideal é que o contrato social e o acordo de sócios digam como a saída acontece e como as quotas são avaliadas e pagas. Sem essas regras, tudo depende de negociação.' },
  ],
  imobiliario: [
    { pergunta: 'O que conferir antes de comprar um imóvel?', resposta: 'A matrícula atualizada e as certidões do imóvel e do vendedor, para ver se há dívidas, ônus ou processos que possam afetar a compra.' },
    { pergunta: 'Contrato de gaveta tem valor?', resposta: 'Vale entre as partes, mas não transfere a propriedade. Enquanto a escritura não é registrada na matrícula, o comprador fica exposto a problemas do vendedor.' },
    { pergunta: 'Vocês acompanham a regularização do imóvel?', resposta: 'Sim: análise da documentação, escritura, registro e, quando preciso, os procedimentos para regularizar a situação do imóvel.' },
  ],
  'assessoria-empresarial': [
    { pergunta: 'Como funciona a assessoria contínua?', resposta: 'O escritório acompanha a empresa no dia a dia, com contratos, dúvidas e decisões, em vez de ser chamado só quando o problema já existe.' },
    { pergunta: 'Atendem empresas de fora de Maringá?', resposta: 'Sim. O atendimento é online para todo o país, com encontros presenciais em Maringá quando necessário.' },
    { pergunta: 'Que tipo de empresa vocês atendem?', resposta: 'Empresas de diferentes portes e empreendedores, inclusive negócios que vendem e trabalham pela internet.' },
  ],
  compliance: [
    { pergunta: 'O que é compliance?', resposta: 'O conjunto de políticas, regras e controles que mantém a empresa em conformidade com a lei e com as próprias normas internas.' },
    { pergunta: 'Empresa pequena precisa se adequar à LGPD?', resposta: 'Sim. A lei vale para qualquer empresa que trate dados pessoais; o que muda com o porte é a proporção das medidas.' },
    { pergunta: 'Por onde começar?', resposta: 'Por um diagnóstico: quais dados e processos a empresa tem, quais riscos existem e quais regras faltam. A partir dele, as políticas são escritas e implantadas.' },
  ],
  civil: [
    { pergunta: 'Que tipo de questão é direito civil?', resposta: 'Obrigações, cobranças, indenizações, responsabilidade civil e conflitos do dia a dia entre pessoas e empresas.' },
    { pergunta: 'Dá para resolver sem processo?', resposta: 'Muitas vezes, sim. Antes de ir à Justiça, avaliamos a possibilidade de acordo ou de notificação extrajudicial.' },
    { pergunta: 'O que levar para a primeira conversa?', resposta: 'Os documentos que você tiver sobre o caso: contratos, mensagens, comprovantes e notificações.' },
  ],
};

const PERGUNTAS_EN: Record<string, Pergunta[]> = {
  contratos: [
    { pergunta: 'Is it worth reviewing a contract before signing?', resposta: 'Yes. A review points out obligations, penalties and deadlines that are unclear and suggests changes while there is still room to negotiate.' },
    { pergunta: 'Is a verbal agreement valid?', resposta: 'In many cases, yes, but it is hard to prove what was agreed. In writing, what each party owes is on record.' },
    { pergunta: 'Is the contract based on a template?', resposta: 'No. It is drafted from the actual situation: what is being negotiated, who the parties are and which risks need to be addressed.' },
  ],
  societario: [
    { pergunta: 'When do the articles of association need to change?', resposta: 'Whenever something they record changes, such as partners, capital, address, purpose or management. The amendment is filed with the Board of Trade.' },
    { pergunta: 'What is a partners’ agreement?', resposta: 'A contract between the partners that complements the articles with rules on decisions, exit, sale of quotas and dispute resolution.' },
    { pergunta: 'What if a partner wants to leave?', resposta: 'Ideally the articles and the partners’ agreement say how the exit works and how quotas are valued and paid. Without those rules, everything depends on negotiation.' },
  ],
  imobiliario: [
    { pergunta: 'What should be checked before buying a property?', resposta: 'The updated title record and the certificates for the property and the seller, to see whether there are debts, liens or lawsuits that could affect the purchase.' },
    { pergunta: 'Is an unregistered purchase agreement valid?', resposta: 'It binds the parties, but it does not transfer ownership. Until the deed is registered, the buyer is exposed to the seller’s problems.' },
    { pergunta: 'Do you handle property regularization?', resposta: 'Yes: document review, deed, registration and, when needed, the procedures to regularize the property.' },
  ],
  'assessoria-empresarial': [
    { pergunta: 'How does ongoing counsel work?', resposta: 'The firm follows the company day to day, with contracts, questions and decisions, instead of being called only once a problem exists.' },
    { pergunta: 'Do you work with companies outside Maringá?', resposta: 'Yes. We work online throughout Brazil, with in-person meetings in Maringá when needed.' },
    { pergunta: 'What kind of companies do you work with?', resposta: 'Companies of different sizes and entrepreneurs, including businesses that sell and work online.' },
  ],
  compliance: [
    { pergunta: 'What is compliance?', resposta: 'The set of policies, rules and controls that keep a company in line with the law and with its own internal rules.' },
    { pergunta: 'Does a small company need to comply with the LGPD?', resposta: 'Yes. The law applies to any company that handles personal data; size changes how far the measures go.' },
    { pergunta: 'Where do we start?', resposta: 'With an assessment: which data and processes the company has, which risks exist and which rules are missing. Policies are then written and put in place.' },
  ],
  civil: [
    { pergunta: 'What falls under civil law?', resposta: 'Obligations, debt collection, damages, civil liability and everyday disputes between people and companies.' },
    { pergunta: 'Can it be solved without a lawsuit?', resposta: 'Often, yes. Before going to court, we look at the possibility of a settlement or an out-of-court notice.' },
    { pergunta: 'What should I bring to the first conversation?', resposta: 'Any documents you have about the case: contracts, messages, receipts and notices.' },
  ],
};

export function outrasAreas(lang: Idioma): OutraArea[] {
  const perguntas = lang === 'en' ? PERGUNTAS_EN : PERGUNTAS_PT;
  return (lang === 'en' ? EN : PT).map((a) => ({ ...a, perguntas: perguntas[a.chave] ?? [] }));
}
