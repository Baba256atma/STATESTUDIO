# NEX-ENT:4 certification report

## Architecture inspected

NEX-ENT:1–3 guided session and catalog overlays; CC:5 `executeNexoraConversationalExperience`; `interpretCanonicalManagerMeaning`; NCA / NCA-POST recovery and clarification; Manager–Object subjects and click activation; NEX-MVP Stage interaction/focus; Director via CC:5; DTH visual-family labels; suggested-action `kind` in `NexoraConversationalExperience`; ENT:3 educational actors `obj-nex-ent3-*`; Why-lane left unowned for `Why?`; Guided Attention reserved `implemented: false`.

## NEX-ENT:1–3 preservation

ENT:1 10/10, ENT:2 7/7, ENT:3 14/14. All `nexora-entrance` 183/183. Conversational-control 336/336. Decision Theatre 172/172.

## Conversation education authority

Bounded session UI: `guidedIntroduction.conversationEducation` (`NOT_STARTED` → `ASK` → `SHOW` → `EXPLAIN` → `INVESTIGATE` → `COMPARE` → `REVIEW` → `COMPLETED` | `SKIPPED`). Handoff is Object education `REVIEW` + existing continue phrase. Not a durable workflow engine.

## Natural-language authority

NCA / canonical meaning for practice utterances. ENT:4 does not own “Show me the problems”, “Let me see the issues”, “Explain this”, “Why?”, “Show me that one”, or correction phrases. No SHOW(PROBLEM) / `/investigate` teaching.

## Stage-aware conversation

Educational Problem focus plus ENT:3 `acknowledgeNexoraObjectEducationInteraction` / `lastReferenceId`. “Explain this” resolves to the selected educational Problem. “Why?” does not fall back to ENT:1 workspace-location copy.

## Conversation-aware Stage

Catalog overlay changes lesson density (Problem; Problem+Risk; two educational Scenarios). Presentation still goes through `projectNexoraEntranceCatalog` and `selectNexoraMVPInteractionSubject`. Advisor does not write Stage DOM.

## Suggested actions

Existing renderer: dashed `question` vs solid `answer`. Skip remains `answer`. Practice prompts are `question`. Displaying a suggestion writes no authority.

## Clarification

ENT:4 does not guess “Show me that one.” Ambiguity stays on the real conversation path.

## Correction / Why continuity

Correction is not owned as an error. “Why?” is not remapped to “why is this” introduction copy.

## Investigation safety

Owned investigate/cause replies require evidence and do not invent a cause for the educational fixture.

## Comparison safety

Educational compare copy places alternatives together and refuses winner, cost, probability, or risk ranking.

## Decision authority safety

“Which one should I choose?” does not write `decisionExperience` or commitment.

## State safety

Educational path: Goal/Issue/Scenario/Decision/Execution/Outcome/Learning discovery remain null; identity insufficient; live `data-nex-exp2-confirmed=false`, issue/scenario counts 0. Skip does not publish educational actors as business Objects.

## Guided Attention boundary

Not implemented. `NEXORA_GUIDED_ATTENTION_RESERVED.implemented === false`. No Advisor → DOM attention.

## Data / Chart boundary

Data question: high-level “I’ll show you how shortly.” No CSV picker, Data Rail, or semantic clarification. Charts: high-level only; no fabricated chart. Variables not introduced.

## Optional NEXT

“What should I do next?” is not implemented as an ENT-only initiative. Existing NCA:5 remains the initiative authority.

## Refresh / re-entry

Full refresh returns to NEX-ENT:1 (`conversationEducation` NOT_STARTED). No duplicated educational actors. `?entrance=1&reset=1` remains deterministic. Skip from ASK restores `existing-workspace`.

## Files created

- `app/lib/nexora-entrance/nexoraConversationEducationExperience.ts`
- `app/lib/nexora-entrance/nexoraConversationEducationExperience.test.ts`
- `scripts/nex-ent4-guided-conversation-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-4/*`
- `.certification/nex-ent4-guided-conversation/`

## Files modified

- `nexoraGuidedEntranceTypes.ts`
- `nexoraGuidedEntranceExperience.ts`
- `nexoraEntranceExperience.ts`
- `nexoraObjectEducationExperience.ts` (`obj-nex-ent3-scenario-b` presentation actor)
- `NexoraExecutiveShell.tsx` (`data-nex-ent4-*`)

## Tests

| Gate | Result |
| --- | --- |
| NEX-ENT:4 | 20/20 |
| NEX-ENT:1–3 | 31/31 |
| nexora-entrance | 183/183 |
| conversational-control | 336/336 |
| NCA/NXA pack | 348/348 |
| Decision Theatre | 172/172 |
| Funnel L1–L4 | pass (L4 7/7); omnibus 1422/1422 |
| TypeScript | pass |
| Production build | pass (L4) |
| Live ENT:4 | all required gates true, 0 errors |

## Live proof

Playwright on `localhost:3000/executive?entrance=1&reset=1`: intro → Stage → Object language → conversation ASK → suggested “What is this?” → “Show me the problems” without command syntax → select educational Problem → “Explain this” → “Why?” → investigate without fabricated cause → compare without winner → decision pressure without commitment → correction / ambiguity / “I don’t know” / typo / Data high-level / unknown request → recap → refresh without leaked actors → skip to normal `/executive`. Existing workspace remained non-entrance.

## Regressions

No known ENT:4 failures. ESLint: 0 errors. Pre-existing warnings: `csvImportStoreVersion` exhaustive-deps; unused `_runtimeState` on guided skip helper. No unique-key/hydration warnings in live ENT:4.

## Certification

**NEX-ENT:4 — CERTIFIED**

Stop. Do not start NEX-ENT:5 Guided Attention, Data education, CSV/Data Object education, Chart education, Decision Loop training, Trust education, Quick Review, Personal Demo, or Variables.
