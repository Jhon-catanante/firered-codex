import { areaName, getMove, getPokemon } from '@/data';
import { availability } from '@/domain/availability';
import { TYPE_LABEL } from '@/domain/constants';
import { bestEncounter } from '@/domain/encounters';
import { ancestors } from '@/domain/evolution';
import { recommend } from '@/domain/moveset';
import { analyzeTeam } from '@/domain/team';
import type { Version } from '@/types';
import { esc } from '@/ui/dom';
import { typeChip, typeChips } from '@/ui/type-chip';

function whereToGet(id: number, version: Version): string {
  const direct = bestEncounter(id, version);
  if (direct) return `${esc(areaName(direct.area))} (${direct.rate[version]}%)`;
  for (const pre of ancestors(id)) {
    const e = bestEncounter(pre, version);
    if (e) return esc(`Evolua ${getPokemon(pre).name} (${areaName(e.area)})`);
  }
  return availability(id, version) === 'none' ? 'Só por troca' : '';
}

export function teamSlot(id: number, version: Version, removable: boolean): string {
  const p = getPokemon(id);
  const r = recommend(id);
  return `<div class="slot">${removable ? `<button class="rm" data-rm="${id}" aria-label="Remover ${esc(p.name)}">×</button>` : ''}<b><button class="plink" data-p="${id}">${esc(p.name)}</button></b>${typeChips(p.types)}<small>${r.moves.map((m) => getMove(m).name).join(' · ')}</small><small>${r.nature} · ${whereToGet(id, version)}</small></div>`;
}

export function teamReport(team: readonly number[]): string {
  const report = analyzeTeam(team);
  const cells = report.exposure
    .map(
      (x) =>
        `<div class="${x.danger ? 'alert' : x.safe ? 'ok' : ''}">${typeChip(x.type, true)}<span class="num"><b>${x.weak}</b> fr · ${x.resist} res</span></div>`,
    )
    .join('');
  const dangers = report.dangers.length
    ? `Atenção a ${report.dangers.map((t) => TYPE_LABEL[t]).join(', ')}: ${report.dangers.length > 1 ? 'esses tipos acertam' : 'esse tipo acerta'} vários membros e quase ninguém resiste.`
    : 'Nenhum tipo pega o time desprevenido.';
  const coverage = report.uncovered.length
    ? `Os golpes recomendados não acertam super efetivo: ${report.uncovered.map((t) => TYPE_LABEL[t]).join(', ')}.`
    : 'Os golpes recomendados cobrem todos os 17 tipos.';
  return `<h3 class="h3">Fraquezas do time</h3><div class="wk">${cells}</div><p class="why">${dangers} ${coverage}</p>`;
}
