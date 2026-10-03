import { POKEMON_IDS, getPokemon } from '@/data';

/** Estágios da cadeia evolutiva a partir da forma base. Cada estágio pode ter ramificações. */
export function evolutionStages(pokemonId: number): number[][] {
  let root = pokemonId;
  for (let p = getPokemon(root); p.evolvesFrom; p = getPokemon(root)) root = p.evolvesFrom;
  const chain = getPokemon(pokemonId).evolutionChain;
  const members = POKEMON_IDS.filter((id) => getPokemon(id).evolutionChain === chain);
  const stages: number[][] = [[root]];
  for (let depth = 0; depth < 3; depth++) {
    const previous = stages[depth] ?? [];
    const next = members.filter((id) => {
      const from = getPokemon(id).evolvesFrom;
      return from !== null && previous.includes(from);
    });
    if (!next.length) break;
    stages.push(next);
  }
  return stages;
}

/** Ancestrais do Pokémon, do mais próximo ao mais distante. */
export function ancestors(pokemonId: number): number[] {
  const out: number[] = [];
  for (let from = getPokemon(pokemonId).evolvesFrom; from; from = getPokemon(from).evolvesFrom) {
    out.push(from);
  }
  return out;
}

/** Concatena os métodos de evolução entre um ancestral e o Pokémon (ex.: "Nv. 16 Nv. 36"). */
export function evolutionPath(pokemonId: number, ancestor: number): string {
  const steps: string[] = [];
  let id: number | null = pokemonId;
  while (id && id !== ancestor) {
    const p = getPokemon(id);
    steps.push(p.evolutionMethod);
    id = p.evolvesFrom;
  }
  return steps.join(' ');
}
