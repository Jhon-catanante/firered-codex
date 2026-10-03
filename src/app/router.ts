import { store, TABS, type Tab } from './store';

const isTab = (v: string | undefined): v is Tab => !!v && (TABS as readonly string[]).includes(v);

function render(tab: Tab): void {
  document.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => {
    const on = b.dataset.tab === tab;
    b.setAttribute('aria-selected', String(on));
    if (on && b.closest('.bnav')) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  document.querySelectorAll<HTMLElement>('main > section').forEach((s) => {
    s.hidden = s.id !== tab;
  });
}

export function showTab(tab: Tab): void {
  store.set('tab', tab);
  render(tab);
  window.scrollTo({ top: 0 });
}

/** Liga as abas do topo e da navegação inferior. */
export function initRouter(): void {
  document.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => {
    b.addEventListener('click', () => {
      if (isTab(b.dataset.tab)) showTab(b.dataset.tab);
    });
  });
  render(store.get('tab'));
}
