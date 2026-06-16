# SVIE:2:1 — Risk Intelligence Runtime Foundation Report

**Tag:** `[SVIE:2:1_RISK_RUNTIME]`

**Version:** `2.1.0`

**Date:** 2026-06-13

## Objective

Create the first risk-aware runtime layer for the Scene Visual Intelligence Engine. Computes read-only risk visualization metadata from existing scene object fields. No changes to MRP, workspace launcher, Advisory, Governance, Assistant, dashboard routing, topology engine, or object selection.

## Risk Model

### SVIERiskState

```typescript
{
  objectId: string;
  riskScore: number;       // 0–100
  riskLevel: "low" | "medium" | "high" | "critical";
}
```

### SVIERiskSnapshot

```typescript
{
  objects: SVIERiskState[];
  generatedAt: number;
}
```

TypeScript exports use `SvieRiskState` / `SvieRiskSnapshot` to match existing SVIE naming.

## Input Sources

Deterministic derivation from object fields when present:

| Field | Role |
|-------|------|
| `risk` | Primary signal (50% weight) |
| `impact` | Secondary signal (30% weight) |
| `confidence` | Inverse signal — lower confidence increases score (20% weight) |
| `status` | Floor/ceiling adjustments for known tokens |

Fields are read from direct object properties or `semantic` fallbacks (same pattern as health derivation).

**Fallback:** when no input signals exist → `riskScore = 0` → `riskLevel = "low"`.

## Risk Classification

| Score Range | Level |
|-------------|-------|
| 0–24 | `low` |
| 25–49 | `medium` |
| 50–74 | `high` |
| 75–100 | `critical` |

## Read-Only Boundaries

**Allowed:**

- Read scene objects from `sceneJson`
- Build in-memory risk snapshots

**Not allowed:**

| Domain | Guard |
|--------|-------|
| Scene writes | `guardSvieRiskSceneWrite` |
| Routing writes | `guardSvieRiskRouteWrite` |
| Workspace writes | `guardSvieRiskWorkspaceWrite` |
| MRP / dashboard writes | `guardSvieRiskDashboardWrite` |

## Architecture

```
buildSvieRiskSnapshot({ sceneJson })
  └─ initializeSvieRuntime()          (foundation dependency)
  └─ resolveSvieRiskSnapshot()
       └─ readSceneObjectsFromJson()
       └─ deriveSvieObjectRiskScore() per object
       └─ classifySvieRiskLevel()
```

No scene renderer wiring in this phase — runtime foundation only.

## Dev Log

| Log | Payload |
|-----|---------|
| `[SVIE][RiskRuntime]` | `objectCount`, `low`, `medium`, `high`, `critical` |

Emitted once per unique snapshot `generatedAt` (dev only).

## Certification

| Condition | Scope | Result |
|-----------|-------|--------|
| **A** | Runtime loads | **PASS** |
| **B** | Risk snapshot generated | **PASS** |
| **C** | No workspace writes | **PASS** |
| **D** | No routing writes | **PASS** |
| **E** | No lifecycle regressions | **PASS** (SVIE phase 1 certification re-run) |

## Files Created

| File | Role |
|------|------|
| `svieRiskRuntimeContract.ts` | Types, thresholds, tag, dev log |
| `svieRiskDerivation.ts` | Score derivation and level classification |
| `svieRiskRuntimeResolver.ts` | Scene → risk snapshot resolver |
| `svieRiskRuntime.ts` | Runtime init, snapshot build, write guards |
| `svieRiskRuntime.test.ts` | Pass conditions A–E |

## Explicitly Not Modified

- MRP workspace routing and loader
- Workspace launcher runtime
- Advisory / Governance runtimes
- Assistant bridge
- Dashboard routing / HomeScreen lifecycle
- Topology engine
- Object selection state
- SVIE health visualization wiring (`SceneRenderer`, `AnimatableObject`)

## Test Command

```bash
cd frontend && node --test \
  app/lib/scene/svie/svieRiskRuntime.test.ts \
  app/lib/scene/svie/sviePhase1Certification.test.ts

npm run build
```

## Freeze Tags Referenced

- `[SVIE:2:1_RISK_RUNTIME]`
- `[SVIE_PHASE1_CERTIFIED]`
- `[SVIE:1:1_RUNTIME_FOUNDATION]`
