import { areaName, encountersIn, getPokemon, methodLabel } from '@/data';
import { STAT_LABEL, TYPE_COLOR, VERSION_LABEL, otherVersion } from '@/domain/constants';
import { formatLevels } from '@/domain/encounters';
import {
  PLACE_SCENE,
  floorLabel,
  methodFamily,
  type MethodFamily,
  type Place,
  type PlaceKind,
} from '@/domain/journey';
import type { Encounter, Version } from '@/types';
import { esc } from '@/ui/dom';
import { habitatScene } from '@/ui/habitat-scene';
import { typeIcon } from '@/ui/icons';

/** Cores do cabeçalho do card por tipo de lugar. */
const KIND_STYLE: Record<PlaceKind, { label: string; from: string; to: string }> = {
  route: { label: 'Rota', from: '#5DB43A', to: '#2F7A3D' },
  sea: { label: 'Mar', from: '#4C8DF0', to: '#2348A8' },
  coast: { label: 'Litoral', from: '#3FB6B0', to: '#1F6F8B' },
  cave: { label: 'Caverna', from: '#8A7766', to: '#3E3530' },
  forest: { label: 'Floresta', from: '#3E9B4F', to: '#1C4F2A' },
  mountain: { label: 'Montanha', from: '#E0803A', to: '#8A3B1E' },
  city: { label: 'Cidade', from: '#7C6CE0', to: '#3F3591' },
  building: { label: 'Construção', from: '#7B8AA6', to: '#3A4560' },
  roaming: { label: 'Errante', from: '#E3B91A', to: '#B4561B' },
};

export const placeDomId = (key: string): string =>
  `place-${key
    .normalize('NFD')
    .replace(/[^\w]+/g, '-')
    .toLowerCase()}`;

export interface CardOptions {
  version: Version;
  floor: number;
  families: ReadonlySet<MethodFamily>;
  query: string;
}

function encounterPill(e: Encounter, version: Version, query: string): string {
  const p = getPokemon(e.pokemon);
  const other = otherVersion(version);
  const rate = e.rate[version];
  const only = rate === 0 ? `<span class="enc-tag">só ${VERSION_LABEL[other]}</span>` : '';
  const excl = rate > 0 && e.rate[other] === 0 ? `<span class="enc-tag ex">exclusivo</span>` : '';
  const evs = Object.entries(p.evYield)
    .map(([k, v]) => `+${v} ${STAT_LABEL[k as keyof typeof STAT_LABEL]}`)
    .join(', ');
  const hit = query && p.name.toLowerCase().includes(query) ? ' hit' : '';
  const first = p.types[0] ?? 'normal';
  return `<button class="enc${rate === 0 ? ' off' : ''}${hit}" data-p="${p.id}" style="--c:${TYPE_COLOR[first]}" aria-label="${esc(p.name)}, ${rate}% de chance">
    <span class="enc-ic">${typeIcon(first)}</span>
    <span class="enc-main"><b>${esc(p.name)}</b><small>Nv. ${formatLevels(e)}${evs ? ` · ${evs}` : ''}</small>${only}${excl}</span>
    <span class="enc-rate"><b class="num">${rate}%</b><i><s style="width:${rate}%"></s></i></span>
  </button>`;
}

/** Encontros visíveis da área, agrupados por método e filtrados pelas famílias ativas. */
export function visibleGroups(area: number, version: Version, families: ReadonlySet<MethodFamily>) {
  const other = otherVersion(version);
  const rows = encountersIn(area).filter((e) => families.has(methodFamily(e.method)));
  const methods = [...new Set(rows.map((e) => e.method))].sort((a, b) => a - b);
  return methods.map((m) => ({
    method: m,
    rows: rows
      .filter((e) => e.method === m)
      .sort((a, b) => b.rate[version] - a.rate[version] || b.rate[other] - a.rate[other]),
  }));
}

export function placeCard(place: Place, { version, floor, families, query }: CardOptions): string {
  const style = KIND_STYLE[place.kind];
  const area = place.areas[floor] ?? place.areas[0] ?? 0;
  const groups = visibleGroups(area, version, families);
  const species = new Set(place.areas.flatMap((a) => encountersIn(a).map((e) => e.pokemon))).size;
  const floors =
    place.areas.length > 1
      ? `<div class="floors" role="group" aria-label="Andar ou setor">${place.areas
          .map(
            (a, i) =>
              `<button data-floor="${i}" aria-pressed="${i === floor}">${esc(floorLabel(areaName(a), place.name))}</button>`,
          )
          .join('')}</div>`
      : '';
  const body = groups.length
    ? groups
        .map(
          (g) =>
            `<div class="mg"><h4>${methodLabel(g.method)}</h4><div class="encs">${g.rows.map((e) => encounterPill(e, version, query)).join('')}</div></div>`,
        )
        .join('')
    : '<p class="note">Nenhum encontro com os filtros escolhidos neste setor.</p>';
  return `<article class="place" id="${placeDomId(place.key)}" data-place="${esc(place.key)}" style="--k1:${style.from};--k2:${style.to}">
    <header class="place-h">${habitatScene(PLACE_SCENE[place.kind], 'place-scene')}
      <div class="place-t"><span class="kind">${style.label}</span><h3>${esc(place.name)}</h3><small>${species} ${species === 1 ? 'espécie' : 'espécies'}</small></div>
    </header>
    ${floors}
    <div class="place-b">${body}</div>
  </article>`;
}
