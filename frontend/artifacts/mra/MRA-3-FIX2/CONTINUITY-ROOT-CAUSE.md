# FINAL:6.2 Continuity — Root Cause

## Reproduced

Unmodified corpus `nexoraMvpFinal62ConversationContinuity.test.ts`.

Previous (FIX1 L4):

- `A3:1` `What's going on with that?` after `Show Risk.` → `subject=none`, `unresolved=true`
- `D1:3` / `R1:14` `Explain it.` after `Show Risk.` → `subject=Delivery`
- unit: after Delivery → Explain it → Show Risk → Explain it → Delivery, not Risk

## Earliest incorrect transition

1. CC:1 classified singular `show risk` as `show-problems` (`risks?`).
2. Orchestrator continuity update preferred leftover `activeObjectId` (Delivery) over EXPLICIT NLU Risk.
3. `unsafeThat` treated collection `presentedIds` (Problem members) as competing referents, clearing Risk for `that`.

Pronoun resolution itself was not a phrase table for `Explain it` / `What's going on with that?`.

## Repair

- Singular `show risk` falls through to named-object FOCUS; plural `show risks` remains collection.
- `updateConversationContinuity` prefers `EXPLICIT_CURRENT_TURN` over stale resolved/active ids.
- `unsafeThat` uses distinct thread subjects only, not collection listing.

Repaired result: FINAL:6.2 corpus PASS (unmodified assertions).
