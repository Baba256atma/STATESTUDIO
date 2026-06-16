# SVIE:4:3 — Scenario Delta Visualization Report

**Tag:** `[SVIE:4:3_SCENARIO_DELTA_VISUALIZATION]`

**Version:** `4.3.0`

**Date:** 2026-06-15

## Objective

Show the visual difference between current and future scenario states. The overlay communicates whether each object is expected to increase, decrease, remain stable, or has an unknown delta.

## Example

| Object | Current Risk | Future Risk | Delta |
|--------|--------------|-------------|-------|
| Inventory | 30 | 70 | +40 |

The numbers above stay out of the scene. In-scene output is visual only.

## Delta Directions

| Direction | Meaning | Visual |
|-----------|---------|--------|
| Increase | Future value is higher | Red glow |
| Decrease | Future value is lower | Green glow |
| Stable | Future value is unchanged | Slate glow |
| Unknown | Missing comparable values | Violet glow |

## Runtime API

| Function | Role |
|----------|------|
| `deriveScenarioDelta()` | Scenario visual link → per-object deltas |
| `resolveScenarioDeltaVisualization()` | Scenario links → sorted delta set |
| `syncScenarioDeltaOverlay()` | Cached overlay snapshot |
| `mergeScenarioDeltaVisuals()` | Merge multi-scenario object visuals |

## Architecture

```
syncScenarioDeltaOverlay({ sceneJson })
  └─ syncSvieScenarioLinks()
       └─ Scenario Visual Links
  └─ resolveScenarioDeltaVisualization()
  └─ mergeScenarioDeltaVisuals()

SceneRenderer
  └─ syncScenarioDeltaOverlay()
  └─ SceneObjectInstances
       └─ AnimatableObject → SvieScenarioDeltaNodeHighlight
```

## Scene Rules

**Allowed:**

- Material overlays
- Directional glow
- Directional color mapping

**Forbidden:**

- Numbers in scene
- Scene mutation
- Object movement
- Topology mutation
- Routing or workspace writes

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Delta calculation | **PASS** |
| **B** | Delta rendering | **PASS** |
| **C** | Stable output | **PASS** |
| **D** | No scene mutation | **PASS** |
| **E** | No routing impact | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieScenarioDeltaVisualizationContract.ts` | Types, palette, defaults |
| `svieScenarioDeltaVisualizationResolver.ts` | Delta derivation + visual resolution |
| `svieScenarioDeltaVisualizationRuntime.ts` | Cached runtime sync + guards |
| `svieScenarioDeltaVisualization.test.ts` | Certification A–E |
| `SvieScenarioDeltaNodeHighlight.tsx` | Scene material overlay |

## Explicitly Not Modified

- Topology engine
- Object movement and layout
- Routing and workspace launchers
- Advisory, Governance, Assistant, MRP lifecycles

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieScenarioDeltaVisualization.test.ts \
  app/lib/scene/svie/svieFutureStateVisualization.test.ts \
  app/lib/scene/svie/svieScenarioLinkFoundation.test.ts

npm run build
```

## Freeze Tag

`[SVIE:4:3_SCENARIO_DELTA_VISUALIZATION]`
