import { getLearnset, getMove, getPokemon, hasMove, machineFor } from '@/data';
import { CATEGORY_LABEL } from '@/domain/constants';
import { machineLabel, type LearnMethod } from '@/domain/learnsets';
import { esc } from '@/ui/dom';
import { typeChip } from '@/ui/type-chip';

export const LEARN_TABS: readonly { key: LearnMethod; label: string }[] = [
  { key: 'levelUp', label: 'Nível' },
  { key: 'tm', label: 'TM/HM' },
  { key: 'tutor', label: 'Tutor' },
  { key: 'egg', label: 'Ovo' },
];

const FIRST_COLUMN: Partial<Record<LearnMethod, string>> = { levelUp: 'Nv.', tm: 'Máquina' };

/** Linhas [rótulo da 1ª coluna, id do golpe] para o método escolhido. */
function rows(pokemonId: number, method: LearnMethod): [string, number][] {
  const l = getLearnset(pokemonId);
  if (!l) return [];
  if (method === 'levelUp') return l.levelUp.map(([lv, id]) => [lv <= 1 ? '—' : String(lv), id]);
  return l[method].map((id) => {
    const machine = machineFor(id);
    return [method === 'tm' ? (machine ? machineLabel(machine) : '—') : '', id];
  });
}

export const learnCount = (pokemonId: number, method: LearnMethod): number =>
  getLearnset(pokemonId)?.[method].length ?? 0;

export function learnTable(pokemonId: number, method: LearnMethod): string {
  const list = rows(pokemonId, method).filter(([, id]) => hasMove(id));
  if (!list.length) return '<p class="note">Nenhum golpe por esse método.</p>';
  const first = FIRST_COLUMN[method];
  const types = getPokemon(pokemonId).types;
  const body = list
    .map(([label, id]) => {
      const m = getMove(id);
      const stab = types.includes(m.type) && m.category !== 'status';
      return `<tr>${first ? `<td class="num">${label}</td>` : ''}<td><b>${esc(m.name)}</b>${stab ? ' <span class="badge">STAB</span>' : ''}</td><td>${typeChip(m.type, true)}</td><td><span class="cat ${m.category}">${CATEGORY_LABEL[m.category]}</span></td><td class="r num">${m.power ?? '—'}</td><td class="r num">${m.accuracy ?? '—'}</td><td class="r num">${m.pp ?? '—'}</td></tr>`;
    })
    .join('');
  return `<table><thead><tr>${first ? `<th>${first}</th>` : ''}<th>Golpe</th><th>Tipo</th><th>Categoria</th><th class="r">Poder</th><th class="r">Precisão</th><th class="r">PP</th></tr></thead><tbody>${body}</tbody></table>`;
}
