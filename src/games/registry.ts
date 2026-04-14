import type { GameDefinition } from './types';
import { Car, CaseSensitive, LayoutGrid } from 'lucide-svelte';
import LicensePlateGame from './license-plate/LicensePlateGame.svelte';
import AlphabetGame from './alphabet/AlphabetGame.svelte';
import BingoGame from './bingo/BingoGame.svelte';

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
  {
    id: 'bingo',
    title: 'Road Trip Bingo',
    description: 'Spot things on your bingo card to win.',
    icon: LayoutGrid,
    route: '/bingo',
    component: BingoGame,
  },
];
