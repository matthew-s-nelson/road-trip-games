# Product Requirements Document — Road Trip Games

## Overview

Road Trip Games is a mobile-first web app that provides a collection of classic car games for passengers on road trips. The app is designed to be low-distraction, easy to use while moving, and functional without a persistent internet connection.

---

## Target Users

- Families with children on long drives
- Groups of friends on road trips
- Anyone looking for screen-friendly entertainment that still involves the real world outside the window

---

## Core Requirements

### Usability
- All interactive elements must be large enough to tap accurately in a moving vehicle (minimum 48x48px touch targets)
- High-contrast UI readable in bright sunlight
- Minimal text input — prefer taps and swipes over typing
- No onboarding, login, or setup required to start playing

### Persistence
- Game state (scores, collected items, progress) must survive accidental page refreshes
- Use `localStorage` for state persistence
- Each game independently tracks and restores its own state

### Offline Support
- App must be functional offline after the initial page load
- Implement as a Progressive Web App (PWA) with a service worker and web manifest
- All game assets (icons, card data, etc.) bundled at build time — no runtime API calls

### Multi-Player
- Multiple players can share a single device (pass-and-play model)
- OR each player uses their own device independently (no real-time sync required)
- Player names are optional but supported for score display

---

## Games in Scope (v1)

1. **License Plate Game** — collect one sighting per U.S. state
2. **Alphabet Game** — find letters A–Z in order from the environment
3. **I Spy** — one player gives a clue, others guess
4. **Road Trip Bingo** — randomly generated bingo cards of common road sightings

See individual game specs in `docs/games/`.

---

## Out of Scope (v1)

- Real-time multiplayer sync across devices
- GPS/location-based features
- Sound effects or music
- In-app purchases or ads
- User accounts or cloud save

---

## Success Criteria

- A new player can start any game in under 10 seconds with zero instructions
- Game state is never lost due to accidental navigation
- App loads and runs fully offline after first visit
