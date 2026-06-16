# SVIE:3:2 — Cause Chain Visualization Report

**Tag:** `[SVIE:3:2_CAUSE_CHAIN_VISUALIZATION]`

**Version:** `3.2.0`

**Date:** 2026-06-13

## Objective

Visualize **why** a recommendation exists by converting advisory links into visible causal chains. Chains show ordered cause → effect steps (for example: Supplier Delay → Inventory Shortage → Production Risk → Revenue Impact) using material-only scene overlays.

## Example Chain

```
Supplier Delay
    ↓
Inventory Shortage
    ↓
Production Risk
    ↓
Revenue Impact
```

## Visualization Rules

**Allowed:**

- Highlight chain nodes (torus glow per linked object)
- Highlight chain connections (line segments between consecutive steps)
- Sequential glow (phase offset per step for pulse animation)

**Forbidden:**

- Object movement
- Camera movement
- Topology changes

## Runtime API

| Function | Role |
|----------|------|
| `deriveCauseChain()` | Build ordered `SvieCauseChain` from advisory link + finding |
| `deriveCauseChains()` | Batch derivation for multiple recommendations |
| `resolveVisualCauseChain()` | Map chain → node + connection visual styles |
| `mergeVisualCauseChains()` | Merge multiple visual chains into scene snapshot |
| `applyCauseChainVisualization()` | Full build from scene JSON advisory findings |
| `syncSvieCauseChainVisualization()` | Cached sync keyed by advisory + scene signature |

### Chain ordering

1. `causeChainSteps` on finding (optional extension)
2. `linkedLabels` order matched to scene object `id` / `name`
3. `link.objectIds` sorted by risk score ascending, `objectId` tie-break

## Architecture

```
syncSvieCauseChainVisualization({ sceneJson })
  └─ readAdvisoryFindingsFromSceneJson()
  └─ syncSvieAdvisoryLinkSnapshot()
  └─ deriveCauseChains()
  └─ resolveVisualCauseChain() per chain
  └─ mergeVisualCauseChains()

SceneRenderer
  └─ syncSvieCauseChainVisualization()
  └─ SceneObjectInstances (nodeVisualByObjectId)
       └─ AnimatableObject → SvieCauseChainNodeHighlight
  └─ SvieCauseChainOverlay (connectionVisuals)
```

## Scene Wiring

| Component | Role |
|-----------|------|
| `SvieCauseChainNodeHighlight.tsx` | Per-object sequential torus glow |
| `SvieCauseChainOverlay.tsx` | Connection lines with sequential pulse |
| `SceneRenderer.tsx` | Sync + overlay mount |
| `SceneObjectInstances.tsx` | Passes `svieCauseChainNodeVisualByObjectId` |
| `AnimatableObject.tsx` | Renders node highlight when linked |

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][CauseChain]` | `chainCount`, tag, version |

Emitted once per unique cause-chain signature (dev only).

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Chain generation from advisory link | **PASS** |
| **B** | Multi-step chains + sequential visuals | **PASS** |
| **C** | Visualization sync stability | **PASS** |
| **D** | No topology mutation | **PASS** |
| **E** | No routing / workspace impact | **PASS** |

Additional checks: visual styles contain no transform fields; multiple recommendations produce independent chains.

## Files Created

| File | Role |
|------|------|
| `svieCauseChainVisualizationContract.ts` | Types, palette, tag, defaults |
| `svieCauseChainDerivation.ts` | `deriveCauseChain()`, `deriveCauseChains()` |
| `svieCauseChainVisualizationResolver.ts` | `resolveVisualCauseChain()`, merge |
| `svieCauseChainVisualizationRuntime.ts` | Sync, apply, write guards |
| `svieCauseChainVisualization.test.ts` | Certification A–E |
| `SvieCauseChainOverlay.tsx` | Connection overlay |
| `SvieCauseChainNodeHighlight.tsx` | Node highlight overlay |

## Explicitly Not Modified

- Topology engine
- Object selection and scene navigation
- Workspace launcher and dashboard routing
- Advisory, Governance, Assistant, MRP lifecycles
- Camera controls

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieCauseChainVisualization.test.ts \
  app/lib/scene/svie/svieAdvisoryLinkFoundation.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:3:1_ADVISORY_LINK_FOUNDATION]`
- `[SVIE:3:2_CAUSE_CHAIN_VISUALIZATION]`
