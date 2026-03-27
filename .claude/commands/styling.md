Read @docs/architecture/styling.md for the full styling context before proceeding.

Key rules:
- No inline colors or raw Tailwind palette classes — only semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.)
- All color tokens are defined in `src/app.css` (both `:root` and `.dark`) — nowhere else
- Every new token must be added to both `:root` and `.dark` in `src/app.css`, then mapped in `tailwind.config.ts`
- System font only — never import or reference web fonts
- Dark mode must work for every component — use semantic tokens and they flip automatically
- iOS safe areas are handled globally on `body` — do not add `env(safe-area-inset-*)` to individual components
- Animation conventions: `fade` 150ms for page transitions, `fly y:50` 250ms for win screen, `.tap-pulse` CSS class for item marking

$ARGUMENTS
