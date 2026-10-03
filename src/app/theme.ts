import { load, save } from './storage';

type Theme = 'light' | 'dark';

function apply(theme: Theme | null): void {
  if (theme) document.documentElement.setAttribute('data-theme', theme);
  else document.documentElement.removeAttribute('data-theme');
}

/** Alterna claro/escuro; sem escolha salva, segue o sistema operacional. */
export function initTheme(button: HTMLElement): void {
  apply(load<Theme | null>('theme', null, (r) => (r === 'dark' || r === 'light' ? r : null)));
  button.addEventListener('click', () => {
    const current =
      (document.documentElement.getAttribute('data-theme') as Theme | null) ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    apply(next);
    save('theme', next);
  });
}
