# DS-6:4 Risk Object Binding Report

**Project:** Nexora Type-C  
**Phase:** DS-6:4  
**Title:** Risk Object Binding  
**Status:** PASS

**Tags:** `[DS64_RISK_OBJECT_BINDING]` `[RISK_OBJECT_TRACEABILITY_READY]` `[RISKS_LINKED_TO_OBJECTS]` `[RISK_BINDINGS_PERSISTED]` `[DS65_READY]` `[DS_6_4_COMPLETE]`

---

## Scope

DS-6:4 creates traceability between detected risks and workspace objects. Binding and persistence only — no detection, severity scoring, dashboard, assistant, or scenario integration.

Runtime path:

```
Detected Risk → Object Resolution Rules → Risk Object Binding → Persistence
```

---

## Artifacts

Created:

- `frontend/app/lib/risk/workspaceRiskObjectBinding.ts`
- `frontend/app/lib/risk/workspaceRiskObjectBinding.test.ts`

Read-only dependencies:

- `workspaceRiskDetectionEngine.ts`
- `workspaceRiskSeverityEngine.ts`
- `workspaceRiskContract.ts`
- `workspaceObjectIntelligenceContract.ts`
- `workspaceKpiObjectBinding.ts` (architecture pattern)
- `workspaceOkrKpiBinding.ts` (architecture pattern)

No DS-4, DS-5, DS-6:1, DS-6:2, DS-6:3, dashboard, assistant, panel, or scene files were modified.

---

## Ownership Rule

| Layer | Owns |
|-------|------|
| DS-6:2 | Risk detection |
| DS-6:3 | Risk severity |
| DS-6:4 | Risk ↔ object traceability |

DS-6:4 must **not** detect risks, score risks, calculate KPI/OKR health, or modify objects or relationships.

Risk inputs must come from:

- `getDetectedWorkspaceRisks()`
- `getWorkspaceRiskSeverityProfiles()` (read-only enrichment for binding reasons)

---

## Binding Contract

### WorkspaceRiskObjectBinding

| Field | Description |
|-------|-------------|
| `workspaceId` | Owning workspace |
| `bindingId` | Deterministic binding identifier |
| `riskId` | Linked detected risk identifier |
| `objectId` | Linked workspace object identifier |
| `bindingStrength` | `weak` \| `medium` \| `strong` \| `critical` |
| `bindingConfidence` | Match confidence score |
| `bindingReason` | Deterministic binding explanation |
| `createdAt` | ISO creation timestamp |
| `updatedAt` | ISO update timestamp |
| `source` | `ds-6:4-risk-object-binding` |

---

## APIs

| API | Purpose |
|-----|---------|
| `bindRiskToObject(workspaceId, riskId, objectId)` | Manually bind a detected risk to an object |
| `unbindRiskFromObject(workspaceId, bindingId)` | Remove a binding |
| `getRiskObjectBindings(workspaceId)` | List all bindings in a workspace |
| `getRiskObjectBindingsForRisk(workspaceId, riskId)` | List bindings for a risk |
| `getRiskObjectBindingsForObject(workspaceId, objectId)` | List bindings for an object |
| `suggestRiskObjectBindings(workspaceId)` | Suggest and persist deterministic bindings |

---

## Matching Rules

| Risk title keywords | Object keywords | Min confidence |
|---------------------|-----------------|------------------|
| forecast | forecast, planning, prediction, analytics | 0.80 |
| warehouse, inventory, supply | warehouse, inventory, logistics, operations | 0.80 |
| sales, growth, market | sales, marketing, market, customer | 0.65 |
| technology, system, platform | platform, technology, application, system | 0.65 |

Exact title/object name overlap: 0.95

---

## Storage

| Key | Entity |
|-----|--------|
| `nexora.workspaceRiskObjectBindings.v1` | Workspace risk object bindings |

Workspace-isolated. Duplicate `(workspaceId, riskId, objectId)` returns existing binding without overwrite.

---

## Manual Walkthrough

| Risk | Object | Expected confidence |
|------|--------|---------------------|
| Forecast Failure Risk | Forecast | ≥ 0.80 |
| Supply Chain Risk | Warehouse | ≥ 0.80 |
| Growth Execution Risk | Sales | ≥ 0.65 |

| Check | Result |
|-------|--------|
| Risks bind to objects | PASS |
| Object lookup works | PASS |
| Risk lookup works | PASS |
| Suggestions work | PASS |
| Duplicate protection works | PASS |
| Persistence survives reload | PASS |
| Workspace isolation preserved | PASS |

---

## Diagnostics

Prefix: `[NexoraRiskObjectBinding]`

Logged fields: `workspaceId`, `riskId`, `objectId`, `bindingStrength`, `bindingConfidence`, `action`

---

## Test Coverage

| Scenario | Result |
|----------|--------|
| Manual binding | PASS |
| Unbinding | PASS |
| Risk retrieval | PASS |
| Object retrieval | PASS |
| Suggested bindings | PASS |
| Duplicate protection | PASS |
| Workspace isolation | PASS |
| Persistence reload | PASS |
| No risk mutation | PASS |
| No severity mutation | PASS |
| No scene mutation | PASS |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Risks bind to objects | PASS |
| Object lookup works | PASS |
| Risk lookup works | PASS |
| Suggestions work | PASS |
| Duplicate protection works | PASS |
| Persistence works | PASS |
| Workspace isolation works | PASS |
| No risk detection changes | PASS |
| No risk severity changes | PASS |
| No Dashboard modifications | PASS |
| Build passes | PASS |

---

## Next Phase

DS-6:5 may extend risk intelligence with panel integration. No dashboard, assistant, or scenario integration in DS-6:4.

**Tag:** `[DS65_READY]`
