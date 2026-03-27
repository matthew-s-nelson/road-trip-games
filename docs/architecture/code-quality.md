# Code Quality

## Tools

| Tool | Purpose |
|------|---------|
| `eslint` + `eslint-plugin-svelte` | Lint `.svelte`, `.ts`, and `.svelte.ts` files |
| `prettier` + `prettier-plugin-svelte` | Auto-format all files consistently |
| `svelte-check` | Type-check `.svelte` files (runs the Svelte compiler with TypeScript) |
| `husky` | Manages git hooks |
| `lint-staged` | Runs linters only on staged files so pre-commit hooks stay fast |

## Pre-commit hook

On every `git commit`, lint-staged runs the following against staged files only:

```
*.{ts,svelte.ts}  → eslint --fix, prettier --write
*.svelte          → eslint --fix, prettier --write
*                 → svelte-check (full project, not per-file)
```

`svelte-check` always runs against the full project (not just staged files) because type errors in one file can originate from a change in another.

## Scripts (`package.json`)

```json
{
  "scripts": {
    "lint": "eslint . && svelte-check",
    "format": "prettier --write .",
    "check": "svelte-check --tsconfig ./tsconfig.json"
  }
}
```
