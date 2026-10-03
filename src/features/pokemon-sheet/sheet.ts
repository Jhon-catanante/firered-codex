import { emit, on } from '@/app/events';
import { store } from '@/app/store';
import { MAX_DEX, getPokemon } from '@/data';
import type { LearnMethod } from '@/domain/learnsets';
import { recommend } from '@/domain/moveset';
import { byId, dataNum, delegate, esc, pad3 } from '@/ui/dom';
import { habitatScene } from '@/ui/habitat-scene';
import { typeIcon } from '@/ui/icons';
import { typeColorVars } from '@/ui/type-chip';
import { LEARN_TABS, learnCount, learnTable } from './learn-table';
import {
  buildPanel,
  heroChips,
  matchupsPanel,
  profilePanel,
  statsPanel,
  wherePanel,
} from './sections';

let openId: number | null = null;
let learnTab: LearnMethod = 'levelUp';
let returnFocus: HTMLElement | null = null;

const scrim = () => byId('scrim');
const sheet = () => byId('sheet');

/** Link externo para quem quiser ver o sprite e ouvir o grito (o site não hospeda arte oficial). */
const externalSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace('♀', '-f')
    .replace('♂', '-m')
    .replace(/[.']/g, '')
    .replace(/\s+/g, '-');

function render(id: number): void {
  const p = getPokemon(id);
  const version = store.get('version');
  const learnTabs = LEARN_TABS.map(
    ({ key, label }) =>
      `<button data-lt="${key}" aria-pressed="${learnTab === key}">${label} <span class="note">${learnCount(id, key)}</span></button>`,
  ).join('');
  sheet().innerHTML = `
  <div class="hero" style="${typeColorVars(p.types)}">
    <button class="x" data-close aria-label="Fechar">×</button>
    ${habitatScene(p.habitat, 'hero-scene')}<span class="hero-emb" aria-hidden="true">${typeIcon(p.types[0] ?? 'normal')}</span>
    <span class="ghost" aria-hidden="true">${pad3(id)}</span>
    <div style="position:relative">
      <div style="font-weight:700;opacity:.9">#${pad3(id)}${p.legendary ? ' · Lendário' : ''}</div>
      <h2 id="sheet-title">${esc(p.name)}</h2>
      <div style="display:flex;gap:6px">${heroChips(p)}</div>
      <div class="hero-nav">
        ${id > 1 ? `<button data-goto="${id - 1}">← #${pad3(id - 1)}</button>` : ''}
        ${id < MAX_DEX ? `<button data-goto="${id + 1}">#${pad3(id + 1)} →</button>` : ''}
        <a href="https://pokemondb.net/pokedex/${externalSlug(p.name)}" target="_blank" rel="noopener">Ver sprite e ouvir o grito ↗</a>
      </div>
    </div>
  </div>
  <div class="sheet-body">
    <div class="cols">${statsPanel(p)}${matchupsPanel(p)}</div>
    ${buildPanel(p, recommend(id))}
    <div class="cols">${wherePanel(p, version)}${profilePanel(p)}</div>
    <div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 class="h3" style="margin:0">Golpes que aprende</h3>
      <div class="seg" role="group" aria-label="Forma de aprender">${learnTabs}</div></div>
      <div class="tbl-wrap" style="margin-top:10px">${learnTable(id, learnTab)}</div>
    </div>
  </div>`;
}

export function openSheet(id: number, { keepContext = false } = {}): void {
  if (!keepContext) {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    learnTab = 'levelUp';
  }
  openId = id;
  render(id);
  scrim().classList.add('open');
  scrim().setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (!keepContext) {
    sheet().scrollTop = 0;
    sheet().querySelector<HTMLElement>('[data-close]')?.focus();
  }
}

export function closeSheet(): void {
  scrim().classList.remove('open');
  scrim().setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  openId = null;
  returnFocus?.focus();
}

export function mountSheet(): void {
  const root = scrim();
  root.addEventListener('click', (e) => {
    if (e.target === root) closeSheet();
  });
  delegate(root, 'click', '[data-close]', () => closeSheet());
  delegate(root, 'click', '[data-goto]', (b) => {
    learnTab = 'levelUp';
    openSheet(dataNum(b, 'goto'), { keepContext: true });
    sheet().scrollTop = 0;
  });
  delegate(root, 'click', '[data-lt]', (b) => {
    learnTab = b.dataset.lt as LearnMethod;
    if (openId !== null) openSheet(openId, { keepContext: true });
  });
  delegate(root, 'click', '[data-area]', (row) => {
    closeSheet();
    emit('area:open', dataNum(row, 'area'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId !== null) closeSheet();
  });
  on('pokemon:open', (id) => openSheet(id));
  store.subscribe('version', () => {
    if (openId !== null) openSheet(openId, { keepContext: true });
  });
}
