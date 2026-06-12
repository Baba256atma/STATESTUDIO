# MRP_HUD:13:4 — Scene Panel Width Upgrade + Header Control Visibility Fix

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

Scene Panel was too narrow on narrow viewports (56px strip), header controls clipped, and content was unreadable.

---

## Fix

### `scenePanelWidthContract.ts`

| Constant | Value |
|----------|-------|
| `SCENE_PANEL_WIDTH` | 220 |
| `SCENE_PANEL_MIN_WIDTH` | 200 |
| `SCENE_PANEL_MAX_WIDTH` | 260 |
| `SCENE_PANEL_COLLAPSED_WIDTH` | 48 |

- Expanded panel never shrinks below 200px
- Collapsed panel uses 48px rail
- Diagnostics: `[NexoraScenePanel] width=220 state=expanded headerControlsVisible=true overflowX=false`

### Zone contract

- `sceneHudZoneContract.ts` uses `resolveScenePanelZoneWidth()` — no viewport-based strip shrink when expanded
- `scenePanelCollapsed` wired via `SceneHudZoneLayout` + panel governance subscription
- Fixed `maxWidth` (`220px` / `48px`) — removed `28vw` clamp that caused strip width

### UI

- `SceneInfoHud` — title **Scene**, visible minimize/expand controls (`flexShrink: 0`), vertical-only scroll, safe text wrap
- `ScenePanelShell` — aligned to same width contract for left-dock path

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Expanded width professional (220px) | PASS |
| Collapsed width compact (48px) | PASS |
| Header controls visible | PASS |
| No horizontal scrollbar | PASS |
| Top alignment preserved | PASS |
| Build passes | PASS |
