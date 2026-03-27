# Architecture

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Svelte 5 (Vite) | Minimal boilerplate, runes-based reactivity is a natural fit for simple game state |
| Styling | Tailwind CSS | Utility-first, easy to enforce large touch targets and high contrast |
| UI Components | `shadcn-svelte` | Unstyled, accessible primitives (Button, Dialog, Input, etc.) — consistent design without overriding opinionated styles |
| Icons | `lucide-svelte` | Consistent icon set as Svelte components; tree-shaken so only used icons are bundled |
| State | Svelte 5 runes (`$state`) + `localStorage` | No server; runes are reactive by default and compose cleanly with localStorage |
| PWA | `vite-plugin-pwa` | Vite-native, framework-agnostic — works identically with Svelte |
| Routing | `svelte-spa-router` | Lightweight hash-based SPA router; no SvelteKit needed for a client-only app |
| Language | TypeScript | Type safety for game state shapes (`.svelte.ts` files for shared logic) |

## Docs

| Topic | File |
|-------|------|
| Folder & file layout | [project-structure.md](./project-structure.md) |
| Game registry, base types, shared components, adding a game | [games.md](./games.md) |
| State persistence & localStorage schema versioning | [state.md](./state.md) |
| Hash-based routing | [routing.md](./routing.md) |
| PWA & deployment to GitHub Pages | [deployment.md](./deployment.md) |
| SEO, Open Graph, robots.txt | [seo.md](./seo.md) |
| Dark mode, color tokens, theming rules | [styling.md](./styling.md) |
| ESLint, Prettier, svelte-check, pre-commit hooks | [code-quality.md](./code-quality.md) |
| Vitest & testing strategy | [testing.md](./testing.md) |
