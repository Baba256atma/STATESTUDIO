# FINAL:6.3 Clarification — Root Cause

## Reproduced

Unmodified corpus `nexoraMvpFinal63SmartClarification.test.ts`.

Previous (FIX1 L4): `G0c`/`G1c`/`G3c`–`G7c` `Explain that.` → `action=proceed` (false negative). All of these use `Show Risk.` as the second named SHOW except `G2c` (`Show Risk.` then `Show Delivery.`), which already passed.

## Earliest incorrect transition

`Show Risk.` did not append Risk to the continuity thread when a prior subject existed (same dual collection/object path as 6.2). The `that` gate requires two distinct thread subjects. With only Delivery on the thread, `Explain that.` bound the leftover subject and proceeded.

Separately, pending clarification could consume a later referential knowledge request (`Explain that.`) by re-asking / resuming instead of classifying the new utterance first.

## Semantic split preserved

| Class | Examples | Must not become |
| --- | --- | --- |
| Referential continuation | explain it/that, what’s going on with that | proceed, mutation confirm |
| Confirmation / proceed | yes, continue, go ahead, proceed, do it | explanation |
| Clarification answer | named choice, ordinal | generic proceed |
| Mutation confirmation | yes while a valid ECA proposal remains | topic-change follow-up |

## Repair

- Same Show-Risk / explicit-continuity repairs so two named SHOWs create two thread subjects → `Explain that.` clarifies.
- Named NLU ignores deictic lexical hints (`it`/`that`).
- Thread-distinct count (not frame length, not collection presented set).
- Pending block skipped when the utterance is a referential knowledge request.

Repaired result: FINAL:6.3 corpus PASS (unmodified assertions).
