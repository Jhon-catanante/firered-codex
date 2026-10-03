/**
 * Repositório de dados estáticos. Os JSON são gerados por `data-pipeline/` e já seguem os
 * modelos de `@/types`; aqui eles ganham tipos e índices para consulta rápida.
 */
import type {
  Ability,
  AnimeTeam,
  Encounter,
  Learnset,
  Move,
  Nature,
  Pokemon,
  TrainerGroup,
  TypeChart,
  TypeName,
} from '@/types';
import pokemonJson from './pokemon.json';
import movesJson from './moves.json';
import learnsetsJson from './learnsets.json';
import machinesJson from './machines.json';
import abilitiesJson from './abilities.json';
import encountersJson from './encounters.json';
import areasJson from './areas.json';
import methodsJson from './encounter-methods.json';
import naturesJson from './natures.json';
import typeChartJson from './type-chart.json';
import trainersJson from './trainers.json';
import animeJson from './anime.json';
import legendTipsJson from './legend-tips.json';

const pokemonList = pokemonJson as unknown as Pokemon[];
const moveList = movesJson as unknown as Move[];

export const POKEMON_IDS: readonly number[] = pokemonList.map((p) => p.id);
export const MAX_DEX = POKEMON_IDS.length;

const pokemonById = new Map(pokemonList.map((p) => [p.id, p]));
const moveById = new Map(moveList.map((m) => [m.id, m]));

export function getPokemon(id: number): Pokemon {
  const p = pokemonById.get(id);
  if (!p) throw new Error(`Pokémon #${id} não existe no dataset`);
  return p;
}

export const findPokemonByName = (name: string): Pokemon | undefined =>
  pokemonList.find((p) => p.name === name);

export const allPokemon = (): readonly Pokemon[] => pokemonList;

export function getMove(id: number): Move {
  const m = moveById.get(id);
  if (!m) throw new Error(`Golpe ${id} não existe no dataset`);
  return m;
}

export const hasMove = (id: number): boolean => moveById.has(id);
export const allMoves = (): readonly Move[] => moveList;

const learnsets = learnsetsJson as unknown as Record<string, Learnset>;
export const getLearnset = (pokemonId: number): Learnset | undefined =>
  learnsets[String(pokemonId)];
export const allLearnsets = (): Readonly<Record<string, Learnset>> => learnsets;

const machines = machinesJson as unknown as Record<string, number>;
/** Número da máquina (1–50 = TM, 101–108 = HM) que ensina o golpe, se houver. */
export const machineFor = (moveId: number): number | undefined => machines[String(moveId)];

const abilities = abilitiesJson as unknown as Record<string, Ability>;
export const getAbility = (id: number): Ability =>
  abilities[String(id)] ?? { name: '?', description: '' };

export const ENCOUNTERS = encountersJson as unknown as readonly Encounter[];

function groupBy<K>(rows: readonly Encounter[], key: (e: Encounter) => K): Map<K, Encounter[]> {
  const map = new Map<K, Encounter[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(row);
    else map.set(k, [row]);
  }
  return map;
}

const encountersByPokemon = groupBy(ENCOUNTERS, (e) => e.pokemon);
const encountersByArea = groupBy(ENCOUNTERS, (e) => e.area);

export const encountersOf = (pokemonId: number): readonly Encounter[] =>
  encountersByPokemon.get(pokemonId) ?? [];
export const encountersIn = (areaId: number): readonly Encounter[] =>
  encountersByArea.get(areaId) ?? [];

const areas = areasJson as unknown as Record<string, string>;
export const AREA_IDS: readonly number[] = Object.keys(areas).map(Number);
export const areaName = (id: number): string => areas[String(id)] ?? '?';

const methods = methodsJson as unknown as Record<string, string>;
export const methodLabel = (id: number): string => methods[String(id)] ?? 'Outro';

export const NATURES = naturesJson as unknown as readonly Nature[];

const typeChart = typeChartJson as unknown as { types: TypeName[]; chart: TypeChart };
export const TYPES: readonly TypeName[] = typeChart.types;
export const TYPE_CHART: Readonly<TypeChart> = typeChart.chart;

export const TRAINER_GROUPS = trainersJson as unknown as readonly TrainerGroup[];
export const ANIME_TEAMS = animeJson as unknown as readonly AnimeTeam[];

const legendTips = legendTipsJson as unknown as Record<string, string>;
export const legendTip = (pokemonId: number): string | undefined => legendTips[String(pokemonId)];
