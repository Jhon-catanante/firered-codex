import { describe, expect, it } from 'vitest';
import { TYPES } from '@/data';
import { defensiveMatchups, effectiveness } from '@/domain/type-chart';

describe('tabela de tipos da Geração III', () => {
  it('tem 17 tipos (sem Fada)', () => {
    expect(TYPES).toHaveLength(17);
    expect(TYPES).not.toContain('fairy');
  });

  it('multiplica efetividade em tipo duplo', () => {
    expect(effectiveness('ice', ['dragon', 'flying'])).toBe(4);
    expect(effectiveness('ground', ['fire', 'flying'])).toBe(0);
  });

  it('Aço ainda resiste a Fantasma e Sombrio (mudou só na Geração VI)', () => {
    expect(effectiveness('ghost', ['steel'])).toBe(0.5);
    expect(effectiveness('dark', ['steel'])).toBe(0.5);
  });

  it('agrupa as fraquezas de Gengar', () => {
    const g = defensiveMatchups(['ghost', 'poison']);
    expect(g[2].sort()).toEqual(['dark', 'ghost', 'ground', 'psychic']);
    expect(g[0].sort()).toEqual(['fighting', 'normal']);
  });
});
