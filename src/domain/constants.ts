import type { MoveCategory, StatKey, TypeName, Version } from '@/types';

export const STAT_KEYS: readonly StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export const STAT_LABEL: Record<StatKey, string> = {
  hp: 'HP',
  atk: 'Ataque',
  def: 'Defesa',
  spa: 'Atq. Esp.',
  spd: 'Def. Esp.',
  spe: 'Velocidade',
};

export const TYPE_LABEL: Record<TypeName, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  electric: 'Elétrico',
  grass: 'Grama',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terrestre',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
};

export const TYPE_COLOR: Record<TypeName, string> = {
  normal: '#9A9A72',
  fire: '#EE7A2E',
  water: '#5487EE',
  electric: '#E3B91A',
  grass: '#5DB43A',
  ice: '#5CC2BD',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#CFA748',
  flying: '#8E73E8',
  psychic: '#F2507F',
  bug: '#95A814',
  rock: '#A99630',
  ghost: '#6A4F8F',
  dragon: '#6A32F2',
  dark: '#6B5444',
  steel: '#8F8FAE',
};

export const CATEGORY_LABEL: Record<MoveCategory, string> = {
  physical: 'Físico',
  special: 'Especial',
  status: 'Status',
};

/** Na Geração III a categoria do golpe é definida pelo tipo, não pelo golpe. */
export const PHYSICAL_TYPES: ReadonlySet<TypeName> = new Set<TypeName>([
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
]);

export const HABITAT_LABEL: Record<number, string> = {
  1: 'Caverna',
  2: 'Floresta',
  3: 'Campo',
  4: 'Montanha',
  5: 'Raro',
  6: 'Terreno acidentado',
  7: 'Mar',
  8: 'Cidade',
  9: "Beira d'água",
};

export const VERSION_LABEL: Record<Version, string> = { fr: 'FireRed', lg: 'LeafGreen' };
export const otherVersion = (v: Version): Version => (v === 'fr' ? 'lg' : 'fr');

/** Métodos de encontro (ids da PokéAPI) usados nas regras. */
export const METHOD = {
  grass: 1,
  oldRod: 2,
  goodRod: 3,
  superRod: 4,
  surf: 5,
  gift: 18,
  egg: 19,
  static: 20,
  pokeFlute: 21,
  trade: 36,
} as const;
