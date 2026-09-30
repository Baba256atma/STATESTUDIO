# CC:10 handoff evidence

CC:10 remains the only Decision writer. CC:5 does not call `createDecision`. Harness only reads `listDecisions()`.

## Manufacturing T13

- Utterance: “Let's go with option B.”
- Intent: `commit-decision` / approve / explicit
- Collection: `[Investigate Capacity, No Action on Capacity]`
- Hint: `option b` → ordinal 1
- Canonical candidate: do-nothing scenario (second visible option)
- CC:10 invoked: **yes**, status `applied`
- Decision ID: `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- Duplicate after T14/T15 confirm: **no** (`already-committed`, count=1)

## Project T9

- Utterance: “Approve the delivery recovery plan.”
- CC:10 invoked: **yes**, status `applied`
- Decision ID: `cc10:decision:cc9:scenario:intervention:obj-delivery:v1`

## Pre-repair

CC:10 was reached with empty collection → `clarification-required`. It did not reject a valid candidate; it had none.

## Negative paths (focused tests)

- “What about option B?” → not applied, count=0
- “Compare option A and option B.” → not applied
- Soft “probably choose B” → confirmation-required; “Yes” → one Decision; “No, cancel” → 0
- Duplicate confirm → 1 Decision

## CC:11

Without Decision (original T17): refused. After repair T17 “Start it.”: Execution started against the Approved Decision. CC:11 tests still refuse non-approved / missing Decision.
