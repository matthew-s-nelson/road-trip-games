import { createLocalStorageState } from '../../lib/localStorageState.svelte';
import type { BaseGameState } from '../types';

export interface ISpyPlayer {
  name: string;
  score: number;
}

export interface ISpyClue {
  type: 'color' | 'letter';
  value: string;
}

export type ISpyPhase = 'setup' | 'role-select' | 'clue-setup' | 'guessing' | 'round-end';

export interface ISpyState extends BaseGameState {
  schemaVersion: 1;
  phase: ISpyPhase;
  players: ISpyPlayer[];
  currentSpyIndex: number;
  round: number;
  activeClue: ISpyClue | null;
  guessCount: number;
  lastRoundWinnerIndex: number | null;
}

const INITIAL: ISpyState = {
  schemaVersion: 1,
  phase: 'setup',
  players: [],
  currentSpyIndex: 0,
  round: 1,
  activeClue: null,
  guessCount: 0,
  lastRoundWinnerIndex: null,
  startedAt: null,
  completedAt: null,
};

export const CLUE_COLORS: readonly { name: string; hex: string }[] = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Black', hex: '#0f172a' },
  { name: 'Brown', hex: '#92400e' },
  { name: 'Silver', hex: '#94a3b8' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Gray', hex: '#6b7280' },
];

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const iSpyState = createLocalStorageState<ISpyState>('rtg:i-spy', INITIAL);

export function startGame(playerNames: string[]): void {
  const players = playerNames.map((name) => ({ name, score: 0 }));
  iSpyState.value = { ...INITIAL, phase: 'role-select', players };
}

export function beginClueSetup(): void {
  iSpyState.value = { ...iSpyState.value, phase: 'clue-setup' };
}

export function beginGuessing(): void {
  iSpyState.value = { ...iSpyState.value, phase: 'guessing' };
}

export function confirmClue(clue: ISpyClue): void {
  const current = iSpyState.value;
  iSpyState.value = {
    ...current,
    phase: 'guessing',
    activeClue: clue,
    guessCount: 0,
    startedAt: current.startedAt ?? new Date().toISOString(),
  };
}

export function incrementGuess(): void {
  iSpyState.value = { ...iSpyState.value, guessCount: iSpyState.value.guessCount + 1 };
}

export function recordCorrectGuess(winnerIndex: number): void {
  const current = iSpyState.value;
  const newPlayers = current.players.map((p, i) =>
    i === winnerIndex ? { ...p, score: p.score + 1 } : p
  );
  iSpyState.value = {
    ...current,
    phase: 'round-end',
    players: newPlayers,
    lastRoundWinnerIndex: winnerIndex,
  };
}

export function giveUp(): void {
  iSpyState.value = { ...iSpyState.value, phase: 'round-end', lastRoundWinnerIndex: null };
}

export function nextRound(): void {
  const current = iSpyState.value;
  let nextSpyIndex: number;
  if (current.lastRoundWinnerIndex !== null) {
    nextSpyIndex = current.lastRoundWinnerIndex;
  } else if (current.players.length > 1) {
    nextSpyIndex = (current.currentSpyIndex + 1) % current.players.length;
  } else {
    nextSpyIndex = 0;
  }
  iSpyState.value = {
    ...current,
    phase: 'role-select',
    currentSpyIndex: nextSpyIndex,
    round: current.round + 1,
    activeClue: null,
    guessCount: 0,
    lastRoundWinnerIndex: null,
  };
}

export function resetGame(): void {
  iSpyState.reset();
}
