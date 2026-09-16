# NPA-T SYS:1-FIX2 — Option Comparison → Preference → Commitment Candidate Fidelity

**Status: CERTIFIED**

Repair date: 2026-09-15.

No SYS:1 recertification. No SYS:2 started.

## Status

**NPA-T SYS:1-FIX2 — CERTIFIED**

## Root cause

Two bounded failures in the same existing authority chain, not one generic context bug.

### Cause 1 — Problem collection captured Option comparison

Owning layer: NCA-POST:4 `resolveExecutiveComparisonCandidateSet`.

Previous precedence:

1. explicit named references (≥2)
2. `lastCollection` (Problems: Capacity Gap vs Margin Pressure)
3. `activeComparison`
4. unresolved

`Compare the options.`, `Compare them.` after options, and `Which one do you recommend?` therefore used the stale Problems collection. The orchestrator presented that NCA-POST:4 / NXA:5 text, then NPS:5 appended Internal vs External. Dual comparison.

External became Internal later only after Cause 2; Cause 1 is why Problem ranking appeared in Option requests.

### Cause 2 — Deictic proceed bound recommendation, not preference

Owning layer: ECA:8 target resolution on explicit `Let's proceed with it.`

`I prefer External Capacity.` stored External on `pendingTargetId` in PREFERENCE (awaitingConfirmation false). The next explicit proceed had no named target, skipped pending because confirmation was not awaiting, and fell back to `recommendedOption` (often Internal / Capacity Expansion Plan / temporary capacity).

Confirmation display followed that substituted target. Preference text could still say External (NPS:6 / ECA:8 preference note) while confirmation named Internal.

A related NPS:6 compose leak copied recommendationConditions (`Qualified external capacity must be available.`) onto any candidate when the primary condition field was empty.

## Corrected precedence

Explicit type language
> conversationally active Option set (after options were asked, offered, or compared)
> Problem `lastCollection`

and:

explicit `problems`
> Option set

Deictic `compare them` uses Options only when the Option set is conversationally active. After `Show me the problems.` it remains Problems (SYS:1-FIX1 H preserved).

Explicit proceed with `it` binds `pendingTargetId` (preference) before recommendation. Topic change still clears pending when commitment state is NONE, so stale External is not resurrected.

Recommendation identity stays on NPS:5 / ECA:7. Preference identity stays on ECA:8 pending / NPS:5 `managerPreferenceOptionId`. They are not required to match.

## Owning existing authority

- NCA-POST:4 candidate-set domain (Problem collection ≠ Option collection)
- ECA:8 commitment target (preference → proceed)
- NPS:5 runtime facts (parse/persist manager preference without a preference store)
- NPS:6 condition travel with the same candidate
- Orchestrator wiring only: pass option members, previous utterance, previous preference id

NPS remains READ / COMPOSE / ROUTE / PROJECT. CC:10 remains the Decision writer. CC:11 unchanged.

## Files modified

- `app/lib/manager-object/nexoraNcaPost4CollectionComparison.ts`
- `app/lib/manager-object/nexoraNcaPost4CollectionComparison.test.ts`
- `app/lib/nexora-conversation/ecaExecutiveCommitment.ts`
- `app/lib/nexora-conversation/ecaExecutiveCommitment.test.ts`
- `app/lib/nexora-problem-solving/npsComparisonRecommendationRuntime.ts`
- `app/lib/nexora-problem-solving/npsDecisionCommitment.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/lib/nexora-system/sys1Fix2OptionCommitmentFidelity.runtime.test.ts`

## Tests

- FIX2 A–O + identity trace + live proof: pass
- SYS:1-FIX1 A–L + live: pass
- NCA-POST:4, NCA:2, NXA:5, ECA:7–8, NPS:4–6, CC:10 confirmation, CC:11/no-start: pass
- SYS:1 audit runtime (not recertified): pass
- ESLint on changed surfaces: 0 errors

## Boundaries preserved

Problem collection ≠ Option collection  
Comparison ≠ Recommendation  
Recommendation ≠ Preference  
Preference ≠ Commitment  
Commitment ≠ Approved Decision  
Approved Decision ≠ Execution  
Stage and Advisor still share the same executive subject (FIX1)
