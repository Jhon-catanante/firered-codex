/**
 * Roteiro do detonado, etapa por etapa (ids de CHAPTERS em @/domain/journey).
 * Conteúdo curado: objetivos na ordem do jogo e o que o jogador ganha em cada etapa.
 * Ids de passo são estáveis porque o progresso marcado pelo jogador é salvo por id.
 */
export type GainKind = 'badge' | 'hm' | 'item' | 'pokemon';

export interface Step {
  id: string;
  text: string;
  tip?: string;
}

export interface ChapterGuide {
  chapter: number;
  intro: string;
  steps: Step[];
  gains: { name: string; kind: GainKind }[];
}

export const GUIDE: readonly ChapterGuide[] = [
  {
    chapter: 0,
    intro:
      'Do quarto em Pallet Town até a primeira insígnia. Etapa curta: o foco é montar um time que aguente Pedra.',
    steps: [
      {
        id: 'c0-starter',
        text: 'Escolha o inicial no laboratório do Prof. Oak e vença a primeira batalha contra o rival.',
        tip: 'Bulbasaur e Squirtle facilitam o começo: os dois primeiros ginásios são de Pedra e Água.',
      },
      {
        id: 'c0-parcel',
        text: 'Em Viridian City, pegue a encomenda no Poké Mart e entregue ao Prof. Oak para receber a Pokédex.',
      },
      {
        id: 'c0-route22',
        text: 'Na Rota 22, o rival desafia de novo. Opcional, mas boa experiência.',
      },
      {
        id: 'c0-forest',
        text: 'Atravesse a Viridian Forest. Pikachu aparece com 5% de chance.',
        tip: 'Em FireRed, capture um Mankey na Rota 22: golpes de Lutador vencem o Brock. Em LeafGreen, evolua um Caterpie: o Butterfree aprende Confusion no nível 10.',
      },
      { id: 'c0-brock', text: 'Vença o Brock em Pewter City.' },
    ],
    gains: [
      { name: 'Pokédex', kind: 'item' },
      { name: 'Insígnia Boulder', kind: 'badge' },
      { name: 'TM39 Rock Tomb', kind: 'item' },
    ],
  },
  {
    chapter: 1,
    intro:
      'A primeira caverna de verdade e o ginásio de Água. Leve Repels e Poké Balls para o Mt. Moon.',
    steps: [
      {
        id: 'c1-magikarp',
        text: 'No Pokémon Center da Rota 4, um vendedor oferece um Magikarp por 500.',
        tip: 'Vale a compra: no nível 20 ele vira Gyarados.',
      },
      {
        id: 'c1-moon',
        text: 'Cruze o Mt. Moon, enfrente a Equipe Rocket e escolha entre o Dome Fossil (Kabuto) e o Helix Fossil (Omanyte).',
      },
      {
        id: 'c1-misty',
        text: 'Vença a Misty em Cerulean City.',
        tip: 'Elétrico ou Grama: Pikachu, Oddish (FireRed) e Bellsprout (LeafGreen) resolvem.',
      },
    ],
    gains: [
      { name: 'Insígnia Cascade', kind: 'badge' },
      { name: 'TM03 Water Pulse', kind: 'item' },
      { name: 'Fóssil Dome ou Helix', kind: 'item' },
    ],
  },
  {
    chapter: 2,
    intro: 'Ponte Nugget, a casa do Bill e o navio S.S. Anne. Aqui você ganha a primeira HM.',
    steps: [
      {
        id: 'c2-nugget',
        text: 'Na Ponte Nugget (Rota 24), o rival desafia e depois vem a sequência de cinco treinadores.',
      },
      { id: 'c2-bill', text: 'Ajude o Bill na Rota 25 e ganhe o S.S. Ticket.' },
      {
        id: 'c2-dig',
        text: 'Na casa assaltada de Cerulean, vença o recruta da Rocket e pegue a TM28 Dig.',
      },
      {
        id: 'c2-voucher',
        text: 'Em Vermilion, fale com o presidente do Fã-Clube Pokémon para ganhar o Bike Voucher (troque pela bicicleta em Cerulean).',
      },
      {
        id: 'c2-anne',
        text: 'No S.S. Anne, vença o rival e ajude o capitão para receber a HM01 Cut.',
      },
      {
        id: 'c2-surge',
        text: 'Corte a árvore do ginásio de Vermilion, resolva as lixeiras e vença o Lt. Surge.',
        tip: "Diglett e Dugtrio (Diglett's Cave, logo ao lado) não levam dano Elétrico.",
      },
    ],
    gains: [
      { name: 'S.S. Ticket', kind: 'item' },
      { name: 'HM01 Cut', kind: 'hm' },
      { name: 'Bicicleta', kind: 'item' },
      { name: 'Insígnia Thunder', kind: 'badge' },
      { name: 'TM34 Shock Wave', kind: 'item' },
    ],
  },
  {
    chapter: 3,
    intro: 'Rock Tunnel no escuro, Lavender Town e a maior cidade de Kanto, Celadon.',
    steps: [
      {
        id: 'c3-flash',
        text: 'Com 10 espécies registradas, o assistente do Prof. Oak na Rota 2 entrega a HM05 Flash.',
        tip: 'Dá para cruzar o Rock Tunnel sem Flash, mas é bem mais difícil.',
      },
      {
        id: 'c3-tunnel',
        text: 'Siga pelas Rotas 9 e 10 e atravesse o Rock Tunnel até Lavender Town.',
      },
      {
        id: 'c3-celadon',
        text: 'Vá para oeste pela Rota 8 e pela passagem subterrânea até Celadon City.',
      },
      {
        id: 'c3-mansion',
        text: 'Na Celadon Mansion, pegue o Eevee (entrada dos fundos) e ganhe o Tea da senhora no térreo.',
        tip: 'O Tea libera a entrada de Saffron City mais adiante.',
      },
      { id: 'c3-erika', text: 'Vença a Erika no ginásio de Celadon.' },
    ],
    gains: [
      { name: 'HM05 Flash', kind: 'hm' },
      { name: 'Eevee', kind: 'pokemon' },
      { name: 'Tea', kind: 'item' },
      { name: 'Insígnia Rainbow', kind: 'badge' },
      { name: 'TM19 Giga Drain', kind: 'item' },
    ],
  },
  {
    chapter: 4,
    intro:
      'Desmonte o esconderijo da Rocket, liberte a Pokémon Tower e chegue a Fuchsia pela Safari Zone.',
    steps: [
      {
        id: 'c4-hideout',
        text: 'No Game Corner de Celadon, ache o interruptor atrás do pôster, desça ao Rocket Hideout e vença o Giovanni.',
      },
      {
        id: 'c4-tower',
        text: 'Com o Silph Scope, suba a Pokémon Tower, vença o rival, acalme o fantasma no topo e resgate o Mr. Fuji.',
      },
      {
        id: 'c4-snorlax',
        text: 'Use a Poké Flute para acordar um dos Snorlax (Rotas 12 e 16). Salve antes: ele está no nível 30.',
      },
      { id: 'c4-fly', text: 'Na Rota 16, uma casa escondida atrás de uma árvore dá a HM02 Fly.' },
      {
        id: 'c4-safari',
        text: 'Em Fuchsia, explore a Safari Zone: a Secret House dá a HM03 Surf e o Gold Teeth troca-se pela HM04 Strength com o guarda.',
      },
      {
        id: 'c4-koga',
        text: 'Vença o Koga no ginásio de paredes invisíveis de Fuchsia.',
        tip: 'Psíquico e Terrestre funcionam bem; leve cura para envenenamento.',
      },
    ],
    gains: [
      { name: 'Silph Scope', kind: 'item' },
      { name: 'Poké Flute', kind: 'item' },
      { name: 'HM02 Fly', kind: 'hm' },
      { name: 'HM03 Surf', kind: 'hm' },
      { name: 'HM04 Strength', kind: 'hm' },
      { name: 'Insígnia Soul', kind: 'badge' },
      { name: 'TM06 Toxic', kind: 'item' },
    ],
  },
  {
    chapter: 5,
    intro:
      'Saffron City, a Silph Co. tomada pela Rocket e os mares do sul com os primeiros lendários.',
    steps: [
      { id: 'c5-tea', text: 'Dê o Tea ao guarda para entrar em Saffron City.' },
      {
        id: 'c5-silph',
        text: 'Liberte a Silph Co.: ache o Card Key, vença o rival e o Giovanni. O presidente dá a Master Ball e um funcionário no 7º andar dá um Lapras.',
      },
      { id: 'c5-dojo', text: 'Vença o Fighting Dojo e escolha entre Hitmonlee e Hitmonchan.' },
      {
        id: 'c5-sabrina',
        text: 'Vença a Sabrina, usando os teleportes do ginásio.',
        tip: 'Os Psíquicos dela têm Atq. Esp. alto e Defesa baixa: use golpes físicos fortes. Inseto e Fantasma são super efetivos.',
      },
      {
        id: 'c5-legends',
        text: 'Com Surf e Strength: Zapdos na Power Plant (Rota 10) e Articuno no fundo das Seafoam Islands.',
        tip: 'Guarde a Master Ball. Veja a aba Lendários para a chance de captura.',
      },
    ],
    gains: [
      { name: 'Master Ball', kind: 'item' },
      { name: 'Lapras', kind: 'pokemon' },
      { name: 'Hitmonlee ou Hitmonchan', kind: 'pokemon' },
      { name: 'Insígnia Marsh', kind: 'badge' },
      { name: 'TM04 Calm Mind', kind: 'item' },
    ],
  },
  {
    chapter: 6,
    intro: 'A ilha vulcânica de Cinnabar, com a mansão abandonada e o laboratório de fósseis.',
    steps: [
      {
        id: 'c6-surf',
        text: 'Chegue a Cinnabar Island surfando pela Rota 21 (sul de Pallet) ou pela Rota 20.',
      },
      {
        id: 'c6-mansion',
        text: 'Explore a Pokémon Mansion e pegue a Secret Key que abre o ginásio.',
      },
      {
        id: 'c6-lab',
        text: 'No Cinnabar Lab, ressuscite o fóssil do Mt. Moon e o Old Amber do museu de Pewter (vira Aerodactyl).',
      },
      {
        id: 'c6-blaine',
        text: 'Responda o quiz do ginásio e vença o Blaine.',
        tip: 'Água e Terrestre. Lapras e Gyarados brilham aqui.',
      },
    ],
    gains: [
      { name: 'Secret Key', kind: 'item' },
      { name: 'Insígnia Volcano', kind: 'badge' },
      { name: 'TM38 Fire Blast', kind: 'item' },
    ],
  },
  {
    chapter: 7,
    intro: 'A primeira visita às Ilhas Sevii com o Bill, e a volta para enfrentar o último líder.',
    steps: [
      {
        id: 'c7-sevii',
        text: 'Depois do Blaine, o Bill leva você até a One Island. Ajude o Celio com a rede de trocas.',
      },
      {
        id: 'c7-ember',
        text: 'No Mt. Ember (Kindle Road), enfrente a Equipe Rocket. No topo está o Moltres.',
      },
      {
        id: 'c7-three',
        text: 'Na Three Island, expulse os motoqueiros e ache a Lostelle na Berry Forest.',
      },
      {
        id: 'c7-giovanni',
        text: 'Volte a Kanto: o ginásio de Viridian abre com sete insígnias. Vença o Giovanni.',
        tip: 'Água, Grama e Gelo. O Rhyhorn leva 4× de Água e de Grama; o resto do time leva 2×.',
      },
    ],
    gains: [
      { name: 'Insígnia Earth', kind: 'badge' },
      { name: 'TM26 Earthquake', kind: 'item' },
    ],
  },
  {
    chapter: 8,
    intro:
      'A última batalha contra o rival, as checagens de insígnias e a Liga Pokémon. São cinco lutas seguidas.',
    steps: [
      { id: 'c8-rival', text: 'Na Rota 22, o rival faz a última batalha antes da Liga.' },
      {
        id: 'c8-victory',
        text: 'Passe pelos portões da Rota 23 e resolva os enigmas de Strength da Victory Road.',
      },
      {
        id: 'c8-prep',
        text: 'Antes de entrar, encha a mochila de Full Restore, Revive e Ethers: não dá para voltar ao Pokémon Center.',
        tip: 'Nível 55 a 60 no time principal deixa a Liga confortável.',
      },
      { id: 'c8-league', text: 'Vença Lorelei, Bruno, Agatha, Lance e o Campeão.' },
    ],
    gains: [{ name: 'Hall da Fama', kind: 'item' }],
  },
  {
    chapter: 9,
    intro:
      'O jogo continua: Pokédex Nacional, as outras Ilhas Sevii, os cães lendários e o Mewtwo.',
    steps: [
      {
        id: 'c9-national',
        text: 'Com 60 espécies vistas, o Prof. Oak atualiza a Pokédex para a Nacional.',
      },
      {
        id: 'c9-islands',
        text: 'Volte às Ilhas Sevii: as Ilhas 4 a 7 se abrem e a história do Sapphire continua.',
      },
      {
        id: 'c9-beasts',
        text: 'Raikou, Entei ou Suicune começa a vagar por Kanto, de acordo com o inicial escolhido.',
        tip: 'Ele foge no primeiro turno: use Mean Look ou Block, ou a Master Ball.',
      },
      {
        id: 'c9-mewtwo',
        text: 'Ao terminar a história das ilhas, entre na Cerulean Cave e capture o Mewtwo (nível 70).',
      },
      { id: 'c9-rematch', text: 'Enfrente a revanche da Elite Four, com times de nível 60 a 75.' },
    ],
    gains: [
      { name: 'Pokédex Nacional', kind: 'item' },
      { name: 'Mewtwo', kind: 'pokemon' },
    ],
  },
];

export const ALL_STEP_IDS: readonly string[] = GUIDE.flatMap((g) => g.steps.map((s) => s.id));
