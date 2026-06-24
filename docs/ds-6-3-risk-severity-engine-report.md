# DS-6:3 Risk Severity Engine Report

**Project:** Nexora Type-C  
**Phase:** DS-6:3  
**Title:** Risk Severity Engine  
**Status:** PASS

**Tags:** `[DS63_RISK_SEVERITY_ENGINE]` `[RISK_SEVERITY_READY]` `[RISK_PRIORITY_READY]` `[RISK_SCORING_READY]` `[DS64_READY]` `[DS_6_3_COMPLETE]`

---

## Scope

DS-6:3 classifies how serious detected risks are. Severity scoring and persistence only — no detection, dashboard, assistant, or scenario integration.

Runtime path:

```
Detected Risks → Severity Engine → Severity Profile → Persistence
```

---

## Artifacts

Created:

- `frontend/app/lib/risk/workspaceRiskSeverityEngine.ts`
- `frontend/app/lib/risk/workspaceRiskSeverityEngine.test.ts`

Read-only dependencies:

- `workspaceRiskDetectionEngine.ts`
- `workspaceRiskContract.ts`
- `workspaceKpiHealthEngine.ts`
- `workspaceOkrHealthEngine.ts`

No DS-4, DS-5, dashboard, assistant, panel, or scene files were modified.

---

## Ownership Rule

| Layer | Owns |
|-------|------|
| DS-6:2 | Risk detection |
| DS-6:3 | Risk severity |

DS-6:3 must **not** detect risks, create risks, or calculate KPI/OKR health or progress.

Detected risk input must come from:

- `getDetectedWorkspaceRisks()`

---

## Severity Profile Contract

### WorkspaceRiskSeverityProfile

| Field | Description |
|-------|-------------|
| `workspaceId` | Owning workspace |
| `detectionId` | Source detected risk identifier |
| `riskId` | Detected risk identifier |
| `severityScore` | Numeric severity score (0–100) |
| `severityLevel` | `low` \| `medium` \| `high` \| `critical` |
| `priority` | `p1` \| `p2` \| `p3` \| `p4` |
| `severityReason` | Deterministic severity explanation |
| `evaluatedAt` | ISO evaluation timestamp |
| `source` | `ds-6:3-risk-severity` |

---

## Severity Rules

| Confidence | Base Score | Priority |
|------------|------------|----------|
| ≥ 0.95 | 95 | p1 |
| ≥ 0.80 | 80 | p2 |
| ≥ 0.65 | 65 | p3 |
| < 0.65 | 50 | p4 |

### Escalation

| Condition | Adjustment |
|-----------|------------|
| `riskSource = combined` | +5 score |
| Strategic detected risk (title contains "Strategic") | +5 score |
| Maximum score | 100 |

### Final Classification

| Score | Severity Level |
|-------|----------------|
| ≥ 95 | critical |
| 80–94 | high |
| 65–79 | medium |
| < 65 | low |

---

## APIs

| API | Purpose |
|-----|---------|
| `evaluateWorkspaceRiskSeverity(workspaceId)` | Evaluate severity for all detected risks |
| `getWorkspaceRiskSeverityProfiles(workspaceId)` | List severity profiles |
| `getWorkspaceRiskSeverityProfile(workspaceId, detectionId)` | Retrieve one severity profile |

---

## Storage

| Key | Entity |
|-----|--------|
| `nexora.workspaceRiskSeverityProfiles.v1` | Workspace risk severity profiles |

Workspace-isolated.

---

## Manual Walkthrough

| Detected Risk | Confidence | Source | Severity | Score | Priority |
|---------------|------------|--------|----------|-------|----------|
| Forecast Failure Risk | 1.00 | combined | critical | 100 | p1 |
| Growth Execution Risk | 0.80 | okr | high | 80 | p2 |

| Check | Result |
|-------|--------|
| Severity calculated | PASS |
| Severity level assigned | PASS |
| Priority assigned | PASS |
| Severity reason generated | PASS |
| Persistence survives reload | PASS |
| Workspace isolation preserved | PASS |

---

## Diagnostics

Prefix: `[NexoraRiskSeverity]`

Logged fields: `workspaceId`, `riskId`, `severityScore`, `severityLevel`, `priority`

---

## Test Coverage

| Scenario | Result |
|----------|--------|
| Critical severity | PASS |
| High severity | PASS |
| Medium severity | PASS |
| Low severity | PASS |
| Combined escalation | PASS |
| Strategic escalation | PASS |
| Priority assignment | PASS |
| Persistence reload | PASS |
| Workspace isolation | PASS |
| No detection mutation | PASS |
| No KPI mutation | PASS |
| No OKR mutation | PASS |
| No scene mutation | PASS |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Severity calculated | PASS |
| Severity level assigned | PASS |
| Priority assigned | PASS |
| Severity reason generated | PASS |
| Persistence works | PASS |
| Workspace isolation works | PASS |
| Detection ownership preserved | PASS |
| No KPI recalculation | PASS |
| No OKR recalculation | PASS |
| No Dashboard modifications | PASS |
| Build passes | PASS |

---

## Next Phase

DS-6:4 may extend risk intelligence with object binding. No dashboard, assistant, or scenario integration in DS-6:3.

**Tag:** `[DS64_READY]`
