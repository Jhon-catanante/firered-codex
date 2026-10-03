import { emit, on } from '@/app/events';
import { showTab } from '@/app/router';
import { store } from '@/app/store';
import { areaName, encountersIn, getPokemon, methodLabel } from '@/data';
import { AREA_GROUPS, SORTED_AREAS, areaGroup } from '@/domain/areas';
import { STAT_LABEL, VERSION_LABEL, otherVersion } from '@/domain/constants';
import { formatLevels, isEventArea } from '@/domain/encounters';
import type { Encounter } from '@/types';
import { byId, dataNum, delegate, esc } from '@/ui/dom';
import { typeChips } from '@/ui/type-chip';

let current = SORTED_AREAS.find((a) => areaName(a) === 'Rota 1') ?? SORTED_AREAS[0] ?? 0;

const areasIn = (group: string) => SORTED_AREAS.filter((a) => areaGroup(areaName(a)) === group);

function renderList(): void {
  byId('arealist').innerHTML = AREA_GROUPS.map(
    (g) =>
      `<div class="grp">${g}</div>` +
      areasIn(g)
        .map((a) => {
          const species = new Set(encountersIn(a).map((e) => e.pokemon)).size;
          return `<button data-a="${a}" ${a === current ? 'aria-current="true"' : ''}><span>${esc(areaName(a))}</span><span class="note num" style="color:inherit;opacity:.75">${species}</span></button>`;
        })
        .join(''),
  ).join('');
  byId('areapick').innerHTML = AREA_GROUPS.map(
    (g) =>
      `<optgroup label="${g}">${areasIn(g)
        .map(
          (a) =>
            `<option value="${a}" ${a === current ? 'selected' : ''}>${esc(areaName(a))}</option>`,
        )
        .join('')}</optgroup>`,
  ).join('');
}

function encounterRow(e: Encounter): string {
  const version = store.get('version');
  const other = otherVersion(version);
  const p = getPokemon(e.pokemon);
  const exclusive =
    e.rate[version] > 0 && e.rate[other] === 0
      ? ' <span class="badge wild">exclusivo</span>'
      : e.rate[version] === 0
        ? ` <span class="badge no">só ${VERSION_LABEL[other]}</span>`
        : '';
  const evs = Object.entries(p.evYield)
    .map(([k, v]) => `+${v} ${STAT_LABEL[k as keyof typeof STAT_LABEL]}`)
    .join(', ');
  return `<tr class="click" data-p="${e.pokemon}"><td><button class="plink" data-p="${e.pokemon}">${esc(p.name)}</button>${exclusive}</td><td>${typeChips(p.types)}</td><td><div class="rate"><span class="bar"><span style="width:${e.rate[version]}%"></span></span><b class="num">${e.rate[version]}%</b></div></td><td class="r num note">${e.rate[other]}%</td><td class="r num">${formatLevels(e)}</td><td class="note">${evs}</td></tr>`;
}

export function renderArea(area: number): void {
  current = area;
  renderList();
  const version = store.get('version');
  const other = otherVersion(version);
  const rows = encountersIn(area);
  const methods = [...new Set(rows.map((e) => e.method))].sort((a, b) => a - b);
  const tables = methods
    .map((m) => {
      const list = rows
        .filter((e) => e.method === m)
        .sort((a, b) => b.rate[version] - a.rate[version] || b.rate[other] - a.rate[other]);
      return `<h3 class="h3"><span class="method">${methodLabel(m)}</span></h3><div class="tbl-wrap"><table><thead><tr><th>Pokémon</th><th>Tipo</th><th>${VERSION_LABEL[version]}</th><th class="r">${VERSION_LABEL[other]}</th><th class="r">Nível</th><th>EVs</th></tr></thead><tbody>${list.map(encounterRow).join('')}</tbody></table></div>`;
    })
    .join('');
  byId('areaview').innerHTML =
    `<h2 class="h2" style="margin-top:0">${esc(areaName(area))}</h2>` +
    (isEventArea(area)
      ? '<p class="note">Área liberada apenas por evento oficial de distribuição.</p>'
      : '') +
    tables;
}

export function mountRoutes(): void {
  delegate(byId('arealist'), 'click', '[data-a]', (b) => renderArea(dataNum(b, 'a')));
  byId<HTMLSelectElement>('areapick').addEventListener('change', (e) =>
    renderArea(Number((e.target as HTMLSelectElement).value)),
  );
  delegate(byId('areaview'), 'click', '[data-p]', (r) => emit('pokemon:open', dataNum(r, 'p')));
  on('area:open', (area) => {
    showTab('routes');
    renderArea(area);
  });
  store.subscribe('version', () => renderArea(current));
  renderArea(current);
}
