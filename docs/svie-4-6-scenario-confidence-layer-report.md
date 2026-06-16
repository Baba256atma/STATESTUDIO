# SVIE:4:6 — Scenario Confidence Layer Report

**Tag:** `[SVIE:4:6_SCENARIO_CONFIDENCE_LAYER]`

**Version:** `4.6.0`

**Date:** 2026-06-16

## Objective

Visualize confidence of simulated scenario outcomes using material-only scene overlays. Percentages and detailed confidence values remain outside the scene.

## Confidence Tiers

| Confidence | Tier | Visual |
|------------|------|--------|
| 90–100% | Executive High | Stable glow |
| 70–89% | High | Stable glow |
| 50–69% | Moderate | Soft pulse |
| Below 50% | Low | Unstable pulse |

## Runtime API

| Function | Role |
|----------|------|
| `mapScenarioConfidence()` | Numeric scenario confidence → tier |
| `mapScenarioConfidences()` | Scenario links → mapped confidence entries |
| `resolveScenarioConfidenceVisualization()` | Confidence entries → object visual styles |
| `syncScenarioConfidenceLayer()` | Cached confidence visualization snapshot |

## Architecture

```
syncScenarioConfidenceLayer({ sceneJson })
  └─ syncSvieScenarioLinks()
  └─ mapScenarioConfidences()
  └─ resolveScenarioConfidenceVisualization()

SceneRenderer
  └─ syncScenarioConfidenceLayer()
  └─ SceneObjectInstances
       └─ AnimatableObject → SvieScenarioConfidenceNodeHighlight
```

## Scene Rules

**Allowed:**

- Stable glow
- Soft pulse
- Unstable pulse
- Material-only confidence color mapping

**Forbidden:**

- Percentages in scene
- Numeric confidence values in scene
- Dashboard-style clutter
- Routing or workspace writes
- Topology mutation

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Confidence mapping | **PASS** |
| **B** | Stable rendering | **PASS** |
| **C** | Repeatability | **PASS** |
| **D** | No routing impact | **PASS** |
| **E** | No performance regression | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieScenarioConfidenceLayerContract.ts` | Types, tiers, palette, defaults |
| `svieScenarioConfidenceLayerResolver.ts` | Confidence mapping + visual resolution |
| `svieScenarioConfidenceLayerRuntime.ts` | Cached runtime sync + guards |
| `svieScenarioConfidenceLayer.test.ts` | Certification A–E |
| `SvieScenarioConfidenceNodeHighlight.tsx` | Scene material overlay |

## Explicitly Not Modified

- Topology engine
- Object movement and layout
- Routing and workspace launchers
- Advisory, Governance, Assistant, MRP lifecycles

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieScenarioConfidenceLayer.test.ts \
  app/lib/scene/svie/svieScenarioComparisonLayer.test.ts \
  app/lib/scene/svie/svieScenarioImpactChain.test.ts

npm run build
```

## Freeze Tag

`[SVIE:4:6_SCENARIO_CONFIDENCE_LAYER]`
