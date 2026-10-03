import type { TypeName } from '@/types';

/**
 * Ambientes originais por tipo, usados como "foto" de cada Pokémon. O céu vem do CSS
 * (.env-<tipo>), o que evita ids de gradiente repetidos nos 386 cards. Elementos com as
 * classes fx-* só animam na ficha e no hover do card (ver styles/components/environment.css).
 */
const SCENES: Record<TypeName, string> = {
  normal: `
    <circle cx="162" cy="26" r="11" fill="#FFF6D6"/>
    <g fill="#fff" opacity=".85" class="fx-drift"><ellipse cx="40" cy="22" rx="18" ry="5"/><ellipse cx="52" cy="18" rx="10" ry="6"/><ellipse cx="120" cy="30" rx="14" ry="4"/></g>
    <path d="M0 64c30-10 58-10 92-2s70 6 108-6v44H0z" fill="#9CCB6B"/>
    <path d="M0 78c40-8 80-4 120 2s60 2 80-4v24H0z" fill="#7DB552"/>
    <path d="M86 100c8-14 16-22 30-26h8c-12 6-18 14-20 26z" fill="#E7D3A0"/>
    <g stroke="#8A6A45" stroke-width="2" stroke-linecap="round"><path d="M18 80v-12M32 79v-12M46 78v-12M14 72h36"/></g>
    <g fill="#5E9A3C"><circle cx="160" cy="86" r="5"/><circle cx="168" cy="84" r="6"/><circle cx="176" cy="87" r="4"/></g>`,
  fire: `
    <path d="M40 100 92 30h16l52 70z" fill="#5A2A1E"/>
    <path d="M92 30h16l-4 10-4-4-4 6-4-6z" fill="#FF9A2E"/>
    <path d="M96 38c2 14-6 26-2 40 3 10 10 14 8 22h-6c2-8-6-12-6-24 0-14 6-24 6-38z" fill="#FF6A1A" opacity=".9"/>
    <ellipse cx="100" cy="27" rx="16" ry="6" fill="#FFB347" opacity=".6" class="fx-pulse"/>
    <path d="M0 100V82l22-8 18 6 20-4v24zM140 100V78l20 4 18-8 22 6v20z" fill="#2E1A16"/>
    <path d="M0 96c40-4 80-6 120-2s60 2 80 0v6H0z" fill="#FF7A2E" opacity=".75"/>
    <g fill="#FFC56B" class="fx-rise"><circle cx="70" cy="70" r="1.6"/><circle cx="128" cy="62" r="1.3"/><circle cx="112" cy="80" r="1.1"/><circle cx="84" cy="54" r="1.2"/><circle cx="150" cy="74" r="1.4"/></g>`,
  water: `
    <circle cx="150" cy="30" r="12" fill="#FFF3C4"/>
    <path d="M140 46h20l-4 4h-12z" fill="#FFF3C4" opacity=".4"/>
    <path d="M0 52h200v48H0z" fill="#2F78D8"/>
    <g fill="none" stroke-linecap="round" class="fx-wave">
      <path d="M-20 58q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" stroke="#7FB8FF" stroke-width="2.4"/>
      <path d="M-10 70q10-5 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0" stroke="#5A9CF2" stroke-width="2.4"/>
    </g>
    <path d="M0 82q25-8 50 0t50 0 50 0 50 0v18H0z" fill="#1F5BB0"/>
    <g fill="#CDE6FF" opacity=".8" class="fx-rise"><circle cx="40" cy="92" r="2"/><circle cx="46" cy="86" r="1.3"/><circle cx="130" cy="94" r="1.8"/><circle cx="170" cy="88" r="1.2"/></g>`,
  electric: `
    <g fill="#4A4F6E"><ellipse cx="50" cy="20" rx="40" ry="12"/><ellipse cx="120" cy="16" rx="46" ry="12"/><ellipse cx="180" cy="22" rx="30" ry="10"/></g>
    <path d="M118 22 104 50h10l-8 26 22-34h-11l9-20z" fill="#FFE14D" class="fx-flash"/>
    <g stroke="#2B2E44" stroke-width="2.2" fill="none"><path d="M30 100 40 46l10 54M34 76h12M36 62h8M40 46l-14 6M40 46l14 6"/><path d="M160 100l10-54 10 54M164 76h12M166 62h8M170 46l-14 6M170 46l14 6"/></g>
    <path d="M26 52q72 18 144 0" stroke="#2B2E44" stroke-width="1.2" fill="none"/>
    <path d="M0 88c50-6 100-6 200 0v12H0z" fill="#3A3F5C"/>
    <g fill="#FFE14D" class="fx-twinkle"><circle cx="70" cy="70" r="1.2"/><circle cx="140" cy="64" r="1"/><circle cx="96" cy="84" r="1.2"/></g>`,
  grass: `
    <g fill="#FFF7C2" opacity=".35"><path d="M120 0h14L96 100H70z"/><path d="M150 0h8l-30 100h-14z"/></g>
    <g fill="#2E7A3A"><path d="M-6 100 14 40l20 60z"/><path d="M150 100l22-66 22 66z"/></g>
    <g fill="#3E9B4F"><path d="M20 100 40 52l20 48z"/><path d="M124 100l18-46 18 46z"/><path d="M176 100l14-34 14 34z"/></g>
    <path d="M0 86c40-8 80-6 120 0s60 2 80-2v16H0z" fill="#58B04E"/>
    <g fill="#7FD06A"><ellipse cx="74" cy="88" rx="12" ry="5"/><ellipse cx="96" cy="92" rx="10" ry="4"/></g>
    <g fill="#B8F28E" class="fx-rise"><path d="M84 60l3 2-3 2-3-2z"/><path d="M110 50l3 2-3 2-3-2z"/><path d="M66 70l3 2-3 2-3-2z"/></g>`,
  ice: `
    <g fill="#EAF6FF"><path d="M-10 100 40 34l24 30 30-44 40 50 24-22 52 52z"/></g>
    <g fill="#B9DDF2"><path d="M40 34l-14 28 14-8 10 6z"/><path d="M94 20l-16 34 16-10 12 8z"/></g>
    <path d="M0 84c40-6 80-4 120 0s60 2 80-2v18H0z" fill="#D7EEFB"/>
    <g fill="#9FD3EE"><path d="M0 0h200v4l-6 10-4-10-6 14-6-14-5 9-5-9-8 16-6-16-5 8-6-8-7 13-6-13-6 10-6-10-6 12-5-12-6 9-6-9-8 15-5-15-6 10-6-10-7 12-5-12-6 8-6-8-7 14-6-14-6 10-5-10-6 9-6-9-8 12-6-12z" opacity=".8"/></g>
    <g fill="#fff" class="fx-fall"><circle cx="30" cy="30" r="1.5"/><circle cx="70" cy="44" r="1.2"/><circle cx="110" cy="34" r="1.6"/><circle cx="150" cy="50" r="1.2"/><circle cx="182" cy="36" r="1.4"/><circle cx="56" cy="62" r="1.1"/></g>`,
  fighting: `
    <circle cx="100" cy="58" r="26" fill="#FFB36B" opacity=".9" class="fx-pulse"/>
    <path d="M-10 100 30 54l22 20 30-36 36 40 26-24 30 26 36-30v50z" fill="#7A3B2E"/>
    <path d="M40 66h64l-8-10H48z" fill="#3A1F1A"/><rect x="50" y="66" width="44" height="22" fill="#5E3324"/><rect x="66" y="72" width="12" height="16" fill="#2A1612"/>
    <path d="M0 88h200v12H0z" fill="#B88A5A"/>
    <g fill="#8A5A34"><rect x="140" y="62" width="8" height="28" rx="2"/><rect x="134" y="68" width="20" height="4" rx="2"/><rect x="134" y="78" width="20" height="4" rx="2"/></g>`,
  poison: `
    <circle cx="160" cy="24" r="10" fill="#E8D7FF" opacity=".7"/>
    <g fill="#3D2A4A"><path d="M20 100V48l-8-10M20 60l10-12M20 72 8 62" stroke="#3D2A4A" stroke-width="4" fill="none"/><path d="M170 100V56l8-12M170 70l-10-8" stroke="#3D2A4A" stroke-width="4" fill="none"/></g>
    <path d="M0 76c30-6 70-6 100 0s70 6 100 0v24H0z" fill="#6B3D82"/>
    <path d="M10 88c40-6 90-6 180 0v12H10z" fill="#9A4FB8"/>
    <g fill="#C67BE8" class="fx-rise"><circle cx="60" cy="84" r="3"/><circle cx="68" cy="78" r="1.8"/><circle cx="120" cy="86" r="2.6"/><circle cx="128" cy="80" r="1.4"/><circle cx="96" cy="90" r="2"/></g>
    <g fill="#5A2E6E" opacity=".6"><ellipse cx="80" cy="70" rx="40" ry="6"/></g>`,
  ground: `
    <circle cx="40" cy="26" r="12" fill="#FFE7A3"/>
    <path d="M100 100V44h38v8h10v48z" fill="#B66A36"/><path d="M100 44h38l-4 6h-30z" fill="#D6894B"/>
    <path d="M150 100V60h30v40z" fill="#9A5530"/><path d="M0 100V66h26v-6h20v40z" fill="#A85E33"/>
    <path d="M0 84c50-8 100-8 200 0v16H0z" fill="#E0A964"/>
    <g stroke="#B8803F" stroke-width="1.2" fill="none"><path d="M40 94l8-4 6 4 10-3M120 96l6-3 8 3 6-2"/></g>
    <g fill="#F2C88A" opacity=".6" class="fx-drift"><ellipse cx="70" cy="76" rx="20" ry="2"/><ellipse cx="160" cy="80" rx="16" ry="1.6"/></g>`,
  flying: `
    <circle cx="160" cy="24" r="12" fill="#FFF6D6"/>
    <g fill="#fff" class="fx-drift"><ellipse cx="40" cy="40" rx="30" ry="8"/><ellipse cx="58" cy="34" rx="16" ry="9"/><ellipse cx="130" cy="58" rx="34" ry="8"/><ellipse cx="150" cy="52" rx="18" ry="9"/></g>
    <path d="M0 84c20-8 40-8 60 0s40 8 60 0 40-8 80 0v16H0z" fill="#fff" opacity=".95"/>
    <path d="M0 92c30-6 60-6 100 0s70 6 100 0v8H0z" fill="#E6F0FF"/>
    <g fill="none" stroke="#4A5A8A" stroke-width="1.8" stroke-linecap="round" class="fx-fly"><path d="M80 24q4-4 8 0q4-4 8 0"/><path d="M100 32q3-3 6 0q3-3 6 0"/></g>`,
  psychic: `
    <g fill="#fff" class="fx-twinkle"><circle cx="20" cy="18" r="1"/><circle cx="60" cy="10" r="1.2"/><circle cx="90" cy="28" r=".9"/><circle cx="140" cy="14" r="1.1"/><circle cx="180" cy="30" r="1"/><circle cx="34" cy="46" r=".8"/></g>
    <circle cx="150" cy="34" r="14" fill="#FFD6F0"/><circle cx="156" cy="30" r="12" fill="#5B2C7A" opacity=".55"/>
    <g fill="none" stroke="#FFB0E0" stroke-width="1.4" opacity=".7" class="fx-spin"><ellipse cx="70" cy="50" rx="34" ry="10"/><ellipse cx="70" cy="50" rx="22" ry="34" opacity=".5"/></g>
    <g fill="#F2A3D8"><rect x="26" y="58" width="8" height="34"/><rect x="106" y="58" width="8" height="34"/><rect x="22" y="54" width="16" height="5"/><rect x="102" y="54" width="16" height="5"/></g>
    <path d="M70 42l6 8-6 8-6-8z" fill="#FFE0F4" class="fx-float"/>
    <path d="M0 90h200v10H0z" fill="#7A3A8F"/>`,
  bug: `
    <g fill="#3E7A28"><path d="M-10 100C10 60 30 40 60 34c-14 20-20 40-22 66z"/><path d="M210 100c-18-36-40-56-70-60 12 18 16 38 16 60z"/></g>
    <g fill="#5FA83A"><path d="M20 100c6-30 20-46 40-52-8 16-12 32-12 52z"/><path d="M190 100c-6-24-18-38-34-44 6 14 8 28 8 44z"/></g>
    <g><rect x="92" y="78" width="6" height="16" fill="#F2E3C2"/><ellipse cx="95" cy="78" rx="14" ry="7" fill="#D9473A"/><g fill="#fff"><circle cx="90" cy="76" r="1.6"/><circle cx="99" cy="75" r="1.3"/></g></g>
    <path d="M0 92c50-4 100-4 200 0v8H0z" fill="#4A8A2E"/>
    <g fill="#F7FF9A" class="fx-twinkle"><circle cx="60" cy="54" r="1.6"/><circle cx="130" cy="44" r="1.4"/><circle cx="150" cy="70" r="1.2"/><circle cx="76" cy="70" r="1.1"/></g>`,
  rock: `
    <path d="M-10 100 20 40l24 16 18-28 26 34 20-14 30 30 24-22 30 26 28-12v30z" fill="#8F7D5A"/>
    <path d="M20 40l-8 22 14-4zM62 28l-6 26 14-6z" fill="#B5A27A"/>
    <g fill="#6E5E44"><ellipse cx="40" cy="92" rx="22" ry="10"/><ellipse cx="150" cy="94" rx="28" ry="10"/></g>
    <g fill="#A99630"><path d="M100 100l6-22 8 22z"/><path d="M110 100l4-14 6 14z"/></g>
    <path d="M0 96h200v4H0z" fill="#5A4C36"/>
    <g fill="#E9E1C8" opacity=".7" class="fx-twinkle"><path d="M106 82l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/></g>`,
  ghost: `
    <circle cx="150" cy="26" r="12" fill="#E8E2FF"/>
    <g fill="#fff" class="fx-twinkle"><circle cx="30" cy="16" r=".9"/><circle cx="80" cy="10" r="1"/><circle cx="110" cy="24" r=".8"/><circle cx="182" cy="12" r="1"/></g>
    <path d="M86 100V40l8-12 8 12v60z" fill="#2A2140"/><path d="M90 50h8v6h-8zM90 64h8v6h-8z" fill="#F2C94C" opacity=".7"/>
    <path d="M0 86c50-6 100-6 200 0v14H0z" fill="#2E2645"/>
    <g fill="#5A4E7A"><path d="M22 90v-10a6 6 0 0 1 12 0v10z"/><path d="M48 92v-8a5 5 0 0 1 10 0v8z"/><path d="M140 90v-11a6 6 0 0 1 12 0v11z"/><path d="M166 92v-8a5 5 0 0 1 10 0v8z"/></g>
    <g fill="#B9A6FF" opacity=".75" class="fx-float"><circle cx="60" cy="58" r="3"/><circle cx="128" cy="50" r="2.4"/><circle cx="160" cy="64" r="2"/></g>`,
  dragon: `
    <g fill="none" stroke-width="5" stroke-linecap="round" opacity=".55" class="fx-wave"><path d="M0 22q50-14 100 0t100 0" stroke="#7FFFD4"/><path d="M0 32q50-12 100 0t100 0" stroke="#B48CFF"/></g>
    <path d="M10 100 30 30l12 70z" fill="#3B2A7A"/><path d="M60 100l24-80 16 80z" fill="#4A35A0"/><path d="M150 100l20-62 14 62z" fill="#3B2A7A"/>
    <path d="M84 20l-6 30 10-10z" fill="#7A63E0"/>
    <g fill="#fff" opacity=".55" class="fx-drift"><ellipse cx="40" cy="74" rx="40" ry="6"/><ellipse cx="150" cy="80" rx="46" ry="6"/></g>
    <path d="M0 90c60-6 120-6 200 0v10H0z" fill="#2A1E5C"/>`,
  dark: `
    <path d="M150 14a14 14 0 1 0 10 24 12 12 0 1 1-10-24z" fill="#F4E9C8"/>
    <g fill="#fff" class="fx-twinkle"><circle cx="24" cy="14" r="1"/><circle cx="60" cy="24" r=".8"/><circle cx="100" cy="12" r="1.1"/><circle cx="184" cy="40" r=".9"/></g>
    <g fill="#1A1622"><path d="M-6 100 10 52l16 48z"/><path d="M18 100l14-38 14 38z"/><path d="M160 100l16-46 16 46z"/><path d="M182 100l12-30 12 30z"/></g>
    <path d="M0 88c50-6 100-6 200 0v12H0z" fill="#241E2E"/>
    <g fill="#FFCF4D" class="fx-blink"><circle cx="64" cy="80" r="1.4"/><circle cx="70" cy="80" r="1.4"/><circle cx="130" cy="76" r="1.2"/><circle cx="135" cy="76" r="1.2"/></g>`,
  steel: `
    <g fill="#5C6680"><rect x="10" y="40" width="26" height="60"/><rect x="40" y="56" width="20" height="44"/><rect x="150" y="30" width="22" height="70"/><rect x="176" y="50" width="24" height="50"/></g>
    <rect x="22" y="22" width="6" height="18" fill="#5C6680"/><rect x="158" y="14" width="6" height="16" fill="#5C6680"/>
    <g fill="#C9D3E6" opacity=".7"><rect x="15" y="48" width="5" height="5"/><rect x="25" y="48" width="5" height="5"/><rect x="15" y="60" width="5" height="5"/><rect x="155" y="40" width="5" height="5"/><rect x="163" y="52" width="5" height="5"/></g>
    <g class="fx-spin" style="transform-origin:100px 66px"><circle cx="100" cy="66" r="18" fill="#8F99B2"/><circle cx="100" cy="66" r="7" fill="#5C6680"/><g fill="#8F99B2"><rect x="96" y="42" width="8" height="8"/><rect x="96" y="82" width="8" height="8"/><rect x="76" y="62" width="8" height="8"/><rect x="116" y="62" width="8" height="8"/></g></g>
    <path d="M0 92h200v8H0z" fill="#3E465A"/>`,
};

/** Cenário do tipo primário do Pokémon. */
export const typeEnvironment = (type: TypeName, extraClass = ''): string =>
  `<svg class="env env-${type}${extraClass ? ` ${extraClass}` : ''}" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${SCENES[type]}</svg>`;

export const ENVIRONMENT_TYPES = Object.keys(SCENES) as TypeName[];
