import type { Version } from '@/types';
import { METHOD } from './constants';
import { encountersInVersion } from './encounters';
import { ancestors, evolutionPath } from './evolution';

export type Availability = 'wild' | 'gift' | 'npc' | 'static' | 'evo' | 'trade' | 'none';

/** Aparece diretamente na versão (fora de eventos), por qualquer método. */
export const obtainableDirectly = (pokemonId: number, version: Version): boolean =>
  encountersInVersion(pokemonId, version, { includeEvents: false }).length > 0;

/** Como o Pokémon pode ser obtido na versão, sem trocas com outros jogos. */
export function availability(pokemonId: number, version: Version): Availability {
  const encounters = encountersInVersion(pokemonId, version, { includeEvents: false });
  if (encounters.length) {
    const methods = new Set(encounters.map((e) => e.method));
    const only = (...ms: number[]) => [...methods].every((m) => ms.includes(m));
    if (only(METHOD.gift, METHOD.egg)) return 'gift';
    if (only(METHOD.trade)) return 'npc';
    if (only(METHOD.static, METHOD.pokeFlute)) return 'static';
    return 'wild';
  }
  const source = obtainableAncestor(pokemonId, version);
  if (source === undefined) return 'none';
  return /Troca/.test(evolutionPath(pokemonId, source)) ? 'trade' : 'evo';
}

/** Ancestral mais próximo que pode ser obtido diretamente na versão. */
export const obtainableAncestor = (pokemonId: number, version: Version): number | undefined =>
  ancestors(pokemonId).find((a) => obtainableDirectly(a, version));

export const AVAILABILITY_LABEL: Record<
  Availability,
  { tone: 'wild' | 'evo' | 'no'; text: string }
> = {
  wild: { tone: 'wild', text: 'Selvagem' },
  gift: { tone: 'wild', text: 'Presente' },
  npc: { tone: 'evo', text: 'Troca com NPC' },
  static: { tone: 'wild', text: 'Encontro único' },
  evo: { tone: 'evo', text: 'Por evolução' },
  trade: { tone: 'evo', text: 'Evolui por troca' },
  none: { tone: 'no', text: 'Só por troca' },
};
