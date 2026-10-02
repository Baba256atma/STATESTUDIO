# NPA-T LEARN-REASSESS:1

Repair of SIM-TEST:10-R5 first FAIL: **Learning → Reassessment**. Certification-only of that seam. SIM-TEST:10 remains NOT CERTIFIED. Do not start SIM-TEST:10-R6 in this report’s execution.

## A. Status

**LEARN-REASSESS:1 = CERTIFIED**

## B. R5 starting evidence

Supported Learning existed (25 records). Three journeys later reassessed. Learning consumed by reassessment = 0.

## C. Root cause

`synchronizeLiveCc5OutcomeEvaluation` already projected CORE-OUT:2, then discarded the result. `judgeEcaExecutiveLearningClosure` never received supported Learning. “Is this still a problem?” is CC deictic reassessment, not EXI `learning`.

## D. Existing Learning authority

CORE-OUT:2 `projectGroundedLearningIntelligence` / `byFamily`. New **read-only** `listSupportedGroundedLearningForSubject({ workspaceId, subjectId })`: latest-per-family, supported + promotion-eligible, subject-scoped. Not global-latest.

## E. Existing reassessment authority

CC:1/2 + `isCurrentSubjectReassessmentUtterance` + ECA:2 `REASSESS`. Advisor overlay: ECA:12 (already chartered as CORE-OUT:2 projection).

## F. First divergent seam

CC Advisor assembly: live sync invoked, Learning not passed into ECA:12.

## G. Production repair

| File | Change |
| --- | --- |
| `nexoraGroundedLearningIntelligence.ts` | `listSupportedGroundedLearningForSubject` |
| `conversationalExperienceOrchestrator.ts` | After live sync, if reassessment + resolved `obj-*` subject, pass read-only CORE-OUT:2 projection |
| `ecaExecutiveLearningClosure.ts` | Consume that projection on reassessment turns; `consumedSupportedLearning` / `coreOut2LearningIds` |

## H. Architecture reused

CORE-OUT:2, MVP-OUT:1 live sync, CC intent/subject, ECA:12, NCA/runtime focusedSubject. No new store/engine/router.

## I. Learning selection

Resolved object subject (`obj-*`, or Scenario `sourceSubjectId` only after clarification has already passed). Filter `status=supported` and `promotion-eligible`. Family latest, sorted by `learningId`. Not latest Decision/Execution globally.

## J. Actual consumption

Runtime: `ecaLearningClosureJudgment.consumedSupportedLearning === true` and `coreOut2LearningIds` populated. Proven on live Capacity “Is this still a problem?” and “What should we reconsider?” after the certified Capacity chain. Not wording-only.

## K. Family J

Ambiguous “Is this still a problem?” still **Which item do you mean?** — preserved. After resolved Capacity focus, Learning is consumable (T7 live).

## L. Family K

Same-root: CORE-OUT:2 was not attached. Live “What should we reconsider?” now consumes. Journey replayed from turn 1. DTH copy is not the Learning authority.

## M. Family L

Reassessment consumption is independent of later D2. D2 after Options / Go with A. remains **temporal-only**. No Learning→Decision link fabricated.

## N. Family A

Harness PASS. Supported Learning still created on the representative Capacity path. Journey not rewritten to add reassessment.

## O. Negative controls

Delivery reassessment with Capacity Learning present: consumption = 0. Unsupported/inconclusive projections filtered. Ordinary “What is Capacity?” does not inject. Unpublished GT: no sealed terms in reassessment.

## P. Multi-thread

Capacity Learning recovered after Delivery switch. Delivery reassessment does not consume Capacity Learning.

## Q. Current vs historical

ECA note: Learning does not replace published Data Reality.

## R. Causation

`establishesCausation` remains false. No “caused the increase” in live reassessment.

## S. Learning integrity

Fingerprint unchanged across reassessment. Repeat ask: same ids, no duplicate records. NPS still does not write Learning.

## T. Decision/Execution safety

Repeat reassessment: Decision count and Execution count unchanged.

## U. Determinism

Same prior turn + same utterance → same `coreOut2LearningIds`.

## V. Regression

LEARN-REASSESS:1: **12 pass / 0 fail** (including nested T cases).

Focused: ECA:12 unit+runtime, CORE-OUT:2, CORE-OUT:1/1A, OUT-DIR:1-R2, RDI-DIR:1, OUT-BASE:1, OUT-EVAL-LIVE:1, OUT-LIVE:1, COMMIT-LIVE:1, NPS:8 unit, ECA:11, SIM-TEST:9-FIX1/FIX2, SIM-TEST:8-FIX1, Decision FIX15.

**478 pass / 0 fail.**

Not run: SIM-TEST:10-R6, Level 4, full repository, NPS:8 runtime, NMI-only extra suite beyond 8-FIX1.

## W. Production integrity

This-phase owners: CORE-OUT:2 read helper, CC orchestrator attach, ECA:12 consume.

Working-tree app production digest after this repair: `ed55fabf7caca5c7605b51b0757378d36774526d4b748e9cdf28918bdf96485c` (12705 files).

Protected hashes:

- `conversationalExperienceOrchestrator.ts` `c66c949d97659270dd63e0dcd8777deee147e8c2a38b929a987b2d7537d58dbb`
- `nexoraGroundedLearningIntelligence.ts` `1e521c68fd7498d71a6c7c37c9a149e623c167cdabfbc8e97462b97e107e3587`
- `ecaExecutiveLearningClosure.ts` `f2e89fe75b8e0e5121adb845be0b2f72d75bb3f086b6aef4a25c09d5e67ac61e`

Orchestrator also contains prior certified live-repair uncommitted history; this phase did not add a new authority.

## X. Architecture integrity

New Learning authority = none  
New Learning store = none  
New Outcome authority = none  
New reassessment authority = none  
New conversation router = none  
New management store = none

## Y. Remaining boundary

**Learning → Reassessment = PASS** (this seam).

Next unproven: **Reassessment → Next Management Cycle**. Not repaired here.

## Z. Next action

Do **not** start LEARN-REASSESS:2.

Next named recertification, when requested: **NPA-T SIM-TEST:10-R6** from turn 1.

---

NPA-T LEARN-REASSESS:1 — CERTIFIED
