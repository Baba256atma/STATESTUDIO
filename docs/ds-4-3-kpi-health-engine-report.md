# DS-4:3 KPI Health Engine Report

**Project:** Nexora Type-C  
**Phase:** DS-4:3  
**Title:** KPI Health Engine  
**Status:** PASS

**Tags:** `[DS43_KPI_HEALTH_ENGINE]` `[KPI_HEALTH_PROFILES_READY]` `[KPI_STATUS_CLASSIFIED]` `[KPI_SEVERITY_READY]` `[DS44_READY]` `[DS_4_3_COMPLETE]`

---

## Scope

DS-4:3 classifies KPI condition from DS-4:2 calculation profiles. Health evaluation and persistence only — no rendering, dashboard, assistant, object panel, or scene changes.

Runtime path:

```
Workspace KPI → KPI Calculation Profile → KPI Health Engine → KPI Health Profile → Persistence
```

---

## Artifacts

Created:

- `frontend/app/lib/kpi/workspaceKpiHealthEngine.ts`
- `frontend/app/lib/kpi/workspaceKpiHealthEngine.test.ts`

Read-only dependencies:

- `workspaceKpiContract.ts`
- `workspaceKpiCalculationEngine.ts`

Storage key:

- `nexora.workspaceKpiHealthProfiles.v1`

APIs:

- `evaluateWorkspaceKpiHealth(workspaceId)`
- `getWorkspaceKpiHealthProfiles(workspaceId)`
- `getWorkspaceKpiHealthProfile(workspaceId, kpiId)`

---

## Health Profile Contract

`WorkspaceKpiHealthProfile` fields:

| Field | Description |
|-------|-------------|
| `workspaceId` | Owning workspace |
| `kpiId` | Source KPI identifier |
| `healthScore` | 0–100 with trend adjustment |
| `healthStatus` | `healthy` \| `watch` \| `warning` \| `critical` \| `unknown` |
| `severity` | `none` \| `low` \| `medium` \| `high` \| `critical` |
| `healthReason` | Deterministic explanation |
| `progressPercent` | From DS-4:2 profile |
| `variance` | From DS-4:2 profile |
| `trend` | From DS-4:2 profile |
| `calculatedAt` | ISO evaluation timestamp |
| `source` | `ds-4:3-kpi-health` |

---

## Classification Rules

**Health status (from progressPercent):**

| Progress | Status |
|----------|--------|
| ≥ 100 | healthy |
| 90–99 | watch |
| 70–89 | warning |
| < 70 | critical |
| missing/invalid | unknown |

**Severity:**

| Status | Base severity | Declining escalation |
|--------|---------------|----------------------|
| healthy | none | — |
| watch | low | — |
| warning | medium | high |
| critical | high | critical |
| unknown | medium | — |

**Health score:** DS-4:2 score + trend adjustment (improving +5, stable 0, declining -5, unknown -10), clamped 0–100.

---

## Manual Walkthrough Validation

| KPI | Progress | Trend | Health | Severity | Reason |
|-----|----------|-------|--------|----------|--------|
| Revenue | 85% | declining | warning | high | Revenue is at 85% of target and declining. |
| Customer Satisfaction | 102% | improving | healthy | none | Customer Satisfaction exceeded target and is improving. |

---

## Safety Compliance

DS-4:3 does not:

- modify KPI definitions (`nexora.workspaceKpis.v1`)
- modify KPI calculation profiles (`nexora.workspaceKpiProfiles.v1`)
- mutate scene JSON, topology, or workspace objects
- integrate dashboard, assistant, MRP, or object panel

---

## Tests

Command:

```bash
cd frontend
NEXT_PUBLIC_NEXORA_DIAGNOSTICS=false node --test app/lib/kpi/workspaceKpiHealthEngine.test.ts
```

Result: **8/8 tests passed**

Command:

```bash
cd frontend
npm run build
```

Result: **build passed**

---

## Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| KPI health profiles created | PASS |
| Health status assigned | PASS |
| Severity assigned | PASS |
| Health score calculated | PASS |
| Reason generated | PASS |
| Workspace isolation works | PASS |
| No KPI definitions mutated | PASS |
| No KPI calculations mutated | PASS |
| No dashboard / assistant / scene / topology changes | PASS |
| Build passes | PASS |

---

## Diagnostic

Development diagnostic prefix:

`[NexoraKpiHealth]`

Fields logged: `workspaceId`, `kpiId`, `healthStatus`, `severity`, `healthScore`, `progressPercent`, `trend`
