// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';

// We import the module fresh in each relevant test via dynamic imports
// to reset module-level state (storageAvailable IIFE)

describe('createLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initialValue when localStorage is empty', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const initial = { schemaVersion: 1, startedAt: null, completedAt: null };
    const state = createLocalStorageState('test:empty', initial);
    expect(state.value).toEqual(initial);
  });

  it('persists state to localStorage on change', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const initial = {
      schemaVersion: 1,
      startedAt: null as string | null,
      completedAt: null as string | null,
    };
    const state = createLocalStorageState('test:persist', initial);
    state.value = { schemaVersion: 1, startedAt: '2024-01-01', completedAt: null };
    await tick(); // wait for $effects to flush
    const stored = localStorage.getItem('test:persist');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.startedAt).toBe('2024-01-01');
  });

  it('loads stored value on creation', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const initial = { schemaVersion: 1, startedAt: null, completedAt: null };
    const stored = { schemaVersion: 1, startedAt: '2024-06-15', completedAt: null };
    localStorage.setItem('test:load', JSON.stringify(stored));
    const state = createLocalStorageState('test:load', initial);
    expect(state.value.startedAt).toBe('2024-06-15');
  });

  it('reset() restores initialValue', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const initial = {
      schemaVersion: 1,
      startedAt: null as string | null,
      completedAt: null as string | null,
    };
    const state = createLocalStorageState('test:reset', initial);
    state.value = { schemaVersion: 1, startedAt: '2024-01-01', completedAt: null };
    state.reset();
    expect(state.value).toEqual(initial);
  });

  it('migration runs correctly when schemaVersion is behind', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const old = { schemaVersion: 1, startedAt: null, completedAt: null };
    localStorage.setItem('test:migrate', JSON.stringify(old));

    const initial = { schemaVersion: 2, startedAt: null, completedAt: null, extra: '' };
    const migrations = {
      1: (s: unknown) => ({ ...(s as object), extra: 'migrated', schemaVersion: 2 }),
    };
    const state = createLocalStorageState('test:migrate', initial, migrations);
    expect((state.value as { extra: string }).extra).toBe('migrated');
    expect(state.value.schemaVersion).toBe(2);
  });

  it('falls back to initialValue when migration is missing for a version gap', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const old = { schemaVersion: 1, startedAt: null, completedAt: null };
    localStorage.setItem('test:nomigrate', JSON.stringify(old));

    const initial = { schemaVersion: 3, startedAt: null, completedAt: null };
    // No migrations provided — should reset
    const state = createLocalStorageState('test:nomigrate', initial);
    expect(state.value).toEqual(initial);
  });

  it('multiple migrations run in order', async () => {
    const { createLocalStorageState } = await import('./localStorageState.svelte');
    const old = { schemaVersion: 1, startedAt: null, completedAt: null, step: 0 };
    localStorage.setItem('test:multi', JSON.stringify(old));

    const initial = { schemaVersion: 3, startedAt: null, completedAt: null, step: 0 };
    const migrations = {
      1: (s: unknown) => ({ ...(s as object), step: 1, schemaVersion: 2 }),
      2: (s: unknown) => ({
        ...(s as object),
        step: (s as { step: number }).step + 10,
        schemaVersion: 3,
      }),
    };
    const state = createLocalStorageState('test:multi', initial, migrations);
    expect((state.value as { step: number }).step).toBe(11);
  });

  it('storageAvailable is false when localStorage.setItem throws; state still works in-memory', async () => {
    vi.resetModules();
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const { storageAvailable, createLocalStorageState } =
      await import('./localStorageState.svelte');
    expect(storageAvailable).toBe(false);

    const initial = {
      schemaVersion: 1,
      startedAt: null as string | null,
      completedAt: null as string | null,
    };
    const state = createLocalStorageState('test:unavailable', initial);
    expect(state.value).toEqual(initial);
    state.value = { schemaVersion: 1, startedAt: '2024-01-01', completedAt: null };
    expect(state.value.startedAt).toBe('2024-01-01');
  });
});
