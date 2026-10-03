/** Times sugeridos para zerar FireRed. Membros indisponíveis na versão são removidos na hora. */
export interface TeamPreset {
  name: string;
  why: string;
  members: string[];
  /** Pós-jogo: permite Pokémon que só se obtém por troca. */
  postGame?: boolean;
}

export const TEAM_PRESETS: readonly TeamPreset[] = [
  {
    name: 'Charmander — chama e equilíbrio',
    why: 'Charizard começa sofrendo contra Brock e Misty, então Nidoking (golpes Terrestre/Lutador) e Gyarados seguram o começo. Lapras e Jolteon fecham a Liga contra Lance e o Gyarados do rival.',
    members: ['Charizard', 'Nidoking', 'Gyarados', 'Jolteon', 'Lapras', 'Snorlax'],
  },
  {
    name: 'Squirtle — o mais fácil',
    why: 'Blastoise domina Brock e Blaine. Exeggutor e Raichu cobrem os aquáticos; Dragonite vira o atacante principal no pós-jogo.',
    members: ['Blastoise', 'Exeggutor', 'Raichu', 'Snorlax', 'Dragonite', 'Arcanine', 'Ninetales'],
  },
  {
    name: 'Bulbasaur — controle de status',
    why: 'Venusaur com Sleep Powder + Leech Seed carrega as duas primeiras insígnias sozinho. Os outros cobrem Fogo, Voador e Psíquico, que são o problema da planta.',
    members: ['Venusaur', 'Gyarados', 'Raichu', 'Lapras', 'Dugtrio', 'Arcanine', 'Ninetales'],
  },
  {
    name: 'Pós-jogo (com trocas)',
    why: 'Para Sevii, Trainer Tower e revanches: os mais fortes de Kanto, incluindo evoluções por troca. Gengar e Alakazam aproveitam a velocidade; Snorlax e Dragonite seguram físico.',
    members: ['Alakazam', 'Gengar', 'Snorlax', 'Dragonite', 'Starmie', 'Zapdos'],
    postGame: true,
  },
];
