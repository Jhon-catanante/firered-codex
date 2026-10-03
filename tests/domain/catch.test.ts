import { describe, expect, it } from 'vitest';
import { BALL, STATUS, catchChance, expectedBalls } from '@/domain/catch';

describe('catchChance (fórmula da Geração III)', () => {
  it('lendário com taxa 3: menos de 1% com HP cheio e Ultra Ball', () => {
    const p = catchChance({ captureRate: 3, ball: BALL.ultra, hpFraction: 1, status: STATUS.none });
    expect(p).toBeGreaterThan(0.007);
    expect(p).toBeLessThan(0.009);
  });

  it('1 HP e sono aumentam a chance', () => {
    const base = { captureRate: 3, ball: BALL.ultra };
    const full = catchChance({ ...base, hpFraction: 1, status: STATUS.none });
    const low = catchChance({ ...base, hpFraction: 0, status: STATUS.none });
    const asleep = catchChance({ ...base, hpFraction: 0, status: STATUS.sleep });
    expect(low).toBeGreaterThan(full);
    expect(asleep).toBeGreaterThan(low);
    expect(asleep).toBeCloseTo(0.0437, 3);
  });

  it('captura garantida quando o valor modificado chega a 255', () => {
    expect(
      catchChance({ captureRate: 255, ball: BALL.ultra, hpFraction: 0, status: STATUS.sleep }),
    ).toBe(1);
  });

  it('expectedBalls arredonda para cima', () => {
    expect(expectedBalls(1)).toBe(1);
    expect(expectedBalls(0.3)).toBe(4);
  });
});
