import { getPokemon } from '@/data';
import { AVAILABILITY_LABEL, type Availability } from '@/domain/availability';
import { STAT_KEYS } from '@/domain/constants';
import { esc, pad3 } from '@/ui/dom';
import { habitatScene } from '@/ui/habitat-scene';
import { typeIcon } from '@/ui/icons';
import { typeChips, typeColorVars } from '@/ui/type-chip';

/** Card da Pokédex: arte por tipo e hábitat, tipos, mini-gráfico de status e disponibilidade. */
export function pokemonCard(
  id: number,
  index: number,
  statLine: string,
  avail: Availability,
): string {
  const p = getPokemon(id);
  const label = AVAILABILITY_LABEL[avail];
  const spark = STAT_KEYS.map(
    (k) => `<i style="height:${Math.max(8, Math.min(100, p.baseStats[k] / 1.6))}%"></i>`,
  ).join('');
  return `<button class="card" data-p="${id}" style="--i:${Math.min(index, 24)};${typeColorVars(p.types)}" aria-label="${esc(p.name)}, número ${id}">
    <span class="art"><span class="no">#${pad3(id)}</span>${p.legendary ? '<span class="leg">Lendário</span>' : ''}${habitatScene(p.habitat)}<span class="emb">${typeIcon(p.types[0] ?? 'normal')}</span></span>
    <span class="body"><span class="nm">${esc(p.name)}</span><span class="tys">${typeChips(p.types)}</span>
    <span class="spark" title="HP, Ataque, Defesa, Atq. Esp., Def. Esp., Velocidade">${spark}</span>
    <span class="meta"><span>${statLine}</span><span class="badge ${label.tone}">${label.text}</span></span></span>
  </button>`;
}
