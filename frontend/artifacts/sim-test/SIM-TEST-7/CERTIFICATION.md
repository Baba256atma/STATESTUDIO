# NPA-T SIM-TEST:7 — Real Manager Simulation Expansion

**Verdict: CERTIFIED**

**NPA-T SIM-TEST:7 — CERTIFIED**

Baseline consumed: SIM-TEST:6 post-FIX18 FINAL, recorded as CERTIFIED in `../SIM-TEST-6-FINAL/CERTIFICATION.md`. This phase did not reopen that repair and did not change Nexora conversation, Stage, Advisor, Decision, Execution, Ground Truth, or Data Reality behavior.

## A. Status

CERTIFIED. Raw observer labels included 72 S1 rows. After classification, product S1 is 0, product S2 is 0, and the only measured product residue is the pre-existing NPS label debt (14 S3). No repair was made. No FIX phase was started.

## B. Population executed

Ten behavior profiles ran on the existing RMS manager (`rmsManagerRuntime.ts`, `rmsManagerBehavior.ts`, `rmsManagerProfiles.ts`) through `executeNexoraConversationalExperience`.

| Profile | Role |
| --- | --- |
| STRUCTURED_MANAGER | Clear named requests |
| IMPATIENT_MANAGER | Short deictic commands. Existing profile. A behavior seed selects the short bank; the certified agenda is unchanged when no seed is set |
| AMBIGUOUS_MANAGER | Underspecified turns |
| DISTRACTED_MANAGER | Subject changes and returns |
| INVESTIGATIVE_MANAGER | Cause, evidence, variables, unknowns |
| DECISION_ORIENTED_MANAGER | Problem, scenario, compare, commit, execution |
| SKEPTICAL_MANAGER | Provenance and epistemic challenges |
| NONLINEAR_MANAGER | Roadmap jumps |
| EXECUTIVE_MANAGER | High-level management language |
| DATA_CHALLENGING_MANAGER | Freshness, source, CSV, uncertainty |

Scenarios, all existing RMS worlds: `manufacturing-capacity-pressure`, `project-delivery-pressure`, `logistics-delivery-pressure`, `service-capacity-pressure`.

Seeds: `11` short, `29` medium, `47` long. The long seed rotates one scenario per profile (manufacturing, project, logistics, service, then the same order).

Each manager turn is chosen from the profile, the manager objective, visible Nexora replies, and the seed. Journey steps do not store utterances. Ground Truth and Observer state are not inputs to that choice.

## C. Coverage

| Measure | Count |
| --- | --- |
| Simulations / journeys | 90 |
| Profiles | 10 |
| Scenario families | 4 |
| Seeds | 3 |
| Manager turns | 820 |
| Nexora turns | 820 |
| Short journeys | 40 (28 FAST, 12 INGESTION) |
| Medium journeys | 40 INGESTION |
| Long-session journeys | 10 INGESTION, 18 turns each |
| Distinct manager utterances | 78 |
| Harness failures | 0 |
| Replay mismatches | 0 (46 raw-S1 journeys re-run) |

Medium and long journeys for structured, distracted, nonlinear, executive, and decision-oriented profiles include existing visible L2, L3, and Stage interactions. No `MLEVEL_DIVERGENCE`, `STALE_PARENT`, `STALE_GRANDPARENT`, or `CROSS_BRANCH_ANCESTOR_LEAK` was recorded.

Spoken coverage includes short commands (`Why?`, `Show me.`, `Fix it.`, `Next.`), deictic and ambiguous turns, corrections (`No, I meant Delivery.`), returns (`Go back to …`), comparison, evidence challenges, temporal references, execution starts, and executive lines (`Where are we exposed?`, `Give me the management picture.`, `What decision is blocking the project?`).

CSV ingestion ran on 62 journeys. Project replies that name files name `PMO.csv` and `ProjectControl.csv`, which are the files the existing ingestion map writes for `PMO` and `PROJECT_CONTROL`.

## D. Findings

Raw measurement: S0 0, S1 72, S2 0, S3 14. Product severity after classification: S1 0, S2 0, S3 14. Detail is in `FINDINGS.md`. Replay rows are in `population-run.json`.

| Product severity | Unique roots | Disposition |
| --- | --- | --- |
| S1 | 0 | No manager-dangerous defect |
| S2 | 0 | None measured |
| S3 | 1 | NPS problem-label versus active subject. Same debt as SIM-TEST:6 FINAL. 14 rows |

## E. Regression status

No SIM-TEST:6 / FIX18 certified behavior regressed in this population.

Evidence:

- Certified agenda lines for `STANDARD_MANAGER`, `IMPATIENT_MANAGER`, and `DATA_DRIVEN_MANAGER` are unchanged. `generateRmsManagerTurn` still returns `What is happening?` and `Why?` for those profiles.
- The behavior bank runs only when a behavior seed is set, and not for `STANDARD_MANAGER` or `DATA_DRIVEN_MANAGER`.
- Unnamed and underspecified turns were answered by asking which subject, or by saying the named problem is not present. They did not silently invent a subject, a decision, or an execution.
- `Let's go with the first option.` received `Which option do you want to commit to?` with `clarification-required`.
- `Start it.` without a committed decision was refused.
- Ground Truth leak count is 0. Manager firewall `groundTruthAccess` is false on all 90 runs.
- The full SIM-TEST:6 journey suite was not re-executed. This phase's owning-layer check is the RMS:4 conversation test plus the locked certified utterances. Signature hashing for journeys that have no behavior seed omits the new seed fields, so a later SIM-TEST:6 replay is not shifted by this population.

## F. Observer integrity

The observer stayed read-only. It did not modify the simulation or Nexora. New detectors `FALSE_CERTAINTY` and `FAILURE_TO_HANDLE_AMBIGUITY` reuse the journey finding list and fired 0 times. The other requested detections map onto existing journey types (`SIM_TEST_7_OBSERVER_DETECTIONS`). No second taxonomy was added.

Observer and expectation errors, all raw S1, none promoted to product defects:

| Raw label | Rows | Class |
| --- | --- | --- |
| `JOURNEY/REPEATED_CLARIFICATION` | 41 | Test expectation. The budget expects clarification to end after two turns. These managers kept saying `I don't know` or another unnamed turn. Nexora kept the subject unresolved. |
| `JOURNEY/EVIDENCE_MISMATCH` | 10 | Observer error. The matcher compares `ProjectControl.csv` with source type `PROJECT_CONTROL` and misses the existing file-name map. |
| `JOURNEY/SUBJECT_LOSS` S1 | 11 | Acceptable refusal. `I don't see that Problem` plus the registered problems Capacity Gap and Margin Pressure. The uncertainty matcher does not treat `I don't see` as an acknowledgement. |
| `JOURNEY/MISSING_DECISION` | 9 | Test expectation. Commitment of `the first option` without a resolved option stays in clarification. |
| `JOURNEY/WRONG_REFERENT` | 1 | Acceptable refusal. `Show the Milestone problem.` stayed on the previous Delivery subject and said that problem is not present. |

## G. Architecture integrity

No second conversation authority, manager runtime, simulation world, Ground Truth, Data Reality, management roadmap, Stage, Advisor, or Object authority was introduced.

The population consumes:

1. Ground Truth and the scenario library already certified for the four families.
2. Operator publication and, on INGESTION journeys, the existing CSV to RDI to Data Reality path.
3. RMS:4 manager knowledge. `groundTruthAccess` is false. Behavior selection throws if sealed Ground Truth or Observer knowledge is present.
4. CC:5 `executeNexoraConversationalExperience`.
5. The existing read-only journey observer.

`rmsManagerBehavior.ts` only chooses an utterance. It does not classify Nexora intent or write canonical state.

## H. Repair recommendation

No product FIX. NPA-T SIM-TEST:7-FIX1 is not opened.

The measured residue is the existing NPS subject-label debt. An observer follow-up could normalize `ProjectControl.csv` to `PROJECT_CONTROL` and could treat a sustained unnamed clarification, or `I don't see that Problem`, as a non-failure. That follow-up would correct measurement. It is not a Nexora repair, and it was not started here.

## I. Final statement

NPA-T SIM-TEST:7 — CERTIFIED.

Blocking product evidence: none. S0 is 0. Classified product S1 is 0. Classified product S2 is 0. Fourteen S3 rows remain the pre-existing NPS label debt and are recorded in `FINDINGS.md`.

## Gates

| Gate | Result |
| --- | --- |
| G1 Population | PASS. Ten profiles, one RMS manager path |
| G2 Isolation | PASS. Firewall closed on 90/90. Behavior module does not read Ground Truth |
| G3 Scenario coverage | PASS. Four RMS families |
| G4 Realistic behavior | PASS. 78 distinct utterances. Steps carry no scripted utterance |
| G5 Replay | PASS. 46/46 raw-S1 journeys byte-matched on `fnv1a32` |
| G6 Observer integrity | PASS. Read-only. False S1 labels classified |
| G7 Authority preservation | PASS. No duplicate runtime or store |
| G8 Findings classified | PASS. Every raw S1 and S3 row is classed in `FINDINGS.md` |
| G9 Baseline integrity | PASS. Certified profile utterances and the unseeded agenda path remain. No certified behavior reproduced as a failure |
| G10 Honest closure | PASS. No unresolved product S1 |

Focused tests this phase: `nexoraSimulationManagerPopulation.test.ts` 3/3, and the RMS:4 conversation checks that lock the unseeded manager (`What is happening?`, firewall closed). Level 4 was not run.
