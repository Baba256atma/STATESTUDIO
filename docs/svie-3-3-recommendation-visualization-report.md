# SVIE:3:3 — Recommendation Visualization Report

**Tag:** `[SVIE:3:3_RECOMMENDATION_VISUALIZATION]`

**Version:** `3.3.0`

**Date:** 2026-06-13

## Objective

Show **what** Nexora recommends directly in the scene using material-only tier highlights. Primary recommendation objects receive the strongest emphasis; supporting objects receive progressively lighter emphasis. The scene stays executive-clean — no in-scene text labels and no popups.

## Example

**Recommendation:** Increase Safety Stock

| Tier | Emphasis | Object |
|------|----------|--------|
| Tier 1 | Strongest | Inventory |
| Tier 2 | Medium | Supplier |
| Tier 3 | Supporting | Production |

## Visualization Rules

**Allowed:**

- Tiered node highlights (torus glow with tier-scaled intensity and ring size)
- Subtle pulse animation per tier

**Forbidden:**

- Text labels inside the scene
- Popup windows
- Object movement
- Camera movement
- Topology changes

## Runtime API

| Function | Role |
|----------|------|
| `deriveRecommendationHierarchy()` | Rank linked objects into tiers 1–3 |
| `deriveRecommendationHierarchies()` | Batch hierarchy derivation |
| `resolveRecommendationVisualization()` | Map hierarchy → tier visual styles |
| `mergeRecommendationVisuals()` | Merge multi-recommendation highlights (strongest tier wins) |
| `applyRecommendationVisualization()` | Full build from advisory findings |
| `syncSvieRecommendationVisualization()` | Cached sync keyed by advisory + scene signature |

### Tier ranking order

1. `recommendationTiers` explicit tier buckets
2. `recommendationTierSteps` ordered labels/ids
3. `primaryObjectId` or first `targetObjectIds` entry → Tier 1
4. `linkedLabels` order → Tier 1, 2, 3 by position
5. Fallback: object impact × finding impact × confidence, sorted descending

## Architecture

```
syncSvieRecommendationVisualization({ sceneJson })
  └─ readAdvisoryFindingsFromSceneJson()
  └─ syncSvieAdvisoryLinkSnapshot()
  └─ deriveRecommendationHierarchies()
  └─ resolveRecommendationVisualization() per hierarchy
  └─ mergeRecommendationVisuals()

SceneRenderer
  └─ syncSvieRecommendationVisualization()
  └─ SceneObjectInstances (nodeVisualByObjectId)
       └─ AnimatableObject → SvieRecommendationNodeHighlight
```

## Scene Wiring

| Component | Role |
|-----------|------|
| `SvieRecommendationNodeHighlight.tsx` | Tier-scaled torus glow (amber palette) |
| `SceneRenderer.tsx` | Sync + prop pass-through |
| `SceneObjectInstances.tsx` | Passes `svieRecommendationNodeVisualByObjectId` |
| `AnimatableObject.tsx` | Renders recommendation highlight when linked |

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][Recommendation]` | `recommendationCount`, `highlightedObjectCount`, tag, version |

Emitted once per unique recommendation signature (dev only).

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Recommendation ranking | **PASS** |
| **B** | Stable hierarchy + tier emphasis | **PASS** |
| **C** | Material-only rendering | **PASS** |
| **D** | No topology mutation | **PASS** |
| **E** | No lifecycle regressions | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieRecommendationVisualizationContract.ts` | Types, palette, tier visuals, tag |
| `svieRecommendationHierarchyDerivation.ts` | `deriveRecommendationHierarchy()` |
| `svieRecommendationVisualizationResolver.ts` | `resolveRecommendationVisualization()` |
| `svieRecommendationVisualizationRuntime.ts` | Sync, apply, write guards |
| `svieRecommendationVisualization.test.ts` | Certification A–E |
| `SvieRecommendationNodeHighlight.tsx` | Scene tier highlight overlay |

## Explicitly Not Modified

- Topology engine
- Object selection and scene navigation
- Workspace launcher and dashboard routing
- Advisory, Governance, Assistant, MRP lifecycles
- Camera controls

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieRecommendationVisualization.test.ts \
  app/lib/scene/svie/svieCauseChainVisualization.test.ts \
  app/lib/scene/svie/svieAdvisoryLinkFoundation.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:3:1_ADVISORY_LINK_FOUNDATION]`
- `[SVIE:3:2_CAUSE_CHAIN_VISUALIZATION]`
- `[SVIE:3:3_RECOMMENDATION_VISUALIZATION]`
