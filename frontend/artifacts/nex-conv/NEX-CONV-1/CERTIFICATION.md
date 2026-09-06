# NEX-CONV:1 — Certification

Status: **NEX-CONV:1 — CERTIFIED**

Date: 2026-09-05.

Live proof: `frontend/.certification/nex-conv1-conversation-kernel/live-browser.json`  
Port: **3012** (temporary production `next start`; stopped after proof). Historical `:3000` was left running.

## Root cause

Object education mapped `THIS` / `WHY` to a single template (`explainKind` / `WHY_STAGE`). Repeating “What is this?” or “Why is it on Stage?” reselected the same sentence. FIX1/FIX2 already had coverage progression for Capability/Appears/Focus, but Object education did not consume it. This is phrase → template, not missing NLU or a transcript store.

## Conversation Kernel

Owns conversational progression and Conversational Move selection. Deterministic `resolveConversationalMove`. Does not own meaning, business truth, Stage, Decision, Execution, or Advisor composition.

## NCA boundary

Meaning remains `interpretCanonicalManagerMeaning`. Kernel has no `includes("what is this")` / `includes("why")`. Object education may consume NCA EXPLAIN/ASK_WHY to own semantic equivalents.

## Subject boundary

Subjects are existing educational/catalog ids (`obj-nex-ent3-goal`, `lesson:APPEARS`, …). No second object registry.

## Conversational Move model

`ANSWER`, `DEEPEN`, `CONNECT`, `OFFER_NEXT`, `CLARIFY`, `REPEAT`, `EXPLAIN_WHY`, `SHOW`, `COMPARE`, `INVESTIGATE`, `CONTINUE`, `SUMMARIZE`.

## Progression model

FIX2 coverage: `NONE → INTRODUCTORY → DEEPENED → PRACTICAL → SATURATED`, keyed by `(subjectId, purpose)`.

## Saturation

Coverage `SATURATED` when further same-strategy explanation is unlikely to add value. Not a repeat-count ladder.

## Explicit Repeat

Existing entrance exact-repeat utterances, plus `repeat that`. Kernel `move = REPEAT` does not advance coverage. Then “Tell me more” resumes IDENTIFY progression.

## Subject/Purpose scope

Goal IDENTIFY saturation does not apply to Problem IDENTIFY or Goal WHY_PRESENT.

## Action-result continuity

Working threads store `lastCapabilityRequest` / `lastCapabilityResult`. Failed SHOW is not demonstrated. FIX1 explain-after-successful-Focus remains.

## FIX1/FIX2 migration

**A generalized + B adapted:** `advanceExplanationDepth` aliases Kernel coverage advance. Appears/Capability/Focus Why call the Kernel. Named depth fields remain projections for certified FIX2 tests.

## Advisor / Stage

Advisor still composes non-educational turns. Kernel does not write Stage. SHOW is a request only.

## LLM boundary

Move selection is local and deterministic. No extra model call for ANSWER → DEEPEN.

## Business / Decision / Data / Evidence safety

Educational Kernel path writes none of Goal/Problem/Risk/Scenario/Decision/Execution/Outcome/Learning/BCA/Data semantics. Continue ≠ approval. Repetition does not escalate UNKNOWN or cause.

## Files created

- `frontend/app/lib/nexora-conversation/nexoraConversationKernelContract.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationalMove.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationProgression.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationPolicy.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationWorkingContext.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationDiagnostics.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationKernel.test.ts`
- `frontend/app/lib/nexora-conversation/nexoraConversationKernel.integration.test.ts`
- `frontend/artifacts/nex-conv/NEX-CONV-1/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-conv/NEX-CONV-1/KERNEL-CONTRACT.md`
- `frontend/artifacts/nex-conv/NEX-CONV-1/CERTIFICATION.md`
- `frontend/scripts/nex-conv1-conversation-kernel-certify.mjs`
- `frontend/.certification/nex-conv1-conversation-kernel/` (live-browser.json + screenshots)

## Files modified

- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceTypes.ts`
- `frontend/app/lib/nexora-entrance/nexoraEntranceConversationContinuity.ts`
- `frontend/app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts`
- `frontend/app/lib/nexora-entrance/nexoraObjectEducationExperience.ts`
- `frontend/app/lib/conversational-control/conversationalExperience.ts`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `frontend/app/executive/nex-mvp/NexoraExecutiveShell.tsx`

## Tests

| Suite | Result |
| --- | --- |
| NEX-CONV focused + educational integration | 15 pass / 0 fail |
| NEX-ENT (all `nexora-entrance` + CONV) | 328 pass / 0 fail |
| NEX-ENT-FIX2 | 10 pass / 0 fail |
| NEX-ENT-FIX3 | 16 pass / 0 fail |
| conversational-control | 336 pass / 0 fail |
| DIR:GA + DIR:VI + NCA/NCA-POST batch | 235 pass / 1 fail (see below) |
| CONV+FIX2+FIX3 recheck | 41 pass / 0 fail |

**Classified, not CONV-owned:** `nexoraNca4AdvisoryIntelligence.test.ts` “M. Unsupported strong action is challenged” returns NCA-POST multi-entity clarification (“compare Capacity and Delivery”) for an utterance that names both. Kernel is not on that path (no educational lock, no move copy). Not a Goal-template loop and not a second NLU.

## TypeScript

`npm run typecheck` — pass.

## ESLint

Changed CONV/ENT/CC/shell files — 0 errors. Pre-existing warnings: shell `useMemo` deps; guided entrance unused `runtimeState`.

## Production build

`npm run build` — pass.

## Live port

**3012**. Runtime errors: **0** (hydration/minified #418 filtered as environmental, none observed).

## Duplicate-authority audit

No second NLU, Advisor, Stage, Director, Decision, Data semantics, transcript DB, durable conversational memory, global NexoraMode, or BCA persistence.

## Template explosion / repeat-count

Kernel policy has no `repeatCount`, no `goalRepeat2`, no `object.type === "PROBLEM"` branches. Domain deepen copy is kind-labeled composition, not a per-object repeat ladder.
