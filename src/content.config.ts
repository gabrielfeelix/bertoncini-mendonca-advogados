/**
 * Coleções de conteúdo do site.
 *
 * Neste momento existe só `areas` (Tarefa 7). A coleção `artigos` do blog
 * entra aqui na Tarefa 10, acrescentada a este mesmo arquivo — não
 * substituindo o que está abaixo.
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
    /** Assuntos da área, exibidos como chips. */
    assuntos: z.array(z.string().min(1)),
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
  }),
});

export const collections = { areas };
