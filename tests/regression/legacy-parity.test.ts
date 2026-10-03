/**
 * Golden master: resultados extraídos da versão de arquivo único (antes da migração para
 * TypeScript). Garante que a refatoração não mudou nenhuma regra do jogo.
 */
import { describe, expect, it } from 'vitest';
import golden from '../fixtures/legacy-golden.json';
import { POKEMON_IDS, TRAINER_GROUPS, getMove } from '@/data';
import { availability } from '@/domain/availability';
import { STAT_KEYS } from '@/domain/constants';
import { bestEvSpots } from '@/domain/ev-training';
import { LEGENDARY_IDS, legendStatus } from '@/domain/legends';
import { recommend } from '@/domain/moveset';
import { suggestCounters } from '@/domain/progression';
import { getPokemon } from '@/data';
import type { Starter, Version } from '@/types';

interface GoldenPokemon {
  moves: string[];
  nature: string;
  natures: string[];
  evs: Record<string, number>;
  coverage: string[];
  availability: string;
}

const G = golden as unknown as {
  pokemon: Record<string, GoldenPokemon>;
  counters: Record<string, string[]>;
  legends: Record<string, string>;
  ev: Record<string, [number, number, number][]>;
};

const VERSIONS: Version[] = ['fr', 'lg'];
const STARTERS: Starter[] = ['bulbasaur', 'charmander', 'squirtle'];

describe('paridade com a versão anterior', () => {
  it('build recomendada idêntica para os 386 Pokémon', () => {
    for (const id of POKEMON_IDS) {
      const r = recommend(id);
      const g = G.pokemon[`fr:${id}`];
      expect({ id, moves: r.moves.map((m) => getMove(m).name), nature: r.nature }).toEqual({
        id,
        moves: g?.moves,
        nature: g?.nature,
      });
      expect(r.natures.map((n) => n.name)).toEqual(g?.natures);
      expect(r.evs).toEqual(g?.evs);
      expect(r.coverage).toEqual(g?.coverage);
    }
  });

  it('disponibilidade idêntica nas duas versões', () => {
    for (const v of VERSIONS) {
      for (const id of POKEMON_IDS) {
        expect([v, id, availability(id, v)]).toEqual([
          v,
          id,
          G.pokemon[`${v}:${id}`]?.availability,
        ]);
      }
    }
  });

  it('sugestões de captura antes de cada batalha idênticas', () => {
    for (const v of VERSIONS) {
      for (const group of TRAINER_GROUPS) {
        for (const t of group.trainers) {
          if (t.gymIndex === null) continue;
          for (const s of STARTERS) {
            const team = t.party ?? t.partiesByStarter?.[s] ?? [];
            const key = [v, group.id, t.name, t.subtitle, s].join('|');
            const names = suggestCounters(team, t.gymIndex, v).map(
              (c) => getPokemon(c.pokemon).name,
            );
            expect([key, names]).toEqual([key, G.counters[key]]);
          }
        }
      }
    }
  });

  it('status dos lendários idêntico', () => {
    for (const v of VERSIONS) {
      for (const id of LEGENDARY_IDS) expect(legendStatus(id, v)).toBe(G.legends[`${v}:${id}`]);
    }
  });

  it('ranking de locais de EV idêntico', () => {
    for (const v of VERSIONS) {
      for (const k of STAT_KEYS) {
        const spots = bestEvSpots(k, v).map((s) => [s.area, s.method, +s.perBattle.toFixed(4)]);
        expect([v, k, spots]).toEqual([v, k, G.ev[`${v}:${k}`]]);
      }
    }
  });
});
