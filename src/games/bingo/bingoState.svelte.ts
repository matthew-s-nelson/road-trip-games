import { createLocalStorageState } from '../../lib/localStorageState.svelte';
import type { BaseGameState } from '../types';

export interface BingoSquare {
  label: string;
  marked: boolean;
}

export interface BingoCard {
  playerName: string;
  squares: BingoSquare[]; // 25 items; index 12 is always FREE
  hasWon: boolean;
  winningIndices: number[];
}

export interface BingoState extends BaseGameState {
  schemaVersion: 1;
  phase: 'setup' | 'playing';
  cards: BingoCard[];
  winCondition: 'line' | 'blackout';
}

const INITIAL: BingoState = {
  schemaVersion: 1,
  phase: 'setup',
  cards: [],
  winCondition: 'line',
  startedAt: null,
  completedAt: null,
};

export const BINGO_ITEMS: readonly string[] = [
  // Vehicles
  'Semi truck',
  'RV / camper',
  'School bus',
  'Motorcycle',
  'Tractor',
  'Police car',
  'Ambulance',
  // Roadside
  'Barn',
  'Silo',
  'Water tower',
  'Windmill',
  'Billboard',
  'Rest stop sign',
  'State welcome sign',
  'Toll booth',
  'Weigh station',
  // Nature
  'Cows',
  'Horses',
  'Deer',
  'River or creek',
  'Lake',
  'Mountains',
  'Sunflower field',
  'Corn field',
  'Hay bales',
  // Infrastructure
  'Overpass',
  'Railroad tracks',
  'Train',
  'Bridge',
  'Construction zone',
  'Road work crew',
  'Emergency vehicle',
  // Food & Services
  "McDonald's",
  'Gas station',
  'Diner',
  'Drive-through',
  'Truck stop',
  // Misc
  'Out-of-state plate',
  'Person waving',
  'Dog in car window',
  'Fruit stand',
  'American flag',
];

// Rows: 5 rows of 5
const ROWS: number[][] = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
];

// Columns: 5 columns of 5
const COLS: number[][] = [
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
];

// Diagonals
const DIAGS: number[][] = [
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export function checkWin(squares: BingoSquare[], winCondition: 'line' | 'blackout'): number[] {
  if (winCondition === 'blackout') {
    return squares.every((s) => s.marked) ? squares.map((_, i) => i) : [];
  }

  for (const line of [...ROWS, ...COLS, ...DIAGS]) {
    if (line.every((i) => squares[i].marked)) {
      return line;
    }
  }
  return [];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateCard(playerName: string): BingoCard {
  const pool = shuffle([...BINGO_ITEMS]);
  const picked = pool.slice(0, 24);

  // Insert FREE at center (index 12)
  const squares: BingoSquare[] = [
    ...picked.slice(0, 12).map((label) => ({ label, marked: false })),
    { label: 'FREE', marked: true },
    ...picked.slice(12).map((label) => ({ label, marked: false })),
  ];

  return { playerName, squares, hasWon: false, winningIndices: [] };
}

export const bingoState = createLocalStorageState<BingoState>('rtg:bingo', INITIAL);

export function startGame(playerNames: string[], winCondition: 'line' | 'blackout'): void {
  const names = playerNames.length > 0 ? playerNames : ['Player 1'];
  bingoState.value = {
    ...INITIAL,
    phase: 'playing',
    cards: names.map((name) => generateCard(name)),
    winCondition,
    startedAt: new Date().toISOString(),
  };
}

export function toggleSquare(playerIndex: number, squareIndex: number): void {
  const current = bingoState.value;
  const card = current.cards[playerIndex];

  // FREE square is never toggled
  if (squareIndex === 12) return;

  const newSquares = card.squares.map((sq, i) =>
    i === squareIndex ? { ...sq, marked: !sq.marked } : sq
  );

  const winningIndices = checkWin(newSquares, current.winCondition);
  const hasWon = winningIndices.length > 0;

  const newCard: BingoCard = {
    ...card,
    squares: newSquares,
    hasWon,
    winningIndices,
  };

  const newCards = current.cards.map((c, i) => (i === playerIndex ? newCard : c));
  const anyWon = newCards.some((c) => c.hasWon);

  bingoState.value = {
    ...current,
    cards: newCards,
    completedAt: anyWon && !current.completedAt ? new Date().toISOString() : current.completedAt,
  };
}

export function resetGame(): void {
  bingoState.reset();
}

export function formatDuration(startedAt: string, completedAt: string): string {
  const seconds = Math.floor(
    (new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
