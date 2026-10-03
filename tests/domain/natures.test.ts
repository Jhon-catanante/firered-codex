import { describe, expect, it } from 'vitest';
import { recommend } from '@/domain/moveset';

const top = (id: number) => recommend(id).natures.map((n) => n.name);

describe('ranking de naturezas', () => {
  it('atacante físico rápido: Dragonite prefere Adamant e depois Jolly', () => {
    expect(top(149).slice(0, 2)).toEqual(['Adamant', 'Jolly']);
  });

  it('atacante especial muito rápido: Gengar prefere Timid', () => {
    expect(top(94)[0]).toBe('Timid');
  });

  it('suporte defensivo: Chansey prefere Calm', () => {
    expect(top(113)[0]).toBe('Calm');
  });

  it('sempre devolve três naturezas não neutras com motivo', () => {
    for (const n of recommend(25).natures) {
      expect(n.up).not.toBe(n.down);
      expect(n.reason.length).toBeGreaterThan(10);
    }
  });
});
