# NPA-T SIM-TEST:5-FIX1 — Option Commitment & Clarification Repair

**Status: CERTIFIED**

Date: 2026-09-28.

Original SIM-TEST:5: **NOT CERTIFIED** (S0=0, S1=15).  
After FIX1: commitment seam repaired. **SIM-TEST:5 remains STILL NOT CERTIFIED** (material S1 remain; see `SIM-TEST-5-RECERT-STATUS.md`).

SIM-TEST:6 was not started.

## Gate (FIX1)

| Check | Result |
| --- | --- |
| Manufacturing Option B → CC:10 | PASS `applied` Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` |
| Project delivery plan → CC:10 | PASS `Investigate Delivery` |
| Candidate identity through confirm | PASS `already-committed`, count=1 |
| Premature Decision (Start option B before collection) | PASS count=0 |
| Duplicate Decision | PASS count=1 |
| CC:10 only writer | PASS |
| CC:11 no-Decision refuse / sees Approved | PASS |
| SIM-TEST:4-FIX1 / SIM-TEST:3-FIX1 | PASS S1=0 |
| New S0 | 0 |
| Harness failures | 0 |

## Production files changed (FIX1 owning seams)

- `conversationalExperienceOrchestrator.ts` — retain active CC:9 option collection across discussion turns; do not let VAI:8 overlay wipe `candidateScenarioIds`
- `conversationalIntentNormalization.ts` — `show me the alternatives` is an investigation-options utterance so CC:9 can seed the pair
- `conversationalIntentResolver.ts` — `use/choose option {letter}` and `second option` are `commit-decision`; confirm phrases `yes, make that the decision`
- `executiveDecisionCommitmentResolver.ts` — ordinal `option b` against the active collection; unmatched named hint does not fall through to active scenario; unique intervention plan name for delivery recovery

NMI / MLEVEL / Stage / CC:11 / Operator / Data / Outcome / Learning: **not** modified for this repair.

CC:10 resolver was changed only for candidate *input* resolution, not to bypass commitment policy.

## Stop

Do not start SIM-TEST:6. Next owning FIX is the earliest remaining independent S1 (Advisor evidence mismatch or later conversation clarification), not another commitment bypass.
