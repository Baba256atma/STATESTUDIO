# MRP_HUD:13:6 — Unified HUD Panel Design System + Shared Radius/Spacing Contract

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

Scene Panel, Object Panel, and Timeline Panel used inconsistent corner radii, padding, and internal spacing. Panels did not read as one HUD system and felt cramped at prior widths.

---

## Fix

### `hudPanelDesignContract.ts`

| Token | Value |
|-------|-------|
| `HUD_PANEL_RADIUS` | 3 |
| `HUD_PANEL_PADDING_X` | 12 |
| `HUD_PANEL_PADDING_Y` | 10 |
| `HUD_PANEL_SUBPANEL_INSET_X` | 12 |
| `HUD_PANEL_SUBPANEL_GAP` | 8 |
| `HUD_PANEL_BORDER_WIDTH` | 1 |
| `SCENE_PANEL_WIDTH` | 244 (+24) |
| `OBJECT_PANEL_WIDTH` | 272 (+24) |
| `OBJECT_PANEL_EXPANDED_WIDTH` | 344 (+24) |

Shared style helpers: shell radius, header/body padding, subpanel body (equal left/right inset), scroll (`overflow-x: hidden`), safe text wrap.

Diagnostics:

`[NexoraHUDDesign] radius=3 scenePanelWidth=244 objectPanelWidth=272 subpanelInsetsEqual=true`

### Design system integration

- `sceneNativeHudDesignSystem.ts` — `sceneInfoHud`, `objectInfoHud`, and `timelineHud` use unified **3px** radius and **1px** border
- `sceneHudZoneContract.ts` — zone widths use upgraded scene/object panel constants; emits design trace on layout resolve

### UI application

- **Scene Panel** (`SceneInfoHud`, `ScenePanelShell`) — contract padding/insets, fixed 244px width
- **Object Panel** (`ObjectInfoHud`) — equal subpanel insets, upgraded widths, vertical-only scroll
- **Timeline** (`ExecutiveBottomWorkspaceOverlay`) — contract body padding and subpanel gap

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Scene/Object/Timeline share visual language | PASS |
| All corners use 3px radius | PASS |
| Subpanel left/right spacing equal (12px) | PASS |
| Width more readable (+24px) | PASS |
| No horizontal scrollbar (`overflow-x: hidden`) | PASS |
| Build passes | PASS |

---

## Unchanged

Panel data, object selection, timeline events, MRP routing, assistant runtime, topology.
