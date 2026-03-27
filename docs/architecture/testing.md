# Testing

[Vitest](https://vitest.dev/) is used for all tests. For this frontend-only app, Vitest + `@testing-library/svelte` covers all meaningful test scenarios — component interaction tests (click a state, verify it's marked found) replace what would otherwise require full E2E tests. Playwright is not used in v1; add it only if full browser navigation tests become necessary.

## What to test

| Layer | Tool | What |
|-------|------|------|
| State logic | Vitest | Pure functions: win detection, card generation, shuffle, migrations |
| Components | Vitest + `@testing-library/svelte` | User interactions: marking items, resetting, player setup |
| localStorage | Vitest (jsdom) | State persists on write, restores on re-mount, resets correctly |

## What not to test

- Svelte's own reactivity and rendering — trust the framework
- shadcn-svelte and lucide-svelte components — trust the libraries
- Visual appearance / layout

## Structure

Test files live alongside the code they test:

```
src/games/bingo/
  BingoGame.svelte
  bingoState.svelte.ts
  bingoState.test.ts       # state logic tests
  BingoGame.test.ts        # component interaction tests
```
