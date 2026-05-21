# AI Context: Numerology Studio

## Overview
Numerology Studio is a highly modular, vanilla JavaScript Single-Page Application (SPA) designed to calculate numerological profiles, optimize names using heuristic search, and visualize data via custom UI components.

## Technical Environment
- **Runtime:** Browser (Client-side only). No Node.js backend.
- **Build System:** None. ES Modules are loaded directly (`type="module"`).
- **Styling:** Vanilla CSS with extensive use of custom properties (CSS Variables) for theming.
- **Persistence:** `localStorage` (`numerologyStudioReadings`).

## Core Mechanisms

### 1. Calculation & Analysis
- **Entry:** `app.js` -> `calculateReading()` in `core/calculations.js`.
- **Logic:** Uses the Chaldean numerology system (`config/chaldean-map.js`) to convert strings to numbers.
- **Output:** A comprehensive `reading` object containing Mulank, Bhagyank, Kua, and grid data.

### 2. Name Optimization (Beam Search)
- **Entry:** `generateNameSuggestions()` in `optimization/suggestion-engine.js`.
- **Process:** 
  1. Starts with a seed name.
  2. Generates mutations (`optimization/mutation-engine.js`).
  3. Evaluates them against the user's profile (`names/candidate-evaluator.js`).
  4. Filters out unpronounceable names using phonetic scoring (`phonetics/phonetic-scorer.js`).
  5. Ranks and returns the best candidates.

### 3. Rendering
- **Entry:** `renderReading()` in `ui/render.js`.
- **Pattern:** Uses large template literals to rebuild the `#results` container.
- **Interaction:** Uses global event delegation in `app.js` (`handleInteraction`) to catch clicks on dynamically generated elements (like Tooltips and Drawers).

## Agent Directives
1. **No Build Tools:** Do not add Webpack, Vite, or npm packages.
2. **Respect the Edit Log:** Every time you modify, add, or delete a file, you MUST append a log entry to `EDIT_LOG.md` describing the change.
3. **Pure Functions:** Keep calculation logic decoupled from UI logic.
4. **CSS Variables:** When styling, use existing variables (e.g., `var(--accent-primary)`) rather than hardcoding colors.
5. **Progressive Enhancement:** Use the Drawer (`openMulankDrawer`) or Tooltip patterns defined in `render.js` for showing deep data.
