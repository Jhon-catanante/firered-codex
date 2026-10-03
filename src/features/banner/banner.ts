import { AREA_IDS, POKEMON_IDS, allMoves } from '@/data';
import { byId, prefersReducedMotion } from '@/ui/dom';
import { bannerScene } from './scene';

function countUp(el: HTMLElement, to: number, duration = 1100): void {
  if (prefersReducedMotion()) {
    el.textContent = String(to);
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const k = Math.min(1, (now - start) / duration);
    el.textContent = String(Math.round(to * (1 - (1 - k) ** 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function mountBanner(): void {
  const banner = byId('banner');
  banner.insertAdjacentHTML('afterbegin', bannerScene());
  const totals: Record<string, number> = {
    pokemon: POKEMON_IDS.length,
    areas: AREA_IDS.length,
    moves: allMoves().length,
  };
  banner.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    countUp(el, totals[el.dataset.count ?? ''] ?? 0);
  });
}
