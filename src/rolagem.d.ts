/* A instância do Lenis, posta por `scripts/movimento.ts` para quem precisa
   corrigir a rolagem sem brigar com ele (`components/Servicos.astro`).
   Não é `window.lenis` porque o próprio Lenis já declara esse nome com
   outro tipo. */
interface Window {
  rolagem?: import('lenis').default;
}
