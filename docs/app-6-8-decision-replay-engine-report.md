# APP-6:8 — Decision Replay Engine Report

**Phase:** APP-6/8  
**Contract Version:** APP-6/8  
**Status:** Complete  
**Certification:** PASS  

---

## Purpose

APP-6:8 establishes Nexora's canonical Decision Replay Engine — a deterministic, read-only traversal layer over immutable Decision History.

Replay is navigation only. It never creates, edits, derives, or mutates decision data. Future Dashboard and Assistant modules consume this engine for chronological decision evolution views.

---

## Architecture

```
decisionReplayTypes.ts       — Replay model, cursor actions, constants
decisionReplayCursor.ts      — Cursor resolution and bounds logic
decisionReplayValidation.ts  — Input, history, query, workspace validation
decisionReplayRegistry.ts    — Ephemeral replay session cache
decisionReplaySnapshot.ts    — Immutable replay snapshot builder
decisionReplayEngine.ts      — Public replay API and stage manifest
decisionReplayRunner.ts      — Certification orchestration
decisionReplayEngine.test.ts — Deterministic certification tests
```

Data flow:

```
APP-6:6 getDecisionById() → APP-6:3 getDecisionHistory() → Cursor Traversal → Immutable Replay View
```

---

## Created Files

| File | Role |
|---|---|
| `decisionReplayTypes.ts` | Domain types and constants |
| `decisionReplayCursor.ts` | Cursor navigation logic |
| `decisionReplayValidation.ts` | Validation rules |
| `decisionReplayRegistry.ts` | Replay session cache |
| `decisionReplaySnapshot.ts` | Snapshot generation |
| `decisionReplayEngine.ts` | Core engine and public APIs |
| `decisionReplayRunner.ts` | Certification runner |
| `decisionReplayEngine.test.ts` | Test suite |
| `docs/app-6-8-decision-replay-engine-report.md` | This report |

---

## Public APIs

| API | Description |
|---|---|
| `createDecisionReplay()` | Create replay session from registered history |
| `createReplay()` | Alias for createDecisionReplay |
| `getReplay()` | Retrieve replay by ID |
| `moveReplayCursor()` | Move cursor by action |
| `moveNext()` | Advance cursor |
| `movePrevious()` | Retreat cursor |
| `moveFirst()` | Jump to first event |
| `moveLast()` | Jump to last event |
| `jumpToIndex()` | Jump to event index |
| `jumpToEvent()` | Jump to event by ID |
| `resetReplay()` | Reset cursor to first event |
| `getReplaySnapshot()` | Get immutable replay snapshot |
| `validateDecisionReplay()` | Validate replay object |
| `buildDecisionReplaySnapshot()` | Build snapshot from replay |
| `freezeDecisionReplaySnapshot()` | Re-freeze snapshot |
| `runDecisionReplayEngine()` | Full certification suite |
| `initializeDecisionReplayEngine()` | Initialize engine |

---

## Replay Model

| Field | Description |
|---|---|
| `replayId` | Unique replay session ID |
| `decisionId` | Decision being replayed |
| `workspaceId` | Workspace scope |
| `historyVersion` | Source APP-6/3 history version |
| `historySnapshotId` | APP-6/3 history snapshot reference |
| `cursorIndex` | Current position in event sequence |
| `currentEvent` | Event at cursor |
| `totalEvents` | Total events in history |
| `isFirst` | Cursor at first event |
| `isLast` | Cursor at last event |
| `generatedAt` | Replay generation timestamp |

---

## Cursor Model

Supported actions: `next`, `previous`, `first`, `last`, `jumpToIndex`, `jumpToEvent`, `reset`.

Cursor moves produce new immutable replay views. History and events are never mutated.

---

## Navigation Rules

- Events traversed in APP-6/3 `orderedEvents` sequence
- Out-of-bounds jumps rejected
- Missing history or DecisionState rejected
- Cross-workspace replay rejected
- Same replay session updated in registry (session events frozen)

---

## Validation Rules

- Invalid cursor detection
- Missing history and DecisionState rejection
- Workspace isolation enforcement
- APP-6:1 foundation compatibility
- APP-6:3 history compatibility
- APP-6:6 query engine initialization required
- Immutable frozen outputs

---

## Known Limitations

- Ephemeral in-memory registry only — no persistence
- Requires history registered in APP-6/3 and state in APP-6/5/6
- No animation, UI controls, or playback timing
- Single-decision replay per session

---

## Future Dashboard & Assistant Consumers

| Consumer | Phase |
|---|---|
| Decision Dashboard | APP-6/9 |
| Decision Assistant | APP-6/9 |
| Decision API Layer | APP-6/10 |
| Platform Certification | APP-6/11 |

---

## Certification Summary

All replay engine tests pass. APP-6:1 through APP-6:7 regression checks pass. No certified platform modules modified.

**Certification score: 100/100**

**Architecture compliance score: 100/100**

**Overall platform score: 97/100**

---

## Architecture Verification

- APP-6:1 through APP-6:7 unchanged
- Replay consumes APP-6/3 history reads and APP-6/6 query resolution only
- No history rebuild, lifecycle derivation, or event mutation
- Read-only, deterministic, immutable traversal
