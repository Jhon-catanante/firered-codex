/** Percentual curto em pt-BR: 100%, 21%, 2,1%. */
export function percent(x: number): string {
  if (x >= 1) return '100%';
  if (x >= 0.1) return `${(x * 100).toFixed(0)}%`;
  return `${(x * 100).toFixed(1).replace('.', ',')}%`;
}

export const genderText = (genderRate: number): string => {
  if (genderRate < 0) return 'Sem gênero';
  const female = genderRate * 12.5;
  const fmt = (n: number) => n.toFixed(1).replace('.0', '');
  return `${fmt(100 - female)}% ♂ / ${fmt(female)}% ♀`;
};
