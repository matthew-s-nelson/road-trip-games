import type { GameDefinition } from './types';
import { Car } from 'lucide-svelte';
import LicensePlateGame from './license-plate/LicensePlateGame.svelte';

export const games: GameDefinition[] = [
  {
    id: 'license-plate',
    title: 'License Plate Game',
    description: 'Spot plates from all 50 states.',
    icon: Car,
    route: '/license-plate',
    component: LicensePlateGame,
  },
];
