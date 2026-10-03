import { TYPES, TYPE_CHART } from '@/data';
import { TYPE_COLOR, TYPE_LABEL } from '@/domain/constants';
import { byId } from '@/ui/dom';
import { typeChip } from '@/ui/type-chip';

const CELL: Record<number, [cls: string, text: string]> = {
  2: ['x2', '2'],
  0.5: ['x05', '½'],
  0: ['x0', '0'],
  1: ['x1', ''],
};

export function mountTypeChart(): void {
  const head = TYPES.map(
    (t) => `<th><span class="vlabel" style="color:${TYPE_COLOR[t]}">${TYPE_LABEL[t]}</span></th>`,
  ).join('');
  const body = TYPES.map((atk) => {
    const cells = TYPES.map((def) => {
      const v = TYPE_CHART[atk][def];
      const [cls, text] = CELL[v] ?? ['x1', ''];
      return `<td class="${cls}" title="${TYPE_LABEL[atk]} → ${TYPE_LABEL[def]}: ${v}×">${text}</td>`;
    }).join('');
    return `<tr><th class="rowh">${typeChip(atk, true)}</th>${cells}</tr>`;
  }).join('');
  byId('tchart').innerHTML =
    `<table class="tc"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table>`;
}
