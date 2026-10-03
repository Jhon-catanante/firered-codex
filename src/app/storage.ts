/**
 * localStorage pode falhar (modo privado, cota, iframe sandbox). Toda leitura e escrita passa
 * por aqui e degrada para "sem persistência" em vez de quebrar a página.
 */
const PREFIX = 'frc-';

export function load<T>(key: string, fallback: T, parse: (raw: string) => T = (r) => r as T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    /* sem persistência */
  }
}
