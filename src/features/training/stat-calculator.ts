import { NATURES, getPokemon } from '@/data';
import { STAT_KEYS, STAT_LABEL } from '@/domain/constants';
import { recommend } from '@/domain/moveset';
import { MAX_STAT_EVS, MAX_TOTAL_EVS, calcStat } from '@/domain/stats';
import type { StatKey, Stats } from '@/types';
import { byId, delegate, esc } from '@/ui/dom';
import { pokemonOptions } from '@/ui/pokemon-options';

interface CalcState {
  pokemon: number;
  level: number;
  nature: string;
  iv: Stats;
  ev: Stats;
}

const full = (v: number): Stats => ({ hp: v, atk: v, def: v, spa: v, spd: v, spe: v });

const state: CalcState = {
  pokemon: 6,
  level: 50,
  nature: 'Modest',
  iv: full(31),
  ev: { hp: 4, atk: 0, def: 0, spa: 252, spd: 0, spe: 252 },
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function render(): void {
  const p = getPokemon(state.pokemon);
  const total = STAT_KEYS.reduce((s, k) => s + state.ev[k], 0);
  const nature = NATURES.find((n) => n.name === state.nature);
  const tone = (k: StatKey) =>
    !nature || nature.up === nature.down
      ? ''
      : nature.up === k
        ? 'up'
        : nature.down === k
          ? 'down'
          : '';
  const rows = STAT_KEYS.map((k) => {
    const value = calcStat(k, {
      base: p.baseStats[k],
      iv: state.iv[k],
      ev: state.ev[k],
      level: state.level,
      nature: state.nature,
    });
    const cls = tone(k);
    return `<span class="${cls}" style="font-weight:600">${STAT_LABEL[k]}</span><input type="number" min="0" max="31" data-iv="${k}" value="${state.iv[k]}" aria-label="IV ${STAT_LABEL[k]}"><input type="number" min="0" max="252" step="4" data-ev="${k}" value="${state.ev[k]}" aria-label="EV ${STAT_LABEL[k]}"><span class="out num ${cls}">${value}</span>`;
  }).join('');
  byId('calc').innerHTML = `
  <div class="calc">
    <label>Pokémon<select id="c-p">${pokemonOptions(state.pokemon)}</select></label>
    <label>Nível<input id="c-lv" type="number" min="1" max="100" value="${state.level}"></label>
    <label>Natureza<select id="c-n">${NATURES.map((n) => `<option ${n.name === state.nature ? 'selected' : ''}>${n.name}</option>`).join('')}</select></label>
    <label>Atalho<select id="c-pre"><option value="">Aplicar build…</option><option value="rec">Build recomendada</option><option value="max">IV 31, EV 0</option><option value="zero">Zerar EVs</option></select></label>
  </div>
  <div class="evgrid"><b class="note">Status</b><b class="note">IV (0–31)</b><b class="note">EV (0–252)</b><b class="note" style="text-align:right">Valor</b>${rows}</div>
  <p class="note" style="margin-top:12px">Melhores naturezas para ${esc(p.name)}: ${recommend(
    state.pokemon,
  )
    .natures.map((n, i) => `<button class="sug" data-nat="${n.name}">${i + 1}º ${n.name}</button>`)
    .join(' ')}</p>
  <p class="note" style="margin-top:6px">EVs usados: <b class="${total > MAX_TOTAL_EVS ? 'down' : ''}">${total} / ${MAX_TOTAL_EVS}</b>${total > MAX_TOTAL_EVS ? ' — acima do limite, reduza algum status.' : ''} Fórmula da Geração III: arredonda para baixo em cada etapa, natureza aplicada no fim.</p>`;
}

function applyPreset(preset: string): void {
  if (preset === 'rec') {
    const r = recommend(state.pokemon);
    state.nature = r.nature;
    for (const k of STAT_KEYS) {
      state.ev[k] = r.evs[k] ?? 0;
      state.iv[k] = 31;
    }
  } else if (preset === 'max') {
    state.iv = full(31);
    state.ev = full(0);
  } else if (preset === 'zero') {
    state.ev = full(0);
  }
}

export function mountStatCalculator(): void {
  const root = byId('calc');
  delegate(root, 'click', '[data-nat]', (b) => {
    state.nature = b.dataset.nat ?? state.nature;
    render();
  });
  root.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    if (t.id === 'c-p') state.pokemon = Number(t.value);
    else if (t.id === 'c-lv') state.level = clamp(Number(t.value) || 1, 1, 100);
    else if (t.id === 'c-n') state.nature = t.value;
    else if (t.id === 'c-pre') applyPreset(t.value);
    else if (t.dataset.iv) state.iv[t.dataset.iv as StatKey] = clamp(Number(t.value) || 0, 0, 31);
    else if (t.dataset.ev)
      state.ev[t.dataset.ev as StatKey] = clamp(Number(t.value) || 0, 0, MAX_STAT_EVS);
    else return;
    // Re-renderiza e devolve o foco ao campo editado.
    const selector = t.dataset.iv
      ? `[data-iv="${t.dataset.iv}"]`
      : t.dataset.ev
        ? `[data-ev="${t.dataset.ev}"]`
        : t.id
          ? `#${t.id}`
          : null;
    render();
    if (selector) root.querySelector<HTMLElement>(selector)?.focus();
  });
  render();
}
