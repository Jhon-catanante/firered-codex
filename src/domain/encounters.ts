import { areaName, encountersOf } from '@/data';
import type { Encounter, Version } from '@/types';

export const rateIn = (e: Encounter, v: Version): number => e.rate[v];

export const isEventArea = (areaId: number): boolean => /evento/.test(areaName(areaId));

/** Encontros válidos na versão, opcionalmente sem áreas de evento. */
export function encountersInVersion(
  pokemonId: number,
  version: Version,
  { includeEvents = true } = {},
): Encounter[] {
  return encountersOf(pokemonId).filter(
    (e) => e.rate[version] > 0 && (includeEvents || !isEventArea(e.area)),
  );
}

/** Melhor local (maior chance) para encontrar o Pokémon na versão, fora de eventos. */
export function bestEncounter(pokemonId: number, version: Version): Encounter | undefined {
  return encountersInVersion(pokemonId, version, { includeEvents: false }).sort(
    (a, b) => b.rate[version] - a.rate[version],
  )[0];
}

export const formatLevels = (e: Pick<Encounter, 'minLevel' | 'maxLevel'>): string =>
  e.minLevel === e.maxLevel ? String(e.minLevel) : `${e.minLevel}–${e.maxLevel}`;
