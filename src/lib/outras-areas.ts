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
 */
import type { Idioma } from './i18n';

export interface OutraArea {
  chave: string;
  nome: string;
  texto: string;
  ligada: string[];
  foto: string;
}

const PT: OutraArea[] = [
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

const EN: OutraArea[] = [
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

export function outrasAreas(lang: Idioma): OutraArea[] {
  return lang === 'en' ? EN : PT;
}
