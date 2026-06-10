# MRP:11:2:5-FIX-3 — Dashboard Render Loop Guard Report

## Root Cause

`DashboardRuntimePanel` was not logging directly inside the render body, but its effect logged:

```text
[MRP10RuntimeTrace] DashboardRuntimePanel mounted
```

with dependencies that included `props.legacyHost`. `legacyHost` is a React node created by `HomeScreen`, so object-click renders could change its identity even while the Dashboard runtime suppressed it. That made a non-mount effect rerun look like a repeated mount.

`MainRightPanelShell` had the same misleading pattern: a dependency-based effect emitted `MainRightPanelShell mounted` when runtime state changed.

## Fixes

- Moved true `DashboardRuntimePanel mounted` logging into a mount-only effect.
- Added:

```text
[NexoraDashboardMountStable]
component=DashboardRuntimePanel
mountCount=1
```

- Guarded the mount effect against React dev Strict Mode double-invocation so `mountCount=1` remains stable per component instance.
- Added a signature-gated runtime trace effect for dashboard mode / route object / rendering changes.
- Added:

```text
[NexoraDashboardRenderGuard]
action=skipped
reason=same_dashboard_state
```

when duplicate dashboard/object-click writes are skipped.

- Stopped `HomeScreen` from creating and passing `legacyDashboardHost` while the current dashboard mode suppresses legacy host rendering.
- Kept Dashboard Home visible and did not change Dashboard Home behavior.
- Kept Assistant layout untouched.

## Idempotent Object Click Guard

The previous object-click loop guard now also reports dashboard render skips when the write is equivalent:

- same active dashboard state
- same context id
- same object-click source
- same dashboard context

Repeated clicks on the same object now skip duplicate dashboard/right-panel writes. A different object still applies one state change.

## Validation

Validated with:

```bash
npx vitest run app/lib/scene/sceneHudZoneContract.test.ts
node --test app/lib/runtime/rightPanelWriteGuard.test.ts
npm run build
```

## Build Result

`npm run build` passed. The only output was the existing `baseline-browser-mapping` age warning.
