# Project Rules: Numerology Studio

## 1. Guiding Principles
- **No Build Step:** This is a Vanilla JS project using ES Modules. Do not introduce Webpack, Vite, or Babel without explicit human authorization.
- **Client-Side Only:** All logic runs in the browser. Do not add server-side dependencies.
- **Stateless Domain Logic:** Core calculation modules must remain pure functions. State is managed at the entry level (`app.js`) or via DOM attributes.

## 2. Naming Conventions
- **Files/Folders:** `kebab-case` (e.g., `suggestion-engine.js`, `temporal-analyzer.js`).
- **JS Variables/Functions:** `camelCase` (e.g., `calculateReading`, `mulankDetails`).
- **JS Constants/Config:** `camelCase` for objects, but treat as read-only.
- **CSS Classes:** Semantic `kebab-case`, BEM-influenced for modifiers (e.g., `.reading-form`, `.is-processing`, `.is-expanded`).

## 3. Architectural Rules
- **Domain Separation:** Never mix UI logic with calculation logic. `ui/render.js` is solely responsible for HTML generation and DOM injection.
- **Config Driven:** Magic numbers and text copy belong in `config/` or `utils/constants.js` (e.g., `chaldeanMap`, `mulankDetails`).
- **Progressive Disclosure:** UI features should use the "Drawer" pattern (`wisdom-drawer`) or Tooltips for secondary information to keep the main view clean.

## 4. Workflows: Adding New Features

### Adding a new Numerology Calculation:
1. Add pure math to `core/calculations.js` (or a specific domain folder).
2. Add interpretations to `config/numerology-config.js`.
3. Call the logic from `app.js` during the submit flow.
4. Update `ui/render.js` to visualize the new data.

### Adding a new UI Component:
1. Prefer template literals in `ui/render.js`.
2. Add styles to `css/styles.css`, respecting the CSS variables for light/dark mode (`--bg-main`, `--text-main`, etc.).
3. If interactive, add event delegation to the global handler in `app.js` (`handleInteraction`).

## 5. Anti-Patterns to Avoid
- **Inline Styles:** Do not use `style=""` in JS unless calculating dynamic positions (like tooltips).
- **Direct DOM Manipulation in Core:** `calculations.js` should never know what `document` is.
- **Global Variables:** Rely on ES Module imports instead of global scope.
- **Synchronous Blocking:** Heavy calculations (like Beam Search) currently block the main thread. Be cautious about increasing the `MAX_ITERATIONS` in `optimization-config.js`.

## 6. Extension Points
- **Cultural Profiles:** `phonetics/language-profiles.js` can be extended to support non-Indian naming conventions.
- **Temporal Forecasting:** `temporal/` currently handles Day/Month/Year. Can be extended to multi-year cycles.
