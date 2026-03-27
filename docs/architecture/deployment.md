# Deployment

The app is deployed to **GitHub Pages** from the `gh-pages` branch via a GitHub Actions workflow.

## Vite base URL

GitHub Pages serves the app at `https://<username>.github.io/<repo-name>/`, so the `base` option in `vite.config.ts` must match:

```ts
// vite.config.ts
export default defineConfig({
  base: '/<repo-name>/',
  // ...
});
```

## PWA manifest `start_url`

Must include the base path or the PWA won't install correctly on GitHub Pages:

```json
{
  "start_url": "/<repo-name>/",
  "scope": "/<repo-name>/"
}
```

## Hash routing & GitHub Pages

Because this app uses hash-based routing, no server-side redirect tricks are needed. GitHub Pages serves `index.html` for the root URL, and the hash fragment is handled entirely in the browser. This is one of the practical benefits of choosing hash routing.

## PWA

- Service worker caches all static assets on install
- Web manifest enables "Add to Home Screen" on iOS and Android
- Offline fallback serves cached `index.html`

## GitHub Actions workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run check   # svelte-check — fail fast on type errors
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
