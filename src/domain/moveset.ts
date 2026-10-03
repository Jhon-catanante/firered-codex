import { TYPES, TYPE_CHART, getMove, getPokemon } from '@/data';
import type { Pokemon, Stats, TypeName } from '@/types';
import { learnablePool } from './learnsets';
import { isSupport, rankNatures, type RankedNature } from './natures';

/** Poder efetivo de golpes cujo valor no dataset é variável ou não reflete o uso real. */
export const FIXED_POWER: Record<string, number> = {
  'Double Kick': 60,
  Bonemerang: 100,
  Twineedle: 50,
  Return: 102,
  Eruption: 150,
  'Water Spout': 150,
  Pursuit: 40,
};

/** Golpes de dano que não fazem sentido numa build genérica (dano fixo, situacionais, de carga). */
const EXCLUDED = new Set([
  'Frustration',
  'Hidden Power',
  'Low Kick',
  'Seismic Toss',
  'Night Shade',
  'Dream Eater',
  'Explosion',
  'Self-Destruct',
  'Snore',
  'Fake Out',
  'Focus Punch',
  'Sonic Boom',
  'Dragon Rage',
  'Super Fang',
  'Endeavor',
  'Spit Up',
  'Present',
  'Magnitude',
  'Rollout',
  'Ice Ball',
  'Fury Cutter',
  'Rage',
  'Bide',
  'Counter',
  'Mirror Coat',
  'Thief',
  'Covet',
  'Struggle',
  'Bind',
  'Wrap',
  'Fire Spin',
  'Whirlpool',
  'Clamp',
  'Sand Tomb',
  'Flail',
  'Reversal',
  'Facade',
  'Uproar',
  'False Swipe',
  'Weather Ball',
  'Revenge',
  'Secret Power',
  'Solar Beam',
  'Future Sight',
  'Doom Desire',
  'Sky Attack',
  'Razor Wind',
  'Skull Bash',
  'Mega Kick',
]);

/** Penalidade por desvantagem (recarga, recuo, confusão, queda de status). */
const PENALTY: Record<string, number> = {
  'Hyper Beam': 0.55,
  'Blast Burn': 0.55,
  'Hydro Cannon': 0.55,
  'Frenzy Plant': 0.55,
  Thrash: 0.85,
  Outrage: 0.85,
  'Petal Dance': 0.85,
  Overheat: 0.65,
  'Psycho Boost': 0.65,
  Submission: 0.85,
  'Take Down': 0.9,
  'Double-Edge': 0.95,
  Dig: 0.85,
  Fly: 0.85,
  Dive: 0.85,
  Bounce: 0.85,
  Superpower: 0.9,
  'Volt Tackle': 0.9,
  'Zap Cannon': 0.8,
  'Dynamic Punch': 0.9,
};

const SETUP_PHYSICAL = ['Dragon Dance', 'Swords Dance', 'Bulk Up'];
const SETUP_SPECIAL = ['Calm Mind'];
const UTILITY = [
  'Spore',
  'Sleep Powder',
  'Hypnosis',
  'Lovely Kiss',
  'Thunder Wave',
  'Will-O-Wisp',
  'Leech Seed',
  'Soft-Boiled',
  'Recover',
  'Milk Drink',
  'Slack Off',
  'Toxic',
  'Rest',
  'Reflect',
  'Light Screen',
];

export interface Recommendation {
  moves: number[];
  nature: string;
  natures: RankedNature[];
  evs: Partial<Stats>;
  physical: boolean;
  mixed: boolean;
  fast: boolean;
  /** Tipos que o conjunto acerta super efetivo. */
  coverage: TypeName[];
}

export const effectivePower = (moveId: number): number | null => {
  const m = getMove(moveId);
  return FIXED_POWER[m.name] ?? m.power;
};

/** Pontuação de dano esperado: poder × precisão^1,5 × STAB × afinidade com o status de ataque. */
export function moveScore(p: Pokemon, moveId: number): number {
  const m = getMove(moveId);
  if (m.category === 'status' || EXCLUDED.has(m.name)) return 0;
  const power = effectivePower(moveId);
  if (!power) return 0;
  const accuracy = ((m.accuracy ?? 100) / 100) ** 1.5;
  const attack = m.category === 'physical' ? p.baseStats.atk : p.baseStats.spa;
  const affinity = (attack / Math.max(p.baseStats.atk, p.baseStats.spa)) ** 1.6;
  const stab = p.types.includes(m.type) ? 1.5 : 1;
  return power * accuracy * stab * affinity * (PENALTY[m.name] ?? 1);
}

function pickDamagingMoves(p: Pokemon, pool: number[], slots: number): number[] {
  let ranked = pool
    .map((id) => ({ id, score: moveScore(p, id) }))
    .filter((x) => x.score >= 40)
    .sort((a, b) => b.score - a.score);
  const top = ranked[0]?.score ?? 0;
  ranked = ranked.filter((x) => x.score >= top * 0.4);

  const chosen: number[] = [];
  // STAB primeiro, só quando é realmente forte para esse Pokémon.
  for (const t of p.types) {
    const best = ranked.find((x) => getMove(x.id).type === t && !chosen.includes(x.id));
    if (best && best.score >= top * 0.6) chosen.push(best.id);
  }
  if (!chosen.length && ranked[0]) chosen.push(ranked[0].id);

  // Depois, cobertura: cada golpe novo precisa acertar super efetivo tipos ainda não cobertos.
  while (chosen.length < slots) {
    const covered = TYPES.map((d) =>
      Math.max(0, ...chosen.map((c) => TYPE_CHART[getMove(c).type][d])),
    );
    let best: number | null = null;
    let bestScore = -1;
    for (const x of ranked) {
      const type = getMove(x.id).type;
      if (chosen.includes(x.id) || chosen.some((c) => getMove(c).type === type)) continue;
      const gain = TYPES.filter((d, i) => TYPE_CHART[type][d] >= 2 && (covered[i] ?? 0) < 2).length;
      const score = gain * 38 + x.score * 0.6;
      if (score > bestScore) {
        bestScore = score;
        best = x.id;
      }
    }
    if (best === null) break;
    chosen.push(best);
  }
  return chosen;
}

function evSpread(p: Pokemon, physical: boolean, mixed: boolean, fast: boolean): Partial<Stats> {
  const b = p.baseStats;
  if (isSupport(p)) {
    const main = b.def >= b.spd ? 'def' : 'spd';
    const other = main === 'def' ? 'spd' : 'def';
    return { hp: 252, [main]: 252, [other]: 4 };
  }
  const attack = physical ? 'atk' : 'spa';
  const secondary = physical ? 'spa' : 'atk';
  if (mixed)
    return fast
      ? { [attack]: 252, spe: 252, [secondary]: 4 }
      : { [attack]: 252, hp: 252, [secondary]: 4 };
  return fast
    ? { [attack]: 252, spe: 252, hp: 4 }
    : { hp: 252, [attack]: 252, [physical ? 'def' : 'spd']: 4 };
}

const cache = new Map<number, Recommendation>();

/** Build recomendada para jogar FireRed: golpes, natureza e EVs. */
export function recommend(pokemonId: number): Recommendation {
  const cached = cache.get(pokemonId);
  if (cached) return cached;

  const p = getPokemon(pokemonId);
  const pool = learnablePool(pokemonId);
  const hasStatus = [...SETUP_PHYSICAL, ...SETUP_SPECIAL, ...UTILITY].some((n) =>
    pool.some((id) => getMove(id).name === n),
  );
  const damaging = pickDamagingMoves(p, pool, hasStatus ? 3 : 4);

  let physicalScore = 0;
  let specialScore = 0;
  for (const id of damaging) {
    if (getMove(id).category === 'physical') physicalScore += moveScore(p, id);
    else specialScore += moveScore(p, id);
  }
  const statPhysical = p.baseStats.atk >= p.baseStats.spa;
  const physical =
    Math.abs(p.baseStats.atk - p.baseStats.spa) > 15 || !damaging.length
      ? statPhysical
      : physicalScore >= specialScore;
  const mixed =
    new Set(damaging.map((id) => getMove(id).category)).size > 1 &&
    Math.abs(p.baseStats.atk - p.baseStats.spa) <= 15;

  const utility = [...(physical ? SETUP_PHYSICAL : SETUP_SPECIAL), ...UTILITY]
    .map((n) => pool.find((id) => getMove(id).name === n))
    .filter((id): id is number => id !== undefined);
  const moves = [...damaging];
  for (const id of utility) {
    if (moves.length >= 4) break;
    if (damaging.length >= 3 && moves.length > damaging.length) break;
    moves.push(id);
  }

  const fast = p.baseStats.spe >= 75;
  const support = !damaging.length || isSupport(p);
  const natures = rankNatures(p, { physical, mixed, support });
  const result: Recommendation = {
    moves,
    nature: natures[0]?.name ?? 'Hardy',
    natures,
    evs: evSpread(p, physical, mixed && !isSupport(p), fast),
    physical,
    mixed,
    fast,
    coverage: TYPES.filter((d) => damaging.some((c) => TYPE_CHART[getMove(c).type][d] >= 2)),
  };
  cache.set(pokemonId, result);
  return result;
}
