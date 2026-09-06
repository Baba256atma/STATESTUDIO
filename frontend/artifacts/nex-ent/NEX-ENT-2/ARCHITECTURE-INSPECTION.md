# NEX-ENT:2 architecture inspection

## Stop condition

`/executive?entrance=1` remains the real Executive workspace. After certified NEX-ENT:1 introduction, **Show me** teaches the role of Stage on the existing Stage, Advisor, Director presentation, and CC:5 conversation path. NEX-ENT:3 Object language, Guided Attention, Data education, and later phases are not started.

## Authorities inspected and reused

- **Certified NEX-ENT:1:** `nexoraGuidedEntranceExperience` overlay, `?entrance=1`, one centered `obj-nexora-entrance`, Advisor intro, suggested answers, skip to existing workspace, refresh as session UI state.
- **Route:** `/executive` (`page.tsx` `entranceRequested`). No second workspace page.
- **NEX-EXP:1:** `NexoraEntranceSession`, restrained catalog, `applyEntranceCenterSubject` / `selectNexoraMVPInteractionSubject`.
- **Stage / Theatre:** existing NEX-MVP Stage mount, `deriveNexoraMVPSceneEnvironmentVisualState`, object list selection, camera. Education uses `environmentIntent: "investigate"` and existing focus/select — not a tutorial Stage.
- **Director:** CC:5 still calls `directNexoraPresentation`. Locked NEX-ENT turns keep the overlay’s `nextRuntimeState` and `shouldCommitRuntime` instead of letting Stage-meta classification discard presentation.
- **Advisor / UX:3:** existing Advisor chat. Stage copy is a CC:5 Nexora message.
- **Conversation / NCA / CC:5:** `executeNexoraConversationalExperience` remains the only execution path. NEX-ENT owns only bounded education utterances; unrelated turns stay on the existing engine.
- **Canonical meaning:** still used for capability/help; Stage questions are bounded classifiers, not a parallel conversation system.
- **Manager–Object:** click uses existing `onSelectSubject` → `selectNexoraMVPInteractionSubject` with the live catalog (so `obj-nexora-entrance` resolves). Advisor acknowledgment reads education session state; it does not invent business Objects.
- **DTH:1–12 / Scene Intent / Scene Script:** not forked. Educational presentation is existing workspace + environment + focus. Guided Attention remains reserved (`implemented: false`).
- **Reduced motion:** existing environment visual `reducedMotion` tokens; focus two-frame rAF is skipped when `prefers-reduced-motion: reduce`.
- **Persistence:** no new durable onboarding store. `guidedIntroduction.stageEducation` is nested session UI state (INTRODUCTION → STAGE_EDUCATION). Full refresh may replay NEX-ENT:1 intro.

## Canonical ownership

1. **What appears on Stage:** NEX-EXP:1 restrained catalog while entrance is first-time; skip restores the default Executive catalog. NEX-ENT:2 does not add a catalog.
2. **How Stage presentation changes:** NEX-MVP interaction state (`environmentIntent`, `selectNexoraMVPInteractionSubject`) committed through CC:5 `shouldCommitRuntime`. Director remains the presentation planner; NEX-ENT does not mutate DOM/CSS for teaching.
3. **How the Advisor describes Stage:** NEX-ENT:2 copy on the existing CC:5 Advisor message path (`lockPresentedResponse`).
4. **How manager Stage interaction is reported:** existing `onSelectSubject` plus `acknowledgeNexoraStageEducationInteraction` (session overlay only).

## What was not created

No second Stage, tutorial canvas, second Director, second Advisor, second conversation engine, second Object/Stage store, tutorial page, onboarding business Objects, or Guided Attention implementation.
