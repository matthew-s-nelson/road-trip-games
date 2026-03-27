# Games Architecture

## Game Registry

`src/games/registry.ts` is the single place to register a game. Both the home screen and the router are derived from it — adding a game never requires editing `App.svelte` or the route map directly.

```ts
// src/games/registry.ts
import type { GameDefinition } from './types';
import LicensePlateGame from './license-plate/LicensePlateGame.svelte';
import AlphabetGame from './alphabet/AlphabetGame.svelte';
import ISpyGame from './i-spy/ISpyGame.svelte';
import BingoGame from './bingo/BingoGame.svelte';
import { Car, CaseSensitive, Eye, LayoutGrid } from 'lucide-svelte';

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
    description: 'Find A–Z in order on signs and plates.',
    icon: CaseSensitive,
    route: '/alphabet',
    component: AlphabetGame,
  },
  {
    id: 'i-spy',
    title: 'I Spy',
    description: 'Give a clue; others guess what you see.',
    icon: Eye,
    route: '/i-spy',
    component: ISpyGame,
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
```

`App.svelte` maps over `games` to render home screen cards. The `svelte-spa-router` route map is also built from `games` at startup — both are derived, never manually maintained.

---

## Base Types

`src/games/types.ts` defines the shared contracts all games build on.

```ts
// src/games/types.ts
import type { Component } from 'svelte';

export interface GameDefinition {
  id: string;           // kebab-case unique identifier
  title: string;        // display name
  description: string;  // one-line summary for the home screen card
  icon: Component;      // lucide-svelte icon component used on the home screen card
  route: string;        // path used by svelte-spa-router (e.g. '/license-plate')
  component: Component; // the game's root Svelte component
}

export interface BaseGameState {
  schemaVersion: number;        // incremented when the state shape changes — see state.md
  startedAt: string | null;     // ISO timestamp of first meaningful action
  completedAt: string | null;   // ISO timestamp of win/completion, or null if in progress
}
```

Every game's state interface extends `BaseGameState`. Game-specific interfaces live in the game's own directory (e.g. `src/games/bingo/bingoState.svelte.ts`), not in `types.ts`.

---

## Shared Components

Reusable UI components live in `src/components/`. New games should use these rather than reimplementing common patterns.

Game-level components are built on top of `shadcn-svelte` primitives (Button, Dialog, Input, Card, etc.), which ensures consistent spacing, focus states, and interactive styles across all games without per-component style decisions.

| Component | Props | Purpose |
|-----------|-------|---------|
| `GameHeader.svelte` | `title`, `onReset` | Top bar with game title and reset button — shown on every game screen |
| `ConfirmDialog.svelte` | `message`, `onConfirm`, `onCancel` | Wraps shadcn `Dialog` — used before destructive actions (reset, undo) |
| `WinScreen.svelte` | `title`, `stats`, `onPlayAgain` | Full-screen win/completion overlay with stats and play-again button |
| `PlayerSetup.svelte` | `maxPlayers`, `onStart` | Name entry screen using shadcn `Input` for 1–N players before a game begins |
| `ProgressCounter.svelte` | `current`, `total`, `label` | Displays "X / Y [label]" — used by license plate, alphabet, bingo |

Reach for shadcn-svelte primitives directly in game components for anything not covered by the table above (e.g. `Badge`, `Separator`, `Tooltip`).

---

## Adding a New Game

Checklist for adding a game from scratch:

1. **Create the game directory** — `src/games/<name>/`
2. **Write the state file** — `<name>State.svelte.ts`
   - Define a state interface that extends `BaseGameState`
   - Instantiate `createLocalStorageState` with a unique `rtg:<name>` key
   - Export the state object and a `reset()` wrapper
3. **Build the game component** — `<Name>Game.svelte`
   - Import state from the state file
   - Use shared components from `src/components/` (`GameHeader`, `WinScreen`, etc.) rather than building from scratch
4. **Register the game** — add one entry to `src/games/registry.ts`
   - The home screen card and route are both created automatically
5. **Write the spec** — add `docs/games/<name>.md` following the existing game specs as a template

That's it — no other files need to be touched.
