import type { Pokemon, StatKey } from '@/types';
import { esc } from './dom';

const ORDER: readonly StatKey[] = ['hp', 'atk', 'def', 'spe', 'spd', 'spa'];
const SHORT: Record<StatKey, string> = {
  hp: 'HP',
  atk: 'Atq',
  def: 'Def',
  spa: 'AtE',
  spd: 'DfE',
  spe: 'Vel',
};
const R = 80;
const C = 100;

const point = (i: number, r: number): [number, number] => {
  const a = -Math.PI / 2 + (i * Math.PI) / 3;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};

/** Gráfico hexagonal de status base (escala até 160). */
export function statRadar(p: Pokemon, color: string): string {
  const ring = (f: number) => ORDER.map((_, i) => point(i, R * f).join(',')).join(' ');
  const shape = ORDER.map((k, i) => point(i, R * Math.min(1, p.baseStats[k] / 160)).join(',')).join(
    ' ',
  );
  const grid = [1, 0.66, 0.33]
    .map(
      (f) =>
        `<polygon points="${ring(f)}" fill="none" stroke="currentColor" stroke-opacity=".14"/>`,
    )
    .join('');
  const spokes = ORDER.map((_, i) => {
    const [x, y] = point(i, R);
    return `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="currentColor" stroke-opacity=".12"/>`;
  }).join('');
  const labels = ORDER.map((k, i) => {
    const [x, y] = point(i, R + 14);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10.5" font-weight="600" fill="currentColor" opacity=".7">${SHORT[k]}</text>`;
  }).join('');
  return `<svg class="radar" viewBox="0 0 200 200" role="img" aria-label="Gráfico de status de ${esc(p.name)}">${grid}${spokes}<polygon points="${shape}" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${labels}</svg>`;
}
