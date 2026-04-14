import { createLocalStorageState } from '../../lib/localStorageState.svelte';
import type { BaseGameState } from '../types';

export interface AlphabetState extends BaseGameState {
  schemaVersion: 1;
  currentIndex: number;
  foundAt: (string | null)[];
}

const INITIAL: AlphabetState = {
  schemaVersion: 1,
  currentIndex: 0,
  foundAt: Array(26).fill(null),
  startedAt: null,
  completedAt: null,
};

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const alphabetState = createLocalStorageState<AlphabetState>('rtg:alphabet', INITIAL);

export function markFound(): void {
  const current = alphabetState.value;
  const now = new Date().toISOString();
  const isFirst = current.startedAt === null;
  const newFoundAt = [...current.foundAt];
  newFoundAt[current.currentIndex] = now;
  const newIndex = current.currentIndex + 1;
  const isComplete = current.currentIndex === 25;

  alphabetState.value = {
    ...current,
    foundAt: newFoundAt,
    currentIndex: newIndex,
    startedAt: isFirst ? now : current.startedAt,
    completedAt: isComplete ? now : current.completedAt,
  };
}

export function goBack(): void {
  const current = alphabetState.value;
  if (current.currentIndex === 0) return;

  const newIndex = current.currentIndex - 1;
  const newFoundAt = [...current.foundAt];
  newFoundAt[newIndex] = null;

  alphabetState.value = {
    ...current,
    currentIndex: newIndex,
    foundAt: newFoundAt,
    completedAt: null,
  };
}

export function resetGame(): void {
  alphabetState.reset();
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
