/** Modelos de domínio da Geração III (FireRed / LeafGreen). */

export type TypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel';

export type StatKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
export type Stats = Record<StatKey, number>;

export type Version = 'fr' | 'lg';
export type Starter = 'bulbasaur' | 'charmander' | 'squirtle';
export type MoveCategory = 'physical' | 'special' | 'status';

export interface Pokemon {
  id: number;
  name: string;
  types: TypeName[];
  baseStats: Stats;
  evYield: Partial<Stats>;
  abilities: number[];
  evolvesFrom: number | null;
  evolutionChain: number;
  /** Texto curto de como evolui a partir da forma anterior (ex.: "Nv. 16"). */
  evolutionMethod: string;
  /** Chance de ser fêmea em oitavos; -1 = sem gênero. */
  genderRate: number;
  captureRate: number;
  hatchCounter: number;
  legendary: boolean;
  habitat: number;
}

export interface Move {
  id: number;
  name: string;
  type: TypeName;
  category: MoveCategory;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  effect: string;
}

export interface Learnset {
  levelUp: [level: number, moveId: number][];
  tm: number[];
  tutor: number[];
  egg: number[];
}

export interface Ability {
  name: string;
  description: string;
}

export interface Encounter {
  area: number;
  pokemon: number;
  method: number;
  /** Chance de encontro (%) em cada versão; 0 = não aparece. */
  rate: Record<Version, number>;
  minLevel: number;
  maxLevel: number;
}

export interface Nature {
  name: string;
  up: Exclude<StatKey, 'hp'>;
  down: Exclude<StatKey, 'hp'>;
}

export type TypeChart = Record<TypeName, Record<TypeName, number>>;

/** Golpe de treinador: id conhecido ou nome livre quando não existe no dataset. */
export type TrainerMove = number | string;

export interface TrainerMon {
  pokemon: number;
  level: number;
  moves: TrainerMove[];
  item: string | null;
}

export interface Trainer {
  name: string;
  subtitle: string;
  type: TypeName | null;
  /** Índice de progressão (0 = Brock … 8 = Liga) usado para sugerir capturas. */
  gymIndex: number | null;
  tag?: string | null;
  party?: TrainerMon[];
  partiesByStarter?: Record<Starter, TrainerMon[]>;
}

export interface TrainerGroup {
  id: string;
  title: string;
  description: string;
  trainers: Trainer[];
}

export interface AnimeTeam {
  name: string;
  era: string;
  pokemon: { pokemon: number; note: string }[];
}
