# Nexora Canonical Panel Architecture

Status: Frozen MVP architecture contract.

Scope: Type-C executive workspace panel ownership, routing, and deprecation boundaries.

This document is the canonical architecture contract for the Nexora MVP panel system. Future development must preserve this contract unless a later architecture decision explicitly supersedes it.

Cross-panel navigation governance is frozen in `docs/nexora-routing-governance.md`.
Workspace state synchronization is frozen in `docs/nexora-workspace-state-management.md`.

## 1. Canonical Workspace Surfaces

### Left Navigation

Purpose: primary executive mode navigation.

Canonical entries:

- Sources
- Dashboard
- Scenario
- Risk
- War Room
- Timeline
- Settings

Rules:

- Left Navigation is permanent.
- Left Navigation must not contain action buttons.
- Left Navigation switches executive contexts only.
- Left Navigation must remain visible in all major workspace states.
- Left Navigation mode state is centralized in `frontend/app/lib/ui/nexoraLeftNavContract.ts`.
- Invalid or deprecated mode values fall back to Dashboard with a `[LeftNav][Brake]` warning.
- Deprecated mode names such as `OPS`, `WAR`, `RSK`, `EXE`, `CTRL`, `operational_topology`, `war_room`, `risk_view`, and `executive_control` are compatibility inputs only and must not appear as main nav labels.
- Sources is governed by `docs/nexora-source-management-architecture.md` and must route to Dashboard context `sources`.

### Center Workspace

Purpose: primary Three.js executive scene.

Rules:

- Center Workspace is always active.
- There is no 2D mode.
- There is no alternate workspace mode.
- The Three.js scene is the primary visualization surface.

### Scene Panel

Location: left side of scene.

Purpose: scene-level controls and scene information.

Contract: `docs/nexora-scene-panel-architecture.md`.

Rules:

- Body is collapsible.
- Header is always visible.
- Contains scene-related actions only.
- May open the catalog for object insertion.
- Object insertion must flow through Object Catalog before scene object creation.

### Object Panel

Location: right side of scene.

Purpose: object-level information.

Contract: `docs/nexora-object-panel-architecture.md`.

Rules:

- Appears when an object is selected.
- Supports collapsed state.
- Never becomes a global dashboard.
- Uses single-selection state: `hidden`, `empty`, or `selected`.
- Current MVP selection authority is `HomeScreen.selectedObjectIdState`.
- Object actions may request Dashboard Context routing, but must not create Main Right Panel tabs.

### Timeline

Location: inside scene.

Contract: `docs/nexora-timeline-architecture.md`.

Rules:

- Timeline is scene-native.
- Timeline is not a separate page.
- Timeline is not hosted in the Right Panel.
- Timeline lives in the bottom scene region.
- Timeline supports `hidden`, `collapsed`, and `expanded` states.
- Left Nav Timeline mode activates Dashboard context `timeline`, which activates the scene-native Timeline.

### Main Right Panel

Purpose: executive workspace side panel.

Contract: `docs/nexora-main-right-panel-architecture.md`.

Canonical tabs:

1. Dashboard
2. Assistant

Rules:

- Main Right Panel contains exactly two tabs.
- Dashboard hosts executive views.
- Assistant hosts AI interaction.
- No third tab.
- No legacy routing panels.
- Dashboard contexts are `overview`, `sources`, `scenario`, `risk`, `war_room`, `timeline`, and `settings`.

## 2. Routing Principle

Scene actions route through Dashboard modes:

- Scene
- Object
- Risk
- Scenario
- War Room
- Timeline

Assistant remains isolated. Assistant interactions must not become implicit Dashboard tab routing, and Dashboard mode routing must not render inside Assistant.

Canonical route requests are defined in `frontend/app/lib/routing/nexoraRoutingContract.ts`. No route may create a third Main Right Panel tab, a hidden full page, or a direct engine execution path.

Canonical workspace coordination state is defined in `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts`. Panel state must synchronize through validated intent actions rather than direct panel-to-panel mutation.

## 3. Deprecated Legacy Architecture

The following pre-contract patterns are deprecated for the MVP architecture:

- Right Panel as an intent/navigation/lightweight-guidance router.
- Right Panel families such as SCN, SIM, and RSK.
- Right Panel rail tabs beyond Dashboard and Assistant.
- Right Panel-hosted Timeline, War Room, Risk, Advice, Conflict, Replay, Memory, Object Focus, or Scenario Tree views.
- Center Component Panel as an alternate execution workspace.
- Timeline as a right-panel view, center component page, or standalone page.
- Timeline as a third Main Right Panel tab.
- Object panel variants that act as global executive dashboards.
- Left-nav entries that trigger actions instead of switching executive context.
- Legacy routing panels or fallback panels that hide routing ownership problems.

Existing code may still expose compatibility names while the product is migrated. Those names are compatibility shims only and must not be treated as canonical architecture.

## 4. Current Conflict Inventory

Known legacy conflicts identified during the freeze:

- `docs/nexora-panel-system.md` describes the old split: Right Panel intent routing, Center Component execution, and SCN/SIM/RSK panel families.
- `docs/nexora-action-routing.md` routes command actions to the Right Panel and processing actions to a Center Component.
- `frontend/app/lib/ui/right-panel/rightPanelTypes.ts` still enumerates many Right Panel views beyond Dashboard and Assistant.
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` still maps legacy tabs and shell sections into Right Panel views.
- `frontend/app/lib/ui/right-panel/rightPanelRegistry.ts` still registers legacy Right Panel render entries such as Timeline, War Room, Risk, Advice, Conflict, Replay, Memory, and Object Focus.
- `frontend/app/components/panels/TimelinePanel.tsx` and `frontend/app/components/executive/DecisionTimelinePanel.tsx` still render legacy panel-style timeline surfaces; canonical Timeline ownership is scene-native.
- `frontend/app/lib/simulation/timeline/*`, `frontend/app/lib/temporal-cognition/multiTimelineStore.ts`, and governance decision timeline builders are timeline producers or engine stores, not scene Timeline UI ownership.
- `frontend/app/lib/routing/intentPanelRegistry.ts` still models panel destinations as `center` or `right` and includes legacy intent targets.
- `frontend/app/components/right-panel/RightPanelHost.tsx` still renders multiple legacy view cases.
- `frontend/app/lib/ui/mainRightPanelContract.ts` is the canonical MRP tab and Dashboard Context contract; right-panel view enums are compatibility-only.
- `frontend/app/components/scene/SceneInfoHud.tsx` still exposes a legacy Add Object callback; canonical catalog entry is Scene Panel.
- `frontend/app/components/workspace/ObjectPanelShell.tsx` contains older E2 comments about adding Dashboard / Chat tabs inside the object shell; under this contract, Dashboard / Assistant belong to the Main Right Panel, not the Object Panel.
- `frontend/app/components/right-panel/ObjectPanelLazy.tsx`, `frontend/app/components/panels/ExecutiveObjectPanel.tsx`, and `frontend/app/components/panels/ObjectSelectionPanel.tsx` still provide legacy object detail/selection views; canonical Object Panel ownership is scene-native.
- `frontend/app/lib/focus/focusStore.ts` and `frontend/app/lib/modeling/objectPlacementRuntime.ts` hold focus/placement mirrors; they are not selected-object authorities.
- `frontend/app/screens/HomeScreen.tsx` currently owns MVP single selection via `selectedObjectIdState`; future extraction must keep one source of truth.
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` still exposes deprecated left-nav group keys for compatibility; canonical mode state now lives in `frontend/app/lib/ui/nexoraLeftNavContract.ts`.
- `frontend/app/screens/HomeScreen.tsx` canonicalizes any legacy `nexora:open-right-panel` left-nav event to Dashboard before panel authority receives it.
- `frontend/app/lib/routing/nexoraRoutingContract.ts` is the canonical cross-panel route request and resolution contract; legacy right-panel routers are compatibility layers below it.
- `frontend/app/lib/workspace/nexoraWorkspaceStateContract.ts` is the canonical workspace state contract; local panel booleans and legacy view/context states are compatibility mirrors unless explicitly identified as current MVP authority.

## 5. Architecture Audit Summary

The MVP architecture is frozen around one permanent Left Navigation rail, one always-active Three.js scene, a scene-scoped left Scene Panel, a selection-scoped right Object Panel, a scene-native Timeline, and a Main Right Panel with only Dashboard and Assistant tabs.

Legacy right-panel routing remains in the codebase as compatibility surface, but it is deprecated. Future work should route Scene, Object, Risk, Scenario, War Room, and Timeline actions through Dashboard modes while keeping Assistant isolated. Future implementation phases may remove compatibility entries only when behavior and tests are migrated to this contract.

Left Navigation implementation now displays exactly Sources, Dashboard, Scenario, Risk, War Room, Timeline, and Settings from the canonical typed contract. Legacy left-nav inputs are normalized into those modes, and all left-nav clicks target the Dashboard panel while carrying Dashboard context metadata. External legacy left-nav open events are also canonicalized to Dashboard so they cannot create extra Main Right Panel tabs.

Source Management is frozen as the official data entry architecture for the MVP. Source registration, configuration, monitoring, health visibility, connection status, and metadata visibility belong to Dashboard context `sources`; connectors and ingestion helpers remain subordinate implementation surfaces.

Object Panel and Selection Intelligence are frozen as the right-side scene-native selected-object architecture. Single selection is authoritative in `HomeScreen.selectedObjectIdState`; focus stores, placement runtime, object HUDs, and legacy object right-panel routes are compatibility mirrors only. Object actions must emit routing requests toward Dashboard Context rather than creating new Main Right Panel tabs or executing engines directly.

Timeline is frozen as the bottom scene-native runtime component. Timeline events, phases, view-mode compatibility, and `hidden` / `collapsed` / `expanded` state are defined in `frontend/app/lib/timeline/timelineArchitectureContract.ts`; legacy timeline panels and right-panel timeline views are compatibility-only.

Cross-panel routing is frozen around `NexoraRouteRequest`: Left Nav, Scene Panel, Object Panel, and Timeline route through Dashboard Context; Assistant routes only to the isolated Assistant tab; object routes update selection and Object Panel without creating tabs.

Workspace state management is frozen around `NexoraWorkspaceState`: Left Nav mode, MRP tab, Dashboard Context, Scene Panel state, Object Panel state, selected object id, Timeline state, and Object Catalog state share stable defaults and validated updates.
