/**
 * Navegação entre features sem dependência direta entre elas: quem quer abrir a ficha de um
 * Pokémon ou uma área só emite o evento; quem sabe fazer isso assina.
 */
export interface EventMap {
  'pokemon:open': number;
  'area:open': number;
}

type Handler<K extends keyof EventMap> = (payload: EventMap[K]) => void;

const handlers = new Map<keyof EventMap, Set<(payload: never) => void>>();

export function on<K extends keyof EventMap>(event: K, fn: Handler<K>): () => void {
  const set = handlers.get(event) ?? new Set();
  set.add(fn as (payload: never) => void);
  handlers.set(event, set);
  return () => set.delete(fn as (payload: never) => void);
}

export function emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  handlers.get(event)?.forEach((fn) => (fn as Handler<K>)(payload));
}
