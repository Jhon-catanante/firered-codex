import { POKEMON_IDS, encountersOf, getPokemon } from '@/data';
import type { Version } from '@/types';
import { isEventArea } from './encounters';

export type LegendStatus = 'catch' | 'event' | 'trade';

export const LEGENDARY_IDS: readonly number[] = POKEMON_IDS.filter(
  (id) => getPokemon(id).legendary,
);

export function legendStatus(pokemonId: number, version: Version): LegendStatus {
  const rows = encountersOf(pokemonId).filter((e) => e.rate[version] > 0);
  if (rows.some((e) => !isEventArea(e.area))) return 'catch';
  return rows.length ? 'event' : 'trade';
}

export const LEGEND_STATUS_LABEL: Record<LegendStatus, string> = {
  catch: 'Capturável',
  event: 'Só por evento',
  trade: 'Só por troca',
};

const ORDER: Record<LegendStatus, number> = { catch: 0, event: 1, trade: 2 };

export const sortLegends = (version: Version): number[] =>
  [...LEGENDARY_IDS].sort(
    (a, b) => ORDER[legendStatus(a, version)] - ORDER[legendStatus(b, version)] || a - b,
  );
