# DS-7:3 Scenario Assumptions & Simulation Report

**Project:** Nexora Type-C  
**Phase:** DS-7:3  
**Title:** Scenario Assumptions & Simulation  
**Status:** PASS

**Tags:** `[DS73_SCENARIO_SIMULATION]` `[SCENARIO_ASSUMPTIONS_READY]` `[SCENARIO_SIMULATION_READY]` `[DETERMINISTIC_SIMULATION]` `[DS74_READY]` `[DS_7_3_COMPLETE]`

---

## Scope

DS-7:3 owns scenario assumptions, scenario overrides, and deterministic simulation results on isolated scenario copies. Simulation reads existing intelligence only and never mutates workspace stores.

Runtime path:

```
Scenario → Assumptions → Overrides → Temporary Scenario Model → Simulation → Simulation Result → Persistence
```

DS-7:3 does **not** own scenario CRUD, scenario insight, scenario comparison, executive indexes, assistant, or dashboard surfaces.

---

## Artifacts

Created:

- `frontend/app/lib/scenario/workspaceScenarioSimulationEngine.ts`
- `frontend/app/lib/scenario/workspaceScenarioSimulationEngine.test.ts`

Read-only dependencies (not modified):

- `workspaceScenarioContract.ts`
- `workspaceScenarioInsightEngine.ts`
- `workspaceKpiHealthEngine.ts`
- `workspaceOkrHealthEngine.ts`
- `workspaceRiskSeverityEngine.ts`
- `workspaceRiskObjectBinding.ts`
- `workspaceRiskDetectionEngine.ts`
- `workspaceObjectIntelligenceContract.ts`
- `workspaceKpiContract.ts`
- `workspaceOkrContract.ts`

No DS-4, DS-5, DS-6, DS-7:1, or DS-7:2 library files were modified.

---

## WorkspaceScenarioSimulation

| Field | Description |
|-------|-------------|
| `workspaceId` | Owning workspace |
| `scenarioId` | Source scenario |
| `assumptions` | Applied assumption set |
| `overrides` | Temporary scenario copy overrides |
| `simulationStatus` | `pending` \| `completed` \| `failed` |
| `predictedObjectChanges` | Projected object impact |
| `predictedKpiChanges` | Projected KPI health impact |
| `predictedOkrChanges` | Projected OKR health impact |
| `predictedRiskChanges` | Projected risk severity impact |
| `simulationSummary` | Deterministic executive summary |
| `executiveQuestions` | Deterministic questions only (no recommendations) |
| `simulatedAt` | ISO timestamp |
| `source` | `ds-7:3-simulation` |

---

## Assumption Types

| Type | Example |
|------|---------|
| `percentage` | Revenue +15%, Marketing Budget −10% |
| `fixed_value` | Fixed numeric adjustment |
| `boolean` | Hiring Freeze |
| `time_delay` | Supplier Delay +7 Days |
| `multiplier` | Scale factor applied as percent delta |
| `custom` | Deterministic fallback delta |

---

## APIs

| API | Purpose |
|-----|---------|
| `createWorkspaceScenarioAssumption(input)` | Build validated assumption |
| `createWorkspaceScenarioOverride(input)` | Build scenario-copy override |
| `runWorkspaceScenarioSimulation(input)` | Run, persist, and return simulation |
| `simulateWorkspaceScenarioModel(input)` | Pure deterministic simulation builder |
| `getWorkspaceScenarioSimulation(workspaceId, scenarioId, simulationId)` | Retrieve one simulation |
| `getWorkspaceScenarioSimulations(workspaceId, scenarioId)` | List scenario simulations |
| `getLatestWorkspaceScenarioSimulation(workspaceId, scenarioId)` | Latest by `simulatedAt` |
| `buildWorkspaceScenarioSimulationSummary(input)` | Deterministic summary builder |
| `buildWorkspaceScenarioExecutiveQuestions(input)` | Deterministic question builder |

---

## Simulation Rules

- Deterministic only — no LLM, ML, or randomization
- Same inputs always produce same outputs
- Overrides apply only to in-memory scenario copy via `applyTemporaryScenarioOverrides`
- Baseline intelligence read from KPI health, OKR health, risk severity, and object profiles
- Optional insight scoping via `getWorkspaceScenarioInsight` when insight exists
- Assumption-to-entity matching uses label tokenization and `DETERMINISTIC_MATCH_WEIGHTS`

---

## Storage

| Key | Entity |
|-----|--------|
| `nexora.workspaceScenarioSimulations.v1` | Workspace scenario simulations |

Workspace-isolated. Simulation persistence does not touch scenario, KPI, OKR, risk, object, relationship, or scene stores.

---

## Manual Walkthrough

**Scenario:** Forecast Improvement

**Assumptions:** Demand +20%, Marketing +10%

| Output | Expected | Result |
|--------|----------|--------|
| Forecast KPI | +8% | PASS |
| Inventory Risk | +12% | PASS |
| Sales OKR | +6% | PASS |
| Executive Summary | Demand increases; inventory exposure increases | PASS |
| Executive Questions | 4 deterministic questions | PASS |

---

## Diagnostics

Prefix: `[NexoraScenarioSimulation]`

Logged fields: `workspaceId`, `scenarioId`, `assumptionCount`, `objectChanges`, `kpiChanges`, `riskChanges`, `simulationStatus`

---

## Test Coverage

| Test | Result |
|------|--------|
| Tags and storage key | PASS |
| Assumption and override creation | PASS |
| Deterministic manual walkthrough | PASS |
| Repeated simulation same outputs | PASS |
| Persistence and workspace isolation | PASS |
| No mutation validation | PASS |
| Missing assumptions handling | PASS |

**7/7 tests pass**

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Assumptions supported | PASS |
| Overrides supported | PASS |
| Simulation generated | PASS |
| Simulation deterministic | PASS |
| Workspace unchanged | PASS |
| Existing intelligence unchanged | PASS |
| Persistence works | PASS |
| Workspace isolation works | PASS |
| Build passes | PASS |

---

## Next Phase

DS-7:4 ready — `[DS74_READY]`
