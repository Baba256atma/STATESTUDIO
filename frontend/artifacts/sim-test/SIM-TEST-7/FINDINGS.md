# SIM-TEST:7 — Finding classification

Raw rows come from `population-run.json`. Classification was done before any repair. No production behavior was changed to clear a row.

| Class | Meaning |
| --- | --- |
| 1 | New SIM-TEST:7 product finding |
| 2 | Regression of certified behavior |
| 3 | Same-root as another finding |
| 4 | Downstream symptom |
| 5 | Pre-existing debt |
| 6 | Observer error |
| 7 | Test expectation error |
| 8 | Acceptable behavior |

## Product ledger

| ID | Severity | Rows | Class | Root |
| --- | --- | --- | --- | --- |
| ST7-S3-NPS | S3 | 14 | 5, same root as SIM-TEST:6 FINAL NPS `SUBJECT_LOSS` | NPS problem label differs from the active subject while the reply stays on that subject |

Product S1 roots: none. Product S2 roots: none. S0: none.

Example of the S3 row: structured manager, manufacturing, seed 29, turn 5, utterance `Show the Delivery problem.`, canonical subject `obj-delivery`, reply `I don't see that Problem. Current Problems are Capacity Gap, Margin Pressure.` The active subject stays Delivery. The NPS label does not. That is the debt already recorded in `../SIM-TEST-6-FINAL/DEBT-LEDGER.md`.

## Raw S1 rows, not product defects

### ST7-OBS-CLARIFY — 41 rows — classes 7 and 8

`JOURNEY/REPEATED_CLARIFICATION`, owner CC:5.

Profiles: impatient 11, investigative 11, nonlinear 8, ambiguous 5, distracted 4, decision-oriented 1, executive 1.

The journey budget flags clarification that continues past two turns. In these runs the manager's next turn was still unnamed (`Show me.`, `Why?`, `I don't know`, `What about that?`). Nexora answered with lines such as `I'm not sure which issue you mean. Name the one you want to investigate.` and `Which one do you want me to look at?` Thirty-one of the 41 rows still had no canonical subject. Ten had a subject and still asked, including `Which do you mean, the Delivery KPI or the Capacity Gap?`

That is the certified ambiguity contract: do not invent the missing subject. The S1 label is the scripted clarification budget, not a failure to recover a named subject.

Adjacent wording, not separately scored: some replies repeat `I'll keep that uncertain rather than inventing a value`. One project impatient `Why?` adds the standing hedged line `I recommend temporary capacity` and states that labor availability is not confirmed and that the discussion was not switched. One `Start it.` reply states that no Decision is committed and execution has not started. Those are boundary-preserving. The repeated hedge sentence is the same class of wording residue already carried as SIM-TEST:6 debt. It is not an S1.

### ST7-OBS-CATALOG — 11 S1 rows plus 1 raw wrong-referent — classes 8 and 6

`JOURNEY/SUBJECT_LOSS` S1, utterances `Show the Resources problem.`, `Show the Schedule problem.`, `Show the Staffing problem.`, `Show the Milestone problem.`

Every reply: `I don't see that Problem. Current Problems are Capacity Gap, Margin Pressure.`

Those names are not registered problems. Nexora names the problems it has and does not create the missing one. The S1 fires because the uncertainty matcher does not treat `I don't see` as an acknowledgement. The single `WRONG_REFERENT` is the same refusal: `Show the Milestone problem.` left the previous Delivery subject in place and said the problem is not present.

The registered catalog remaining Capacity Gap and Margin Pressure on project, logistics, and service worlds is the catalog SIM-TEST:6 already certified. It is not a new defect.

### ST7-OBS-CSV — 10 rows — class 6

`JOURNEY/EVIDENCE_MISMATCH`, all data-challenging, all project journeys.

Reply, identical on all 10: `The current Data Library contains PMO.csv and ProjectControl.csv.`

`nexoraSimulationCsvIngestion.ts` writes `PROJECT_CONTROL` as `ProjectControl.csv`. The observer compares the file stem `projectcontrol` with the source type `project_control` and reports a missing file. The reply matches the ingested files.

### ST7-OBS-DECISION — 9 rows — classes 7 and 8

`JOURNEY/MISSING_DECISION`, all decision-oriented.

Utterance `Let's go with the first option.` Reply `Which option do you want to commit to?` Decision status `clarification-required`. No decision id was written.

The lifecycle classifier treats that utterance as a commitment that must already have a CC:10 id. The product asked which option. The decision boundary held.

## Detections that did not fire

`FALSE_CERTAINTY` 0. `FAILURE_TO_HANDLE_AMBIGUITY` 0. `GROUND_TRUTH_LEAK` 0. `UNSUPPORTED_CAUSAL_CLAIM` 0. `PREMATURE_EXECUTION` 0. `DUPLICATE_DECISION` 0. `DECISION_IDENTITY_DRIFT` 0. `MLEVEL_DIVERGENCE` 0.

## Replay

Every journey with a raw S0 or S1 row was run again with the same journey id, seed, and run id. 46 signatures matched. 0 mismatched.
