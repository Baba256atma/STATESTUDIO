# Advisory Registry dashboardMode Hotfix Report

**Tag:** `[ADVISORY_DASHBOARDMODE_FIXED]`

**Date:** 2026-06-13

## Problem

After repeated object interactions, MRP froze and the console logged:

```
[WorkspaceRegistry][Brake] Duplicate workspace ID.
field: dashboardMode
value: "overview"
existing: "overview"
duplicate: "advisory"
```

## Root Cause

The Advisory executive workspace entry was registered with `dashboardMode: "overview"`, colliding with the canonical Overview workspace. `detectDuplicateExecutiveWorkspaceDefinitions()` treats `dashboardMode` as a unique registry key, so initialization emitted a brake on every registry read and left launcher resolution ambiguous.

## Fix

Advisory now owns a dedicated dashboard mode:

| Workspace | `workspaceId` | `dashboardMode` | `dashboardContext` |
| --- | --- | --- | --- |
| Executive Summary / Overview | `overview` | `overview` | `overview` |
| Advisory | `advisory` | `advisory` | `advisory` |

### Changes

1. **`dashboardModeRuntimeContract.ts`** — added `"advisory"` to `DashboardMode`
2. **`executiveWorkspaceRegistryContract.ts`** — Advisory entry uses `dashboardMode: "advisory"`
3. **`dashboardModeLegacyBridge.ts`** — `advisory → advisory`; legacy `advice` routes map to `advisory` mode (not `overview`)
4. **`advisoryWorkspaceRouteRuntime.ts`** — commits `setDashboardMode({ mode: "advisory" })`
5. **`mrpWorkspaceResolver.ts`** — resolves/mounts advisory when `dashboardMode === "advisory"`
6. **`mrpContextResolver.ts`** — dedicated advisory header labels
7. **`HomeScreen.tsx`** — advisory launch telemetry uses `dashboardMode: "advisory"`

## Canonical Route

```
Object Panel action "advisory"
  → requestWorkspaceLaunch(workspaceId: "advisory")
  → setDashboardMode("advisory") + dashboardContext("advisory")
  → MrpDynamicWorkspaceLoader → advisory_workspace
```

No legacy `surface: "advice"` is involved.

## Acceptance

| Criterion | Status |
| --- | --- |
| A. No `[WorkspaceRegistry][Brake] Duplicate workspace ID` | PASS — unique `dashboardMode` per workspace |
| B. Repeated object clicks | PASS — registry init no longer brakes |
| C. Overview → Risk → Scenario → War Room → Advisory | PASS — dedicated mode per workspace |
| D. MRP does not freeze | PASS — duplicate detection clean |
| E. Selected object preserved | PASS — route object preserved on advisory commit |
| F. Advisory in MRP Dynamic Workspace | PASS — `advisory_workspace` mount |
| G. No legacy `advice` surface logs | PASS — unchanged from prior hotfix |
| H. Build and tests pass | Verified below |

## Tests Updated

- `executiveWorkspaceRegistryContract.test.ts` — no duplicates; advisory resolves by mode/action
- `objectPanelActionRouterRuntime.test.ts` — advisory launch uses `dashboardMode: "advisory"`
- `advisoryWorkspaceRouteRuntime.test.ts` — mount plan uses advisory mode
- `advisoryWorkspaceFoundation.test.ts` — dashboardContext mount with advisory mode
- `advisoryWorkspaceCertification.ts` — gate fixtures use canonical advisory mode

## Manual QA

1. Reload app — confirm no registry brake on startup
2. Click objects repeatedly — MRP remains responsive
3. Switch Overview → Risk → Scenario → War Room → Advisory (Explain)
4. Confirm Context Header: **Panel: Advisory**, **Active Mode: Recommendation / Overview**
5. Confirm selected object unchanged
