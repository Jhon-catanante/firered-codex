import { AREA_IDS, areaName } from '@/data';

export const AREA_GROUPS = [
  'Rotas de Kanto',
  'Cavernas, florestas e prédios',
  'Cidades e presentes',
  'Ilhas Sevii',
] as const;
export type AreaGroup = (typeof AREA_GROUPS)[number];

const SEVII =
  /Island|Isle|Bridge|Kindle|Cape|Treasure|Water Path|Ruin|Tanoby|Chamber|Pattern|Outcast|Canyon|Sevault|Resort|Memorial|Mount Ember|Berry|Icefall|Lost Cave|Altering|Navel|Birth|Trainer Tower|Three Isle|Green Path|Water Labyrinth|Dilford|Liptoo|Monean|Rixy|Scufib|Viapos|Weepth/;
const TOWNS =
  /City|Town|Island$|Prize|Mansion rooftop|Lab|Dojo|Pokémon Center|Pokemon Center|Silph|S\.S\./;

export function areaGroup(name: string): AreaGroup {
  if (/^Rota \d/.test(name)) return 'Rotas de Kanto';
  if (SEVII.test(name)) return 'Ilhas Sevii';
  if (TOWNS.test(name)) return 'Cidades e presentes';
  return 'Cavernas, florestas e prédios';
}

const routeNumber = (name: string): number => Number(/^Rota (\d+)/.exec(name)?.[1] ?? 999);

/** Áreas ordenadas: rotas pelo número, o resto em ordem alfabética. */
export const SORTED_AREAS: readonly number[] = [...AREA_IDS].sort((a, b) => {
  const A = areaName(a);
  const B = areaName(b);
  return routeNumber(A) - routeNumber(B) || A.localeCompare(B);
});
