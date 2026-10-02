# NPA-T SIM-TEST:9-R2 — Full Multi-Thread Population Recertification

Certification-only. Production behavior was not modified. FIX2 was not started.

Baselines preserved: SIM-TEST:6 / FIX18 / FINAL, SIM-TEST:7, SIM-TEST:8, SIM-TEST:8-FIX1, SIM-TEST:8-RECERT, SIM-TEST:9-FIX1 — CERTIFIED.

SIM-TEST:9 remains open.

## A. Status

**NOT CERTIFIED.**

This recertification does **not** certify SIM-TEST:9.

Product S1 = 0 (FIX1 holds; no Ground Truth leak; no wrong-thread Decision or Execution write).

Unresolved **product S2**: Scenario-set confusion reproduced 8 times across 6 A–N journeys. G3 (Scenario-Set Fidelity) fails. Observed simultaneous Scenario sets = 1, so independent multi-set management was not demonstrated. Multi-Decision coexistence (D2/D3) was not observed (`maxDecisions` = 1), which is a downstream effect of the same Scenario-session root.

## B. Population executed

| Measure | Count |
| --- | ---: |
| Journeys | 160 |
| Journey families (A–N unique) | 14 |
| RMS scenario families | 4 |
| Manager profiles | 10 |
| Behavior seeds | 11, 29, 47 |
| Manager turns | 1203 |
| Nexora turns | 1203 |
| Long sessions | 22 |
| Adaptive events (RMS traces) | 173 |
| Operator publications | 288 |
| Unpublished world advances | 15 |
| Unpublished asks checked | 26 |
| Harness failures | 0 |
| Material journey replays | 6 / 6 matched |
| Original FIX1 blocker replay | `fnv1a32:c5462932` matched |

Composition: 14 A–N + 90 SIM-TEST:7 + 56 SIM-TEST:8, all from turn 1.

## C. Management multiplicity (observed, not fixture capacity)

| Object | Observed maximum / count |
| --- | --- |
| Distinct canonical subjects over the run | 8 |
| Simultaneous Problems as active subjects | switching among Capacity, Delivery, Revenue, Inventory (not all L1 at once) |
| Risks | `obj-risk` exercised (family B) |
| Variables | shared Staffing/budget subjects appear as `obj-budget` on Capacity Decision; no separate Variable ledger count |
| Scenario sets in one ledger | **1** |
| Scenarios in one ledger | **2** |
| Decisions | **1** (`cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`) |
| Executions | **1** (same parent Decision) |
| Outcomes | **0** |

## D. FIX1 recertification

| Measure | Count |
| --- | ---: |
| Deictic execution commands | 17 |
| Explicit execution commands | 1 |
| Clarifications on those commands | 14 |
| Executions created on those commands | 3 |
| Wrong Decision bindings | 0 |
| Wrong Executions (cross-thread) | 0 |
| Original blocker | Delivery + `Start it.` → clarification, 0 executions |

Invariant preserved: globally Approved Capacity Decision is not contextually executable from Delivery.

## E. Scenario-set finding

- Occurrences: 8
- Profiles: Ambiguous, Decision-oriented, Distracted, Investigative, Data-challenging, Structured
- Families: C, D, E, F, J, K
- Replays: `6bd46ffc`, `16461920`, `913ef4a7`, `76087b1b`, `2bddcdbd`, `d2cbf608` — all matched
- Expected after Delivery/Revenue `Options.`: a Delivery/Revenue-scoped set
- Actual: `cc9:scenario:intervention:obj-capacity:v1` / Investigate Capacity
- Wrong Decision from that confusion: **0**
- Severity: **product S2** (does not escalate to S1 in this evidence)
- Root: stale/global Scenario session not scoped to current Problem (CC:9 session consumed at CC:5). Not FIX1.

## F. Referent / identity

| Check | Result |
| --- | --- |
| Wrong Problem binding (confident wrong Problem Decision) | 0 |
| Wrong Risk Decision | 0 |
| Scenario-set confusion | 8 (product S2) |
| Wrong ordinal commitment across threads | 0 writes of MAR-B / Delivery option onto Capacity |
| Wrong historical return (B T5 canonical lag) | 1 measured split |
| Invented reassessment titles | 0 |
| Cross-thread execution referent | 0 |
| SIM-TEST:8-FIX1 invented-name recurrence | 0 |

## G. Decision integrity

- Decisions created in A–N: 1 identity, no duplicates, no silent replacement, no historical mutation observed.
- Wrong Scenario→Decision association writes: 0.
- Ambiguous Delivery/Revenue commits: clarified, no write.
- D2/D3 never created — coverage gap caused by Scenario-set S2, not a duplicate-ID bug.

## H. Execution / Outcome integrity

- Executions created: 3 command-rows, one Execution ID, always parented to the Capacity Decision.
- Wrong Decision→Execution: 0
- Duplicate Execution: 0 (CC:11 refused a second start)
- Premature Execution from Delivery deictic: 0
- Outcomes observed: 0
- Wrong Execution→Outcome: not exercised

## I. Temporal / Ground Truth

| Check | Count |
| --- | ---: |
| Unpublished asks | 26 |
| Ground Truth leak hits | 0 |
| Background / adaptive events | 173 |
| Publications | 288 |
| STALE_EVIDENCE / CURRENT_STATE_IGNORED / TEMPORAL_CONFUSION product rows | 0 classified |

## J. NMI / Stage / Advisor

- Canonical vs L1 split: family B T5 (canonical Capacity, L1 Risk).
- Family G: L1/Stage stayed Capacity while Advisor discussed Delivery/Revenue (related-object). Raw STAGE_DIVERGENCE 1, WRONG_REFERENT 2.
- Known Advisor Delivery/Capacity: 6 Recovery rows (SIM-TEST:8), unchanged debt.
- New independent Advisor engine: none.

## K. Raw vs product findings

Raw Observer: S1 96, S2 0, S3 18.

| Raw class | Rows | Product disposition |
| --- | ---: | --- |
| REPEATED_CLARIFICATION | 45 | expected clarification |
| SUBJECT_LOSS | 25 | 18 NPS/named S3; 7 missing named Problems (Schedule/Resources/etc.) |
| MISSING_DECISION | 21 | expected clarification (wrong-thread options) |
| OBSERVATION_GAP | 9 | Observer / no-knowledge |
| ADVISOR_DIVERGENCE | 6 | known Delivery/Capacity debt |
| EVIDENCE_MISMATCH | 5 | data-challenging / expectation |
| WRONG_REFERENT | 2 | 1 G related-object; 1 SIM-TEST:7 Milestone miss |
| STAGE_DIVERGENCE | 1 | G related-object L1 lag |

Product: **S1 0**. **S2 1 root** (Scenario-set, 8 manifestations) plus B T5 canonical/L1 split. **S3** NPS/label and known Advisor debt. FIX1 regressions: 0.

## L. Regression actually run

- SIM-TEST:9-R2 isolated population test: PASS.
- SIM-TEST:7 and SIM-TEST:8 journey sets executed inside that test, not as separately named recert phases.
- Level 4 funnel: not run.
- FIX1 T1–T16 file: not re-run; original blocker replayed in R2.

Do not claim a full-repo Zero-Failure funnel.

## M. Production integrity

Production changes during R2: **0**.

## N. Architecture integrity

No second management model, Scenario authority, Decision authority, Execution authority, Outcome authority, context authority, referent engine, Data Reality, world, Operator, Manager runtime, Observer, NMI, Stage, Advisor, or Object authority was added. R2 only scheduled existing RMS/CC:5/CC:10/CC:11/NMI/Stage/Advisor paths and wrote artifacts.

## O. Next action

Do not seal SIM-TEST:9.

Do not implement a repair in this phase.

Smallest evidence-supported next phase:

**NPA-T SIM-TEST:9-FIX2 — Context-Scoped Scenario Set Resolution**

Scope: Scenario session / ordinal meaning must bind to the Problem/Risk context that established the set; insufficient context must clarify rather than reuse Capacity options under Delivery/Revenue. Do not reopen FIX1 Execution selection unless new evidence appears.

---

NPA-T SIM-TEST:9-R2 — NOT CERTIFIED

SIM-TEST:9 remains NOT CERTIFIED.
