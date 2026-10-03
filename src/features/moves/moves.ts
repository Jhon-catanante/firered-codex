import { TYPES, allLearnsets, allMoves, machineFor } from '@/data';
import { CATEGORY_LABEL, TYPE_LABEL } from '@/domain/constants';
import { machineLabel } from '@/domain/learnsets';
import type { Move, MoveCategory, TypeName } from '@/types';
import { byId, delegate, esc } from '@/ui/dom';
import { typeChip } from '@/ui/type-chip';

type SortKey = 'name' | 'type' | 'category' | 'power' | 'accuracy' | 'pp' | 'machine' | 'learners';

/** Quantos Pokémon aprendem cada golpe (por qualquer método). */
const learnerCount = new Map<number, number>();
for (const l of Object.values(allLearnsets())) {
  const set = new Set([...l.levelUp.map(([, id]) => id), ...l.tm, ...l.tutor, ...l.egg]);
  set.forEach((id) => learnerCount.set(id, (learnerCount.get(id) ?? 0) + 1));
}

const SORT_VALUE: Record<SortKey, (m: Move) => string | number> = {
  name: (m) => m.name,
  type: (m) => m.type,
  category: (m) => m.category,
  power: (m) => m.power ?? -1,
  accuracy: (m) => m.accuracy ?? 101,
  pp: (m) => m.pp ?? 0,
  machine: (m) => machineFor(m.id) ?? 999,
  learners: (m) => learnerCount.get(m.id) ?? 0,
};

const COLUMNS: readonly [SortKey, string, string?][] = [
  ['name', 'Golpe'],
  ['type', 'Tipo'],
  ['category', 'Categoria'],
  ['power', 'Poder', 'r'],
  ['accuracy', 'Precisão', 'r'],
  ['pp', 'PP', 'r'],
  ['machine', 'TM/HM'],
  ['learners', 'Aprendem', 'r'],
];

let sort: { key: SortKey; asc: boolean } = { key: 'name', asc: true };

function row(m: Move): string {
  const machine = machineFor(m.id);
  const priority = m.priority
    ? ` <span class="badge">prioridade ${m.priority > 0 ? '+' : ''}${m.priority}</span>`
    : '';
  return `<tr><td><b>${esc(m.name)}</b><span class="effm">${esc(m.effect)}</span>${priority}</td><td>${typeChip(m.type, true)}</td><td><span class="cat ${m.category}">${CATEGORY_LABEL[m.category]}</span></td><td class="r num">${m.power ?? '—'}</td><td class="r num">${m.accuracy ?? '—'}</td><td class="r num">${m.pp ?? '—'}</td><td class="num">${machine ? machineLabel(machine) : ''}</td><td class="r num">${learnerCount.get(m.id) ?? 0}</td><td class="eff">${esc(m.effect)}</td></tr>`;
}

function render(): void {
  const q = byId<HTMLInputElement>('mq').value.trim().toLowerCase();
  const type = byId<HTMLSelectElement>('mtype').value as TypeName | '';
  const category = byId<HTMLSelectElement>('mcat').value as MoveCategory | '';
  const machinesOnly = byId<HTMLInputElement>('mtm').checked;
  const value = SORT_VALUE[sort.key];
  const list = allMoves()
    .filter(
      (m) =>
        (!q || m.name.toLowerCase().includes(q)) &&
        (!type || m.type === type) &&
        (!category || m.category === category) &&
        (!machinesOnly || machineFor(m.id) !== undefined),
    )
    .sort((a, b) => {
      const x = value(a);
      const y = value(b);
      return (x > y ? 1 : x < y ? -1 : 0) * (sort.asc ? 1 : -1);
    });
  byId('mcount').textContent = `${list.length} golpes`;
  const head = COLUMNS.map(
    ([key, label, cls = '']) =>
      `<th class="sort ${cls} ${sort.key === key ? `on${sort.asc ? ' asc' : ''}` : ''}" data-k="${key}">${label}</th>`,
  ).join('');
  byId('mtable').innerHTML =
    `<thead><tr>${head}<th>Efeito</th></tr></thead><tbody>${list.map(row).join('')}</tbody>`;
}

export function mountMoves(): void {
  byId('mtype').innerHTML =
    '<option value="">Todos os tipos</option>' +
    TYPES.map((t) => `<option value="${t}">${TYPE_LABEL[t]}</option>`).join('');
  for (const id of ['mq', 'mtype', 'mcat', 'mtm']) byId(id).addEventListener('input', render);
  delegate(byId('mtable'), 'click', 'th[data-k]', (th) => {
    const key = th.dataset.k as SortKey;
    sort = {
      key,
      asc: sort.key === key ? !sort.asc : key === 'name' || key === 'machine' || key === 'type',
    };
    render();
  });
  render();
}
