import { NATURES } from '@/data';
import { STAT_LABEL } from '@/domain/constants';
import { byId } from '@/ui/dom';

const STATS = ['atk', 'def', 'spa', 'spd', 'spe'] as const;

/** Grade 5×5: linha = status que sobe, coluna = status que cai; diagonal = neutras. */
export function mountNatureGrid(): void {
  let html =
    '<div class="h"></div>' + STATS.map((s) => `<div class="h">−${STAT_LABEL[s]}</div>`).join('');
  for (const up of STATS) {
    html += `<div class="h" style="text-align:right">+${STAT_LABEL[up]}</div>`;
    for (const down of STATS) {
      const n = NATURES.find((x) => x.up === up && x.down === down);
      if (!n) continue;
      html += `<div class="n ${up === down ? 'neutral' : ''}" title="${n.name}: +${STAT_LABEL[up]} −${STAT_LABEL[down]}">${n.name}</div>`;
    }
  }
  byId('natgrid').innerHTML = html;
}
