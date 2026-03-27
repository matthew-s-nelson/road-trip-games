# Styling

## Rules

1. **No inline colors.** Never write a color value directly in a `.svelte` file or a Tailwind class. This includes raw Tailwind palette classes like `bg-blue-500` or `text-gray-900`. Always use a semantic token (e.g. `bg-background`, `text-foreground`, `text-primary`).
2. **All colors are defined in `src/app.css`.** This is the single source of truth for the project's color scheme — both light and dark variants. Nothing else defines colors.
3. **Dark mode is always supported.** Every token has both a light and a dark value. The app defaults to the user's system preference and supports a manual toggle.
4. **Use the system font.** No web fonts are loaded. The app uses the device's native font stack via Tailwind's built-in `font-sans`, which resolves to SF Pro on iOS, Roboto on Android, and Segoe UI on Windows. This works offline by definition and requires no configuration.

---

## How it works

shadcn-svelte's theming system is built on CSS custom properties. `tailwind.config.ts` maps Tailwind color utilities to those custom properties. This means:

- `src/app.css` defines the values of every custom property for `:root` (light) and `.dark` (dark).
- `tailwind.config.ts` maps `bg-background` → `var(--background)`, `text-primary` → `var(--primary)`, etc.
- Components use Tailwind semantic utilities. The CSS custom properties do the rest.

Dark mode is toggled by adding/removing the `dark` class on `<html>`. On first load, the class is set from the user's `prefers-color-scheme` media query, then updated when the user manually toggles.

---

## `src/app.css`

All tokens are defined here. Add new tokens here; never anywhere else.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Backgrounds */
    --background:        0 0% 100%;
    --surface:           0 0% 96%;

    /* Foregrounds */
    --foreground:        222 47% 11%;
    --muted-foreground:  215 16% 47%;

    /* Brand */
    --primary:           221 83% 53%;
    --primary-foreground:0 0% 100%;

    /* Accents */
    --accent:            210 40% 94%;
    --accent-foreground: 222 47% 11%;

    /* Feedback */
    --success:           142 71% 45%;
    --success-foreground:0 0% 100%;
    --destructive:       0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* UI chrome */
    --border:            214 32% 91%;
    --input:             214 32% 91%;
    --ring:              221 83% 53%;

    --radius: 0.5rem;
  }

  .dark {
    /* Backgrounds */
    --background:        222 47% 11%;
    --surface:           217 33% 17%;

    /* Foregrounds */
    --foreground:        210 40% 98%;
    --muted-foreground:  215 20% 65%;

    /* Brand */
    --primary:           217 91% 60%;
    --primary-foreground:222 47% 11%;

    /* Accents */
    --accent:            217 33% 17%;
    --accent-foreground: 210 40% 98%;

    /* Feedback */
    --success:           142 71% 45%;
    --success-foreground:0 0% 100%;
    --destructive:       0 63% 31%;
    --destructive-foreground: 0 0% 100%;

    /* UI chrome */
    --border:            217 33% 25%;
    --input:             217 33% 25%;
    --ring:              224 76% 48%;
  }
}
```

---

## `tailwind.config.ts`

Maps every Tailwind color utility to a CSS custom property from `app.css`. Never add a raw hex or RGB value here.

```ts
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background:  'hsl(var(--background))',
        surface:     'hsl(var(--surface))',
        foreground:  'hsl(var(--foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: {
          DEFAULT:    'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
      },
    },
  },
};
```

---

## Dark mode toggle

The `<html>` element's `dark` class is managed in `src/lib/theme.svelte.ts`. On mount it reads `prefers-color-scheme`; the user's explicit choice is persisted to `localStorage` under the key `rtg:theme`.

```ts
// src/lib/theme.svelte.ts
const stored = localStorage.getItem('rtg:theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let dark = $state(stored ? stored === 'dark' : prefersDark);

$effect(() => {
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('rtg:theme', dark ? 'dark' : 'light');
});

export function toggleTheme() { dark = !dark; }
export { dark };
```

A theme toggle button in `GameHeader.svelte` calls `toggleTheme()` and renders the appropriate lucide-svelte icon (`Sun` / `Moon`).

---

## Mobile safe areas

On iOS in PWA standalone mode, the screen extends behind the notch and home indicator. Without explicit padding, content is clipped or sits under the home bar.

Two changes are required:

**1. `index.html` — add `viewport-fit=cover` to the viewport meta tag:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**2. `src/app.css` — pad the app shell to respect safe area insets:**

```css
@layer base {
  body {
    padding-top:    env(safe-area-inset-top);
    padding-right:  env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left:   env(safe-area-inset-left);
  }
}
```

On devices without a notch (and on non-iOS platforms) `env(safe-area-inset-*)` resolves to `0`, so this has no effect outside of iOS PWA standalone mode.

---

## Animations

All animations use Svelte's built-in transitions. Durations are kept short — the app is used in a moving car and animations should never make the user wait.

| Situation | Transition | Duration |
|-----------|------------|----------|
| Navigating to/from a game | `fade` | 150ms |
| Win screen entrance | `fly` (slide up from below, `y: 50`) | 250ms |
| Item marked as found (state, letter, bingo square) | CSS `scale` pulse via Tailwind `transition-transform` | 150ms |
| Confirm dialogs | Handled by shadcn-svelte's built-in Dialog animation | — |

**Rationale for each choice:**
- `fade` for page transitions — neutral, doesn't imply a direction, works for any navigation
- `fly` for win screen — the upward entrance feels like a reward without being excessive
- CSS `scale` pulse for item marking — a quick 1 → 1.1 → 1 scale gives immediate tap feedback; using a CSS transition rather than a Svelte `transition:` keeps the markup clean since items are always rendered (not conditionally mounted)

The item scale pulse is applied via a CSS class toggled on tap:

```css
/* src/app.css */
@layer utilities {
  .tap-pulse {
    transition: transform 150ms ease-out;
  }
  .tap-pulse:active {
    transform: scale(1.1);
  }
}
```

---

## Adding a new token

1. Add the custom property to both `:root` and `.dark` in `src/app.css`.
2. Map it to a Tailwind utility name in `tailwind.config.ts`.
3. Use the Tailwind utility in components — never reference `var(--my-token)` directly in component styles.
