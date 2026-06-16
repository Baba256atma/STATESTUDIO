# SVIE:4:5 — Multi-Scenario Comparison Layer Report

**Tag:** `[SVIE:4:5_MULTI_SCENARIO_COMPARISON]`

**Version:** `4.5.0`

**Date:** 2026-06-16

## Objective

Allow A vs B vs C scenario comparison inside the scene while keeping the scene executive-clean. The comparison layer uses material-only role overlays for primary, secondary, and alternative scenarios.

## Visualization Roles

| Role | Purpose | Visual |
|------|---------|--------|
| Primary Scenario | Main comparison scenario | Strong cyan glow |
| Secondary Scenario | Second comparison scenario | Medium violet glow |
| Alternative Scenario | Third comparison scenario | Supporting amber glow |

No labels, numbers, tables, or dashboard-style clutter are rendered in the scene.

## Runtime API

| Function | Role |
|----------|------|
| `buildScenarioComparisonModel()` | Scenario links → primary / secondary / alternative model |
| `resolveScenarioComparisonVisualization()` | Comparison model → object role visuals |
| `syncScenarioComparisonLayer()` | Cached comparison-layer snapshot |

## Scenario Switching

Default role ordering is deterministic by scenario id. Callers may provide:

- `primaryScenarioId`
- `secondaryScenarioId`
- `alternativeScenarioId`

These update comparison roles without routing, workspace, topology, or lifecycle writes.

## Architecture

```
syncScenarioComparisonLayer({ sceneJson })
  └─ syncSvieScenarioLinks()
  └─ buildScenarioComparisonModel()
  └─ resolveScenarioComparisonVisualization()

SceneRenderer
  └─ syncScenarioComparisonLayer()
  └─ SceneObjectInstances
       └─ AnimatableObject → SvieScenarioComparisonNodeHighlight
```

## Scene Rules

**Allowed:**

- Material overlays
- Role-based glow
- Subtle pulse

**Forbidden:**

- Dashboard-style clutter
- Text labels
- Numbers in scene
- Object movement
- Topology mutation
- Routing or workspace writes

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Multi-scenario support | **PASS** |
| **B** | Scenario switching | **PASS** |
| **C** | Stable comparison | **PASS** |
| **D** | No topology mutation | **PASS** |
| **E** | No lifecycle regression | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieScenarioComparisonLayerContract.ts` | Types, roles, palette, defaults |
| `svieScenarioComparisonLayerResolver.ts` | Model generation + visual resolution |
| `svieScenarioComparisonLayerRuntime.ts` | Cached runtime sync + guards |
| `svieScenarioComparisonLayer.test.ts` | Certification A–E |
| `SvieScenarioComparisonNodeHighlight.tsx` | Scene material overlay |

## Explicitly Not Modified

- Topology engine
- Object movement and layout
- Routing and workspace launchers
- Advisory, Governance, Assistant, MRP lifecycles

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieScenarioComparisonLayer.test.ts \
  app/lib/scene/svie/svieScenarioImpactChain.test.ts \
  app/lib/scene/svie/svieFutureStateVisualization.test.ts

npm run build
```

## Freeze Tag

`[SVIE:4:5_MULTI_SCENARIO_COMPARISON]`
