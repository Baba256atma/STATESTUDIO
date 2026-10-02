# NPA-T OUT-DIR:1-R2 — Canonical Observed Direction Projection Recertification

## A. Status

**OUT-DIR:1-R2 = CERTIFIED**

Parent program: **SIM-TEST:10 remains NOT CERTIFIED**. Historical **OUT-DIR:1 remains NOT CERTIFIED** (capability gap at that time). **RDI-DIR:1 remains CERTIFIED**.

## B. Starting Evidence

OUT-DIR:1: CORE-OUT:1A was not dropping a published fact; the fact did not exist.

RDI-DIR:1: Data Reality can establish `increase` / `decrease` / `stable` / `null` from published KPI history. Live Capacity 90.91 → 100 = `increase`. CORE-OUT:1A still emitted `null` until this phase.

## C. First Divergent Seam

| Field | Value |
| --- | --- |
| Canonical direction owner | P0:1 / RDI-DIR:1 `projectPublishedKpiObservedDirection` |
| First function not forwarding | `toEvaluatorObservation` in `nexoraLiveOutcomeObservationCapture.ts` (hardcoded `observedDirection: null`) |
| Smallest seam | resolve matching published KPI observation by subject + kpiId + sourceContextId + observedAt, then forward RDI result |

## D. Canonical RDI Input

`projectPublishedKpiObservedDirection({ kpiId, subjectId, currentObservationId })` after `listPublishedKpiObservations` identity match.

No local `actual > baseline` arithmetic.

## E. Production Repair

| File | Functions |
| --- | --- |
| `nexoraLiveOutcomeObservationCapture.ts` | `resolvePublishedObservedDirection`, `toEvaluatorObservation` |
| `nexoraLiveOutcomeIntelligence.ts` | `OutcomeObservedDirection` union so the evaluator observation may hold RDI tokens; `qualitativeResult` parameter type only — **body unchanged** |

RDI-DIR direction semantics: **not modified**.

## F. No-Recomputation Proof

`LIVE_OUTCOME_OBSERVATION_BOUNDARY.infersObservedDirection = false`. Source contains `projectPublishedKpiObservedDirection` and does not contain `actual > baseline` or `Math.sign`.

## G. Identity Resolution

- Subject: capture `subjectId` vs RDI `nexoraObjectId` / object map
- KPI: exact `kpiId` when capture `metricId` is a `kpi.*` id; short dimension names still match via existing `dimensionsCompatible`
- Source: `captured.sourceId === published.sourceContextId`
- Time: `captured.observedAt === published.observedAt`
- Then RDI `currentObservationId` pins the interval (not global latest)

## H. Provenance

RDI previous/current publication refs are appended onto the evaluator observation `provenanceRefs`.

## I. Increase Projection

CSV 10/11 → 100/100 and live Capacity 90.91 → 100: CORE-OUT `observedDirection = increase`.

## J. Decrease Projection

100 → 90: CORE-OUT `decrease`.

## K. Stable Projection

100 → 100: CORE-OUT `stable`.

## L. Null Preservation

First publication, hidden GT, pre-publication ask, same-timestamp correction, wrong metric/subject/source: `null`.

## M. Family A / R4 Replay

| Field | Before (R4 / OUT-DIR:1) | After OUT-DIR:1-R2 |
| --- | --- | --- |
| baseline | ≈ 90.91 | ≈ 90.91 |
| actual | 100 | 100 |
| expectedDirection | maintain | maintain |
| RDI observedDirection | increase (after RDI-DIR) | increase |
| CORE-OUT observedDirection | null | **increase** |
| numericTarget | null | null |
| comparator | null | null |

## N. CORE-OUT:1 Result

Existing qualitative policy, unmodified:

- `status`: **comparison-ready**
- `comparable`: true
- `result`: **not-met** (`maintain` vs `increase`, because actual is not `unchanged`)
- `incompatibilityReason`: null
- `missingEvidence`: []

`increase` was **not** rewritten to `improved`.

## O. Comparison Readiness

R4 representative **becomes comparison-ready**. That is downstream evidence that the projection seam is the correct one.

Focused live Family A: comparison-ready = 1 for that replay. This phase does not certify population coverage.

## P. CORE-OUT:2 Observation

Family A replay: `assessment.createsLearning = false`. One grounded-learning candidate with `promotionEligible: true`. Learning correctness is **not** certified here.

## Q. Causation

`establishesCausation = false`. No overreach.

## R–T. Isolation

Wrong KPI / wrong subject / wrong source → null. Capacity `increase` does not bind to Delivery. Historical T2 stays `increase` after T3.

## U. Temporal / Historical

Out-of-order ingest follows RDI `observedAt`. Delayed/hidden GT: no direction until publication.

## V. Ground Truth Firewall

Leaks = 0.

## W. Raw / Product Findings

| Finding | Class |
| --- | --- |
| Canonical RDI increase reaches CORE-OUT | intended product S2 repair |
| maintain + increase → comparison-ready / not-met | correct existing CORE-OUT policy |
| createsLearning false on CORE-OUT:1 | correct no-learning gate for this layer |
| 1 CORE-OUT:2 candidate promotionEligible | downstream observation only |
| increase ≠ improved | preserved |

## X. Deterministic Replays

Family A `sim-test-10-a_expected_positive`: RDI increase, CORE-OUT increase, expected maintain. Matches.

## Y. Regression

| Suite | Result |
| --- | --- |
| OUT-DIR:1-R2 | 9 pass / 0 fail |
| Focused (RDI-DIR, RDI:1/2, CSV durability, OUT-DIR:1, OUT-BASE, OUT-LIVE, OUT-EVAL, COMMIT-LIVE, CORE-OUT:1A/1/2, MVP-OUT:1 R1–R3, NPS:8, ECA:11/12, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1) | **533 pass / 0 fail** |

Not run: SIM-TEST:10-R5, Level 4, full repository.

## Z. Production Integrity

| File | SHA-256 |
| --- | --- |
| `nexoraLiveOutcomeIntelligence.ts` | `fe9c1d53d3f538b9ac32475cad7e46fbd1c8f74605a07874ba5b7a6fc02d54ba` |
| `nexoraLiveOutcomeObservationCapture.ts` | `b3a1cb8081b66db6a875c6216401c809b23890ada163561eebda4ce237be9325` |

## AA. Architecture Integrity

- New direction authority = none
- New trend engine = none
- New direction store = none
- New Data Reality authority = none
- New Outcome authority = none
- New Learning authority = none

## AB. Remaining Boundary

**Comparison-ready Evaluation → Supported Learning** at population scale (SIM-TEST:10-R5).

R4 representative is comparison-ready with result `not-met`. CORE-OUT:1 `createsLearning` remains false. Full Learning/loop certification is not this phase.

## AC. Next Action

Run **NPA-T SIM-TEST:10-R5 — Full Outcome & Management Learning Recertification** from turn 1.

Do **not** start OUT-DIR:2. Do **not** certify SIM-TEST:10 from this phase.
