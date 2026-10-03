import type { TypeName } from '@/types';

/** Ícones originais por tipo (traço 24×24). */
const TYPE_PATHS: Record<TypeName, string> = {
  normal: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2"/>',
  fire: '<path d="M12 3c1 4 5.5 5.5 5.5 10.5a5.5 5.5 0 0 1-11 0c0-3 2-4.5 2-6.5 1.5 1 2.2 2.2 2.2 3.4C10.7 7.4 11.6 5 12 3z"/>',
  water:
    '<path d="M12 3s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.2 12 3 12 3z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  electric: '<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
  grass: '<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19 14 10"/>',
  ice: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5"/>',
  fighting:
    '<rect x="5" y="9" width="14" height="10" rx="3.5"/><path d="M9 9V6.5M12 9V5.5M15 9V6.5M5 13h5"/>',
  poison:
    '<circle cx="9" cy="14.5" r="4.5"/><circle cx="16.5" cy="8.5" r="3"/><circle cx="17.5" cy="17" r="1.8"/>',
  ground: '<path d="M3 19h18M5 19l5-8 3 4 2-3 4 7"/>',
  flying: '<path d="M3 13c5 0 8-3 9-8 1 5 4 8 9 8-4 1-6.5 3-9 6-2.5-3-5-5-9-6z"/>',
  psychic:
    '<path d="M2 12s4-6.5 10-6.5S22 12 22 12s-4 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
  bug: '<ellipse cx="12" cy="14" rx="5" ry="6"/><path d="M12 8v12M9 5l1.5 3M15 5l-1.5 3M7 12H4M7 16H4M17 12h3M17 16h3"/>',
  rock: '<path d="M4 16 7 7l7-3.5 6 6.5-2 9H7z"/><path d="M7 7l5 5 8-2M12 12l-1 7"/>',
  ghost:
    '<path d="M6 20v-9a6 6 0 0 1 12 0v9l-2-2-2 2-2-2-2 2-2-2z"/><path d="M10 11h.01M14 11h.01"/>',
  dragon:
    '<path d="M4 19c4 0 6.5-2 7.5-5l2 3 1-6.5 3 3 2.5-8.5c-4 1-6 2.5-8 4.5L9 5.5 8 12c-2 1-4 3-4 7z"/>',
  dark: '<path d="M16 4a8 8 0 1 0 4.5 12.5A7 7 0 0 1 16 4z"/>',
  steel:
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
};

const stroke = (paths: string, width = 2): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const typeIcon = (t: TypeName): string => stroke(TYPE_PATHS[t]);

export const personIcon = (): string =>
  stroke('<circle cx="12" cy="7" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>');

export const gridIcon = (): string =>
  stroke(
    '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    2.4,
  );
