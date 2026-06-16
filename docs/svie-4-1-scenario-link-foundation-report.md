# SVIE:4:1 — Scenario Link Foundation Report

**Tag:** `[SVIE:4:1_SCENARIO_LINK_FOUNDATION]`

**Version:** `4.1.0`

**Date:** 2026-06-13

## Objective

Connect the **Scenario Engine**, **Simulation Engine**, and **SVIE Runtime** through canonical Scenario Visual Links. This phase establishes read-only runtime link structures only — no scene visualization, topology changes, object movement, routing changes, or lifecycle mutations.

## Scenario Visual Link Model

### ScenarioVisualLink

```typescript
{
  scenarioId: string;
  objectIds: string[];              // affected scene objects
  predictedChanges: PredictedChange[];
  confidence: number;               // normalized 0–1
}
```

TypeScript export: `SvieScenarioVisualLink`

### PredictedChange

```typescript
{
  objectId: string;
  metric: "risk" | "activity" | "stability";
  before?: number;
  after?: number;
  delta?: number;
}
```

### Example

| Scenario | Affected Objects | Predicted Changes | Confidence |
|----------|------------------|-------------------|------------|
| Supplier Delay | `supplier`, `inventory`, `production` | Risk ↑ supplier/inventory; Activity ↓ production | 0.84 |

## Input Sources

Scenario inputs may provide object references and simulation outputs via:

| Field | Purpose |
|-------|---------|
| `objectIds` | Primary linked object ids |
| `affectedObjectIds` | Affected scene objects |
| `relatedObjectIds` | Related scene objects |
| `linkedObjectIds` | Explicit scenario link ids |
| `linkedLabels` | Resolved against scene object `id` / `name` |
| `predictedChanges` | Explicit predicted change entries |
| `objectImpacts` | Simulation engine impact records (auto-derived changes) |
| `confidence` | Scenario confidence score |
| `simulationSource` | Source engine identifier |

Scene JSON sources:

- `sceneJson.svie.scenarios`
- `sceneJson.svie.scenarioLinks`
- `sceneJson.svie.scenarioOutcomes`
- `sceneJson.scenario_links`
- `sceneJson.scenario_outcomes`

Unknown object ids are ignored when a scene is provided. Invalid scenarios (missing `scenarioId`) are skipped safely.

## Scene Rules

**Allowed:**

- Read scene objects from `sceneJson`
- Build in-memory scenario link snapshots
- Derive predicted changes from simulation `objectImpacts`

**Not allowed (this phase):**

- Visual changes (no hotspot, pulse, or overlay wiring)
- Topology changes
- Object movement
- Routing or workspace writes
- Lifecycle mutations

## Architecture

```
syncSvieScenarioLinks({ scenarios, sceneJson })
  └─ initializeSvieScenarioLinkRuntime()
  └─ resolveSvieScenarioLinkSnapshot()
       └─ buildScenarioVisualLink() per scenario
       └─ resolveScenarioVisualContext() per scenario
```

No `SceneRenderer` wiring in this phase — runtime foundation only.

## Runtime API

| Function | Role |
|----------|------|
| `buildScenarioVisualLink()` | Build canonical link from scenario + scene index |
| `resolveScenarioVisualContext()` | Link + label + simulation source metadata |
| `syncSvieScenarioLinks()` | Cached sync keyed by scenario + scene signature |
| `buildSvieScenarioLinkSnapshot()` | Full snapshot build |
| `readScenariosFromSceneJson()` | Read scenario inputs from scene JSON |

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][ScenarioLink]` | `linkCount`, tag, version |

Emitted once per unique link signature (dev only).

## Certification

| Gate | Scope | Result |
|------|-------|--------|
| **A** | Scenario linking | **PASS** |
| **B** | Multi-object linking | **PASS** |
| **C** | Deterministic output | **PASS** |
| **D** | No lifecycle changes | **PASS** |
| **E** | No routing changes | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieScenarioLinkFoundationContract.ts` | Types, tag, defaults |
| `svieScenarioLinkResolver.ts` | Scenario → link resolution |
| `svieScenarioLinkRuntime.ts` | Runtime init, sync, write guards |
| `svieScenarioLinkFoundation.test.ts` | Certification A–E |

## Explicitly Not Modified

- Scene visualization (SVIE phase 3 advisory overlays)
- Topology engine
- Object selection
- Workspace launcher and routing
- Advisory, Governance, Assistant, MRP lifecycles (verified via phase 3 certification re-run)
- Dashboard and scene navigation

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieScenarioLinkFoundation.test.ts \
  app/lib/scene/svie/svieAdvisoryVisualIntelligenceCertification.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:4:1_SCENARIO_LINK_FOUNDATION]`
- `[SVIE:3_ADVISORY_VISUAL_INTELLIGENCE_CERTIFIED]`
- `[SVIE_PHASE3_COMPLETE]`
