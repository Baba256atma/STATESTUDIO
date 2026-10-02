# NPA-T SIM-TEST:10-R5

Certification-only recertification after COMMIT-LIVE:1, OUT-LIVE:1, OUT-EVAL-LIVE:1, OUT-BASE:1, RDI-DIR:1, and OUT-DIR:1-R2. Production changes during R5 = 0.

Historical SIM-TEST:10, SIM-TEST:10-R1–R4, and OUT-DIR:1 remain **NOT CERTIFIED** as historical evidence. They were not rewritten.

## A. Status

SIM-TEST:10-R5 = **NOT CERTIFIED**  
SIM-TEST:10 = **NOT CERTIFIED**

## B. Certification Mode

R5 remained **MEASUREMENT_ONLY**. No product behavior was added to make the population pass. No FIX phase started.

## C. Population

| Item | Count |
| --- | --- |
| Journeys | 33 (14 A–N core + variants + 5 SIM-TEST:5) |
| A–N families | 14 / 14 |
| RMS scenarios | manufacturing-capacity-pressure, project-delivery-pressure, logistics-delivery-pressure, service-capacity-pressure |
| Profiles | 12 (decision-oriented, investigative, skeptical, data-challenging, impatient, nonlinear, ambiguous, executive, structured, distracted, data-driven, standard) |
| Seeds | 11 / 29 / 47 |
| Manager / Nexora turns | 356 / 356 |
| Long sessions | 6 (journey `conversationLength=long`; additional long-turn SIM-TEST:5 included) |
| RMS events | 39 |
| Publications | 68 |
| Unpublished advances | 28 |
| Unpublished Outcome/Learning asks | 13 |
| Pre-publication Outcome asks | 13 |
| Post-publication Outcome asks | 50 |
| Learning asks | 11 |
| Reassessment asks | 5 |
| Loop-reentry attempts (Family L Options/Commit after Learning/Reassess) | 4 |
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
| Learning → Durable Learning | OBSERVED (end-of-journey CORE-OUT:2; not proven as Advisor-durable) |
| Learning → Reassessment | **FAIL** |
| Reassessment → Next Cycle | NOT EXERCISED (blocked by prior FAIL; Family L D2 is temporal only) |

## E. Multiplicity

| State | Distinct | Max coexisting |
| --- | --- | --- |
| Problems / Risks | 2 | 2 |
| Scenario sets | 4 | 4 |
| Decisions | 3 | 2 |
| Executions | 2 | 2 |
| Outcome observations | 50 | 2 captured max |
| Comparison-ready evaluations | 25 | — |
| Supported Learning records | 25 unique ids | 1 per Capacity evaluation |
| Active/relevant Learning in Advisor answers | 0 on J/K/L | — |
| Family L Decision cycles | 2 | 2 |

## F. Outcome evidence

| Measure | Count |
| --- | --- |
| Captured observations | 50 |
| Eligible as actual | 25 |
| CORE-OUT:1 evaluations | 40 |
| comparison-ready | 25 |
| comparison-incomplete | 0 |
| not-observed | 15 |
| too-early / other CORE-OUT statuses | 0 on inspected windows |
| met | 0 |
| not-met | 25 |
| partial/mixed | 0 |
| causation-established | 0 |
| causation-not-established | 40 (`establishesCausation=false`) |

Positive matching expectation vs observation: **none in this population** (coverage gap; not manufactured).

## G. Direction evidence

| Measure | Count |
| --- | --- |
| RDI increase (Capacity KPI) | 26 |
| RDI decrease | 0 |
| RDI stable | 0 |
| RDI null | 7 |
| CORE-OUT observedDirection increase | 25 |
| decrease | 0 |
| stable | 0 |
| null | 15 (Delivery not-observed) |
| Wrong projections / cross-subject / cross-KPI / cross-source | 0 observed |

R5 consumed certified `projectPublishedKpiObservedDirection`. The harness did not recompute direction.

## H. Family A full trace (turn 1)

Journey `sim-test-10-a_expected_positive` (DECISION_ORIENTED_MANAGER, seed 11, manufacturing).

| Boundary | Canonical identity |
| --- | --- |
| Problem / subject | Capacity (`obj-capacity` on observation/evaluation) |
| Scenario | `cc9:scenario:do-nothing:do-nothing:v1` (committed) / session also holds `cc9:scenario:intervention:obj-capacity:v1` |
| Decision D1 | `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` — No Action on Capacity |
| Execution E1 | `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` (in-progress) |
| Pre-action baseline | 90.909… at `2026-09-16T00:00:00.000Z` — obs `…PRODUCTION:0:import:kpi.production.capacity-utilization…` |
| Publication | tick-0 + tick-15 PRODUCTION import |
| Actual | 100 at `2026-10-01T00:00:00.000Z` — obs `…PRODUCTION:15:import:kpi.production.capacity-utilization…` |
| RDI observedDirection | `increase` (90.91 → 100); previous `csv:rms:…:PRODUCTION:0:…`; current `csv:rms:…:PRODUCTION:15:…` |
| CORE-OUT:1 | comparison-ready; result **not-met**; expectedDirection **maintain**; observedDirection **increase**; numericTarget **null**; `establishesCausation=false` |
| CORE-OUT:2 | outcome-learning **supported**, promotion-eligible; learningId `learn:nexora-mvp:obj-capacity:outcome-learning:case-specific:comparison-ready|not-met|…` |
| Reassessment | **not present** on Family A |
| Next cycle | **not present** on Family A |

Disagreement maintain vs increase was **not** normalized.

## I. CORE-OUT:1

Evaluations 40. Comparison-ready 25. Comparison-incomplete 0. Shape `baseline+actual+direction+observedDirection` = 25. Missing actual = 15 (Delivery). `incompatible-evidence-shape` = 0. Family A matches the certified OUT-DIR:1-R2 Capacity shape.

## J. CORE-OUT:2

Inspections with candidates: 25. promotionEligible: 25. creates/supported: 25. inconclusive: 0. not-promotion-eligible: 0. Delivery not-observed: candidate count 0 (correct refusal). CORE-OUT:2 applied existing `outcomeReady` → supported outcome-learning policy. This is **not** automatic Advisor Learning.

## K. Supported Learning

Exact supported count: **25** (one Capacity outcome-learning per comparison-ready inspection; 25 unique learning ids). Identities are subject `obj-capacity`, type `outcome-learning`, status `supported`.

## L. Learning provenance

Family A chain:

published KPI `kpi.production.capacity-utilization` tick-15  
→ capture observationId `obs:sim-test-2:…:PRODUCTION:15:…`  
→ CORE-OUT:1 evaluation (comparison-ready / not-met)  
→ CORE-OUT:2 `learn:nexora-mvp:obj-capacity:outcome-learning:…`

No free-floating Learning. Advisor language did not create these records.

## M. Learning durability

CORE-OUT:2 records exist at end-of-journey inspection. In-conversation Family L `What did we learn?` remained NPS `NONE` with `liveLearningAnswer=null` on J/K/L. Durability as **manager-visible Learning** after later turns is **not proven**. NPS `BOUNDED` on some J/K rows is NPS presentation, not CORE-OUT:2 consumption.

## N. Learning idempotence

Unique learning ids = inspections with Learning = 25. No duplicate CORE-OUT:2 records for the same evidence fingerprint inside a journey inspect. Repeated-ask duplicate creation was not the first FAIL.

## O. Reassessment

| Measure | Count |
| --- | --- |
| Reassessment asks | 5 |
| Journeys with supported Learning and later reassessment | 3 (J, K, L) |
| Learning actually consumed (CORE-OUT:2 in reassessment evidence) | **0** |
| Correct no-Learning cases | Delivery not-observed; pre-publication too-early |
| Family J | “Which item do you mean?” on all three reassessment turns (clarification) |
| Wrong-subject Learning use | 0 |

## P. Next cycle

Family L: Cycle 1 D1 No Action → E1 → Outcome/Learning inspect supported; reassessment; Options.; Go with A. → D2 Investigate Capacity. `learningLinkedReentry=false`. `canonicalLearningToDecisionLinkage=false`. Temporal sequence only. D2 is **not** proven Learning-informed.

| Measure | Count |
| --- | --- |
| Loop-reentry attempts | 4 |
| Learning-informed reentries | 0 |
| New Decisions after Learning/reassess (Family L) | 1 (D2) |
| New Executions for D2 | 0 |
| Canonical Learning linkage | 0 |
| Cross-thread linkage errors | 0 |

## Q. Family J

From turn 1: supported Capacity CORE-OUT:2 exists at inspect. Reassessment utterances still receive clarification (“Which item do you mean?”). Canonical subject on those turns is the Scenario id, not `obj-capacity`. Per mission 53 this remains a **legitimate clarification** under ambiguity, **not** a false fail of CORE-OUT:2. It also does **not** satisfy G22 (Learning-informed reassessment).

## R. Family L

D2 is another Decision after D1/E1/Outcome ask/Learning ask/reassessment. Sequence is temporal. No existing Learning-to-Decision linkage type was observed. Do not count sequence as linkage.

## S. Multi-thread isolation

Family H: Capacity D1→E1→O1→supported L1; Delivery D2→E2→not-observed / no Learning. Learning executionRefs stay on Capacity E1. Cross-thread Learning = 0. Delivery RDI null. Wrong Execution bindings = 0.

## T. Decision / Execution integrity

Product wrong Execution bindings = 0. FIX1 Go with B. Capacity do-nothing present; Start it. does not start Capacity Execution under Delivery. FIX2 stale Capacity Scenario under Delivery/Revenue = false.

Observer raw `JOURNEY/DECISION_IDENTITY_DRIFT` remains known debt (e.g. Family A ledger `subjectIds` include `obj-budget` while CORE-OUT binds `obj-capacity`). Not counted as Outcome/Learning product S1.

## U. Temporal integrity

Family E: pre-publication Outcome asks remain too-early / no established success; unpublished ticks 8 and 12 do not claim the new Outcome; later publication reports capacity-utilization 100 without treating Execution as Outcome success. Ground Truth leak rows = 0. Future-knowledge leaks = 0. Historical return (Family I) end-state still reflects published 100; Advisor historical freeze of an earlier KPI was not separately proven and is not the first FAIL.

## V. Ground Truth firewall

Leaks = 0.

## W. Causation

Unsupported causal claims in ASK_CAUSE rows = 0. All CORE-OUT `establishesCausation=false`. Execution completed ≠ Outcome succeeded. Observed increase ≠ causal claim.

## X. Manager profiles

Comparison-ready + supported Learning concentrated on manufacturing Capacity journeys (decision-oriented, investigative, skeptical, data-challenging, impatient, nonlinear, ambiguous, executive). Structured / distracted / data-driven / standard profiles in this mix often ran SIM-TEST:5 or non-manufacturing H variants with **no** Capacity comparison-ready (supported 0). No profile-specific product S1 on Learning identity.

## Y. Long sessions

Long H/I/M manufacturing journeys retained Capacity Learning identity at inspect. Project/logistics H variants had no Capacity actual. SIM-TEST:5 long sessions: no supported CORE-OUT:2. No material CORE-OUT subject swap Capacity→Delivery.

## Z. Raw findings

Raw S0/S1/S2/S3 = 0 / 141 / 0 / 1. Dominant Observer classes: DECISION_IDENTITY_DRIFT (67), OBSERVATION_GAP (25), PREMATURE_OUTCOME (16), DUPLICATE_DECISION (10), DUPLICATE_EXECUTION (9), WRONG_EXECUTION_REFERENT (9).

## AA. Product findings

| Class | Result |
| --- | --- |
| Product S1 | 0 |
| Product S2 | **Learning exists but is not consumed on later reassessment** (blocking for SIM-TEST:10) |
| Product S3 | NPS labels / Advisor phrasing / Observer expectation debt |
| Correct no-learning | Delivery not-observed (15 inspections) |
| Correct clarification | Family J “Which item do you mean?” |
| Correct uncertainty | Family E unpublished / too-early |
| Known debt | Advisor divergence; NPS non-writer; Observer identity-drift |

Unsupported Learning = 0. False causation = 0.

## AB. Known debt

Advisor/NPS/Observer/test debt remains independent except where G22 requires CORE-OUT:2 to participate in reassessment. NPS `writesOutcome=false`, `writesLearning=false`.

## AC. Deterministic replays

8 material journeys, mismatch = 0.

| Journey | Signature |
| --- | --- |
| e_delayed_outcome | fnv1a32:9fe2fc7d |
| h_multiple_outcome_chains | fnv1a32:370f8c3b |
| j_reassessment | fnv1a32:a4658e32 |
| l_loop_reentry | fnv1a32:f7b102e9 |
| a_expected_positive | fnv1a32:db148607 |
| g_competing_executions | fnv1a32:fca710db |
| f_external_confounder | fnv1a32:bdb530be |
| c_negative_tradeoff | fnv1a32:ed667a7b |

FIX1 replay matched (`fnv1a32:85ceb48b`).

## AD. Regression

SIM-TEST:10-R5 population: **1 pass / 0 fail** (measurement; parent not asserted CERTIFIED).

Focused seams: COMMIT-LIVE:1, OUT-LIVE:1, OUT-EVAL-LIVE:1, OUT-BASE:1, RDI-DIR:1, OUT-DIR:1, OUT-DIR:1-R2, CORE-OUT:1/1A/2, MVP-OUT:1 R1–R3, NPS:8 unit+runtime, ECA:11/12 outcome+learning, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1, Decision FIX15.

**545 pass / 0 fail.**

Not run: Level 4 / full repository; SIM-TEST:10-FIX1; OUT-DIR:2; RDI-DIR:2; OUT-LIVE:2; OUT-EVAL-LIVE:2; OUT-BASE:2.

## AE. Production integrity

Production changes **during R5** = **0**  
Digest before = after = `85d3263102b4eb017024ea65cb3b29e22147ce5087b5746d5bb3c90cb2539144` (12705 files).

Prior certified live repairs remain in the working tree; R5 did not mutate them.

## AF. Architecture integrity

New management / Outcome / Learning / Data Reality / direction / Decision / Execution / conversation / NMI store or authority = **0**. CORE-OUT:2 remains the Learning owner. CC/Advisor consume; they did not write Learning.

## AG. First divergent boundary

**Learning → Reassessment**

Supported Learning > 0. Learning-informed reassessment = 0.

Do not modify CORE-OUT:2 for this boundary. Comparison-ready and promotion policy succeeded.

## AH. Remaining capability gap

Existing owner: **CC / Advisor reassessment path** (consume CORE-OUT:2 / live learning answer as evidence). Secondary, not first: **no canonical Learning→Decision linkage** for Family L D2 (Reassessment → Next Cycle remains unproven).

Missing capability: a later reassessment that demonstrably includes supported CORE-OUT:2 in its evidence/context — without using temporal adjacency, Advisor tone, or NPS BOUNDED as substitutes.

## AI. Next action

Preserve R5 evidence. Do **not** start SIM-TEST:10-FIX1, OUT-DIR:2, RDI-DIR:2, OUT-LIVE:2, OUT-EVAL-LIVE:2, or OUT-BASE:2 automatically.

Smallest owner-specific next repair, if authorized later: conversation/CC reassessment consumption of existing CORE-OUT:2 — only after a focused reproduce of Family J/K/L from this artifact. Do not reopen RDI or CORE-OUT:1 comparison.

---

NPA-T SIM-TEST:10-R5 — NOT CERTIFIED  
NPA-T SIM-TEST:10 — NOT CERTIFIED
