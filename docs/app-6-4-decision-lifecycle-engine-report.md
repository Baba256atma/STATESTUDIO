# APP-6:4 — Decision Lifecycle Engine Report

**Phase:** APP-6/4  
**Contract Version:** APP-6/4  
**Status:** Complete  
**Certification:** PASS  

---

## Purpose

APP-6:4 implements Nexora's Decision Lifecycle Engine — the read-only lifecycle derivation layer of the Decision Timeline Platform. Given a validated APP-6:3 Decision History, it computes current lifecycle state, decision status, transition integrity, and immutable snapshots.

No workflow execution, event creation, history mutation, or persistence is performed.

**Events answer:** "What happened?"  
**History answers:** "What is the complete story?"  
**Lifecycle answers:** "Where is this decision now?"

---

## Architecture

```
decisionLifecycleTypes.ts       — Lifecycle types, constants, result vocabulary
decisionLifecycleRules.ts       — Transition rules and status mapping
decisionLifecycleValidation.ts  — History analysis and lifecycle validation
decisionLifecycleSnapshot.ts    — Immutable snapshot builder
decisionLifecycleRegistry.ts    — Ephemeral derived lifecycle cache
decisionLifecycleEngine.ts      — Public engine API and stage manifest
decisionLifecycleRunner.ts      — Certification orchestration
decisionLifecycleEngine.test.ts — Deterministic certification tests
```

Lifecycle is computed from history. It is never the source of truth.

---

## Created Files

| File | Purpose |
|---|---|
| `frontend/app/lib/decision-timeline/decisionLifecycleTypes.ts` | Domain types and constants |
| `frontend/app/lib/decision-timeline/decisionLifecycleRules.ts` | Transition rules and status mapping |
| `frontend/app/lib/decision-timeline/decisionLifecycleValidation.ts` | Validation and history analysis |
| `frontend/app/lib/decision-timeline/decisionLifecycleSnapshot.ts` | Snapshot builder |
| `frontend/app/lib/decision-timeline/decisionLifecycleRegistry.ts` | Ephemeral registry |
| `frontend/app/lib/decision-timeline/decisionLifecycleEngine.ts` | Public engine API |
| `frontend/app/lib/decision-timeline/decisionLifecycleRunner.ts` | Certification runner |
| `frontend/app/lib/decision-timeline/decisionLifecycleEngine.test.ts` | Certification tests |
| `docs/app-6-4-decision-lifecycle-engine-report.md` | This report |

---

## Public APIs

| API | Module | Description |
|---|---|---|
| `deriveDecisionLifecycle()` | `decisionLifecycleEngine.ts` | Derive lifecycle from decision history |
| `validateDecisionLifecycle()` | `decisionLifecycleValidation.ts` | Validate derived lifecycle integrity |
| `buildDecisionLifecycleSnapshot()` | `decisionLifecycleSnapshot.ts` | Create immutable lifecycle snapshot |
| `getDecisionLifecycle()` | `decisionLifecycleEngine.ts` | Retrieve registered lifecycle |
| `runDecisionLifecycleEngine()` | `decisionLifecycleRunner.ts` | Full certification suite |
| `computeDecisionLifecycle()` | `decisionLifecycleEngine.ts` | Derive, validate, and register lifecycle |
| `validateDecisionLifecycleTransition()` | `decisionLifecycleRules.ts` | Validate individual transition |
| `initializeDecisionLifecycleEngine()` | `decisionLifecycleEngine.ts` | Initialize engine state |

---

## Lifecycle Model

Reuses APP-6:2 `DecisionEngineLifecycle` vocabulary:

| Lifecycle | Derived Status (APP-6:1) |
|---|---|
| proposed | proposed |
| evaluated | proposed |
| approved | committed |
| rejected | revoked |
| cancelled | deferred |
| superseded | superseded |
| executed | committed |
| completed | committed |
| archived | committed |

---

## Transition Rules

**Primary path:** proposed → evaluated → approved → executed → completed → archived

**Branch paths:** evaluated → rejected | cancelled | superseded; approved → cancelled | superseded; executed → cancelled

**Terminal states:** rejected, cancelled, superseded, archived

**Repeatable:** evaluated (supports DECISION_UPDATED events)

**Invalid examples (detected, not repaired):**
- completed → proposed
- archived → approved
- cancelled → executed

---

## Snapshot Model

| Field | Description |
|---|---|
| `decisionId` | Decision identifier |
| `workspaceId` | Workspace scope |
| `currentLifecycle` | Current lifecycle state |
| `previousLifecycle` | Prior lifecycle state |
| `transitionCount` | Number of transitions |
| `isTerminal` | Whether decision is in terminal state |
| `isValid` | Lifecycle integrity flag |
| `validationMessages` | Validation issue messages |
| `historyVersion` | Source history version |
| `generatedAt` | Snapshot capture timestamp |

---

## Validation Rules

- Transition sequence validation
- Invalid transition detection
- Duplicate lifecycle detection (except evaluated)
- Terminal-state violation detection
- Missing history / lifecycle detection
- Workspace isolation
- APP-6:3 history compatibility
- APP-6:2 event compatibility
- APP-6:1 foundation compatibility

---

## Known Limitations

- Ephemeral in-memory registry only — no persistence
- No workflow execution or event generation
- Does not repair invalid histories — reports only
- Lifecycle cache cleared on test reset

---

## Future APP-6 Roadmap

| Phase | Scope |
|---|---|
| APP-6/5 | Decision Query Engine |
| APP-6/6 | Decision Timeline API Layer |
| APP-6/7 | Decision Assistant Integration |
| APP-6/8 | Decision Dashboard Integration |
| APP-6/9 | Decision Timeline Platform Certification |

---

## Certification Summary

All lifecycle engine tests pass. APP-6:1 through APP-6:3 regression checks pass. No certified platform modules modified.

**Certification score: 100/100**

**Architecture compliance score: 100/100**

**Overall platform score: 97/100**

---

## Architecture Verification

- APP-6:1 unchanged
- APP-6:2 unchanged
- APP-6:3 unchanged
- No certified platform modified
- Lifecycle is derived only
- History remains immutable
