# Nexora Object Panel Architecture

Status: Frozen MVP architecture contract.

Scope: Type-C scene-native Object Panel, single-object selection, and object-action routing.

This document freezes the Object Panel and Selection Intelligence contract for the Nexora MVP. Future work must preserve this architecture unless superseded by an explicit architecture decision.

## 1. Canonical Location

The Object Panel is a scene-native HUD element on the right side of the Three.js scene.

It is not:

- Left Navigation
- Main Right Panel
- Dashboard tab
- Assistant tab
- modal
- routed page

The implementation anchor is `frontend/app/components/workspace/ObjectPanelShell.tsx`.

## 2. Purpose

The Object Panel answers:

- What object is selected?
- What is this object?
- What is its current status?
- What is connected to it?
- What object-level actions are available?

The Object Panel does not answer:

- What exists in the whole scene? That belongs to Scene Panel.
- What decision should I make? That belongs to Dashboard and Assistant.
- What sources are connected? That belongs to Source Management in Dashboard context `sources`.

## 3. Object Information Contract

Minimum selected-object model:

```ts
interface SelectedObject {
  id: string;
  name: string;
  type: string;
  status?: string;
}
```

Optional object information may include:

- description
- health
- relationships
- tags
- owner
- metrics

Object Panel must not display global dashboard reporting, source management, scenario editors, risk workspaces, or Assistant chat.

Typed contract: `frontend/app/lib/object-panel/objectPanelContract.ts`.

## 4. Panel State Contract

Canonical Object Panel state:

```ts
type ObjectPanelState = "hidden" | "empty" | "selected";
```

Rules:

- `hidden`: Object Panel shell is not visually active.
- `empty`: no selected object exists; the panel may collapse or show an empty selection placeholder.
- `selected`: one selected object exists.
- MVP supports single selection only.
- Multi-select is not part of the MVP contract.

Collapse is shell presentation, not selection state. Collapsing the panel must not destroy selected-object state.

## 5. Selection Authority

Canonical MVP source of truth:

- `HomeScreen.selectedObjectIdState`

Compatibility mirrors:

- `objectSelection` highlight payload in `HomeScreen.tsx`
- `frontend/app/lib/focus/focusStore.ts`
- `frontend/app/lib/modeling/objectPlacementRuntime.ts`
- right-panel context ids for deprecated routes

These mirrors must not become competing selection stores. The canonical flow is:

User selects object
-> selection store updated
-> Object Panel updated
-> Dashboard Context optional

Never:

User selects object
-> new Main Right Panel tab created

## 6. Object Actions

Allowed Object Panel actions:

- View Details
- Analyze Object
- Show Risks
- Open Timeline
- Explain Object

Rules:

- Object actions produce routing requests only.
- Object actions do not directly execute engines.
- Object actions do not directly run risk analysis, scenario generation, simulation, or Assistant chat.
- Object actions may route to Dashboard Context.
- Assistant remains indirect only.

## 7. Relationship Boundaries

Allowed:

- Object Panel <-> selected object
- Object Panel <-> Scene
- Object Panel <-> Dashboard Context

Indirect only:

- Object Panel <-> Assistant

Forbidden:

- Object Panel as global dashboard
- Object Panel as source management
- Object Panel as scenario editor
- Object Panel as risk workspace
- Object Panel as Main Right Panel tab

## 8. Scene Panel Boundary

Scene Panel owns scene-level questions:

- scene name
- scene status
- object count
- topology type
- catalog entry

Object Panel owns selected-object questions:

- object identity
- object metadata
- object status
- object relationships
- object-level routing actions

Scene Panel must not display selected-object details. Object Panel must not become the scene catalog or scene summary.

## 9. Brake Warnings

Canonical brake labels:

- `[ObjectPanel][Brake] Invalid selected object.`
- `[ObjectPanel][Brake] Selection state corrupted.`
- `[ObjectPanel][Brake] Object metadata unavailable.`
- `[ObjectPanel][Brake] Multiple selection stores detected.`

The brake helpers live in `frontend/app/lib/object-panel/objectPanelContract.ts`.

## 10. Legacy Audit

Known legacy object-panel and selection conflicts:

- `frontend/app/components/right-panel/ObjectPanelLazy.tsx` renders deprecated `object`, `object_focus`, and `executive_object` right-panel compatibility views.
- `frontend/app/lib/ui/right-panel/rightPanelTypes.ts` still enumerates `object`, `object_focus`, and `executive_object` as compatibility views.
- `frontend/app/lib/ui/right-panel/rightPanelRouter.ts` maps object-focused legacy routes into right-panel views.
- `frontend/app/components/right-panel/RightPanelHost.tsx` still renders object compatibility cases for migration safety.
- `frontend/app/components/ObjectPanel.tsx` is an older object detail surface and should not become a new architecture owner.
- `frontend/app/components/panels/ExecutiveObjectPanel.tsx` is a legacy executive object read surface and must route through Dashboard Context in future phases.
- `frontend/app/components/panels/ObjectSelectionPanel.tsx` presents object detail/selection intelligence but is not the selected-object authority.
- `frontend/app/components/scene/ObjectInfoHud.tsx` is a scene HUD mirror and must not become a second Object Panel authority.
- `frontend/app/lib/focus/focusStore.ts` tracks focus and pin state, not selected-object authority.
- `frontend/app/lib/modeling/objectPlacementRuntime.ts` mirrors placement selection for scene diagnostics, not Object Panel authority.

These items are deprecated or compatibility-only. They should be migrated toward the canonical contract incrementally, with no aggressive deletion during architecture-freeze work.

## 11. Audit Summary

The Object Panel architecture is frozen as a right-side, scene-native, selected-object information surface with single-selection state. It is separate from Scene Panel, Left Navigation, Main Right Panel, Dashboard, and Assistant. Current selection authority is `HomeScreen.selectedObjectIdState`; other stores and route contexts are compatibility mirrors only.

Legacy object right-panel routes remain present for migration safety, but future development must route object actions through Dashboard Context rather than creating new tabs or executing engines directly.
