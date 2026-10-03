import { TRAINER_GROUPS } from '@/data';
import type { Starter, Trainer, TrainerMon } from '@/types';

export type BattleKind = 'gym' | 'league' | 'rival' | 'rocket' | 'rematch';

export interface ScheduledBattle {
  kind: BattleKind;
  trainer: Trainer;
  party: TrainerMon[];
}

/**
 * Em que etapa (ids de CHAPTERS) acontece cada batalha, na ordem do jogo.
 * Chave: id do grupo em trainers.json + posição do treinador no grupo.
 */
const SCHEDULE: readonly { group: string; index: number; chapter: number; kind: BattleKind }[] = [
  { group: 'rival', index: 0, chapter: 0, kind: 'rival' },
  { group: 'rival', index: 1, chapter: 0, kind: 'rival' },
  { group: 'gyms', index: 0, chapter: 0, kind: 'gym' },
  { group: 'gyms', index: 1, chapter: 1, kind: 'gym' },
  { group: 'rival', index: 2, chapter: 2, kind: 'rival' },
  { group: 'rival', index: 3, chapter: 2, kind: 'rival' },
  { group: 'gyms', index: 2, chapter: 2, kind: 'gym' },
  { group: 'gyms', index: 3, chapter: 3, kind: 'gym' },
  { group: 'rocket', index: 0, chapter: 4, kind: 'rocket' },
  { group: 'rival', index: 4, chapter: 4, kind: 'rival' },
  { group: 'gyms', index: 4, chapter: 4, kind: 'gym' },
  { group: 'rival', index: 5, chapter: 5, kind: 'rival' },
  { group: 'rocket', index: 1, chapter: 5, kind: 'rocket' },
  { group: 'gyms', index: 5, chapter: 5, kind: 'gym' },
  { group: 'gyms', index: 6, chapter: 6, kind: 'gym' },
  { group: 'gyms', index: 7, chapter: 7, kind: 'gym' },
  { group: 'rival', index: 6, chapter: 8, kind: 'rival' },
  { group: 'e4', index: 0, chapter: 8, kind: 'league' },
  { group: 'e4', index: 1, chapter: 8, kind: 'league' },
  { group: 'e4', index: 2, chapter: 8, kind: 'league' },
  { group: 'e4', index: 3, chapter: 8, kind: 'league' },
  { group: 'e4', index: 4, chapter: 8, kind: 'league' },
  { group: 'rematch', index: 0, chapter: 9, kind: 'rematch' },
  { group: 'rematch', index: 1, chapter: 9, kind: 'rematch' },
  { group: 'rematch', index: 2, chapter: 9, kind: 'rematch' },
  { group: 'rematch', index: 3, chapter: 9, kind: 'rematch' },
  { group: 'rematch', index: 4, chapter: 9, kind: 'rematch' },
];

/** Time do treinador; o rival e o Campeão dependem do inicial escolhido pelo jogador. */
export const partyFor = (t: Trainer, starter: Starter): TrainerMon[] =>
  t.party ?? t.partiesByStarter?.[starter] ?? [];

/** Batalhas obrigatórias e marcantes de uma etapa, na ordem em que acontecem. */
export function battlesInChapter(chapter: number, starter: Starter): ScheduledBattle[] {
  return SCHEDULE.filter((s) => s.chapter === chapter).flatMap((s) => {
    const trainer = TRAINER_GROUPS.find((g) => g.id === s.group)?.trainers[s.index];
    return trainer ? [{ kind: s.kind, trainer, party: partyFor(trainer, starter) }] : [];
  });
}

/** Nível do Pokémon mais forte do adversário: referência de nível para o seu time. */
export const aceLevel = (party: readonly TrainerMon[]): number =>
  party.reduce((max, m) => Math.max(max, m.level), 0);

export const BATTLE_KIND_LABEL: Record<BattleKind, string> = {
  gym: 'Líder de ginásio',
  league: 'Liga Pokémon',
  rival: 'Rival',
  rocket: 'Equipe Rocket',
  rematch: 'Revanche',
};
