import { NATURES } from '@/data';
import type { Pokemon, StatKey } from '@/types';
import { STAT_KEYS } from './constants';

export const baseStatTotal = (p: Pick<Pokemon, 'baseStats'>): number =>
  STAT_KEYS.reduce((sum, k) => sum + p.baseStats[k], 0);

export interface StatInput {
  base: number;
  iv: number;
  ev: number;
  level: number;
  nature: string;
}

/** Multiplicador da natureza (1,1 / 0,9 / 1) para um status. */
export function natureMultiplier(nature: string, stat: StatKey): number {
  const n = NATURES.find((x) => x.name === nature);
  if (!n || n.up === n.down || stat === 'hp') return 1;
  if (n.up === stat) return 1.1;
  if (n.down === stat) return 0.9;
  return 1;
}

/** Fórmula de status da Geração III, com arredondamento para baixo em cada etapa. */
export function calcStat(stat: StatKey, { base, iv, ev, level, nature }: StatInput): number {
  const core = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);
  if (stat === 'hp') return base === 1 ? 1 : core + level + 10; // Shedinja sempre tem 1 HP
  return Math.floor((core + 5) * natureMultiplier(nature, stat));
}

/** Menor e maior valor possível no nível 100 (IV 0/EV 0/natureza contra × IV 31/EV 252/natureza a favor). */
export function statRangeAt100(stat: StatKey, base: number): [min: number, max: number] {
  if (stat === 'hp') return base === 1 ? [1, 1] : [2 * base + 110, 2 * base + 31 + 63 + 110];
  return [Math.floor((2 * base + 5) * 0.9), Math.floor((2 * base + 31 + 63 + 5) * 1.1)];
}

export const MAX_TOTAL_EVS = 510;
export const MAX_STAT_EVS = 255;
