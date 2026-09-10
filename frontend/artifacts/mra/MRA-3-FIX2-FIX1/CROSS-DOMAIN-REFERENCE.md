# Cross-domain reference

Existing FINAL:6.2 continuity remains the only conversation-referent authority. DATA-ADV remains the only Data-source dialogue authority.

## Distinctions preserved

| Concern | Owner |
| --- | --- |
| Stage focus | Stage / director runtime |
| Collection context | NCA-POST collection (`lastCollection`) |
| Current conversational referent | FINAL:6.2 `activeSubjectId` / `activeSubjectKind` |
| Data source referent | DATA-ADV `advisorDataDialogue.sourceContextId`, mirrored onto 6.2 as kind `data` when Nexora introduces a canonical source |
| Pending mutation / clarification | ECA / FINAL:6.3 |

A domain switch may establish a new conversational referent. Historical collection members stay on the thread but must not outrank a newer valid referent.

## Recency

- Unique CSV/Data introduction → `applyAssistantIntroducedReferent` (`subjectKind: "data"`).
- Explicit named catalog object (Problem, Scenario, KPI/Capacity, Decision, Execution) → 6.2 explicit current turn; Data dialogue unique bind is released.
- Pronoun after a data referent keeps the data id so lastCollection cannot steal it.
- After HELP/park with mixed Scenario + Data on the thread, isolated `it` is unresolved (no guess).

## Tests

See `app/lib/nexora-conversation/mra3Fix2Fix1CrossDomain.runtime.test.ts` Tests A–F plus Decision → Execution.
