---
name: new-skill
description: Audit codebases for option conflicts, logic errors, mutual exclusions, and compatibility risks across feature combinations. Use when asked to verify interactions between newly added options and existing behavior, detect rule collisions, and propose an updated conflict-resolution model.
---

# Conflict Logic and Compatibility Auditor

## Overview

Audit option systems that combine presets, toggles, and rule-based pruning.
Focus on conflicts between new options and existing logic, then propose deterministic updated logic.

## Workflow

1. Map option definitions and execution paths.
2. Build an interaction matrix for new options versus existing options.
3. Detect conflicts, contradictions, and compatibility gaps.
4. Validate runtime behavior with launch-level checks.
5. Deliver findings and an updated logic model.

## Step 1: Map Option Sources

Inspect all places where options are defined, transformed, or enforced:

- UI option groups and defaults
- Client state management and pruning logic
- Server-side normalization/pruning
- Prompt/JSON builders
- Import/export, presets, templates, and migrations
- Config files with rule tables (taxonomy/conflict rules)

Produce a short source map before deep analysis.

## Step 2: Build Interaction Matrix

Create a matrix centered on newly added options.
For each new option, test these pair classes:

- New option x existing hard modes
- New option x presets
- New option x engine/model-specific options
- New option x legacy aliases/fields
- New option x export/import/state restore

Track expected behavior and observed behavior for each pair.

## Step 3: Detect Problem Classes

Check for these issue types:

- Conflicting rules: two rules force opposite outcomes.
- One-way exclusivity: A disables B, but B does not disable A.
- Hidden stale state: disabled options stay active in output JSON/prompt.
- UI/server divergence: client allows state that server prunes differently (or vice versa).
- Precedence ambiguity: rule order changes result nondeterministically.
- Engine incompatibility: options emitted for engines that do not support them.
- Legacy drift: new canonical field added, old field still used without synchronization.

Treat high-severity issues as those that change final prompt/output silently.

## Step 4: Validate Runtime

Run targeted checks after analysis (and after any fixes):

- Existing smoke tests for option conflicts and prompt generation
- State round-trip checks (set -> prune -> export -> import -> build)
- Launch-level verification:
  - `bash scripts/verify-runtime.sh`

If a check cannot run, state exactly why and what remains unverified.

## Step 5: Propose Updated Logic

Define a strict precedence model and keep it identical on client and server.
Use this recommended order unless project constraints require another order:

1. Hard constraints (physically impossible or mode-locked combinations)
2. Mutual exclusivity groups
3. Engine capability gates
4. Preset overrides
5. Derived recommendations (soft rules, warnings only)

Specify for each conflict action type:

- `disable`: clear and lock target fields
- `exclude`: remove only incompatible values from multi-choice fields
- `warn`: keep state but surface warning

Require deterministic behavior:

- Apply rules in a stable order.
- Re-run pruning until state converges or max passes reached.
- Log rule hits in debug mode for reproducibility.

## New Option Integration Checklist

When introducing a new option, verify all items:

- Added to canonical state defaults
- Added to reset/clear logic
- Added to export/import serialization
- Added to server compute path
- Added to prompt and JSON builders (or explicitly excluded)
- Added to conflict matrix tests
- Added to docs/config rule tables with rationale

Reject changes that skip test coverage for new option interactions.

## Output Format

Return results in this structure:

1. Findings by severity (critical -> high -> medium -> low)
2. For each finding:
   - file and line reference
   - conflicting options/rules
   - impact
   - minimal reproduction
   - concrete fix
3. Updated logic proposal:
   - precedence order
   - rule examples
   - migration notes for existing states
4. Validation status:
   - checks run
   - pass/fail
   - gaps

Keep summaries short. Prioritize concrete, testable findings.
