import { describe, expect, it } from 'vitest';
import { getPokemon } from '@/data';
import { baseStatTotal, calcStat, natureMultiplier, statRangeAt100 } from '@/domain/stats';

describe('calcStat (fórmula da Geração III)', () => {
  it('calcula Atq. Esp. de Charizard nível 50 com Modest, IV 31 e 252 EVs', () => {
    expect(calcStat('spa', { base: 109, iv: 31, ev: 252, level: 50, nature: 'Modest' })).toBe(177);
  });

  it('calcula HP sem efeito de natureza', () => {
    expect(calcStat('hp', { base: 78, iv: 31, ev: 4, level: 50, nature: 'Modest' })).toBe(154);
  });

  it('Shedinja sempre tem 1 HP', () => {
    expect(calcStat('hp', { base: 1, iv: 31, ev: 252, level: 100, nature: 'Hardy' })).toBe(1);
  });

  it('aplica a natureza depois do arredondamento', () => {
    const neutral = calcStat('atk', { base: 100, iv: 31, ev: 0, level: 100, nature: 'Hardy' });
    const up = calcStat('atk', { base: 100, iv: 31, ev: 0, level: 100, nature: 'Adamant' });
    const down = calcStat('atk', { base: 100, iv: 31, ev: 0, level: 100, nature: 'Modest' });
    expect(neutral).toBe(236);
    expect(up).toBe(Math.floor(236 * 1.1));
    expect(down).toBe(Math.floor(236 * 0.9));
  });
});

describe('natureMultiplier', () => {
  it('neutras não alteram nada', () => {
    expect(natureMultiplier('Serious', 'spe')).toBe(1);
  });
  it('Jolly sobe Velocidade e baixa Atq. Esp.', () => {
    expect(natureMultiplier('Jolly', 'spe')).toBe(1.1);
    expect(natureMultiplier('Jolly', 'spa')).toBe(0.9);
    expect(natureMultiplier('Jolly', 'atk')).toBe(1);
  });
});

describe('statRangeAt100', () => {
  it('Snorlax tem HP de 430 a 524 no nível 100', () => {
    expect(statRangeAt100('hp', 160)).toEqual([430, 524]);
  });
});

describe('baseStatTotal', () => {
  it('Mewtwo soma 680', () => {
    expect(baseStatTotal(getPokemon(150))).toBe(680);
  });
});
