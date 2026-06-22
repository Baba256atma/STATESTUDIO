# NW-B:8-4 — Object Click Selection Read-Only Fix

**Phase:** NW-B:8-4  
**Status:** Complete  
**Date:** 2026-06-20

## Problem

Clicking a scene object caused Nexora to freeze or loop. Console evidence showed `[NexoraLoopGuard]` with `source: object_click`, `action: write_applied`, and empty `relationshipIds`, indicating object click was triggering structural scene rewrites instead of selection-only updates.

## Root Cause

1. **Scene write path lacked an object-click guard** — `applySceneChangeSafe` could commit structural mutations while an object-click transaction was active or when the write source was object-click related.
2. **Parity signature used stale relationship source** — `relationshipIdsForParity` read from shell `sceneJson` instead of `effectiveVisibleSceneJson`, producing empty `relationshipIds` in workspace mode where relationships live on the visible workspace scene.
3. **Selection and scene mutation were not fully separated** — object click path needed explicit bridges for Object Panel and MRP context that do not touch scene structure.

## Fix Summary

### 1. Object selection read-only guard

**File:** `frontend/app/lib/selection/objectClickSelectionReadOnlyGuard.ts`

- Blocks structural and selection-only `sceneJson` writes when source is `object_click`, `object_click:*`, or `pointer_object_click`.
- Blocks structural writes from any source during an active object-click transaction (180ms window).
- Emits diagnostic: `[NexoraLoopGuard] source: object_click action: structural_write_blocked reason: selection_only`.
- Provides `readRelationshipIdsForSceneParity()` for parity signatures from the visible scene.

### 2. Scene write block wired into apply controller

**File:** `frontend/app/screens/hooks/scene/useSceneApplyController.ts`

- Evaluates `evaluateObjectClickSceneWriteGuard()` at the top of `applySceneChangeSafe` before any scene mutation commits.
- Emits `object_click_scene_write_blocked` diagnostic when blocked.

### 3. Relationship parity fix

**File:** `frontend/app/screens/HomeScreen.tsx`

- `relationshipIdsForParity` now reads from `effectiveVisibleSceneJson ?? sceneJson` via `readRelationshipIdsForSceneParity()`.
- Preserves relationship ids in parity signatures after object click.

### 4. Object panel selection bridge

**File:** `frontend/app/lib/selection/objectPanelSelectionBridge.ts`

- `buildObjectPanelSelectionOpenRequest()` — canonical deferred object panel open request.
- `shouldOpenObjectPanelForSelection()` — dedupes panel opens when object panel is already open for the same object.

### 5. MRP selected object bridge

**File:** `frontend/app/lib/selection/mrpSelectedObjectBridge.ts`

- `commitMrpSelectedObjectFromClick()` — routes MRP dashboard context from object selection without scene writes.
- `shouldCommitMrpSelectedObjectContext()` — no-op guard for same object + `sources` context.
- `buildMrpSelectedObjectContext()` — selected object label for MRP display.

### 6. HomeScreen integration

- `beginObjectClickSelectionTransaction` / `endObjectClickSelectionTransaction` wrap object click commit.
- MRP context updates use `commitMrpSelectedObjectFromClick`.
- Deferred panel open uses `buildObjectPanelSelectionOpenRequest`.

## Expected Flow (After Fix)

```
User clicks object
  → selectedObjectId updates (React selection state)
  → Object Panel opens (panel authority, read-only toward scene)
  → MRP receives selected object context
  → sceneJson / relationships / workspace model unchanged
```

## Regression Tests

**File:** `frontend/app/lib/selection/objectClickSelectionReadOnly.test.ts`

| # | Scenario | Result |
|---|----------|--------|
| 1 | Approved workspace with objects and relationships | Pass |
| 2 | Click object (simulated guard) | Pass |
| 3 | selectedObjectId changes | Pass (selection state separate from scene) |
| 4 | Structural signature stable when blocked | Pass |
| 5 | Relationships remain | Pass |
| 6 | Object panel open request built | Pass |
| 7 | Different object click | Pass |
| 8 | No repeated structural write | Pass (guard blocks) |

**Run:**

```bash
cd frontend
node --test app/lib/selection/objectClickSelectionReadOnly.test.ts
npm run build
```

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Clicking object does not rewrite sceneJson | ✓ |
| Clicking object does not clear relationships | ✓ |
| relationshipIds remain stable after click | ✓ |
| selectedObjectId updates | ✓ |
| Object Panel opens | ✓ |
| MRP receives selected object | ✓ |
| No NexoraLoopGuard write loop | ✓ |
| No page freeze | ✓ (structural writes blocked) |
| Build passes | ✓ |

## Tags

- `[NWB84_OBJECT_CLICK_READONLY_FIX]`
- `[OBJECT_SELECTION_READONLY]`
- `[SCENE_WRITE_LOOP_BLOCKED]`
- `[RELATIONSHIPS_PRESERVED_ON_CLICK]`
- `[OBJECT_PANEL_RESTORED]`
- `[NW_B84_COMPLETE]`
