# APP-1:6 — Executive Time Priority Engine Report

## Purpose

APP-1:6 implements the **Executive Time Priority Engine** — the sole authority for evaluating temporal priority. Priority is an evaluated decision, not a manually assigned property.

This phase extends APP-1:5.5 Priority Authority Contract with rule-based evaluation, resolution, escalation metadata, and immutable results.

## Architecture

```
Executive Entity
        │
        ▼
Priority Policy (APP-1:5.5 metadata)
        │
        ▼
Priority Engine (APP-1:6 evaluation)
        │
        ▼
Immutable Priority Result
        │
        ▼
Future Consumers (Dashboard / Assistant / Timeline / Recommendation)
```

The engine never mutates business entities.

## Evaluation Pipeline

1. Read current time context (read-only)
2. Read camera position (read-only)
3. Read entity state and temporal snapshot (read-only)
4. Evaluate optional transition status via Transition Engine (read-only)
5. Apply temporal signals: deadlines, windows, approval, dependencies
6. Compute score and map to policy level
7. Attach contributing factors, confidence, escalation, explanation
8. Return frozen `ExecutiveTimePriorityResult`

## Priority Resolution

| API | Purpose |
|-----|---------|
| `resolveHighestPriority()` | Highest-severity result from a batch |
| `resolvePriorityGroup()` | Filter results by priority level |
| `resolvePriorityDistribution()` | Count and percentage by level |
| `resolvePriorityStatistics()` | Aggregate confidence and escalation metadata |

## Escalation Model

Metadata-only escalation labels (no scheduling or notifications):

| Priority | Escalation |
|----------|------------|
| critical | Immediate |
| urgent | Today |
| soon | Next Working Window |
| normal | Standard Queue |
| later | Deferred |
| expired | Immediate Review |

## Immutable Result

`ExecutiveTimePriorityResult` includes:

- `priority`, `confidence`, `explanation`
- `matchedPolicies`, `contributingFactors`, `warnings`
- `escalationLevel`, `metadata`

All objects are frozen via `Object.freeze()`.

## Certification

Tags: `[APP1_6_TIME_PRIORITY_ENGINE]`, `[TIME_PRIORITY_ENGINE_READY]`, `[PRIORITY_EVALUATION_READY]`, `[PRIORITY_ESCALATION_READY]`, `[IMMUTABLE_PRIORITY_RESULT]`, `[NO_UI_MUTATION]`

Gates A–Z verify engine, resolver, evaluation, escalation, policy consumption, batch/highest/distribution/statistics, explanation, immutability, read-only dependencies, future contracts, UI isolation, regression, and report.

Run:

```bash
cd frontend && node --test app/lib/executive-time/executiveTimePriorityCertification.test.ts
```

## Tests

- Single and batch evaluation
- Priority resolution, distribution, statistics
- Escalation metadata
- Immutable results and explanations
- Confidence generation
- Read-only dependency usage
- APP-1:5.5 and APP-1:5 regression
- Certification gates

## Isolation Summary

No modifications to Dashboard, Assistant, Timeline, Time Panel, Scenario/Risk/KPI runtimes, Workspace, Scene, Recommendation, or Executive Memory.

Library-only under `frontend/app/lib/executive-time/`.

## Deferred Features

- Dashboard / Assistant / Timeline integration
- Notifications and scheduling
- ML / prediction
- Business metric scoring
- Persistence

## Next Phase

**APP-1:7 — Executive Time Event Engine**

Canonical Executive Time Event model, event classification, event registry, event resolution, immutable event records, and event orchestration contracts for Timeline, Executive Memory, Dashboard, Assistant, and Scenario Intelligence.
