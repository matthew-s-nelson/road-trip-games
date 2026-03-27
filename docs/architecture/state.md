# State

## Persistence Pattern

Each game uses a shared `createLocalStorageState<T>(key, initialValue, migrations)` utility (in `lib/localStorageState.svelte.ts`) that:
1. Reads initial state from `localStorage` on creation, running any necessary migrations
2. Uses a Svelte 5 `$state` rune so components react to changes automatically
3. Writes to `localStorage` via a `$effect` whenever state changes
4. Exposes a `reset()` method that clears the key and restores `initialValue`

Game state is keyed by game name (e.g., `rtg:license-plate`, `rtg:alphabet`) to avoid collisions.

Each game instantiates this at module scope in its `.svelte.ts` file so state is shared across component mounts (survives navigation) without prop-drilling.

---

## localStorage Error Handling

`localStorage` can be unavailable in two scenarios:
- **Safari/Firefox private browsing** — writes throw a `SecurityError` or `QuotaExceededError` immediately
- **Storage quota exceeded** — writes throw `QuotaExceededError` even in a normal browser session

Chrome in private browsing mode does not throw — `localStorage` works normally but is wiped when the tab is closed. This case is not detectable and is considered acceptable.

### Availability check

On app startup, `src/lib/localStorageState.svelte.ts` tests whether `localStorage` is writable once and exports the result:

```ts
// src/lib/localStorageState.svelte.ts

export const storageAvailable = (() => {
  try {
    const key = '__rtg_test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
})();
```

### Graceful fallback

When `storageAvailable` is `false`, `createLocalStorageState` skips all `localStorage` reads and writes. State still works normally for the session — it just isn't persisted across page loads.

```ts
export function createLocalStorageState<T extends { schemaVersion: number }>(
  key: string,
  initialValue: T,
  migrations: Migrations = {}
) {
  function loadState(): T {
    if (!storageAvailable) return initialValue; // skip read
    // ... existing load + migration logic
  }

  let value = $state<T>(loadState());

  $effect(() => {
    if (!storageAvailable) return; // skip write
    localStorage.setItem(key, JSON.stringify(value));
  });

  return {
    get value() { return value; },
    set value(v: T) { value = v; },
    reset() { value = initialValue; },
  };
}
```

### User-facing banner

When `storageAvailable` is `false`, `App.svelte` renders a persistent banner at the top of every screen:

> **Progress won't be saved.** You may be in a private browsing window. Open this app in a regular browser tab to save your game progress.

The banner uses the `destructive` color token and a lucide-svelte `TriangleAlert` icon. It is not dismissible — the condition is permanent for the session and the user should be aware of it.

---

## Schema Versioning

Game state stored in `localStorage` will evolve as features are added (e.g. a new field on `BingoState`). Without versioning, a returning user who last played an older version of the app will have stale state in `localStorage` that doesn't match the current schema, which can cause silent bugs or crashes.

Every game state includes a `schemaVersion` number (inherited from `BaseGameState`). When state is loaded from `localStorage`, the version is compared to the current expected version. If they don't match, migrations run in order. If no migration is defined for a version gap, the state safely resets to `initialValue`.

### Implementation

```ts
// lib/localStorageState.svelte.ts

type Migrations = Record<number, (old: unknown) => unknown>;

export function createLocalStorageState<T extends { schemaVersion: number }>(
  key: string,
  initialValue: T,
  migrations: Migrations = {}
) {
  function loadState(): T {
    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;

    const stored = JSON.parse(raw) as { schemaVersion?: number };
    const storedVersion = stored.schemaVersion ?? 0;
    const currentVersion = initialValue.schemaVersion;

    if (storedVersion === currentVersion) {
      return stored as T; // schema matches — use as-is
    }

    // Run migrations in order from storedVersion up to currentVersion
    let state: unknown = stored;
    for (let v = storedVersion; v < currentVersion; v++) {
      if (migrations[v]) {
        state = migrations[v](state);
      } else {
        return initialValue; // no migration defined — safe reset
      }
    }
    return state as T;
  }

  let value = $state<T>(loadState());
  $effect(() => { localStorage.setItem(key, JSON.stringify(value)); });

  return {
    get value() { return value; },
    set value(v: T) { value = v; },
    reset() { value = initialValue; },
  };
}
```

### Usage in a game state file

```ts
// src/games/bingo/bingoState.svelte.ts

interface BingoState extends BaseGameState {
  schemaVersion: 2;          // bump this when the shape changes
  cards: BingoCard[];
  winCondition: 'line' | 'blackout';
}

const INITIAL: BingoState = {
  schemaVersion: 2,
  cards: [],
  winCondition: 'line',
  startedAt: null,
  completedAt: null,
};

export const bingoState = createLocalStorageState('rtg:bingo', INITIAL, {
  // v1 didn't have winCondition — add it with the default value
  1: (old: any) => ({ ...old, winCondition: 'line', schemaVersion: 2 }),
});
```

### Rules of thumb

- **Bump `schemaVersion`** any time you add, remove, or rename a field on a game's state interface.
- **Write a migration** when the old data is worth preserving (e.g. a player is mid-game and has already found 30 states).
- **Omit the migration** (let it reset) when the old data can't be meaningfully transformed, or when the game is new enough that no one has real progress to lose.
- **Never change an existing migration** — only add new ones on top.
