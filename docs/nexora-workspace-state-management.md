# Nexora Workspace State Management

Status: Frozen MVP architecture contract.

Scope: Type-C workspace state coordination across Left Nav, Main Right Panel, Dashboard Context, Scene Panel, Object Panel, Timeline, and Object Catalog.

This document freezes the canonical workspace state and panel synchronization rules for the Nexora MVP. Future work must preserve this contract unless superseded by an explicit architecture decision.

## 1. Core Principle

Nexora has one source of truth for workspace coordination.

Panels synchronize through `NexoraWorkspaceState`, not through direct panel-to-panel mutation or duplicated local route state.

Typed contract: `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts`.

## 2. Canonical State

```ts
interface NexoraWorkspaceState {
  activeLeftNavMode: NexoraLeftNavMode;
  activeMRPTab: MainRightPanelTab;
  dashboardContext: DashboardContext;
  scenePanelState: ScenePanelState;
  objectPanelState: ObjectPanelState;
  selectedObjectId: string | null;
  timelineState: TimelineState;
  objectCatalogState: ObjectCatalogState;
}
```

## 3. Stable Defaults

Defaults must be identical on server and client:

```ts
const DEFAULT_NEXORA_WORKSPACE_STATE = {
  activeLeftNavMode: "dashboard",
  activeMRPTab: "dashboard",
  dashboardContext: "overview",
  scenePanelState: "expanded",
  objectPanelState: "empty",
  selectedObjectId: null,
  timelineState: "collapsed",
  objectCatalogState: "closed",
};
```

Rules:

- no `localStorage` during initial render
- no `window` during initial render
- no `Date` during initial render
- no random id generation during initial render
- browser restoration must happen after hydration only

## 4. Intent Actions

Canonical actions:

- `setLeftNavMode(mode)`
- `setMRPTab(tab)`
- `setDashboardContext(context)`
- `setScenePanelState(state)`
- `selectObject(objectId)`
- `clearSelection()`
- `setTimelineState(state)`
- `setObjectCatalogState(state)`

Each action validates input and falls back safely.

## 5. Synchronization Rules

Left Nav change:

- updates `activeLeftNavMode`
- sets `activeMRPTab` to `dashboard`
- updates `dashboardContext`

Scene Panel collapse:

- updates `scenePanelState` only
- must not reset scene data
- must not reset MRP

Object selection:

- updates `selectedObjectId`
- updates `objectPanelState`
- may update `dashboardContext` if requested
- must not create MRP tab

MRP tab change:

- updates `activeMRPTab` only
- Assistant tab must not reset `dashboardContext`
- Dashboard tab must not reset Assistant state

Timeline activation:

- updates `timelineState`
- sets `dashboardContext` to `timeline` when needed
- must not create MRP tab

Catalog open:

- updates `objectCatalogState`
- must not mutate scene until object selected

## 6. Forbidden Patterns

Do not allow:

- duplicated selected object state
- duplicated right panel tab state
- duplicated Dashboard Context state
- duplicated Left Nav mode state
- multiple independent route stores
- direct panel-to-panel mutation
- effects syncing state both directions

Forbidden loop:

Scene Panel effect updates Dashboard.
Dashboard effect updates Scene Panel.
Scene Panel effect runs again.

## 7. Brake Warnings

Canonical brake labels:

- `[WorkspaceState][Brake] Invalid left nav mode.`
- `[WorkspaceState][Brake] Invalid MRP tab.`
- `[WorkspaceState][Brake] Invalid dashboard context.`
- `[WorkspaceState][Brake] Invalid selected object id.`
- `[WorkspaceState][Brake] Possible synchronization loop detected.`
- `[WorkspaceState][Brake] Duplicate workspace state source detected.`

Brake helpers live in `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts`.

## 8. Legacy State Audit

Current state sources identified:

- `HomeScreen.rightPanelState`: legacy compatibility view/context holder for right-panel authority writes. Maps to `activeMRPTab` and `dashboardContext`; must not become a third-tab system.
- `HomeScreen.selectedObjectIdState`: current MVP authority for `selectedObjectId`.
- `HomeScreen.objectSelection`: highlight/detail mirror for scene selection, not selected-object authority.
- `HomeScreen.scenePanelCollapsed`: UI mirror for `scenePanelState`.
- `HomeScreen.objectPanelCollapsed`: UI mirror for Object Panel presentation; selected/empty state derives from `selectedObjectId`.
- `HomeScreen.objectCatalogOpen`: UI mirror for `objectCatalogState`.
- `HomeScreen.activeMode`: product/chat mode, not executive Left Nav mode.
- `NexoraShell.scenePanelCollapsed` and `NexoraShell.objectPanelCollapsed`: shell presentation mirrors, not workspace state authority.
- `NexoraShell` inspector section state: legacy shell subnav compatibility, not Dashboard Context authority.
- `rightPanelRouter` legacy tabs and shell sections: deprecated compatibility routing under `NexoraRouteRequest`.
- `executiveBottomWorkspace` height mode: Timeline presentation persistence; maps to `timelineState`.
- `focusStore` and placement runtime selection mirrors: camera/modeling mirrors only.

These are identified and classified. They should be migrated toward `NexoraWorkspaceState` incrementally, with no aggressive deletion during this freeze.

## 9. Audit Summary

Workspace state is frozen around one canonical coordination model with stable SSR/client defaults and validated intent actions. Existing local states remain as compatibility mirrors or current authorities where already established, but future development must not introduce new route stores, tab state, dashboard context state, selected-object authority, or panel synchronization loops.

Assistant remains isolated from Dashboard Context changes. Scene Panel collapse does not reset scene state. Object selection updates Object Panel state without creating MRP tabs. Timeline activation remains scene-native and routes through Dashboard Context `timeline`.
