import { emit } from '@/app/events';
import { load, save } from '@/app/storage';
import { store } from '@/app/store';
import { areaName, getPokemon } from '@/data';
import { TYPE_COLOR } from '@/domain/constants';
import { CHAPTERS } from '@/domain/journey';
import { bestAttackingTypes, suggestCounters } from '@/domain/progression';
import {
  BATTLE_KIND_LABEL,
  aceLevel,
  battlesInChapter,
  type ScheduledBattle,
} from '@/domain/walkthrough';
import type { Starter } from '@/types';
import { byId, delegate, esc, prefersReducedMotion, setPressed } from '@/ui/dom';
import { personIcon, typeIcon } from '@/ui/icons';
import { typeChip } from '@/ui/type-chip';
import { ALL_STEP_IDS, GUIDE, type ChapterGuide, type GainKind } from './guide';
import { mountKantoMap } from './kanto-map';

const done = new Set<string>(
  load('walk', [] as string[], (raw) => {
    const ids = JSON.parse(raw) as unknown;
    return Array.isArray(ids) ? ids.filter((x): x is string => typeof x === 'string') : [];
  }),
);
const persist = () => save('walk', JSON.stringify([...done]));

const GAIN_LABEL: Record<GainKind, string> = {
  badge: 'Insígnia',
  hm: 'HM',
  item: 'Item',
  pokemon: 'Pokémon',
};

function battleCard(b: ScheduledBattle): string {
  const version = store.get('version');
  const type = b.trainer.type;
  const color = type ? TYPE_COLOR[type] : b.kind === 'rocket' ? '#3A2F45' : '#3B4A6B';
  const team = b.party
    .map((m) => {
      const p = getPokemon(m.pokemon);
      const t = p.types[0] ?? 'normal';
      return `<button class="dt-mon" data-p="${p.id}" style="--c:${TYPE_COLOR[t]}"><i>${typeIcon(t)}</i>${esc(p.name)} <small>Nv. ${m.level}</small></button>`;
    })
    .join('');
  const best = bestAttackingTypes(b.party);
  const counters =
    b.trainer.gymIndex !== null && b.kind === 'gym'
      ? suggestCounters(b.party, b.trainer.gymIndex, version)
      : [];
  return `<article class="dt-battle" style="--c:${color}">
    <header><span class="dt-ic">${type ? typeIcon(type) : personIcon()}</span>
      <div><small>${BATTLE_KIND_LABEL[b.kind]}</small><b>${esc(b.trainer.name)}</b><span class="note">${esc(b.trainer.subtitle)}</span></div>
      <span class="dt-ace">Nv. ${aceLevel(b.party)}</span></header>
    <div class="dt-team">${team}</div>
    ${best.length ? `<div class="dt-row"><span>Use</span>${best.map((x) => typeChip(x.type, true)).join('')}</div>` : ''}
    ${counters.length ? `<div class="dt-row"><span>Capture antes</span>${counters.map((c) => `<button class="sug" data-p="${c.pokemon}">${esc(getPokemon(c.pokemon).name)} <small>${esc(areaName(c.where.area))}</small></button>`).join('')}</div>` : ''}
  </article>`;
}

function chapterSection(g: ChapterGuide): string {
  const chapter = CHAPTERS.find((c) => c.id === g.chapter);
  if (!chapter) return '';
  const color = chapter.type ? TYPE_COLOR[chapter.type] : 'var(--ink-2)';
  const doneCount = g.steps.filter((s) => done.has(s.id)).length;
  const steps = g.steps
    .map(
      (s, i) => `<li class="${done.has(s.id) ? 'ok' : ''}">
        <label><input type="checkbox" data-step="${s.id}" ${done.has(s.id) ? 'checked' : ''}><span class="n">${i + 1}</span><span class="t">${esc(s.text)}${s.tip ? `<em>${esc(s.tip)}</em>` : ''}</span></label>
      </li>`,
    )
    .join('');
  const gains = g.gains
    .map(
      (x) => `<span class="dt-gain ${x.kind}" title="${GAIN_LABEL[x.kind]}">${esc(x.name)}</span>`,
    )
    .join('');
  const battles = battlesInChapter(g.chapter, store.get('starter')).map(battleCard).join('');
  return `<section class="dt-chapter" id="dt-${g.chapter}" data-chapter="${g.chapter}" style="--c:${color}">
    <header class="dt-head">
      <span class="dt-node">${chapter.type ? typeIcon(chapter.type) : '★'}</span>
      <div><small>${chapter.id <= 8 ? `Etapa ${chapter.id + 1} · ` : ''}${esc(chapter.subtitle)}</small><h2>${esc(chapter.title)}</h2><p>${esc(g.intro)}</p></div>
      <span class="dt-count" data-count="${g.chapter}">${doneCount}/${g.steps.length}</span>
    </header>
    <div class="dt-grid">
      <div class="panel dt-steps"><h3 class="h3">Passo a passo</h3><ol>${steps}</ol>${gains ? `<div class="dt-gains"><h4>Você ganha</h4>${gains}</div>` : ''}</div>
      ${battles ? `<div class="dt-battles"><h3 class="h3">Batalhas</h3>${battles}</div>` : ''}
    </div>
  </section>`;
}

function renderProgress(): void {
  const total = ALL_STEP_IDS.length;
  const n = ALL_STEP_IDS.filter((id) => done.has(id)).length;
  byId('dtprogress').innerHTML =
    `<div class="dt-bar"><span style="width:${(n / total) * 100}%"></span></div><span><b>${n}</b> de ${total} objetivos concluídos</span>${n ? '<button class="sel" data-reset>Recomeçar</button>' : ''}`;
  for (const g of GUIDE) {
    const el = document.querySelector(`[data-count="${g.chapter}"]`);
    if (el) el.textContent = `${g.steps.filter((s) => done.has(s.id)).length}/${g.steps.length}`;
  }
  byId('dtnav')
    .querySelectorAll<HTMLElement>('[data-goto]')
    .forEach((b) => {
      const g = GUIDE.find((x) => x.chapter === Number(b.dataset.goto));
      b.classList.toggle('complete', !!g && g.steps.every((s) => done.has(s.id)));
    });
}

function render(): void {
  byId('dtnav').innerHTML = GUIDE.map((g) => {
    const c = CHAPTERS.find((x) => x.id === g.chapter);
    return `<button data-goto="${g.chapter}" style="--c:${c?.type ? TYPE_COLOR[c.type] : 'var(--ink-2)'}"><i>${c?.type ? typeIcon(c.type) : '★'}</i>${esc(c?.subtitle ?? '')}</button>`;
  }).join('');
  byId('dtlist').innerHTML = GUIDE.map(chapterSection).join('');
  setPressed(
    byId('dtstarter').querySelectorAll('button'),
    (b) => b.dataset.st === store.get('starter'),
  );
  renderProgress();
}

function goToChapter(id: number): void {
  document
    .getElementById(`dt-${id}`)
    ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

export function mountDetonado(): void {
  mountKantoMap(goToChapter);
  render();
  delegate(byId('dtnav'), 'click', '[data-goto]', (b) => goToChapter(Number(b.dataset.goto)));
  delegate(byId('dtstarter'), 'click', '[data-st]', (b) =>
    store.set('starter', b.dataset.st as Starter),
  );
  const list = byId('dtlist');
  list.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const id = input.dataset.step;
    if (!id) return;
    if (input.checked) done.add(id);
    else done.delete(id);
    input.closest('li')?.classList.toggle('ok', input.checked);
    persist();
    renderProgress();
  });
  delegate(list, 'click', '[data-p]', (b) => emit('pokemon:open', Number(b.dataset.p)));
  delegate(byId('dtprogress'), 'click', '[data-reset]', () => {
    done.clear();
    persist();
    render();
  });
  store.subscribe('starter', render);
  store.subscribe('version', render);
}
