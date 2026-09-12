// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Placeholder: o domínio final ainda não foi confirmado com o escritório.
  site: 'https://www.bertoncinimendonca.adv.br',
  output: 'static',
  adapter: vercel(),
  integrations: [
    /* O painel do CMS (Tarefa 12) é área de trabalho interna, não conteúdo:
       fora do sitemap. As páginas dele também devem mandar `noindex`, e o
       robots.txt deve proibir — três camadas, porque uma URL de painel
       indexada é convite. */
    sitemap({ filter: (pagina) => !pagina.includes('/painel') }),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: {
    // Formatos modernos primeiro; o fallback é resolvido pelo <picture>.
    responsiveStyles: true,
    /*
      Na Isabella, `image.domains` autoriza o Storage do Supabase a ser
      otimizado no build. Aqui o projeto Supabase ainda não existe (entra na
      Tarefa 10) — sem host para autorizar ainda. Revisitar quando o CMS
      (Tarefa 12) trouxer capas de artigo hospedadas remotamente.
    */
  },
  build: { inlineStylesheets: 'auto' },
});
