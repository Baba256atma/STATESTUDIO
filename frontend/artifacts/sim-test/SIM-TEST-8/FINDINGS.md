# SIM-TEST:8 — Finding classification

Raw rows come from `population-run.json`. Classification was done before any repair. No production behavior was changed.

Dispositions: 1 product defect, 2 same-root, 3 downstream, 4 existing debt, 5 observer error, 6 test expectation, 7 expected clarification, 8 correct uncertainty, 9 correct no-knowledge, 10 acceptable.

## Product ledger

| ID | Severity | Rows | Disposition | Root |
| --- | --- | --- | --- | --- |
| ST8-S2-REASSESS | S2 | 6 | 1, with 2 on the same phrase | “Is this still a problem?” is recovered as the name “Is This Still A”. Reply: no clear match. Canonical and Stage subject stayed `obj-capacity` |
| ST8-S3-NPS | S3 | 1 | 4 | NPS problem label vs active subject. Same SIM-TEST:6/7 debt |

Product S1: none. S0: none.

ST8-S2-REASSESS is not manager-dangerous: no wrong object was acted on, no Decision or Execution was written, and Ground Truth was not leaked. It is a material failure to treat a recovery/reassessment turn as a follow-up on the current subject. Owning seam: FINAL:6.1 / CC:1. Same-root: the CHANGE_BEFORE_QUESTION repeated-clarification on the same utterance (see below). Downstream: Advisor referent name diverges while L1 stays on Capacity.

## Raw S1, not product S1

### ST8-OBS-GAP — 6 rows — dispositions 5 and 9

`OPERATOR_ERROR/OBSERVATION_GAP`, all on unpublished ticks (HIDDEN_CHANGE or DELAYED_OBSERVATION, manufacturing).

Ground Truth had already taken the tick-10 demand event. Operator had not published. Nexora answers stayed uncertain (`evidence is not strong enough`, relationships `do not establish a confirmed cause`). The Observer is recording the lag the test exists to prove. Not a Nexora leak.

### ST8-EXP-DECISION — 12 rows — dispositions 6 and 7

`JOURNEY/MISSING_DECISION` on CHANGE_AFTER_DECISION and CHANGE_DURING_EXECUTION.

Utterance `Let's go with the first option.` Reply `Which option do you want to commit to?` No decision id. Later world publications therefore had no committed Decision to rewrite. Same clarification recorded in SIM-TEST:7.

### ST8-EXP-CLARIFY — 1 row — dispositions 2 and 7

`JOURNEY/REPEATED_CLARIFICATION` on CHANGE_BEFORE_QUESTION, investigative, `Is this still a problem?` → `I'm not sure which issue you mean.` Same-root as ST8-S2-REASSESS. The S1 is the two-turn clarification budget, not a second product root.

## Detections that did not fire

`GROUND_TRUTH_LEAK` 0. `TEMPORAL_CONFUSION` 0. `STALE_EVIDENCE` 0. `CURRENT_STATE_IGNORED` 0. `WRONG_REFERENT` 0. `DECISION_IDENTITY_DRIFT` 0. `DUPLICATE_DECISION` 0. `PREMATURE_EXECUTION` 0. `FALSE_CERTAINTY` 0. `UNSUPPORTED_CAUSAL_CLAIM` 0.

## Replay

Every journey with a raw S0 or S1 row was run again with the same journey id, seed, and run id. 25 signatures matched. 0 mismatched.
