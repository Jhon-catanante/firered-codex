import { POKEMON_IDS, getPokemon } from '@/data';
import { esc, pad3 } from './dom';

/** Opções de <select> com todos os Pokémon. */
export const pokemonOptions = (selected: number): string =>
  POKEMON_IDS.map(
    (i) =>
      `<option value="${i}" ${i === selected ? 'selected' : ''}>#${pad3(i)} ${esc(getPokemon(i).name)}</option>`,
  ).join('');
