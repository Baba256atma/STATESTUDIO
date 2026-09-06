# NEX-ENT:1 architecture inspection

## Stop condition

`/executive?entrance=1` opens the existing Executive environment with a calm, minimal Stage (NEXORA presence only), the existing Advisor introduces Nexora in manager language, the manager can continue, ask, or skip, and none of that becomes business truth. NEX-ENT:2 and later phases are not started.

## Authorities inspected and reused

- **Route:** `/executive` in `frontend/app/executive/page.tsx`. Trigger remains `?entrance=1` (`entrance=true` / `first-time` already accepted). Default `/executive` stays existing-workspace.
- **NEX-EXP:1 entrance session:** `NexoraEntranceSession`, `createNexoraEntranceSession`, catalog projection, center transfer via `selectNexoraMVPInteractionSubject`. NEX-ENT:1 adds `guidedIntroduction` overlay state only.
- **Stage / Theatre:** existing restrained catalog (`projectNexoraEntranceCatalog` + `stabilizeEntranceCatalog`) and NEX-MVP Stage/Director presentation. No second Stage.
- **Advisor:** UX:3 `NexoraAdvisorInsightRegion` / `NexoraAdvisorView` unchanged as intelligence presenter. Introduction is a CC:5 conversational message on the existing Advisor chat.
- **Conversation:** `executeNexoraConversationalExperience` remains the only execution path. NEX-ENT is checked before NEX-EXP identity ownership; it does not replace NCA/CC.
- **Canonical meaning:** `interpretCanonicalManagerMeaning` for capability/help. Suggested actions submit as explicit manager utterances.
- **Director / DTH:** existing Stage object presentation, camera, topology. Guided Attention is reserved (`NEXORA_GUIDED_ATTENTION_RESERVED.implemented === false`).
- **BCA / DATA-UX / DATA-ADV:** not written. Entrance catalog remains presentation-only; skip restores the existing workspace catalog including Data Reality consumers.
- **Persistence:** no new durable onboarding store. Identity sessionStorage (`nexora.entrance.identity.session.v1`) is unchanged and is not written by introduction or skip (identity remains insufficient).

## Ownership

NEX-ENT:1 owns only guided introduction presentation: READY → AWAITING_MANAGER → COMPLETED | SKIPPED.

It does not own Stage runtime, Advisor intelligence, Director, NCA, Objects, Goals, Data Reality, Decision, Execution, Outcome, or Learning.

## What was not created

No second `/executive`, tutorial page, Stage, Advisor, Director, conversation engine, Object store, Data Reality, executive journey, or Decision/Execution/Outcome/Learning authority.
