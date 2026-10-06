# Plano de deploy — site + assinaturas de e-mail

Escrito em 06/10/2026.

## Por que

As assinaturas de e-mail (zip "Cartão de visita profissional-2", enviado pelo
Juscelino) embutem as 11 imagens como `data:image/png;base64`. Gmail e Outlook
bloqueiam esse formato, por isso a imagem chega quebrada. As imagens precisam
estar num endereço público. Elas já estão em `public/assinatura/` (272 KB) e
vão ficar em `https://www.bertoncinimendonca.adv.br/assinatura/<nome>.png`.

Hoje o domínio está **estacionado na Hostinger** (a home devolve "Parked Domain
name on Hostinger DNS system"). Até o site ir ao ar, essas URLs não funcionam.

## Decisões

- **Vercel na conta do escritório**, criada com o e-mail deles, e não na conta
  pessoal ou do freela1. Se o Gabriel sair, o site continua sendo deles.
- **Plano Pro (US$ 20/mês).** O Hobby proíbe uso comercial nos termos de uso.
  Avisar o cliente do custo antes.
- **Gabriel entra como membro do time Vercel**, e o repo continua no GitHub dele.
- **Hostinger: só DNS, sem trocar nameservers.** O e-mail deles é da Hostinger,
  então MX, SPF e DKIM não podem ser tocados. Não é preciso SSH, só o token da API.
- **Não usar `.vercel.app` como solução temporária nas assinaturas.** Ficariam
  presas a esse endereço e cada uma teria que ser trocada de novo.

## Passo a passo

### Gabriel (em casa)
1. Criar a conta Vercel com o e-mail do escritório e assinar o Pro.
2. Convidar a conta do Gabriel para o time.
3. Gerar o token da API da Hostinger (hPanel → Perfil → API).
4. Gerar o token da Vercel (Account Settings → Tokens), com o time do escritório
   como escopo.
5. Criar `.env.local` na raiz do repo, que já é ignorado pelo git:
   ```
   HOSTINGER_API_TOKEN=...
   VERCEL_TOKEN=...
   ```
   Não colar tokens no chat.
6. Confirmar em qual conta está o projeto Supabase (pendente).

### Claude
7. Criar o projeto na Vercel do escritório, configurar as variáveis de ambiente
   (Supabase etc.), publicar e conferir em `.vercel.app`.
8. Adicionar `bertoncinimendonca.adv.br` e `www` ao projeto na Vercel.
9. **Exportar a zona DNS inteira da Hostinger como backup** antes de mexer.
10. Trocar só estes registros:
    - `A @` → `76.76.21.21`
    - `CNAME www` → `cname.vercel-dns.com`
11. Esperar o DNS propagar e o HTTPS sair. Conferir que
    `https://www.bertoncinimendonca.adv.br/assinatura/logo-v-navy.png` abre e
    que o MX não mudou.

### Gabriel (assinaturas)
12. Na página de assinaturas (`Assinaturas de Email - Copiar.dc.html`), painel
    Tweaks, preencher `imageBaseUrl` com
    `https://www.bertoncinimendonca.adv.br/assinatura`.
13. Copiar as assinaturas e colar no webmail Hostinger do Juscelino e da Beatriz.
14. Mandar um e-mail de teste para um Gmail e um Outlook.
15. Revogar os dois tokens.

## Pendências
- Dono do projeto Supabase: conta do Gabriel ou do escritório?
- O zip de 65 MB está solto na raiz do repo, sem commit. Apagar ou mover.
