import { emit } from '@/app/events';
import { load, save } from '@/app/storage';
import { store } from '@/app/store';
import { POKEMON_IDS, findPokemonByName } from '@/data';
import { availability } from '@/domain/availability';
import { MAX_TEAM_SIZE } from '@/domain/team';
import type { Version } from '@/types';
import { byId, dataNum, delegate, esc } from '@/ui/dom';
import { pokemonOptions } from '@/ui/pokemon-options';
import { TEAM_PRESETS, type TeamPreset } from './presets';
import { teamReport, teamSlot } from './team-view';

const parseTeam = (raw: string): number[] => {
  const ids = JSON.parse(raw) as unknown;
  return Array.isArray(ids)
    ? ids.filter((i): i is number => POKEMON_IDS.includes(i as number))
    : [];
};

let myTeam: number[] = load('team', [], parseTeam);

function persist(): void {
  save('team', JSON.stringify(myTeam));
}

function presetMembers(preset: TeamPreset, version: Version): number[] {
  const ids = preset.members
    .map((n) => findPokemonByName(n)?.id)
    .filter((id): id is number => id !== undefined);
  // Ex.: Arcanine só existe em FireRed e Ninetales só em LeafGreen.
  const usable = preset.postGame ? ids : ids.filter((id) => availability(id, version) !== 'none');
  return usable.slice(0, MAX_TEAM_SIZE);
}

function renderPresets(): void {
  const version = store.get('version');
  byId('presets').innerHTML = TEAM_PRESETS.map((preset) => {
    const team = presetMembers(preset, version);
    return `<div class="panel"><h2 class="h3" style="margin-top:0">${esc(preset.name)}</h2><p class="note" style="margin-top:-2px">${esc(preset.why)}</p><div class="team">${team.map((id) => teamSlot(id, version, false)).join('')}</div>${teamReport(team)}<button class="sel" data-use="${team.join(',')}" style="margin-top:12px">Usar como base no montador</button></div>`;
  }).join('');
}

function renderBuilder(): void {
  const el = byId('mybuild');
  if (!myTeam.length) {
    el.innerHTML =
      '<p class="empty" style="padding:24px">Escolha um Pokémon acima e toque em “Adicionar ao time”, ou use um dos times prontos como base.</p>';
    return;
  }
  const version = store.get('version');
  el.innerHTML = `<div class="team">${myTeam.map((id) => teamSlot(id, version, true)).join('')}</div>${teamReport(myTeam)}`;
}

export function mountTeams(): void {
  byId('tadd').innerHTML = pokemonOptions(6);
  byId('taddbtn').addEventListener('click', () => {
    const id = Number(byId<HTMLSelectElement>('tadd').value);
    if (myTeam.length < MAX_TEAM_SIZE && !myTeam.includes(id)) {
      myTeam.push(id);
      persist();
      renderBuilder();
    }
  });
  byId('tclear').addEventListener('click', () => {
    myTeam = [];
    persist();
    renderBuilder();
  });
  const section = byId('teams');
  delegate(section, 'click', '[data-rm]', (b) => {
    myTeam = myTeam.filter((x) => x !== dataNum(b, 'rm'));
    persist();
    renderBuilder();
  });
  delegate(section, 'click', '[data-use]', (b) => {
    myTeam = (b.dataset.use ?? '').split(',').map(Number).filter(Boolean);
    persist();
    renderBuilder();
    byId('mybuild').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  delegate(section, 'click', '.plink[data-p]', (b) => emit('pokemon:open', dataNum(b, 'p')));
  store.subscribe('version', () => {
    renderPresets();
    renderBuilder();
  });
  renderPresets();
  renderBuilder();
}
