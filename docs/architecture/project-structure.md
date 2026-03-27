# Project Structure

```
/
├── public/
│   ├── icons/                   # PWA icons
│   ├── social-preview.png       # 1200×630px Open Graph image
│   └── robots.txt
├── src/
│   ├── games/
│   │   ├── registry.ts                      # Single source of truth for all games
│   │   ├── types.ts                         # Shared base interfaces only (GameDefinition, BaseGameState)
│   │   ├── license-plate/
│   │   │   ├── LicensePlateGame.svelte
│   │   │   ├── licensePlateState.svelte.ts  # LicensePlateState interface + $state + localStorage logic
│   │   │   └── data.ts                      # All 50 states list
│   │   ├── alphabet/
│   │   │   ├── AlphabetGame.svelte
│   │   │   └── alphabetState.svelte.ts      # AlphabetState interface + $state + localStorage logic
│   │   ├── i-spy/
│   │   │   ├── ISpyGame.svelte
│   │   │   └── iSpyState.svelte.ts          # ISpyState interface + $state + localStorage logic
│   │   └── bingo/
│   │       ├── BingoGame.svelte
│   │       ├── bingoState.svelte.ts         # BingoState interface + $state + localStorage logic
│   │       └── data.ts                      # Bingo square items list
│   ├── components/              # Shared UI components (.svelte) — see games.md
│   ├── lib/
│   │   ├── localStorageState.svelte.ts      # Generic $state + localStorage utility
│   │   └── theme.svelte.ts                  # Dark mode toggle + system preference detection
│   ├── app.css                  # Global CSS — all color tokens (light + dark), Tailwind directives
│   ├── App.svelte               # Game selection home screen + router outlet
│   └── main.ts
├── docs/
│   ├── PRD.md
│   ├── architecture/            # Architecture docs (you are here)
│   └── games/                   # Per-game specs
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deploy workflow
├── index.html
├── vite.config.ts
└── README.md
```
