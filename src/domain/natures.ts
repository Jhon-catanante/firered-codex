import { NATURES } from '@/data';
import type { Nature, Pokemon, StatKey } from '@/types';
import { STAT_LABEL } from './constants';

export interface Role {
  physical: boolean;
  mixed: boolean;
  support: boolean;
}

export interface RankedNature extends Nature {
  score: number;
  reason: string;
}

type BattleStat = Exclude<StatKey, 'hp'>;

const UP_REASON: Record<BattleStat, string> = {
  atk: 'Ataque é o que move os golpes físicos dele',
  spa: 'Atq. Esp. é o que move os golpes especiais dele',
  spe: 'mais Velocidade para atacar antes do inimigo',
  def: 'aguenta mais golpes físicos',
  spd: 'aguenta mais golpes especiais',
};

/** Peso de cada status para o papel do Pokémon (0 = status que ele não usa). */
export function statWeights(p: Pokemon, role: Role): Record<BattleStat, number> {
  const b = p.baseStats;
  const spe = b.spe >= 90 ? 1.05 : b.spe >= 75 ? 0.95 : b.spe >= 55 ? 0.55 : 0.2;
  if (role.support) {
    return { atk: 0.12, spa: 0.12, def: 0.35 + b.def / 220, spd: 0.35 + b.spd / 220, spe };
  }
  return {
    atk: role.physical ? 1 : role.mixed ? 0.55 : 0,
    spa: !role.physical ? 1 : role.mixed ? 0.55 : 0,
    def: 0.22 + b.def / 450,
    spd: 0.22 + b.spd / 450,
    spe,
  };
}

/**
 * Ranqueia as 20 naturezas não neutras: quanto o status que sobe importa menos quanto o
 * status que cai importa para esse papel.
 */
export function rankNatures(p: Pokemon, role: Role, top = 3): RankedNature[] {
  const w = statWeights(p, role);
  return NATURES.filter((n) => n.up !== n.down)
    .map((n) => ({ ...n, score: w[n.up] - w[n.down] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, top)
    .map((n) => ({
      ...n,
      reason: `${UP_REASON[n.up]}; ${
        w[n.down] === 0
          ? `corta ${STAT_LABEL[n.down]}, que ele não usa`
          : `perde um pouco de ${STAT_LABEL[n.down]}, que pesa pouco no papel dele`
      }.`,
    }));
}

export const isSupport = (p: Pokemon): boolean => {
  const b = p.baseStats;
  return Math.max(b.atk, b.spa) < 70 && (b.def + b.spd >= 160 || b.hp + b.def + b.spd >= 220);
};
