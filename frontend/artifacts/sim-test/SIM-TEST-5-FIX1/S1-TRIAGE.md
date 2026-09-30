# SIM-TEST:5-FIX1 — 15-finding triage ledger

Original SIM-TEST:5: S0=0, S1=15, harness=0. Primary manufacturing signature `fnv1a32:b92137ed`. Primary project `fnv1a32:d958dc7f`.

Triage before repair used original evidence in `frontend/artifacts/sim-test/SIM-TEST-5/`. Post-FIX1 dispositions use reruns `fnv1a32:418b0673` (manufacturing) and `fnv1a32:28ecdf3f` (project).

| ID | Scenario | Turn | Tick | Manager utterance | Actual (original) | Expected legitimate | Decision existed? | Earliest divergence | Suspected owner | Depends on missing Decision? | Triage class | Post-FIX1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ST5-S1-01 | manufacturing | 13 | 7 | Let's go with option B. | Which option…; listDecisions=[] | Resolve B in active collection; CC:10 | no | CC:5 dropped `candidateScenarioIds` after T12 discussion; CC:10 then clarified | CC5_CONVERSATION (+ CC:10 ordinal hint) | n/a (root) | PRIMARY_COMMITMENT_FAILURE | REPAIRED_AND_PASS (`applied`, Decision id `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` = visible option B / No Action on Capacity) |
| ST5-S1-02 | manufacturing | 14 | 7 | Yes, make that the decision. | Capacity Gap vs Capacity | Preserve pending/option identity | no | Same empty collection; confirm became object clarification | CC5_CONVERSATION | yes (no pending candidate) | DOWNSTREAM_OF_MISSING_DECISION | DOWNSTREAM_RESOLVED (already-committed; same Decision id). New independent Advisor causal-claim S1 at T15 recorded separately. |
| ST5-S1-03 | manufacturing | 28 | 21 | which issue (unresolved) | repeated clarification | named investigation target | n/a after FIX1 | later navigation | CC5_CONVERSATION | no | INDEPENDENT_CONVERSATION_FAILURE | STILL_REPRODUCIBLE |
| ST5-S1-04 | manufacturing | 31 | 21 | Start the supplier recovery plan. | unresolved supplier / which issue | follow existing unknown-target or Execution reuse semantics | yes after FIX1 | later navigation / active Execution | CC5_CONVERSATION | no (now fires with Decision present) | INDEPENDENT_CONVERSATION_FAILURE | STILL_REPRODUCIBLE (wording now: already-active Execution) |
| ST5-S1-05 | manufacturing | 38 | 21 | Teleport… | Advisor referent Inventory vs conversation Capacity | Advisor follow conversation subject | yes after FIX1 | Advisor referent | ADVISOR | no | INDEPENDENT_ADVISOR_FAILURE | STILL_REPRODUCIBLE |
| ST5-S1-06 | project | 9 | — | Approve the delivery recovery plan. | commitment did not reach CC:10 | unique intervention in active collection → CC:10 | no | same empty-collection / named-plan seam | CC5_CONVERSATION | n/a (root, shared) | PRIMARY_COMMITMENT_FAILURE | REPAIRED_AND_PASS (`Investigate Delivery`) |
| ST5-S1-07 | project | 11 | — | Put the decision into action. / later returns | clarification after miss | Execution against Decision or legitimate named clarify | originally no | originally downstream; post-FIX1 T11 “Do you mean Delivery?” then T13/T16 repeated clarify | CC5_CONVERSATION | original yes; remaining findings no | mixed | Original missing-Decision dependency DOWNSTREAM_RESOLVED. Remaining T13/T16 REPEATED_CLARIFICATION STILL_REPRODUCIBLE (independent conversation after Decision exists). |
| ST5-S1-08 | logistics | 7 | — | Let's go with option B. | MISSING_DECISION | same commitment path | no | shared root | CC5_CONVERSATION | n/a | PRIMARY_COMMITMENT_FAILURE | DOWNSTREAM_RESOLVED / REPAIRED_AND_PASS (parity rerun S1 no longer MISSING_DECISION) |
| ST5-S1-09 | logistics | 9 | — | confirmation / clarification | repeated clarification | follow commitment | no | downstream | CC5_CONVERSATION | yes | DOWNSTREAM_OF_MISSING_DECISION | DOWNSTREAM_RESOLVED |
| ST5-S1-10 | logistics | 4 | — | evidence turn | Production.csv cited outside ingested files | cite ingested sources only | n/a | Advisor/evidence | ADVISOR | no | INDEPENDENT_EVIDENCE_OR_DATA_FAILURE | STILL_REPRODUCIBLE |
| ST5-S1-11 | service | 7 | — | Let's go with option B. | MISSING_DECISION | same commitment path | no | shared root | CC5_CONVERSATION | n/a | PRIMARY_COMMITMENT_FAILURE | DOWNSTREAM_RESOLVED / REPAIRED_AND_PASS |
| ST5-S1-12 | service | 9 | — | confirmation | repeated clarification | follow commitment | no | downstream | CC5_CONVERSATION | yes | DOWNSTREAM_OF_MISSING_DECISION | DOWNSTREAM_RESOLVED |
| ST5-S1-13 | service | 4 | — | evidence turn | Production.csv cited outside ingested files | cite ingested sources only | n/a | Advisor/evidence | ADVISOR | no | INDEPENDENT_EVIDENCE_OR_DATA_FAILURE | STILL_REPRODUCIBLE |
| ST5-S1-14 | FAST | 7 | — | Let's go with option B. | MISSING_DECISION | same path | no | shared root | CC5_CONVERSATION | n/a | PRIMARY_COMMITMENT_FAILURE | REPAIRED_AND_PASS (FAST rerun S1=0) |
| ST5-S1-15 | FAST | 9 | — | confirmation | repeated clarification | follow commitment | no | downstream | CC5_CONVERSATION | yes | DOWNSTREAM_OF_MISSING_DECISION | DOWNSTREAM_RESOLVED |

## Counts

- PRIMARY_COMMITMENT_FAILURE: 01, 06, 08, 11, 14
- DOWNSTREAM_OF_MISSING_DECISION (original): 02, 07 (partial), 09, 12, 15
- INDEPENDENT_CONVERSATION_FAILURE: 03, 04, remaining project T13/T16
- INDEPENDENT_ADVISOR_FAILURE: 05
- INDEPENDENT_EVIDENCE_OR_DATA_FAILURE: 10, 13
- OBSERVER_OR_EXPECTATION_ERROR: none proven

## Newly exposed after commitment repair

- Manufacturing T15 `JOURNEY/UNSUPPORTED_CAUSAL_CLAIM` on already-committed follow-up (Advisor). `NEWLY_EXPOSED_AFTER_COMMITMENT_REPAIR`.
- Project T11 Execution request clarified “Do you mean Delivery?” while Decision exists. Recorded; not repaired in FIX1.
