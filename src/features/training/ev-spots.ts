import { emit } from '@/app/events';
import { store } from '@/app/store';
import { areaName, getPokemon, methodLabel } from '@/data';
import { STAT_KEYS, STAT_LABEL } from '@/domain/constants';
import { bestEvSpots } from '@/domain/ev-training';
import type { StatKey } from '@/types';
import { byId, dataNum, delegate, esc, setPressed } from '@/ui/dom';

let stat: StatKey = 'atk';

function render(): void {
  const version = store.get('version');
  const spots = bestEvSpots(stat, version);
  const rows = spots
    .map(
      (s) =>
        `<tr class="click" data-area="${s.area}"><td><b>${esc(areaName(s.area))}</b></td><td><span class="method">${methodLabel(s.method)}</span></td><td class="r num"><b>${s.perBattle.toFixed(2)}</b></td><td class="r num">${Math.ceil(252 / s.perBattle)}</td><td class="r num">${s.averageLevel}</td><td class="note">${s.sources
          .map(
            (e) =>
              `${esc(getPokemon(e.pokemon).name)} ${e.rate[version]}% (+${getPokemon(e.pokemon).evYield[stat]})`,
          )
          .join(', ')}</td></tr>`,
    )
    .join('');
  byId('evspots').innerHTML =
    `<thead><tr><th>Área</th><th>Método</th><th class="r">EVs por batalha</th><th class="r">Batalhas até 252</th><th class="r">Nível médio</th><th>Pokémon que dão ${STAT_LABEL[stat]}</th></tr></thead><tbody>${rows}</tbody>`;
}

export function mountEvSpots(): void {
  const seg = byId('evstat');
  seg.innerHTML = STAT_KEYS.map(
    (k) => `<button data-s="${k}" aria-pressed="${k === stat}">${STAT_LABEL[k]}</button>`,
  ).join('');
  delegate(seg, 'click', '[data-s]', (b) => {
    stat = b.dataset.s as StatKey;
    setPressed(seg.querySelectorAll('button'), (x) => x === b);
    render();
  });
  delegate(byId('evspots'), 'click', '[data-area]', (r) => emit('area:open', dataNum(r, 'area')));
  store.subscribe('version', render);
  render();
}
