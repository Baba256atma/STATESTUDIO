# MRP_HUD:13:5 — Scene Panel Fixed Width + Half-Height Expansion Contract

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

Scene Panel was readable after MRP_HUD:13:4, but expanded to nearly full scene height and min/max toggled width (48px collapsed rail vs 220px expanded). That made the panel feel too tall and the collapse behavior inconsistent with a professional HUD control.

---

## Fix

### `scenePanelWidthContract.ts`

| Constant | Value | Role |
|----------|-------|------|
| `SCENE_PANEL_WIDTH` | 220 | Fixed width in both modes |
| `SCENE_PANEL_TOP_INSET_PX` | 4 | Top anchor relative to scene HUD safe area |
| `SCENE_PANEL_EXPANDED_HEIGHT_RATIO` | 0.5 | Expanded body height = 50% of available vertical space |
| `SCENE_PANEL_HEADER_HEIGHT` | 44 | Header-only minimized height |
| `SCENE_PANEL_MINIMIZED_HEIGHT` | 44 | Same as header height |

- `resolveScenePanelZoneWidth()` always returns fixed 220px — collapse no longer changes width
- `resolveScenePanelZoneHeight()` returns header-only height when minimized, half available height when expanded
- Diagnostics:
  - `[NexoraScenePanel] top=4 widthFixed=true heightMode=expanded heightRatio=0.5`
  - `[NexoraScenePanel] top=4 widthFixed=true heightMode=minimized bodyVisible=false`

### Zone contract (`sceneHudZoneContract.ts`)

- Scene panel zone `top = 4px` (independent of menu bar unified top row)
- Scene panel zone `height` from `resolveScenePanelZoneHeight()` — not full side column height
- Width always 220px regardless of `scenePanelCollapsed`
- Overlap clamp preserves minimized header height floor

### Top alignment (`sceneHudTopAlignmentContract.ts`)

- Menu bar and object panel remain on unified top row
- Scene panel uses dedicated 4px inset; alignment check compares menu bar + object panel only

### UI

- **`SceneInfoHud.tsx`** — single shell layout; min/max toggles body visibility and zone height only; horizontal header in both states; `overflow-y: auto` on expanded body; `overflow: hidden` when minimized
- **`ScenePanelShell.tsx`** — same fixed-width, height-only collapse contract for left-dock path

---

## Behavior Summary

| State | Width | Height | Body | Overflow |
|-------|-------|--------|------|----------|
| Expanded | 220px fixed | ~50% of available scene height | Visible | `overflow-y: auto`, `overflow-x: hidden` |
| Minimized | 220px fixed | Header only (44px) | Hidden | `overflow: hidden` |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Scene Panel shorter and professional | PASS |
| Scene Panel top is 4px | PASS |
| Width remains fixed in both states | PASS |
| Min/max controls change height only | PASS |
| Minimized panel shows only header | PASS |
| Expanded panel shows content with vertical scroll | PASS |
| Build passes | PASS |
| No runtime errors (render-safety from 13:4A preserved) | PASS |

---

## QA Checklist

1. Load `/type-c`
2. Open Scene Panel — confirm top = 4px, expanded height ≈ half prior full-height
3. Click min/max — width unchanged, height collapses to header
4. Expand again — content restored, vertical scroll only
5. No horizontal scrollbar, no `addEventListener` null error, no render-state update warning

---

## Files Changed

- `frontend/app/lib/scene/scenePanelWidthContract.ts`
- `frontend/app/lib/scene/scenePanelWidthContract.test.ts`
- `frontend/app/lib/scene/sceneHudZoneContract.ts`
- `frontend/app/lib/scene/sceneHudZoneContract.test.ts`
- `frontend/app/lib/hud/sceneHudTopAlignmentContract.ts`
- `frontend/app/lib/hud/sceneHudTopAlignmentContract.test.ts`
- `frontend/app/components/scene/SceneInfoHud.tsx`
- `frontend/app/components/workspace/ScenePanelShell.tsx`

---

## Unchanged (per contract)

Object Panel, Timeline, MRP, Assistant, HUD routing, topology, scene object selection.
