# Nexora Scene Panel Architecture

Status: Frozen MVP architecture contract.

Scope: Scene Panel ownership, collapse state, Object Catalog entry workflow, and legacy scene-control audit.

This document freezes the Scene Panel as the scene-native executive control surface for the Nexora MVP. It does not implement object creation logic, simulation logic, topology logic, dashboard content, assistant features, or engine behavior.

## 1. Canonical Location

Scene Panel location:

- Left side of the Three.js scene.
- Scene-native HUD/workspace element.
- Always attached to the scene experience.
- Not part of Main Right Panel.
- Not part of Left Navigation.

Canonical component:

`frontend/app/components/workspace/ScenePanelShell.tsx`

Canonical contract:

`frontend/app/lib/scene/scenePanelContract.ts`

## 2. Purpose

The Scene Panel answers:

- What exists in this scene?
- What can I add to this scene?
- What is the current scene state?

The Scene Panel does not answer:

- What object is selected? Object Panel owns this.
- What decision should I make? Dashboard and Assistant own this.

## 3. Structure

Header section:

- Always visible.
- Contains scene identity/status area.
- Contains collapse/expand control.

Body section:

- Collapsible.
- Contains scene summary.
- Contains object count.
- Contains scene actions.
- Contains Object Catalog entry point.

## 4. State Contracts

```ts
type ScenePanelState =
  | "expanded"
  | "collapsed";

type ObjectCatalogState =
  | "closed"
  | "open";
```

Rules:

- Header remains visible in both states.
- Body may collapse.
- Collapse state must not destroy panel state.
- Collapse state must not recreate panel components.

## 5. Object Catalog Entry

The Scene Panel is the official Object Catalog entry point.

Canonical actions:

- Add Object
- Open Catalog

Canonical flow:

```text
Scene Panel
  -> Object Catalog
  -> Object Selection
  -> Scene Object Creation
  -> Scene Refresh
```

Forbidden flow:

```text
Scene Panel
  -> Direct Scene Mutation
```

Object Catalog owns:

- browsing object types
- selecting object templates
- inserting scene objects

Object Catalog does not own:

- editing selected objects
- risk analysis
- simulation control
- dashboard reporting

## 6. Scene Information

Scene Panel may display:

- scene name
- scene type
- scene status
- object count
- topology type
- active mode

Scene Panel must not display object-specific information. Object-specific information belongs to Object Panel.

## 7. Scene Actions

Allowed Scene Actions:

- Open Catalog
- Refresh Scene
- Focus Scene
- View Scene Details

Forbidden Scene Actions:

- Edit Object
- Rename Selected Object
- Object Property Editing
- Risk Calculation
- Scenario Generation

## 8. Relationships

Allowed:

```text
Scene Panel <-> Scene
Scene Panel <-> Object Catalog
Scene Panel <-> Dashboard Context
```

Assistant relationship is indirect only.

Left Nav changes must not destroy, recreate, or reset Scene Panel state.

Main Right Panel must not host Scene Panel as Dashboard tab or Assistant tab. Scene actions may update Dashboard Context, but Scene Panel remains scene-native.

Future topology systems may consume scene information such as object count, topology type, and scene composition. This contract does not implement topology logic.

## 9. Brake System

Canonical warnings:

- `[ScenePanel][Brake] Scene state unavailable.`
- `[ScenePanel][Brake] Object catalog failed to open.`
- `[ScenePanel][Brake] Invalid scene panel state.`

Invalid Scene Panel state falls back to `expanded`.

Invalid Object Catalog state falls back to `closed`.

## 10. Legacy Audit

Existing scene/catalog-related surfaces identified during the freeze:

- `frontend/app/components/workspace/ScenePanelShell.tsx`
  - Classification: canonical Scene Panel shell.
  - Mapping: official scene-native Object Catalog entry via Add Object/Open Catalog.

- `frontend/app/components/workspace/ExecutiveLeftDockZone.tsx`
  - Classification: scene dock host.
  - Mapping: canonical location host for Scene Panel on the left side of scene.

- `frontend/app/lib/objectCatalog/objectCatalogRuntime.ts`
  - Classification: Object Catalog event runtime.
  - Mapping: canonical open/close event boundary; does not create objects.

- `frontend/app/components/catalog/ExecutiveObjectCatalog.tsx`
  - Classification: Object Catalog UI.
  - Mapping: object template browsing/selection surface; not a dashboard, assistant, risk, or simulation UI.

- `frontend/app/screens/HomeScreen.tsx`
  - Classification: current catalog confirm and scene insertion handler.
  - Mapping: insertion occurs after Object Catalog selection; Scene Panel must not directly mutate the scene.

- `frontend/app/components/scene/SceneInfoHud.tsx`
  - Classification: legacy scene information HUD with Add Object callback.
  - Mapping: compatibility entry only; canonical catalog entry is Scene Panel.

- `frontend/app/components/domain/DomainObjectCatalogPanel.tsx`
  - Classification: domain object catalog panel.
  - Mapping: legacy/domain-specific catalog surface; subordinate to canonical Object Catalog entry workflow.

- `frontend/app/lib/actions/actionRouter.ts`
  - Classification: action routing includes `add_domain_object`.
  - Mapping: action path must not bypass Object Catalog workflow for Scene Panel insertion.

## 11. Audit Summary

The Scene Panel is frozen as the scene-native control surface on the left side of the Three.js scene. It owns scene-level information and scene-level actions only. Object insertion starts from Scene Panel and must flow through Object Catalog before scene mutation. Legacy Add Object and catalog paths are compatibility surfaces and must not become new canonical insertion paths.
