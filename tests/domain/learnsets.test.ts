import { describe, expect, it } from 'vitest';
import { getMove } from '@/data';
import { howLearned, learnablePool, machineLabel } from '@/domain/learnsets';

describe('learnsets', () => {
  it('formata TM e HM', () => {
    expect(machineLabel(26)).toBe('TM26');
    expect(machineLabel(101)).toBe('HM01');
  });

  it('inclui golpes de nível das pré-evoluções', () => {
    const names = learnablePool(6).map((id) => getMove(id).name);
    expect(names).toContain('Ember');
    expect(names).toContain('Flamethrower');
  });

  it('explica como o golpe é aprendido', () => {
    const earthquake = learnablePool(6).find((id) => getMove(id).name === 'Earthquake');
    if (earthquake === undefined) throw new Error('Charizard deveria aprender Earthquake');
    expect(howLearned(6, earthquake)).toBe('TM26');
  });
});
