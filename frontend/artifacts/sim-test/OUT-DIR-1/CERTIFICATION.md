# NPA-T OUT-DIR:1 — Live Observed Direction Evidence Projection

## A. Status

**OUT-DIR:1 = NOT CERTIFIED**

Discovery Outcome B. No production repair. Canonical observed direction does not exist on the live CC:5 / RMS Data Reality path, so CORE-OUT:1A has nothing legitimate to project into `observedDirection`.

## B. R4 Gap

SIM-TEST:10-R4 had:

- Decisions = 3, Executions = 2, Observations = 50, Baselines = 25
- CORE-OUT:1 evaluations = 40
- comparison-ready = 0
- supported Learning = 0

Representative shape:

| Field | Value |
| --- | --- |
| baseline | ≈ 90.91 |
| expectedDirection | maintain |
| numericTarget | null |
| actual | 100 |
| observedDirection | null |
| status | comparison-incomplete |
| reason | incompatible-evidence-shape |

CORE-OUT:1 correctly refused to assign management meaning from two numbers plus a Scenario expectation.

## C. Architecture Discovery

Candidates inspected:

| Candidate | Owner | Producer | Meaning | Live RMS/CC:5 | Verdict |
| --- | --- | --- | --- | --- | --- |
| `NexoraKPIResult` | P0:1 Data Reality | KPI calculation / CSV import | numeric value, unit, identity, timestamp | present | **reject** — no direction field |
| Operator CSV / RDI import records | RDI:2 / CSV store | Operator publication | numeric observable cells | present | **reject** — no qualitative direction |
| Capture `qualitativeState` | CORE-OUT:1A input | MVP-OUT live capture | optional qualitative; live sets `null` | present as null | **reject** — not evidence, empty slot |
| `toEvaluatorObservation.observedDirection` | CORE-OUT:1A adapter | hardcoded `null` | CORE-OUT actual direction | always null | consumer; not a source |
| `NexoraExecutiveState` (`normal`/`attention`/`critical`) | Data Reality executive condition | executive state rules | object management condition | present for objects | **reject** — not KPI observed direction |
| RDI:3 `metricDirection` / `changeDirection` (`improved`/`deteriorated`/`unchanged`) | RDI:3 executive source intelligence | numeric delta + severity delta between source snapshots | advisor source comparison, not Outcome actual | not on CORE-OUT path | **reject** — delta inference + different meaning |
| PM:1 proactive monitoring | PM:1 | wraps RDI:3 | attention / watch | not CORE-OUT | **reject** |
| NEX-ENT `observation.state` (`improved`/`worsened`/`corrected`/`reported`) | NEX-EXP:9 | `parseManagerObservation` | manager utterance / gap-vs-number | **not** RMS publication | **reject** — manager-reported, different entrance |
| Scenario `expectedDirection` | CC:9 / MVP-OUT expected binding | Scenario impacts | expected Outcome direction | present | **reject** — must not copy to observed |
| Advisor / Manager text | NPS / ECA | dialogue | presentation | present | **reject** — not canonical Data Reality |

## D. Canonical Owner

**None accepted.** There is no legitimate owner of published observed KPI direction on the live RMS path.

CORE-OUT:1 already owns the **consumer** field `observedDirection: "improved" \| "worsened" \| "unchanged" | null`. It does not own production of that fact.

## E. NEX-ENT Comparison

NEX-ENT / NEX-EXP:9 maps `observation.state` from **manager-reported** utterances (`source: "manager-reported"`, `sourceAuthority: "manager-statement"`). It may also infer improved/worsened from numeric vs gap current/target. `NEXORA_OUTCOME_MONITORING_BOUNDARY.writesDataReality = false`.

That is **case 2** of the mission (section 68): a different, richer/utterance-based evidence contract, not the same upstream canonical publication contract as CC:5 / RMS Operator CSV. Copying it into CORE-OUT `observedDirection` would transfer the wrong authority.

## F. First Divergent Layer

**None.** Evidence is not lost before CORE-OUT:1A. Live Data Reality never establishes a canonical observed direction.

`toEvaluatorObservation` writes `observedDirection: null` because capture `qualitativeState` is always `null` on the live KPI path. That is honest absence, not a dropped published fact.

## G. Production Repair

**Production changes = 0**

No projection seam is justified. Inferring direction from `actual > baseline` is forbidden.

## H. Direction Evidence

| Class | Result |
| --- | --- |
| Candidate directional observations on live Data Reality | 0 |
| Legitimate canonical directions | 0 |
| Projected directions | 0 (no repair) |
| Correctly-null directions | live Capacity funnel, Family A replay, pre-publication, hidden GT, Delivery switch |
| Wrong-metric | no Capacity direction invented from Delivery/shipping |
| Wrong-subject | Capacity vs Delivery both remain null; no cross-bind of invented direction |
| Hidden-state | unpublished RMS GT does not populate `observedDirection` |

## I. Expected vs Observed

`expectedDirection` remains `maintain` (Family A Capacity). `observedDirection` remains `null`. No copy.

## J. Baseline

OUT-BASE preserved. Family A baseline ≈ 90.91 at `2026-09-16T00:00:00.000Z`, production CSV provenance. Direction discovery did not rewrite baseline.

## K. Actual

Actual remains 100 (Family A). Not replaced by a qualitative label.

## L. Numeric Target / Comparator

`numericTarget = null`, `comparator = null`. None fabricated.

## M. CORE-OUT:1

Family A / live funnel after baseline + actual:

| Field | Value |
| --- | --- |
| evaluations | present |
| observedDirection present | 0 |
| observedDirection null | yes |
| comparison-ready | 0 |
| comparison-incomplete | yes |
| incompatible-evidence-shape | yes |
| comparable | false |

## N. CORE-OUT:2

Observed only: `createsLearning = false`. No Learning repair.

## O. Causation

`establishesCausation = false`. Direction was not invented, so it cannot overreach into cause.

## P. Multi-Thread

Capacity and Delivery both remain `observedDirection = null`. Cross-direction bindings = 0.

## Q. Ground Truth Firewall

Hidden direction leaks = 0. Pre-publication ask remains null.

## R. R4 Replay

See `r4-replay.json`. Before and after this phase: **unchanged**.

| Field | Before | After |
| --- | --- | --- |
| baseline | ≈ 90.91 | ≈ 90.91 |
| expectedDirection | maintain | maintain |
| numericTarget | null | null |
| actual | 100 | 100 |
| observedDirection | null | null |
| comparison | incompatible-evidence-shape | incompatible-evidence-shape |
| productionRepair | — | none |

## S. Deterministic Replays

| Case | Signature |
| --- | --- |
| Family A | `sim-test-10-a_expected_positive`, manufacturing-capacity-pressure, DECISION_ORIENTED_MANAGER, seed 11, Capacity, capacity-utilization, baseline ≈ 90.91, expected maintain, actual 100, observedDirection null, comparison-incomplete |
| Live T80 | same arithmetic (actual > baseline) with observedDirection still null |

Matches: null stays null. Mismatches: 0 fabricated directions.

## T. Regression

| Suite | Result |
| --- | --- |
| OUT-DIR:1 | 7 pass / 0 fail |
| Focused (OUT-BASE, OUT-EVAL-LIVE, OUT-LIVE, COMMIT-LIVE, CORE-OUT:1/1A/2, MVP-OUT:1+R2+R3, NPS:8, ECA:11/12, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1, OUT-DIR:1) | **453 pass / 0 fail** |

Level 4 / SIM-TEST:10-R5 **not run**.

## U. Production Integrity

Production delta = **empty**. Tests + artifacts only. Digest N/A.

## V. Architecture Integrity

- New observed-direction authority = none
- New trend engine = none
- New Data Reality authority = none
- New Outcome authority = none
- New Learning authority = none
- New store = none

## W. Remaining Boundary

First remaining unproven product capability: **canonical published observed direction (or numeric target + comparator) on Data Reality observations**, owned upstream of CORE-OUT.

CORE-OUT:1 comparison policy is already defined and correctly incomplete. CORE-OUT:2 Learning remains blocked for the same reason.

## X. Classification

**CAPABILITY GAP — NO CANONICAL OBSERVED DIRECTION UPSTREAM**

The live management path lacks a canonical observed-direction capability upstream of Outcome evaluation.

## Y. Next Action

Do **not** start OUT-DIR:2. Do **not** start SIM-TEST:10-R5 automatically. Do **not** modify CORE-OUT:1/2 comparison or Learning policy.

Smallest future capability, if product wants direction comparison: establish a **published Data Reality / KPI observation qualitative-or-directional fact** at the existing P0:1 / RDI observation contract (extend the published record, not infer from baseline vs actual inside CORE-OUT:1A). That is a new upstream semantic capability, not a projection phase.
