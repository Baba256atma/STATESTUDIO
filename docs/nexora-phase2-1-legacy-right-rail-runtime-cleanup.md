# Nexora Phase 2:1 Legacy Right-Rail Runtime Cleanup

Scope: Main Right Panel runtime cleanup and enforcement after the Phase 1 architecture smoke test.

This document freezes the Phase 2:1 runtime rule: the Main Right Panel exposes exactly Dashboard and Assistant for the MVP. The legacy right-rail render system may remain in the codebase only as disconnected compatibility code.

## Canonical Runtime Contract

Allowed MRP runtime tabs:

- Dashboard
- Assistant

Dashboard is the only renderable view inside the legacy right-panel host. Assistant remains isolated in the assistant panel shell and is not routed through right-panel views.

Forbidden runtime surfaces:

- Scene
- Objects
- Focus
- Timeline right-panel view
- Risk right-panel view
- War Room right-panel view
- Advice, Conflict, Replay, Memory, Scenario Tree, Compare, Simulation, and other deprecated router-driven right-panel views
- Legacy right-rail action groups and compatibility subtabs

Deprecated requests must redirect safely to Dashboard and may carry Dashboard Context metadata.

## Runtime Enforcement

Canonical enforcement module:

- `frontend/app/lib/ui/mainRightPanelRuntimeEnforcement.ts`

Required brakes:

- `[Nexora][MRP]`
- `[Nexora][LegacySurfaceBlocked]`
- `[Nexora][DashboardRedirect]`

Runtime enforcement points:

- `frontend/app/components/NexoraShell.tsx`
  - Filters inspector subtabs so only the Dashboard-compatible entry is mounted.
  - Redirects shell panel events to Dashboard before dispatching `nexora:open-right-panel`.

- `frontend/app/screens/HomeScreen.tsx`
  - Redirects all non-Dashboard panel authority requests to Dashboard.
  - Preserves legacy request information as metadata only.

- `frontend/app/components/right-panel/RightPanelHost.tsx`
  - Normalizes the effective render view to Dashboard before payload builders and switch cases run.
  - Blocks legacy host surfaces from rendering or hydrating.

## Legacy Audit

Identified legacy architecture:

- `NexoraShell` Dashboard group previously rendered `Scene`, `Objects`, and `Focus` right-rail subtabs.
- `NexoraShell.setInspectorSection` previously dispatched legacy views such as `workspace`, `object`, `object_focus`, `risk`, `fragility`, and `replay`.
- `HomeScreen.requestPanelAuthorityOpen` previously accepted normalized legacy right-panel views as active MRP state.
- `RightPanelHost` still contains legacy render cases for object, scene, timeline, risk, war room, advice, conflict, replay, memory, simulation, compare, and governance panels.
- `rightPanelRouter` and related debug tooling still describe legacy route mappings.

Classification:

- Runtime visible controls: deprecated and disconnected.
- Event/router compatibility inputs: deprecated and redirected.
- Legacy render cases in `RightPanelHost`: deprecated and blocked by host-level runtime normalization.
- Legacy docs/debug references: compatibility metadata only.

## Acceptance Summary

- Legacy right-rail buttons are not mounted by the shell subnav.
- Deprecated MRP view requests redirect to Dashboard.
- RightPanelHost can only render Dashboard at runtime.
- Legacy panel code remains temporarily for compatibility, but cannot own active MRP runtime state.
- Scene, Object, Timeline, War Room, and Simulation actions must route through Dashboard Context or their scene-native surfaces.
