# NW-B:8-2-FIX Object Label Billboard Enforcement Report

Required tags:

[NWB82_FIX]
[OBJECT_LABEL_BILLBOARD_ENFORCED]
[CAMERA_FACING_LABELS_ACTIVE]
[SCENE_READABILITY_CERTIFIED]
[NW_B82_FIX_COMPLETE]

## Summary

NW-B:8-2-FIX enforces true camera-facing billboard behavior for all workspace object labels. Labels no longer inherit rotation from object or scene transforms during orbit, pan, or zoom.

## Root Cause

NW-B:8-2 paired `@react-three/drei` `Html` `transform` + `sprite`, but object labels remain children of rotated object groups in `AnimatableObject`. `Html` sprite mode does not fully cancel inherited parent rotation in this hierarchy, so labels could still appear angled when the camera or object orientation changed.

## Fix

### Canonical billboard wrapper

- Added `ObjectLabelBillboard.tsx` using `@react-three/drei` `Billboard` with `follow`.
- `Billboard` compensates for parent world rotation each frame, keeping label content facing the active camera.

### Runtime diagnostics

Updated `objectCaptionBillboardRuntime.ts` with development-only diagnostics:

- `[BillboardLabel] Label Mounted`
- `[BillboardLabel] Camera Facing Enabled`
- `[BillboardLabel] Orientation Updated`
- `[BillboardLabel] Billboard Active`

### Label surfaces updated

- `ObjectCaption.tsx` — secondary captions
- `AnimatableObject.tsx` — executive object names, icon labels, debug labels

All label styling, spacing, opacity, typography, and placement offsets are unchanged.

## Preserved Behavior

No changes to:

- Font, size, color, background, opacity, spacing, animation, or placement offsets
- Object transforms or topology
- Relationship line endpoints
- Selection hit targets (`pointerEvents: "none"` retained)
- Raycasting on object meshes
- 2D flat label mode (`billboard: false`)

## Relationship Compatibility

Relationship rendering remains isolated. Label billboarding is visual-only and does not modify object positions used by relationship line resolution.

## Verification

```bash
cd frontend
npm run test -- objectCaptionBillboardRuntime.test.ts
npm run test:relationship-scene-regression-certification
npm run build
```

## Acceptance Status

PASS:

- Object labels face the active camera in 3D orbit mode
- Labels remain readable during orbit, pan, and zoom
- No topology, selection, or relationship regressions introduced
- Build passes

## Architecture

```text
Rotated object group
  └─ position-only label anchor
       └─ drei Billboard (follow)
            └─ Html label content (styling unchanged)
```

Orientation updates run inside R3F frame logic via `Billboard` and throttled diagnostics — no React rerender loop.
