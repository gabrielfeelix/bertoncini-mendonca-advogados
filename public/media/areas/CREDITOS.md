# Imagens das páginas de área

Procedência e licença de cada arquivo. Registrado aqui porque licença
CC BY-SA **exige atribuição**: se alguma destas imagens for para o site
publicado, o crédito precisa aparecer em algum lugar visível (rodapé da
página, legenda ou uma página de créditos).

| Arquivo | Origem | Autoria | Licença |
|---|---|---|---|
| `maringa-*` | [Maringá (5459246839).jpg](https://commons.wikimedia.org/wiki/File:Maring%C3%A1_(5459246839).jpg), Wikimedia Commons | ver página do arquivo | CC BY 2.0 |

Recorte 4:3 feito com `sharp` (`fit: cover`, `position: attention`), em
AVIF, WebP e JPEG nas larguras 900 e 1400.

## Pendência

As cenas conceituais usam ilustração vetorial própria
(`src/components/Marca.astro`), não foto — decisão registrada lá.

Se o cliente preferir fotografia própria do escritório em vez da imagem
da cidade, é só substituir os arquivos `maringa-*` mantendo os nomes: o
layout não muda. O texto alternativo fica em
`src/content/areas/direito-digital.json`, no campo `fotoAlt` da cena.
