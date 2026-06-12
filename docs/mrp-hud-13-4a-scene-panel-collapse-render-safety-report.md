# MRP_HUD:13:4A — Scene Panel Collapse State Render-Safety Fix

**Status:** PASS  
**Date:** 2026-06-07

---

## Problem

```
Cannot update a component (SceneHudZoneLayout) while rendering a different component (SceneInfoHud).
```

Stack: `handleToggleCollapsed` → `persistSceneInfoCollapsePreference` → `setPanelCollapseState` → `notifyPanelGovernanceListeners` → `SceneHudZoneLayout` update.

`persistSceneInfoCollapsePreference` was called **inside** the `setCollapsed` state updater, which React treats as part of the render/update cycle.

---

## Fix

### `SceneInfoHud.tsx`
- Click handler only toggles local `collapsed` state and logs
- `persistSceneInfoCollapsePreference` moved to `useEffect` after hydration
- `previousCollapsedRef` signature guard prevents duplicate effect writes
- Mobile auto-collapse only calls `setCollapsed(true)` — persistence handled by effect

### `sceneInfoPreferenceRuntime.ts`
- Duplicate guard: `if (previousState === nextState) return`
- Traces via `scenePanelStateRuntime.ts`

### `panelGovernanceRuntime.ts`
- `notifyPanelGovernanceListenersDeferred()` via `queueMicrotask` — no synchronous parent updates during setState
- `setPanelCollapseState` skips when stored state unchanged

### Diagnostics
- `[NexoraScenePanelState] collapseWrite=event_safe`
- `[NexoraScenePanelState] collapseWrite=skipped_duplicate`

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| No render-during-render error | PASS |
| Collapse/expand works | PASS |
| Width upgrade intact (13:4) | PASS |
| No duplicate governance storms | PASS |
| Build passes | PASS |
