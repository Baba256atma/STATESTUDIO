# CORE-OUT:1A — Outcome Link Contract

Identity: `CORE-OUT:1A/LiveOutcomeObservationCapture` **1.0.0**

## Meaning of `outcomeLinked`

An observation is Outcome-linked only when a deterministic binding exists between:

- an expected Outcome target, and
- the observed canonical dimension

or another explicit canonical Outcome target.

Temporal sequence alone is never a link.

## Link record

`OutcomeObservationLink`

| Field | Rule |
|---|---|
| `observationId` | Captured observation identity |
| `expectedOutcomeId` | Stable expected identity, reused as `expected:{sourceId}` |
| `decisionId` / `executionId` / `subjectId` | Optional context. Not causation. |
| `linkBasis` | Authoritative binding kind only |
| `comparisonDimension` | Exact expected dimension |
| `confidence` | Bounded; `partial` validation forces `low` |
| `evidenceRefs` / `provenanceRefs` | Preserved from the observation |

## Allowed `linkBasis`

- `explicit-target-binding`
- `metric-binding`
- `execution-target-binding`
- `decision-outcome-binding`
- `manual-validated-binding`

Manual binding is an explicit validated action. It is not simulated in the live manager UI.

## Forbidden `linkBasis`

- `temporal-proximity`
- `semantic-guess`
- `llm-inferred`

Decision at T1 + KPI change at T2 **does not** mean the Decision caused the change, and **does not** create Outcome linkage.

## Compatibility

Dimension: exact string equality.  
`capacity-utilization` ↔ `capacity-utilization`  
`revenue` is not comparable with `capacity-utilization`.

Unit: exact string equality.  
`%` ↔ `%`  
`USD` is not comparable with `%`.

No conversion engine in this phase.

## CORE-OUT:1 handoff

When a CORE-OUT:1A capture assessment is present, CORE-OUT:1 uses `linkedActuals` and **does not** accept ad-hoc caller `outcomeLinked` booleans from the legacy `actuals` path.

CORE-OUT:1 remains the evaluator.
CORE-OUT:1A does not compare expected vs actual, declare met/not-met, or attribute cause.
