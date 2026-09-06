# NEX-ENT:4 architecture inspection

## Stop condition

After certified NEX-ENT:1–3, `/executive?entrance=1` teaches how the manager works with Nexora through the real Advisor, CC:5 conversation path, NCA meaning, and Stage/Director presentation. NEX-ENT:5 Guided Attention, Data, Charts, Variables, and Decision Loop training are not started.

## Canonical answers

1. **Manager meaning** — existing `interpretCanonicalManagerMeaning` / NCA. ENT:4 does not add an onboarding NLU or command parser. Practice phrases such as “Show me the problems” are explicitly not owned by ENT:4.
2. **Dialogue state** — existing conversational-control / Manager–Object conversation session. ENT:4 only stores educational progression in `guidedIntroduction.conversationEducation`.
3. **Clarification** — existing NCA clarification. ENT:4 does not guess “Show me that one.”
4. **Reference continuity** — existing Stage selection + ENT:3 `lastReferenceId` for educational actors; “Explain this” remains on the object-education path. “Why?” is not captured as ENT:1 “why is this” workspace copy.
5. **Stage-aware meaning** — existing focus/selection via `selectNexoraMVPInteractionSubject` / shell `onSelectSubject`.
6. **Advisor response composition** — CC:5 `executeNexoraConversationalExperience` with locked presented response for owned educational turns; unowned turns use the real conversation finish path.
7. **Stage presentation changes** — `projectNexoraEntranceCatalog` overlays. Conversation overlay replaces educational density for the current lesson. Advisor does not mutate Stage DOM/CSS.
8. **Suggested questions/actions** — existing `kind: "question" | "answer"` buttons in `NexoraConversationalExperience`.

## Authorities reused

NEX-ENT:1–3 session overlay, NEX-EXP:1 catalog, CC:5 orchestrator, NCA / NCA-POST meaning and recovery, Manager–Object, NEX-MVP interaction, Director via CC:5, DTH visual family, Why-lane (unowned “Why?”), typo recovery (`recoverBoundedCollectionNouns`), suggested-action renderer.

## Hard boundary

No second conversation engine, tutorial keyword router for SHOW/EXPLAIN practice phrases, second Advisor, second dialogue store, duplicate clarifier/reference/Stage-awareness, second Director/Stage, or new business authority. Guided Attention remains `implemented: false`.
