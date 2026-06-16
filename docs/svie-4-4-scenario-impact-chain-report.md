# SVIE:4:4 — Scenario Impact Chain Report

**Tag:** `[SVIE:4:4_SCENARIO_IMPACT_CHAIN]`

**Version:** `4.4.0`

**Date:** 2026-06-16

## Objective

Visualize future propagation effects from scenario simulations. Scenario impact chains show how an initiating scenario can propagate across affected objects over time.

## Example

```
Supplier Failure
    ↓
Inventory Shortage
    ↓
Production Delay
    ↓
Revenue Loss
```

## Visualization

**Future Impact Chain**

- Node glow per propagation step
- Connection glow between consecutive steps
- Sequential pulse by propagation order

**Propagation Chain / Scenario Chain**

- Uses `scenarioImpactSteps`, `propagationSteps`, or `impactChainSteps` when supplied
- Falls back to `linkedLabels`
- Falls back to scenario link object order by predicted-change density

## Runtime API

| Function | Role |
|----------|------|
| `buildScenarioImpactChain()` | Scenario visual link → ordered propagation chain |
| `resolveScenarioImpactPropagation()` | Chain → node and connection visuals |
| `syncScenarioImpactVisualization()` | Cached impact-chain snapshot |
| `mergeScenarioImpactPropagations()` | Merge multi-scenario visuals |

## Architecture

```
syncScenarioImpactVisualization({ sceneJson })
  └─ syncSvieScenarioLinks()
  └─ buildScenarioImpactChains()
  └─ resolveScenarioImpactPropagation()
  └─ mergeScenarioImpactPropagations()

SceneRenderer
  └─ syncScenarioImpactVisualization()
  └─ SceneObjectInstances
       └─ AnimatableObject → SvieScenarioImpactNodeHighlight
  └─ SvieScenarioImpactChainOverlay
```

## Scene Rules

**Allowed:**

- Material overlays
- Future propagation node glow
- Propagation connection glow
- Sequential pulse

**Forbidden:**

- Object movement
- Scene mutation
- Topology mutation
- Routing or workspace writes

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Chain generation | **PASS** |
| **B** | Multi-step propagation | **PASS** |
| **C** | Stable rendering | **PASS** |
| **D** | No topology mutation | **PASS** |
| **E** | No lifecycle regression | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieScenarioImpactChainContract.ts` | Types, palette, defaults |
| `svieScenarioImpactChainBuilder.ts` | Chain generation |
| `svieScenarioImpactPropagationResolver.ts` | Visual resolution and merging |
| `svieScenarioImpactVisualizationRuntime.ts` | Cached runtime sync + guards |
| `svieScenarioImpactChain.test.ts` | Certification A–E |
| `SvieScenarioImpactNodeHighlight.tsx` | Node material overlay |
| `SvieScenarioImpactChainOverlay.tsx` | Connection material overlay |

## Explicitly Not Modified

- Topology engine
- Object movement and layout
- Routing and workspace launchers
- Advisory, Governance, Assistant, MRP lifecycles

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieScenarioImpactChain.test.ts \
  app/lib/scene/svie/svieScenarioDeltaVisualization.test.ts \
  app/lib/scene/svie/svieFutureStateVisualization.test.ts

npm run build
```

## Freeze Tag

`[SVIE:4:4_SCENARIO_IMPACT_CHAIN]`
