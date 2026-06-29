# APP-2:5 Scenario Dependency Engine Report

**Project:** Nexora Type-C  
**Phase:** APP-2:5  
**Title:** Scenario Dependency Engine  
**Status:** PASS

**Tags:** `[APP2_5_SCENARIO_DEPENDENCY_ENGINE]` `[SCENARIO_DEPENDENCY_ENGINE_READY]` `[SCENARIO_DEPENDENCY_READ_ONLY]` `[NO_CONFLICT_DETECTION]` `[NO_RECOMMENDATIONS]` `[WORKSPACE_ISOLATED]` `[CONSUMES_SCENARIO_CONTEXT]` `[CONSUMES_EXECUTIVE_PRIORITY]`

---

## Purpose

APP-2:5 implements the **Scenario Dependency Engine** — the canonical read-only dependency graph builder for APP-2. Using `ScenarioContext` (APP-2:3) and `ExecutiveScenarioPriority` (APP-2:4), it answers: *“What does this scenario depend on, and what depends on it?”*

It detects dependencies only. It does not resolve conflicts, recommend actions, or optimize.

---

## Files Created

| File | Purpose |
|------|---------|
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyGraph.ts` | Graph vocabulary, categories, node kinds |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyResult.ts` | `ScenarioDependencyGraph`, nodes, edges |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyDiagnostics.ts` | Dependency-specific diagnostic codes |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyBuilder.ts` | Pure deterministic graph assembly |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyResolver.ts` | Input validation and normalization |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyEngine.ts` | Public engine entry point |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyCertification.ts` | Certification gates A–Q |
| `frontend/app/lib/app-2-scenario-intelligence/scenarioDependencyEngine.test.ts` | Certification-style tests |
| `docs/app-2-5-scenario-dependency-engine-report.md` | Phase report |

APP-2:1 through APP-2:4 files were not modified.

---

## Graph Architecture

```
ScenarioContext (APP-2:3)
  +
ExecutiveScenarioPriority (APP-2:4)
  ↓
ScenarioDependencyResolver (validate)
  ↓
ScenarioDependencyBuilder (ordered node/edge assembly)
  ↓
ScenarioDependencyGraph (immutable, readOnly)
```

### Public Entry Point

`ScenarioDependencyEngine.buildScenarioDependencyGraphFromInputs(request)`

---

## Dependency Pipeline

Fixed collection order:

1. Scenario (root node)
2. Workspace
3. Objects
4. Relationships (+ object linkage edges)
5. KPIs
6. Risks
7. Executive Time references
8. Timeline references
9. Decision references
10. Simulation references (+ incoming when active)
11. Compare references (+ related scenario nodes)
12. Data sources
13. Incoming/outgoing classification
14. Critical/isolated/shared detection
15. Circular dependency diagnostics

---

## Dependency Categories

| Category | Typical Node Kind |
|----------|-------------------|
| Business | object, scenario |
| Operational | workspace, relationship |
| Financial | kpi |
| Strategic | compare, related_scenario |
| Resource | data_source |
| Risk | risk |
| Timeline | timeline |
| Executive Time | executive_time |
| Simulation | simulation |
| Decision | decision |
| Custom | reserved |

---

## Graph Output

`ScenarioDependencyGraph` includes:

| Field | Description |
|-------|-------------|
| `dependencyNodes` | All graph nodes |
| `dependencyEdges` | All edges with source, target, type, direction, strength, reasonCode |
| `incomingDependencies` | Edges directed toward the scenario |
| `outgoingDependencies` | Edges from scenario to dependencies |
| `criticalDependencies` | High-strength and risk-linked edges |
| `isolatedDependencies` | Nodes with single connection |
| `sharedDependencies` | Nodes referenced by multiple edges |
| `dependencyDiagnostics` | Detection diagnostics |

Every edge declares `readOnly: true`.

---

## Diagnostics

| Code | Severity | Condition |
|------|----------|-----------|
| `missing_context` | error | No scenario identity |
| `missing_priority` | error | Priority level none |
| `missing_state` | error | No scenario state |
| `missing_workspace` | error | No workspace reference |
| `circular_dependency` | warning | Cycle detected in graph |
| `broken_reference` | warning | Context/priority mismatch |
| `invalid_node` | error | Validation failure |
| `invalid_edge` | error | Workspace isolation violation |
| `incomplete_graph` | warning | Only root node present |
| `missing_dependency` | info | No edges detected |

---

## Performance Notes

- Single-pass node and edge assembly
- No global cache or mutable state
- Deterministic sorted node output
- O(n) over context references plus O(V+E) cycle detection
- Suitable for hundreds of scenarios via stateless per-request evaluation

---

## Read-Only Guarantees

| Rule | Enforcement |
|------|-------------|
| ScenarioContext | Consumed as-is; never rebuilt |
| ExecutiveScenarioPriority | Consumed as-is; never recalculated |
| Executive Time / Timeline | Referenced from context only |
| Output | `readOnly: true` on graph, nodes, and edges |
| Detection only | No conflict resolution or repair |

---

## Certification Gates

| Gate | Check | Result |
|------|-------|--------|
| A | Contract compatibility | PASS |
| B | State Engine integration | PASS |
| C | Context Engine integration | PASS |
| D | Priority Engine integration | PASS |
| E | Dependency graph construction | PASS |
| F | Incoming dependency detection | PASS |
| G | Outgoing dependency detection | PASS |
| H | Critical dependency detection | PASS |
| I | Workspace isolation | PASS |
| J | Diagnostics | PASS |
| K | Read-only compliance | PASS |
| L | No DS mutation | PASS |
| M | No INT mutation | PASS |
| N | No APP-1 mutation | PASS |
| O | Build passes | PASS |
| P | Tests pass | PASS |
| Q | Architecture preserved | PASS |

---

## Regression Verification

- APP-2:1 through APP-2:4 files unchanged
- No DS, INT, APP-1, Scenario Authoring, Simulation, or Compare Engine modifications
- No React, UI, Dashboard, Assistant, or Scene dependencies

---

## Future Compatibility

| Consumer | Integration |
|----------|-------------|
| APP-2:6 Conflict Engine | Consumes `ScenarioDependencyGraph` |
| APP-2:7 Opportunity Engine | Consumes `ScenarioDependencyGraph` |
| APP-2:8 Executive Summary | Consumes `ScenarioDependencyGraph` |
| APP-2:9 Recommendation Engine | Consumes `ScenarioDependencyGraph` |
| Executive Memory / Governance / LAY | Read-only dependency snapshots |

No later engine may rebuild dependency relationships independently.

---

## Test Summary

```bash
node --test app/lib/app-2-scenario-intelligence/scenarioDependencyEngine.test.ts
```

| Scenario | Result |
|----------|--------|
| Graph construction | PASS |
| Incoming dependencies | PASS |
| Critical dependency detection | PASS |
| Isolated/shared dependencies | PASS |
| Workspace isolation | PASS |
| Context/priority consumption | PASS |
| Deterministic output | PASS |
| Edge property completeness | PASS |
| Category vocabulary | PASS |
| Certification gates A–Q | PASS |
| Read-only engine rules | PASS |
| No throw on boundary cases | PASS |

---

## Next Phase

**APP-2:6 Conflict Engine**

APP-2:5 provides the canonical dependency graph. APP-2:6 should consume `ScenarioDependencyGraph` alongside `ScenarioContext` and `ExecutiveScenarioPriority` without recalculating dependencies.
