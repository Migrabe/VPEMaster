# NBP JSON Audit Report

Date: 2026-03-03

## Reference Used

- NBP API payload example (`model`, `type`, `prompt`, `resolution`, `aspect_ratio`, `num_images`): https://bananapro.site/docs/get-started/quickstart
- Official NBP API docs (`model`, `type`, `prompt`, `resolution`, `aspect_ratio`, `image_urls`, `num_images`): https://api.bananapro.site/api-docs/nano-banana-pro

Locked local reference file:
- `example/reference_nbp.json` (main)
- `examples/reference_nbp.json` (legacy copy)

## What The Site Generated (Before)

For `aiModel = "nano-banana-pro"`, function `buildJson()` returned internal schema:
- `schema: "vpe-prompt-builder-v2"`
- nested `technical`, `parameters`, `references`, etc.

This is valid internal JSON, but not a direct NBP API payload format.

## What Reference Requires

NBP request payload (reference shape):
- `model` (string)
- `type` (string)
- `prompt` (string, required)
- `resolution` (string: `1K|2K|4K`)
- `aspect_ratio` (string from allowed set: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`)
- `num_images` (number)
- `image_urls` (optional array)

## Findings

1. Critical: NBP model path did not emit NBP request JSON.
2. Critical: prompt text used in UI and JSON could diverge because they were built via separate flows.
3. High: no normalization to NBP enums for `resolution`.
4. High: no strict guard for aspect ratio to known NBP values.

## Fixes Applied

File: `public/js/client_logic_full.js`

- Added `buildPromptTextForOutput()` so prompt generation logic is shared between UI output and JSON payload.
- Added NBP helpers:
  - `normalizeNBPResolution()`
  - `normalizeNBPAspectRatio()`
  - `collectNBPImageUrls()`
  - `buildNBPRequestPayload()`
- Updated `buildJson()`:
  - if `state.aiModel === "nano-banana-pro"`, returns NBP payload matching `example/reference_nbp.json`.
  - for all other models, keeps previous `vpe-prompt-builder-v2` structure.

File: `server/prompt_engine.js`

- Server-side builder now prefers `public/js/client_logic_full.js` (with fallback to `client_logic.js`) so `/api/prompt` and browser UI use aligned generation logic.

## Remaining Notes

- `image_urls` are included when references contain either HTTP(S) URLs or uploaded `data:image/...` base64 strings.
- `text_accuracy_mode` was not added because it is not present in the selected reference schema. Add it only if your target NBP endpoint explicitly requires it as boolean.
