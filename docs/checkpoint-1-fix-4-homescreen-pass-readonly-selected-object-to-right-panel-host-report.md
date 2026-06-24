# CHECKPOINT-1-FIX-4 HomeScreen Pass Readonly Selected Object To RightPanelHost Report

**Project:** Nexora Type-C  
**Phase:** CHECKPOINT-1-FIX-4  
**Title:** HomeScreen Pass Readonly Selected Object To RightPanelHost  
**Status:** PASS

**Tags:** `[CHECKPOINT1_FIX4_HOMESCREEN_SELECTED_OBJECT_PROP]` `[READONLY_SELECTION_PASSED_TO_RIGHT_PANEL]` `[OBJECT_PANEL_PROP_WIRING_FIXED]` `[NO_ROUTE_COMMIT_REINTRODUCED]` `[CHECKPOINT1_FIX4_COMPLETE]`

---

## Problem

Object click correctly resolved readonly selection:

```
[NexoraLoopGuard] selection_resolved / readonly_selection / objectId: obj_warehouse_1
```

But `RightPanelHost` received:

```tsx
selectedObjectId={canonicalVisualSelection.selectedId}
```

while the click authority lived in `selectedObjectIdState`. When those values diverged, `RightPanelHost` got `null` and the readonly object panel render path never activated.

---

## Fix

Prop wiring fix only. `HomeScreen` now passes a merged selected object id to `RightPanelHost`:

```tsx
const rightPanelSelectedObjectId =
  canonicalVisualSelection.selectedId || selectedObjectIdState || null;
```

Implemented via `resolveRightPanelSelectedObjectId()` with canonical id preferred, then `selectedObjectIdState` fallback.

---

## Artifacts

Modified:

- `frontend/app/screens/HomeScreen.tsx`

Added:

- `frontend/app/lib/selection/homeScreenRightPanelSelectedObject.ts`
- `frontend/app/lib/selection/homeScreenRightPanelSelectedObject.test.ts`

No changes to object click handlers, selection pipeline, `RightPanelHost`, `ObjectPanelLazy`, MRP routing, dashboard routing, scene JSON, topology, or relationships.

---

## Diagnostics

Optional development log on change (throttled):

- Label: `[Nexora][RightPanel][SelectedObjectProp]`
- Fields: `canonicalSelectedId`, `selectedObjectIdState`, `rightPanelSelectedObjectId`

---

## Tests

Command:

```bash
cd frontend
NEXT_PUBLIC_NEXORA_DIAGNOSTICS=false node --test app/lib/selection/homeScreenRightPanelSelectedObject.test.ts
```

Result:

PASS: 6 tests passed.

Command:

```bash
cd frontend
npm run build
```

Result:

PASS: Next.js production build completed successfully.

---

## Expected Flow After Fix

```
Object click
↓
selectedObjectIdState = obj_warehouse_1
↓
HomeScreen passes rightPanelSelectedObjectId to RightPanelHost
↓
RightPanelHost readonly render path activates
↓
ObjectPanelLazy → ExecutiveObjectPanel → Object Intelligence visible
```

Deselect clears `selectedObjectIdState` → `RightPanelHost` receives `null` → Object Panel closes.

---

## Acceptance Criteria

PASS: `RightPanelHost` receives readonly selected object id.  
PASS: Object Panel opens on object click.  
PASS: Empty scene click closes Object Panel.  
PASS: No object click write restored.  
PASS: No MRP route commit.  
PASS: No dashboard route commit.  
PASS: No scene mutation.  
PASS: No topology mutation.  
PASS: Build passes.
