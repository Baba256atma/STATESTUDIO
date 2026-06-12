# MRP_HUD:13:3 — Scene/Object Panel Top Alignment + Vertical-Only Scroll Contract

**Status:** PASS  
**Date:** 2026-06-07  
**Scope:** Unified top-row alignment for Scene Panel, Menu Bar, Object Panel; vertical-only panel scroll

---

## Problem

Scene Panel and Object Panel opened at inconsistent vertical positions. Scene Panel started below the menu bar; Object Panel alignment drifted. Horizontal overflow appeared inside panels.

---

## Root Cause

`sceneHudZoneContract.ts` positioned side panels at:

```typescript
sideTop = topBarTop + topBarHeight + zoneGap; // ~52px below menu bar
```

Menu bar used `topBarTop`, but panels used `sideTop` — breaking the unified top row.

---

## Fix

### `sceneHudTopAlignmentContract.ts`

Single shared top contract:

| Constant | Value |
|----------|-------|
| `SCENE_HUD_TOP_Y` | `resolveExecutiveTopBaseline(layoutWidth)` |
| `SCENE_PANEL_TOP_Y` | same |
| `SCENE_MENU_BAR_TOP_Y` | same |
| `OBJECT_PANEL_TOP_Y` | same |

Rule: `SCENE_PANEL_TOP_Y === SCENE_MENU_BAR_TOP_Y === OBJECT_PANEL_TOP_Y`

Diagnostics:
- `[NexoraHUDTopAlign] scenePanelTop=… menuBarTop=… objectPanelTop=… aligned=true`
- `[NexoraHUDTopAlign][Brake] reason=top_alignment_mismatch` (on violation)

Panel scroll diagnostics:
- `[NexoraHUDPanelScroll] panel=scene overflowX=false overflowY=true`
- `[NexoraHUDPanelScroll] panel=object overflowX=false overflowY=true`

### Layout updates

- `sceneHudZoneContract.ts` — panels use unified `sideTop`; side height extends to timeline
- `SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE` — `overflowY: auto`, `overflowX: hidden`
- `SceneInfoHud.tsx` — fills zone width; scrollable body
- `ScenePanelShell.tsx` — `overflowX: hidden` on body
- `ObjectInfoHud.tsx` — fills zone width; vertical-only scroll

---

## Target Layout

```
[ Scene Panel ]    [ Global View | Fit Scene | Focus ]    [ Object Panel ]
     ↑ same top Y              ↑ same top Y                    ↑ same top Y
```

Panels scroll vertically only; width clamped to zone; content wraps/truncates.

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Scene Panel top = Menu Bar top | PASS |
| Object Panel top = Menu Bar top | PASS |
| One shared top contract | PASS |
| Vertical scrollbar only | PASS |
| No horizontal scrollbar | PASS |
| MRP resize preserves alignment | PASS |
| Build passes | PASS |

---

## QA

1. Load `/type-c` — three top-row elements align horizontally
2. Open Scene + Object panels — same top edge as menu bar
3. Scroll panels vertically — no horizontal scrollbar
4. Collapse/reopen MRP — alignment holds
5. Resize 1440 → 768 — alignment holds
