# SEO

Because this app uses hash-based routing (`#/license-plate`, etc.), search engines only ever see a single URL — the root. Hash fragments are never sent to crawlers. This means per-route meta tags are unnecessary; all SEO effort is concentrated on `index.html`.

## Static meta tags (`index.html`)

Set once at build time. These cover the home page, which is the only page crawlers index.

```html
<title>Road Trip Games — License Plates, Alphabet Game, Bingo & More</title>
<meta name="description" content="Free road trip games for the whole car. Find state license plates, race through the alphabet, play bingo, and more — works offline." />
<link rel="canonical" href="https://<your-domain>/" />
```

## Open Graph & social sharing

When a user shares the app link, these control the preview card on iMessage, Slack, social media, etc.

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Road Trip Games" />
<meta property="og:description" content="Free offline road trip games — state license plates, alphabet, bingo, and more." />
<meta property="og:image" content="https://<your-domain>/social-preview.png" />
<meta property="og:url" content="https://<your-domain>/" />
<meta name="twitter:card" content="summary_large_image" />
```

`social-preview.png` should be 1200×630px and live in `public/`.

## PWA manifest

Fields in the web manifest double as SEO and discoverability signals (used by app stores, browser install prompts, and some crawlers):

```json
{
  "name": "Road Trip Games",
  "short_name": "Road Trip",
  "description": "Offline road trip games for the whole car.",
  "start_url": "/<repo-name>/",
  "display": "standalone"
}
```

## `robots.txt`

Allow all crawlers. Place in `public/robots.txt` so Vite copies it to the build output:

```
User-agent: *
Allow: /
```

## Hash routing limitation

Hash-based URLs (`#/bingo`) are never crawled as separate pages — only the root URL is indexed. This is acceptable for v1 since individual game screens have no standalone SEO value. If per-page SEO ever becomes a requirement (e.g. a dedicated landing page per game), the path forward is migrating to SvelteKit with static prerendering, which would replace `svelte-spa-router` and generate a real URL per game.
