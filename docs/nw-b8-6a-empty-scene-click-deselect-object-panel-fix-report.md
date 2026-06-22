# NW-B:8-6A Empty Scene Click Deselect Object Panel Fix

**Project:** Nexora Type-C

## Problem

Clicking an object opened the Object Panel and populated MRP selection context, but clicking empty scene/canvas did nothing. Selection and panel state could remain stuck even when focus/highlight signatures were already cleared.

## Root Cause

The empty-canvas handler in `HomeScreen.handleSelectedChange` returned early when `buildSelectionSignature({ focusedId: null, highlightedIds: [] })` matched the previous signature. That signature does not include `selectedObjectIdState`, so object selection and the Object Panel could remain active while the handler exited as a no-op.

## Solution

Added `frontend/app/lib/selection/emptySceneClickDeselectRuntime.ts` with read-only deselect helpers:

- `hasPendingEmptySceneDeselectWork()` — detects remaining selection, MRP read cache, or open object panel work
- `shouldCloseObjectPanelOnEmptySceneDeselect()` — closes only object/executive_object/object_focus panels
- `clearEmptySceneDeselectReadModels()` — clears object-click selection cache and pointer gate
- `traceEmptySceneClickDeselect()` — emits throttled `[NexoraLoopGuard] action: selection_cleared reason: deselect_only`

### Empty scene click behavior (read-only)

Allowed:

- `selectedObjectId = null`
- Object Panel closes
- MRP object-click read cache clears
- Workspace `clearSelection` (selection fields only)
- Inspector selection info clears

Not allowed:

- `sceneJson` write
- relationship/topology write
- dashboard route commit
- scene hydration / parity correction

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/selection/emptySceneClickDeselectRuntime.ts` | New deselect runtime |
| `frontend/app/lib/selection/nexoraObjectClickTransaction.ts` | `clearPointerSelectionGate()` |
| `frontend/app/lib/runtime/nexoraLoopGuardDiagnostics.ts` | `selection_cleared` action |
| `frontend/app/screens/HomeScreen.tsx` | Wired deselect + panel close path |

## Tests

```bash
cd frontend
node --test app/lib/selection/emptySceneClickDeselectRuntime.test.ts
npm run build
```

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Empty scene clears `selectedObjectId` | PASS |
| Object Panel closes | PASS |
| MRP selected object clears | PASS |
| Relationships unchanged | PASS |
| Scene objects unchanged | PASS |
| No sceneJson write | PASS |
| No dashboard commit | PASS |
| LoopGuard uses `selection_cleared` / `deselect_only` | PASS |
| Build passes | PASS |

## Tags

`[NWB86A_EMPTY_SCENE_DESELECT_FIX]` `[OBJECT_PANEL_CLOSE_ON_DESELECT]` `[SELECTION_CLEAR_READONLY]` `[NO_SCENE_WRITE_ON_DESELECT]` `[NW_B86A_COMPLETE]`
