import { TYPE_COLOR, TYPE_LABEL } from '@/domain/constants';
import type { TypeName } from '@/types';
import { typeIcon } from './icons';

export const typeChip = (t: TypeName, small = false): string =>
  `<span class="ty${small ? ' sm' : ''}" style="--c:${TYPE_COLOR[t]}"><i>${typeIcon(t)}</i>${TYPE_LABEL[t]}</span>`;

export const typeChips = (types: readonly TypeName[], small = true): string =>
  types.map((t) => typeChip(t, small)).join(' ');

/** Variáveis CSS de cor do card a partir dos tipos (primário e secundário). */
export const typeColorVars = (types: readonly TypeName[]): string => {
  const [first = 'normal', second = first] = types;
  return `--c:${TYPE_COLOR[first]};--c2:${TYPE_COLOR[second]}`;
};
