import { emit, on } from '@/app/events';
import { showTab } from '@/app/router';
import { store } from '@/app/store';
import { encountersIn, getPokemon } from '@/data';
import { TYPE_COLOR } from '@/domain/constants';
import {
  METHOD_FAMILY_LABEL,
  buildJourney,
  methodFamily,
  type MethodFamily,
  type Place,
} from '@/domain/journey';
import { byId, dataNum, delegate, esc, prefersReducedMotion, setPressed } from '@/ui/dom';
import { typeIcon } from '@/ui/icons';
import { placeCard, placeDomId, visibleGroups } from './place-card';

const JOURNEY = buildJourney();
const PLACES = new Map(JOURNEY.flatMap((c) => c.places).map((p) => [p.key, p]));
const FAMILIES: readonly MethodFamily[] = ['grass', 'water', 'rocks', 'special'];
const FAMILY_COLOR: Record<MethodFamily, string> = {
  grass: TYPE_COLOR.grass,
  water: TYPE_COLOR.water,
  rocks: TYPE_COLOR.rock,
  special: TYPE_COLOR.psychic,
};
const FAMILY_ICON: Record<MethodFamily, string> = {
  grass: typeIcon('grass'),
  water: typeIcon('water'),
  rocks: typeIcon('rock'),
  special: typeIcon('normal'),
};

const state = {
  query: '',
  families: new Set<MethodFamily>(FAMILIES),
  floors: new Map<string, number>(),
};

/** O lugar aparece se o nome ou algum Pokémon dele bate com a busca e há encontros nos métodos ativos. */
function placeVisible(place: Place): boolean {
  const version = store.get('version');
  const hasRows = place.areas.some((a) => visibleGroups(a, version, state.families).length);
  if (!hasRows) return false;
  if (!state.query) return true;
  if (place.name.toLowerCase().includes(state.query)) return true;
  return place.areas.some((a) =>
    encountersIn(a).some(
      (e) =>
        state.families.has(methodFamily(e.method)) &&
        getPokemon(e.pokemon).name.toLowerCase().includes(state.query),
    ),
  );
}

/** Ao buscar por Pokémon, abre direto o andar onde ele aparece. */
function floorFor(place: Place): number {
  const saved = state.floors.get(place.key);
  if (saved !== undefined || !state.query || place.name.toLowerCase().includes(state.query))
    return saved ?? 0;
  const i = place.areas.findIndex((a) =>
    encountersIn(a).some((e) => getPokemon(e.pokemon).name.toLowerCase().includes(state.query)),
  );
  return Math.max(0, i);
}

function cardFor(place: Place): string {
  return placeCard(place, {
    version: store.get('version'),
    floor: floorFor(place),
    families: state.families,
    query: state.query,
  });
}

function renderJourney(): void {
  let placesShown = 0;
  const html = JOURNEY.map(({ chapter, places }) => {
    const visible = places.filter(placeVisible);
    placesShown += visible.length;
    if (!visible.length) return '';
    const color = chapter.type ? TYPE_COLOR[chapter.type] : 'var(--ink-2)';
    const node = chapter.type ? typeIcon(chapter.type) : '★';
    return `<section class="chapter" id="chapter-${chapter.id}" data-chapter="${chapter.id}" style="--c:${color}">
      <div class="chapter-h"><span class="node" aria-hidden="true">${node}</span>
        <div><small>${chapter.id <= 8 ? `Etapa ${chapter.id + 1} · ` : ''}${esc(chapter.subtitle)}</small><h2>${esc(chapter.title)}</h2></div>
        <span class="chapter-n">${visible.length} ${visible.length === 1 ? 'lugar' : 'lugares'}</span></div>
      <div class="chapter-places">${visible.map(cardFor).join('')}</div>
    </section>`;
  }).join('');
  byId('journey').innerHTML =
    html || '<div class="empty">Nada encontrado. Tente outro nome ou ative mais métodos.</div>';
  byId('jcount').textContent = `${placesShown} ${placesShown === 1 ? 'lugar' : 'lugares'}`;
  observeChapters();
}

function renderToolbar(): void {
  const methods = byId('jmethods');
  methods.innerHTML = FAMILIES.map(
    (f) =>
      `<button data-fam="${f}" aria-pressed="${state.families.has(f)}" style="--c:${FAMILY_COLOR[f]}"><i>${FAMILY_ICON[f]}</i>${METHOD_FAMILY_LABEL[f]}</button>`,
  ).join('');
  byId('jchapters').innerHTML = JOURNEY.map(
    ({ chapter }) =>
      `<button data-goto-chapter="${chapter.id}" style="--c:${chapter.type ? TYPE_COLOR[chapter.type] : 'var(--ink-2)'}"><i>${chapter.type ? typeIcon(chapter.type) : '★'}</i>${esc(chapter.subtitle)}</button>`,
  ).join('');
}

let observer: IntersectionObserver | null = null;

/** Destaca no menu de etapas a etapa que está na tela. */
function observeChapters(): void {
  observer?.disconnect();
  if (!('IntersectionObserver' in window)) return;
  const nav = byId('jchapters');
  observer = new IntersectionObserver(
    (entries) => {
      const top = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!top) return;
      const id = (top.target as HTMLElement).dataset.chapter;
      nav.querySelectorAll<HTMLElement>('button').forEach((b) => {
        const on = b.dataset.gotoChapter === id;
        b.setAttribute('aria-current', String(on));
        if (on) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      });
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  document.querySelectorAll('#journey .chapter').forEach((s) => observer?.observe(s));
}

function scrollToEl(el: Element | null): void {
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

/** Abre a aba, mostra o lugar da área pedida no andar certo e destaca o card. */
function openArea(area: number): void {
  const place = [...PLACES.values()].find((p) => p.areas.includes(area));
  if (!place) return;
  state.query = '';
  state.families = new Set(FAMILIES);
  byId<HTMLInputElement>('jq').value = '';
  state.floors.set(place.key, place.areas.indexOf(area));
  showTab('routes');
  renderToolbar();
  renderJourney();
  const card = document.getElementById(placeDomId(place.key));
  requestAnimationFrame(() => {
    scrollToEl(card);
    card?.classList.add('flash');
    window.setTimeout(() => card?.classList.remove('flash'), 1600);
  });
}

export function mountRoutes(): void {
  renderToolbar();
  renderJourney();

  byId<HTMLInputElement>('jq').addEventListener('input', (e) => {
    state.query = (e.target as HTMLInputElement).value.trim().toLowerCase();
    renderJourney();
  });
  delegate(byId('jmethods'), 'click', '[data-fam]', (b) => {
    const f = b.dataset.fam as MethodFamily;
    if (state.families.has(f) && state.families.size > 1) state.families.delete(f);
    else state.families.add(f);
    setPressed(byId('jmethods').querySelectorAll('button'), (x) =>
      state.families.has(x.dataset.fam as MethodFamily),
    );
    renderJourney();
  });
  delegate(byId('jchapters'), 'click', '[data-goto-chapter]', (b) =>
    scrollToEl(document.getElementById(`chapter-${b.dataset.gotoChapter}`)),
  );

  const journey = byId('journey');
  delegate(journey, 'click', '[data-floor]', (b) => {
    const card = b.closest<HTMLElement>('[data-place]');
    const place = card ? PLACES.get(card.dataset.place ?? '') : undefined;
    if (!card || !place) return;
    state.floors.set(place.key, dataNum(b, 'floor'));
    card.outerHTML = cardFor(place);
  });
  delegate(journey, 'click', '[data-p]', (b) => emit('pokemon:open', dataNum(b, 'p')));

  on('area:open', openArea);
  store.subscribe('version', renderJourney);
}
