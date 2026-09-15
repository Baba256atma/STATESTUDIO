# NPA-T ECA:6 — Architecture Inspection

Date: 2026-09-14 (re-inspection for NEW PHASE certification; prior inspection 2026-09-08)

## Stop condition

ECA:6 may be certified only when one read-only dialogue-strategy projection consumes certified ECA:1–5 + CONV:2 thread/objective; preserves multi-turn purpose without a workflow engine; distinguishes objective vs intent vs subject vs Goal; supports side detours, switch, pause/resume, completion; never mutates business lifecycle; passes focused A–T plus prompt A–T and four multi-turn sequences; passes short live proofs (≤5); and preserves ECA:1–5 plus required quality gates.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 | Required input |
| Immediate next action | ECA:2 | Not replaced |
| Initiative | ECA:3 | Not triggered by strategy |
| Information acquisition | ECA:4 | `unresolvedNeedId` only |
| Answer intake | ECA:5 | Progress markers only |
| Conversation thread/objective | CONV:2 `nexoraConversationObjective` | Primary durable conversational authority |
| Journey / MO | MO journey intelligence | Not a second journey engine |

## Chosen ECA:6 boundary (already implemented)

Canonical module: `judgeEcaExecutiveDialogueStrategy` (`ecaExecutiveDialogueStrategy.ts`).

- Identity: `NPA-T ECA:6/ExecutiveDialogueStrategyMultiTurnObjectiveControl`
- Session overlay only (`createsSecondObjectiveStore: false`, `replacesConv2: false`, `forcesWorkflow: false`)
- Fields: `objectiveType`, `lifecycle`, `progress`, `unresolvedNeedId`, `currentMilestone`, `recommendedMilestone`, `relationshipToCurrentTurn`
- No Decision/Execution/Data/Goal writers

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → **ECA:6**.

## Parallel authorities forbidden

Do not create a workflow runner, second objective store, journey engine, or lifecycle writer under an ECA:6 name.
