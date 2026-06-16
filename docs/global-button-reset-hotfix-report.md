# Global Button Reset Hotfix Report

**Tag:** `[GLOBAL_RESET_RECLICK_FIXED]`  
**Date:** 2026-06-13

## Problem

The Scene Panel **GLOBAL** button reset object positions and camera framing on the first click only. Subsequent clicks did nothing — no error, no warning, no visible reset — even after objects were moved away from their default layout.

## Root Cause

Two independent guards blocked repeated Global Reset:

1. **Camera transition dedupe (`shouldApplyExecutiveCameraTransition`)**  
   Stored the last applied transition signature under a shared `"global"` key. After the first GLOBAL preset, every later click produced the same signature and was treated as a duplicate, so the camera path never re-ran.

2. **Action-signature evaluation instead of position evaluation**  
   Global Reset did not compare current object transforms against layout defaults. It only re-fired the GLOBAL camera preset, which was already considered “applied.” Object positions were not restored on repeat clicks.

## Fix

### Position-aware reset gate

Added `globalSceneResetRuntime.ts` with:

- `sceneObjectsNeedGlobalReset()` — compares live object transforms to layout defaults (0.05 epsilon).
- `shouldApplyGlobalResetTransition()` — allows reset when positions differ; safe no-op when already at default; blocks only duplicate delivery of the same generation.
- `restoreSceneObjectsToGlobalLayout()` — writes default positions back into scene JSON without topology changes.

### Reset generation / nonce

- `requestGlobalSceneReset()` bumps `resetGeneration` on every click and dispatches it with the preset event.
- `shouldApplyExecutiveCameraTransition()` accepts optional `{ globalResetGeneration }`, appending it to the transition signature so camera reframing can repeat without disabling other dedupe guards.

### Wiring

| Entry point | Change |
|-------------|--------|
| `ScenePanelControls` | `requestGlobalSceneReset("panel")` |
| `ExecutiveSceneToolbar` | `requestGlobalSceneReset("toolbar")` |
| Keyboard `G` | `requestGlobalSceneReset("keyboard")` |
| `SceneNavigationController` | Position gate + generation-aware preset apply |
| `SceneCanvas` | `requestStaticGlobalReframe()` + `onGlobalSceneLayoutReset` |
| `HomeScreen` | `restoreSceneObjectsToGlobalLayout` via `applySceneChangeSafe` |

## Required Behavior (verified)

| Rule | Status |
|------|--------|
| Reset when any object is not at default | ✅ Position signature gate |
| Safe no-op when all objects at default | ✅ `scenePositionSignature === defaultPositionSignature` |
| Repeated clicks work after objects move again | ✅ New generation + position drift detection |
| Other guards not bypassed globally | ✅ Generation scoped to Global Reset only |
| No scene mutation loops | ✅ Single `applySceneChangeSafe` write per accepted reset |
| No topology / camera-router / MRP changes | ✅ Position-only restore + existing GLOBAL reframe path |

## Acceptance Checklist

- [x] Click Global → objects reset
- [x] Move objects → click Global again → objects reset again
- [x] No console errors (no guard throws)
- [x] No guard spam (no-op when already at default)
- [x] Unit tests added for runtime, contract, and camera generation gate

## Files Changed

- `frontend/app/lib/scene/navigation/globalSceneResetRuntime.ts` (new)
- `frontend/app/lib/scene/navigation/globalSceneReset.test.ts` (new)
- `frontend/app/lib/scene/sceneNavigationContract.ts`
- `frontend/app/lib/scene/sceneNavigation.test.ts`
- `frontend/app/lib/scene/camera/executiveCameraTransitionRuntime.ts`
- `frontend/app/lib/scene/camera/executiveCameraPresetRegistry.test.ts`
- `frontend/app/lib/scene/interaction/executiveKeyboardNavigationRuntime.ts`
- `frontend/app/components/scene/navigation/SceneNavigationController.tsx`
- `frontend/app/components/scene/navigation/ExecutiveSceneToolbar.tsx`
- `frontend/app/components/scene/ScenePanelControls.tsx`
- `frontend/app/components/SceneCanvas.tsx`
- `frontend/app/screens/HomeScreen.tsx`

## Test Commands

```bash
cd frontend && npm test -- globalSceneReset sceneNavigation executiveCameraPresetRegistry
```
