# NPA-T SIM-TEST:10-R6

Full Outcome, Learning, and next-cycle recertification from turn 1 after LEARN-REASSESS:1 = CERTIFIED.

Historical SIM-TEST:10 and SIM-TEST:10-R1–R5 remain **NOT CERTIFIED** as historical evidence. They were not rewritten.

COMMIT-LIVE:1, OUT-LIVE:1, OUT-EVAL-LIVE:1, OUT-BASE:1, RDI-DIR:1, OUT-DIR:1-R2, LEARN-REASSESS:1 remain **CERTIFIED**.

## A. Status

SIM-TEST:10-R6 = **NOT CERTIFIED**  
SIM-TEST:10 = **NOT CERTIFIED**

## B. Certification Mode

Initial R6 production changes = **0**. The run remained **MEASUREMENT_ONLY**. No product repair was applied inside R6. Harness/contract only recorded existing ECA:12 fields (`consumedSupportedLearning`, `coreOut2LearningIds`). Continuity scoring was tightened after a false-pass from repeated reassessment consumption (Family J) so that next-cycle proof requires subsequent Scenario/Decision work that actually carries Learning identity.

## C. Population

| Item | Count |
| --- | --- |
| Journeys | 33 (14 A–N families + variants + 5 SIM-TEST:5) |
| A–N families | 14 / 14 |
| RMS scenarios | 4 (manufacturing-capacity-pressure, project-delivery-pressure, logistics-delivery-pressure, service-capacity-pressure) |
| Manager profiles | 12 |
| Seeds | 11 / 29 / 47 |
| Manager / Nexora turns | 356 / 356 |
| Long sessions | 6 |
| RMS events | 39 |
| Publications | 68 |
| Unpublished advances | 28 |
| Pre-publication Outcome asks | 13 |
| Post-publication Outcome asks | 50 |
| Learning asks | 11 |
| Reassessments | 5 |
| Loop-reentry attempts (Family L Options/Commit) | 4 |
| Harness failures | 0 |

## D. Boundary ledger

| Boundary | Result |
| --- | --- |
| Scenario → Decision | PASS |
| Decision → Execution | PASS |
| Execution → Publication | PASS |
| Publication → Data Reality | PASS |
| Pre-action Data → Baseline | PASS |
| Data Reality → Observation | PASS |
| Observation → Evaluation | PASS |
| RDI History → Observed Direction | PASS |
| Observed Direction → CORE-OUT | PASS |
| Evaluation → Comparison-ready | PASS |
| Comparison-ready → Supported Learning | PASS |
| Learning → Durable Learning | OBSERVED |
| Learning → Reassessment | **PASS** |
| Reassessment → Next Management Cycle | **FAIL** |

Earliest material FAIL: **Reassessment → Next Management Cycle**.

## E. Multiplicity

| State | Distinct / max |
| --- | --- |
| Problems / Risks | 2 / 2 |
| Scenario sets | 4 |
| Decisions | 3 distinct / max 2 |
| Executions | 2 distinct / max 2 |
| Outcome observations | 50 / captured max 2 |
| Comparison-ready evaluations | 25 |
| Supported Learning | 25 unique ids |
| Learning-aware reassessments | 5 consumed turns |
| Canonical next management cycles | **0** |

## F. Family A (upstream control)

Journey `sim-test-10-a_expected_positive`.

- D1 / E1 present.
- Baseline ≈ 90.909, actual 100.
- RDI `observedDirection=increase`.
- `expectedDirection=maintain`.
- CORE-OUT:1 `comparison-ready`, result `not-met`, `establishesCausation=false`.
- CORE-OUT:2 supported Learning (promotion-eligible).
- No reassessment in this journey (not modified to force one).

## G. Family J

Three reassessment utterances. Response still begins **“Which item do you mean?”** Focus on these turns is scenario id `cc9:scenario:intervention:obj-capacity:v1`. CC still maps to Capacity Learning (`consumedSupportedLearning=true`, same CORE-OUT:2 id on each turn). Ambiguity is not replaced by a guessed named subject. No subsequent Scenario/Decision after clarification. Replay `fnv1a32:a4658e32`.

## H. Family K

Supported Learning available. Reassessment `What should we reconsider?` with `focusedSubjectId=obj-capacity`, `consumedSupportedLearning=true`, `coreOut2LearningIds` present, ECA statement cites not-met without causation. `laterIntents=[]` — no next-cycle Scenario/Decision. Correct incomplete loop. Replay `fnv1a32:60c24149`.

## I. Family L

- Cycle 1: Options → Go with B → Start it → Outcome → Learning.
- Reassessment `Is this still a problem?` consumes CORE-OUT:2 (`reassessFocused=obj-capacity`).
- Subsequent Options → Go with A. creates D2 Investigate Capacity (`maxDecisions=2`).
- `learningLinkedReentry=false`.
- `canonicalLearningToDecisionLinkage=false`.
- `sessionNoteSurvives=true` (ECA lastLearningNote still present on later turns).
- D2 = **temporal-only**, not Learning-informed.
- Replay `fnv1a32:f7b102e9`.

## J. Outcome evidence

| Measure | Count |
| --- | --- |
| Captured observations | 50 |
| Eligible as actual | 25 |
| CORE-OUT:1 evaluations | 40 |
| comparison-ready | 25 |
| comparison-incomplete | 0 |
| not-observed | 15 |
| met | 0 |
| not-met | 25 |
| partial/mixed | 0 |
| establishesCausation=true | 0 |
| establishesCausation=false | 40 |

## K. Direction evidence

| Measure | Count |
| --- | --- |
| RDI increase / decrease / stable / null | 26 / 0 / 0 / 7 |
| CORE-OUT increase / decrease / stable / null | 25 / 0 / 0 / 15 |
| Wrong projections / cross-subject / cross-KPI / cross-source | 0 / 0 / 0 / 0 |

RDI remains the only observed-direction owner. CORE-OUT projects RDI; it does not recompute direction.

## L. Learning evidence

| Measure | Count |
| --- | --- |
| CORE-OUT:2 inspections (candidate) | 25 |
| promotionEligible | 25 |
| supported Learning (unique ids) | 25 |
| inconclusive | 0 |
| not-promotion-eligible | 0 |
| unsupported Learning | 0 |
| duplicates prevented | 0 extra ids |
| wrong-thread Learning | 0 |

## M. Learning durability

Supported Learning identities persist through later Outcome/Learning asks, Family J/K/L reassessment, and Family L Options/D2. Canonical Learning ids are not mutated. `liveLearningAnswer` on J/L end-state remains null (Advisor answer surface ≠ CORE-OUT:2 store).

## N. Learning → Reassessment

| Measure | Count |
| --- | --- |
| Reassessment asks | 5 |
| Supported Learning available (J/K/L) | 3 journeys |
| Successful relevant retrievals | 5 |
| consumedSupportedLearning=true | 5 |
| coreOut2LearningIds present | 5 |
| Clarifications | 4 |
| Wrong-subject Learning use | 0 |
| Unsupported Learning use | 0 |

## O. Reassessment → Next Cycle

| Measure | Count |
| --- | --- |
| Loop-reentry attempts | 4 (Family L Options/Commit including cycle 1) |
| Learning-informed reentries | **0** |
| Scenario work after Learning-informed reassessment | 1 (Family L Options) |
| Decisions after Learning-informed reassessment | 1 (Family L Go with A / D2) |
| Executions after Learning-informed reassessment | 0 |
| Canonical continuity proven | **0** |
| Temporal-only later actions | 1 (Family L D2) |
| Wrong-thread continuity | 0 |
| Unsupported continuity claims | 0 |

First missing seam: **ECA:12 Learning-aware reassessment / CC session residue → Scenario session / Decision commitment**. Existing Decision/Scenario records do not carry CORE-OUT:2 ids. Session `lastLearningNote` surviving later turns is not Decision linkage.

## P. Full positive loop

**None.** No journey proved P1→S1→D1→E1→O1→EV1→L1→R1(consumes L1)→M2 with continuity stronger than temporal order.

## Q. Correct incomplete loop

- Family A: full upstream Outcome/Learning, no reassessment (control).
- Family K: Learning-aware reassessment, no subsequent management action.
- Family N / not-observed Delivery paths: no false Learning-informed cycle.

## R. Multi-thread isolation

Cross-thread Learning = 0. Family H Delivery RDI null. Wrong-subject consumption = 0. FIX1 wrong-thread Capacity execution = 0. FIX2 stale Capacity under Delivery/Revenue = false.

## S. Scenario integrity

No stale Capacity Scenario reuse under Delivery/Revenue in the FIX2 blocker replay. Family L D2 uses `cc9:scenario:intervention:obj-capacity:v1` (Capacity scenario), not a foreign-thread set.

## T. Decision integrity

Wrong Decision bindings (product) = 0. Family L D2 is a second Approved Decision on Capacity scenario; it is not classified Learning-informed. Observer DECISION_IDENTITY_DRIFT remains known harness debt.

## U. Execution integrity

Wrong Execution bindings = 0. Family L cycle 2 does not execute. FIX1: Go with B still binds the correct Decision; Delivery Start it. does not execute Capacity.

## V. Temporal integrity

Pre-publication asks 13; unpublished advances 28; delayed Family E remains too-early until later publication. Historical return journeys present. Future-knowledge leaks = 0.

## W. Ground Truth firewall

GT leaks = 0.

## X. Causation

Unsupported causal claims = 0. `establishesCausation=true` = 0.

## Y. Manager profiles

12 profiles exercised, including Structured, Impatient, Ambiguous, Distracted, Investigative, Decision-oriented, Skeptical, Nonlinear, Executive, Data-challenging. Material next-cycle gap is architectural (Family L), not a single-profile wording loss. Nonlinear/distracted switching did not inject Capacity Learning into Delivery.

## Z. Long sessions

6 long sessions. Subject/Decision/Execution/Outcome identities remained stable enough for upstream PASS boundaries. No material long-session drift beyond known Observer labels.

## AA. Raw findings

S0 0 / S1 141 / S2 0 / S3 1 (harness Observer taxonomy). Classes: OPERATOR_ERROR/OBSERVATION_GAP 25, JOURNEY/PREMATURE_OUTCOME 16, STAGE_DIVERGENCE 1, STALE_REFERENT 2, DUPLICATE_DECISION 10, DECISION_IDENTITY_DRIFT 67, DUPLICATE_EXECUTION 9, WRONG_EXECUTION_REFERENT 9, SUBJECT_LOSS 1, REPEATED_CLARIFICATION 2.

## AB. Product findings

- Product S1 = **0**.
- Product S2 = **1 blocking**: Reassessment → Next Management Cycle (Family L temporal-only D2; no canonical continuity).
- Product S3 = Family J Learning overlay on clarification; NPS/Advisor phrasing debt.

## AC. Known debt

Advisor/NPS Outcome phrasing; Observer Decision/Execution identity labels; NPS is not a Learning writer.

## AD. Deterministic replays

Material replay mismatches = **0**.

| Journey | Signature |
| --- | --- |
| e_delayed_outcome | fnv1a32:9fe2fc7d |
| h_multiple_outcome_chains | fnv1a32:370f8c3b |
| j_reassessment | fnv1a32:a4658e32 |
| k_learning_assumption | fnv1a32:60c24149 |
| l_loop_reentry | fnv1a32:f7b102e9 |
| a_expected_positive | fnv1a32:db148607 |
| g_competing_executions | fnv1a32:fca710db |
| f_external_confounder | fnv1a32:bdb530be |
| c_negative_tradeoff | fnv1a32:ed667a7b |

FIX1 blocker replay matched.

## AE. Regression

SIM-TEST:10-R6 population: **1 pass / 0 fail** (measurement; parent not asserted CERTIFIED).

Focused seams (599 pass / 0 fail): LEARN-REASSESS:1, OUT-DIR:1, OUT-DIR:1-R2, RDI-DIR:1 (`publishedKpiObservedDirection`), CSV durability + vertical slice, OUT-BASE:1, OUT-LIVE:1, OUT-EVAL-LIVE:1, COMMIT-LIVE:1, CORE-OUT:1/1A/2 (live intelligence + grounded Learning + MVP-OUT R1–R3 + outcome runtime integration), NPS:8 unit+runtime, ECA:11/12 unit+runtime, NMI live + relationship, CC:9/10 Scenario/Decision, SIM-TEST:9-FIX1, SIM-TEST:9-FIX2, SIM-TEST:8-FIX1, Decision FIX15.

Not run: Level 4 / full repository; SIM-TEST:10-R7; SIM-TEST:10-FIX1; LEARN-REASSESS:2; OUT-DIR:2; RDI-DIR:2; OUT-LIVE:2; OUT-EVAL-LIVE:2; OUT-BASE:2.

## AF. Production integrity

Production changes **during R6** = **0**.  
Digest before = after = `307c5a16d8c9083ff81be9e338144df338cd98c92e9142d1811374579a16a987` (12705 files).

LEARN-REASSESS:1 production remains in the working tree from the prior certified phase. R6 did not mutate it.

## AG. Architecture integrity

New management store = 0  
New Data Reality authority = 0  
New direction authority = 0  
New Outcome authority = 0  
New Learning authority = 0  
New reassessment authority = 0  
New next-cycle / management-cycle authority = 0  
New Decision authority = 0  
New Execution authority = 0  
New conversation authority = 0  

## AH. First divergent boundary

**Reassessment → Next Management Cycle**

Learning → Reassessment = PASS. Do not reopen CORE-OUT:2 or LEARN-REASSESS:1.

Exact missing continuity seam: after ECA:12 consumes CORE-OUT:2, subsequent CC:9 Scenario work and CC:10 Decision commitment do not preserve/consume that Learning identity. Same subject + later D2 is insufficient.

## AI. Classification

**EXISTING-SEAM INTEGRATION GAP**

(Not INSUFFICIENT EXERCISED EVIDENCE: Family L does attempt next-cycle Scenario/Decision after Learning-aware reassessment.)

## AJ. Next action

Preserve R6 evidence. Do **not** start SIM-TEST:10-R7, SIM-TEST:10-FIX1, LEARN-REASSESS:2, OUT-DIR:2, RDI-DIR:2, OUT-LIVE:2, OUT-EVAL-LIVE:2, or OUT-BASE:2 automatically.

If a later authorized repair is chosen: inspect existing CC Scenario session / Decision commitment / NMI context for a slot that can **read** the already-attached ECA:12 Learning projection. Do not create a new Learning→Decision relationship type, cycle store, or second reassessment path.

---

NPA-T SIM-TEST:10-R6 — NOT CERTIFIED  
NPA-T SIM-TEST:10 — NOT CERTIFIED
