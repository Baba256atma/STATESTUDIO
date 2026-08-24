# CORE-OUT:1A — Observation Contract

Identity: `CORE-OUT:1A/LiveOutcomeObservationCapture` **1.0.0**  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Authority split

```
Data Reality
    owns observed business state
CORE-OUT:1A
    owns capture + Outcome linkage
CORE-OUT:1
    owns expected-vs-actual evaluation
CORE-INT:3
    owns causal interpretation
CORE-OUT:2
    future Learning — NOT STARTED
```

CORE-OUT:1A answers: **“I observed Y, and Y is or is not valid evidence for expected Outcome X.”**  
It does not answer: **“X succeeded”** or **“X caused Y.”**

## Canonical observation

`CapturedOutcomeObservation`

| Field | Rule |
|---|---|
| `observationId` | Stable. `obs:{sourceId}:{datasetId}:{metricId}:{observedAt}` |
| `subjectId` / `metricId` / `dimension` / `unit` | Canonical identifiers. No fuzzy matching. |
| `value` / `qualitativeState` | Observed measurement. |
| `observedAt` / `capturedAt` | Required for Outcome eligibility. Never invented. |
| `sourceId` / `datasetId` | Required provenance identity. |
| `evidenceRefs` / `provenanceRefs` | Required for validated Actual Outcome. |
| `validationState` | Reuses RDI: `valid \| partial \| invalid \| unsupported \| stale` |
| `freshnessState` | `current \| stale \| unknown`. Stale remains stale. |
| `outcomeLink` | Explicit linkage or `null`. |
| `eligibleAsActualOutcome` | Deterministic. Not a success evaluation. |

Identity is not `subjectId + KPI name + current value`.  
Capacity at T1 ≠ Capacity at T2 even when the number is identical.

## Eligibility for Actual Outcome evidence

All of the following must hold:

1. Provenance exists (`sourceId`, `datasetId`, `provenanceRefs`)
2. `observedAt` exists
3. Validation is `valid`, `partial`, or `stale` (`invalid` / `unsupported` rejected)
4. Explicit Outcome link exists
5. Dimension matches the expected Outcome
6. Units match when both are present (no new conversion engine)
7. Observation belongs to a real observation window with timing
8. Not execution-progress-only
9. Not recent-change-only

Missing any of these: the record may remain Reality. It is **not** validated Actual Outcome.

## Storage

Lifetime: **session** in-memory repository.  
Not browser durable. Not server durable. Not APP-4 Learning.

Reprocessing the same source snapshot is idempotent and does not overwrite history.
