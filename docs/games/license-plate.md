# Game Spec: License Plate Game

## Overview

Players try to spot license plates from all 50 U.S. states during the trip. When a player sees a plate from a new state, they tap it to mark it as found. The game ends when all 50 states have been found, or whenever the players decide to stop.

## Rules

1. Any player in the car can call out a state they spotted.
2. Tap the state on the app to mark it as found.
3. Each state can only be counted once.
4. The trip is over when all 50 states are marked — or players can end early and see their final count.

## App Features

### Navigation
- A nav bar at the top of the game screen includes the game title and a back button to return to the home screen.

### Main Screen
- Progress indicator: `X / 50 states found`
- **Unfound states** — sorted alphabetically, displayed at the top
- **Found states** — displayed below in a separate section with a toggle to sort either alphabetically or by time found (default: alphabetical)
- Each found state shows a checkmark and the timestamp it was found

### Interactions
- Tap an unfound state to mark it as found; this sets `startedAt` if it is the first find
- Tap a found state to unmark it (no confirmation prompt)
- "Reset Game" button (requires confirmation) clears all found states and `startedAt`

### End State
- When all 50 states are found, display a congratulations screen with:
  - Total trip duration (first find → last find)
  - The last state found highlighted
  - Share button: uses the device's native share sheet if available, otherwise copies to clipboard
  - Share text format: `"I found all 50 license plates in [duration]. Try to beat my time at [app_url]"`

## State Shape

```ts
type LicensePlateState = {
  found: Record<string, string | null>; // state name → ISO timestamp or null
  startedAt: string | null;             // ISO timestamp of first find
};
```

## Data

The 50 U.S. states are hardcoded as a static array. No external data required.

## Edge Cases

- If the app is closed mid-game, all found states are restored on next open.

## Stretch Goals

- Show a visual U.S. map with found states shaded in
- Track bonus territories (D.C., Puerto Rico, Canadian provinces)
- Show rarity indicators for hard-to-find states (e.g., Hawaii, Alaska)
