# NEX-ENT:3 certification report

## Architecture inspected

NEX-ENT:1–2, `/executive`, NEX-EXP:1 catalog/session/center transfer, Stage mount and selection, NEX-MVP interaction, Director via CC:5, Manager–Object click, DTH visual-family resolution, NexoGraph executive objects, Goal/KPI/Problem/Risk/Scenario/Decision/Execution/Outcome discovery overlays (not written), DATA_OBJECT left unused.

## NEX-ENT:1–2 preservation

Introduction, Stage education, focus demo, skip, and `?entrance=1&reset=1` remain. Tests: ENT:1 10/10, ENT:2 7/7.

## Object education authority

`guidedIntroduction.objectEducation` (session UI). Turns go through existing CC:5 with locked presented response.

## Educational actor architecture

Educational Objects are overlay members of `projectNexoraEntranceCatalog`, IDs `obj-nex-ent3-*`. They are not Goal discovery objects, not Issue objects, not Decision records. Overlay relationships are empty (no causal graph). Skip leaves first-time mode and the overlay.

## Stage behavior

Progressive sets: Goal → Goal+KPI → Problem+Risk → Problem+Scenario → Scenario+Decision → Decision+Execution → Execution+Outcome → recap. Existing select/focus applies.

## Advisor behavior

Handoff from Stage education: “Now that you know the Stage…”. Short type explanations and distinctions. Suggested questions reuse ENT:2 `kind`.

## Stage ↔ Advisor continuity

Focus id is the current educational actor. Click ack explains that type and stores `lastReferenceId` for “What is this?” / “Explain this”.

## Object distinctions

Proofs C–H covered Goal/KPI, Problem/Risk, Scenario/Decision, Decision/Execution, Execution/Outcome, and no unsupported causality.

## Decision authority safety

“Can you decide for me?” does not write `decisionExperience`. No CC:10 commitment.

## State safety

Zero canonical Goal/KPI/Problem/Risk/Scenario/Decision/Execution/Outcome/Learning/Data writes from the education path. Live `data-nex-exp2-confirmed=false`, issue/scenario counts 0.

## Refresh / re-entry

Full refresh returns to NEX-ENT:1 intro (`objectEducation` NOT_STARTED). Educational actors do not persist. Skip after refresh restores existing-workspace. Reduced motion still reaches Goal.

## Files created

- `app/lib/nexora-entrance/nexoraObjectEducationExperience.ts`
- `app/lib/nexora-entrance/nexoraObjectEducationExperience.test.ts`
- `scripts/nex-ent3-object-education-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-3/*`
- `.certification/nex-ent3-object-education/`

## Files modified

- `nexoraGuidedEntranceTypes.ts`
- `nexoraGuidedEntranceExperience.ts`
- `nexoraEntranceExperience.ts`
- `nexoraDecisionTheatreVisualFamily.ts` (label type cues for KPI/Problem/Scenario/Decision/Execution/Outcome/Risk, matching existing Goal heuristic)
- `NexoraExecutiveShell.tsx`

## Tests

| Gate | Result |
| --- | --- |
| NEX-ENT:3 | 14/14 |
| NEX-ENT:1–2 | 17/17 |
| nexora-entrance | 163/163 |
| conversational-control | 336/336 |
| Decision Theatre | 172/172 |
| Funnel L1–L4 | pass (7/7); omnibus 1402/1402 |
| TypeScript | pass |
| Production build | pass (L4) |
| Live ENT:3 | all gates true, 0 errors |

## Live proof

Playwright on `localhost:3000/executive?entrance=1&reset=1`: intro → Stage → Object Goal on Stage → deictic Goal → KPI distinction → Problem/Risk → Scenario ≠ Decision → manager owns commitment → Outcome without causality → select educational actor → Show problems not hijacked → refresh without leaking educational actors → skip to normal workspace. Reduced motion still taught Goal.

## Regressions

None in required gates. ESLint: pre-existing `csvImportStoreVersion`; unused `_runtimeState` on skip helper. First L4 typecheck failed on overlay kind arrays (`string[]`); fixed with `as const`; L4 retried and passed.

## Status

**NEX-ENT:3 — CERTIFIED**
