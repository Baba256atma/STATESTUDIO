# MRP:11:2:5-FIX-2 — Object Click Loop Guard + HUDZone Debounce Report

## Root Cause

Object clicks can enter the right-panel authority path more than once for the same object and same effective MRP state. The repeated path was:

```text
object_click
  -> requestPanelAuthorityOpen
  -> legacy surface redirect
  -> dashboard context update
  -> requestRightPanelOpen / applyPanelControllerRequest
  -> NEXORA_RIGHT_PANEL_WRITE
```

The existing panel signatures caught many equivalent writes, but the redirect path also involved `dashboardContext` and legacy redirect diagnostics. Those values were not part of the plain right-panel state no-op check, so the same object click could repeatedly emit redirect/write diagnostics even when the right panel was already on the same dashboard view/context.

## Repeated Writer Found

The repeated writer was `HomeScreen.requestPanelAuthorityOpen`, with `HomeScreen.setRightPanelState` as the lower-level commit backstop.

The noisy pattern matched:

```text
prevView: dashboard
nextView: dashboard
same contextId
source: object_click
same dashboardContext
```

## Idempotent Guard Implementation

Added an object-click write guard in `HomeScreen.requestPanelAuthorityOpen` before legacy redirect warnings, dashboard context dispatch, and right-panel open requests.

The guard compares:

- previous view
- next view
- previous context id
- next context id
- source
- dashboard context

If all are equivalent for `object_click`, the request returns early and logs:

```text
[NEXORA_RIGHT_PANEL_WRITE_SKIPPED]
reason=same_state_object_click

[NexoraLoopGuard]
source=object_click
action=write_skipped
reason=same_state
```

A lower-level `setRightPanelState` guard now also skips identical object-click writes before React state is touched.

## Redirect Debounce

Repeated legacy redirect diagnostics for the same object-click redirect signature are suppressed within the same short interaction window. This stabilizes:

- `[Nexora][LegacySurfaceBlocked]`
- `[Nexora][DashboardRedirect]`
- `[Nexora][DeprecatedSurface]`

Real object changes still pass through and log as applied:

```text
[NexoraLoopGuard]
source=object_click
action=write_applied
reason=changed_object
```

## Selection Miss / Same Object Guard

The object-selection dashboard context commit now skips same-object `sources` commits. Empty canvas or duplicate same-object selection no longer triggers another dashboard rewrite unless the canonical selected object actually changes.

## HUDZoneBrake Debounce Strategy

`[Nexora][HUDZoneBrake]` now uses a dedicated brake signature:

```text
objectPanelRight + objectPanelWidth + mrpWidth + sceneWidth + overlapDetected
```

The brake warning logs once per unique brake signature. A separate debounced trace reports whether the brake warning was emitted or suppressed:

```text
[NexoraHUDZoneDebounce]
signature=...
logged=true/false
```

This does not change HUD layout math or scene topology.

## Runtime Validation

Validated focused runtime pieces:

```bash
node --test app/lib/runtime/rightPanelWriteGuard.test.ts
npx vitest run app/lib/scene/sceneHudZoneContract.test.ts
npm run build
```

Note: `sceneHudZoneContract.test.ts` is a Vitest test file, so direct `node --test` fails with missing Vitest package resolution. The proper Vitest runner passed.

## Build Result

`npm run build` passed. The only output was the existing `baseline-browser-mapping` age warning.

