import { emit } from '@/app/events';
import { encountersIn } from '@/data';
import { TYPE_COLOR, TYPE_LABEL } from '@/domain/constants';
import { CHAPTERS, buildJourney, type Place } from '@/domain/journey';
import { byId, delegate, esc } from '@/ui/dom';
import { typeIcon } from '@/ui/icons';
import { MAP_NODES, MAP_ROUTES, type LabelAnchor, type MapNode, type MapRoute } from './map-data';

const PLACES = new Map<string, Place>(
  buildJourney()
    .flatMap((c) => c.places)
    .filter((p) => p.chapter <= 9)
    .map((p) => [p.name, p]),
);

const chapterColor = (chapter: number | undefined): string => {
  const type = CHAPTERS.find((c) => c.id === chapter)?.type;
  return type ? TYPE_COLOR[type] : '#8A93A8';
};

const LABEL_OFFSET: Record<NonNullable<MapNode['labelAt']>, [number, number, LabelAnchor]> = {
  top: [0, -11, 'middle'],
  bottom: [0, 17, 'middle'],
  left: [-10, 4, 'end'],
  right: [10, 4, 'start'],
};

function routeSvg(r: MapRoute): string {
  const place = PLACES.get(r.place);
  const color = chapterColor(place?.chapter);
  const d = r.points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const [a, b] = [r.points[0], r.points[r.points.length - 1]];
  const k = r.tagAt ?? 0.5;
  const mx = (a?.[0] ?? 0) + ((b?.[0] ?? 0) - (a?.[0] ?? 0)) * k;
  const my = (a?.[1] ?? 0) + ((b?.[1] ?? 0) - (a?.[1] ?? 0)) * k;
  return `<g class="km-route${r.water ? ' water' : ''}" data-map="route:${esc(r.place)}" style="--c:${color}" tabindex="0" role="button" aria-label="${esc(r.place)}">
    <path class="hit" d="${d}"/><path class="line" d="${d}"/>
    <circle class="tag" cx="${mx}" cy="${my}" r="7.5"/><text class="tag-t" x="${mx}" y="${my + 3}">${r.label}</text>
  </g>`;
}

function nodeSvg(n: MapNode): string {
  const place = n.place ? PLACES.get(n.place) : undefined;
  const ring = n.gym ? TYPE_COLOR[n.gym.type] : chapterColor(n.chapter ?? place?.chapter);
  const [dx, dy, anchor] = n.labelPos ?? LABEL_OFFSET[n.labelAt ?? 'right'];
  const shape =
    n.kind === 'city'
      ? `<rect class="pin" x="${n.x - 7}" y="${n.y - 7}" width="14" height="14" rx="4"/>`
      : n.kind === 'league'
        ? `<path class="pin" d="M${n.x} ${n.y - 9}l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7z"/>`
        : `<path class="pin" d="M${n.x} ${n.y - 7}l7 7-7 7-7-7z"/>`;
  return `<g class="km-node ${n.kind}" data-map="node:${n.id}" style="--c:${ring}" tabindex="0" role="button" aria-label="${esc(n.label)}">
    <circle class="hit" cx="${n.x}" cy="${n.y}" r="13"/>${shape}
    <text class="lbl" x="${n.x + dx}" y="${n.y + dy}" text-anchor="${anchor}">${esc(n.label)}</text>
  </g>`;
}

/** Mapa esquemático original de Kanto: continente, ilhas, rotas coloridas pela etapa da história. */
export function kantoMapSvg(): string {
  return `<svg class="kmap" viewBox="0 0 400 352" role="img" aria-label="Mapa esquemático de Kanto">
    <rect class="km-sea" width="400" height="352" rx="18"/>
    <path class="km-land" d="M6 8h388v300H196v-10h-50v12H84v-28H40v-40H6z"/>
    <ellipse class="km-land" cx="48" cy="326" rx="32" ry="17"/>
    <ellipse class="km-land" cx="122" cy="331" rx="13" ry="9"/>
    <g class="km-routes">${MAP_ROUTES.map(routeSvg).join('')}</g>
    <g class="km-nodes">${MAP_NODES.map(nodeSvg).join('')}</g>
    <g class="km-sevii" data-map="sevii" tabindex="0" role="button" aria-label="Ilhas Sevii">
      <rect x="296" y="306" width="92" height="38" rx="10"/>
      <text x="342" y="322">Ilhas Sevii</text><text class="sub" x="342" y="335">ver no detonado →</text>
    </g>
  </svg>`;
}

function infoFor(key: string): string {
  const [kind, id] = key.split(':') as [string, string | undefined];
  if (kind === 'sevii') {
    return `<h3>Ilhas Sevii</h3><p class="note">Arquipélago ao sul de Kanto. As Ilhas 1 a 3 abrem depois do Blaine; as Ilhas 4 a 7, no pós-jogo.</p><div class="km-actions"><button class="sel" data-chapter-go="7">Ver no detonado</button></div>`;
  }
  const node = kind === 'node' ? MAP_NODES.find((n) => n.id === id) : undefined;
  const placeName = kind === 'route' ? id : node?.place;
  const place = placeName ? PLACES.get(placeName) : undefined;
  const title = node?.label ?? id ?? '';
  const chapter = CHAPTERS.find((c) => c.id === (node?.chapter ?? place?.chapter));
  const species = place
    ? new Set(place.areas.flatMap((a) => encountersIn(a).map((e) => e.pokemon))).size
    : 0;
  const gym = node?.gym
    ? `<span class="km-chip" style="--c:${TYPE_COLOR[node.gym.type]}"><i>${typeIcon(node.gym.type)}</i>Ginásio: ${esc(node.gym.leader)} · ${TYPE_LABEL[node.gym.type]}</span>`
    : '';
  const stage = chapter
    ? `<span class="km-chip" style="--c:${chapterColor(chapter.id)}">${chapter.id <= 8 ? `Etapa ${chapter.id + 1} · ` : ''}${esc(chapter.subtitle)}</span>`
    : node?.kind === 'league'
      ? `<span class="km-chip" style="--c:${chapterColor(8)}">Etapa 9 · Liga Pokémon</span>`
      : '';
  const go = chapter ? chapter.id : node?.kind === 'league' ? 8 : undefined;
  const firstArea = place?.areas[0];
  return `<h3>${esc(title)}</h3><div class="km-chips">${stage}${gym}</div>
    <p class="note">${species ? `${species} ${species === 1 ? 'espécie' : 'espécies'} para capturar.` : 'Sem Pokémon selvagens aqui.'}</p>
    <div class="km-actions">${firstArea !== undefined && species ? `<button class="sel primary" data-area-go="${firstArea}">Ver encontros</button>` : ''}${go !== undefined ? `<button class="sel" data-chapter-go="${go}">Ver no detonado</button>` : ''}</div>`;
}

export function mountKantoMap(onChapter: (id: number) => void): void {
  const host = byId('kmap');
  const info = byId('kmapinfo');
  host.innerHTML = kantoMapSvg();
  const select = (el: Element) => {
    host.querySelectorAll('.on').forEach((x) => x.classList.remove('on'));
    el.classList.add('on');
    info.innerHTML = infoFor((el as SVGElement).dataset.map ?? '');
    info.classList.add('show');
  };
  host.addEventListener('click', (e) => {
    const el = (e.target as Element).closest('[data-map]');
    if (el) select(el);
  });
  host.addEventListener('keydown', (e) => {
    const el = (e.target as Element).closest('[data-map]');
    if (el && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      select(el);
    }
  });
  delegate(info, 'click', '[data-area-go]', (b) => emit('area:open', Number(b.dataset.areaGo)));
  delegate(info, 'click', '[data-chapter-go]', (b) => onChapter(Number(b.dataset.chapterGo)));
  info.innerHTML =
    '<p class="note">Toque numa cidade, rota ou caverna para ver detalhes. As cores mostram em que etapa da história cada lugar abre.</p>';
}
