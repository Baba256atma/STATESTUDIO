# MRP_TIMELINE:13:2 — Bottom-Anchored Timeline Expansion + Fixed Down-Inset Contract

**Status:** PASS  
**Date:** 2026-06-07  
**Scope:** Layout-only — fixed 4px bottom anchor, upward-only height growth

---

## Problem

When Timeline expanded, `bottomOffset` was computed as `max(chatInputClearance, timelineHeight + padding)`. As height grew, the bottom edge moved upward — making the panel drift toward the scene center instead of staying bottom-anchored.

---

## Root Cause

```typescript
// sceneHudZoneContract.ts (before)
const bottomOffset = Math.max(chatInputClearance, timelineHeight + bottomHudPadding);
const timelineTop = layoutHeight - bottomOffset - timelineHeight;
```

Expanded mode produced `bottom ≈ 316px` instead of a fixed `4px`.

---

## Fix

### `timelineBottomAnchorContract.ts`

- `TIMELINE_BOTTOM_INSET_PX = 4`
- `resolveTimelineBottomAnchoredTop()` — `top = layoutHeight - 4 - height`
- `isTimelineBottomAnchorValid()` — violation detection
- Diagnostics:
  - `[NexoraTimelineAnchor] bottomInset=4 state=compact|expanded|maximized anchored=true`
  - `[NexoraTimelineAnchor][Brake] reason=bottom_anchor_violation`

### Positioning

`zoneShellStyle()` for timeline zone:

```css
position: absolute;
left: 50%;
transform: translateX(-50%);
bottom: 4px;
height: <mode height>;
/* no top, no vertical centering */
```

### Updated modules

| File | Change |
|------|--------|
| `sceneHudZoneContract.ts` | Fixed bottom inset; upward growth only |
| `timelineZoneLayoutBridge.ts` | Same anchor math |
| `timelineZoneContract.ts` | `MIN_TIMELINE_BOTTOM_INSET = 4` |
| `timelineVisibleRegionRuntime.ts` | `bottomOffset: 4` |
| `timelineWidthContract.ts` | Safe margin bottom = 4 |

---

## Behavior

| Mode | Bottom | Height | Growth direction |
|------|--------|--------|------------------|
| compact | 4px | 80px | — |
| expanded | 4px | 300px | upward |
| maximized (full) | 4px | 300px | upward |

MRP open/collapse/resize changes **width only**; bottom inset unchanged.

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Timeline never moves to center | PASS |
| Bottom remains 4px in all modes | PASS |
| Grows upward only | PASS |
| Width remains 95% scene responsive | PASS |
| MRP changes width only | PASS |
| No hydration mismatch | PASS |
| No runtime loop | PASS (signature guards) |
| Build passes | PASS |

---

## QA Checklist

1. Load `/type-c` — timeline at bottom with ~4px gap
2. Compact mode — bottom gap ~4px
3. Expand — bottom gap stays ~4px, panel grows upward
4. Collapse MRP — width changes, bottom unchanged
5. Reopen MRP — width changes, bottom unchanged
6. Resize browser — stays bottom-anchored
