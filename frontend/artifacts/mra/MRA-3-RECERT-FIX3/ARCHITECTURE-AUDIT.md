# FIX3 architecture audit

## Current subject authorities

- Canonical manager meaning and `resolveContextualManagerMeaning` resolve explicit/deictic references.
- FINAL:6.2 `conversationContinuity` owns the session-scoped active, previous, and investigation subject.
- CC runtime state owns deliberate Stage focus/collection presentation.
- Manager–Object session consumes those authorities for the active Object and investigation context.
- `SubjectCompositionFidelity` is an existing read-only compatibility decision; it owns no subject store.

## Candidate sources

Primary candidates currently enter from explicit current-turn references, active continuity, Stage focus, active collection, active comparison, attention/recommendation paths, Scenario assessment, and prior Manager–Object investigation state.

The 103-turn failures show the correct referent often survives through continuity and NXA while an older collection/comparison candidate remains primary-eligible downstream.

## First stale-state entry points

1. `interpretExecutiveComparisonMeaning` treats any utterance containing `investigat*` as a comparison follow-up whenever an active collection/comparison exists. It does not distinguish `investigate it` or named single-subject investigation from `which one should I investigate?`.
2. When comparison meaning is active, the orchestrator preserves the previous executive context and Stage, resolves candidates from the stored collection, and lets `ncaPost4Comparison.response` replace final presentation even when targeted-investigation presentation is locked.
3. `nextNcaState.activeComparison` is retained after explicit single-subject focus, so later knowledge turns can re-enter comparison-primary mode.
4. The existing composition guard treats Scenario analytical follow-ups as compatible before considering that the resolved current owner may be a non-Scenario Object.

## Existing guards to extend

- Canonical `isTargetedDeicticInvestigationUtterance` and `isInvestigationSelectionUtterance` already distinguish targeted investigation from selection.
- `explicitSingularFocus` already identifies deliberate one-Object Stage handoff.
- `SubjectCompositionFidelity` already distinguishes resolved and candidate composition subjects.
- `lockPresentedResponse` already protects targeted investigation from most later advisory overlays.

## Planned extension

- Extend the existing NCA-POST:4 comparison classifier so targeted deictic and named single-subject investigation exit comparison-primary behavior while explicit investigation-selection remains eligible.
- Clear the existing `activeComparison` primary mode on a valid explicit single-subject focus; retain collection/history as supporting context.
- Extend the existing composition compatibility rule so a stale Scenario candidate cannot own analytical follow-up composition when a different non-Scenario subject is the valid current owner.
- Add focused and long-session regression evidence around the existing runtime.

No second resolver, continuity store, subject store, collection registry, comparison store, Stage authority, recommendation authority, Decision store, Execution store, writer, or composition system will be created.

