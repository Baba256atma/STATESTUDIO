# DS-4:4 KPI Object Binding Report

**Project:** Nexora Type-C  
**Phase:** DS-4:4  
**Title:** KPI Object Binding  
**Status:** PASS

**Tags:** `[DS44_KPI_OBJECT_BINDING]` `[KPI_OBJECT_BINDINGS_READY]` `[KPI_TO_OBJECT_TRACEABILITY]` `[KPI_BINDING_PERSISTED]` `[DS45_READY]` `[DS_4_4_COMPLETE]`

---

## Scope

DS-4:4 binds KPIs to workspace objects with traceability. Binding and persistence only — no rendering, dashboard, assistant, object panel, or scene changes.

Runtime path:

```
Workspace KPI → Workspace Object → KPI Object Binding → Binding Profile → Persistence
```

---

## Artifacts

Created:

- `frontend/app/lib/kpi/workspaceKpiObjectBinding.ts`
- `frontend/app/lib/kpi/workspaceKpiObjectBinding.test.ts`

Read-only dependencies:

- `workspaceKpiContract.ts`
- `workspaceKpiCalculationEngine.ts`
- `workspaceKpiHealthEngine.ts`
- `workspaceObjectIntelligenceContract.ts`
- `workspaceImpactEngineContract.ts`
- `workspaceDependencyEngineContract.ts`

Storage key:

- `nexora.workspaceKpiObjectBindings.v1`

APIs:

- `bindKpiToObject(workspaceId, kpiId, objectId)`
- `unbindKpiFromObject(workspaceId, bindingId)`
- `getKpiObjectBindings(workspaceId)`
- `getKpiObjectBindingsForKpi(workspaceId, kpiId)`
- `getKpiObjectBindingsForObject(workspaceId, objectId)`
- `suggestKpiObjectBindings(workspaceId)`

---

## Binding Contract

`WorkspaceKpiObjectBinding` fields:

| Field | Description |
|-------|-------------|
| `workspaceId` | Owning workspace |
| `bindingId` | Deterministic binding identifier |
| `kpiId` | Source KPI identifier |
| `objectId` | Target object identifier |
| `bindingStrength` | `weak` \| `medium` \| `strong` \| `critical` |
| `bindingConfidence` | 0–1 match confidence |
| `bindingReason` | Deterministic explanation |
| `createdAt` | ISO creation timestamp |
| `updatedAt` | ISO update timestamp |
| `source` | `ds-4:4-kpi-object-binding` |

---

## Binding Strength

Derived from confidence:

| Confidence | Strength |
|------------|----------|
| ≥ 0.95 | critical |
| ≥ 0.80 | strong |
| ≥ 0.65 | medium |
| < 0.65 | weak |

Manual binds use confidence `1.0` and strength `critical`.

---

## Automatic Binding Rules

`suggestKpiObjectBindings(workspaceId)` uses deterministic name matching only — no AI or LLM.

| KPI keyword | Object name/type keywords | Domain |
|-------------|---------------------------|--------|
| forecast | forecast | forecast |
| revenue | sales, revenue, finance | revenue |
| inventory | inventory, warehouse | inventory |
| customer | customer | customer |
| delivery | delivery, logistics, operations | delivery |

Confidence tiers:

| Match kind | Confidence |
|------------|------------|
| Exact name match | 0.95 |
| Strong keyword match (KPI + object share domain keyword) | 0.80 |
| Related domain match | 0.65 |
| Weak fallback match | 0.40 |
| No match | binding not created |

---

## Duplicate Protection

Bindings are unique on `workspaceId + kpiId + objectId`. Duplicate bind or suggest requests return the existing binding without overwrite.

---

## Workspace Isolation

All reads and writes are scoped to a single `workspaceId`. Workspace A bindings never appear in Workspace B queries or storage mutations.

---

## Diagnostics

Prefix: `[NexoraKpiObjectBinding]`

Logged fields: `workspaceId`, `bindingId`, `kpiId`, `objectId`, `bindingStrength`, `bindingConfidence`, `action` (`created` \| `duplicate` \| `deleted` \| `suggested`).

---

## Safety Verification

Binding layer does **not** modify:

- KPI definitions (`nexora.workspaceKpis.v1`)
- KPI calculation profiles (`nexora.workspaceKpiProfiles.v1`)
- KPI health profiles (`nexora.workspaceKpiHealthProfiles.v1`)
- Object intelligence profiles (`nexora.workspaceObjectIntelligenceProfiles.v1`)
- Scene JSON or topology

---

## Manual Walkthrough

| Step | Input | Expected |
|------|-------|----------|
| 1 | Object: **Forecast**, KPI: **Forecast Accuracy** | `suggestKpiObjectBindings` → Forecast Accuracy → Forecast, confidence ≥ 0.80 |
| 2 | Object: **Warehouse**, KPI: **Inventory Turnover** | `suggestKpiObjectBindings` → Inventory Turnover → Warehouse, confidence ≥ 0.65 |

---

## Test Results

```
✔ exports DS-4:4 KPI object binding tags and storage key
✔ matches forecast, revenue, and inventory KPIs to objects
✔ binds and unbinds KPIs manually with duplicate protection
✔ suggests bindings for manual walkthrough examples
✔ isolates bindings by workspace and persists reload
✔ does not mutate KPI, object, health, calculation, or scene storage

6 pass, 0 fail
```

Build: **PASS**

---

## Acceptance Criteria

| Criterion | Result |
|-----------|--------|
| KPI can bind to object | ✓ |
| KPI can unbind from object | ✓ |
| Suggested bindings work | ✓ |
| Duplicate protection works | ✓ |
| Workspace isolation works | ✓ |
| Persistence works | ✓ |
| No KPI mutation | ✓ |
| No object mutation | ✓ |
| No scene mutation | ✓ |
| No dashboard mutation | ✓ |
| Build passes | ✓ |

---

## Next Phase

`[DS45_READY]` — DS-4:5 may consume KPI object bindings for downstream intelligence wiring.
