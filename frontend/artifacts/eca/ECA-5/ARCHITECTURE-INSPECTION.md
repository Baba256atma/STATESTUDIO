# NPA-T ECA:5 — Architecture Inspection

Date: 2026-09-14 (re-inspection for NEW PHASE certification; prior inspection 2026-09-07)

## Stop condition

ECA:5 may be certified only when one read-only answer-interpretation judgment binds a manager turn to the active ECA:4 need (or correctly refuses), preserves uncertainty/qualifiers, never writes business/Stage/Data truth, hands off only to existing canonical authorities, does not create a second pending-question store or confirmation engine, passes focused A–T plus prompt A–T and four multi-turn sequences, passes short live proofs (≤5), and preserves ECA:1–4 plus required quality gates.

## Existing authorities inspected

| Concept | Existing authority | Reuse decision |
| --- | --- | --- |
| Working situation | ECA:1 | Required input |
| Conversational next move | ECA:2 | Referenced; not replaced |
| Initiative | ECA:3 | Not called by ECA:5 |
| Pending question / need | ECA:4 session | Primary binding target |
| Speech-act classification | NCA-POST:2 | Reuse; not a second NLU |
| Semantic confirmation | DATA-ADV | Handoff only |
| Mutation Yes | ECA:1 confirmation + Risk handoff | Handoff only |
| I don’t know / skip | ECA:4 helpers | Same detectors |
| Decision / Execution / Outcome | CC:10 / CC:11 / Theatre | Handoff targets only |

## Chosen ECA:5 boundary (already implemented)

Canonical module: `judgeEcaExecutiveAnswerIntake` (`ecaExecutiveAnswerIntake.ts`).

- Identity: `NPA-T ECA:5/ExecutiveAnswerInterpretationTrustedInformationIntake`
- `bound` + `answerType` + `completeness` + `confidence` + `intakeAction` + `authorityTarget`
- Frozen no-write boundaries; `mutationAllowedByEca5` effectively always false
- No generic writer; no second pending-question store; no ECA:4 duplication

## Dependency direction

ECA:1 → ECA:2 → ECA:3 → ECA:4 → **ECA:5**.

## Parallel authorities forbidden

Do not recreate NCA-POST:2 NLU, DATA-ADV writers, confirmation engines, or durable memory under an ECA:5 name.
