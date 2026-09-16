# SYS:1 — Context precedence

Documented as observed. Not redesigned.

## ECA working-context active subject (conceptual order)

1. Explicit current-turn name / ordinal / letter
2. Stage-named when the utterance names a visible Stage member
3. Confirmed conversation subject
4. Thread subject
5. Recent subject
6. Conversational continuity / pronoun follow-up
7. Unique visible Stage member (when not a knowledge follow-up)

Stage focus that is **not** the active subject is recorded as `STAGE_CANDIDATE` (low confidence). It is a candidate, not owner.

## NPS Problem ownership

1. Problem named in the utterance
2. Prior `npsProblemId` when the turn is a problem-solving follow-up
3. Unique canonical Problem among investigation / NLU / active object / associated Problem
4. Conflict if multiple Problem IDs disagree → do not guess

Stage focus id and conversation subject id are **recorded**, not used as substitutes for the active Problem (`npsProblemSolvingPath` unknowns).

## REX Advisor binding (Stage-adjacent, not NPS owner)

`explicit-manager-intent` > `stage-selection` > `stage-focus` > interaction > attention > scene > presentation > runtime-context

## Observed failure at the collection ↔ click seam

After `Show me the problems.`:

- Stage `collectionContext` includes `ctx-problem-capacity` and `ctx-problem-margin`
- Click Capacity Gap: Stage `focusedSubject` = Capacity Gap; collection closed; click session active = Capacity Gap
- Executive snapshot: `currentProblem` = Capacity Gap, but `presentedSetKind` stays `problems` with both members
- `Explain it.`: ECA active subject, MO active object, NPS problem, and Advisor text all become **Margin Pressure**
- Stage focus remains Capacity Gap

Stale collection presentation / deictic resolution outranked the stronger Stage-focused Problem for conversation.

Explicit naming (`Let's work on Capacity Gap`) and NPS follow-ups (`Investigate it`, `What options do we have?`) preserved Capacity Gap, including after `Show me the scenarios` and a Demand Surge click plus `Compare them.`
