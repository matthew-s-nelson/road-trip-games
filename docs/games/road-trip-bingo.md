# Game Spec: Road Trip Bingo

## Overview

Each player gets a randomly generated 5x5 bingo card filled with things commonly seen on road trips (barns, water towers, semi trucks, etc.). Players mark off items as they spot them out the window. First player to complete a row, column, or diagonal wins.

## Rules

1. Each player generates their own bingo card at the start of the game (or cards are assigned).
2. When a player spots an item on their card, they tap it to mark it.
3. Any item can be spotted by any player — there's no "calling" like in traditional bingo. Each player manages their own card.
4. Win conditions (configurable):
   - **Line Bingo** — complete any one row, column, or diagonal (standard)
   - **Blackout** — mark every square on the card
5. First player to meet the win condition calls out "Bingo!" and shows their card.

## Bingo Items

A pool of ~60 common road trip sightings. Each card randomly draws 24 of these (plus a FREE space in the center).

### Item Categories

**Vehicles**
- Semi truck
- RV / camper
- School bus
- Motorcycle
- Tractor
- Police car
- Ambulance

**Roadside**
- Barn
- Silo
- Water tower
- Windmill / wind turbine
- Billboard
- Rest stop sign
- Welcome to [State] sign
- Toll booth
- Weigh station

**Nature**
- Cows
- Horses
- Deer
- River or creek
- Lake
- Mountains (visible)
- Sunflower field
- Corn field
- Hay bales

**Infrastructure**
- Overpass
- Railroad tracks
- Train
- Bridge
- Construction zone
- Road work crew
- Emergency vehicle pulled over

**Food & Services**
- McDonald's
- Gas station (any brand)
- Diner
- Drive-through
- Truck stop

**Misc**
- Out-of-state license plate
- Person waving
- Dog in a car window
- Roadside fruit/vegetable stand
- American flag

## App Features

### Setup Screen
- Number of players: 1–6 (enter names optionally)
- Win condition: Line Bingo or Blackout
- "Generate Cards" button — creates a unique random card per player

### Bingo Card Screen
- 5x5 grid, large enough to tap individual squares easily
- Center square is always FREE (pre-marked)
- Each square shows a short label (2–4 words max) for the item
- Tapping an unmarked square marks it (checkmark overlay or color fill)
- Tapping a marked square un-marks it (with a confirmation prompt)
- Winning line/pattern is highlighted when a win is detected
- Win banner appears automatically when win condition is met

### Multi-Player Navigation
- Swipe or tab between player cards when sharing a single device
- Each player's card is clearly labeled with their name
- Win detection is per-player — the app announces when any player wins

### New Game
- "New Game" button regenerates all cards (requires confirmation to avoid losing current game)
- "Same Cards" option replays the current trip with the same cards (for rematch)

## State Shape

```ts
type BingoCard = {
  playerName: string;
  squares: { label: string; marked: boolean }[]; // 25 items, index 12 is FREE
  hasWon: boolean;
};

type BingoState = {
  cards: BingoCard[];
  winCondition: 'line' | 'blackout';
  startedAt: string | null;
};
```

## Win Detection Logic

After each mark/unmark, check:
1. All 5 rows (indices 0–4, 5–9, 10–14, 15–19, 20–24)
2. All 5 columns (indices 0,5,10,15,20 etc.)
3. Both diagonals (0,6,12,18,24 and 4,8,12,16,20)

For blackout mode, check if all 25 squares are marked.

## Edge Cases

- Cards are generated client-side using a seeded or unseeded random shuffle — no server needed.
- If the app is closed mid-game, all cards and marked squares are restored from `localStorage`.
- Two players may have the same item on their cards — that's fine and intended.

## Stretch Goals

- Themed card packs: "Highway Bingo", "Nature Bingo", "City Bingo"
- Printable card option (CSS print stylesheet)
- Custom items: players can add their own items to the pool before generating cards
- Sound effect or animation on "Bingo!"
