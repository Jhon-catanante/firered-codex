export interface CatchInput {
  captureRate: number;
  /** Bônus da bola: Poké Ball 1, Great Ball 1,5, Ultra Ball 2. */
  ball: number;
  /** Fração de HP restante (0 = 1 HP, 1 = HP cheio). */
  hpFraction: number;
  /** Sono/congelado 2, paralisia/veneno/queimadura 1,5, sem status 1. */
  status: number;
}

export const BALL = { poke: 1, great: 1.5, ultra: 2 } as const;
export const STATUS = { none: 1, paralysis: 1.5, sleep: 2 } as const;

/**
 * Chance de captura por arremesso com a fórmula da Geração III:
 * a = ⌊(3M − 2H) · taxa · bola / 3M⌋ · status; quatro checagens com b = 1048560 / √√(16711680 / a).
 */
export function catchChance({ captureRate, ball, hpFraction, status }: CatchInput): number {
  const maxHp = 300;
  const hp = Math.max(1, Math.round(maxHp * hpFraction));
  let a = Math.floor(
    Math.floor(((3 * maxHp - 2 * hp) * captureRate * ball) / (3 * maxHp)) * status,
  );
  if (a >= 255) return 1;
  if (a < 1) a = 1;
  const b = Math.floor(
    1048560 / Math.floor(Math.sqrt(Math.floor(Math.sqrt(Math.floor(16711680 / a))))),
  );
  return (b / 65536) ** 4;
}

/** Quantidade média de bolas até capturar. */
export const expectedBalls = (chance: number): number => (chance >= 1 ? 1 : Math.ceil(1 / chance));
