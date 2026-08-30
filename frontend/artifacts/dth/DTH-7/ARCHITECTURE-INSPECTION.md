# DTH:7 — Decision Comparison Experience

## Smallest extension point

Project `DecisionComparison` from Theatre after DTH:1–6, using only:

1. DTH:5 Scene Intent `COMPARE_CANDIDATES` with ≥2 `comparisonMembers`, or
2. NCA `activeComparison.candidateIds` (≥2)

Do **not** create a second comparison engine, Scenario/Decision store, ranking engine, recommendation engine, NLU, or NexoCompare arena.

Canonical flow:

Authoritative membership → Theatre projection (read-only) → comparison overlay + Advisor-readable comparison → optional DTH:6 investigation of a candidate → close investigation restores the same comparison.

Clicking a candidate is focus/investigation, not approval. `PROCEED_TO_DECISION` stays unavailable; choosing routes through the existing Decision workflow.

## Reused authorities

| Concern | Authority |
|---|---|
| Comparison membership | NCA-POST:4 `activeComparison` / DTH:5 `COMPARE_CANDIDATES` |
| Recommendation / evidence state | NCA-POST:4 / NXA:5 when supplied — presented, not recomputed |
| Scene meaning | DTH:5 Scene Intent / Scene Script |
| Candidate detail | DTH:6 Object Investigation |
| Iconic Cost/Time/Evidence/Risk | DTH:2 |
| Visual grammar | DTH:3 |
| Click / focus | NEX-MVP:4 |
| Advisor dialogue | Existing CC/MO/NCA path |
| Decision / Execution | Existing CC:10 / NEX-EXP Decision workflow |

## Capability

Supported: `decision-comparison`.

Still reserved (7), including `nexo-compare-decision-arena`. DTH:7 is Theatre comparison presentation, not the reserved NexoCompare arena.

DTH:8 is not started.
