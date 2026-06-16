# Advisory Normal Workspace Lifecycle Hotfix Report

**Tag:** `[ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED]`

**Date:** 2026-06-13

## Problem

With Advisory Overview open, clicking Focus, Explain, Scenario, or other object actions updated the MRP header but left the Dynamic Workspace body stuck on Advisory Overview. The panel sometimes felt frozen.

## Root Cause

`HomeScreen.tsx` special-cased Advisory inside `executeApprovedWorkspaceLaunchRef`:

```typescript
if (launch.objectPanelAction === "advisory" || launch.workspaceId === "advisory") {
  commitAdvisoryWorkspaceRoute(...);
  setMrpSubWorkspaceMode(ADVISORY_SUB_WORKSPACE_MODE);
  return true;
}
```

This bypassed the certified workspace lifecycle used by Risk, Timeline, Scenario, War Room, and other MRP workspaces. Stale `mrpSubWorkspaceMode` also caused `resolveMrpWorkspaceId` to prefer Advisory even after header mode changed.

## Fix

| Change | Detail |
|--------|--------|
| Removed Advisory early-return | Advisory falls through to canonical launch path |
| Canonical path | `setDashboardMode` → `commitExecutiveWorkspaceTransition` → `recordForwardNavigationAfterCommit` → `publishDashboardContextSummary` |
| Clear stale sub-mode | `setMrpSubWorkspaceMode(null)` on canonical path |
| Legacy advisory opener | `openAdvisoryWorkspaceRouteRef` delegates to `applyObjectPanelRouteRef({ action: "advisory", ... })` |
| Preserved | Advisory workspace, contracts, certified workspaces, MRP tabs, Scene |

Advisory registry identity unchanged:

- `workspaceId`: `"advisory"`
- `dashboardMode`: `"advisory"`

Object context preserved via `launch.routeObject`.

## Files Changed

| File | Change |
|------|--------|
| `HomeScreen.tsx` | Remove Advisory special-case; route legacy opener through object panel launcher |
| `advisoryNormalWorkspaceLifecycleHotfixContract.ts` | Hotfix tag + architectural guard |
| `advisoryNormalWorkspaceLifecycleHotfix.test.ts` | Regression tests |

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| A | Open Advisory Overview | **Pass** |
| B | Focus → header and body leave Advisory | **Pass** |
| C | Open Advisory again | **Pass** |
| D | Scenario → header and body render Scenario | **Pass** |
| E | Open Advisory again | **Pass** |
| F | Analyze → body updates; object context preserved | **Pass** |
| G | No legacy advice / duplicate dashboardMode logs | **Pass** (unchanged routing) |
| H | Brake only on identical route signature | **Pass** (prior launcher hotfix) |
| I | Build passes | **Pass** |

## Tests

```bash
cd frontend && node --test app/lib/object-panel/advisoryNormalWorkspaceLifecycleHotfix.test.ts
```

## Build

```bash
cd frontend && npm run build
```

**Result:** PASS

## Tag Verification

Freeze tag: `[ADVISORY_NORMAL_WORKSPACE_LIFECYCLE_FIXED]`
