import { getLearnset, getPokemon, hasMove, machineFor } from '@/data';
import { ancestors } from './evolution';

export type LearnMethod = 'levelUp' | 'tm' | 'tutor' | 'egg';

/** Rótulo de máquina: 1–50 = TM, 101–108 = HM. */
export const machineLabel = (n: number): string =>
  n > 100 ? `HM${String(n - 100).padStart(2, '0')}` : `TM${String(n).padStart(2, '0')}`;

/** Todos os golpes que o Pokémon pode ter, incluindo os de nível das pré-evoluções. */
export function learnablePool(pokemonId: number): number[] {
  const l = getLearnset(pokemonId);
  if (!l) return [];
  const pool = new Set([...l.levelUp.map(([, id]) => id), ...l.tm, ...l.tutor, ...l.egg]);
  for (const pre of ancestors(pokemonId)) {
    getLearnset(pre)?.levelUp.forEach(([, id]) => pool.add(id));
  }
  return [...pool].filter(hasMove);
}

/** Texto curto de como o Pokémon aprende o golpe. */
export function howLearned(pokemonId: number, moveId: number): string {
  const l = getLearnset(pokemonId);
  if (!l) return '';
  const lv = l.levelUp.find(([, id]) => id === moveId);
  if (lv) return lv[0] <= 1 ? 'Já sabe ao nascer' : `Nível ${lv[0]}`;
  if (l.tm.includes(moveId)) {
    const n = machineFor(moveId);
    return n ? machineLabel(n) : 'TM';
  }
  if (l.tutor.includes(moveId)) return 'Tutor de golpes';
  if (l.egg.includes(moveId)) return 'Golpe de ovo';
  for (const pre of ancestors(pokemonId)) {
    const x = getLearnset(pre)?.levelUp.find(([, id]) => id === moveId);
    if (x) return `Como ${getPokemon(pre).name}, nível ${x[0]}`;
  }
  return '';
}
