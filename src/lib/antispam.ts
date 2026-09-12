/**
 * Defesas dos formulários, na ordem em que rodam.
 *
 * Adaptado de `src/lib/antispam.ts` do projeto Isabella Pires. A lista de
 * campos-isca lá vinha do HTML herdado do Framer (11 nomes que o Framer já
 * gerava). Aqui o HTML é nosso, então a lista foi reduzida aos nomes que um
 * robô de preenchimento por heurística realmente tenta, e nenhum deles
 * colide com um campo de verdade dos nossos formulários.
 */
export const CAMPOS_ISCA = [
  'website', 'empresa', 'company', 'assunto', 'subject', 'url',
] as const;

export function caiuNaIsca(dados: FormData): boolean {
  return CAMPOS_ISCA.some((campo) => String(dados.get(campo) ?? '').trim() !== '');
}

/**
 * Limite por IP, em memória.
 *
 * Ressalva honesta, a mesma da Isabella: cada instância da função tem o
 * próprio mapa, então isto segura repetição de um mesmo visitante, não um
 * ataque distribuído. Para o volume deste site é suficiente. Se um dia não
 * for, o passo seguinte é um armazenamento compartilhado (Upstash/KV), não
 * afinar estes números.
 */
const JANELA_MS = 10 * 60 * 1000;
const MAXIMO = 5;
const historico = new Map<string, number[]>();

export function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (historico.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  historico.set(ip, recentes);

  // Poda oportunista: sem isto o mapa cresce enquanto a instância viver.
  if (historico.size > 500) {
    for (const [chave, marcas] of historico) {
      if (marcas.every((t) => agora - t >= JANELA_MS)) historico.delete(chave);
    }
  }

  return recentes.length > MAXIMO;
}

/** O bastante para barrar lixo óbvio sem recusar endereço válido e estranho. */
export function emailPlausivel(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor) && valor.length <= 254;
}

export function texto(dados: FormData, campo: string, limite: number): string {
  return String(dados.get(campo) ?? '').trim().slice(0, limite);
}
