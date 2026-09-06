# NEX-ENT-FIX2 — Architecture inspection

Inspection date: 2026-09-05.

## Failing sequence (FIX1 composer)

`Show me` → Stage intro (`CONTINUE_COPY`).  
`Is this a dashboard?` → `DASHBOARD_COPY`.  
Then four `What appears here?` turns:

| # | Meaning | Subject | `appearsDepth` before | Branch | Copy | Depth after |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | APPEARS | APPEARS | NONE | generic `APPEARS_COPY` | concept | INTRODUCTORY |
| 2 | APPEARS | APPEARS | INTRODUCTORY | `APPEARS && depth !== NONE` | examples | DEEPENED |
| 3 | APPEARS | APPEARS | DEEPENED | same branch | **same examples** | DEEPENED |
| 4 | APPEARS | APPEARS | DEEPENED | same branch | **same examples** | DEEPENED |

Stage action: none. Suggested actions stayed `NEXORA_STAGE_EDUCATION_QUESTION_ACTIONS` including “What appears here?”.

## Root cause

FIX1 stopped after one deepening level because `appearsDepth` was capped at `DEEPENED`, and `resolveStageEducationTurn` had **no terminal/progression branch**. Any later equivalent APPEARS turn re-selected `APPEARS_EXAMPLES_COPY`.

This is not lock/NCA overlay, not pending DIR:GA offer, and not lesson auto-advance. It is missing informational saturation on the existing FIX1 depth field.

Capability had the same shape at `PRACTICAL`: `nextCapabilityDepth` never left the last template. Focus Why capped at `DEEPENED`.

## FIX2 reuse

Extend `NexoraEntranceExplanationDepth` with `SATURATED` on the existing `conversationContinuity` object. Advance:

NONE → INTRODUCTORY (ANSWER) → DEEPENED (DEEPEN) → PRACTICAL (PROGRESS) → SATURATED (CLARIFY)

No `repeatCount`, no parallel store, no second NLU.
