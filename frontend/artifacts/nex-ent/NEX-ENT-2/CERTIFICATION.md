# NEX-ENT:2 certification report

## Architecture inspected

Inspected certified NEX-ENT:1, `/executive`, NEX-EXP:1 entrance session/catalog/center transfer, Stage mount and object selection, Director presentation in CC:5, DTH surfaces (scene/atmosphere/investigation remain readers), UX:3 Advisor, CC:5 / NCA conversation, suggested actions, reduced-motion environment tokens, and entrance refresh/re-entry. NEX-ENT:2 extends the NEX-ENT:1 overlay; it does not replace Executive.

## NEX-ENT:1 preservation

NEX-ENT:1 identity, route, restrained NEXORA catalog, Advisor introduction, suggested answers, skip, and `?entrance=1&reset=1` re-entry remain. **Show me** now continues into Stage education instead of ending the guided overlay with only continue copy. NEX-ENT:1 tests 10/10.

## Stage education authority

Education state lives on `NexoraEntranceSession.guidedIntroduction.stageEducation` (session UI, not business truth). Presentation is existing NEX-MVP interaction state committed through CC:5 when `shouldCommitRuntime` is true. Locked NEX-ENT turns keep that commit so Stage-meta classification cannot discard investigate/focus.

## Stage behavior

After **Show me**, Stage stays the real entrance Stage (one `obj-nexora-entrance`). Atmosphere uses existing `environmentIntent: "investigate"`. Focus demo resets to overview then `selectNexoraMVPInteractionSubject` on that same object. Reduced motion skips the two-frame rAF; meaning still holds via copy and focused state.

## Advisor behavior

Advisor introduces Stage in manager language on the existing chat. Questions (Stage, dashboard, what appears, click/move/control/return) stay bounded. Unrelated utterances are not owned. After manager select, Advisor can acknowledge focus without impersonating the manager.

## Interaction

Focus is existing Stage select/focus, not an onboarding-only focus engine. Click acknowledgment uses `onSelectSubject` plus overlay session flags (`focusDemonstrated`, `managerInteracted`).

## Conversation actions

`kind: "answer"` vs `kind: "question"` on the existing suggested-action buttons. Questions use a dashed outline; answers stay solid. No parallel action system.

## State safety

No Goal, KPI, Problem, Risk, Opportunity, Scenario, Decision, Execution, Outcome, Learning, Data Object, or causal relationship is created. Identity remains insufficient. Educational focus is presentation only.

## Refresh / re-entry

Full refresh of `?entrance=1` may replay NEX-ENT:1 introduction (no durable onboarding store). Live: one Stage actor after refresh; skip remains safe; `?entrance=1&reset=1` re-enters introduction. Nested `stageEducation` is not persisted across full reload.

## Files created

- `app/lib/nexora-entrance/nexoraGuidedEntranceTypes.ts` (shared with NEX-ENT:1; includes Stage education contracts)
- `app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts`
- `app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts`
- `scripts/nex-ent2-stage-education-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-2/ARCHITECTURE-INSPECTION.md`
- `artifacts/nex-ent/NEX-ENT-2/STAGE-EDUCATION-CONTRACT.md`
- `artifacts/nex-ent/NEX-ENT-2/TEST-EVIDENCE.md`
- `artifacts/nex-ent/NEX-ENT-2/CERTIFICATION.md`
- Live diagnostics under `frontend/.certification/nex-ent2-stage-education/`

## Files modified

- `app/lib/nexora-entrance/nexoraEntranceExperience.ts` (freeze nested `stageEducation`)
- `app/lib/nexora-entrance/nexoraEntranceTypes.ts` (guided session field; NEX-ENT:1)
- `app/lib/conversational-control/conversationalExperience.ts` (`suggestedActions.kind`)
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts` (catalog on guided turn; preserve locked runtime commit/state)
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx` (catalog on select, education cues, click ack)
- `app/executive/nex-mvp/NexoraConversationalExperience.tsx` (`data-suggestion-kind` presentation)
- `app/executive/page.tsx` (NEX-ENT:1 entrance query; unchanged purpose)

## Tests

| Gate | Result |
| --- | --- |
| NEX-ENT:1 focused | 10/10 pass |
| NEX-ENT:2 focused | 7/7 pass |
| NEX-EXP:1 identity | 22/22 pass |
| All nexora-entrance | 149/149 pass |
| conversational-control | 336/336 pass |
| Shell + page | 43/43 pass |
| Decision Theatre | 172/172 pass |
| Funnel L1–L3 | pass |
| Funnel L4 omnibus | 1388/1388 pass |
| TypeScript | pass |
| Production build | pass (after lock retry) |
| L4 live smoke | pass |
| ENT:2 live Playwright | all required gates true |

## Live proof

Playwright on running `localhost:3000` observed NEX-ENT:1 intro, **Show me** Stage education with investigate atmosphere, natural Stage/dashboard/appears answers, unused-hijack **Show problems**, existing focus on NEXORA, Advisor acknowledgment after object-list select, safe skip, refresh without duplicate actors, reduced-motion comprehension, and unaffected `/executive`.

## Regressions

None in the gates above. ESLint: pre-existing `csvImportStoreVersion` exhaustive-deps warning. Build: pre-existing `baseline-browser-mapping` npm warning. First L4 `l4-build` hit an in-use `.next/lock`; classified environmental, retried, passed.

## Remaining limitations

NEX-ENT:3 Object language is not implemented. Guided Attention remains reserved. Full refresh does not resume mid-Stage-education; that is intentional without a durable onboarding store.

## Status

**NEX-ENT:2 — CERTIFIED**
