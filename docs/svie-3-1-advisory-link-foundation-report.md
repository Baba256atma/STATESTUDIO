# SVIE:3:1 — Advisory Link Foundation Report

**Tag:** `[SVIE:3:1_ADVISORY_LINK_FOUNDATION]`

**Version:** `3.1.0`

**Date:** 2026-06-13

## Objective

Create the first bridge between the Advisory Engine and Scene Visual Intelligence Engine (SVIE). Advisory recommendations can reference scene objects through read-only runtime link structures. No visualization, pulse effects, topology changes, routing changes, or lifecycle changes in this phase.

## Advisory Visual Link Model

### AdvisoryVisualLink

```typescript
{
  recommendationId: string;
  objectIds: string[];
  confidence: number;   // normalized 0–1
  impact: number;       // normalized 0–1
}
```

TypeScript export: `SvieAdvisoryVisualLink`

### Example

| Recommendation | Linked Scene Objects |
|----------------|---------------------|
| Increase Inventory Safety Stock | `inventory`, `supplier`, `production` |

## Input Sources

Advisory finding inputs may provide object references via:

| Field | Purpose |
|-------|---------|
| `objectIds` | Primary linked object ids |
| `relatedObjectIds` | Related scene objects |
| `targetObjectIds` | Target objects for the recommendation |
| `linkedObjectIds` | Explicit advisory link ids |
| `linkedLabels` | Resolved against scene object `id` / `name` |

Unknown object ids are ignored when a scene is provided. Invalid findings (missing `recommendationId`) are skipped safely.

## Scene Rules

**Allowed:**

- Read scene objects from `sceneJson`
- Build in-memory advisory link snapshots

**Not allowed (this phase):**

- Visual changes (no hotspot, pulse, or overlay wiring)
- Topology changes
- Routing or workspace writes
- Lifecycle mutations

## Architecture

```
syncSvieAdvisoryLinkSnapshot({ findings, sceneJson })
  └─ initializeSvieRuntime()
  └─ resolveSvieAdvisoryLinkSnapshot()
       └─ collectAdvisoryFindingObjectIds() per finding
       └─ resolveSvieAdvisoryVisualLink()
```

No `SceneRenderer` wiring in this phase — runtime foundation only.

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][AdvisoryLink]` | `linkCount`, tag, version |

Emitted once per unique link signature (dev only).

## Certification

| Condition | Scope | Result |
|-----------|-------|--------|
| **A** | Advisory → Object mapping | **PASS** |
| **B** | Multi-object linking | **PASS** |
| **C** | Deterministic output | **PASS** |
| **D** | No routing changes | **PASS** |
| **E** | No lifecycle regressions | **PASS** |

## Files Created

| File | Role |
|------|------|
| `svieAdvisoryLinkFoundationContract.ts` | Types, tag, defaults |
| `svieAdvisoryLinkResolver.ts` | Finding → link resolution |
| `svieAdvisoryLinkRuntime.ts` | Runtime init, sync, write guards |
| `svieAdvisoryLinkFoundation.test.ts` | Certification A–E |

## Explicitly Not Modified

- Scene visualization (SVIE risk hotspot / executive attention overlays)
- Topology engine
- Object selection
- Workspace launcher and routing
- Advisory, Governance, Assistant, MRP lifecycles (verified via SVIE risk layer certification re-run)
- Dashboard and scene navigation

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieAdvisoryLinkFoundation.test.ts \
  app/lib/scene/svie/svieRiskLayerCertification.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:3:1_ADVISORY_LINK_FOUNDATION]`
- `[SVIE:2_RISK_LAYER_CERTIFIED]`
- `[SVIE_PHASE2_COMPLETE]`
