# NPA-T VAI:4 — Advisor Variable Analysis

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:5.

## Status

**NPA-T VAI:4 — CERTIFIED**

## Architecture inspected

CC:5 `executeNexoraConversationalExperience` remains the Advisor conversation authority. VAI:1–3 remain Variable, role, and evidence/causal owners. MO:1 catalog and Stage `focusedSubject` remain Object/focus owners. ECA/NCA overlays remain in place. NPS remains the problem-solving path. VAI:4 is a read-only overlay after those overlays: it may replace `presentedResponse` only for a bounded Variable-analysis sub-intent when a `vaiAdvisorBundle` is supplied.

## VAI:1–3 contracts reused

`resolveVaiVariables`, `resolveVaiObjectVariableRoles`, `resolveVaiCausalSafety`. Composer consumes `VaiAdvisorBundle.variables`, `.roleResult`, and `.relationship` in that order. No parallel Variable, role, or causal store.

## Existing Advisor authorities reused

CC:1 intent (unchanged general NLU). CC:5 finish/finalize. Stage `focusedSubject` as focal override. Optional previous `VaiAdvisorSession` for follow-ups (not a parallel dialogue store). ECA mutation lock still blocks overlay when the turn is already owned by mutation/proposal.

## Files created

- `frontend/app/lib/vai/vaiAdvisorIdentity.ts`
- `frontend/app/lib/vai/vaiAdvisorContract.ts`
- `frontend/app/lib/vai/vaiAdvisorIntent.ts`
- `frontend/app/lib/vai/vaiAdvisorComposer.ts`
- `frontend/app/lib/vai/vaiAdvisorDiagnostics.ts`
- `frontend/app/lib/vai/vaiAdvisorAnalysis.test.ts`
- `frontend/artifacts/vai/VAI-4/*`

## Files modified

- `frontend/app/lib/conversational-control/conversationalExperience.ts` — optional `vaiAdvisorAnalysis`
- `frontend/app/lib/conversational-control/conversationalExperienceOrchestrator.ts` — optional bundle/session pass-through, overlay in `finalize`, restored `buildNexoraConversationalExperienceResponse` import

VAI:1–3 production contracts unchanged.

## Variable-intent behavior

`detectVaiAdvisorIntent` is a bounded pattern match (variables that matter, levers, outcomes, confounders, causal questions, why-role, why-not-cause, investigate, deictic follow-ups). Unmatched utterances stay `NONE` and do not overlay.

## Referent/context behavior

Focal Object is `focalOverride` (Stage `focusedSubject`) else bundle focal. Empty focal → clarify. Test O: Demand Surge override; stale “Capacity Expansion Plan” does not appear.

## VAI:1 → VAI:2 → VAI:3 → Advisor pipeline proof

Composer filters VAI:2 `relevant` items, then VAI:3 `relationship` for evidence/causal wording. Roles never inferred from prose. Causal upgrade flag is always `false`.

## Six-role communication behavior

LEVER / OUTCOME / PATH_OF_EFFECT / MODERATOR / CONTROL / CONFOUNDER have manager-facing templates. Ambiguous LEVER|MODERATOR keeps both possibilities.

## Evidence-calibrated language proof

ASSOCIATED wording without “causes/drove”. Confounders keep causal language unconfirmed. Mixed evidence is explicit.

## Causal-question behavior

Test D: association explained; `causalUpgrade: false`. Test K: VAI:3 confounder/threshold reasons.

## Manager-assertion behavior

Test E: “You identified machine downtime as the cause” plus independent evidence not confirmed.

## Unknown/ambiguity behavior

CAP_AV stays CAP_AV; meaning unconfirmed; cannot be used as Available Capacity. Ambiguous Machine Availability not forced to one role.

## Conflicting-evidence behavior

Test I: mixed evidence; no hire/buy action.

## “Why?” explanation behavior

Why-lever uses VAI:2 lever basis; does not prove solving the problem. Why-not-cause uses VAI:3 confounders/association.

## Investigation-guidance behavior

Analytical next step only; `scenarioCreated` / `decisionCreated` / `executionStarted` remain false.

## Conversation-continuity proof

Follow-up lever keeps `vai:staffing`. Evidence follow-up keeps `ctx-capacity-vars`. Overlay uses `previousVaiAdvisorSession`.

## NPS boundary proof

`npsPathCreated: false`. No NPS replacement. NPS:3 / NPS path regressions pass.

## Recommendation boundary proof

`recommendationIssued: false`. Levers are not hiring/buying instructions.

## Stage boundary proof

`stageMutated: false`. No Variable symbols or Theatre writes.

## Architecture-leakage proof

Manager text fails closed if VAI:/CC:8/CORE-INT:3/causal resolver/semantic authority/causalAssertion/role registry appear. Test P.

## Mutation-safety proof

Variable JSON and Object catalog IDs unchanged in tests Q; composition flags all false for writes.

## Focused test results

A–R + identity + CC:5 overlay: **20 pass / 0 fail**.

## Regression results

VAI:1, VAI:2, VAI:3, DATA-UX:3, NPS:3, NPS path, CC:1 intent: **105 pass / 0 fail**.

MRA:3-RECERT-FIX1 deictic + SYS:1-FIX1 deictic (including collection-after-click): pass after restoring the CC:5 response builder import (missing import caused “couldn't complete that command”).

## ESLint

Touched VAI:4 + CC:5 files: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. Live harvest of VAI:1–3 without a host bundle is deferred. Theatre/intervention work is VAI:5+.

## Final status

**NPA-T VAI:4 — CERTIFIED**
