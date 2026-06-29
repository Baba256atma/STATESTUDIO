# APP-2:4 Executive Scenario Priority Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-2:4  
**Title:** Executive Scenario Priority Engine  
**Status:** PASS

**Tags:** `[APP2_4_EXECUTIVE_SCENARIO_PRIORITY_ENGINE]` `[EXECUTIVE_SCENARIO_PRIORITY_READY]` `[EXECUTIVE_PRIORITY_READ_ONLY]` `[NO_RECOMMENDATIONS]` `[NO_PREDICTION]` `[WORKSPACE_ISOLATED]` `[CONSUMES_SCENARIO_CONTEXT]`

---

## Purpose

APP-2:4 implements the **Executive Scenario Priority Engine** — the canonical read-only executive priority assessment for APP-2. Using the immutable `ScenarioContext` from APP-2:3, it determines how important a scenario is from an executive perspective.

It answers: *“How important is this scenario?”*  
It never answers: *“What should we do?”*

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriorityResult.ts` | `ExecutiveScenarioPriority` and priority model types |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriorityDiagnostics.ts` | Priority-specific diagnostic vocabulary |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriorityEvaluator.ts` | Pure deterministic priority evaluation |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriorityResolver.ts` | ScenarioContext consumption and validation |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriority.ts` | Public engine entry point |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriorityCertification.ts` | Certification gates A–P |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioPriority.test.ts` | Certification-style tests |
| `docs/app-2-4-executive-scenario-priority-engine-report.md` | Phase report |

APP-2:1, APP-2:2, and APP-2:3 files were not modified.

---

## Evaluation Pipeline

```
ScenarioContext (APP-2:3)
  ↓
ExecutiveScenarioPriorityResolver (validate + normalize)
  ↓
ExecutiveScenarioPriorityEvaluator (deterministic scoring)
  ↓
ExecutiveScenarioPriority (immutable, readOnly)
```

### Public Entry Point

`ExecutiveScenarioPriorityEngine.evaluateExecutiveScenarioPriorityFromContext(request)`

---

## Priority Model

Five executive attention levels:

| Level | Rank | Typical Condition |
|-------|------|-------------------|
| None | 0 | Missing context/state or invalid workspace |
| Low | 1 | Archived, incomplete context, minimal factors |
| Normal | 2 | Standard active scenario with balanced factors |
| High | 3 | Blocked state, elevated risks, active lifecycle |
| Critical | 4 | Critical health state, high composite score |

Classification is deterministic — identical `ScenarioContext` always produces identical priority.

---

## Evidence Model

Every assessment includes:

| Component | Description |
|-----------|-------------|
| `priorityFactors` | Weighted dimension contributions |
| `priorityReasonCodes` | Why the level was assigned |
| `supportingEvidence` | Explainable evidence per dimension |

Evidence dimensions: state, executive_time, timeline, risk, kpi, relationship, workspace, decision, simulation, lifecycle.

No recommendations are generated — evidence is descriptive only.

---

## Diagnostics

| Code | Severity | Condition |
|------|----------|-----------|
| `missing_context` | error | No scenario identity |
| `missing_state` | error | No scenario state |
| `missing_executive_time` | warning | No Executive Time reference |
| `missing_timeline` | warning | No timeline reference |
| `missing_kpi` | warning | No KPI references |
| `missing_risk` | warning | No risk references |
| `missing_evidence` | warning | No supporting evidence |
| `incomplete_context` | warning | Context error diagnostics present |
| `invalid_priority` | error | Workspace violation or invalid context |

---

## Performance Notes

- Single-pass evaluation from pre-built ScenarioContext
- No global cache or retained references
- O(n) over context reference arrays (objects, KPIs, risks, etc.)
- Suitable for hundreds of scenarios via stateless per-request evaluation

---

## Read-Only Guarantees

| Rule | Enforcement |
|------|-------------|
| ScenarioContext | Consumed as-is; never rebuilt |
| Executive Time | Evidence from context references only |
| Timeline | Evidence from context references only |
| Workspace | Strict isolation per request |
| Output | `readOnly: true` on every result |
| Side effects | None — pure evaluation |

---

## Certification Gates

| Gate | Check | Result |
|------|-------|--------|
| A | Contract compatibility | PASS |
| B | State Engine integration | PASS |
| C | Context Engine integration | PASS |
| D | Priority evaluation | PASS |
| E | Evidence generation | PASS |
| F | Executive Time compatibility | PASS |
| G | Timeline compatibility | PASS |
| H | Workspace isolation | PASS |
| I | Diagnostics | PASS |
| J | Read-only compliance | PASS |
| K | No DS mutation | PASS |
| L | No INT mutation | PASS |
| M | No APP-1 mutation | PASS |
| N | Build passes | PASS |
| O | Tests pass | PASS |
| P | Architecture preserved | PASS |

---

## Regression Verification

- APP-2:1, APP-2:2, APP-2:3 files unchanged
- No DS, INT, APP-1, Scenario Authoring, Simulation, or Compare Engine modifications
- No React, UI, Dashboard, Assistant, or Scene dependencies

---

## Future Compatibility

| Consumer | Integration |
|----------|-------------|
| APP-2:5 Dependency Engine | Consumes `ExecutiveScenarioPriority` |
| APP-2:6 Conflict Engine | Consumes `ExecutiveScenarioPriority` |
| APP-2:7 Opportunity Engine | Consumes `ExecutiveScenarioPriority` |
| APP-2:8 Executive Summary | Consumes `ExecutiveScenarioPriority` |
| APP-2:9 Recommendation Engine | Consumes `ExecutiveScenarioPriority` |
| Executive Memory / Governance / LAY | Read-only priority snapshots |

All future APP-2 engines must consume `ExecutiveScenarioPriority` instead of recalculating executive importance.

---

## Test Summary

```bash
node --test app/lib/app-2-scenario-intelligence/executiveScenarioPriority.test.ts
```

| Scenario | Result |
|----------|--------|
| Priority evaluation from ScenarioContext | PASS |
| Evidence generation across dimensions | PASS |
| Workspace isolation | PASS |
| Missing context/state → none priority | PASS |
| Blocked state elevation | PASS |
| Deterministic output | PASS |
| Priority level vocabulary | PASS |
| Certification gates A–P | PASS |
| Read-only engine rules | PASS |
| No throw on boundary cases | PASS |

---

## Next Phase

**APP-2:5 Dependency Engine**

APP-2:4 provides canonical executive priority. APP-2:5 should consume both `ScenarioContext` and `ExecutiveScenarioPriority` without recalculating either.
