import './styles/index.css';
import { initRouter } from './app/router';
import { store } from './app/store';
import { initTheme } from './app/theme';
import { mountBanner } from './features/banner/banner';
import { mountDex } from './features/dex/dex';
import { mountLegends } from './features/legends/legends';
import { mountMoves } from './features/moves/moves';
import { mountSheet } from './features/pokemon-sheet/sheet';
import { mountRoutes } from './features/routes/routes';
import { mountTeams } from './features/teams/teams';
import { mountTrainers } from './features/trainers/trainers';
import { mountTraining } from './features/training/training';
import { mountTypeChart } from './features/type-chart/type-chart';
import type { Version } from './types';
import { byId, setPressed } from './ui/dom';

function initVersionToggle(): void {
  const buttons = document.querySelectorAll<HTMLElement>('.ver button');
  const sync = (v: Version) => {
    setPressed(buttons, (b) => b.dataset.v === v);
    document.body.classList.toggle('lg', v === 'lg');
  };
  buttons.forEach((b) =>
    b.addEventListener('click', () => store.set('version', b.dataset.v as Version)),
  );
  store.subscribe('version', sync);
  sync(store.get('version'));
}

initTheme(byId('themebtn'));
initVersionToggle();
initRouter();
mountSheet();
mountBanner();
mountDex();
mountMoves();
mountRoutes();
mountTraining();
mountTeams();
mountLegends();
mountTrainers();
mountTypeChart();
