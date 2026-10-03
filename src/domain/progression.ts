import { POKEMON_IDS, areaName, encountersOf, getMove, getPokemon, hasMove, TYPES } from '@/data';
import type { Encounter, TrainerMon, TypeName, Version } from '@/types';
import { METHOD } from './constants';
import { isEventArea } from './encounters';
import { baseStatTotal } from './stats';
import { effectiveness } from './type-chart';

/** A partir de qual ginásio (0 = Brock … 7 = Giovanni, 8 = Liga) cada método de encontro está liberado. */
const METHOD_GATE: Partial<Record<number, number>> = {
  [METHOD.grass]: 0,
  [METHOD.oldRod]: 2,
  [METHOD.goodRod]: 4,
  [METHOD.superRod]: 4,
  [METHOD.surf]: 5,
};

/** Progressão da história: a partir de qual ginásio cada área fica acessível. */
const AREA_GATES: readonly [RegExp, number][] = [
  [/^Rota (1|22|2 \(sul\)|2 \(norte\))$|Viridian|Pallet/, 0],
  [/^Rota (3|4)$|Mount Moon/, 1],
  [/^Rota (24|25|5|6|11)$|Diglett|S\.S\. Anne|Cerulean City|Vermilion City/, 2],
  [/^Rota (7|8|9|10|16)$|Rock Tunnel|Celadon/, 3],
  [/^Rota (12|13|14|15|17|18)$|Safari|Pokémon Tower|Fuchsia/, 4],
  [/^Rota (19|20|21)$|Power Plant|Seafoam/, 5],
  [/Mansion|Cinnabar/, 6],
  [
    /Kindle Road|Treasure Beach|Mount Ember|Cape Brink|Bond Bridge|Berry Forest|One Island|Two Island|Three Isle/,
    7,
  ],
  [/^Rota 23$|Victory Road/, 8],
];

/** Índice de ginásio a partir do qual a área é acessível; 99 = só no pós-jogo. */
export function areaGate(name: string): number {
  for (const [re, gate] of AREA_GATES) if (re.test(name)) return gate;
  return 99;
}

/** Tipos de ataque que, em média, acertam o time adversário com 1,5× ou mais. */
export function bestAttackingTypes(team: readonly TrainerMon[]): { type: TypeName; avg: number }[] {
  return TYPES.map((type) => ({
    type,
    avg:
      team.reduce((s, m) => s + effectiveness(type, getPokemon(m.pokemon).types), 0) / team.length,
  }))
    .filter((x) => x.avg >= 1.5)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 4);
}

/** Tipos dos golpes ofensivos que o time adversário usa. */
export function offensiveThreats(team: readonly TrainerMon[]): TypeName[] {
  const types = new Set<TypeName>();
  for (const mon of team) {
    for (const mv of mon.moves) {
      if (typeof mv === 'number' && hasMove(mv) && getMove(mv).category !== 'status') {
        types.add(getMove(mv).type);
      }
    }
  }
  return [...types];
}

export interface CounterSuggestion {
  pokemon: number;
  score: number;
  where: Encounter;
}

/**
 * Pokémon capturáveis antes da batalha (pela progressão da história) que têm STAB nos tipos
 * que funcionam e resistem aos golpes do adversário.
 */
export function suggestCounters(
  team: readonly TrainerMon[],
  gymIndex: number,
  version: Version,
  limit = 4,
): CounterSuggestion[] {
  const good = bestAttackingTypes(team).map((x) => x.type);
  if (!good.length) return [];
  const ace = Math.max(...team.map((m) => m.level));
  const threats = offensiveThreats(team);

  const candidates: CounterSuggestion[] = [];
  for (const id of POKEMON_IDS) {
    const reachable = encountersOf(id).filter((e) => {
      const gate = METHOD_GATE[e.method];
      return (
        e.rate[version] > 0 &&
        gate !== undefined &&
        gymIndex >= gate &&
        !isEventArea(e.area) &&
        e.minLevel <= ace + 2 &&
        areaGate(areaName(e.area)) <= gymIndex
      );
    });
    if (!reachable.length) continue;
    const p = getPokemon(id);
    if (baseStatTotal(p) < 250) continue;
    const stab = p.types.filter((t) => good.includes(t)).length;
    if (!stab) continue;
    const resist =
      threats.filter((t) => effectiveness(t, p.types) < 1).length -
      threats.filter((t) => effectiveness(t, p.types) > 1).length;
    const where = reachable.sort((a, b) => b.rate[version] - a.rate[version])[0];
    if (!where) continue;
    candidates.push({
      pokemon: id,
      score: stab * 60 + baseStatTotal(p) * 0.25 + resist * 25,
      where,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const seenChains = new Set<number>();
  const out: CounterSuggestion[] = [];
  for (const c of candidates) {
    const chain = getPokemon(c.pokemon).evolutionChain;
    if (seenChains.has(chain)) continue;
    seenChains.add(chain);
    out.push(c);
    if (out.length >= limit) break;
  }
  return out;
}
