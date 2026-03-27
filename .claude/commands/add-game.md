Read @docs/architecture/games.md for the full game architecture context before proceeding.

Key rules:
- A new game only requires touching `src/games/<name>/` and adding one entry to `src/games/registry.ts` — no other files
- The game's icon must be a `lucide-svelte` component (never an emoji or string)
- State interface must extend `BaseGameState` and include `schemaVersion: 1` to start
- Use `createLocalStorageState` with key `rtg:<name>` for persistence
- Build on shared components in `src/components/` (`GameHeader`, `WinScreen`, `ConfirmDialog`, etc.) — don't reimplement them
- A spec file at `docs/games/<name>.md` is required

$ARGUMENTS
