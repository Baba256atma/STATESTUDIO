# NEX-ENT-FIX1 — Entrance Conversation Continuity — CERTIFICATION

**Status: NEX-ENT-FIX1 — CERTIFIED**

**STOP.** Do not start NEX-ENT:11, NEX-ENT:E2E, RAG, LLM memory, a second Advisor, or a Personal Demo redesign.

Date: 2026-09-05.

## Root cause

The certified entrance composer mapped phrase → fixed template. Capability always returned the same paragraph. `Explain first` always used pre-demonstration copy (“I can show you that now”) even after Stage Focus had been presented. Suggested actions kept offering Show/Explain as if nothing happened. Locked educational copy could still lose “Of course” via FINAL:6.4 filler polish, and “how can you help” could be overwritten by NXA `LEARN_NEXORA` without checking the response lock.

This is continuity/integration, not a second conversation engine.

## Architecture inspected

Exact modules: `nexoraGuidedEntranceExperience.ts`, `nexoraGuidedEntranceTypes.ts`, `nexoraEntranceConversationContinuity.ts`, `nexoraObjectEducationExperience.ts`, `nexoraEntranceExperience.ts` freeze, CC:5 `conversationalExperienceOrchestrator.ts`, NCA `canonicalManagerMeaningInterpreter.ts`, FINAL:6.4 `nexoraMvpFinal64TrustedCommunication.ts`, Stage `selectNexoraMVPInteractionSubject`.

See `ARCHITECTURE-INSPECTION.md`.

## Fix architecture

Educational response is composed from:

canonical manager meaning (NCA)
+ current ENT lesson / `guidedIntroduction` pacing
+ bounded `conversationContinuity` (subject, lastAction, lastResult, capability/focus/appears depth)
+ Stage presentation result (`focusDemonstrated` / PRESENTED)
+ pending offer remains DIR:GA’s, not a new ENT store

Depth is INTRODUCTORY → DEEPENED → PRACTICAL per subject, not `repeatCount → cannedAnswer`.

## Architecture audit

| Question | Answer |
| --- | --- |
| Second conversation engine? | NO |
| Second NLU? | NO (NCA cues only: `what do you do`, `how can you help`) |
| Transcript/memory database? | NO |
| Duplicate lesson store? | NO (`conversationContinuity` on existing `guidedIntroduction`) |
| Stage authority? | NO (Director/Stage still present) |
| Business writers? | NO |
| NCA owns meaning? | YES |
| `guidedIntroduction` pacing only? | YES |
| Director/Stage own presentation? | YES |

## Repetition behavior

First `What can Nexora do?` → high-level capability. Immediate repeat → practical Goals/data/Problems/… paragraph. `What do you do?` is NCA `ASK_CAPABILITY`. `Show me` then enters Stage, not another capability paragraph.

## Show → Explain / Explain → Show / repeated Show

Live on `next start` **:3007** after production rebuild:

- Show Focus → demonstration copy; `focusDemonstrated`.
- Explain first → explains Focus; **not** “I can show you that now”.
- Show again → “I’ll show it again”; one NEXORA entrance actor.
- Explain first → refers to demonstrated Stage organization.

Explain then Show (unit): demonstration proceeds without resetting the lesson.

## Deictic continuity

`Why?` / second `Why?` deepen Focus rationale. `Explain it` stays on Focus. `Do it again` repeats the Focus demonstration. After Object education starts, Focus depth is cleared so it does not hijack ENT:3.

## Pending-offer / lock

Educational Show/Explain no longer depend on a stale pre-demo offer. Locked CC:5 responses skip FINAL:6.4 filler polish. NXA `LEARN_NEXORA` overlay requires `!lockPresentedResponse`.

## Stage integrity

Repeat Focus demonstration reuses `obj-nexora-entrance`. Actor count remains 1. No duplicate relations.

## Business writer audit

Normal FIX1 path: identity INSUFFICIENT, Goal/Issue/Scenario/Decision/Execution/Outcome/Learning discovery null.

## ENT:1–10 preservation

`npx tsx --test app/lib/nexora-entrance/*.test.ts` — **287/287**.

ENT:10 unit pack remains in that run. After handoff COMPLETED, `shouldNexoraGuidedEntranceOwnUtterance` is false.

## Default `/executive`

Existing-workspace session: guided state INACTIVE; entrance continuity composer does not own `What can Nexora do?`. Live existing workspace: `entState === INACTIVE`.

## Live sequence (production `:3007`)

See `frontend/.certification/nex-ent-fix1-conversation-continuity/live-browser.json`.

Capability paragraphs differ. Show me → Stage. Appears → relevant things. Focus show → demonstrated. Explain → concept. Repeat show → again. Second explain → demonstrated-state copy. Then Why / Explain it / Do it again. Next lesson → educational Goal. Skip introduction preserved. Refresh did not duplicate actors. Product runtime errors: **0** (hydration #418, if present, remains environmental and was filtered as in ENT:10).

## Tests

FIX1 focused: **13/13** (`nexoraEntranceConversationContinuity.test.ts`).

Also: Director visual + GA + NCA 6.1 + NXA:1 **43/43**; conversational-control + FINAL:6.2 + FINAL:6.5 **365/365**.

TypeScript: pass. Production build: pass.

## Live server

`npx next start -p 3007` (this task). Did not kill `:3000` (node 1925) or `:3006` (prior ENT:10 server). Proof used **current production build** on **3007**, not stale 3006.

## Files created

- `frontend/app/lib/nexora-entrance/nexoraEntranceConversationContinuity.ts`
- `frontend/app/lib/nexora-entrance/nexoraEntranceConversationContinuity.test.ts`
- `frontend/scripts/nex-ent-fix1-conversation-continuity-certify.mjs`
- `frontend/artifacts/nex-ent/NEX-ENT-FIX1/ARCHITECTURE-INSPECTION.md`
- `frontend/artifacts/nex-ent/NEX-ENT-FIX1/CERTIFICATION.md`
- `frontend/.certification/nex-ent-fix1-conversation-continuity/live-browser.json` (+ screenshots)

## Files modified

- `nexoraGuidedEntranceExperience.ts` / `nexoraGuidedEntranceTypes.ts`
- `nexoraObjectEducationExperience.ts`
- `nexoraEntranceExperience.ts` (freeze `conversationContinuity`)
- `canonicalManagerMeaningInterpreter.ts` (capability paraphrases)
- `nexoraMvpFinal64TrustedCommunication.ts` (locked copy preserved)
- `conversationalExperienceOrchestrator.ts` (LEARN_NEXORA respects lock)

## Regressions

None known on the FIX1 path. Pre-existing production React hydration #418 remains environmental if it appears in console; live product `runtimeErrors` count for this run: **0**.

## Stop

NEX-ENT-FIX1 is complete. Do not start NEX-ENT:11.
