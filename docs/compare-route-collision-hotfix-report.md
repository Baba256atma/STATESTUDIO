# Compare Route Collision Hotfix Report

Freeze tag: `[COMPARE_ROUTE_COLLISION_FIXED]`

## Objective

Fix the Compare button route collision where Compare could share Scene/Overview/Scenario route identity and render Scenario content instead of dedicated Compare content.

## Root Cause

Compare was registered as a distinct executive workspace and dashboard mode, but the legacy dashboard context bridge mapped `dashboardMode: "compare"` to `dashboardContext: "scenario"`. The MRP workspace resolver then routed `dashboardMode: "compare"` to the certified Scenario workspace mount, causing Compare and Scenario to share part of the route/content identity.

## Fix

- Added canonical `dashboardContext: "compare"` support across main right panel routing, dashboard mode legacy bridge, route whitelist, dashboard context normalization, surface mapping, accordion presets, and MRP context header labels.
- Added a dedicated MRP workspace identity for Compare with `workspaceId: "compare"` and `mountTarget: "dashboard_runtime"`, allowing existing `CompareWorkspaceShell` content to render through Dashboard Runtime.
- Preserved Scenario routing as `workspaceId: "scenario"`, `dashboardMode: "scenario"`, `dashboardContext: "scenario"`, and `scenario_workspace`.
- Preserved selected object context through existing launcher `routeObject` and workspace state propagation.
- Did not modify certified Scenario workspace, Scene topology, or SVIE layers.

## Acceptance Results

- A. Scene/Overview remains routed to overview/executive summary context.
- B. Compare resolves to `workspaceId: "compare"`, `dashboardMode: "compare"`, `dashboardContext: "compare"`, `objectPanelAction: "compare"`.
- C. Scenario remains distinct as `workspaceId: "scenario"`, `dashboardMode: "scenario"`, `dashboardContext: "scenario"`.
- D. Sequence `Compare -> Scenario -> Compare -> War Room -> Compare` passes in router regression coverage.
- E. Compare transitions no longer share Scenario route signature.
- F. Exact duplicate Compare click on the same object is the only expected `already_active` brake.
- G. Header and content both resolve to Compare via MRP context header and Dashboard Runtime Compare shell.
- H. Selected object context remains preserved through `routeObject`.
- I. Focused tests and production build pass.

## Verification

- `node --test frontend/app/lib/object-panel/objectPanelActionRouterRuntime.test.ts frontend/app/lib/dashboard/workspaceLauncher/workspaceLauncherRouteSignature.test.ts frontend/app/lib/ui/mrpWorkspace/mrpWorkspaceLoader.test.ts frontend/app/lib/dashboard/compare/compareModeContract.test.ts frontend/app/lib/dashboard/workspaceLauncher/workspaceLauncherRuntime.test.ts frontend/app/lib/dashboard/executiveWorkspaceRegistryContract.test.ts` — pass, 62 tests.
- `npm --prefix frontend run build` — pass.
- Direct ESLint on changed files — pass. Existing config emits a pages-directory warning only.
- Full `tsc -p frontend/tsconfig.json --noEmit` still reports unrelated pre-existing project-wide issues, primarily missing Vitest types and unrelated test fixture typing; no errors referenced the touched route files.

