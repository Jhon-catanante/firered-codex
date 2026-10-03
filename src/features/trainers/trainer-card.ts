import { areaName, getMove, getPokemon, hasMove } from '@/data';
import { TYPE_COLOR } from '@/domain/constants';
import { bestAttackingTypes, suggestCounters } from '@/domain/progression';
import type { AnimeTeam, Trainer, TrainerMon, TrainerMove, Version } from '@/types';
import { esc } from '@/ui/dom';
import { personIcon, typeIcon } from '@/ui/icons';
import { typeChip, typeChips } from '@/ui/type-chip';

const moveName = (m: TrainerMove): string =>
  typeof m === 'number' ? (hasMove(m) ? getMove(m).name : '?') : m;

/** Golpe com STAB (tipo igual ao do Pokémon e que causa dano) aparece em destaque. */
function isStab(mon: TrainerMon, m: TrainerMove): boolean {
  if (typeof m !== 'number' || !hasMove(m)) return false;
  const move = getMove(m);
  return move.category !== 'status' && getPokemon(mon.pokemon).types.includes(move.type);
}

function monRow(mon: TrainerMon): string {
  const p = getPokemon(mon.pokemon);
  const moves = mon.moves
    .map((m) =>
      isStab(mon, m) ? `<span class="stab">${esc(moveName(m))}</span>` : esc(moveName(m)),
    )
    .join(' · ');
  const details =
    mon.moves.length || mon.item
      ? `<span class="mvs">${moves}${mon.item ? ` · <b>segura ${esc(mon.item)}</b>` : ''}</span>`
      : '';
  return `<div class="mon"><span><button class="plink" data-p="${mon.pokemon}">${esc(p.name)}</button> ${typeChips(p.types)}</span><span class="lv">Nv. ${mon.level}</span>${details}</div>`;
}

function howToBeat(team: TrainerMon[], gymIndex: number | null, version: Version): string {
  const best = bestAttackingTypes(team);
  if (!best.length) return '';
  const counters = gymIndex === null ? [] : suggestCounters(team, gymIndex, version);
  const suggestions = counters.length
    ? `<b>Já dá para capturar antes</b><div class="row">${counters
        .map(
          (c) =>
            `<button class="sug" data-p="${c.pokemon}">${esc(getPokemon(c.pokemon).name)} <small>${esc(areaName(c.where.area))} · ${c.where.rate[version]}%</small></button>`,
        )
        .join('')}</div>`
    : '';
  return `<div class="beat"><b>Tipos que funcionam</b><div class="row">${best.map((x) => typeChip(x.type, true)).join('')}</div>${suggestions}</div>`;
}

export function trainerCard(trainer: Trainer, team: TrainerMon[], version: Version): string {
  const c1 = trainer.type ? TYPE_COLOR[trainer.type] : '#3B4A6B';
  const c2 = trainer.type
    ? `color-mix(in srgb, ${TYPE_COLOR[trainer.type]} 55%, #1C2333)`
    : '#E3350D';
  return `<article class="trc" style="--c:${c1};--c2:${c2}"><div class="trc-h"><span class="emb">${trainer.type ? typeIcon(trainer.type) : personIcon()}</span><span><b>${esc(trainer.name)}</b><small>${esc(trainer.subtitle)}</small></span>${trainer.tag ? `<span class="tag">${esc(trainer.tag)}</span>` : ''}</div><div>${team.map(monRow).join('')}</div>${howToBeat(team, trainer.gymIndex, version)}</article>`;
}

export function animeCard(team: AnimeTeam): string {
  const rows = team.pokemon
    .map((x) => {
      const p = getPokemon(x.pokemon);
      return `<div class="an-p"><span><button class="plink" data-p="${x.pokemon}">${esc(p.name)}</button> ${typeChips(p.types)}</span>${x.note ? `<span class="note">${esc(x.note)}</span>` : ''}</div>`;
    })
    .join('');
  return `<article class="trc" style="--c:#3B4A6B;--c2:#E3350D"><div class="trc-h"><span class="emb">${personIcon()}</span><span><b>${esc(team.name)}</b><small>${esc(team.era)}</small></span></div><div>${rows}</div></article>`;
}
