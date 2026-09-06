# NEX-ENT:1 certification report

## Architecture inspected

Inspected `/executive` and `?entrance=1`, NEX-EXP:1 entrance session/catalog/center transfer, Stage/Director/Theatre presentation, UX:3 Advisor, CC:5 conversation orchestrator, NCA/canonical meaning, BCA and DATA-UX/DATA-ADV boundaries, Decision Theatre DTH surfaces, branding/label presentation, and existing sessionStorage identity persistence. NEX-ENT:1 is a guided overlay on that stack.

## Existing authorities reused

- Route and query: `page.tsx` `entranceRequested`
- Session: `NexoraEntranceSession` + restrained catalog
- Stage: `projectNexoraEntranceCatalog`, `applyEntranceCenterSubject`, NEX-MVP Stage
- Conversation: `executeNexoraConversationalExperience`
- Advisor chat: `NexoraConversationalExperience`
- Skip restore: `createInitialNexoraMVPObjectInteractionState`

## Files created

- `app/lib/nexora-entrance/nexoraGuidedEntranceTypes.ts`
- `app/lib/nexora-entrance/nexoraGuidedEntranceExperience.ts`
- `app/lib/nexora-entrance/nexoraGuidedEntranceExperience.test.ts`
- `scripts/nex-ent1-entrance-introduction-certify.mjs`
- `artifacts/nex-ent/NEX-ENT-1/ARCHITECTURE-INSPECTION.md`
- `artifacts/nex-ent/NEX-ENT-1/ENTRANCE-CONTRACT.md`
- `artifacts/nex-ent/NEX-ENT-1/TEST-EVIDENCE.md`
- `artifacts/nex-ent/NEX-ENT-1/CERTIFICATION.md`

## Files modified

- `app/lib/nexora-entrance/nexoraEntranceTypes.ts`
- `app/lib/nexora-entrance/nexoraEntranceExperience.ts`
- `app/lib/conversational-control/conversationalExperience.ts`
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`
- `app/executive/page.tsx`
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx`
- `app/executive/nex-mvp/NexoraConversationalExperience.tsx`

Certification diagnostics under `frontend/.certification/` were refreshed by funnel and live proof.

## Entrance authority

Explicit `/executive?entrance=1` with first-time resolution calls `withActiveNexoraGuidedEntrance`. The shell seeds one Advisor introduction once. Normal `/executive` stays `existing-workspace` / `INACTIVE`.

## Stage behavior

While guided introduction is active, the existing entrance catalog remains a single centered `obj-nexora-entrance` labeled `NEXORA`. Director/Stage still present it. No fabricated business Objects. Skip leaves the restrained catalog and restores default interaction state.

## Advisor behavior

Introduction is a CC:5 Nexora message on the existing Advisor chat, not a second chatbot. Suggested actions submit as manager utterances. Capability/what/why/skip/continue are owned by NEX-ENT:1; other turns still reach the existing conversation engine. Identity interrogation is not the first experience.

## State safety

Introduction, Show me, and Skip do not write Goal, Decision, Execution, Outcome, or sufficient identity. `writeStoredEntranceIdentity` still requires sufficient identity, which introduction never produces.

## Refresh / re-entry

Live: refresh during entrance kept one Stage actor. Skip restored the existing workspace. Re-entry with `?entrance=1&reset=1` showed introduction again. Full refresh may replay the introduction because this phase does not add durable onboarding storage.

## Test results

- Focused NEX-ENT + NEX-EXP:1: 32/32
- All `nexora-entrance` tests: 142/142
- Conversational-control: 336/336
- Funnel L1–L3: pass
- Funnel L4: 7/7 required; omnibus 1381/1381
- TypeScript: pass
- ESLint on changed files: 0 errors
- Live NEX-ENT:1 Playwright: all required gates true, 0 page errors
- Live `/executive` smoke (L4): ok

## Live proof

Playwright on a running `localhost:3000` observed calm single-object Stage, NEXORA presence, Advisor welcome, suggested actions, natural capability reply, safe skip, refresh without duplicate actors, and unaffected default `/executive`.

## Regressions

None observed in the gates above. NEX-EXP:1 **unit** identity behavior is unchanged when guided introduction is inactive. The live NEX-EXP:1 “Hi” identity intro is superseded on `?entrance=1` by NEX-ENT:1’s Nexora introduction; identity discovery is not deleted.

## Remaining limitations

Guided Attention and Stage education are reserved, not implemented. Introduction copy is deterministic, not LLM-composed. Suggested actions are a bounded foundation, not a full suggested-answer platform.

NEX-ENT:2 was not started.

NEX-ENT:1 — CERTIFIED
