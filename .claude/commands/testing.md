Read @docs/architecture/testing.md for the full testing context before proceeding.

Key rules:
- Vitest only — no Playwright in v1
- Test files live alongside the code they test (e.g. `bingoState.test.ts` next to `bingoState.svelte.ts`)
- Use `@testing-library/svelte` for component interaction tests
- What to test: pure state logic, win detection, card generation, migrations, user interactions (marking items, resetting)
- What NOT to test: Svelte reactivity, shadcn-svelte/lucide-svelte internals, visual layout
- Run tests in single-run mode with `npm test -- --run` (used in CI); use `npm test` for watch mode during development

$ARGUMENTS
