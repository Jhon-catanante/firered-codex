import { AREA_IDS, areaName, encountersIn } from '@/data';
import type { TypeName } from '@/types';
import { METHOD } from './constants';
import { isEventArea } from './encounters';
import { areaGate } from './progression';

/** Etapas da história de FireRed, na ordem em que o jogador passa por elas. */
export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  /** Tipo do ginásio que fecha a etapa (dá a cor da etapa). */
  type: TypeName | null;
}

export const CHAPTERS: readonly Chapter[] = [
  { id: 0, title: 'Pallet a Pewter', subtitle: 'Antes de Brock', type: 'rock' },
  { id: 1, title: 'Mt. Moon e Cerulean', subtitle: 'Antes de Misty', type: 'water' },
  { id: 2, title: 'Cerulean a Vermilion', subtitle: 'Antes de Lt. Surge', type: 'electric' },
  { id: 3, title: 'Rock Tunnel e Celadon', subtitle: 'Antes de Erika', type: 'grass' },
  { id: 4, title: 'Lavender a Fuchsia', subtitle: 'Antes de Koga', type: 'poison' },
  { id: 5, title: 'Saffron e o mar', subtitle: 'Antes de Sabrina', type: 'psychic' },
  { id: 6, title: 'Cinnabar', subtitle: 'Antes de Blaine', type: 'fire' },
  { id: 7, title: 'Ilhas Sevii (1 a 3)', subtitle: 'Antes de Giovanni', type: 'ground' },
  { id: 8, title: 'Victory Road', subtitle: 'Liga Pokémon', type: 'dragon' },
  { id: 9, title: 'Pós-jogo', subtitle: 'Ilhas 4 a 7 e Cerulean Cave', type: null },
  { id: 10, title: 'Eventos', subtitle: 'Só com distribuição oficial', type: null },
];

const POST_GAME = 9;
const EVENTS = 10;

/** Áreas que a regra de progressão não cobre (presentes e trocas), posicionadas à mão. */
const CHAPTER_OVERRIDES: readonly [RegExp, number][] = [
  [/^Pokémon Center \(Rota [34]\)$/, 1],
  [/^Underground Path$/, 2],
  [/^Fighting Dojo$|^Silph Co\./, 5],
];

/** Etapa da história em que a área fica acessível. */
export function chapterOf(areaId: number): number {
  if (isEventArea(areaId)) return EVENTS;
  const name = areaName(areaId);
  for (const [re, chapter] of CHAPTER_OVERRIDES) if (re.test(name)) return chapter;
  const gate = areaGate(name);
  return gate <= 8 ? gate : POST_GAME;
}

export type PlaceKind =
  'route' | 'sea' | 'coast' | 'cave' | 'forest' | 'mountain' | 'city' | 'building' | 'roaming';

/** Um lugar do mapa: agrupa andares e salas (ex.: Mount Moon 1F, B1F e B2F). */
export interface Place {
  key: string;
  name: string;
  chapter: number;
  kind: PlaceKind;
  /** Áreas (andares/salas) na ordem de exibição. */
  areas: number[];
}

/** Nome do lugar sem o sufixo de andar/sala: "Mount Moon (B1F)" → "Mount Moon". */
export const placeName = (areaName: string): string => {
  const base = areaName.replace(
    / \((?:\d?B?\d?F|B\dF|room \d+|item rooms|entrance|waterfall|inside|cave|[A-I]|1F, cave behind team rocket|north|south|norte|sul|middle|Area \d, \w+)\)(?: — evento)?$/,
    '',
  );
  return base;
};

/** Rótulo curto do andar/sala, exibido nos chips dentro do card. */
export const floorLabel = (areaName: string, place: string): string => {
  const rest = areaName
    .slice(place.length)
    .replace(/^ \(|\)$/g, '')
    .replace(/\) — evento$/, '');
  return rest || 'Principal';
};

const WATER_METHODS: ReadonlySet<number> = new Set([
  METHOD.oldRod,
  METHOD.goodRod,
  METHOD.superRod,
  METHOD.surf,
]);

function kindOf(name: string, areas: number[]): PlaceKind {
  if (/^Errante/.test(name)) return 'roaming';
  if (/Cave|Tunnel|Mount Moon|Seafoam|Chamber|Victory Road|Diglett/.test(name)) return 'cave';
  if (/Forest|Pattern Bush/.test(name)) return 'forest';
  if (/Mount Ember|Canyon|Ruin Valley/.test(name)) return 'mountain';
  if (
    /Pokémon Tower|Pokémon Mansion|Power Plant|Silph|Dojo|Trainer Tower|S\.S\. Anne|Lab|Game Corner|Celadon Mansion|Pokémon Center|Underground|Birth Island|Navel Rock/.test(
      name,
    )
  )
    return 'building';
  if (/City|Town|Island$|Isle Port|Resort/.test(name)) return 'city';
  if (
    /Safari|Meadow|Kindle|Treasure|Cape|Bond|Water Path|Memorial|Outcast|Tanoby|Water Labyrinth|Green Path/.test(
      name,
    )
  )
    return 'coast';
  const methods = areas.flatMap((a) => encountersIn(a).map((e) => e.method));
  if (methods.length && methods.every((m) => WATER_METHODS.has(m))) return 'sea';
  return 'route';
}

/** Hábitat da cena ilustrada de cada tipo de lugar (mesmos ids de hábitat da Pokédex). */
export const PLACE_SCENE: Record<PlaceKind, number> = {
  route: 3,
  sea: 7,
  coast: 9,
  cave: 1,
  forest: 2,
  mountain: 4,
  city: 8,
  building: 6,
  roaming: 5,
};

const routeNumber = (name: string): number => Number(/^Rota (\d+)/.exec(name)?.[1] ?? 999);

/** Lugares agrupados por etapa, na ordem da jornada. */
export function buildJourney(): { chapter: Chapter; places: Place[] }[] {
  const places = new Map<string, Place>();
  for (const area of AREA_IDS) {
    const name = areaName(area);
    const base = placeName(name);
    const chapter = chapterOf(area);
    const key = `${chapter}:${base}`;
    const place = places.get(key) ?? {
      key,
      name: base,
      chapter,
      kind: 'route' as PlaceKind,
      areas: [],
    };
    place.areas.push(area);
    places.set(key, place);
  }
  for (const p of places.values()) {
    p.areas.sort((a, b) => areaName(a).localeCompare(areaName(b), 'en', { numeric: true }));
    p.kind = kindOf(p.name, p.areas);
  }
  return CHAPTERS.map((chapter) => ({
    chapter,
    places: [...places.values()]
      .filter((p) => p.chapter === chapter.id)
      .sort((a, b) => routeNumber(a.name) - routeNumber(b.name) || a.name.localeCompare(b.name)),
  })).filter((c) => c.places.length);
}

/** Famílias de método usadas no filtro da aba Rotas. */
export type MethodFamily = 'grass' | 'water' | 'rocks' | 'special';

export function methodFamily(method: number): MethodFamily {
  if (method === METHOD.grass) return 'grass';
  if (WATER_METHODS.has(method)) return 'water';
  if (method === 6) return 'rocks';
  return 'special';
}

export const METHOD_FAMILY_LABEL: Record<MethodFamily, string> = {
  grass: 'Grama e cavernas',
  water: 'Surf e pesca',
  rocks: 'Rock Smash',
  special: 'Presentes e especiais',
};
