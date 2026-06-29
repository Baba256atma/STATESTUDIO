# APP-2:7 Executive Scenario Opportunity Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-2:7  
**Title:** Executive Scenario Opportunity Engine  
**Status:** PASS

**Tags:** `[APP2_7_EXECUTIVE_SCENARIO_OPPORTUNITY_ENGINE]` `[EXECUTIVE_SCENARIO_OPPORTUNITY_READY]` `[EXECUTIVE_OPPORTUNITY_READ_ONLY]` `[NO_RECOMMENDATIONS]` `[NO_OPPORTUNITY_RANKING]` `[WORKSPACE_ISOLATED]` `[CONSUMES_SCENARIO_CONTEXT]` `[CONSUMES_EXECUTIVE_PRIORITY]` `[CONSUMES_DEPENDENCY_GRAPH]` `[CONSUMES_CONFLICT_GRAPH]`

---

## Purpose

APP-2:7 implements the **Executive Scenario Opportunity Engine** — the canonical read-only opportunity graph builder for APP-2. Using certified `ScenarioContext`, `ExecutiveScenarioPriority`, `ScenarioDependencyGraph`, and `ExecutiveScenarioConflictGraph`, it answers: *“Where are the opportunities?”*

It detects and models opportunities only. It never answers which opportunity to pursue — that belongs to APP-2:9 Recommendation Engine.

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityGraph.ts` | Opportunity vocabulary, 15 categories, node kinds |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityResult.ts` | `ExecutiveScenarioOpportunityGraph`, nodes, edges, clusters, evidence |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityDiagnostics.ts` | Opportunity-specific diagnostic codes |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityBuilder.ts` | Pure deterministic opportunity detection |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityResolver.ts` | Input validation and normalization |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityEngine.ts` | Public engine entry point |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityCertification.ts` | Certification gates A–R |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityEngine.test.ts` | Certification-style tests |
| `docs/app-2-7-executive-scenario-opportunity-engine-report.md` | Phase report |

APP-2:1 through APP-2:6 files were not modified.

---

## Opportunity Architecture

APP-2 now maintains three canonical executive graphs:

| Phase | Graph |
|-------|-------|
| APP-2:5 | `ScenarioDependencyGraph` |
| APP-2:6 | `ExecutiveScenarioConflictGraph` |
| APP-2:7 | `ExecutiveScenarioOpportunityGraph` |

```
ScenarioContext + ExecutiveScenarioPriority
  + ScenarioDependencyGraph + ExecutiveScenarioConflictGraph
  ↓
ExecutiveScenarioOpportunityResolver (validate)
  ↓
ExecutiveScenarioOpportunityBuilder (ordered detection)
  ↓
ExecutiveScenarioOpportunityGraph (immutable, readOnly)
```

### Public Entry Point

`ExecutiveScenarioOpportunityEngine.buildExecutiveScenarioOpportunityGraphFromInputs(request)`

---

## Detection Pipeline

Fixed order (never reordered):

1. Identity / scenario root
2. Scenario context (healthy state opportunities)
3. Executive priority alignment
4. Dependency graph (critical dependency leverage)
5. Conflict graph (mitigation opportunities)
6. Objects
7. Relationships (process leverage)
8. KPIs (improvement opportunities)
9. Risks (reduction via simulation insight)
10. Executive Time (temporal alignment)
11. Timeline (active lifecycle windows)
12. Decision references
13. Simulation references (completed insight)
14. Compare references (market advantage)
15. Data sources (resource availability)
16. Blocked opportunities (from conflict graph)
17. Clustering and diagnostics

---

## Opportunity Categories

| Category | Typical Source |
|----------|----------------|
| Strategic | goals, scenario, compare |
| Financial | KPI improvement |
| Operational | healthy state, risk reduction |
| Resource | data sources |
| Market | compare/related scenarios |
| Customer | reserved |
| Innovation | reserved |
| Process | relationship leverage |
| Timeline | active lifecycle windows |
| Executive Time | temporal alignment |
| Dependency | critical dependency leverage |
| Conflict Resolution | resolved conflict mitigation |
| Decision | decision journal openings |
| Simulation | completed simulation insight |
| Custom | reserved |

---

## Evidence Model

Every opportunity includes `supportingEvidence` with:

| Field | Description |
|-------|-------------|
| `originatingEntity` | Where the opportunity originates |
| `affectedEntity` | What the opportunity affects |
| `reasonCode` | Deterministic reason identifier |
| `summary` | Explainable description |
| `dependencyRef` | Link to dependency graph |
| `conflictRef` | Link to conflict graph |
| `supportingKpi` / `supportingRisk` | Business references |
| `supportingTimeline` / `supportingExecutiveTime` | Temporal anchors |

No recommendations or execution advice.

---

## Graph Output

| Field | Description |
|-------|-------------|
| `opportunityNodes` | All detected opportunity nodes |
| `opportunityEdges` | Propagation edges with strength |
| `opportunityClusters` | Category-grouped clusters |
| `highValueOpportunities` | High/strategic value nodes |
| `quickWinOpportunities` | Near-term actionable nodes |
| `strategicOpportunities` | Strategic/market nodes |
| `blockedOpportunities` | Opportunities blocked by conflicts |
| `supportingEvidence` | Explainable evidence records |
| `diagnostics` | Detection diagnostics |

---

## Diagnostics

| Code | Severity | Condition |
|------|----------|-----------|
| `missing_context` | error | No scenario identity |
| `missing_priority` | error | Priority level none |
| `missing_dependency_graph` | error | Empty dependency graph |
| `missing_conflict_graph` | error | Empty conflict graph |
| `invalid_opportunity_node` | error | Invalid node reference |
| `invalid_opportunity_edge` | error | Workspace/validation failure |
| `missing_evidence` | warning | Nodes without evidence |
| `broken_reference` | warning | Input identity mismatch |
| `incomplete_graph` | warning | No opportunities detected |

---

## Performance Notes

- Single-pass detection from four pre-built certified inputs
- No global cache or mutable state
- O(n) over context/dependency/conflict references
- Suitable for hundreds of scenarios via stateless per-request evaluation

---

## Read-Only Guarantees

| Rule | Enforcement |
|------|-------------|
| ScenarioContext | Consumed as-is |
| ExecutiveScenarioPriority | Consumed as-is |
| ScenarioDependencyGraph | Consumed as-is |
| ExecutiveScenarioConflictGraph | Consumed as-is |
| Output | `readOnly: true` on graph, nodes, edges, evidence |
| Detection only | `ranksOpportunities: false`, `recommendsExecution: false` |

---

## Certification Gates

| Gate | Check | Result |
|------|-------|--------|
| A | Contract compatibility | PASS |
| B | State Engine integration | PASS |
| C | Context Engine integration | PASS |
| D | Priority Engine integration | PASS |
| E | Dependency Engine integration | PASS |
| F | Conflict Engine integration | PASS |
| G | Opportunity graph construction | PASS |
| H | Opportunity categorization | PASS |
| I | Evidence generation | PASS |
| J | Workspace isolation | PASS |
| K | Diagnostics | PASS |
| L | Read-only compliance | PASS |
| M | No DS mutation | PASS |
| N | No INT mutation | PASS |
| O | No APP-1 mutation | PASS |
| P | Build passes | PASS |
| Q | Tests pass | PASS |
| R | Architecture preserved | PASS |

---

## Regression Verification

- APP-2:1 through APP-2:6 files unchanged
- All 69 prior APP-2 tests continue passing
- No DS, INT, APP-1, Scenario Authoring, Simulation, or Compare Engine modifications

---

## Future Compatibility

| Consumer | Integration |
|----------|-------------|
| APP-2:8 Executive Summary | Consumes all three canonical graphs |
| APP-2:9 Recommendation Engine | Consumes opportunity graph for decision support |
| Executive Memory / Governance / LAY | Read-only opportunity snapshots |

No downstream engine may independently rebuild opportunity relationships.

---

## Test Summary

```bash
node --test app/lib/app-2-scenario-intelligence/executiveScenarioOpportunityEngine.test.ts
node --test app/lib/app-2-scenario-intelligence/*.test.ts
```

| Scenario | Result |
|----------|--------|
| Opportunity graph construction | PASS |
| Strategic/quick-win detection | PASS |
| Evidence generation | PASS |
| Workspace isolation | PASS |
| Certified input consumption | PASS |
| Deterministic output | PASS |
| Category vocabulary (15) | PASS |
| Certification gates A–R | PASS |
| Detect-only engine rules | PASS |
| No throw on boundary cases | PASS |

---

## Next Phase

**APP-2:8 Executive Summary Engine**

APP-2:7 completes the three canonical executive graphs. APP-2:8 should consume `ScenarioContext`, `ExecutiveScenarioPriority`, `ScenarioDependencyGraph`, `ExecutiveScenarioConflictGraph`, and `ExecutiveScenarioOpportunityGraph` without rebuilding any of them.
