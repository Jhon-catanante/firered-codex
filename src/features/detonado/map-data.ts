/**
 * Geometria do mapa esquemático de Kanto (desenho original, coordenadas em um viewBox 400×352).
 * Cidades e lugares apontam para o nome do lugar na aba Rotas (`place`), quando existe.
 */
import type { TypeName } from '@/types';

export type NodeKind = 'city' | 'dungeon' | 'league';
export type LabelAnchor = 'start' | 'middle' | 'end';

export interface MapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: NodeKind;
  place?: string;
  /** Ginásio da cidade (tipo e líder), quando houver. */
  gym?: { leader: string; type: TypeName };
  /** Etapa em que o jogador chega ao lugar (cidades); sem isso, usa a etapa dos encontros. */
  chapter?: number;
  /** Lado do rótulo em relação ao ponto. */
  labelAt?: 'top' | 'bottom' | 'left' | 'right';
  /** Posição exata do rótulo, quando os lados padrão colidem com rotas ou outros rótulos. */
  labelPos?: [dx: number, dy: number, anchor: LabelAnchor];
}

export interface MapRoute {
  place: string;
  label: string;
  points: [number, number][];
  water?: boolean;
  /** Onde fica o número da rota ao longo do traço (0 = início, 1 = fim). */
  tagAt?: number;
}

const city = (
  id: string,
  label: string,
  x: number,
  y: number,
  extra: Partial<MapNode> = {},
): MapNode => ({ id, label, x, y, kind: 'city', ...extra });

const dungeon = (
  id: string,
  label: string,
  x: number,
  y: number,
  place: string,
  labelAt: MapNode['labelAt'],
): MapNode => ({ id, label, x, y, kind: 'dungeon', place, labelAt });

export const MAP_NODES: readonly MapNode[] = [
  city('pallet', 'Pallet Town', 62, 255, { chapter: 0, place: 'Pallet Town', labelAt: 'right' }),
  city('viridian', 'Viridian City', 62, 178, {
    chapter: 0,
    place: 'Viridian City',
    gym: { leader: 'Giovanni', type: 'ground' },
    labelAt: 'right',
  }),
  city('pewter', 'Pewter City', 62, 62, {
    chapter: 0,
    gym: { leader: 'Brock', type: 'rock' },
    labelPos: [0, -12, 'middle'],
  }),
  city('cerulean', 'Cerulean City', 232, 62, {
    chapter: 1,
    place: 'Cerulean City',
    gym: { leader: 'Misty', type: 'water' },
    labelPos: [8, 19, 'start'],
  }),
  city('saffron', 'Saffron City', 232, 152, {
    chapter: 5,
    gym: { leader: 'Sabrina', type: 'psychic' },
    labelPos: [8, 19, 'start'],
  }),
  city('vermilion', 'Vermilion City', 232, 236, {
    chapter: 2,
    place: 'Vermilion City',
    gym: { leader: 'Lt. Surge', type: 'electric' },
    labelAt: 'bottom',
  }),
  city('celadon', 'Celadon City', 150, 152, {
    chapter: 3,
    place: 'Celadon City',
    gym: { leader: 'Erika', type: 'grass' },
    labelAt: 'top',
  }),
  city('lavender', 'Lavender Town', 332, 152, { chapter: 3, labelPos: [-6, -14, 'end'] }),
  city('fuchsia', 'Fuchsia City', 172, 290, {
    chapter: 4,
    place: 'Fuchsia City',
    gym: { leader: 'Koga', type: 'poison' },
    labelAt: 'bottom',
  }),
  city('cinnabar', 'Cinnabar Island', 62, 330, {
    chapter: 6,
    place: 'Cinnabar Island',
    gym: { leader: 'Blaine', type: 'fire' },
    labelAt: 'bottom',
  }),
  {
    id: 'indigo',
    label: 'Indigo Plateau',
    x: 18,
    y: 30,
    kind: 'league',
    chapter: 8,
    labelAt: 'right',
  },
  dungeon('forest', 'Viridian Forest', 62, 118, 'Viridian Forest', 'right'),
  dungeon('moon', 'Mt. Moon', 150, 56, 'Mount Moon', 'bottom'),
  dungeon('cave', 'Cerulean Cave', 204, 30, 'Cerulean Cave', 'left'),
  dungeon('tunnel', 'Rock Tunnel', 332, 96, 'Rock Tunnel', 'left'),
  dungeon('plant', 'Power Plant', 370, 104, 'Power Plant', 'bottom'),
  dungeon('tower', 'Pokémon Tower', 356, 172, 'Pokémon Tower', 'bottom'),
  dungeon('diglett', "Diglett's Cave", 290, 236, "Diglett's Cave", 'top'),
  dungeon('safari', 'Safari Zone', 172, 258, 'Safari Zone', 'right'),
  dungeon('seafoam', 'Seafoam Islands', 122, 330, 'Seafoam Islands', 'top'),
  {
    ...dungeon('mansion', 'Mansion', 30, 312, 'Pokémon Mansion', 'top'),
    labelPos: [-8, -10, 'start'],
  },
  dungeon('victory', 'Victory Road', 18, 84, 'Victory Road', 'right'),
];

export const MAP_ROUTES: readonly MapRoute[] = [
  {
    place: 'Rota 1',
    label: '1',
    points: [
      [62, 255],
      [62, 178],
    ],
  },
  {
    place: 'Rota 2',
    label: '2',
    points: [
      [62, 178],
      [62, 62],
    ],
  },
  {
    place: 'Rota 3',
    label: '3',
    points: [
      [62, 62],
      [150, 56],
    ],
  },
  {
    place: 'Rota 4',
    label: '4',
    points: [
      [150, 56],
      [232, 62],
    ],
  },
  {
    place: 'Rota 24',
    label: '24',
    points: [
      [232, 62],
      [232, 16],
    ],
  },
  {
    place: 'Rota 25',
    label: '25',
    points: [
      [232, 16],
      [312, 16],
    ],
  },
  {
    place: 'Rota 5',
    label: '5',
    points: [
      [232, 62],
      [232, 152],
    ],
  },
  {
    place: 'Rota 6',
    label: '6',
    points: [
      [232, 152],
      [232, 236],
    ],
  },
  {
    place: 'Rota 7',
    label: '7',
    points: [
      [150, 152],
      [232, 152],
    ],
  },
  {
    place: 'Rota 8',
    label: '8',
    points: [
      [232, 152],
      [332, 152],
    ],
    tagAt: 0.3,
  },
  {
    place: 'Rota 9',
    label: '9',
    points: [
      [232, 62],
      [332, 62],
    ],
    tagAt: 0.6,
  },
  {
    place: 'Rota 10',
    label: '10',
    points: [
      [332, 62],
      [332, 152],
    ],
  },
  {
    place: 'Rota 11',
    label: '11',
    points: [
      [232, 236],
      [312, 236],
    ],
  },
  {
    place: 'Rota 12',
    label: '12',
    points: [
      [332, 152],
      [332, 256],
    ],
  },
  {
    place: 'Rota 13',
    label: '13',
    points: [
      [332, 256],
      [282, 256],
    ],
  },
  {
    place: 'Rota 14',
    label: '14',
    points: [
      [282, 256],
      [252, 290],
    ],
  },
  {
    place: 'Rota 15',
    label: '15',
    points: [
      [252, 290],
      [172, 290],
    ],
  },
  {
    place: 'Rota 16',
    label: '16',
    points: [
      [150, 152],
      [92, 152],
    ],
  },
  {
    place: 'Rota 17',
    label: '17',
    points: [
      [92, 152],
      [92, 290],
    ],
  },
  {
    place: 'Rota 18',
    label: '18',
    points: [
      [92, 290],
      [172, 290],
    ],
  },
  {
    place: 'Rota 19',
    label: '19',
    points: [
      [172, 290],
      [172, 330],
    ],
    water: true,
  },
  {
    place: 'Rota 20',
    label: '20',
    points: [
      [172, 330],
      [62, 330],
    ],
    water: true,
    tagAt: 0.75,
  },
  {
    place: 'Rota 21',
    label: '21',
    points: [
      [62, 330],
      [62, 255],
    ],
    water: true,
  },
  {
    place: 'Rota 22',
    label: '22',
    points: [
      [62, 178],
      [18, 178],
    ],
  },
  {
    place: 'Rota 23',
    label: '23',
    points: [
      [18, 178],
      [18, 30],
    ],
  },
];
