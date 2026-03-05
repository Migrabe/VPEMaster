# Conflict Logic v2.1

This document defines runtime conflict resolution order for prompt state pruning.

## Architecture

Conflict logic runs in **two layers**:

1. **StateManager._pruneConflicts()** — mutates state at every dispatch + called server-side in `prompt_engine.js`. Contains the canonical enforcement order.
2. **applyConflictRules()** — UI-only layer that disables/enables buttons to mirror `_pruneConflicts` visually.

`enforceOutputStateRules()` provides an additional safety net called from `_pruneConflicts` after taxonomy rules.

## Priority Order

### 1. Format constraints
- `motionBlurMode` requires `promptFormat === "flat"`. Non-flat format clears all motion blur state.

### 2. Mode mutual exclusions (last-write-wins via prevState)
- `generateFourMode` ↔ `grid3x3Mode` — mutually exclusive.
- `motionBlurMode` ↔ `generateFourMode` — mutually exclusive.
- `motionBlurMode` ↔ `grid3x3Mode` — mutually exclusive.

### 3. Mode cascades
- `generateFourMode` OR `grid3x3Mode` OR `motionBlurMode` → clears `beforeAfter`, `seamlessPattern`.
- `beforeAfter` ↔ `seamlessPattern` — mutually exclusive.
- `purpose === "Character Sheet"` → clears `seamlessPattern`.

### 4. Mode field clears
- `grid3x3Mode` → clears `lens`, `focalLength`, `shotSize`, `aperture`, `angle`, `composition`.
- `generateFourMode` → clears `shotSize`, `angle`, `composition`.
- `motionBlurMode` → clears `cameraBody`, `lens`, `focalLength`, `aperture` (uses fixed Leica template).

### 5. Preset mutual exclusion
- `quickStyle` ↔ `fashionFoodStyle` — mutually exclusive (last-write-wins).
- If `quickStyle` is active, ALL manual visual groups are cleared and locked.
- If `fashionFoodStyle` is active, ALL manual visual groups are cleared and locked.

### 6. Domain pruning
- Artistic medium/style → removes camera/optics and portrait micro-detail controls.
- Pixel art / anime style → removes skinDetail, hairDetail, render boosts.
- Abstract purpose (Logo, UI Design, etc.) → removes portrait/camera style controls.

### 7. Optics vs shot compatibility
- Macro lens excludes wide/long shot sizes.
- Ultra-wide lens excludes extreme close-up shot size.
- f/0.95–f/1.2 excludes extreme wide/long shot sizes.

### 8. Shot geometry rules
- Flat-lay shot size excludes non top-down angles.
- Seamless pattern allows only flat-lay shot size.

### 9. Lighting conflicts
- Night ↔ Day light — mutually exclusive (night wins, day tokens filtered).
- B&W photoStyle → removes neon lighting.
- Neon lighting → removes B&W photoStyle (bidirectional).
- Drone angle → removes studio lighting. Studio lighting with remaining non-studio lights → drone angle preserved.

### 10. Style conflicts
- Anamorphic lens ↔ non-cinema purpose — last-write-wins via prevState.
- photoStyle conflicts with cinemaStyle/directorStyle (different domains) and is pruned deterministically.
- cinemaStyle + directorStyle is allowed only for known collaboration pairs; unknown pairs are pruned by last-write-wins.

### 10.1 Engine payload compatibility
- `negative` prompt field is stripped for `dall-e-3` and `flux` payloads.
- Engine capabilities (aliases, prompt-format constraints, AR ranges, payload mode, refs support) are loaded from `public/config/engine-capabilities.json` on both client and server.

### 11. Taxonomy rules (JSON-driven)
- External rules from `public/config/taxonomy-rules.json`.
- `disable` action: clears target fields when trigger matches.
- `exclude` action: clears conflicting target values (simplified, always clears target).

## Data Model Notes

- `shotSize` is the primary field for shot framing and shot-scale conflicts.
- `composition` is retained for legacy compatibility and is still read by semantic flags.
- New rules should target `shotSize` first, then optionally mirror legacy support for `composition`.

## Server/UI Consistency

- The server prompt engine loads `public/config/taxonomy-rules.json` into VM context.
- The server prompt engine also injects `public/config/engine-capabilities.json` into VM context so capability gates stay in sync with UI.
- Runtime pruning is applied server-side via `_pruneConflicts()` → `_applyTaxonomyRules()` → `enforceOutputStateRules()`.
- `applyPreset()` now calls `_pruneConflicts()` after preset application to ensure state consistency.
- `_handleToggleMode()` clears `isStandardPresetActive` when any mode is toggled.
- `collapseConflictLockedSections()` auto-expands sections with active selections when conflicts are resolved.
- Smoke tests in `scripts/smoke_runtime_check.mjs` validate critical pairwise conflicts.
