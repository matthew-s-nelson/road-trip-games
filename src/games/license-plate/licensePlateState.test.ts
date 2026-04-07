// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';

describe('US_STATES', () => {
  it('contains exactly 50 entries', async () => {
    const { US_STATES } = await import('./licensePlateState.svelte');
    expect(US_STATES.length).toBe(50);
  });

  it('is sorted alphabetically', async () => {
    const { US_STATES } = await import('./licensePlateState.svelte');
    const sorted = [...US_STATES].sort((a, b) => a.localeCompare(b));
    expect([...US_STATES]).toEqual(sorted);
  });

  it('contains known states', async () => {
    const { US_STATES } = await import('./licensePlateState.svelte');
    expect(US_STATES).toContain('California');
    expect(US_STATES).toContain('Wyoming');
    expect(US_STATES).toContain('Texas');
    expect(US_STATES).toContain('Alaska');
    expect(US_STATES).toContain('Hawaii');
  });
});

describe('markFound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('adds state to found with ISO timestamp', async () => {
    const { markFound, licensePlateState } = await import('./licensePlateState.svelte');
    markFound('California');
    expect('California' in licensePlateState.value.found).toBe(true);
    expect(() => new Date(licensePlateState.value.found['California'])).not.toThrow();
  });

  it('sets startedAt on the first find only', async () => {
    const { markFound, licensePlateState } = await import('./licensePlateState.svelte');
    expect(licensePlateState.value.startedAt).toBeNull();
    markFound('Texas');
    const firstStartedAt = licensePlateState.value.startedAt;
    expect(firstStartedAt).not.toBeNull();
    markFound('Ohio');
    expect(licensePlateState.value.startedAt).toBe(firstStartedAt);
  });

  it('does not change startedAt on subsequent finds', async () => {
    const { markFound, licensePlateState } = await import('./licensePlateState.svelte');
    markFound('Alabama');
    const after1 = licensePlateState.value.startedAt;
    markFound('Alaska');
    expect(licensePlateState.value.startedAt).toBe(after1);
  });

  it('does not set completedAt when fewer than 50 found', async () => {
    const { markFound, licensePlateState, US_STATES } = await import('./licensePlateState.svelte');
    US_STATES.slice(0, 49).forEach((s) => markFound(s));
    expect(licensePlateState.value.completedAt).toBeNull();
  });

  it('sets completedAt when 50th state is marked', async () => {
    const { markFound, licensePlateState, US_STATES } = await import('./licensePlateState.svelte');
    US_STATES.forEach((s) => markFound(s));
    expect(licensePlateState.value.completedAt).not.toBeNull();
  });
});

describe('unmarkFound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('removes state from found', async () => {
    const { markFound, unmarkFound, licensePlateState } =
      await import('./licensePlateState.svelte');
    markFound('Florida');
    unmarkFound('Florida');
    expect('Florida' in licensePlateState.value.found).toBe(false);
  });

  it('clears completedAt when a state is unmarked', async () => {
    const { markFound, unmarkFound, licensePlateState, US_STATES } =
      await import('./licensePlateState.svelte');
    US_STATES.forEach((s) => markFound(s));
    expect(licensePlateState.value.completedAt).not.toBeNull();
    unmarkFound('Wyoming');
    expect(licensePlateState.value.completedAt).toBeNull();
  });

  it('preserves startedAt', async () => {
    const { markFound, unmarkFound, licensePlateState } =
      await import('./licensePlateState.svelte');
    markFound('Georgia');
    const startedAt = licensePlateState.value.startedAt;
    unmarkFound('Georgia');
    expect(licensePlateState.value.startedAt).toBe(startedAt);
  });

  it('preserves other found states', async () => {
    const { markFound, unmarkFound, licensePlateState } =
      await import('./licensePlateState.svelte');
    markFound('Maine');
    markFound('Vermont');
    unmarkFound('Maine');
    expect('Vermont' in licensePlateState.value.found).toBe(true);
    expect('Maine' in licensePlateState.value.found).toBe(false);
  });

  it('no-ops gracefully if state was not found', async () => {
    const { markFound, unmarkFound, licensePlateState } =
      await import('./licensePlateState.svelte');
    markFound('Iowa');
    expect(() => unmarkFound('Kansas')).not.toThrow();
    expect('Iowa' in licensePlateState.value.found).toBe(true);
  });
});

describe('resetGame', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('clears found, startedAt, and completedAt', async () => {
    const { markFound, resetGame, licensePlateState, US_STATES } =
      await import('./licensePlateState.svelte');
    US_STATES.forEach((s) => markFound(s));
    expect(licensePlateState.value.completedAt).not.toBeNull();
    resetGame();
    expect(licensePlateState.value.found).toEqual({});
    expect(licensePlateState.value.startedAt).toBeNull();
    expect(licensePlateState.value.completedAt).toBeNull();
  });

  it('restores to initial empty state', async () => {
    const { markFound, resetGame, licensePlateState } = await import('./licensePlateState.svelte');
    markFound('Nevada');
    resetGame();
    expect(Object.keys(licensePlateState.value.found).length).toBe(0);
    expect(licensePlateState.value.schemaVersion).toBe(1);
  });
});

describe('formatDuration', () => {
  it('formats seconds only', async () => {
    const { formatDuration } = await import('./licensePlateState.svelte');
    const start = '2024-01-01T00:00:00.000Z';
    const end = '2024-01-01T00:00:45.000Z';
    expect(formatDuration(start, end)).toBe('45s');
  });

  it('formats minutes and seconds', async () => {
    const { formatDuration } = await import('./licensePlateState.svelte');
    const start = '2024-01-01T00:00:00.000Z';
    const end = '2024-01-01T00:03:20.000Z';
    expect(formatDuration(start, end)).toBe('3m 20s');
  });

  it('formats hours, minutes, and seconds', async () => {
    const { formatDuration } = await import('./licensePlateState.svelte');
    const start = '2024-01-01T00:00:00.000Z';
    const end = '2024-01-01T02:15:10.000Z';
    expect(formatDuration(start, end)).toBe('2h 15m 10s');
  });
});

describe('formatTime', () => {
  it('returns a valid time string from an ISO timestamp', async () => {
    const { formatTime } = await import('./licensePlateState.svelte');
    const result = formatTime('2024-06-15T14:30:00.000Z');
    // Should be a non-empty string containing a colon (time format)
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/\d+:\d+/);
  });
});

describe('Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('persists found to localStorage on markFound', async () => {
    const { markFound } = await import('./licensePlateState.svelte');
    markFound('Oregon');
    await tick();
    const stored = localStorage.getItem('rtg:license-plate');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect('Oregon' in parsed.found).toBe(true);
  });

  it('restores found states from localStorage on reload', async () => {
    const { markFound } = await import('./licensePlateState.svelte');
    markFound('Montana');
    await tick();

    vi.resetModules();
    const { licensePlateState: reloaded } = await import('./licensePlateState.svelte');
    expect('Montana' in reloaded.value.found).toBe(true);
  });
});
