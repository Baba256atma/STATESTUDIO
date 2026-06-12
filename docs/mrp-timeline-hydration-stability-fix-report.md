# MRP:12:9A — Timeline Hydration Stability Fix Report

**Status:** PASS  
**Date:** 2026-06-07  
**Scope:** Nexora Type-C Timeline HUD hydration-safe time snapshot contract

---

## Problem

After MRP:12:9 (Timeline 95% width / bottom workspace), Next.js reported a hydration mismatch in `ExecutiveBottomWorkspaceOverlay.tsx`:

```
ContextRow label="Time"
Server: 2026-06-11T00:35:08.771Z
Client:  2026-06-11T00:35:09.202Z
```

The Timeline HUD rendered live/generated ISO timestamps during SSR and again on the client, producing different text between server and first client paint.

---

## Root Cause

1. **`ContextRow label="Time"`** preferred `spatialSummary.timestampLabel`, which could be a raw ISO string from spatial time intelligence anchors.
2. **`activeEventTime`** from `useHydratedTimelineDisplayTime` was bypassed when `timestampLabel` was present.
3. **`mapDecisionEventsToTimelineEvents`** always called `new Date(event.timestamp).toISOString()` even when upstream timestamps were unstable (`Date.now()` fallbacks in decision timeline builders).

---

## Fix

### 1. `timelineHydrationSafeTimeContract.ts`

New contract module:

- `TIMELINE_EMPTY_TIME_LABEL = "—"`
- `resolveHydrationSafeTimelineTime({ eventTime, fallbackTime, hydrated })`
- Semantic labels (`Now`, `T-4h`, `Recent`) pass through on SSR and client.
- ISO timestamps render as `—` until hydration; formatted time appears only after mount via effect/state.
- Runtime logs (dev, once per session):
  - `[NexoraTimelineHydration] stableTimeSnapshot=true`
  - `[NexoraTimelineHydration] fallbackTimeLabel=—`

### 2. `ExecutiveBottomWorkspaceOverlay.tsx`

- Added `isTimelineHydrated` state + `useEffect` mount gate.
- `ContextRow label="Time"` uses `contextTimeLabel` from the resolver (no direct ISO in render path).
- Story header prefix and `DecisionStoryCard` time display use the same contract.
- `hydrated` prop passed to story cards for consistent card-level time labels.

### 3. `useHydratedTimelineDisplayTime.ts`

- SSR initial state aligned with contract (`—` for ISO, semantic labels preserved).
- Post-mount formatting unchanged (effect-driven).

### 4. `executiveTimelineHudTypes.ts`

- `timestampIso` only set when `event.timestamp` is a finite number (avoids converting unstable string timestamps to ISO at model-build time).

---

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/time/timelineHydrationSafeTimeContract.ts` | **Created** — resolver + diagnostics |
| `frontend/app/lib/time/timelineHydrationSafeTimeContract.test.ts` | **Created** — 5 unit tests |
| `frontend/app/components/scene/ExecutiveBottomWorkspaceOverlay.tsx` | **Updated** — hydration gate + stable Time label |
| `frontend/app/lib/time/useHydratedTimelineDisplayTime.ts` | **Updated** — contract-aligned SSR initial state |
| `frontend/app/lib/scene/executiveTimelineHudTypes.ts` | **Updated** — guarded `timestampIso` generation |

---

## QA Checklist

| Check | Result |
|-------|--------|
| Fresh reload `/type-c` | Manual — no hydration mismatch expected |
| No hydration mismatch on `ContextRow Time` | PASS (SSR/client both render `—` until mount) |
| Timeline still renders | PASS (unchanged layout/behavior) |
| Timeline expanded/collapsed | PASS (MRP:12:10 toggle preserved) |
| Timeline 95% width | PASS (MRP:12:9 contract untouched) |
| MRP collapse updates scene width | PASS (no layout contract changes) |
| No repeated timeline layout writes | PASS (no new layout subscriptions) |
| No runtime loop | PASS (single mount effect only) |
| Build passes | PASS (`npm run build`) |
| Unit tests pass | PASS (`node --test timelineHydrationSafeTimeContract.test.ts`) |

---

## Acceptance Criteria

- [x] Build passes
- [x] Server and client initial Timeline Time text match (`—` or stable semantic label)
- [x] No direct unstable timestamp in Timeline HUD render path
- [x] Timeline functionality unchanged (no redesign, no removal)
- [x] `suppressHydrationWarning` not used

---

## Definition of Done

Timeline HUD is hydration-safe. ISO timestamps no longer appear during SSR or first client render; live formatted time updates only after client mount inside existing effect-driven hooks.
