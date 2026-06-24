# DS-6:2 Risk Detection Engine Report

**Project:** Nexora Type-C  
**Phase:** DS-6:2  
**Title:** Risk Detection Engine  
**Status:** PASS

**Tags:** `[DS62_RISK_DETECTION_ENGINE]` `[RISK_DETECTION_READY]` `[KPI_RISK_DETECTION_READY]` `[OKR_RISK_DETECTION_READY]` `[DS63_READY]` `[DS_6_2_COMPLETE]`

---

## Scope

DS-6:2 is the first true Decision Intelligence phase for risk. It automatically discovers risks from read-only KPI and OKR health profiles. Detection and persistence only — no severity, dashboard, assistant, or scenario integration.

Runtime path:

```
KPI Health + OKR Health → Risk Detection Rules → Detected Risks → Persistence
```

---

## Artifacts

Created:

- `frontend/app/lib/risk/workspaceRiskDetectionEngine.ts`
- `frontend/app/lib/risk/workspaceRiskDetectionEngine.test.ts`

Read-only dependencies:

- `workspaceRiskContract.ts`
- `workspaceKpiHealthEngine.ts`
- `workspaceOkrHealthEngine.ts`
- `workspaceKpiContract.ts` (names only)
- `workspaceOkrContract.ts` (titles only)

No DS-4, DS-5, dashboard, assistant, panel, or scene files were modified.

---

## Ownership Rule

DS-6:2 detects risks. It does **not**:

- Calculate KPI health
- Calculate OKR health
- Calculate KPI progress
- Calculate OKR progress
- Calculate risk severity
- Bind risks to objects
- Render risks

Health data must come from:

- `getWorkspaceKpiHealthProfiles()`
- `getWorkspaceOkrHealthProfiles()`

---

## Detected Risk Contract

### WorkspaceDetectedRisk

| Field | Description |
|-------|-------------|
| `detectionId` | Stable detection identifier |
| `workspaceId` | Owning workspace |
| `riskId` | Deterministic detected risk identifier |
| `title` | Detected risk title |
| `description` | Detection summary |
| `riskSource` | `kpi` \| `okr` \| `relationship` \| `object` \| `combined` |
| `detectionReason` | Deterministic reason string |
| `confidence` | Detection confidence score |
| `detectedAt` | ISO detection timestamp |
| `source` | `ds-6:2-risk-detection` |

---

## Detection Rules

| Signal | Action | Confidence |
|--------|--------|------------|
| KPI health critical | Create KPI risk | 0.95 |
| KPI health warning | Create KPI risk | 0.80 |
| OKR health critical | Create OKR risk | 0.95 |
| OKR health warning | Create OKR risk | 0.80 |
| Critical KPI + critical OKR (shared lexical token) | Create combined risk | 1.00 |

---

## APIs

| API | Purpose |
|-----|---------|
| `detectWorkspaceRisks(workspaceId)` | Run detection rules and persist results |
| `getDetectedWorkspaceRisks(workspaceId)` | List detected risks for a workspace |
| `getDetectedWorkspaceRisk(workspaceId, detectionId)` | Retrieve a single detected risk |

---

## Storage

| Key | Entity |
|-----|--------|
| `nexora.workspaceDetectedRisks.v1` | Workspace detected risks |

Workspace-isolated. Repeated detection replaces the workspace map (duplicate protection).

---

## Manual Walkthrough

| Input | Output | Confidence |
|-------|--------|------------|
| Forecast Accuracy KPI critical | Forecast Quality Risk | 0.95 |
| Market Expansion OKR warning | Growth Execution Risk | 0.80 |
| Forecast KPI critical + Improve Forecasting OKR critical | Forecast Failure Risk | 1.00 |

| Check | Result |
|-------|--------|
| Risks detected automatically | PASS |
| KPI-based risks detected | PASS |
| OKR-based risks detected | PASS |
| Combined risks detected | PASS |
| Confidence assigned | PASS |
| Persistence survives reload | PASS |
| Workspace isolation preserved | PASS |

---

## Diagnostics

Prefix: `[NexoraRiskDetection]`

Logged fields: `workspaceId`, `riskSource`, `confidence`, `riskCount`

---

## Test Coverage

| Scenario | Result |
|----------|--------|
| Critical KPI detection | PASS |
| Warning KPI detection | PASS |
| Critical OKR detection | PASS |
| Warning OKR detection | PASS |
| Combined detection | PASS |
| Duplicate protection | PASS |
| Workspace isolation | PASS |
| Persistence reload | PASS |
| No KPI mutation | PASS |
| No OKR mutation | PASS |
| No scene mutation | PASS |
| No health recalculation | PASS |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Risks detected automatically | PASS |
| KPI-based risks detected | PASS |
| OKR-based risks detected | PASS |
| Combined risks detected | PASS |
| Confidence assigned | PASS |
| Persistence works | PASS |
| Workspace isolation works | PASS |
| No KPI recalculation | PASS |
| No OKR recalculation | PASS |
| No severity calculation | PASS |
| Build passes | PASS |

---

## Next Phase

DS-6:3 may extend risk intelligence with severity classification. No dashboard, assistant, or scenario integration in DS-6:2.

**Tag:** `[DS63_READY]`
