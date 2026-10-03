import { TYPES, TYPE_CHART } from '@/data';
import type { TypeName } from '@/types';

/** Multiplicador de dano de um golpe do tipo `attack` contra um Pokémon com `defense`. */
export function effectiveness(attack: TypeName, defense: readonly TypeName[]): number {
  return defense.reduce((mult, def) => mult * TYPE_CHART[attack][def], 1);
}

export type MatchupGroups = Record<4 | 2 | 0.5 | 0.25 | 0, TypeName[]>;

/** Agrupa os 17 tipos de ataque pelo multiplicador que causam no defensor. */
export function defensiveMatchups(defense: readonly TypeName[]): MatchupGroups {
  const groups: MatchupGroups = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
  for (const t of TYPES) {
    const e = effectiveness(t, defense) as keyof MatchupGroups;
    groups[e]?.push(t);
  }
  return groups;
}
