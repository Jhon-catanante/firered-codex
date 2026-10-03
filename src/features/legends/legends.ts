import { emit } from '@/app/events';
import { store } from '@/app/store';
import { areaName, getPokemon, legendTip, methodLabel } from '@/data';
import { BALL, STATUS, catchChance, expectedBalls } from '@/domain/catch';
import { encountersInVersion } from '@/domain/encounters';
import {
  LEGEND_STATUS_LABEL,
  legendStatus,
  sortLegends,
  type LegendStatus,
} from '@/domain/legends';
import { byId, dataNum, delegate, esc, pad3 } from '@/ui/dom';
import { percent } from '@/ui/format';
import { habitatScene } from '@/ui/habitat-scene';
import { typeIcon } from '@/ui/icons';
import { typeChips, typeColorVars } from '@/ui/type-chip';

function fallbackTip(id: number, status: LegendStatus): string {
  if (status !== 'trade') return '';
  const from =
    id >= 377 ? 'Ruby, Sapphire, Emerald' : 'Gold/Silver/Crystal via Colosseum ou eventos';
  return `Não aparece em FireRed nem LeafGreen. Só trocando com ${from}.`;
}

function oddsBlock(captureRate: number): string {
  const scenarios = [
    { label: 'HP cheio', hp: 1, status: STATUS.none },
    { label: '1 HP', hp: 0, status: STATUS.none },
    { label: '1 HP + sono', hp: 0, status: STATUS.sleep },
  ];
  const cells = scenarios
    .map(({ label, hp, status }) => {
      const p = catchChance({ captureRate, ball: BALL.ultra, hpFraction: hp, status });
      const balls = expectedBalls(p);
      return `<div><b>${percent(p)}</b>${label}<br>${balls === 1 ? '1' : `≈${balls}`} bolas</div>`;
    })
    .join('');
  return `<div class="odds" title="Chance por Ultra Ball, taxa de captura ${captureRate}">${cells}</div>`;
}

function legendCard(id: number): string {
  const version = store.get('version');
  const p = getPokemon(id);
  const status = legendStatus(id, version);
  const where = encountersInVersion(id, version)
    .map(
      (e) =>
        `<div class="loc"><b>${esc(areaName(e.area))}</b> · <span class="method">${methodLabel(e.method)}</span> · nível ${e.minLevel}</div>`,
    )
    .join('');
  const tip = legendTip(id) ?? fallbackTip(id, status);
  return `<div class="card lcard" style="${typeColorVars(p.types)}"><span class="art"><span class="no">#${pad3(id)}</span><span class="leg">Lendário</span>${habitatScene(p.habitat)}<span class="emb">${typeIcon(p.types[0] ?? 'normal')}</span></span><span class="body"><span class="nm"><button class="plink" data-p="${id}">${esc(p.name)}</button></span><span class="tys">${typeChips(p.types)} <span class="leg-st ${status}">${LEGEND_STATUS_LABEL[status]}</span></span>${where}<p>${esc(tip)}</p>${status === 'trade' ? '' : oddsBlock(p.captureRate)}</span></div>`;
}

function render(): void {
  byId('legrid').innerHTML = sortLegends(store.get('version')).map(legendCard).join('');
}

export function mountLegends(): void {
  delegate(byId('legrid'), 'click', '[data-p]', (b) => emit('pokemon:open', dataNum(b, 'p')));
  store.subscribe('version', render);
  render();
}
