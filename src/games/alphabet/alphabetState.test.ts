// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';

describe('markFound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('sets foundAt[0] to an ISO timestamp on first call', async () => {
    const { markFound, alphabetState } = await import('./alphabetState.svelte');
    markFound();
    expect(alphabetState.value.foundAt[0]).not.toBeNull();
    expect(() => new Date(alphabetState.value.foundAt[0]!)).not.toThrow();
  });

  it('sets startedAt only on first call', async () => {
    const { markFound, alphabetState } = await import('./alphabetState.svelte');
    expect(alphabetState.value.startedAt).toBeNull();
    markFound();
    expect(alphabetState.value.startedAt).not.toBeNull();
  });

  it('advances currentIndex from 0 to 1', async () => {
    const { markFound, alphabetState } = await import('./alphabetState.svelte');
    expect(alphabetState.value.currentIndex).toBe(0);
    markFound();
    expect(alphabetState.value.currentIndex).toBe(1);
  });

  it('does not re-set startedAt on subsequent calls', async () => {
    const { markFound, alphabetState } = await import('./alphabetState.svelte');
    markFound();
    const firstStartedAt = alphabetState.value.startedAt;
    markFound();
    expect(alphabetState.value.startedAt).toBe(firstStartedAt);
  });

  it('sets completedAt when index 25 (Z) is marked', async () => {
    const { markFound, alphabetState } = await import('./alphabetState.svelte');
    for (let i = 0; i < 26; i++) markFound();
    expect(alphabetState.value.completedAt).not.toBeNull();
  });
});

describe('goBack', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('decrements currentIndex', async () => {
    const { markFound, goBack, alphabetState } = await import('./alphabetState.svelte');
    markFound();
    expect(alphabetState.value.currentIndex).toBe(1);
    goBack();
    expect(alphabetState.value.currentIndex).toBe(0);
  });

  it('clears foundAt at the vacated index', async () => {
    const { markFound, goBack, alphabetState } = await import('./alphabetState.svelte');
    markFound();
    goBack();
    expect(alphabetState.value.foundAt[0]).toBeNull();
  });

  it('is a no-op when currentIndex is 0', async () => {
    const { goBack, alphabetState } = await import('./alphabetState.svelte');
    expect(alphabetState.value.currentIndex).toBe(0);
    expect(() => goBack()).not.toThrow();
    expect(alphabetState.value.currentIndex).toBe(0);
  });

  it('clears completedAt if game was complete', async () => {
    const { markFound, goBack, alphabetState } = await import('./alphabetState.svelte');
    for (let i = 0; i < 26; i++) markFound();
    expect(alphabetState.value.completedAt).not.toBeNull();
    goBack();
    expect(alphabetState.value.completedAt).toBeNull();
  });
});

describe('resetGame', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('returns all fields to initial state', async () => {
    const { markFound, resetGame, alphabetState } = await import('./alphabetState.svelte');
    for (let i = 0; i < 26; i++) markFound();
    resetGame();
    expect(alphabetState.value.currentIndex).toBe(0);
    expect(alphabetState.value.foundAt).toEqual(Array(26).fill(null));
    expect(alphabetState.value.startedAt).toBeNull();
    expect(alphabetState.value.completedAt).toBeNull();
    expect(alphabetState.value.schemaVersion).toBe(1);
  });
});

describe('Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('persists state to rtg:alphabet in localStorage after markFound', async () => {
    const { markFound } = await import('./alphabetState.svelte');
    markFound();
    await tick();
    const stored = localStorage.getItem('rtg:alphabet');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.currentIndex).toBe(1);
    expect(parsed.foundAt[0]).not.toBeNull();
  });

  it('restores state from localStorage on module reload', async () => {
    const { markFound } = await import('./alphabetState.svelte');
    markFound();
    markFound();
    await tick();

    vi.resetModules();
    const { alphabetState: reloaded } = await import('./alphabetState.svelte');
    expect(reloaded.value.currentIndex).toBe(2);
  });
});

describe('formatDuration', () => {
  it('formats seconds only', async () => {
    const { formatDuration } = await import('./alphabetState.svelte');
    expect(formatDuration('2024-01-01T00:00:00.000Z', '2024-01-01T00:00:45.000Z')).toBe('45s');
  });

  it('formats minutes and seconds', async () => {
    const { formatDuration } = await import('./alphabetState.svelte');
    expect(formatDuration('2024-01-01T00:00:00.000Z', '2024-01-01T00:03:20.000Z')).toBe('3m 20s');
  });

  it('formats hours, minutes, and seconds', async () => {
    const { formatDuration } = await import('./alphabetState.svelte');
    expect(formatDuration('2024-01-01T00:00:00.000Z', '2024-01-01T02:15:10.000Z')).toBe(
      '2h 15m 10s'
    );
  });
});
