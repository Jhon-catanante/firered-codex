import type { Starter, Version } from '@/types';
import { load, save } from './storage';

export type Tab = 'dex' | 'moves' | 'routes' | 'train' | 'teams' | 'legends' | 'trainers' | 'types';
export const TABS: readonly Tab[] = [
  'dex',
  'moves',
  'routes',
  'train',
  'teams',
  'legends',
  'trainers',
  'types',
];

export interface AppState {
  version: Version;
  tab: Tab;
  starter: Starter;
}

type Listener<K extends keyof AppState> = (value: AppState[K]) => void;

const oneOf =
  <T extends string>(allowed: readonly T[], fallback: T) =>
  (raw: string): T =>
    (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback;

const state: AppState = {
  version: load('ver', 'fr', oneOf<Version>(['fr', 'lg'], 'fr')),
  tab: load('tab', 'dex', oneOf<Tab>(TABS, 'dex')),
  starter: load(
    'starter',
    'charmander',
    oneOf<Starter>(['bulbasaur', 'charmander', 'squirtle'], 'charmander'),
  ),
};

const PERSIST_KEY: Record<keyof AppState, string> = {
  version: 'ver',
  tab: 'tab',
  starter: 'starter',
};
const listeners: { [K in keyof AppState]: Set<Listener<K>> } = {
  version: new Set(),
  tab: new Set(),
  starter: new Set(),
};

/** Estado global mínimo e persistido; cada feature assina só o que usa. */
export const store = {
  get<K extends keyof AppState>(key: K): AppState[K] {
    return state[key];
  },
  set<K extends keyof AppState>(key: K, value: AppState[K]): void {
    if (state[key] === value) return;
    state[key] = value;
    save(PERSIST_KEY[key], String(value));
    listeners[key].forEach((fn) => fn(value));
  },
  subscribe<K extends keyof AppState>(key: K, fn: Listener<K>): () => void {
    listeners[key].add(fn);
    return () => listeners[key].delete(fn);
  },
};
