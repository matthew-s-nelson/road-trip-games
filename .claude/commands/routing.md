Read @docs/architecture/routing.md for the full routing context before proceeding.

Key rules:
- Hash-based routing via `svelte-spa-router` — routes are `#/game-name`, never `/game-name`
- The route map is generated automatically from `src/games/registry.ts` at startup — never hardcode routes in `main.ts` or `App.svelte`
- Adding a new route = adding an entry to the registry; nothing else
- Hash routing means only the root URL is indexed by search engines — see `/seo` skill for implications

$ARGUMENTS
