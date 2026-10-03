import { describe, expect, it } from 'vitest';
import { AREA_IDS, areaName } from '@/data';
import {
  CHAPTERS,
  buildJourney,
  chapterOf,
  floorLabel,
  methodFamily,
  placeName,
} from '@/domain/journey';

const areaId = (name: string): number => {
  const id = AREA_IDS.find((a) => areaName(a) === name);
  if (id === undefined) throw new Error(`área ${name} não existe`);
  return id;
};

describe('jornada da aba Rotas', () => {
  it('coloca cada área numa etapa da história', () => {
    expect(chapterOf(areaId('Rota 1'))).toBe(0);
    expect(chapterOf(areaId('Mount Moon (1F)'))).toBe(1);
    expect(chapterOf(areaId('Pokémon Center (Rota 4)'))).toBe(1);
    expect(chapterOf(areaId('Victory Road (2F)'))).toBe(8);
    expect(chapterOf(areaId('Cerulean Cave (B1F)'))).toBe(9);
    expect(chapterOf(areaId('Navel Rock (evento)'))).toBe(10);
  });

  it('agrupa andares e salas no mesmo lugar', () => {
    expect(placeName('Mount Moon (B1F)')).toBe('Mount Moon');
    expect(placeName('Safari Zone (Area 2, north)')).toBe('Safari Zone');
    expect(placeName('Rota 2 (norte)')).toBe('Rota 2');
    expect(placeName('Pokémon Center (Rota 3)')).toBe('Pokémon Center (Rota 3)');
    expect(floorLabel('Mount Moon (B1F)', 'Mount Moon')).toBe('B1F');
    expect(floorLabel('Altering Cave (B) — evento', 'Altering Cave')).toBe('B');

    const moon = buildJourney()
      .flatMap((c) => c.places)
      .find((p) => p.name === 'Mount Moon');
    expect(moon?.areas.map(areaName)).toEqual([
      'Mount Moon (1F)',
      'Mount Moon (B1F)',
      'Mount Moon (B2F)',
    ]);
    expect(moon?.kind).toBe('cave');
  });

  it('inclui todas as áreas exatamente uma vez, em etapas ordenadas', () => {
    const journey = buildJourney();
    const all = journey.flatMap((c) => c.places.flatMap((p) => p.areas));
    expect(all.sort((a, b) => a - b)).toEqual([...AREA_IDS].sort((a, b) => a - b));
    const ids = journey.map((c) => c.chapter.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
    expect(ids.every((id) => CHAPTERS.some((c) => c.id === id))).toBe(true);
  });

  it('rotas aparecem na ordem numérica dentro da etapa', () => {
    const first = buildJourney()[0]?.places.map((p) => p.name) ?? [];
    expect(first.indexOf('Rota 1')).toBeLessThan(first.indexOf('Rota 2'));
    expect(first.indexOf('Rota 2')).toBeLessThan(first.indexOf('Rota 22'));
  });

  it('classifica métodos em famílias para o filtro', () => {
    expect(methodFamily(1)).toBe('grass');
    expect(methodFamily(5)).toBe('water');
    expect(methodFamily(3)).toBe('water');
    expect(methodFamily(6)).toBe('rocks');
    expect(methodFamily(18)).toBe('special');
  });
});
