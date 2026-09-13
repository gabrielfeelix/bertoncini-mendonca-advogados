/**
 * Coleções de conteúdo do site.
 *
 * São duas: `areas` (Tarefa 7), que vem de arquivos JSON no repositório, e
 * `artigos` (Tarefa 10), que vem do Supabase pelo loader em
 * src/lib/loader-supabase.ts.
 *
 * Por que JSON e não Markdown: uma área não é um texto corrido, é um
 * registro com campos (assuntos, perguntas, ordem) que a página monta em
 * lugares diferentes do layout. O corpo é uma lista de parágrafos, porque
 * é assim que ele é renderizado, e assim o schema valida cada parágrafo em
 * vez de aceitar uma string opaca.
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { artigosDoSupabase } from './lib/loader-supabase';

const areas = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/areas' }),
  schema: z.object({
    /** Nome da área, como aparece no título da página e no menu de áreas. */
    nome: z.string().min(1),
    /** Slug da URL: /areas/<slug>/. Só minúsculas, números e hífen. */
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug em minúsculas, separado por hífen'),
    /** Frase curta de apoio. Vai para a meta description e para a lista. */
    resumo: z.string().min(1),
    /**
     * Assuntos da área.
     *
     * Aceita duas formas. A string simples continua valendo (é o que as
     * áreas usavam quando os assuntos eram pílulas). A forma com objeto
     * acrescenta `faz`: uma frase curta dizendo o que o escritório faz
     * naquele assunto.
     *
     * Por que `faz` existe: como pílula, o assunto era só palavra-chave
     * solta — "Holding familiar", "LGPD" —, e o cliente reprovou o
     * formato por soar a texto gerado. O que desfaz isso não é trocar a
     * forma da pílula, é a etiqueta deixar de ser etiqueta e passar a
     * dizer o serviço.
     *
     * REGRA: `faz` é sempre derivado do `corpo` desta mesma área, que veio
     * do briefing e foi conferido contra o Provimento 205/2021. Não é
     * texto novo, é a frase do corpo reduzida. Nada de promessa de
     * resultado, prazo ou superlativo — é o que a OAB proíbe.
     */
    assuntos: z.array(
      z.union([
        z.string().min(1),
        z.object({
          /** Nome do assunto. */
          nome: z.string().min(1),
          /** O que o escritório faz nesse assunto. Uma frase. */
          faz: z.string().min(1),
        }),
      ]),
    ),
    /** Texto da página, um item por parágrafo. */
    corpo: z.array(z.string().min(1)),
    /** Perguntas frequentes específicas da área. */
    perguntas: z.array(
      z.object({
        pergunta: z.string().min(1),
        resposta: z.string().min(1),
      }),
    ),
    /** Ordem de exibição na lista de áreas. */
    ordem: z.number().int().positive(),
    /**
     * true quando a área ainda não foi definida pelos sócios. Uma área
     * assim não tem conteúdo próprio: aparece na lista marcada
     * "a confirmar" e não ganha página.
     */
    aConfirmar: z.boolean().default(false),
    /**
     * Texto do WhatsApp já preenchido para esta área (sem codificar; a
     * página codifica). Ausente nas áreas a confirmar.
     */
    mensagemWhatsapp: z.string().min(1).optional(),
    /**
     * Frases do corpo que ainda dependem de confirmação dos sócios,
     * identificadas pelo índice no array `corpo`. A página marca esses
     * parágrafos com data-placeholder="1".
     */
    corpoAConfirmar: z.array(z.number().int().nonnegative()).default([]),
    /**
     * Como cada parágrafo do `corpo` vira uma cena na página da área.
     *
     * Existe porque os parágrafos do corpo não são texto corrido: cada um
     * é um bloco temático fechado, e o layout antigo jogava essa estrutura
     * fora empilhando tudo numa coluna só. Aqui ela volta — SEM alterar
     * uma palavra do texto, que veio do briefing e foi conferido contra o
     * Provimento 205/2021.
     *
     * Por que um campo explícito e não derivar de `assuntos` por ordem:
     * eles batem só até certo ponto. Em `direito-digital` o parágrafo 4
     * funde "Crimes cibernéticos" com "Redes sociais e internet", e a
     * partir dali cada rubrica cairia sobre o parágrafo errado — a de
     * "Compliance digital" acabaria em cima do parágrafo de atendimento.
     * As áreas também têm contagens diferentes (9 e 8 parágrafos), então
     * não há ordem única que sirva às duas.
     *
     * Parágrafo sem entrada aqui é renderizado em largura cheia, sem
     * rubrica nem peça visual: é o caso da abertura e do fecho, que são
     * abertura e fecho mesmo, não temas.
     */
    cenas: z
      .array(
        z.object({
          /** Índice do parágrafo em `corpo`. */
          indice: z.number().int().nonnegative(),
          /** Rubrica curta acima do parágrafo. Rótulo, nunca afirmação. */
          rubrica: z.string().min(1),
          /** Ilustração vetorial (ver Marca.astro) para temas conceituais. */
          /* Só os tipos que uma CENA pode pedir. `Marca.astro` conhece
             outros — leque, conversa, pauta, sucessao, rede —, mas esses
             são escolhidos em código (home, /contato/, /blog/) e nunca
             vêm de JSON: listá-los aqui sugeriria que uma cena poderia
             pedi-los. */
          marca: z.enum(['dados', 'marca', 'contrato', 'compliance', 'prova', 'maquina']).optional(),
          /** Fotografia, para temas concretos. Caminho sem extensão em /media/areas/. */
          foto: z.string().min(1).optional(),
          /** Descrição da foto. Obrigatória quando há foto. */
          fotoAlt: z.string().min(1).optional(),
        })
        /* Foto é tudo-ou-nada, como a capa do artigo mais abaixo: ou não há
           foto, ou há caminho E descrição. Sem isto o schema aceitaria uma
           cena com `foto` e sem `fotoAlt`, e a página emitiria uma imagem
           sem texto alternativo — que é justamente o que o portão cobra. */
        .refine((cena) => !cena.foto || !!cena.fotoAlt, {
          message: 'cena com foto precisa de fotoAlt',
        }),
      )
      .default([]),
  }),
});

/**
 * Artigos do blog (`/blog/`).
 *
 * O schema serve às duas fontes de propósito, e o plano pede isso: o mesmo
 * objeto valida uma linha do Supabase, traduzida pelo loader, e um arquivo
 * markdown local com este frontmatter, se um dia for preciso escrever um
 * artigo no repositório ou rodar o site sem banco. Por isso:
 *
 * - `capa` é uma string de URL, e não `image()`. `image()` só sabe medir
 *   arquivo local, e a capa mora no Storage do Supabase.
 * - `capaLargura` e `capaAltura` existem porque o <Image> do Astro se recusa
 *   a montar uma imagem remota sem as duas: sem elas a página pula enquanto
 *   a capa carrega. Quem envia a capa mede a imagem e grava as dimensões.
 * - os campos que o banco preenche sozinho (`atualizadoEm`) são opcionais,
 *   para o markdown local não precisar inventá-los.
 *
 * O corpo não está aqui porque não é frontmatter: é o corpo da entrada,
 * escrito em **markdown** e convertido em HTML no build. Nunca HTML cru de
 * autor: o loader escapa a marcação antes de renderizar, porque markdown
 * sozinho não impede HTML inline (ver `neutralizaHtmlCru` no loader).
 */
const artigos = defineCollection({
  loader: artigosDoSupabase(),
  schema: z.object({
    /** Título do artigo, como aparece na página e na lista. */
    titulo: z.string().min(1).max(120),
    /** Frase curta de apoio. Vai para a meta description e para a lista. */
    resumo: z.string().min(1).max(300),
    /** URL pública da capa no Storage. Ausente quando o artigo não tem capa. */
    capa: z.url().optional(),
    /** Dimensões da capa, medidas no upload. Exigidas pelo <Image> remoto. */
    capaLargura: z.number().int().positive().optional(),
    capaAltura: z.number().int().positive().optional(),
    /** Descrição da capa. Obrigatória sempre que existe capa. */
    capaAlt: z.string().min(1).optional(),
    /** Categoria editorial do texto. */
    categoria: z.string().min(1).default('Informativo'),
    /** Quem assina. Vazio quando o texto é do escritório, sem assinatura individual. */
    autor: z.string().default(''),
    publicadoEm: z.coerce.date(),
    /** Mantido pelo banco a cada alteração; ausente enquanto nunca foi alterado. */
    atualizadoEm: z.coerce.date().optional(),
    /** Minutos de leitura. Calculado do corpo ao salvar, corrigível à mão. */
    tempoLeitura: z.number().int().positive().max(120).optional(),
    /** Rascunho não chega ao site: o loader só pede os publicados. */
    estado: z.enum(['rascunho', 'publicado']).default('publicado'),
    /** Sobrescrevem título e descrição quando o SEO pede algo diferente. */
    seoTitulo: z.string().max(60).optional(),
    seoDescricao: z.string().max(160).optional(),
  })
  /* Capa é tudo-ou-nada, igual à restrição da tabela: ou não há capa, ou há
     URL, as duas dimensões e a descrição. Assim a página nunca recebe uma
     capa que o <Image> recusa, nem imagem sem texto alternativo. */
  .refine(
    (a) => !a.capa || (a.capaLargura !== undefined && a.capaAltura !== undefined && !!a.capaAlt),
    { message: 'artigo com capa precisa de capaLargura, capaAltura e capaAlt' },
  ),
});

export const collections = { areas, artigos };
