import type { GameDefinition } from './types';
import { Car, CaseSensitive } from 'lucide-svelte';
import LicensePlateGame from './license-plate/LicensePlateGame.svelte';
import AlphabetGame from './alphabet/AlphabetGame.svelte';

export const games: GameDefinition[] = [
  {
    id: 'license-plate',
    title: 'License Plate Game',
    description: 'Spot plates from all 50 states.',
    icon: Car,
    route: '/license-plate',
    component: LicensePlateGame,
  },
  {
    id: 'alphabet',
    title: 'Alphabet Game',
    description: 'Find every letter A–Z outside the car.',
    icon: CaseSensitive,
    route: '/alphabet',
    component: AlphabetGame,
  },
];
