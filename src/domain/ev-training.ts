import { encountersIn, getPokemon } from '@/data';
import type { Encounter, StatKey, Version } from '@/types';
import { SORTED_AREAS } from './areas';
import { METHOD } from './constants';
import { isEventArea } from './encounters';

export interface EvSpot {
  area: number;
  method: number;
  /** EVs esperados por batalha no status escolhido. */
  perBattle: number;
  /** Fração de encontros que dão só esse status. */
  purity: number;
  averageLevel: number;
  sources: Encounter[];
}

/** Melhores lugares para treinar um status, pela média ponderada de EVs por encontro. */
export function bestEvSpots(stat: StatKey, version: Version, limit = 10): EvSpot[] {
  const spots: EvSpot[] = [];
  for (const area of SORTED_AREAS) {
    if (isEventArea(area)) continue;
    for (const method of [METHOD.grass, METHOD.surf]) {
      const rows = encountersIn(area).filter((e) => e.method === method && e.rate[version] > 0);
      if (!rows.length) continue;
      const ev = (e: Encounter) => getPokemon(e.pokemon).evYield[stat] ?? 0;
      const perBattle = rows.reduce((s, e) => s + (e.rate[version] / 100) * ev(e), 0);
      if (perBattle <= 0) continue;
      const purity = rows.reduce((s, e) => {
        const yields = getPokemon(e.pokemon).evYield;
        return s + (ev(e) && Object.keys(yields).length === 1 ? e.rate[version] / 100 : 0);
      }, 0);
      const weight = rows.reduce((s, e) => s + e.rate[version], 0);
      const averageLevel = Math.round(
        rows.reduce((s, e) => s + (e.rate[version] * (e.minLevel + e.maxLevel)) / 2, 0) / weight,
      );
      const sources = rows
        .filter((e) => ev(e) > 0)
        .sort((a, b) => b.rate[version] - a.rate[version]);
      spots.push({ area, method, perBattle, purity, averageLevel, sources });
    }
  }
  return spots.sort((a, b) => b.perBattle - a.perBattle || b.purity - a.purity).slice(0, limit);
}
