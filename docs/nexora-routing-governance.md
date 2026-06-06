# Nexora Routing Governance

Status: Frozen MVP architecture contract.

Scope: Cross-panel navigation ownership between Left Nav, Main Right Panel, Dashboard Context, Scene Panel, Object Panel, Timeline, and Assistant.

This document freezes the navigation rules for Nexora Type-C MVP. Future routing work must preserve this contract unless superseded by an explicit architecture decision.

## 1. Core Principle

Nexora has one predictable navigation system.

Every click must do one of these:

- change executive mode
- change Dashboard Context
- select scene object
- open a scene-native panel
- ask Assistant

No click may create hidden routes, new panels, new Main Right Panel tabs, or duplicated route state.

Typed contract: `frontend/app/lib/routing/nexoraRoutingContract.ts`.

## 2. Canonical Owners

Left Nav owns executive mode:

- Sources
- Dashboard
- Scenario
- Risk
- War Room
- Timeline
- Settings

Left Nav changes Dashboard Context. It does not create Main Right Panel tabs.

Main Right Panel owns active tab and Dashboard content display. Allowed tabs:

```ts
type MainRightPanelTab = "dashboard" | "assistant";
```

Dashboard Context owns executive content inside Dashboard:

```ts
type DashboardContext =
  | "overview"
  | "sources"
  | "scenario"
  | "risk"
  | "war_room"
  | "timeline"
  | "settings";
```

Scene Panel owns scene-level information, scene-level controls, and Object Catalog entry. Scene Panel actions may request Dashboard Context changes but must not create MRP tabs.

Object Panel owns selected-object information and object-level actions. Object Panel actions may request Dashboard Context changes but must not create MRP tabs.

Timeline owns scene-native temporal runtime. Timeline is activated through Dashboard Context and scene runtime; it is not a page and not an MRP tab.

Assistant owns conversation, explanation, and recommendations. Assistant tab remains isolated and must not be remounted by Dashboard Context changes.

## 3. Route Request Contract

Canonical request:

```ts
type RouteRequestSource =
  | "left_nav"
  | "scene_panel"
  | "object_panel"
  | "timeline"
  | "assistant"
  | "system";

type RouteRequestTarget =
  | "dashboard"
  | "assistant"
  | "scene"
  | "object"
  | "timeline";

interface NexoraRouteRequest {
  source: RouteRequestSource;
  target: RouteRequestTarget;
  dashboardContext?: DashboardContext;
  objectId?: string;
  timelineMode?: "global" | "object" | "scenario";
  reason?: string;
}
```

Default route is SSR/client stable:

- MRP tab: `dashboard`
- Dashboard Context: `overview`
- selected object: `null`
- scene timeline active: `false`

Defaults must not be time-dependent, random, or derived from browser-only state during SSR.

## 4. Resolution Rules

If target is `dashboard`:

- activate MRP Dashboard tab
- set Dashboard Context

If target is `assistant`:

- activate MRP Assistant tab
- do not reset Dashboard Context

If target is `timeline`:

- keep MRP Dashboard tab active
- set Dashboard Context to `timeline`
- activate scene-native Timeline

If target is `object`:

- update selected object
- update Object Panel
- do not create MRP tab

If route is invalid:

- fallback to Dashboard / overview
- emit brake warning

## 5. Allowed Flows

Left Nav
-> Dashboard Context
-> MRP Dashboard Content

Scene Action
-> Dashboard Context
-> MRP Dashboard Content

Object Action
-> Dashboard Context
-> MRP Dashboard Content

Timeline Request
-> Dashboard Context
-> Scene Timeline Runtime

Assistant Tab
-> Assistant Runtime

Forbidden:

- Any Action -> Create New MRP Tab
- Any Action -> Create New Full Page
- Any Action -> Direct Engine Execution

## 6. Legacy Route Governance

Legacy values are compatibility inputs only:

- `operational_topology`
- `live_operations`
- `war`
- `war_room`
- `risk_view`
- `executive_control`
- `ops`
- `rsk`
- `exe`
- `ctrl`
- `canonical_route`
- `routed_panel`
- `panel_view`

Rules:

- map to canonical route request
- mark deprecated
- prevent new panel creation
- prevent third MRP tab creation

Current legacy mappings live in:

- `frontend/app/lib/ui/mainRightPanelContract.ts`
- `frontend/app/lib/ui/nexoraLeftNavContract.ts`
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts`

## 7. State Safety

Canonical route state is:

- `MainRightPanelTab`
- `DashboardContext`
- selected object id
- scene-native Timeline state

Duplicate state identified during audit:

- `HomeScreen.rightPanelState.view`: legacy right-panel compatibility view.
- `HomeScreen.activeMode`: product/chat mode, not executive navigation mode.
- `HomeScreen.selectedObjectIdState`: canonical selected-object authority for MVP.
- `objectSelection` payload in `HomeScreen`: selection highlight mirror.
- `rightPanelRouter` legacy tabs and shell sections: compatibility routing only.
- `NexoraShell` inspector section state: shell UI compatibility state, not route authority.
- Center component state in `HomeScreen`: deprecated execution surface compatibility state.

Future work must not add another active mode, right panel view, dashboard context, selected panel, or tab state.

## 8. Brake Warnings

Canonical brake labels:

- `[Routing][Brake] Invalid route request.`
- `[Routing][Brake] Unauthorized MRP tab requested.`
- `[Routing][Brake] Legacy route detected.`
- `[Routing][Brake] Dashboard context resolution failed.`
- `[Routing][Brake] Duplicate route state detected.`

Brake helpers live in `frontend/app/lib/routing/nexoraRoutingContract.ts`.

## 9. Audit Summary

Cross-panel routing is frozen around a single route request contract. The Main Right Panel still has exactly two tabs: Dashboard and Assistant. Dashboard Context carries executive context. Scene Panel, Object Panel, and Timeline may request Dashboard Context changes, but they must not create MRP tabs or execute engines directly.

Legacy right-panel route values remain in the codebase for migration safety. They are deprecated compatibility inputs and now map toward canonical Dashboard Context routing. Timeline remains scene-native; Assistant remains isolated; invalid or unauthorized routes fall back to Dashboard / overview with brake warnings.
