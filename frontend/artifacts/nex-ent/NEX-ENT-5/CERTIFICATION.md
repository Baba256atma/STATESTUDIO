# NEX-ENT:5 certification report

## Architecture inspected

NEX-ENT:1–4 guided session and catalog overlays; CC:5 `executeNexoraConversationalExperience`; NCA / canonical meaning; `resolveNexoraUiGuidanceIntent`; DIR:GA `NexoraGuidedAttentionPresentation`; UX:3 Advisor (copy only); `NexoraStageDataControl` (Data entry); `ExecutiveStageFrame` (Stage); breadcrumb Back; NEX-MVP focus/selection; DTH atmosphere/priority (not reused for attention); reduced-motion media; Data Rail `data-data-rail-open`.

## NEX-ENT:1–4 preservation

ENT:1 10/10, ENT:2 7/7, ENT:3 14/14, ENT:4 20/20. All `nexora-entrance` 199/199. Conversational-control 336/336. Decision Theatre 172/172. ENT:1–4 still require `NEXORA_GUIDED_ATTENTION_RESERVED.implemented === false` (ENT does not own the reusable capability).

## Guided Attention authority

Reusable capability: `DIR:GA/NexoraGuidedAttentionPresentation` `1.0.0`, `requiresNexEnt: false`. ENT:5 identity `NEX-ENT:5/GuidedAttentionEducation` teaches it (`ownsGuidedAttention: false`). Conversation requests; DIR:GA owns cue state; shell/Stage bind semantic targets.

## Semantic target model

This phase: `DATA_ENTRY` → Data control; `STAGE` → Stage frame; `BACK_CONTROL` → Back when `canStepBack`. Conversation uses target ids only. Presentation binds `data-guided-attention-target` on existing controls.

## Intent flow

Manager utterance → NCA/meaning → `resolveNexoraUiGuidanceIntent` (`LOCATE_UI` | `UI_ACTION` | `NONE`) → `requestNexoraGuidedAttention` with mounted targets → DIR:GA presentation → shell cue. Collection “Show me the problems” is `NONE`. Contextual “Show me” uses `pendingOfferTarget`.

## Advisor boundary

Advisor does not query or mutate the DOM. CC:5 locks copy from `composeNexoraGuidedAttentionCopy` and sets `shouldCommitRuntime: false` for locate turns.

## Attention vs Focus

Cue is temporary presentation. Locate turns do not commit runtime focus. Live: focus preserved while Data received attention.

## Attention vs Selection/Priority/Evidence

DIR:GA flags `equalsFocus/Selection/Priority/Evidence: false`. DTH priority/risk halos are not used. Evidence and selection stores are not written.

## Visual vocabulary

`SOFT_HALO` (restrained accent halo). `EMPHASIS` (static outline under reduced motion). Not DTH risk language.

## Duration / expiry

`NEXORA_GUIDED_ATTENTION_DURATION_MS` = 3000. Deterministic `expiresAtMs`. Shell presentation timer keyed by `requestId`. After expiry, cue is `none` / inactive.

## Replacement / replay

Newest `requestId` replaces the previous cue (no stack). Repeat “How do I add my data?” after expiry issues a new request and restores Data attention.

## Missing target

Unmounted Back → `UNAVAILABLE`, `cue: null`, manager-readable “isn’t available”. No false highlight. Live `missingBackSafe` true at entrance.

## Reduced motion

`prefers-reduced-motion: reduce` → `EMPHASIS` instead of `SOFT_HALO`. Live `reducedMotion` true.

## Accessibility

Existing Data `aria-label` / Advisor `aria-live="polite"` unchanged. Cue is visual and time-bounded; copy carries meaning. Reduced-motion path avoids halo motion.

## Data proof

“How do I add my data?” / contextual “Show me” → `DATA_ENTRY` cue. Live `noAutoOpen` true (`data-data-rail-open` not true). No CSV import.

## Second-target proof

“Where do objects appear?” → `STAGE` with Stage-frame cue. Live `secondTarget` and `replacement` true.

## State safety

Live `noBusinessWrites`: identity insufficient, Goal none/unconfirmed. Educational catalog only. Skip clears attention and returns `existing-workspace`.

## Refresh / re-entry

Full reload after entrance returns ENT:1 / inactive attention, object count 1, no leaked cue. `?entrance=1&reset=1` remains deterministic. Default `/executive` does not start ENT:5.

## Files created

- `app/lib/director/nexoraGuidedAttentionPresentation.ts`
- `app/lib/director/nexoraGuidedAttentionPresentation.test.ts`
- `app/lib/manager-object/nexoraUiGuidanceIntent.ts`
- `app/lib/manager-object/nexoraUiGuidanceIntent.test.ts`
- `app/lib/nexora-entrance/nexoraAttentionEducationExperience.ts`
- `app/lib/nexora-entrance/nexoraAttentionEducationExperience.test.ts`
- `scripts/nex-ent5-guided-attention-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-5/*`
- `.certification/nex-ent5-guided-attention/`

## Files modified

- `nexoraGuidedEntranceTypes.ts` / `nexoraGuidedEntranceExperience.ts` / `nexoraEntranceExperience.ts`
- `nexoraConversationEducationExperience.ts` (does not steal contextual Show me or Data locate)
- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` (CC:5 Guided Attention)
- `NexoraExecutiveShell.tsx` (cues, expiry, `data-nex-ent5-*`)
- `NexoraStageDataControl.tsx`, `ExecutiveStageFrame.tsx`, `NexoraStageInteractionBreadcrumb.tsx`, `Nexora3DExecutiveStage.tsx`, `NexoraStageMount.tsx`
- `NexoraConversationalExperience.tsx` (suggested-action kinds already used by entrance)
- `page.tsx` (`data-nex-ent1-requested`)

## Tests

| Gate | Result |
| --- | --- |
| DIR:GA | 9/9 |
| UI guidance intent | 8/8 |
| NEX-ENT:5 | 16/16 |
| NEX-ENT:1–4 | 51/51 (10+7+14+20) |
| nexora-entrance | 199/199 |
| conversational-control | 336/336 |
| NCA/NXA pack | 343/343 |
| Decision Theatre | 172/172 |
| Funnel L1–L4 | pass (L4 7/7); omnibus 1446/1446 |
| TypeScript | pass |
| Production build | pass (L4) |
| Live ENT:5 | all required gates true, 0 errors |

## Live proof

Playwright against production `/executive` on port 3001 (port 3000 hung on existing PID 12933; not killed). Existing workspace stayed non-entrance. `?entrance=1&reset=1` through ENT:1–4 into attention intro. Contextual “Show me” highlighted Data without opening the rail. Cue expired at 3s, replay restored Data, “Where do objects appear?” moved attention to Stage. Focus preserved. “Show me the problems” was collection. Missing Back was unavailable. Conversation continued. Skip cleared attention. Refresh did not leak. Reduced motion used EMPHASIS. Question vs answer suggestions present. No jargon, no unique-key/hydration warnings.

## Regressions

No known ENT:5 failures. ESLint: 0 errors. Pre-existing warning: `csvImportStoreVersion` exhaustive-deps. Port 3000 `next dev` remains unresponsive (environmental; live gates used 3001).

## Certification

**NEX-ENT:5 — CERTIFIED**

Stop. Do not start NEX-ENT:6 Data & Evidence Education, automatic Data opening, CSV onboarding, Chart education, Decision Loop training, Trust education, Personal Demo, or Variables.
