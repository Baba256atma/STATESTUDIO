# NW-B:8-5 — Object Click Dashboard Commit Isolation Fix

**Phase:** NW-B:8-5  
**Status:** Complete  
**Date:** 2026-06-20

## Problem

Object click still froze the scene because the click path committed dashboard/workspace state:

```
HomeScreen → commitMrpSelectedObjectFromClick
  → routeDashboardContextFromObjectSelection
  → routeAndCommitDashboardContext
  → dispatch workspace actions
  → [NexoraLoopGuard] write_applied / scene refresh loop
```

Console evidence: `[NexoraLoopGuard] source: object_click action: write_applied reason: changed_object`.

## Architecture Rule Applied

Object click is a **selection event only**. It must not commit dashboard context, dispatch workspace actions, or rewrite scene structure.

## Fix Summary

### 1. Read-only dashboard surface resolver

**File:** `frontend/app/lib/dashboard/dashboardContextBridge.ts`

- Added `resolveDashboardSurfaceForObjectSelection()` — uses `routeDashboardContext` only (no dispatch).
- `routeDashboardContextFromObjectSelection()` is deprecated; it now resolves read-only and traces `dashboard_commit_blocked`.

### 2. Dashboard commit hard guard

**File:** `frontend/app/lib/selection/objectClickDashboardCommitGuard.ts`

- Blocks commits when source is `object_click`, `object` + `object_selected`, or `object_click:*` reason.
- Wired into `routeAndCommitDashboardContext()` in `dashboardContextRouter.ts`.
- Diagnostic: `[NexoraLoopGuard] source: object_click action: dashboard_commit_blocked reason: selection_only_event`.

### 3. Selection context cache (MRP read model)

**File:** `frontend/app/lib/selection/objectClickSelectionContextCache.ts`

Lightweight cache fields:

- `selectedObjectId`
- `selectedObjectName`
- `selectedObjectType`
- `selectedWorkspaceId`
- resolved `dashboardContext` / `surfaceId` (read-only hints for MRP display)

### 4. MRP bridge — publish, not commit

**Files:** `mrpSelectedObjectBridge.ts`, `mrpSelectedObjectBridgeContract.ts`

- Replaced `commitMrpSelectedObjectFromClick` with `publishMrpSelectedObjectFromClick`.
- Publishes selection cache + resolves surface read-only.
- Zero workspace `dispatch` calls on object click.

### 5. HomeScreen integration

**File:** `frontend/app/screens/HomeScreen.tsx`

- Object click path calls `publishMrpSelectedObjectFromClick` instead of workspace commit.
- Removed `[NexoraLoopGuard] write_applied` from object click path.
- `dashboardFocusObjectData` prefers selection cache, then `selectedObjectIdState`, then route object id.

## Expected Flow

```
Object Click
  → selectedObjectId (React selection state)
  → Object Panel open (panel authority)
  → publishObjectClickSelectionContext (cache)
  → MRP reads cache + selectedObjectId props
  → Dashboard content displays
  (no workspace dashboard commit)
```

## Regression Tests

**Files:**

- `frontend/app/lib/selection/objectClickDashboardCommitIsolation.test.ts`
- `frontend/app/lib/selection/mrpSelectedObjectBridge.test.ts`

| Test | Expected |
|------|----------|
| Click object | Selection cache published, no dispatch |
| Rapid 20-object selection | Cache updates only |
| Relationships workspace | Router guard blocks object-selection commits |
| MRP noop | Same object + sources context skips republish |

**Run:**

```bash
cd frontend
node --test app/lib/selection/objectClickDashboardCommitIsolation.test.ts app/lib/selection/mrpSelectedObjectBridge.test.ts app/lib/selection/objectClickSelectionReadOnly.test.ts
npm run build
```

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| `routeDashboardContextFromObjectSelection` no longer commits | ✓ |
| Object click causes zero workspace dashboard writes | ✓ |
| `selectedObjectId` updates | ✓ |
| Object Panel opens | ✓ |
| MRP updates via cache + selection props | ✓ |
| No `write_applied` after object click | ✓ |
| No scene freeze / render loop from dashboard commit | ✓ |
| Build passes | ✓ |

## Tags

- `[NWB85]`
- `[OBJECT_CLICK_DASHBOARD_COMMIT_REMOVED]`
- `[OBJECT_SELECTION_READONLY]`
- `[DASHBOARD_COMMIT_ISOLATED]`
- `[SCENE_LOOP_ELIMINATED]`
- `[NW_B85_COMPLETE]`
