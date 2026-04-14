// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';

describe('startGame', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('transitions phase from setup to role-select', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    expect(iSpyState.value.phase).toBe('role-select');
  });

  it('creates players array with correct names and score 0', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    expect(iSpyState.value.players).toEqual([
      { name: 'Alice', score: 0 },
      { name: 'Bob', score: 0 },
    ]);
  });

  it('creates empty players array in nameless mode', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame([]);
    expect(iSpyState.value.players).toEqual([]);
  });

  it('sets currentSpyIndex to 0', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    expect(iSpyState.value.currentSpyIndex).toBe(0);
  });

  it('sets round to 1', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    expect(iSpyState.value.round).toBe(1);
  });

  it('does not set startedAt', async () => {
    const { startGame, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    expect(iSpyState.value.startedAt).toBeNull();
  });
});

describe('confirmClue', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('transitions phase to guessing', async () => {
    const { startGame, confirmClue, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'color', value: 'Red' });
    expect(iSpyState.value.phase).toBe('guessing');
  });

  it('sets activeClue to the passed clue', async () => {
    const { startGame, confirmClue, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'color', value: 'Red' });
    expect(iSpyState.value.activeClue).toEqual({ type: 'color', value: 'Red' });
  });

  it('resets guessCount to 0', async () => {
    const { startGame, beginClueSetup, confirmClue, incrementGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    beginClueSetup();
    confirmClue({ type: 'letter', value: 'B' });
    incrementGuess();
    incrementGuess();
    // Next round to simulate re-entering guessing
    const { giveUp, nextRound } = await import('./iSpyState.svelte');
    giveUp();
    nextRound();
    confirmClue({ type: 'color', value: 'Blue' });
    expect(iSpyState.value.guessCount).toBe(0);
  });

  it('sets startedAt on first call', async () => {
    const { startGame, confirmClue, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    expect(iSpyState.value.startedAt).toBeNull();
    confirmClue({ type: 'letter', value: 'S' });
    expect(iSpyState.value.startedAt).not.toBeNull();
  });

  it('does not overwrite startedAt on subsequent calls', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    const first = iSpyState.value.startedAt;
    giveUp();
    nextRound();
    confirmClue({ type: 'letter', value: 'A' });
    expect(iSpyState.value.startedAt).toBe(first);
  });

  it('works for letter clue type', async () => {
    const { startGame, confirmClue, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'letter', value: 'Z' });
    expect(iSpyState.value.activeClue).toEqual({ type: 'letter', value: 'Z' });
  });
});

describe('incrementGuess', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('increments guessCount by 1', async () => {
    const { startGame, confirmClue, incrementGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'color', value: 'Blue' });
    expect(iSpyState.value.guessCount).toBe(0);
    incrementGuess();
    expect(iSpyState.value.guessCount).toBe(1);
  });

  it('accumulates across multiple calls', async () => {
    const { startGame, confirmClue, incrementGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'color', value: 'Blue' });
    incrementGuess();
    incrementGuess();
    incrementGuess();
    expect(iSpyState.value.guessCount).toBe(3);
  });
});

describe('recordCorrectGuess', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('transitions phase to round-end', async () => {
    const { startGame, confirmClue, recordCorrectGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(1);
    expect(iSpyState.value.phase).toBe('round-end');
  });

  it('increments the winning player score by 1', async () => {
    const { startGame, confirmClue, recordCorrectGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(1);
    expect(iSpyState.value.players[1].score).toBe(1);
  });

  it('sets lastRoundWinnerIndex to the passed index', async () => {
    const { startGame, confirmClue, recordCorrectGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(1);
    expect(iSpyState.value.lastRoundWinnerIndex).toBe(1);
  });

  it('does not change other players scores', async () => {
    const { startGame, confirmClue, recordCorrectGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob', 'Carol']);
    confirmClue({ type: 'letter', value: 'A' });
    recordCorrectGuess(2);
    expect(iSpyState.value.players[0].score).toBe(0);
    expect(iSpyState.value.players[1].score).toBe(0);
    expect(iSpyState.value.players[2].score).toBe(1);
  });

  it('does not crash in nameless mode (empty players)', async () => {
    const { startGame, confirmClue, recordCorrectGuess, iSpyState } =
      await import('./iSpyState.svelte');
    startGame([]);
    confirmClue({ type: 'color', value: 'Blue' });
    expect(() => recordCorrectGuess(0)).not.toThrow();
    expect(iSpyState.value.phase).toBe('round-end');
  });
});

describe('giveUp', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('transitions phase to round-end', async () => {
    const { startGame, confirmClue, giveUp, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    expect(iSpyState.value.phase).toBe('round-end');
  });

  it('sets lastRoundWinnerIndex to null', async () => {
    const { startGame, confirmClue, giveUp, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    expect(iSpyState.value.lastRoundWinnerIndex).toBeNull();
  });

  it('does not change any player scores', async () => {
    const { startGame, confirmClue, giveUp, iSpyState } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    expect(iSpyState.value.players[0].score).toBe(0);
    expect(iSpyState.value.players[1].score).toBe(0);
  });
});

describe('nextRound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('transitions phase to role-select', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    nextRound();
    expect(iSpyState.value.phase).toBe('role-select');
  });

  it('increments round by 1', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    nextRound();
    expect(iSpyState.value.round).toBe(2);
  });

  it('clears activeClue', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    nextRound();
    expect(iSpyState.value.activeClue).toBeNull();
  });

  it('resets guessCount to 0', async () => {
    const { startGame, confirmClue, incrementGuess, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    incrementGuess();
    incrementGuess();
    giveUp();
    nextRound();
    expect(iSpyState.value.guessCount).toBe(0);
  });

  it('clears lastRoundWinnerIndex', async () => {
    const { startGame, confirmClue, recordCorrectGuess, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(1);
    nextRound();
    expect(iSpyState.value.lastRoundWinnerIndex).toBeNull();
  });

  it('sets currentSpyIndex to winner index when there is a winner', async () => {
    const { startGame, confirmClue, recordCorrectGuess, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob', 'Carol']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(2);
    nextRound();
    expect(iSpyState.value.currentSpyIndex).toBe(2);
  });

  it('rotates currentSpyIndex on give-up with multiple players', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob', 'Carol']);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    nextRound(); // currentSpyIndex was 0, should become 1
    expect(iSpyState.value.currentSpyIndex).toBe(1);
  });

  it('keeps currentSpyIndex at 0 in nameless mode', async () => {
    const { startGame, confirmClue, giveUp, nextRound, iSpyState } =
      await import('./iSpyState.svelte');
    startGame([]);
    confirmClue({ type: 'color', value: 'Red' });
    giveUp();
    nextRound();
    expect(iSpyState.value.currentSpyIndex).toBe(0);
  });
});

describe('resetGame', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('returns all fields to initial state', async () => {
    const { startGame, confirmClue, recordCorrectGuess, resetGame, iSpyState } =
      await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'color', value: 'Red' });
    recordCorrectGuess(1);
    resetGame();
    expect(iSpyState.value.phase).toBe('setup');
    expect(iSpyState.value.players).toEqual([]);
    expect(iSpyState.value.round).toBe(1);
    expect(iSpyState.value.activeClue).toBeNull();
    expect(iSpyState.value.guessCount).toBe(0);
    expect(iSpyState.value.lastRoundWinnerIndex).toBeNull();
    expect(iSpyState.value.startedAt).toBeNull();
    expect(iSpyState.value.completedAt).toBeNull();
    expect(iSpyState.value.schemaVersion).toBe(1);
  });
});

describe('Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('persists state to rtg:i-spy in localStorage after confirmClue', async () => {
    const { startGame, confirmClue } = await import('./iSpyState.svelte');
    startGame(['Alice']);
    confirmClue({ type: 'color', value: 'Green' });
    await tick();
    const stored = localStorage.getItem('rtg:i-spy');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.phase).toBe('guessing');
    expect(parsed.activeClue).toEqual({ type: 'color', value: 'Green' });
  });

  it('restores state from localStorage on module reload', async () => {
    const { startGame, confirmClue } = await import('./iSpyState.svelte');
    startGame(['Alice', 'Bob']);
    confirmClue({ type: 'letter', value: 'T' });
    await tick();

    vi.resetModules();
    const { iSpyState: reloaded } = await import('./iSpyState.svelte');
    expect(reloaded.value.phase).toBe('guessing');
    expect(reloaded.value.activeClue).toEqual({ type: 'letter', value: 'T' });
  });
});

describe('CLUE_COLORS', () => {
  it('contains exactly 12 entries', async () => {
    const { CLUE_COLORS } = await import('./iSpyState.svelte');
    expect(CLUE_COLORS).toHaveLength(12);
  });

  it('each entry has a non-empty name and a hex starting with #', async () => {
    const { CLUE_COLORS } = await import('./iSpyState.svelte');
    for (const color of CLUE_COLORS) {
      expect(color.name.length).toBeGreaterThan(0);
      expect(color.hex).toMatch(/^#/);
    }
  });

  it('all names are unique', async () => {
    const { CLUE_COLORS } = await import('./iSpyState.svelte');
    const names = CLUE_COLORS.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
