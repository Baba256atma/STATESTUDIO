# Global Reset Hotfix Report

**Tag:** `[GLOBAL_RESET_RECLICK_FIXED]`  
**Date:** 2026-06-13

## Problem

After moving or interacting with objects (selection, drag, click), the Scene Panel **GLOBAL** button stopped restoring object layout. No runtime error appeared. Logs showed SceneHydration / SceneParity and object_click activity, but the reset write did not commit.

## Root Causes

### 1. Wrong default target (derived layout vs canonical global)

Global reset used **current** `layoutPositions` from SceneCanvas as the default target. After object interaction, executive layout can reflect moved state. Resetting to current derived layout is a no-op.

### 2. Incomplete position drift detection

Drift checks preferred `transform.pos` while drag writes `position` / `pos`. Objects could be visually or semantically moved while the gate still considered them “at global.”

### 3. Runtime write guards blocked legitimate reset

`applySceneChangeSafe` stable-scene signature and semantic/visual no-op guards could reject `global_scene_reset` when `transform.pos` was unchanged even though other position channels needed normalization.

### 4. Camera transition dedupe (prior fix)

Repeated GLOBAL camera transitions were deduped by signature without a reset generation nonce.

## Fix

| Layer | Change |
|-------|--------|
| **Canonical defaults** | `resolveCanonicalGlobalLayoutPositions()` recomputes template/global layout from structural scene objects (ignoring user-moved transforms) |
| **Effective drift detection** | `readEffectiveObjectPosition()` mirrors render priority; all position channels checked |
| **Generation nonce** | Preserved from prior fix for camera dedupe |
| **Write guard bypass (scoped)** | `global_scene_reset` bypasses stable-write and semantic/visual no-op guards only (`bypassStableWriteGuard`) |
| **Placement runtime sync** | `resetObjectPlacementsToGlobalLayout()` aligns drag/placement mirror |
| **Dev logs** | `[GLOBAL_RESET_APPLIED]` on commit, `[GLOBAL_RESET_NOOP_ALREADY_GLOBAL]` when already global |

## Required Behavior

1. Compare current effective positions against canonical global/template positions.
2. Apply reset when any object differs.
3. Do not block reset because the last action signature matches.
4. Reset generation nonce scoped to Global only.
5. Other runtime guards remain intact globally.
6. No MRP, Assistant, selection authority, or render-loop changes.

## Acceptance

| Step | Expected |
|------|----------|
| A. Load 15-object workspace | Baseline global layout |
| B. Move/select/click objects | Positions drift |
| C. Click Global | Objects return to global positions; log `[GLOBAL_RESET_APPLIED]` |
| D–E. Move again → Global again | Reset applies again |
| F. Already global | Safe no-op; log `[GLOBAL_RESET_NOOP_ALREADY_GLOBAL]` |

## Files Changed

- `frontend/app/lib/scene/navigation/globalSceneResetRuntime.ts`
- `frontend/app/lib/scene/navigation/globalSceneReset.test.ts`
- `frontend/app/lib/modeling/objectPlacementRuntime.ts`
- `frontend/app/screens/hooks/scene/useSceneApplyController.ts`
- `frontend/app/screens/hooks/scene/useSceneApplyController.types.ts`
- `frontend/app/screens/HomeScreen.tsx`
- `frontend/app/components/scene/navigation/SceneNavigationController.tsx`
- `frontend/app/components/SceneCanvas.tsx`

## Test Command

```bash
cd frontend && npx vitest run app/lib/scene/navigation/globalSceneReset.test.ts
```
