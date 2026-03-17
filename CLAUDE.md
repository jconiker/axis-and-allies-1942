# Axis & Allies — Claude Session Protocol

## Project Overview
- **Project:** Axis & Allies 1942 Second Edition — single player vs AI
- **Target:** iPad PWA (Progressive Web App, runs in Safari, no App Store required)
- **Path:** `/Users/josephconiker/Documents/claude/axisandallies/`
- **Dev server:** `npm run dev` → port 5002

## Startup Checklist (run at START of every session)
1. `git pull origin main` — sync latest
2. Start dev server: `npm run dev` (port 5002) via `.claude/launch.json`
3. Open Chrome to `http://localhost:5002`

## Paths
- **Repo:** `/Users/josephconiker/Documents/claude/axisandallies/`
- **GitHub:** TBD (create remote when ready to deploy to iPad)

## Tech Stack
- Vanilla JS ES modules + Vite 6 bundler
- SVG node-map board (no external framework)
- Service Worker for offline support
- Target: iPad Safari fullscreen PWA, landscape mode

## iPad Deployment
1. `npm run build` — creates `dist/`
2. Serve `dist/` on local network (e.g. `npx serve dist`)
3. On iPad Safari → navigate to IP:port → "Add to Home Screen"
4. Runs fullscreen, offline, like a native app

## Architecture

### Data Layer (`src/data/`)
- `nations.js` — 5 playable nations + neutral; `areEnemies()` helper
- `territories.js` — all land territories + sea zones with (x,y) coords; **neutral territories**: Austria (4 IPC), Yugoslavia (2), Turkey (2), Sweden (2), Spain (2)
- `units.js` — all unit types with stats; `getAllUnits()` + custom unit support
- `scenarios.js` — 1942 SE starting positions (array format: `[{nation, type, count}]`)
- `technologies.js` — 15 R&D techs across land/air/sea/economy/defense categories

### Engine (`src/engine/`)
- `GameState.js` — single source of truth; auto-saves to localStorage after every mutation; `loadSave()` / `hasSave()` / `clearSave()`
- `TurnEngine.js` — phase orchestration; fires `phase_changed` on BOTH its own bus AND state bus
- `CombatEngine.js` — pure combat resolution (AA fire, sub first-strike, artillery support, 2-hit battleships)
- `MoveValidator.js` — movement legality checking

### AI (`src/ai/`)
- `AIController.js` — heuristic AI; difficulty: easy/normal/hard; wrapped in try/catch so crashes skip phase cleanly

### UI (`src/ui/`)
- `App.js` — main controller; setup/resume screens; event wiring across both TurnEngine + GameState buses
- `MapRenderer.js` — SVG node-map; pinch-zoom + pan touch support; territory selection with green pulse rings
- `HUD.js` — nation/phase/IPC/round display; per-nation IPC strip
- `PurchasePanel.js` — bottom-sheet unit buyer; live IPC decrement; refund buttons
- `CombatModal.js` — dice rolling UI; retreat option; auto-captures empty territories
- `TechPanel.js` — R&D research panel; dice slider; breakthrough overlay
- `TerritoryDetail.js` — tap-any-territory popup; units by nation, adjacency list

## Key Rules / Gotchas
- Scenario units format: `{ territoryId: [{nation, type, count}] }` (array, NOT nested object)
- Events fire on TWO buses: `state.on('phase_changed')` for mid-game, `turnEngine.on('phase_changed')` for startGame/AI
- Neutral territories have `startOwner: 'neutral'` and `neutral: true`; use `areEnemies()` not direct side comparison
- Purchase panel auto-advances phase when "Done Purchasing" is clicked
- Auto-save runs on every `GameState` mutation method

## Permissions
- **Auto-approve all edits, writes, and bash commands** within `/Users/josephconiker/Documents/claude/` — no confirmation needed
- Only ask for approval outside that directory
