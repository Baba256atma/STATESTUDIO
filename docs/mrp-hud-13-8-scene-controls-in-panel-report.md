# MRP_HUD:13:8 — Move Scene Top Menu Controls Into Scene Panel Action Row

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

Global View, Fit Scene, and Focus floated in the scene top-center toolbar, duplicating HUD chrome and cluttering the canvas on Type-C.

---

## Fix

### Relocated controls

New **Scene Controls** section inside Scene Panel:

```
SCENE CONTROLS
[ GLOBAL VIEW ] [ FIT SCENE ] [ FOCUS ]
```

### Shared button chrome

- `hudPanelActionButtonStyle.ts` — shared action button style for Scene + Object panels
- `ScenePanelControls.tsx` — wires existing navigation APIs (`requestCameraPreset`, `requestSceneNavigationAction`, `toggleExecutiveFocusMode`) with source `panel`

### Floating toolbar cleanup

- `ExecutiveSceneToolbar` hides Global View / Fit Scene / Focus when `sceneControlsRelocated`
- On Type-C (`/type-c`), when Scene Panel is active and 2D/3D toggle is locked, the top bar zone is hidden entirely
- Non-Type-C paths keep 2D/3D on the floating toolbar when applicable

### Diagnostics

```
[NexoraSceneControls] location=scene_panel floatingMenuRemoved=true
[NexoraSceneControls] action=global_view|fit_scene|focus
```

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Floating top-center scene menu removed on Type-C | PASS |
| Controls live in Scene Panel | PASS |
| Buttons match Object Panel action style | PASS |
| Camera/scene behavior preserved | PASS |
| No duplicate controls | PASS |
| Build passes | PASS |

---

## Unchanged

Camera logic, SceneNavigationController, object selection, MRP routing.
