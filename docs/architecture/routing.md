# Routing

Hash-based routing via `svelte-spa-router`. The route map is generated from the game registry at startup rather than hardcoded:

```ts
// main.ts
import { games } from './games/registry';

const routes = Object.fromEntries(
  games.map(g => [g.route, g.component])
);
routes['/'] = HomeScreen;
```

`svelte-spa-router` is a small (~3kb) library purpose-built for Svelte SPAs. It requires no server-side configuration and works correctly with the PWA's offline-first cached `index.html`.

## Routes

| Hash | Screen |
|------|--------|
| `#/` | Home / game selection |
| `#/license-plate` | License Plate Game |
| `#/alphabet` | Alphabet Game |
| `#/i-spy` | I Spy |
| `#/bingo` | Road Trip Bingo |

## Why hash routing

Hash fragments (`#/...`) are handled entirely in the browser and never sent to the server. This means:

- **No server configuration needed** — GitHub Pages serves `index.html` for the root, and the browser handles the rest.
- **No 404 redirect hacks** — common workarounds for history-mode SPAs on static hosts (e.g. copying `index.html` to `404.html`) are not needed.
- **SEO tradeoff** — hash routes are not crawled as separate pages. This is acceptable here since individual game screens have no standalone SEO value. See [seo.md](./seo.md) for details.
