Read @docs/architecture/state.md for the full state management context before proceeding.

Key rules:
- Use `createLocalStorageState` from `src/lib/localStorageState.svelte.ts` for all persistent game state
- Every game state interface must extend `BaseGameState` (which includes `schemaVersion`, `startedAt`, `completedAt`)
- `schemaVersion` starts at `1` and must be bumped whenever the state interface shape changes
- Always write a migration when bumping the version if in-progress data is worth preserving; omit it to safely reset
- Never change an existing migration — only add new ones on top
- `storageAvailable` is exported from the utility — check it in `App.svelte` to show the "progress won't be saved" banner when `false`
- State files use the `.svelte.ts` extension and are instantiated at module scope (not inside components)

$ARGUMENTS
