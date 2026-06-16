# Object Panel Focus Lock Hotfix Report

**Tag:** `[OBJECT_PANEL_FOCUS_LOCK_FIXED]`

**Date:** 2026-06-13

## Problem

After clicking **Focus** in the Object Panel / SceneActionDock, subsequent object panel buttons (Analyze, Compare, Scenario, War Room) stopped working.

Console showed repeated brakes:

```
[WorkspaceLauncherState][Brake]
message: "Already active workspace."
workspaceId: "focus"
source: "object_panel"
```

Secondary logs also showed legacy `sub_button` redirects with `dashboardContext: "overview"`.

## Root Cause

The object panel execution path in `HomeScreen.applyObjectPanelRouteRef` had two defects:

1. **Synthetic launch bypass** — After `routeObjectPanelActionRequest()` called `requestWorkspaceLaunch()`, HomeScreen discarded the approved launch result and re-built a synthetic launch with `objectPanelAction: null` and mode resolved indirectly. That dropped explicit action identity and could desynchronize transition approval from execution.

2. **Silent transition commit failure** — `executeApprovedWorkspaceLaunchRef` dispatched `setDashboardMode` even when `commitExecutiveWorkspaceTransition()` failed. That left the transition controller in a `completed` state without a committed lifecycle, blocking later workspace switches and causing repeated launch attempts against stale focus state.

Each button click in `SceneActionDock` and `ExecutiveActionPanel` already emitted the correct action via `emitObjectPanelActionRequest()`. The lock was in the HomeScreen execution layer, not in the UI emitters.

## Fix

### 1. Explicit action resolution + single launch path

Added `resolveObjectPanelActionRequest()` and `launchObjectPanelActionRequest()` in `objectPanelActionRouterRuntime.ts`.

Each click now:

1. Normalizes the incoming action (`focus`, `analyze`, legacy `focus_object`, etc.)
2. Calls `requestWorkspaceLaunch()` once with that explicit `objectPanelAction`
3. Executes the returned launch result directly (no synthetic rebuild)

### 2. Preserve action identity through execution

`applyObjectPanelRouteRef` now passes the normalized action through to `executeApprovedWorkspaceLaunchRef` via `launch.objectPanelAction`.

### 3. Fail closed on transition commit

If lifecycle commit fails after dashboard dispatch, execution now returns `false` and logs a router brake. This prevents orphaned transition state from locking later actions.

### 4. Improved launcher brake diagnostics

`requestWorkspaceLaunch()` now includes `objectPanelAction` in the `already_active` brake payload so repeated same-workspace clicks are distinguishable from cross-workspace switch attempts.

## Files Changed

| File | Change |
|------|--------|
| `frontend/app/lib/object-panel/objectPanelActionRouterContract.ts` | Added `[OBJECT_PANEL_FOCUS_LOCK_FIXED]` tag; extended route result with `action` + `launch` |
| `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.ts` | Added resolve/launch helpers; route returns explicit action + launch |
| `frontend/app/screens/HomeScreen.tsx` | Fixed `applyObjectPanelRouteRef` + commit failure handling |
| `frontend/app/lib/dashboard/workspaceLauncher/workspaceLauncherRuntime.ts` | Preserve requested action in approved/brake payloads |
| `frontend/app/lib/object-panel/objectPanelActionRouterRuntime.test.ts` | Acceptance tests for focus → analyze → scenario → war_room chain |

## Acceptance Results

| Step | Action | Expected | Result |
|------|--------|----------|--------|
| A | Select object | Object context available | PASS |
| B | Click Focus | `workspaceId: focus` | PASS |
| C | Click Analyze | Switch to `analyze` | PASS |
| D | Click Scenario | Switch to `scenario` | PASS |
| E | Click War Room | Switch to `war_room` | PASS |
| F | Repeat Focus while focus active | May log `already_active focus` | PASS |
| G | Different button after Focus | Must not log `already_active focus` | PASS |

## Test Commands

```bash
cd frontend && node --test app/lib/object-panel/objectPanelActionRouterContract.test.ts app/lib/object-panel/objectPanelActionRouterRuntime.test.ts
cd frontend && node --test app/lib/dashboard/workspaceLauncher/workspaceLauncherRuntime.test.ts
cd frontend && npm run build
```

## Notes

- Certified workspace contracts unchanged.
- Scene reset not triggered.
- Selected object context preserved via `routeObject` on each launch.
- Legacy `sub_button` + `overview` redirects remain for non-dashboard executive actions (Explain, Dependencies, etc.) and are separate from the dashboard workspace launcher path.
