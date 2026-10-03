import { describe, expect, it } from 'vitest';
import { TRAINER_GROUPS, getPokemon } from '@/data';
import { CHAPTERS } from '@/domain/journey';
import { aceLevel, battlesInChapter } from '@/domain/walkthrough';

describe('batalhas do detonado', () => {
  it('Brock fecha a primeira etapa, depois de duas batalhas contra o rival', () => {
    const b = battlesInChapter(0, 'charmander');
    expect(b.map((x) => x.kind)).toEqual(['rival', 'rival', 'gym']);
    expect(b[2]?.trainer.name).toBe('Brock');
    expect(aceLevel(b[2]?.party ?? [])).toBe(14);
  });

  it('o rival escolhe o inicial com vantagem sobre o seu', () => {
    const lab = (s: 'bulbasaur' | 'charmander' | 'squirtle') =>
      getPokemon(battlesInChapter(0, s)[0]?.party[0]?.pokemon ?? 0).name;
    expect(lab('bulbasaur')).toBe('Charmander');
    expect(lab('charmander')).toBe('Squirtle');
    expect(lab('squirtle')).toBe('Bulbasaur');
  });

  it('cada líder aparece na etapa do seu ginásio', () => {
    const gyms = TRAINER_GROUPS.find((g) => g.id === 'gyms')?.trainers ?? [];
    gyms.forEach((leader, i) => {
      expect(battlesInChapter(i, 'charmander').some((b) => b.trainer === leader)).toBe(true);
    });
  });

  it('a Liga tem rival, Elite Four e Campeão, nessa ordem', () => {
    const names = battlesInChapter(8, 'squirtle').map((b) => b.trainer.name);
    expect(names).toEqual([
      'Rota 22 (2ª vez)',
      'Lorelei',
      'Bruno',
      'Agatha',
      'Lance',
      'Blue (Campeão)',
    ]);
  });

  it('toda batalha agendada existe e está numa etapa válida', () => {
    for (const c of CHAPTERS) {
      for (const b of battlesInChapter(c.id, 'bulbasaur'))
        expect(b.party.length).toBeGreaterThan(0);
    }
    expect(battlesInChapter(10, 'bulbasaur')).toEqual([]);
  });
});
