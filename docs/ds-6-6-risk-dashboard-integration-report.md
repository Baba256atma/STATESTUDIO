# DS-6:6 Risk Dashboard Integration Report

**Project:** Nexora Type-C  
**Phase:** DS-6:6  
**Title:** Risk Dashboard Integration  
**Status:** PASS

**Tags:** `[DS66_RISK_DASHBOARD_INTEGRATION]` `[RISK_VISIBLE_IN_DASHBOARD]` `[EXECUTIVE_SUMMARY_EXTENDED]` `[RISK_EXPOSURE_VISIBLE]` `[DS67_READY]` `[DS_6_6_COMPLETE]`

---

## Scope

DS-6:6 integrates risk intelligence into the **existing** Dashboard Intelligence Layer. Display and aggregation only — no new dashboard, routes, tabs, or panels.

Runtime path:

```
Detected Risks → Severity Profiles → Risk Object Bindings → Dashboard Aggregation → Dashboard Display
```

---

## Artifacts

Created:

- `frontend/app/lib/risk/riskDashboardIntegrationRuntime.ts`
- `frontend/app/lib/risk/riskDashboardIntegrationRuntime.test.ts`

Extended:

- `frontend/app/lib/dashboard/executiveSummary/executiveSummaryIntelligenceFeedBridge.ts`
- `frontend/app/lib/dashboard/operationalIntelligence/operationalIntelligenceFeedBridge.ts`

Read-only dependencies (not modified):

- `workspaceRiskDetectionEngine.ts`
- `workspaceRiskSeverityEngine.ts`
- `workspaceRiskObjectBinding.ts`
- `workspaceRiskContract.ts`

No DS-4, DS-5, DS-6:1 through DS-6:5, HomeScreen, panels, scene, routing, or assistant files were modified.

---

## DashboardRiskSummary

| Field | Description |
|-------|-------------|
| `totalRisks` | Count of detected risks |
| `criticalCount` | Severity profiles at critical level |
| `highCount` | Severity profiles at high level |
| `mediumCount` | Severity profiles at medium level |
| `lowCount` | Severity profiles at low level |
| `overallRiskScore` | Average severity score across all profiles |
| `highestPriorityRiskId` | Highest severity score; tie → most recent `evaluatedAt` |
| `highestPriorityRiskTitle` | Title from detected risk |
| `mostExposedObjectId` | Object with most bindings; tie → highest combined risk score |
| `mostExposedObjectName` | Name from object intelligence profile |
| `generatedAt` | ISO timestamp |

---

## Required APIs

| API | Purpose |
|-----|---------|
| `getDashboardRiskSummary(workspaceId?)` | Full aggregated summary |
| `getDashboardCriticalRisks(workspaceId?)` | Critical severity risks, sorted by score |
| `getDashboardHighRisks(workspaceId?)` | High severity risks, sorted by score |

All APIs are read-only. Optional `workspaceId` defaults to active workspace.

---

## Executive Summary Integration

Extended `attachExecutiveSummaryIntelligenceFeed` chain:

```
attachWorkspaceRiskDashboardSummary(
  attachWorkspaceOkrDashboardSummary(
    attachWorkspaceKpiDashboardSummary(...)
  )
)
```

When risks exist, the **active_objects** card displays **Risk Intelligence**:

- Primary: `Total Risks: N`
- Secondary: Critical/High/Medium/Low counts, overall score, highest priority risk, most exposed object
- Attention: critical → `attention_required`, high → `monitor`, else `stable`

---

## Operational Dashboard Extension

Extended `enrichSnapshot()` in the operational feed bridge to append workspace risk signals to `recentSummary`:

- Top Critical Risks
- Top Exposed Objects
- Top Emerging Risks (high severity)

Reuses existing operational snapshot structure — no new dashboard modes.

---

## Manual Walkthrough

| Risk | Severity | Score |
|------|----------|-------|
| Forecast Failure Risk | Critical | 100 |
| Growth Execution Risk | High | 80 |
| Supply Chain Risk | Medium | 65 |

Expected dashboard output:

| Metric | Value |
|--------|-------|
| Total Risks | 3 |
| Critical | 1 |
| High | 1 |
| Medium | 1 |
| Overall Risk Score | 82 |
| Highest Priority Risk | Forecast Failure Risk |
| Most Exposed Object | Forecast |

---

## Diagnostics

Prefix: `[NexoraRiskDashboard]`

Logged fields: `workspaceId`, `riskCount`, `criticalCount`, `overallRiskScore`, `highestPriorityRiskId`, `mostExposedObjectId`

---

## Test Coverage

| Test | Result |
|------|--------|
| No risks | PASS |
| Single risk | PASS |
| Multiple risks / manual walkthrough | PASS |
| Critical aggregation | PASS |
| High aggregation | PASS |
| Most exposed object | PASS |
| Overall risk score | PASS |
| Highest priority risk (tie-break) | PASS |
| Workspace isolation | PASS |
| Persistence reload | PASS |
| Executive summary extension | PASS |
| Operational dashboard extension | PASS |
| No risk mutation | PASS |
| No KPI mutation | PASS |
| No OKR mutation | PASS |

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Risk summary visible in existing Dashboard | PASS |
| No new Dashboard created | PASS |
| No new routes created | PASS |
| No new dashboard tabs created | PASS |
| Risk aggregation works | PASS |
| Most exposed object calculated | PASS |
| Workspace isolation works | PASS |
| No detection mutation | PASS |
| No severity mutation | PASS |
| No assistant modifications | PASS |
| Build passes | PASS |

---

## Next Phase

DS-6:7 ready — `[DS67_READY]`
