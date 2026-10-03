import { TYPES, getPokemon } from '@/data';
import type { TypeName } from '@/types';
import { recommend } from './moveset';
import { effectiveness } from './type-chart';

export interface TypeExposure {
  type: TypeName;
  weak: number;
  resist: number;
  danger: boolean;
  safe: boolean;
}

export interface TeamReport {
  exposure: TypeExposure[];
  /** Tipos que acertam vários membros e quase ninguém resiste. */
  dangers: TypeName[];
  /** Tipos que os golpes recomendados não acertam super efetivo. */
  uncovered: TypeName[];
}

export function analyzeTeam(team: readonly number[]): TeamReport {
  const exposure = TYPES.map((type) => {
    let weak = 0;
    let resist = 0;
    for (const id of team) {
      const e = effectiveness(type, getPokemon(id).types);
      if (e > 1) weak++;
      else if (e < 1) resist++;
    }
    const danger = weak >= 3 || (weak >= 2 && resist === 0);
    return { type, weak, resist, danger, safe: !danger && resist >= 2 && weak <= 1 };
  });
  const covered = new Set(team.flatMap((id) => recommend(id).coverage));
  return {
    exposure,
    dangers: exposure
      .filter((x) => x.danger)
      .sort((a, b) => b.weak - a.weak)
      .map((x) => x.type),
    uncovered: TYPES.filter((t) => !covered.has(t)),
  };
}

export const MAX_TEAM_SIZE = 6;
