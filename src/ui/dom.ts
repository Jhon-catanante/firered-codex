/** Escapa texto para interpolação segura em HTML. */
export const esc = (value: unknown): string =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );

/** Busca um elemento obrigatório; falha cedo se o HTML base mudar. */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado`);
  return el as T;
}

/**
 * Delegação de eventos: chama `handler` com o elemento mais próximo que casa com `selector`.
 * Evita registrar um listener por item em listas que são re-renderizadas.
 */
export function delegate<K extends keyof HTMLElementEventMap>(
  root: HTMLElement | Document,
  type: K,
  selector: string,
  handler: (match: HTMLElement, event: HTMLElementEventMap[K]) => void,
): void {
  root.addEventListener(type, (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const match = target.closest<HTMLElement>(selector);
    if (match && (root === document || (root as HTMLElement).contains(match))) {
      handler(match, event as HTMLElementEventMap[K]);
    }
  });
}

/** Lê um atributo data-* numérico. */
export const dataNum = (el: HTMLElement, key: string): number => Number(el.dataset[key]);

export const pad3 = (n: number): string => String(n).padStart(3, '0');

export const setPressed = (
  buttons: Iterable<Element>,
  isOn: (el: HTMLElement) => boolean,
): void => {
  for (const b of buttons)
    if (b instanceof HTMLElement) b.setAttribute('aria-pressed', String(isOn(b)));
};

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
