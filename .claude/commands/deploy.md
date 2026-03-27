Read @docs/architecture/deployment.md for the full deployment context before proceeding.

Key rules:
- Deployed to GitHub Pages — `vite.config.ts` `base` must be `/<repo-name>/`
- PWA manifest `start_url` and `scope` must also include `/<repo-name>/` or the PWA won't install correctly
- Hash-based routing means no server redirect config is needed — GitHub Pages serves `index.html` and the browser handles the rest
- The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs `check → lint → test → build → deploy` in that order; a failure at any step blocks deploy
- The service worker caches all static assets on install — after any build change, the service worker version must update for users to receive the new version (vite-plugin-pwa handles this automatically)

$ARGUMENTS
