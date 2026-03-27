# Road Trip Games — Project Guide

## What this is

A mobile-first PWA for playing road trip games (license plate, alphabet, I Spy, bingo). Client-side only — no server, no accounts. Works offline after first load.

## Tech stack

- **Svelte 5** (Vite) — framework
- **TypeScript** — all logic files; `.svelte.ts` extension for files outside components that use runes
- **Tailwind CSS** + **shadcn-svelte** — styling and UI primitives
- **lucide-svelte** — icons (never use emojis)
- **svelte-spa-router** — hash-based routing (`#/game-name`)
- **vite-plugin-pwa** — service worker + web manifest

## Dev commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run check` | Type-check `.svelte` files via svelte-check |
| `npm run lint` | ESLint + svelte-check |
| `npm run format` | Prettier |
| `npm test` | Vitest (watch mode) |
| `npm test -- --run` | Vitest (single run, used in CI) |

## Non-negotiable rules

**Colors**
- Never use inline color values or raw Tailwind palette classes (`bg-blue-500`, `text-gray-900`, etc.)
- Only use semantic tokens: `bg-background`, `text-foreground`, `bg-primary`, `text-destructive`, etc.
- All tokens are defined in `src/app.css`. Add new ones there.

**Icons**
- Never use emojis anywhere in the UI or code
- Always use `lucide-svelte` components

**Fonts**
- Never load web fonts. Use Tailwind's `font-sans` (system font stack) only.

**Dark mode**
- Every component must work in both light and dark mode
- Use semantic color tokens — they automatically flip in dark mode

**State**
- Every game state interface must extend `BaseGameState` from `src/games/types.ts`
- `schemaVersion` must be bumped whenever a game state interface changes shape
- Use `createLocalStorageState` from `src/lib/localStorageState.svelte.ts` for all persistent state

**Adding a game**
- Only two places need to change outside the game's own folder: `src/games/registry.ts` (add entry) and `docs/games/` (add spec)
- See `/add-game` skill for the full checklist

## Architecture docs

Full documentation lives in `docs/architecture/`. Use the skills below to load relevant context rather than reading all docs at once.

| Area | Skill | Doc |
|------|-------|-----|
| Adding or modifying a game | `/add-game` | `docs/architecture/games.md` |
| UI, colors, dark mode, animations, safe areas | `/styling` | `docs/architecture/styling.md` |
| State, localStorage, schema versioning | `/state` | `docs/architecture/state.md` |
| Writing tests | `/testing` | `docs/architecture/testing.md` |
| Deployment, PWA, GitHub Actions | `/deploy` | `docs/architecture/deployment.md` |
| Routing | `/routing` | `docs/architecture/routing.md` |
| SEO, Open Graph | `/seo` | `docs/architecture/seo.md` |
| Code quality, lint, pre-commit hooks | `/code-quality` | `docs/architecture/code-quality.md` |
