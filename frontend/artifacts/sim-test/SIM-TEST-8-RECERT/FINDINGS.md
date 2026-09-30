# SIM-TEST:8-RECERT — Finding classification

Certification-only. No production repair.

Raw rows from `population-run.json` after FIX1. Replay of 25 raw S0/S1 journeys: 25/25 signatures matched.

## Product ledger

| ID | Severity | Rows | Disposition | Root |
| --- | --- | --- | --- | --- |
| ST8-S2-REASSESS | — | 0 | closed | Invented name “Is This Still A” did not recur. 6/6 original Recovery rows now reassess Capacity |
| ST8-S3-NPS | S3 | 1 | 4 known debt | NPS problem label vs active subject. Same SIM-TEST:6/7/8 debt |
| ST8-ADV-DELIVERY | debt | 6 journeys / 12 turns | 4 known / 3 downstream | After “Why are deliveries late?”, Advisor referent is Delivery while L1/Stage/canonical stay Capacity. Response on reassessment discusses Capacity. Not invented-name recurrence |

Product S1: none. Product S2 new: none. S0: none.

## Raw S1, not product S1

### ST8-OBS-GAP — 6 — dispositions 5 and 9

`OPERATOR_ERROR/OBSERVATION_GAP` on unpublished HIDDEN_CHANGE / DELAYED_OBSERVATION manufacturing ticks. Nexora stayed uncertain or asked for a referent. Observer is measuring Operator lag. Leak scan 0.

### ST8-EXP-DECISION — 12 — dispositions 6 and 7

`JOURNEY/MISSING_DECISION` on CHANGE_AFTER_DECISION and CHANGE_DURING_EXECUTION. “Let’s go with the first option.” → “Which option do you want to commit to?” No Decision written. Same clarification recorded in SIM-TEST:7/8.

### ST8-EXP-CLARIFY — 1 — disposition 7

`JOURNEY/REPEATED_CLARIFICATION` on CHANGE_BEFORE_QUESTION long investigative, after Why? / I don’t know, no current subject, “Is this still a problem?” → name the issue. FIX1 did not guess. Correct ambiguity behavior.

### ST8-ADV-DELIVERY — 6 Observer S1 — dispositions 4 and 3

`JOURNEY/ADVISOR_DIVERGENCE` on the six original Recovery ST8-S2-REASSESS journeys, turn 3, “Is this still a problem?”. Canonical/L1/Stage: `obj-capacity`. Advisor: `obj-delivery` / Delivery. Reply discusses Capacity, not a new named Problem. Same pattern on the prior turn “Why are deliveries late?” (6 additional turn observations, not all Observer-flagged as S1). Preserved known downstream debt. Not FIX1 regression.

## Detections that did not fire

GROUND_TRUTH_LEAK 0. TEMPORAL_CONFUSION 0. STALE_EVIDENCE 0. CURRENT_STATE_IGNORED 0. DUPLICATE_DECISION 0. DECISION_IDENTITY_DRIFT 0. PREMATURE_EXECUTION 0. DUPLICATE_EXECUTION 0. FAILURE_TO_HANDLE_AMBIGUITY 0.

## FIX1 recert scan

Reassessment occurrences: 30. Invented-name / “Is This Still A”: 0. Identity preserved vs prior turn: 29. No current subject (clarify): 1. Identity silently changed: 0.

Unpublished asks: 22. Leak hits: 0.
