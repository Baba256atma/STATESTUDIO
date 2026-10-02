# NPA-T SIM-TEST:10-R1 — Full Outcome & Management Learning Recertification

Certification-only. No production repair. SIM-TEST:10-FIX1 and OUT-LIVE:2 were not started.

Baseline: OUT-LIVE:1 CERTIFIED. Initial SIM-TEST:10 = NOT CERTIFIED (captures = 0).

## A. Status

**SIM-TEST:10-R1 = NOT CERTIFIED**

**SIM-TEST:10 = NOT CERTIFIED**

The population never establishes Decision or Execution on the RMS `Go with B.` / `Start it.` path (distinct Decisions = 0, Executions = 0). Therefore CORE-OUT observations, evaluation, Learning, and loop closure are **not exercised at population scale**, even though OUT-LIVE:1 still proves capture when Execution is established canonically.

First missing boundary: **Decision commitment → Execution start** on the SIM-TEST:10 manager utterance path. Owner: CC:5 / CC:10 (commitment / current-subject execution selection). Not CORE-OUT. Not NPS.

## B. Population

| Measure | Count |
| --- | ---: |
| Journeys | 33 |
| A–N families | 14 (all) |
| RMS scenarios | 4 |
| Profiles | 12 |
| Seeds | 11, 29, 47 |
| Manager / Nexora turns | 356 / 356 |
| Adaptive event traces | 39 |
| Operator publications | 68 |
| Unpublished world advances | 28 |
| Unpublished Outcome/Learning asks | 13 |
| Post-publication ASK_OUTCOME | 50 |
| Long sessions | 6 |
| Harness failures | 0 |

Exact source: `population-run.json`.

## C. End-to-End Architecture

Actual live chain:

CC:11 Execution → RMS world → Operator CSV → RDI:2 / CSV Data Reality → MVP-OUT:1 → CORE-OUT:1A → CORE-OUT:1 → CORE-OUT:2 → ECA:11/12 → NPS:8 → CC:5 → reassessment

| Boundary | R1 population | Notes |
| --- | --- | --- |
| Execution | **FAIL** | 0 Decisions, 0 Executions |
| Publication | PASS | 68 Operator publications |
| Data Reality | PASS | CSV Gate commits |
| Observation | **NOT EXERCISED** at scale | 0 captures; OUT-LIVE:1 focused still PASS |
| Evaluation | **NOT EXERCISED** | no observations to consume |
| Learning | **NOT EXERCISED** | durable = 0; NPS NONE |
| Conversation | PASS (uncertainty) | TOO_EARLY / insufficient evidence |
| Reassessment | **NOT EXERCISED** as Outcome-informed | “Is this still a problem?” without chain |

## D. Multiplicity

| Object | Distinct | Max coexisting |
| --- | ---: | ---: |
| Problems | switching labels | switching |
| Scenario sets | Options. presented | ≥1 presented; FIX2 names often empty |
| Decisions | **0** | **0** |
| Executions | **0** | **0** |
| Observations | **0** | **0** |
| Outcomes / evaluations | **0** | **0** |
| Durable Learning | **0** | **0** |

Initial SIM-TEST:10 had Decisions = 3, Executions = 2, captures = 0. R1 has **lost Decision/Execution** on the same utterances.

## E. Observation Capture

Population: eligible publications after Execution = 0 (no Execution). Captures = 0. Missed post-Execution captures at scale = N/A (no E). Wrong bindings = 0. Cross-bindings = 0.

OUT-LIVE:1 focused suite: 17/17, captures > 0 when Execution is explicit.

## F. Outcome Evaluation

CORE-OUT:1 owner tests pass in isolation. Population: observations evaluated = 0. NPS established (PARTIAL/MEETS/MIXED/…) = 0. Expected = null, Observed = null throughout Family E.

**CAPABILITY GAP / blocked upstream:** evaluation cannot run without Execution→observation on this path.

## G. Temporal Integrity

| Check | Result |
| --- | --- |
| Unpublished asks | 13 |
| Premature Outcome success (product) | 0 |
| Hidden-state capture | 0 |
| Ground Truth leak hits | **0** |
| Family E after tick-15 publication | still TOO_EARLY, captured = 0 (no E) |

## H. Trade-Offs

Not exercised (no Execution/observation). Family C ran as conversation only.

## I. Attribution / Causation

Product unsupported causal certainty driving action: **0**.

One detector hit on Family F (“Did the Capacity decision cause…”) whose reply **denies** proof of causation. **Test-expectation / Observer false positive.**

## J. Learning

Attempts: ASK_LEARNING present. Established: 0. Durable: 0. Classified: **expected no-knowledge** because no Outcome evaluation, plus **upstream gap** (no Execution).

CORE-OUT:2 / ECA:12 unit suites still pass.

## K. Reassessment / Loop Closure

Family J: invented title = false. Canonical subject often null. No Outcome-informed reassessment.

Family L: Options. / Go with A. after empty chain; no second-cycle Decision identity. Loop re-entry **not demonstrated**.

## L. Multi-Thread Integrity

H/G families: 0 Executions. Isolation of O1/O2 **not exercised**. OUT-LIVE multi-execution unit tests still pass.

## M. FIX1 / FIX2 Baseline Classification

| Evidence | Classification |
| --- | --- |
| `nexoraSimulationMultiThreadFix1.test.ts` (Start it. / Go with B. failures) | **current product regression** vs SIM-TEST:9-FIX1 / initial SIM-TEST:10 (those runs had Executions). Same-root with R1 missing Decision. |
| `nexoraSimulationMultiThreadFix2.test.ts` (some Options. / Scenario-set tests) | **same-root** current-subject / Scenario session presentation; not a second Outcome engine. |
| R1 FIX1 blocker replay `fnv1a32:1c7c7144` | Capacity Decision **not present**; wrong-thread Capacity Execution = **0**; reply “Which approved Decision do you want to start?” |
| R1 FIX2 replay | stale Capacity-under-Delivery/Revenue = **false**; candidate names empty (weak presentation, not stale reuse) |

Runtime invariants: **wrong-thread Execution = 0**. **Stale cross-context Scenario reuse = 0** on the replayed Options. path (vacuous where no set is shown).

## N. Known Debt

- B T5 canonical/L1: preserve independently
- Advisor Delivery/Capacity
- NPS SUBJECT_LOSS S3 (raw 1)
- NCA ordinal debt
- SIM-TEST:8-FIX1 file: 3 pass / 9 fail (T10 harness recovery PASS; T1 direct CC:5 subject null — same-root current subject)

## O. Raw vs Product Findings

Raw Observer: S0=0, S1=73, S2=5, S3=1. Dominant: MISSING_DECISION (33), OPERATOR_ERROR/OBSERVATION_GAP (25).

Product: S1 (GT leak / wrong Execution / false Outcome action) = **0**. Product S2: Decision/Execution never committed on population utterances — **blocks** the Outcome/Learning claim. Capability gap: population never reaches Observation→Evaluation. Detector causal overreach = **test expectation error**. Expected uncertainty on unpublished asks = **acceptable**.

## P. Replays

6 material journeys replayed. Matches: **6/6**. Signatures in `population-run.json` (`e`, `h`, `j`, `l`, `a`, `g`).

FIX1 blocker replay matched.

## Q. Regression

| Suite | Result |
| --- | --- |
| SIM-TEST:10-R1 population test | 1/1 pass (measurement) |
| OUT-LIVE:1 | 17/17 |
| CORE-OUT:1A | pass |
| CORE-OUT:1 identity/consume-1A | pass |
| CORE-OUT:2 identity | pass |
| MVP-OUT:1-R2 | pass |
| NPS:8 | pass (included in 295) |
| ECA:11 / ECA:12 | pass |
| Combined focused (OUT-LIVE+CORE-OUT+ECA+…) | **295/295** |
| SIM-TEST:8-FIX1 file | 3/12 |
| Full FIX1/FIX2 files | not re-certified; classified in M |
| Level 4 / full repository | **not run** |

## R. Production Integrity

**Production changes during R1 = 0**

Digest before/after: `fcda5e4221ec33b047359d0e2167385fd64c7fc7eb5b69cd50273ef687a1d7a9` (12704 files). See SOURCE-INTEGRITY-BEFORE.md / AFTER.md.

Allowed: R1 test + artifacts only.

## S. Architecture Integrity

New authority = none. New store = none. New Outcome engine = none. New Learning engine = none. NPS writesOutcome = false.

## T. Capability Gaps

**First missing population boundary:** CC:10/CC:5 **Decision commitment and Execution start** for `Go with B.` / deictic `Start it.` when current executive subject is unset / ambiguous (`Capacity Gap` vs `Capacity`).

Upstream: Options. are spoken. Downstream: no Execution → OUT-LIVE capture never fires at scale → CORE-OUT:1 never evaluates → CORE-OUT:2 never learns.

OUT-LIVE:1 remains valid for the capture seam **after** a canonical Execution exists.

Do not treat this as an Outcome-store gap. Do not start OUT-LIVE:2. Do not start SIM-TEST:10-FIX1 as an Outcome engine.

Smallest next **product** phase: restore context-safe Decision commitment / Execution start on the RMS conversation path (existing CC:10/CC:5 owner). Not implemented in R1.

## U. Certification Decision

Measured evidence does **not** prove that Nexora can observe, evaluate, learn, reassess, and re-enter a management cycle on the SIM-TEST:10 population. The chain stops before Execution. Capture, evaluation, and Learning owners still pass their focused suites when given canonical inputs.

## V. Next Action

Recommend the smallest owner-specific **product** phase at **CC:5 / CC:10 Decision commitment and current-context Execution start**. Do not implement it here. Do not disguise it as a simulation Outcome repair. Do not start OUT-LIVE:2.

NPA-T SIM-TEST:10-R1 — NOT CERTIFIED

NPA-T SIM-TEST:10 — NOT CERTIFIED
