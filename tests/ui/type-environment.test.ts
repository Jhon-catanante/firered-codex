import { describe, expect, it } from 'vitest';
import { TYPES } from '@/data';
import { ENVIRONMENT_TYPES, typeEnvironment } from '@/ui/type-environment';

describe('ambientes por tipo', () => {
  it('existe um ambiente para cada um dos 17 tipos', () => {
    expect([...ENVIRONMENT_TYPES].sort()).toEqual([...TYPES].sort());
  });

  it('gera um SVG decorativo com a classe do tipo', () => {
    const svg = typeEnvironment('fire');
    expect(svg).toMatch(/^<svg class="env env-fire"/);
    expect(svg).toContain('aria-hidden="true"');
  });

  it('não usa ids no SVG (evita colisão entre os 386 cards)', () => {
    for (const t of TYPES) expect(typeEnvironment(t)).not.toMatch(/\sid="/);
  });
});
