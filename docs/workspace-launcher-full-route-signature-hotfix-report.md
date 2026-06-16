# Workspace Launcher Full Route Signature Hotfix Report

**Tag:** `[WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED]`

**Date:** 2026-06-13

## Problem

MRP froze or showed stale workspace bodies after object panel action switches. Console logged premature brakes:

```
[WorkspaceLauncherState][Brake]
message: "Already active workspace."
workspaceId: "advisory"
objectPanelAction: "advisory"
```

and similarly for `focus`, even when the route context had changed (different object, different action, or different dashboard context).

## Diagnosis

`requestWorkspaceLaunch` braked when **only** `workspaceId` matched the active lifecycle workspace. MRP route identity is richer than `workspaceId` alone:

- `dashboardContext`
- `selectedObjectId`
- `objectPanelAction`
- `source`
- `mountKey` (derived)
- `routeGeneration` (tracking only — excluded from equality)

Same `workspaceId` with a different object or action must refresh the route, not brake.

## Fix

| Change | Detail |
|--------|--------|
| Full route signature contract | `workspaceLauncherRouteSignatureContract.ts` |
| Signature-aware brake | Brake only when lifecycle is active **and** full signature matches |
| Route recording | Approved launches record active signature + increment generation |
| Brake system preserved | No global guard bypass; brake still fires on identical routes |

### Full route signature fields (equality)

- `workspaceId`
- `dashboardContext`
- `selectedObjectId`
- `objectPanelAction`
- `source`
- `mountKey`

`routeGeneration` increments on each approved launch but is **not** part of equality (same route may be re-recorded).

## Files Changed

| File | Change |
|------|--------|
| `workspaceLauncherRouteSignatureContract.ts` | Signature build, serialize, equality |
| `workspaceLauncherRuntime.ts` | Signature-aware brake + route recording |
| `workspaceLauncherRouteSignature.test.ts` | Contract regression tests |
| `workspaceLauncherRuntime.test.ts` | Advisory/focus/object refresh acceptance tests |

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| A | Open Advisory | **Pass** |
| B | Click another object → Advisory updates context | **Pass** (signature differs → approved) |
| C | Click Focus → header and body change to Focus | **Pass** (workspaceId differs → approved) |
| D | Click Advisory again on same object → brake allowed | **Pass** |
| E | Click Advisory on different object → no stale brake | **Pass** |
| F | Scenario / Risk / War Room after Advisory → body changes | **Pass** |
| G | No frozen Advisory Overview | **Pass** |
| H | No duplicate dashboardMode warnings | **Pass** (unchanged) |
| I | No legacy advice surface warnings | **Pass** (unchanged) |
| J | Build passes | **Pass** |

## Tests

```bash
cd frontend && node --test \
  app/lib/dashboard/workspaceLauncher/workspaceLauncherRouteSignature.test.ts \
  app/lib/dashboard/workspaceLauncher/workspaceLauncherRuntime.test.ts
```

**Result:** 15 / 15 PASS

## Build

```bash
cd frontend && npm run build
```

**Result:** PASS

## Tag Verification

Brake detail payload now includes `selectedObjectId`, `dashboardContext`, `mountKey`, and `routeGeneration` for diagnostics.

Freeze tag: `[WORKSPACE_LAUNCHER_FULL_ROUTE_SIGNATURE_FIXED]`
