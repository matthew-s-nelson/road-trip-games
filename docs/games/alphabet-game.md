# Game Spec: Alphabet Game

## Overview

Players race to find every letter of the alphabet — in order, from A to Z — on things outside the car: billboards, road signs, license plates, storefronts, etc. A letter only counts once it's been found; you must find A before you can start looking for B.

## Rules

1. Players scan the environment for letters on visible text (signs, billboards, license plates, etc.).
2. Letters must be found in alphabetical order — A first, then B, then C, and so on.
3. A letter can come from any word or text visible outside the vehicle.
4. Letters inside the car (phone screens, books, etc.) do not count — only text from the real world outside counts.
5. First player to reach Z wins (competitive mode), or all players work together to reach Z (cooperative mode).

## Modes

### Solo
One player works through the alphabet alone, racing against the clock.

### Cooperative
All players share one list on one device. Anyone can call out a letter and the group decides if it counts.

### Competitive
Each player has their own device and tracks their own progress. Whoever reaches Z first wins. Verbal honor system — players announce when they find a letter.

## App Features

### Main Screen
- Display the full alphabet A–Z as a row of letter tiles
- Current target letter is prominently highlighted (large, colored)
- Found letters are marked (checkmark or strikethrough) and grayed out
- Progress bar: `X / 26 letters found`

### Interactions
- Tap the current letter tile to mark it as found and automatically advance to the next letter
- There is a back button once past the letter 'A' so that players can go back to the previous letter if they accidentally tapped it.
- Found letters are not tappable (prevents double-counting)
- "Reset Game" button (requires confirmation)

### End State
- When Z is found, display a win screen with:
  - Time elapsed from A to Z
  - Option to play again

### Player Support (Competitive Mode)
- Support 2–4 named players on separate devices
- Each player sees only their own progress
- A "Leaderboard" screen (manual comparison — no sync) shows each player's current letter when devices are compared side-by-side

## State Shape

```ts
type AlphabetState = {
  currentIndex: number;           // 0–25, index into A–Z
  foundAt: (string | null)[];     // ISO timestamps for each letter, or null if not yet found. Length of 26 for each letter
  startedAt: string | null;
  completedAt: string | null;
};
```

## Edge Cases

- The letter Q and X are notoriously hard to find. The app should not block progression or make the game frustrating — consider an optional "skip" feature as a stretch goal.
- If the app is closed mid-game, current letter progress is restored.

## Stretch Goals

- Timer mode: race to complete A–Z in the shortest time
- Difficulty settings: letters must come from license plates only (harder) vs. any text (easier)
- Optional "skip" mechanic: skip one letter per game (useful for Q, X, Z)
- Show which letter each player is currently on in a heads-up leaderboard
