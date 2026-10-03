import { mountEvSpots } from './ev-spots';
import { mountNatureGrid } from './nature-grid';
import { mountStatCalculator } from './stat-calculator';

export function mountTraining(): void {
  mountEvSpots();
  mountNatureGrid();
  mountStatCalculator();
}
