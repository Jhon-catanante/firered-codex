import { describe, expect, it } from 'vitest';
import { buildJourney, CHAPTERS } from '@/domain/journey';
import { ALL_STEP_IDS, GUIDE } from '@/features/detonado/guide';
import { MAP_NODES, MAP_ROUTES } from '@/features/detonado/map-data';

const PLACE_NAMES = new Set(buildJourney().flatMap((c) => c.places.map((p) => p.name)));

describe('conteúdo do detonado', () => {
  it('tem um roteiro para cada etapa da história, em ordem', () => {
    expect(GUIDE.map((g) => g.chapter)).toEqual(CHAPTERS.filter((c) => c.id <= 9).map((c) => c.id));
  });

  it('ids de passo são únicos (o progresso salvo depende deles)', () => {
    expect(new Set(ALL_STEP_IDS).size).toBe(ALL_STEP_IDS.length);
  });
});

describe('mapa de Kanto', () => {
  it('toda rota e todo lugar do mapa existem na aba Rotas', () => {
    for (const r of MAP_ROUTES) expect(PLACE_NAMES.has(r.place), r.place).toBe(true);
    for (const n of MAP_NODES) if (n.place) expect(PLACE_NAMES.has(n.place), n.place).toBe(true);
  });

  it('cobre as 25 rotas de Kanto', () => {
    expect(MAP_ROUTES.map((r) => Number(r.label)).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 25 }, (_, i) => i + 1),
    );
  });

  it('os ids dos lugares são únicos', () => {
    expect(new Set(MAP_NODES.map((n) => n.id)).size).toBe(MAP_NODES.length);
  });
});
