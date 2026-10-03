import { emit } from '@/app/events';
import { store } from '@/app/store';
import { ANIME_TEAMS, TRAINER_GROUPS } from '@/data';
import type { Starter, Trainer, TrainerMon } from '@/types';
import { byId, dataNum, delegate, esc, setPressed } from '@/ui/dom';
import { animeCard, trainerCard } from './trainer-card';

type Source = 'game' | 'anime';
let source: Source = 'game';
let group = TRAINER_GROUPS[0]?.id ?? 'gyms';

const partyFor = (t: Trainer, starter: Starter): TrainerMon[] =>
  t.party ?? t.partiesByStarter?.[starter] ?? [];

function render(): void {
  const game = source === 'game';
  const starter = store.get('starter');
  setPressed(byId('trsrc').querySelectorAll('button'), (b) => b.dataset.s === source);
  setPressed(byId('trstarter').querySelectorAll('button'), (b) => b.dataset.st === starter);
  for (const id of ['trstarter', 'trstlabel', 'trnote', 'trgroups']) byId(id).hidden = !game;

  byId('trgroups').innerHTML = TRAINER_GROUPS.map(
    (g) => `<button data-g="${g.id}" aria-pressed="${g.id === group}">${esc(g.title)}</button>`,
  ).join('');

  const list = byId('trlist');
  if (!game) {
    list.innerHTML = `<p class="note" style="margin-top:0">Principais Pokémon de cada personagem na série animada, da temporada original até Hoenn. Lista resumida, sem os Pokémon que apareceram por poucos episódios.</p><div class="trgrid">${ANIME_TEAMS.map(animeCard).join('')}</div>`;
    return;
  }
  const current = TRAINER_GROUPS.find((g) => g.id === group) ?? TRAINER_GROUPS[0];
  if (!current) return;
  const version = store.get('version');
  list.innerHTML = `<p class="note" style="margin-top:0">${esc(current.description)}</p><div class="trgrid">${current.trainers
    .map((t) => trainerCard(t, partyFor(t, starter), version))
    .join('')}</div>`;
}

export function mountTrainers(): void {
  delegate(byId('trsrc'), 'click', '[data-s]', (b) => {
    source = b.dataset.s as Source;
    render();
  });
  delegate(byId('trstarter'), 'click', '[data-st]', (b) =>
    store.set('starter', b.dataset.st as Starter),
  );
  delegate(byId('trgroups'), 'click', '[data-g]', (b) => {
    group = b.dataset.g ?? group;
    render();
  });
  delegate(byId('trlist'), 'click', '[data-p]', (b) => emit('pokemon:open', dataNum(b, 'p')));
  store.subscribe('starter', render);
  store.subscribe('version', render);
  render();
}
