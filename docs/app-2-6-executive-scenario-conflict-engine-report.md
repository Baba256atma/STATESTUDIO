# APP-2:6 Executive Scenario Conflict Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-2:6  
**Title:** Executive Scenario Conflict Engine  
**Status:** PASS

**Tags:** `[APP2_6_EXECUTIVE_SCENARIO_CONFLICT_ENGINE]` `[EXECUTIVE_SCENARIO_CONFLICT_READY]` `[EXECUTIVE_CONFLICT_READ_ONLY]` `[NO_CONFLICT_RESOLUTION]` `[NO_RECOMMENDATIONS]` `[WORKSPACE_ISOLATED]` `[CONSUMES_SCENARIO_CONTEXT]` `[CONSUMES_EXECUTIVE_PRIORITY]` `[CONSUMES_DEPENDENCY_GRAPH]`

---

## Purpose

APP-2:6 implements the **Executive Scenario Conflict Engine** — the canonical read-only conflict graph builder for APP-2. Using certified `ScenarioContext`, `ExecutiveScenarioPriority`, and `ScenarioDependencyGraph`, it answers: *“Where are the conflicts?”*

It detects and models conflicts only. It never resolves them — resolution belongs to the Recommendation Engine.

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictGraph.ts` | Conflict vocabulary, categories, node kinds |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictResult.ts` | `ExecutiveScenarioConflictGraph`, nodes, edges, clusters, evidence |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictDiagnostics.ts` | Conflict-specific diagnostic codes |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictBuilder.ts` | Pure deterministic conflict detection |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictResolver.ts` | Input validation and normalization |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictEngine.ts` | Public engine entry point |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictCertification.ts` | Certification gates A–R |
| `frontend/app/lib/app-2-scenario-intelligence/executiveScenarioConflictEngine.test.ts` | Certification-style tests |
| `docs/app-2-6-executive-scenario-conflict-engine-report.md` | Phase report |

APP-2:1 through APP-2:5 files were not modified.

---

## Conflict Architecture

```
ScenarioContext (APP-2:3)
  +
ExecutiveScenarioPriority (APP-2:4)
  +
ScenarioDependencyGraph (APP-2:5)
  ↓
ExecutiveScenarioConflictResolver (validate)
  ↓
ExecutiveScenarioConflictBuilder (ordered detection)
  ↓
ExecutiveScenarioConflictGraph (immutable, readOnly)
```

### Public Entry Point

`ExecutiveScenarioConflictEngine.buildExecutiveScenarioConflictGraphFromInputs(request)`

---

## Detection Pipeline

Fixed order (never reordered):

1. Identity / scenario root
2. Scenario context (state, lifecycle)
3. Executive priority elevation
4. Dependency graph (circular, critical edges)
5. Objects (via relationships and KPI/risk tension)
6. Relationships (shared dependency contention)
7. KPIs (KPI/risk tension)
8. Risks
9. Executive Time (timeline anchor mismatch)
10. Timeline (waiting-state pressure)
11. Decision references (pending decisions)
12. Simulation references (active simulations)
13. Compare references (scenario divergence)
14. Conflict graph assembly
15. Clustering and diagnostics

---

## Conflict Categories

| Category | Typical Source |
|----------|----------------|
| Strategic | scenario, goal, related_scenario, compare |
| Financial | kpi |
| Operational | object, relationship, blocked state |
| Resource | data_source contention |
| Timeline | timeline pressure |
| Executive Time | time/timeline mismatch |
| Dependency | circular/critical dependencies |
| KPI | KPI/risk tension |
| Risk | risk exposure |
| Decision | pending decision references |
| Simulation | active simulation conflicts |
| Business Rule | reserved |
| Custom | reserved |

---

## Evidence Model

Every conflict includes `supportingEvidence` with:

| Field | Description |
|-------|-------------|
| `originatingEntity` | Where the conflict originates |
| `affectedEntity` | What the conflict affects |
| `reasonCode` | Deterministic reason identifier |
| `summary` | Explainable description |
| `dependencyRef` | Link to dependency graph when applicable |
| `supportingKpi` / `supportingRisk` | Supporting business references |
| `supportingTimeline` / `supportingExecutiveTime` | Temporal anchors |

No recommendations or fixes are generated.

---

## Graph Output

`ExecutiveScenarioConflictGraph` includes:

| Field | Description |
|-------|-------------|
| `conflictNodes` | All detected conflict nodes |
| `conflictEdges` | Propagation edges with strength |
| `conflictClusters` | Category-grouped conflict clusters |
| `criticalConflicts` | High/critical severity conflicts |
| `blockedConflicts` | Blocked-state conflicts |
| `resolvedConflicts` | Low-severity conflicts on terminal lifecycle |
| `conflictCategories` | Active category list |
| `supportingEvidence` | Explainable evidence records |
| `diagnostics` | Detection diagnostics |

---

## Diagnostics

| Code | Severity | Condition |
|------|----------|-----------|
| `missing_context` | error | No scenario identity |
| `missing_priority` | error | Priority level none |
| `missing_dependency_graph` | error | Empty dependency graph |
| `invalid_conflict_node` | error | Invalid node reference |
| `invalid_conflict_edge` | error | Workspace/validation failure |
| `circular_conflict` | warning | Circular dependency propagated |
| `broken_reference` | warning | Input identity mismatch |
| `missing_evidence` | warning | Nodes without evidence |
| `incomplete_graph` | warning | No conflicts detected |

---

## Performance Notes

- Single-pass detection from pre-built certified inputs
- No global cache or mutable state
- O(n) over context/dependency references plus O(V+E) clustering
- Suitable for hundreds of scenarios via stateless per-request evaluation

---

## Read-Only Guarantees

| Rule | Enforcement |
|------|-------------|
| ScenarioContext | Consumed as-is |
| ExecutiveScenarioPriority | Consumed as-is |
| ScenarioDependencyGraph | Consumed as-is |
| Executive Time / Timeline | Referenced from context only |
| Output | `readOnly: true` on graph, nodes, edges, evidence |
| Detection only | `resolvesConflicts: false` |

---

## Certification Gates

| Gate | Check | Result |
|------|-------|--------|
| A | Contract compatibility | PASS |
| B | State Engine integration | PASS |
| C | Context Engine integration | PASS |
| D | Priority Engine integration | PASS |
| E | Dependency Engine integration | PASS |
| F | Conflict graph construction | PASS |
| G | Conflict categorization | PASS |
| H | Conflict clustering | PASS |
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

- APP-2:1 through APP-2:5 files unchanged
- No DS, INT, APP-1, Scenario Authoring, Simulation, or Compare Engine modifications
- No React, UI, Dashboard, Assistant, or Scene dependencies

---

## Future Compatibility

| Consumer | Integration |
|----------|-------------|
| APP-2:7 Opportunity Engine | Consumes `ExecutiveScenarioConflictGraph` |
| APP-2:8 Executive Summary | Consumes `ExecutiveScenarioConflictGraph` |
| APP-2:9 Recommendation Engine | Consumes graph for resolution context |
| Executive Memory / Governance / LAY | Read-only conflict snapshots |

No downstream engine may independently rebuild conflict relationships.

---

## Test Summary

```bash
node --test app/lib/app-2-scenario-intelligence/executiveScenarioConflictEngine.test.ts
```

| Scenario | Result |
|----------|--------|
| Conflict graph construction | PASS |
| Critical/blocked conflict detection | PASS |
| Evidence generation | PASS |
| Conflict clustering | PASS |
| Workspace isolation | PASS |
| Certified input consumption | PASS |
| Deterministic output | PASS |
| Category vocabulary | PASS |
| Certification gates A–R | PASS |
| Detect-only engine rules | PASS |
| No throw on boundary cases | PASS |

---

## Next Phase

**APP-2:7 Opportunity Engine**

APP-2:6 provides the canonical conflict graph. APP-2:7 should consume `ExecutiveScenarioConflictGraph` alongside context, priority, and dependency graph without rediscovering conflicts.
