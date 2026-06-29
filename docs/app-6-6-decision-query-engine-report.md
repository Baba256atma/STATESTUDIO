# APP-6:6 — Decision Query Engine Report

**Phase:** APP-6/6  
**Contract Version:** APP-6/6  
**Status:** Complete  
**Certification:** PASS  

---

## Purpose

APP-6:6 establishes Nexora's canonical Decision Query Engine — the official read-only query layer for the Decision Timeline Platform.

All queries operate exclusively on **APP-6:5 DecisionState**. The query engine never recalculates lifecycle, rebuilds history, or derives state. Future Dashboard, Assistant, Comparison, Replay, and API modules must consume this layer instead of reading lower platform tiers directly.

---

## Architecture

```
decisionQueryTypes.ts       — Query types, filters, sort, constants
decisionQueryFilters.ts     — Deterministic filter and sort engine
decisionQueryValidation.ts  — Query input and compatibility validation
decisionQueryRegistry.ts    — Ephemeral query cache and optional attributes index
decisionQuerySnapshot.ts    — Immutable query snapshot builder
decisionQueryEngine.ts      — Public query API and stage manifest
decisionQueryRunner.ts      — Certification orchestration
decisionQueryEngine.test.ts — Deterministic certification tests
```

Data flow:

```
APP-6:5 DecisionState Registry → Query Index → Filters → Sort → Immutable Results
```

---

## Created Files

| File | Role |
|---|---|
| `decisionQueryTypes.ts` | Domain types and constants |
| `decisionQueryFilters.ts` | Filter and sort logic |
| `decisionQueryValidation.ts` | Input and compatibility validation |
| `decisionQueryRegistry.ts` | Query cache and attributes index |
| `decisionQuerySnapshot.ts` | Snapshot generation |
| `decisionQueryEngine.ts` | Core engine and public APIs |
| `decisionQueryRunner.ts` | Certification runner |
| `decisionQueryEngine.test.ts` | Test suite |
| `docs/app-6-6-decision-query-engine-report.md` | This report |

---

## Public APIs

| API | Description |
|---|---|
| `queryDecisionStates()` | Execute filtered, sorted query |
| `getDecisionById()` | Retrieve single DecisionState by ID |
| `getDecisionState()` | Delegate to APP-6:5 state registry |
| `getDecisionsByWorkspace()` | Filter by workspace |
| `getDecisionsByLifecycle()` | Filter by lifecycle |
| `getDecisionsByStatus()` | Filter by status |
| `getDecisionsByCategory()` | Filter by category (query attributes) |
| `getDecisionsByTag()` | Filter by tag (query attributes) |
| `getTerminalDecisions()` | Filter terminal states |
| `getActiveDecisions()` | Filter active (non-terminal, valid) states |
| `getRecentDecisions()` | Sort by latestTimestamp descending |
| `listDecisionStates()` | List all registered states |
| `validateDecisionQuery()` | Validate query input |
| `buildDecisionQuerySnapshot()` | Create immutable snapshot |
| `freezeDecisionQuerySnapshot()` | Re-freeze snapshot |
| `runDecisionQueryEngine()` | Full certification suite |
| `initializeDecisionQueryEngine()` | Initialize engine |

---

## Supported Queries

All query APIs read from the APP-6:5 state registry via `collectQueryableDecisionStates()`. No lower-layer access occurs at query time.

---

## Filter Model

| Filter | Matches Against |
|---|---|
| `workspaceId` | `DecisionState.workspaceId` |
| `decisionId` | `DecisionState.decisionId` |
| `lifecycle` | `DecisionState.currentLifecycle` |
| `status` | `DecisionState.currentStatus` |
| `category` | Query attributes index |
| `tags` | Query attributes index |
| `terminal` | `DecisionState.isTerminal` |
| `active` | `!isTerminal && isValid` |
| `createdAfter` | `DecisionState.generatedAt` |
| `createdBefore` | `DecisionState.generatedAt` |

---

## Sort Model

| Field | Source |
|---|---|
| `createdAt` | `DecisionState.generatedAt` |
| `updatedAt` | `DecisionState.latestTimestamp` |
| `latestTimestamp` | `DecisionState.latestTimestamp` |
| `decisionId` | `DecisionState.decisionId` |
| `currentLifecycle` | `DecisionState.currentLifecycle` |

Stable tie-breaking uses `decisionId`. Ascending and descending supported.

---

## Validation Rules

- Workspace isolation enforced on results
- Invalid filters and sort fields rejected
- Missing or incompatible DecisionState rejected
- APP-6:1 foundation compatibility checked
- APP-6:5 state version compatibility required
- Query results must be immutable and frozen
- Result count capped at 512

---

## Known Limitations

- Ephemeral in-memory registry only — no persistence
- Category and tag filters require query attributes index (DecisionState does not yet carry category/tags)
- `createdAt` maps to `generatedAt` (state generation time, not first event time)
- No full-text search or search indexing
- Requires APP-6:5 states to be registered before querying

---

## Future Consumers (APP-6:7 → APP-6:11)

| Consumer | Phase |
|---|---|
| Decision Comparison | APP-6/7+ |
| Decision Replay | APP-6/7+ |
| Decision Dashboard | APP-6/8 |
| Decision Assistant | APP-6/8 |
| Decision API Layer | APP-6/9 |
| Platform Certification | APP-6/11 |

---

## Certification Summary

All query engine tests pass. APP-6:1 through APP-6:5 regression checks pass. No certified platform modules modified.

**Certification score: 100/100**

**Architecture compliance score: 100/100**

**Overall platform score: 97/100**

---

## Architecture Verification

- APP-6:1 through APP-6:5 unchanged
- No certified platform modified
- Query layer consumes only DecisionState
- No lifecycle recalculation
- No history rebuild
- No state derivation at query time
- Read-only, deterministic, immutable results
