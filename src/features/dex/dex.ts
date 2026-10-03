import { emit } from '@/app/events';
import { store } from '@/app/store';
import { POKEMON_IDS, TYPES, getPokemon } from '@/data';
import { availability } from '@/domain/availability';
import { STAT_LABEL, TYPE_COLOR, TYPE_LABEL } from '@/domain/constants';
import { baseStatTotal } from '@/domain/stats';
import type { StatKey, TypeName } from '@/types';
import { byId, dataNum, delegate, setPressed } from '@/ui/dom';
import { gridIcon, typeIcon } from '@/ui/icons';
import { pokemonCard } from './pokemon-card';

type Region = 'kanto' | 'johto' | 'hoenn' | 'all';
type Sort = 'no' | 'name' | 'bst' | Exclude<StatKey, 'hp'>;

const REGION_RANGE: Record<Region, [number, number]> = {
  kanto: [1, 151],
  johto: [152, 251],
  hoenn: [252, 386],
  all: [1, 386],
};

let typeFilter: TypeName | '' = '';

const el = {
  search: () => byId<HTMLInputElement>('q'),
  region: () => byId<HTMLSelectElement>('fgen'),
  habitat: () => byId<HTMLSelectElement>('fhab'),
  sort: () => byId<HTMLSelectElement>('fsort'),
  onlyAvailable: () => byId<HTMLInputElement>('favail'),
};

function filteredIds(): number[] {
  const q = el.search().value.trim().toLowerCase();
  const [from, to] = REGION_RANGE[el.region().value as Region] ?? REGION_RANGE.all;
  const habitat = Number(el.habitat().value);
  const onlyAvailable = el.onlyAvailable().checked;
  const version = store.get('version');
  const ids = POKEMON_IDS.filter((id) => {
    if (id < from || id > to) return false;
    const p = getPokemon(id);
    if (q && !(p.name.toLowerCase().includes(q) || String(id) === q.replace(/^#?0*/, '')))
      return false;
    if (typeFilter && !p.types.includes(typeFilter)) return false;
    if (habitat && p.habitat !== habitat) return false;
    if (onlyAvailable && availability(id, version) === 'none') return false;
    return true;
  });
  const sort = el.sort().value as Sort;
  if (sort === 'name') ids.sort((a, b) => getPokemon(a).name.localeCompare(getPokemon(b).name));
  else if (sort === 'bst')
    ids.sort((a, b) => baseStatTotal(getPokemon(b)) - baseStatTotal(getPokemon(a)));
  else if (sort !== 'no')
    ids.sort((a, b) => getPokemon(b).baseStats[sort] - getPokemon(a).baseStats[sort]);
  return ids;
}

function statLine(id: number, sort: Sort): string {
  const p = getPokemon(id);
  if (sort === 'no' || sort === 'name' || sort === 'bst') return `Total <b>${baseStatTotal(p)}</b>`;
  return `${STAT_LABEL[sort]} <b>${p.baseStats[sort]}</b>`;
}

export function renderDex(): void {
  const ids = filteredIds();
  const sort = el.sort().value as Sort;
  const version = store.get('version');
  byId('dexcount').textContent = `${ids.length} Pokémon`;
  byId('grid').innerHTML = ids.length
    ? ids.map((id, i) => pokemonCard(id, i, statLine(id, sort), availability(id, version))).join('')
    : '<div class="empty">Nenhum Pokémon com esses filtros. Limpe a busca ou troque o tipo.</div>';
}

function renderTypeFilter(): void {
  const chips = byId('tchips');
  chips.innerHTML =
    `<button class="all" data-t="" aria-pressed="true" style="--c:var(--ink)"><i>${gridIcon()}</i>Todos</button>` +
    TYPES.map(
      (t) =>
        `<button data-t="${t}" aria-pressed="false" style="--c:${TYPE_COLOR[t]}"><i>${typeIcon(t)}</i>${TYPE_LABEL[t]}</button>`,
    ).join('');
  delegate(chips, 'click', '[data-t]', (b) => {
    typeFilter = (b.dataset.t ?? '') as TypeName | '';
    setPressed(chips.querySelectorAll('button'), (x) => x === b);
    renderDex();
  });
}

export function mountDex(): void {
  renderTypeFilter();
  for (const input of [el.search(), el.region(), el.habitat(), el.sort(), el.onlyAvailable()]) {
    input.addEventListener('input', renderDex);
  }
  delegate(byId('grid'), 'click', '[data-p]', (card) => emit('pokemon:open', dataNum(card, 'p')));
  store.subscribe('version', renderDex);
  renderDex();
}
