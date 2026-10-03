/** Gerador pseudoaleatório determinístico: a grama fica igual em todo carregamento. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function grassTufts(seed = 7): string {
  const rand = mulberry32(seed);
  const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)] as T;
  const tufts: string[] = [];
  for (let x = -10; x < 1220;) {
    x += int(14, 46);
    const y = pick([248, 252, 256, 260]);
    const blades: string[] = [];
    for (let k = int(3, 5); k > 0; k--) {
      const h = int(14, 30);
      const dx = int(-9, 9);
      const off = int(-5, 5);
      const delay = (rand() * 3).toFixed(1);
      blades.push(
        `<path class="blade" style="animation-delay:-${delay}s" d="M${x + off} ${y} q${Math.trunc(dx / 2)} -${Math.trunc(h / 2)} ${dx} -${h}"/>`,
      );
    }
    tufts.push(`<g stroke="${pick(['#2F7A3D', '#3B8F48', '#256B33'])}">${blades.join('')}</g>`);
  }
  return `<g class="grass" stroke-width="3" stroke-linecap="round" fill="none">${tufts.join('')}</g>`;
}

/** Cena original de rota ao entardecer: céu, sol, nuvens, pássaros, colinas e grama. */
export function bannerScene(): string {
  return `<svg class="scene" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A3D"/><stop offset=".55" stop-color="#FFB45C"/><stop offset="1" stop-color="#FFE3A3"/></linearGradient></defs>
  <rect width="1200" height="260" fill="url(#sky)"/>
  <g class="sun"><circle cx="930" cy="150" r="70" fill="#FFF3C4" opacity=".55"/><circle cx="930" cy="150" r="48" fill="#FFF8DD"/></g>
  <g class="clouds c1" fill="#fff" opacity=".75"><ellipse cx="160" cy="70" rx="70" ry="18"/><ellipse cx="205" cy="58" rx="42" ry="20"/><ellipse cx="560" cy="45" rx="56" ry="14"/><ellipse cx="595" cy="36" rx="32" ry="15"/></g>
  <g class="clouds c2" fill="#fff" opacity=".5"><ellipse cx="820" cy="80" rx="80" ry="16"/><ellipse cx="300" cy="110" rx="50" ry="10"/></g>
  <g class="birds" fill="none" stroke="#7A3B1E" stroke-width="2.4" stroke-linecap="round"><path d="M0 0 q6 -6 12 0 q6 -6 12 0"/><path d="M34 14 q5 -5 10 0 q5 -5 10 0"/></g>
  <path d="M0 190 C180 140 330 150 480 175 S800 150 960 170 S1150 160 1200 168 V260 H0Z" fill="#E86A2E" opacity=".55"/>
  <path d="M0 205 C220 175 420 200 620 192 S980 175 1200 196 V260 H0Z" fill="#4FA35C"/>
  <path d="M0 228 C260 210 520 232 760 222 S1060 212 1200 226 V260 H0Z" fill="#3C8A4A"/>
  <path d="M560 260 C600 236 640 226 700 222 L720 222 C690 230 668 242 660 260Z" fill="#E9C98A" opacity=".85"/>
  ${grassTufts()}
</svg>`;
}
