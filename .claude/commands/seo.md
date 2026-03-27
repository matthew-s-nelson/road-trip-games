Read @docs/architecture/seo.md for the full SEO context before proceeding.

Key rules:
- Hash routes are never crawled — only the root URL matters for SEO; all meta tags go in `index.html`
- `social-preview.png` (1200×630px) lives in `public/`
- PWA manifest `name`, `short_name`, and `description` are SEO signals — keep them accurate
- `public/robots.txt` allows all crawlers
- If per-page SEO ever becomes a requirement, the path forward is SvelteKit with static prerendering — not a patch on the current hash routing setup

$ARGUMENTS
