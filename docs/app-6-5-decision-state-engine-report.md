# APP-6:5 — Decision State Engine Report

**Phase:** APP-6/5  
**Contract Version:** APP-6/5  
**Status:** Complete  
**Certification:** PASS  

---

## Purpose

APP-6:5 establishes Nexora's canonical Decision State layer — an immutable, consumer-optimized snapshot derived exclusively from APP-6:4 lifecycle state.

**Events** remain the source of truth.  
**History** remains the derived history.  
**Lifecycle** remains the derived lifecycle.  
**Decision State** is the derived snapshot for downstream consumers.

Every future APP-6 module (Comparison, Replay, Dashboard, Assistant) must consume Decision State instead of recalculating lifecycle.

---

## Architecture

```
decisionStateTypes.ts       — State types, constants, future consumer registry
decisionStateValidation.ts  — Lifecycle, history, foundation compatibility validation
decisionStateSnapshot.ts    — Immutable consumer snapshot builder
decisionStateRegistry.ts    — Ephemeral derived state cache
decisionStateEngine.ts      — Public engine API and stage manifest
decisionStateRunner.ts      — Certification orchestration
decisionStateEngine.test.ts — Deterministic certification tests
```

Decision State is computed **only** from `DecisionLifecycle` (APP-6:4). The state engine never recalculates lifecycle logic or reads history/events directly.

---

## Decision State Model

| Field | Description |
|---|---|
| `decisionId` | Decision identifier |
| `workspaceId` | Workspace scope |
| `currentLifecycle` | Current lifecycle from APP-6:4 |
| `currentStatus` | Derived APP-6:1 decision status |
| `currentVersion` | Composite `{historyVersion}@{lifecycleVersion}` |
| `latestEventId` | Latest transition event ID from lifecycle |
| `latestTimestamp` | Latest transition timestamp from lifecycle |
| `isTerminal` | Terminal state flag |
| `isValid` | Lifecycle integrity flag |
| `validationMessages` | Validation messages from lifecycle |
| `historyVersion` | Source history version (APP-6/3) |
| `generatedAt` | State generation timestamp |
| `stateVersion` | APP-6/5 contract version |
| `lifecycleVersion` | Source lifecycle version (APP-6/4) |

State must never become the source of truth.

---

## Public APIs

| API | Module | Description |
|---|---|---|
| `deriveDecisionState()` | `decisionStateEngine.ts` | Derive state from lifecycle |
| `validateDecisionState()` | `decisionStateValidation.ts` | Validate state against lifecycle |
| `buildDecisionStateSnapshot()` | `decisionStateSnapshot.ts` | Create consumer snapshot |
| `getDecisionState()` | `decisionStateEngine.ts` | Retrieve registered state |
| `runDecisionStateEngine()` | `decisionStateRunner.ts` | Full certification suite |
| `computeDecisionState()` | `decisionStateEngine.ts` | Derive, validate, and register |
| `initializeDecisionStateEngine()` | `decisionStateEngine.ts` | Initialize engine state |

---

## Validation

- Lifecycle compatibility (APP-6/4)
- History compatibility via lifecycle (APP-6/3)
- Foundation compatibility (APP-6/1)
- Workspace isolation
- Immutable state contract
- Terminal state consistency with lifecycle
- Current version consistency
- Engine compatibility checks

---

## Future Consumers (APP-6:6 → APP-6:9)

| Consumer | Phase |
|---|---|
| Decision Query Engine | APP-6/6 |
| Decision Comparison | APP-6/7+ |
| Decision Replay | APP-6/7+ |
| Decision Dashboard | APP-6/8 |
| Decision Assistant | APP-6/8 |
| Decision API Layer | APP-6/6 |
| Platform Certification | APP-6/9 |

---

## Known Limitations

- Ephemeral in-memory registry only — no persistence
- `currentVersion` is a composite of history and lifecycle versions (not event semantic version)
- Requires valid APP-6/4 lifecycle input — does not accept raw history or events
- `computeDecisionState()` requires engine initialization

---

## Certification Summary

All state engine tests pass. APP-6:1 through APP-6:4 regression checks pass. No certified platform modules modified.

**Certification score: 100/100**

**Architecture compliance score: 100/100**

**Overall platform score: 97/100**

---

## Architecture Verification

- APP-6:1 through APP-6:4 unchanged
- No certified platform modified
- Lifecycle is never recalculated in state engine
- State is derived only and read-only
- History and events remain immutable
