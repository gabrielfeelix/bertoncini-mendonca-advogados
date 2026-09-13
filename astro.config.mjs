// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

/**
 * Host do Storage do Supabase, derivado de PUBLIC_SUPABASE_URL. Enquanto a
 * variável não existe no ambiente (o estado normal do projeto até o CMS
 * entrar no ar), fica `undefined` e nada é autorizado, o que está certo:
 * sem banco não há capa remota.
 */
const hostDoSupabase = (() => {
  const url = process.env.PUBLIC_SUPABASE_URL?.trim();
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
})();

/* Rotas que não entram no sitemap. A mesma lista é proibida no
   `/robots.txt` (src/pages/robots.txt.ts) e cada página manda `noindex` —
   três camadas, porque uma URL de painel indexada é convite.

   `/previa` entrou aqui depois de aparecer no sitemap do site publicado:
   ela é página de trabalho não versionada, e um deploy feito da máquina
   local a carrega junto. O `.vercelignore` agora impede a subida; isto
   garante que, se ela subir de outro jeito, ao menos não é anunciada. */
const ROTAS_FORA_DO_SITEMAP = ['/painel', '/previa'];

export default defineConfig({
  // Placeholder: o domínio final ainda não foi confirmado com o escritório.
  site: 'https://www.bertoncinimendonca.adv.br',
  output: 'static',
  adapter: vercel(),

  /*
    O blog morava em `/textos/` e passou a morar em `/blog/`: decisão do
    cliente, "tudo BLOG, sempre, textos nunca".

    O redirecionamento existe porque `/textos/` já esteve publicado — o
    site foi para o ar e o sitemap anunciou essas URLs. Trocar a rota sem
    redirecionar transforma cada link compartilhado, e cada endereço já
    visto pelo buscador, em 404, e joga fora o histórico de indexação.

    301 (permanente) e não 302: a mudança é definitiva, e é o 301 que
    transfere a autoridade da URL antiga para a nova.
  */
  redirects: {
    /* A lista e as páginas numeradas. Duas regras do Astro aqui: o nome
       do parâmetro tem de ser o mesmo da rota de destino (`[...page]`), e
       `/textos` sozinho NÃO entra — o parâmetro rest já casa o caminho
       vazio, e declarar os dois faz o build recusar por conflito de
       prioridade. */
    '/textos/[...page]': { status: 301, destination: '/blog/[...page]' },
    /* A página de cada artigo. */
    '/textos/[slug]': { status: 301, destination: '/blog/[slug]' },
  },
  integrations: [
    // Conteúdo do blog (Tarefas 10-12) será escrito em MDX, como na Isabella.
    mdx(),
    /* O painel do CMS (Tarefa 12) é área de trabalho interna, não conteúdo:
       fora do sitemap. As páginas dele também devem mandar `noindex`, e o
       robots.txt deve proibir — três camadas, porque uma URL de painel
       indexada é convite. */
    sitemap({
      filter: (pagina) => !ROTAS_FORA_DO_SITEMAP.some((rota) => pagina.includes(rota)),
    }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: {
    // Formatos modernos primeiro; o fallback é resolvido pelo <picture>.
    responsiveStyles: true,
    /*
      Autorização do host das capas de artigo (Tarefa 11). Sem isto o
      `<Image>` recusa a capa remota e a página sai sem capa nenhuma.

      Duas entradas, e as duas são necessárias:

      1. `domains` recebe o host exato de PUBLIC_SUPABASE_URL, quando a
         variável está no ambiente. É a autorização precisa, e é a que vale
         no build da Vercel, onde a variável existe. O host não está escrito
         aqui à mão porque o projeto Supabase do escritório ainda não foi
         criado: escrever `xyz.supabase.co` seria inventar um dado.

      2. `remotePatterns` autoriza qualquer `*.supabase.co` por HTTPS. É a
         rede de segurança para o dia em que o banco existir e alguém rodar
         um build sem a variável de ambiente à mão: a capa continua sendo
         otimizada em vez de o build quebrar. O padrão é restrito a HTTPS e
         ao domínio do Supabase, não a qualquer host.

      Sem variável e sem banco, as duas ficam inertes: não há capa remota
      nenhuma para autorizar, e o build segue igual.
    */
    domains: [hostDoSupabase].filter((host) => host !== undefined),
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
  build: { inlineStylesheets: 'auto' },
});
