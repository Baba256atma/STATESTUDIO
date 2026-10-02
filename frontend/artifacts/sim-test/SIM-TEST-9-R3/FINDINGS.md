# SIM-TEST:9-R3 findings (measurement only)

Evidence: `population-run.json`. No production repair. FIX3 was not started.

## FIX1 — holds

Population execution commands: 18 (17 deictic, 1 explicit). Clarifications: 14. Executions created on those commands: 3. Wrong cross-thread Execution: **0**.

Original blocker (Capacity Decision approved → Delivery Options → Delivery `Go with A.` → `Start it.`):

- signature `fnv1a32:f371b12f` matched on replay (historical repaired signature `fnv1a32:c5462932` is pre-FIX2; FIX2 now allows a Delivery Decision, so the conversation hash changed)
- Capacity Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` executions: **0**
- Delivery Decision executed: `execution-cc10:decision:cc9:scenario:intervention:obj-delivery:v1`
- That is FIX2-enabled Delivery execution, not a FIX1 regression

K T9 `Start it.` while Capacity was active and no unique Capacity-approved executable Decision: clarification, 0 executions.

## FIX2 — holds

Stale Capacity-under-Delivery/Revenue `Options.` detector rows: **0** (R2 had 8 across 6 journeys).

FIX2 family replays (matched):

| Journey | Signature |
| --- | --- |
| C_SCENARIO_SETS | `fnv1a32:25066a89` |
| D_MULTI_DECISION | `fnv1a32:af1a3e7d` |
| E_DECISION_EXECUTION_CONCURRENCY | `fnv1a32:2107609d` |
| F_MULTI_OUTCOME | `fnv1a32:befc163f` |
| J_ORDINAL_STRESS | `fnv1a32:2bddcdbd` |
| K_LONG_SESSION | `fnv1a32:7af2dd36` |

Family D Options. under Delivery selected `cc9:scenario:intervention:obj-delivery:v1` (Investigate Delivery). Revenue Options. selected `cc9:scenario:intervention:obj-revenue:v1`. Capacity intervention remained in the ledger with `sourceSubjectId=obj-capacity`.

## Multiplicity actually observed

Not fixture counts. Maxima are simultaneous ledger sizes on a single turn.

Family E (strongest chain evidence):

- Capacity → do-nothing Scenario → D1 `No Action on Capacity` → E1
- Delivery → Investigate Delivery → D2 → E2
- Both ledgers intact after `Back to Capacity.`

Family D: three Scenario sources (Capacity, Delivery, Revenue) coexist; two Approved Decisions coexist. Revenue `Go with B.` did **not** create a third Decision because do-nothing uses a singleton Scenario/Decision ID that retitles (`No Action on Revenue is already the current Approved decision`).

## B T5 — reproduced, explicit treatment

Utterance: `Go back to the first risk.`

- executive/conversation current subject (harness `canonicalSubjectId`): `obj-capacity`
- L1 / Stage / Advisor: `obj-risk`
- Response named Risk; no Decision or Execution write
- Replay: `fnv1a32:d1c01e59` matched

Classification: **product S2**, independent of FIX1/FIX2. NMI L1=ACTIVE, Stage, and Advisor agreed on Risk. Executive `currentSubject` lagged on Capacity. RMS presented a single Risk object (`Current Risks: Risk.`). Not Observer noise. Not a wrong management action.

This is remaining identity-presentation debt, treated explicitly. It is not used to hide Scenario/Decision/Execution failures (there were none of those as product S1/S2).

## Related-object (family G)

`What does that do to Delivery/Revenue?`: L1/Stage stayed Capacity; conversation/Advisor followed the named related Object. Observer WRONG_REFERENT / STAGE_DIVERGENCE. Product: related-object discussion, not thread collapse. No extra Decision/Execution.

## H T4 compound return

`Back to Capacity. What changed?`: L1/canonical stayed Delivery; Advisor named Capacity. Compound utterance; no write. Remaining return-path debt, not FIX1/FIX2.

## Observer vs product on multiplicity

Raw DUPLICATE_DECISION (4), DECISION_IDENTITY_DRIFT (11), DUPLICATE_EXECUTION (1), WRONG_EXECUTION_REFERENT (1) fire when a **second** legitimate Decision/Execution appears. Product: those writes are the required multi-thread evidence (D2/E2). Disposition: **Observer / test-expectation error**, not product duplicates.

## Do-nothing singleton

`cc9:scenario:do-nothing:do-nothing:v1` / `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` is one ID. Opening Delivery/Revenue Options. retitles that row. Intervention Scenarios have per-subject IDs. Remaining product limitation: Revenue does not get a distinct do-nothing Decision D3. Not silent replacement of D2.

## NCA ordinals

C T6–T7 after return to Capacity without re-presenting Capacity Options.: clarification (`Which option do you want to commit to?`), 0 Decision writes. Known NCA ordered-list debt. Not a wrong Scenario bind.

## Reassessment

Invented `Is This Still A` titles: **0**. Family N stayed on Capacity. SIM-TEST:8-FIX1 focused tests passed.

## Ground Truth

Unpublished asks: 26. Leak hits: **0**.

## Known debt (unrepaired)

- Advisor Delivery/Capacity: 12 known-pattern rows; 6 raw ADVISOR_DIVERGENCE on SIM-TEST:8 Recovery (same as R2)
- NPS SUBJECT_LOSS S3: 18
- NCA ordinal-without-presented-collection
- Outcome coverage: 0 observable Outcomes (NPS `TOO_EARLY` / `UNKNOWN`)
- B T5 executive/NMI lag
- Do-nothing singleton ID
- Named missing Problems (Schedule/Resources/Milestone) stay on last real Object
