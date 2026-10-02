# NPA-T RDI-DIR:1 — Canonical Published KPI Observed Direction

## A. Status

**RDI-DIR:1 = CERTIFIED**

## B. Capability Gap Closed

OUT-DIR:1 proved CORE-OUT:1A was not dropping a published observed direction. The fact did not exist on Data Reality.

RDI-DIR:1 adds that fact: two legitimately published KPI observations of the same subject, metric, unit, and source, ordered by effective `observedAt`, establish descriptive `increase` / `decrease` / `stable`.

CORE-OUT is unchanged. CORE-OUT:1A still writes `observedDirection = null`.

## C. Canonical Owner

| Field | Value |
| --- | --- |
| Owner | P0:1 Data Reality KPI observations, published through RDI:1/RDI:2 |
| File | `frontend/app/lib/data-reality/publishedKpiObservedDirection.ts` |
| Contract | `projectPublishedKpiObservedDirection` / `PublishedKpiObservedDirectionProjection` |
| Producer | RDI:2 CSV commit records KPI snapshots; RDI:4 live journal already retains history |
| Consumer surface | Data Reality projection API (Outcome may consume later) |

## D. Existing Architecture Reused

- `NexoraKPIResult` remains the numeric KPI fact.
- CSV still replaces **current** truth per `sourceContextId`.
- Because replacement erases prior current snapshots, RDI:2 now appends a **session publication log** of KPI observations (`listCsvPublishedKpiObservations`) so history can be derived without a second Data Reality.
- Live connectors already keep an observation journal; those KPIs are included in the same projection.
- Subject aliases reuse `EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP` (`production` / canonical id / `obj-capacity`).
- RDI:3 `improved`/`deteriorated` is **not** reused.

Derived, not a second truth: direction is computed from published observation history. Direction is not stored as its own registry.

## E. Production Delta

| File | Change |
| --- | --- |
| `dataRealityContracts.ts` | `NEXORA_PUBLISHED_KPI_OBSERVED_DIRECTIONS` |
| `csvRealDataImportStore.ts` | record published KPI observations on successful commit; reset/clear with the store |
| `publishedKpiObservedDirection.ts` | projection, compatibility notes, firewalled flags |

CORE-OUT / MVP-OUT / CC:5: **0 files**.

## F. Direction Vocabulary

`increase` — current numeric value > previous comparable published value  
`decrease` — current < previous  
`stable` — current === previous (exact; no hidden tolerance)  
`null` — insufficient or incompatible evidence (`first-observation`, `incompatible-unit`, etc.)

Not `improved` / `worsened` / `successful`.

## G. Previous Observation Resolution

For the selected current observation (latest by `observedAt`, or an explicit `currentObservationId`):

previous = same `kpiId` + equivalent subject + **same `sourceContextId`** + `observedAt` < current + latest such time.

Not global latest KPI. Not current UI subject. Not latest Execution.

## H. Compatibility Rules

- Subject: canonical object identity map (not Stage focus)
- Metric: exact `kpiId`
- Units: exact trimmed string match; no conversion engine
- Shape: finite scalar numbers only
- Source: same `sourceContextId` lineage
- Time: effective observation time, not ingest/array order

## I. Increase Evidence

CSV: usedCapacity 10 / totalCapacity 11 → 100/100  
`observedDirection = increase`  
Live RMS Capacity: 90.909… → 100 = `increase` (`capacity-live-funnel.json`)

## J. Decrease Evidence

100 → 90 = `decrease` (focused T4). Live T3 after 100 → 95 also `decrease` while T1→T2 remains `increase`.

## K. Stable Evidence

100 → 100 exact = `stable` (T5). No ±tolerance.

## L. Unknown Evidence

First publication; hidden GT without second publication; wrong metric; wrong subject; incompatible units; mixed source; non-finite; duplicate/same-timestamp correction.

## M. Provenance

Live Capacity example:

- previous: `csv:indep:PRODUCTION:0:import:kpi.production.capacity-utilization` at `2026-09-16T00:00:00.000Z`
- current: `csv:indep:PRODUCTION:15:import:kpi.production.capacity-utilization` at `2026-10-01T00:00:00.000Z`

## N. Temporal Integrity

Array order ignored (T12). Same timestamp replace = correction, not trend (T15).

## O. Duplicate / Correction

Duplicate same timestamp/value does not create `stable`. Same-timestamp value correction replaces the observation; no fabricated trend.

## P. Ground Truth Firewall

Hidden GT after tick advance without publication: direction remains first-observation. Leaks = 0.

## Q. Expected Direction Firewall

Scenario/CC:5 expected direction is not read. Copies = 0. Family A `maintain` vs RDI `increase` is allowed and preserved.

## R. Outcome / Causation Firewall

`establishesCausation = false`, `evaluatesOutcome = false` on every projection.

## S. Multi-KPI / Multi-Subject

Capacity increase and shipping decrease isolate. Cross-bindings = 0.

## T. Historical Integrity

After T3, querying T2 `currentObservationId` still returns T1→T2 `increase`. Rewrites = 0.

## U. Determinism / Idempotence

Two live RMS runs: same previous/current values and `increase`. Duplicate re-commit does not drift to `stable`.

## V. Capacity Live Funnel

| Field | Value |
| --- | --- |
| subject | `obj-capacity` |
| metric | `kpi.production.capacity-utilization` |
| T1 | ≈ 90.91 at 2026-09-16T00:00:00.000Z PRODUCTION tick 0 |
| T2 | 100 at 2026-10-01T00:00:00.000Z PRODUCTION tick 15 |
| observedDirection | **increase** |

## W. CORE-OUT Compatibility

CORE-OUT `observedDirection` is `improved` \| `worsened` \| `unchanged`. That is **evaluative**, not descriptive.

RDI `increase` is **not** `improved`. Automatic mapping is **false**. CORE-OUT files were not modified.

## X. OUT-DIR Readiness

**OUT-DIR:1-R2 projection now justified**

Canonical RDI direction exists. CORE-OUT:1A `toEvaluatorObservation` still sets `observedDirection: null`. Projection is not automatic.

## Y. Regression

| Suite | Result |
| --- | --- |
| RDI-DIR:1 | 22 pass / 0 fail |
| Focused (RDI:1, RDI:2 vertical slice, CSV durability, RDI:3, P0:1 foundation, P0:3 KPI, OUT-BASE, OUT-LIVE, OUT-EVAL-LIVE, CORE-OUT:1A/1, SIM-TEST:8-FIX1, SIM-TEST:9-FIX1/FIX2) | **275 pass / 0 fail** |

Not run: SIM-TEST:10-R5, Level 4, full repository, OUT-DIR:1-R2.

## Z. Production Integrity

| File | SHA-256 |
| --- | --- |
| `dataRealityContracts.ts` | `b1c45909b87d6e45e1f64e2400c2baa13678485231239781a28bc9a7ecbeff11` |
| `csvRealDataImportStore.ts` | `ec48c2bb79a5f9d5888b866f34a886b5d7ae796ccbc7ac8803744ef219621ad6` |
| `publishedKpiObservedDirection.ts` | `cdb6d6c89c401bbd3b333919ac23261703135122926d098e4ce4f41a8bf50b45` |

## AA. Architecture Integrity

- New Data Reality authority = none
- New KPI registry = none
- New trend engine = none
- New observed-direction store = none (publication log is KPI history on existing RDI:2 commit, derivation is a projection)
- New Outcome authority = none
- New Learning authority = none

## AB. Remaining Boundary

Canonical RDI observed direction  
→ CORE-OUT:1A `observedDirection` projection  

(OUT-DIR:1-R2). Mapping must not treat `increase` as `improved` without a certified representational adapter.

## AC. Next Action

Run **NPA-T OUT-DIR:1-R2 — Canonical Observed Direction Projection Recertification**.

Do not start SIM-TEST:10-R5 from this phase. Do not start RDI-DIR:2.
