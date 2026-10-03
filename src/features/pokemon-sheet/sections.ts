import { areaName, encountersOf, getAbility, getMove, getPokemon, methodLabel } from '@/data';
import { availability, obtainableAncestor } from '@/domain/availability';
import {
  CATEGORY_LABEL,
  HABITAT_LABEL,
  STAT_KEYS,
  STAT_LABEL,
  TYPE_COLOR,
  TYPE_LABEL,
  VERSION_LABEL,
  otherVersion,
} from '@/domain/constants';
import { formatLevels } from '@/domain/encounters';
import { evolutionPath, evolutionStages } from '@/domain/evolution';
import { howLearned } from '@/domain/learnsets';
import { effectivePower, type Recommendation } from '@/domain/moveset';
import { baseStatTotal, statRangeAt100 } from '@/domain/stats';
import { defensiveMatchups } from '@/domain/type-chart';
import type { Pokemon, Version } from '@/types';
import { esc } from '@/ui/dom';
import { genderText } from '@/ui/format';
import { statRadar } from '@/ui/radar';
import { typeChip, typeChips } from '@/ui/type-chip';

const statColor = (v: number): string =>
  v >= 110 ? '#22A37A' : v >= 80 ? '#7CC24A' : v >= 55 ? '#F2B33D' : '#E5674B';

export function statsPanel(p: Pokemon): string {
  const color = TYPE_COLOR[p.types[0] ?? 'normal'];
  const bars = STAT_KEYS.map((k) => {
    const v = p.baseStats[k];
    const [min, max] = statRangeAt100(k, v);
    return `<div class="stat"><span class="k">${STAT_LABEL[k]}</span><span class="v num">${v}</span><span class="bar"><span style="width:${Math.min(100, (v / 255) * 160)}%;background:${statColor(v)}"></span></span><span class="mm num">${min}–${max}</span></div>`;
  }).join('');
  return `<div class="panel statpanel"><h3 class="h3" style="margin-top:0">Status base <span class="note" style="font-weight:500">· total ${baseStatTotal(p)}</span></h3><div class="statwrap">${statRadar(p, color)}<div>${bars}</div></div><p class="note" style="margin:8px 0 0">Faixa à direita: mínimo e máximo possível no nível 100.</p></div>`;
}

export function matchupsPanel(p: Pokemon): string {
  const groups = defensiveMatchups(p.types);
  const rows = (
    [
      [4, '4×'],
      [2, '2×'],
      [0.5, '½'],
      [0.25, '¼'],
      [0, '0×'],
    ] as const
  )
    .filter(([k]) => groups[k].length)
    .map(([k, label]) => {
      const color = k >= 2 ? 'var(--bad)' : k === 0 ? 'var(--ink-2)' : 'var(--good)';
      return `<div class="mu-row"><span class="m" style="color:${color}">${label}</span>${typeChips(groups[k])}</div>`;
    })
    .join('');
  return `<div class="panel"><h3 class="h3" style="margin-top:0">Fraquezas e resistências</h3><div class="mu">${rows}</div></div>`;
}

export function buildPanel(p: Pokemon, r: Recommendation): string {
  const moves = r.moves.length
    ? r.moves
        .map((id) => {
          const m = getMove(id);
          const power = effectivePower(id);
          return `<div class="mv" style="--c:${TYPE_COLOR[m.type]}"><b>${esc(m.name)}</b><small>${TYPE_LABEL[m.type]} · ${CATEGORY_LABEL[m.category]}${power ? ` · ${power} de poder` : ''}${m.accuracy ? ` · ${m.accuracy}%` : ''}</small><div style="margin-top:4px;font-size:11.5px;color:var(--ink-2)">${howLearned(p.id, id)}</div></div>`;
        })
        .join('')
    : '<p class="note">Sem golpes ofensivos úteis.</p>';
  const natures = r.natures
    .map(
      (n, i) =>
        `<div class="natrow"><span class="rk">${i + 1}º</span><b>${n.name}</b><span class="note"><span class="up">+${STAT_LABEL[n.up]}</span> <span class="down">−${STAT_LABEL[n.down]}</span></span><span class="note natwhy">${n.reason}</span></div>`,
    )
    .join('');
  const evs = Object.entries(r.evs)
    .map(([k, v]) => `${v} ${STAT_LABEL[k as keyof typeof STAT_LABEL]}`)
    .join(' / ');
  const style = `${r.mixed ? 'Misto (físico + especial)' : r.physical ? 'Atacante físico' : 'Atacante especial'}${r.fast ? ', rápido' : ''}`;
  const coverage = r.coverage.length
    ? `Esse conjunto acerta super efetivo ${r.coverage.length} de 17 tipos: ${r.coverage.map((t) => TYPE_LABEL[t]).join(', ')}.`
    : '';
  return `<div class="panel" style="--c:${TYPE_COLOR[p.types[0] ?? 'normal']}">
    <h3 class="h3" style="margin-top:0">Build recomendada para FireRed</h3>
    <div class="set">${moves}</div>
    <div class="kv" style="margin-top:12px">
      <div style="grid-column:1/-1"><small>Melhores naturezas</small>${natures}</div>
      <div><small>EVs</small><b style="font-size:13.5px">${evs}</b></div>
      <div><small>Estilo</small><b>${style}</b></div>
    </div>
    <p class="why">${coverage} Calculado pelo poder × precisão × STAB, priorizando o status de ataque mais alto (lembre que na Geração III o tipo define se o golpe é físico ou especial) e depois a cobertura de tipos.</p>
  </div>`;
}

export function wherePanel(p: Pokemon, version: Version): string {
  const other = otherVersion(version);
  const all = [...encountersOf(p.id)].sort((a, b) => b.rate[version] - a.rate[version]);
  const here = all.filter((e) => e.rate[version] > 0);
  const onlyOther = all.filter((e) => e.rate[version] === 0 && e.rate[other] > 0);
  let body: string;
  if (here.length) {
    body = `<div class="tbl-wrap"><table><thead><tr><th>Área</th><th>Método</th><th>Chance</th><th class="r">Nível</th></tr></thead><tbody>${here
      .map(
        (e) =>
          `<tr class="click" data-area="${e.area}"><td>${esc(areaName(e.area))}</td><td><span class="method">${methodLabel(e.method)}</span></td><td><div class="rate"><span class="bar"><span style="width:${e.rate[version]}%"></span></span><b class="num">${e.rate[version]}%</b></div></td><td class="r num">${formatLevels(e)}</td></tr>`,
      )
      .join('')}</tbody></table></div>`;
  } else {
    const avail = availability(p.id, version);
    const source = obtainableAncestor(p.id, version);
    body =
      (avail === 'evo' || avail === 'trade') && source !== undefined
        ? `<p class="note">Não aparece na natureza em ${VERSION_LABEL[version]}. Consiga <button class="plink" data-goto="${source}">${esc(getPokemon(source).name)}</button> e evolua (${esc(evolutionPath(p.id, source))}).</p>`
        : `<p class="note">Não pode ser obtido em ${VERSION_LABEL[version]} sem troca${p.id > 151 ? ' com Ruby, Sapphire, Emerald, Colosseum ou XD' : ''}.</p>`;
  }
  if (onlyOther.length) {
    body += `<p class="note" style="margin-top:8px">Na outra versão aparece em: ${[...new Set(onlyOther.map((e) => areaName(e.area)))].map(esc).join(', ')}.</p>`;
  }
  return `<div class="panel"><h3 class="h3" style="margin-top:0">Onde encontrar <span class="note" style="font-weight:500">· ${VERSION_LABEL[version]}</span></h3>${body}</div>`;
}

export function profilePanel(p: Pokemon): string {
  const evo = evolutionStages(p.id)
    .map(
      (stage, i) =>
        (i ? '<span class="arr" aria-hidden="true">→</span>' : '') +
        stage
          .map((id) => {
            const s = getPokemon(id);
            return `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px">${i ? `<small class="note">${esc(s.evolutionMethod)}</small>` : ''}<button data-goto="${id}" ${id === p.id ? 'aria-current="true"' : ''}>${esc(s.name)}</button></span>`;
          })
          .join(' '),
    )
    .join('');
  const abilities = p.abilities
    .map((a) => {
      const ab = getAbility(a);
      return `<div style="margin-bottom:6px"><b>${esc(ab.name)}</b> <span class="note">${esc(ab.description)}</span></div>`;
    })
    .join('');
  const evYield = Object.entries(p.evYield)
    .map(([k, v]) => `+${v} ${STAT_LABEL[k as keyof typeof STAT_LABEL]}`)
    .join(', ');
  return `<div class="panel"><h3 class="h3" style="margin-top:0">Evolução</h3><div class="evo">${evo}</div>
    <h3 class="h3">Habilidades</h3>${abilities}
    <div class="kv" style="margin-top:12px">
      <div><small>EVs que dá</small><b style="font-size:13.5px">${evYield || '—'}</b></div>
      <div><small>Taxa de captura</small><b>${p.captureRate}</b> <span class="note">de 255</span></div>
      <div><small>Hábitat</small><b>${HABITAT_LABEL[p.habitat] ?? '—'}</b></div>
      <div><small>Gênero</small><b style="font-size:13px">${genderText(p.genderRate)}</b></div>
      <div><small>Ovo</small><b>${p.hatchCounter * 256} passos</b></div>
    </div></div>`;
}

export const heroChips = (p: Pokemon): string => p.types.map((t) => typeChip(t)).join('');
