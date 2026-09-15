# NPA-T NPS:5 — Architecture Inspection

Inspection date: 2026-09-15.

NPS:5 composes comparison and recommendation path state. It does not own comparison, scoring, recommendation storage, commitment, or Decision.

## Canonical owners

| Concern | Owner | NPS:5 role |
| --- | --- | --- |
| Problem truth | NPS:1 preserved through NPS:2–4 | Operate only when `DETERMINED`; else `CLARIFY_PROBLEM` |
| Option / Scenario truth | NPS:4 candidates; CC:9 canonical Scenarios | Compare the same identities; no duplicate Scenario |
| Evidence / cause | NPS:3 | Traceability and causal uncertainty survive |
| Comparison | NCA-POST:4 | Owner. NPS observes `comparisonAvailable` |
| Trade-off interpretation | NCA-POST:4 / ECA:7 qualitative framing | Compose advantages and disadvantages; no scores |
| Recommendation | ECA:7 / NCA:4 | Owner. NPS records status, does not store a recommendation authority |
| Manager preference | Manager utterance / ECA:5 / ECA:7 criterion source | Kept separate from `nexoraRecommendation` |
| Commitment | ECA:8 | Next path only; NPS:5 does not perform it |
| Decision | CC:10 | Untouched |

## Vocabulary mapping

- Comparison status: `NOT_READY | COMPARING | INSUFFICIENT_INFORMATION | TRADEOFFS_AVAILABLE | NO_CLEAR_PREFERENCE | PREFERENCE_EMERGING | READY_FOR_RECOMMENDATION`
- Recommendation status reuses ECA:7 outcomes: `RECOMMEND | DEFER | NO_CLEAR_PREFERENCE | CONDITIONAL_RECOMMENDATION`
- NCA-POST:4 criteria (`COST`, `RISK`, `REVERSIBILITY`, urgency/speed) inform relevant dimensions; NPS does not add every possible dimension
- Cost and time remain `UNKNOWN` unless an existing canonical model supplies them

## Path

`OPTIONS_AVAILABLE` → `COMPARING_OPTIONS` when comparison facts are observed → `RECOMMENDATION_READY` when recommendation reasoning is complete. `AWAITING_COMMITMENT` is the next valid state and is not entered by NPS:5.

NPS:6 was not started.
