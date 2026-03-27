# Game Spec: I Spy

## Overview

A classic verbal guessing game. One player picks something they can currently see and gives a single clue; the other players take turns guessing what it is. The first player to guess correctly becomes the next spy.

## Rules

1. The active player (the "spy") picks something visible to everyone in the car.
2. The spy announces: *"I spy with my little eye, something that is [clue]."*
3. Clue types:
   - **Color** — "something that is blue"
   - **Letter** — "something beginning with the letter S"
4. Other players take turns guessing out loud.
5. The spy answers "yes" or "no" to each guess.
6. The first player to guess correctly becomes the next spy.
7. If no one guesses after a set number of attempts, the spy reveals the answer and takes another turn (or passes).

## App Features

### Role Selection Screen
- Buttons: **"I'm the Spy"** / **"I'm Guessing"**
- Tapping "I'm the Spy" goes to the clue setup screen
- Tapping "I'm Guessing" shows the guess tracker screen

### Spy: Clue Setup Screen
- Choose clue type: **Color** or **Letter**
- If **Color**: display a color picker or a grid of common colors to tap
- If **Letter**: display an A–Z letter picker
- Confirm button reveals the clue to the group (clue is shown on screen for guessers to see)
- The actual item the spy picked is NOT entered into the app — that stays in the spy's head

### Guessers: Active Round Screen
- Shows the current clue prominently: e.g., *"Something that is RED"* or *"Something beginning with B"*
- Guess counter: tracks how many guesses have been made this round
- "Give Up / Reveal" button (spy taps this when giving up) — prompts spy to say the answer out loud; no text entry needed

### Round End
- "Correct Guess!" button — tap when someone guesses right
- Shows who the next spy is (simple prompt: "Pass the phone to [next player]")
- Round counter displayed at top

### Score Tracking (Optional)
- At game start, players can enter their names (2–6 players)
- App tracks how many rounds each player has won (i.e., how many times they guessed correctly)
- Leaderboard shown between rounds

## State Shape

```ts
type ISpyState = {
  players: { name: string; score: number }[];
  currentSpyIndex: number;
  round: number;
  activeClue: { type: 'color' | 'letter'; value: string } | null;
  guessCount: number;
};
```

## Edge Cases

- The item the spy chose is never entered into the app — the game is verbal. This keeps setup fast and avoids the awkward situation of the spy accidentally revealing the answer.
- If players don't want to track scores, they can skip name entry and play without score tracking.

## Stretch Goals

- "Random Clue" button generates a random color or letter for the spy as a prompt (good for younger kids who need inspiration)
- Timer mode: guessers have 60 seconds to guess before time's up
- History log of previous clues and answers (entered manually at end of round)
