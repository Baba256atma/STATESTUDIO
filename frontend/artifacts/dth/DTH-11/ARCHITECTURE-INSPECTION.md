# DTH:11 — Architecture inspection

## Smallest extension point

Project a read-only **Outcome Observation Theatre** after DTH:10 live Execution, when Outcome evidence is relevant. Scene intent reuses DTH:5 `REVIEW_OUTCOME`. No `LIVE_OUTCOME` intent.

Canonical flow:

Committed Decision → CC:11 Execution → DTH:10 live observation → CORE-OUT:1A session capture (when present) → DTH:11 Outcome Observation Theatre → Director → Stage.

DTH:11 consumes Outcome evidence. It does not become Outcome truth.

## Canonical Outcome facts that actually exist

| Authority | Writer? | Durable ID? | Links | Survives reload? |
|---|---|---|---|---|
| CC:11 Execution | Execution only | `executionId` | `decisionId` | No (in-memory) |
| CORE-OUT:1A | Session capture, not a product Outcome store | `obs:...` observation ids | optional `executionId` / `decisionId`; eligibility is strict | No (`storageLifetime: "session"`) |
| CORE-OUT:1 | Evaluation | expected/actual when linked | Does not write Stage/Learning | Session |
| NEX-EXP:9 | Entrance overlay only | none for `/executive` existing-workspace | Utterance ownership | n/a |
| EI:6 | Comparison adapter | forbids completion→success and inferred causality | n/a | n/a |
| Catalog KPI `obj-delivery` | No | object id | current `"91%"`, target `"96%"` | Catalog only |

**There is no durable Outcome writer on existing `/executive`.** Current KPI is not Outcome. Execution `completed` is not Outcome.

Theatre may:

- project `OUTCOME_PENDING` when Execution is `completed` and no observation exists
- project manager-reported session capture as `OUTCOME_UNCERTAIN` / `OUTCOME_PARTIAL`
- project an explicit Theatre observation record (tests / future Data Reality) as `OUTCOME_OBSERVED`

Theatre may not: invent KPI values, ROI, causality, Learning, a new Decision, confirmation UI, or `OUTCOME_CONFIRMED`.

Manager-reported delivery capture reuses CORE-OUT:1A. Provenance may include `baseline:` and `target:96` (existing Delivery goal used in NXA situation truth, not a fabricated Outcome). Capture does not invent timestamps (`observedAt` remains null). Captures are typically **not** `eligibleAsActualOutcome`.

## Theatre interpretation (not a second lifecycle)

| Evidence | Theatre state |
|---|---|
| live Execution, no observation | DTH:10 owns; DTH:11 does not project |
| Execution `completed`, no observation | `OUTCOME_PENDING` |
| live Execution + early/interim observation | `OUTCOME_PARTIAL` |
| manager-reported / unknown source | `OUTCOME_UNCERTAIN` |
| other captured observation | `OUTCOME_OBSERVED` |
| canonical confirmation | not used (`OUTCOME_CONFIRMED` unused) |

Completion ≠ success ≠ `OUTCOME_OBSERVED`.

## DTH:10 → DTH:11 handoff

Active Execution overlay remains until an Outcome Theatre projection exists (pending or observed). Outcome overlay then replaces the live overlay. Investigation still wins when open.

No automatic transition merely because Execution completed without evidence.

## Scene

CC:11 / CORE-OUT:1A ids are not catalog Stage Outcome objects. Sparse truthful scene: overlay + Decision/Execution context. Color is not success. Distance is not causality.

## Conversation

Advisor overlays on existing `/executive` only. Entrance NEX-EXP:8/9 keep ownership via `skipTheatreCopy`. Collection queries (`show outcomes`) do not capture and do not mutate. Click remains DTH:6 investigation.

## Reload

CORE-OUT:1A and CC:11 are in-memory / session. Hard reload does not invent Outcome. If observations are still in the same JS session, Theatre reconstructs them. Full page reload: pending/absent, honestly.

## Not started

DTH:12 Learning & Reassessment Theatre.
