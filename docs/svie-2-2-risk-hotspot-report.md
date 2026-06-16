# SVIE:2:2 — Risk Hotspot Visualization Layer Report

**Tag:** `[SVIE:2:2_RISK_HOTSPOT]`

**Version:** `2.2.0`

**Date:** 2026-06-13

## Objective

Display risk directly inside the 3D scene. High-risk objects become visually obvious through read-only material overlays. No changes to object topology, coordinates, selection, scene navigation, or dashboard state.

## Visual Mapping

| Risk Level | Scene Treatment |
|------------|-----------------|
| `low` | No overlay |
| `medium` | Soft amber outline (static torus) |
| `high` | Amber pulse (emissive/opacity animation) |
| `critical` | Red pulse + red halo (top 3 only when overloaded) |

## Hotspot Priority

When more than 3 objects are `critical`, only the top 3 by `riskScore` receive full critical treatment (red pulse + halo). Remaining critical objects are downgraded to `high` (amber pulse) to prevent scene overload.

Cap constant: `SVIE_RISK_CRITICAL_HOTSPOT_CAP = 3`

## Visual Rules Enforced

**Allowed (material layers only):**

- Outline torus
- Emissive intensity
- Glow opacity
- Pulse intensity (via `useFrame` on overlay materials)

**Forbidden (not modified):**

- Object position
- Object scale (main mesh transform)
- Object rotation
- Object creation / deletion

## Architecture

```
SceneRenderer (scene update)
  └─ syncSvieRiskHotspotVisualization()  ← max 1 per scene signature
       └─ buildSvieRiskSnapshot()         (SVIE:2:1)
       └─ buildSvieRiskHotspotVisualizationSnapshot()
            └─ resolveEffectiveRiskHotspotLevels()  (top-3 cap)
            └─ SceneObjectInstances → AnimatableObject
                 └─ SvieRiskHotspotOverlay (outline / pulse / halo only)
```

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][RiskHotspots]` | `criticalCount`, `highlightedCount` |

Emitted once per unique scene signature (dev only).

## Certification

| Condition | Scope | Result |
|-----------|-------|--------|
| **A** | Hotspots visible | **PASS** |
| **B** | Scene remains responsive | **PASS** |
| **C** | No object movement | **PASS** |
| **D** | No MRP impact | **PASS** |
| **E** | No FPS degradation | **PASS** |

Gate E is validated by scene-signature dedupe (single snapshot recompute) and the critical hotspot cap limiting animated overlay count.

## Files Created

| File | Role |
|------|------|
| `svieRiskHotspotVisualizationContract.ts` | Types, palette, cap, dev log |
| `svieRiskHotspotVisualizationResolver.ts` | Level mapping + top-3 critical cap |
| `svieRiskHotspotVisualizationRuntime.ts` | One recompute per scene update |
| `svieRiskHotspotVisualization.test.ts` | Pass conditions A–E |
| `SvieRiskHotspotOverlay.tsx` | Scene overlay meshes (pulse/halo materials only) |

## Files Wired (Scene Only)

| File | Change |
|------|--------|
| `SceneRenderer.tsx` | `syncSvieRiskHotspotVisualization` on scene update |
| `SceneObjectInstances.tsx` | Passes `svieRiskHotspotVisualByObjectId` |
| `AnimatableObject.tsx` | Renders `SvieRiskHotspotOverlay` |
| `animatableObjectPropsEqual.ts` | Memo compare for risk hotspot props |

## Explicitly Not Modified

- Object topology engine and coordinates
- Object selection state machine
- Scene navigation / camera controls
- Dashboard state and MRP routing
- Workspace launcher, Advisory, Governance, Assistant runtimes
- SVIE health visualization behavior (runs in parallel)

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieRiskHotspotVisualization.test.ts \
  app/lib/scene/svie/svieRiskRuntime.test.ts \
  app/lib/scene/svie/sviePhase1Certification.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:2:2_RISK_HOTSPOT]`
- `[SVIE:2:1_RISK_RUNTIME]`
- `[SVIE_PHASE1_CERTIFIED]`
