# Nexora Timeline Architecture

Status: Frozen MVP architecture contract.

Scope: Type-C scene-native Timeline runtime, event contract, visibility state, routing, and legacy deprecation boundaries.

This document freezes Timeline as a scene-native runtime component for the Nexora MVP. Future work must preserve this contract unless superseded by an explicit architecture decision.

## 1. Canonical Location

Timeline is scene-native.

Canonical placement:

- inside the Three.js workspace
- bottom scene region
- visually connected to the scene runtime

Timeline is not:

- Left Nav page
- Main Right Panel tab
- separate application route
- modal
- standalone application

Implementation anchors:

- `frontend/app/components/scene/ExecutiveBottomWorkspaceOverlay.tsx`
- `frontend/app/components/scene/ExecutiveTimelineHudOverlay.tsx`
- `frontend/app/components/scene/ExecutiveTimelineHud.tsx`

## 2. Purpose

Timeline represents:

- past
- present
- future

Timeline helps executives answer:

- What happened?
- What is happening now?
- What may happen next?

Timeline responsibilities:

- event visibility
- decision visibility
- scenario visibility
- runtime history
- future projections
- simulation awareness

Timeline is not responsible for:

- editing objects
- source management
- assistant conversations
- dashboard management
- simulation execution
- scenario generation
- forecasting engines
- event ingestion

## 3. Event Contract

Canonical event phase:

```ts
type TimelineEventPhase = "past" | "present" | "future";
```

Canonical event entity:

```ts
interface TimelineEvent {
  id: string;
  title: string;
  phase: TimelineEventPhase;
  timestamp: string;
  description?: string;
  sourceId?: string;
  objectId?: string;
  scenarioId?: string;
}
```

Typed contract: `frontend/app/lib/timeline/timelineArchitectureContract.ts`.

This contract does not implement storage. Existing decision, simulation, governance, and scene HUD event models may adapt into this shape, but they do not replace the architecture contract.

## 4. State Contract

Canonical Timeline state:

```ts
type TimelineState = "hidden" | "collapsed" | "expanded";
```

Definitions:

- `hidden`: Timeline unavailable.
- `collapsed`: minimal timeline view.
- `expanded`: full timeline view.

Rules:

- Timeline supports expand and collapse.
- Timeline remains attached to scene runtime.
- Collapse must not destroy state.
- Expand must not recreate state.
- Current persisted presentation state lives in `frontend/app/lib/workspace/executiveBottomWorkspace.ts`.

## 5. View Mode Compatibility

Architecture supports these future view modes:

- Global Timeline
- Object Timeline
- Scenario Timeline

These are compatibility contracts only. This freeze does not implement new modes.

## 6. Routing Contract

Canonical routing:

Timeline Request
-> Dashboard Context
-> Timeline Context
-> Scene Timeline

Forbidden:

Timeline Request
-> New Main Right Panel Tab

Timeline Request
-> New Application Page

Left Nav relationship:

Selecting Timeline from Left Nav does not create a page and does not create an MRP tab. It activates Dashboard context `timeline`, which activates the scene-native Timeline.

MRP relationship:

Allowed Main Right Panel tabs:

1. Dashboard
2. Assistant

Forbidden Main Right Panel structure:

1. Dashboard
2. Assistant
3. Timeline

## 7. Relationships

Allowed:

- Timeline <-> Scene
- Timeline <-> Dashboard Context
- Timeline <-> Selected Object

Indirect only:

- Timeline <-> Assistant

Timeline may visualize selected-object events, but it must not become Object Panel.

Timeline may visualize scenario creation, execution, comparison, and outcomes, but scenario engines remain separate.

Timeline may display incidents, critical decisions, and executive actions, but War Room logic remains separate.

Sources may generate timeline-worthy events only through the canonical downstream path:

Source
-> Operational Model
-> Timeline Event

Never:

Source
-> Direct Timeline Mutation

## 8. Topology Compatibility

Future topology systems may consume:

- event locations
- event relationships
- object-event connections

This contract only establishes compatibility. It does not implement topology logic.

## 9. Brake Warnings

Canonical brake labels:

- `[Timeline][Brake] Invalid timeline state.`
- `[Timeline][Brake] Invalid timeline event.`
- `[Timeline][Brake] Timeline routing failure.`
- `[Timeline][Brake] Timeline context unavailable.`

Brake helpers live in `frontend/app/lib/timeline/timelineArchitectureContract.ts`.

## 10. Legacy Audit

Known legacy timeline conflicts:

- `frontend/app/components/panels/TimelinePanel.tsx` is a panel-style timeline/simulation surface with backend calls and scenario apply behavior. It is compatibility-only and not the canonical Timeline owner.
- `frontend/app/components/executive/DecisionTimelinePanel.tsx` is a legacy executive/right-panel decision story renderer. Decision timeline data may feed scene Timeline, but this component must not define Timeline architecture.
- `frontend/app/components/governance/DecisionTimelinePanel.tsx` and `frontend/app/components/warroom/DecisionTimeline.tsx` are decision/war-room timeline renderers, not the scene-native runtime owner.
- `frontend/app/components/DecisionTimeline.tsx` and `frontend/app/components/DecisionTimelineHUD.tsx` are older timeline surfaces and should not become standalone Timeline pages.
- `frontend/app/lib/ui/right-panel/rightPanelTypes.ts` still lists `timeline` and `decision_timeline` compatibility views.
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` still maps timeline-like rail tabs and shell sections for migration safety.
- `frontend/app/lib/ui/right-panel/rightPanelRegistry.ts` still registers timeline compatibility entries.
- `frontend/app/screens/HomeScreen.tsx` still contains handlers such as `openCenterComponent("timeline")`, `handleRightPanelOpenTimeline`, and `handleRightPanelOpenDecisionTimeline`; future work should map those requests through Dashboard context `timeline` and the scene-native Timeline.
- `frontend/app/lib/temporal-cognition/multiTimelineStore.ts` and related temporal-cognition modules are engine/cognition stores, not scene Timeline UI state.
- `frontend/app/lib/simulation/timeline/*` contains simulation timeline engines and history helpers; these remain engine/runtime producers, not Timeline UI ownership.
- `frontend/app/lib/governance/decisionTimelineModel.ts` and `frontend/app/lib/governance/buildDecisionTimeline.ts` build decision audit events; they may adapt into Timeline events but do not own Timeline routing.

These systems are identified and classified. They are not aggressively deleted during this freeze.

## 11. Audit Summary

Timeline is frozen as a bottom, scene-native runtime component in the Three.js workspace. It is not a Main Right Panel tab, not a Left Nav page, not a modal, and not a separate route.

The canonical contract now defines Timeline phases, event entity shape, state model, view mode compatibility, routing flow, and brake warnings. Existing timeline panels, right-panel routes, decision timeline renderers, simulation timeline engines, and temporal-cognition stores remain compatibility or producer systems only.

Future Timeline requests must route through Dashboard Context `timeline` and activate the scene Timeline rather than creating new tabs, pages, or direct engine execution paths.
