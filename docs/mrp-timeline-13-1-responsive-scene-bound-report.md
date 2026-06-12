# MRP_TIMELINE:13:1 — Responsive Scene-Bound Timeline + Adaptive Width Contract

**Status:** PASS  
**Date:** 2026-06-07  
**Scope:** Layout-only refactor — Timeline HUD width, MRP responsiveness, compact/expanded display states

---

## Mission

Refactor the Scene Timeline HUD into a true scene-native executive timeline. Width dynamically follows visible Scene width and adapts when Main Right Panel (MRP) opens, collapses, expands, or resizes.

**Not modified:** object selection, timeline event data, playback logic, transport engine, scenario runtime, MRP routing, assistant runtime.

---

## Phase 1 — Scene Width Contract

**Created:** `frontend/app/lib/hud/timelineWidthContract.ts`

| Export | Purpose |
|--------|---------|
| `getSceneVisibleWidth()` | Last committed measured scene width |
| `getTimelineTargetWidth(sceneWidth?)` | `sceneWidth × 0.95` |
| `getTimelineSafeMargins()` | Bottom / object-panel / scene-panel / MRP gaps |
| `commitTimelineWidthSnapshot()` | Signature-guarded width writes (loop-safe) |
| `timelineDisplayState` | `"expanded" \| "compact"` |
| `resolveTimelineDisplayHeight()` | 80px compact / 300px expanded |
| `timelineLayoutTransitionStyle()` | 250ms width/height interpolation |

Ratio remains `TIMELINE_SCENE_WIDTH_RATIO = 0.95` from `timelineZoneContract.ts`.

---

## Phase 2 — MRP Responsive Resize

- Existing `ResizeObserver` in `SceneHudZoneLayout.tsx` measures scene host width when MRP resizes the scene column.
- `commitTimelineWidthSnapshot()` + `[Nexora][TimelineResize]` diagnostics fire only when width signature changes.
- Viewport-fallback MRP reservation preserved in `resolveTimelineZoneContract()`.
- No polling, intervals, or rAF loops.

---

## Phase 3 — Scene-Bound Positioning

- Timeline remains in `SceneHudZone` (`scene-timeline-zone`) — bottom center, inside scene safe zone.
- Overlay inner container now uses `width: 100%` (fills zone shell) instead of legacy `min(88vw, 860px)`.
- Zone shell width comes from `resolveTimelineZoneContract()` (95% scene, centered via `translateX(-50%)`).

---

## Phase 4 — Compact / Expanded Display States

| State | Height | Visible content |
|-------|--------|-----------------|
| **compact** | 80px | Title, current step, Prev/Next, step counter |
| **expanded** | 300px | Full playback, story, context, details |

Legacy `collapsed` height mode normalizes to `compact` on hydrate.

---

## Phase 5 — Collapse Control

- Toggle button now switches **compact ↔ expanded** (not remount).
- Preserves: playback state, selected event, transport speed, filters.
- `toggleBottomWorkspace()` updated in `executiveBottomWorkspace.ts`.

---

## Phase 6 — Smooth Transitions

- 250ms `cubic-bezier(0.4, 0, 0.2, 1)` on zone shell and overlay container.
- Applied via `timelineLayoutTransitionStyle()` in `zoneShellStyle()` and overlay inner div.

---

## Phase 7 — Diagnostics

Once per signature (dev only):

```
[Nexora][TimelineWidthContract] sceneVisibleWidth=… timelineWidth=… ratio=0.95
[Nexora][TimelineResize] previousWidth=… nextWidth=… sceneVisibleWidth=…
[Nexora][TimelineCompact]
[Nexora][TimelineExpanded]
```

Module: `timeline131RuntimeDiagnostics.ts`

---

## Phase 8 — Loop Safety

- `commitTimelineWidthSnapshot()` — ignores duplicate width signatures.
- `commitTimelineHeightSnapshot()` — ignores duplicate height signatures.
- `SceneHudZoneLayout` ResizeObserver — ignores unchanged bounds.
- `runTimelineZoneEnforcement()` — existing layout signature skip preserved.

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/hud/timelineWidthContract.ts` | **Created** |
| `frontend/app/lib/hud/timeline131RuntimeDiagnostics.ts` | **Created** |
| `frontend/app/lib/hud/timelineWidthContract.test.ts` | **Created** |
| `frontend/app/components/scene/ExecutiveBottomWorkspaceOverlay.tsx` | 100% width, transitions, compact/expanded UI |
| `frontend/app/components/scene/SceneHudZoneLayout.tsx` | Width snapshot + resize traces |
| `frontend/app/lib/scene/sceneHudZoneContract.ts` | Display heights + zone transitions |
| `frontend/app/lib/workspace/executiveBottomWorkspace.ts` | compact ↔ expanded toggle |
| `frontend/app/lib/hud/timelineVisibleRegionRuntime.ts` | Remove fixed maxWidth |
| `frontend/app/lib/hud/timelineZoneRuntime.ts` | MRP131 width traces |
| `frontend/app/lib/hud/timelineZoneLayoutBridge.ts` | Display height alignment |
| `frontend/app/lib/timeline/timelineCompressionRuntime.ts` | compact/expanded compression |
| `frontend/app/components/SceneCanvas.tsx` | timelineHeightMode → compact/expanded |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Timeline width = 95% visible scene width | PASS |
| Width changes when MRP resizes | PASS (ResizeObserver) |
| Timeline inside Scene HUD zone | PASS |
| Compact mode works | PASS |
| Expanded mode works | PASS |
| Toggle preserves state, no remount | PASS |
| No hydration warnings | PASS (MRP:12:9A preserved) |
| No infinite loops | PASS (signature guards) |
| Build passes | PASS |
| Existing timeline functionality preserved | PASS |

---

## QA

1. Reload `/type-c` — timeline spans ~95% of scene width.
2. Open/expand MRP — timeline narrows with scene.
3. Collapse/close MRP — timeline expands to max scene width.
4. Click ▼/▲ — compact ↔ expanded without losing selection or playback.
5. Confirm dev console shows width/resize traces once per layout change (no spam).
