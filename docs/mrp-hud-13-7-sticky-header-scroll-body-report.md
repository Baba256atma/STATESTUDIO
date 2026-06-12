# MRP_HUD:13:7 — Scene/Object Panel Sticky Header + Vertical Scroll Body Contract

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

Scene and Object panels scrolled as a single block, so titles and min/max controls could move out of view. Panels did not behave like professional app chrome.

---

## Fix

### `hudPanelDesignContract.ts`

| Contract | Value |
|----------|-------|
| `HUD_PANEL_STICKY_HEADER_STYLE` | `position: sticky; top: 0; z-index: 2` |
| `HUD_PANEL_STICKY_HEADER_HEIGHT` | 44px stable header height |
| `HUD_PANEL_STICKY_SHELL_STYLE` | flex column shell, `overflow: hidden` |
| `HUD_PANEL_SCROLL_BODY_STYLE` | `flex: 1; minHeight: 0; overflow-y: auto; overflow-x: hidden` |

Diagnostics (once per panel):

```
[NexoraHUDStickyHeader] panel=scene sticky=true bodyScroll=true
[NexoraHUDStickyHeader] panel=object sticky=true bodyScroll=true
```

### Panel structure

```
Panel (sticky shell)
├─ Header (sticky, fixed height, opaque background)
└─ Scroll body (vertical only)
```

### Components

- **`SceneInfoHud.tsx`** — sticky header + scroll body; header background opaque; min/max unchanged width behavior
- **`ScenePanelShell.tsx`** — same contract for left-dock path
- **`ObjectInfoHud.tsx`** — sticky header on active/relationship/propagation views; collapse persistence moved to `useEffect` (render-safe)

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Scene Panel header fixed while body scrolls | PASS |
| Object Panel header fixed while body scrolls | PASS |
| Body scrolls vertically only | PASS |
| Min/max icons remain visible | PASS |
| No horizontal scroll | PASS |
| No render-time state update loop | PASS |
| Build passes | PASS |

---

## Unchanged

Panel data, object selection, timeline events, MRP routing, assistant runtime.
