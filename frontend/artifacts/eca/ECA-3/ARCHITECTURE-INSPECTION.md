# NPA-T ECA:3 — Architecture Inspection

Date: 2026-09-14 (re-inspection for NEW PHASE certification; prior inspection 2026-09-07)

## Stop condition

ECA:3 may be certified only when one read-only executive initiative judgment consumes certified ECA:1 context, the certified ECA:2 action plan, and existing NCA:5 / NXA:4 / MO:6 initiative primitives; chooses silence or one bounded intervention; never mutates business/Stage state; passes focused A–T plus prompt A–O and four multi-turn sequences; passes short live `/executive` proofs (≤5); and preserves ECA:1/ECA:2 plus required quality gates.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 `composeEcaWorkingConversationContext` | Required input |
| Conversational next move | ECA:2 `planEcaExecutiveConversationAction` | Referenced; not re-planned |
| Conversational initiative | NCA:5 `evaluateNca5InitiativeStrategy` | Owns capability; ECA:3 does not recreate |
| Entry policy SPEAK/DEFER/SUPPRESS/ESCALATE | NXA:4 `evaluateNxa4ProactiveAdvisory` | Consumed as input |
| Attention / intervention need | MO:6 `composeExecutiveAttentionIntelligence` | Candidate source only |
| Executive situation | NXA:3 | Goal/focus/change context |
| Recommendation / judgment | NCA:4 / NXA:5 / ECA:7 | Not initiative engines |
| Stage / Director | NXA:5-FIX4 / DIR | Read visibility only |
| Data uncertainty | ECA:1 data slice + DATA-ADV | Unconfirmed ≠ WARN |
| Decision / Execution | CC:10 / CC:11 | Named review targets only |
| Session suppress fingerprints | NCA:2 + `ManagerObjectSession.ecaInitiativeSession` | No new durable store |

## What is genuinely missing (answered 2026-09-07; still true)

NCA:5/NXA:4 do not consume certified ECA:1 + ECA:2 as the executive NOW→NEXT situation. ECA:3 fills that judgment gap only.

## Chosen ECA:3 boundary (already implemented)

Canonical module: `judgeEcaExecutiveInitiative` in `ecaExecutiveInitiativeJudgment.ts`.

- Identity: `NPA-T ECA:3/ProactiveExecutiveGuidanceAdvisorInitiative`
- SPEAK ↔ `shouldIntervene: true`; SILENT ↔ `shouldIntervene: false` + `suppressionReason`
- Significance, urgency, and confidence remain separate fields
- Frozen no-write boundaries
- No second attention, recommendation, writer, store, or notification system

## Dependency direction

ECA:1 (NOW) → ECA:2 (NEXT plan) → ECA:3 (whether to speak).

## Speech vs judgment

Conversational speech remains NCA:5 / NXA:4 / Advisor composition. ECA:3 attaches judgment + shell diagnostics (`data-eca-3-*`). It does not overlay a competing Advisor message.

## Parallel authorities forbidden

Do not recreate NCA:5, NXA:4, MO:6, PM:4 brief queues, or CC:10/CC:11 writers under an ECA:3 name.
