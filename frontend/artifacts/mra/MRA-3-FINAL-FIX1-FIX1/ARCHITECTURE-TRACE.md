# Architecture trace

Failing live turn (after Stage click → `look at Capacity Gap`):

1. Manager utterance: `explain it`
2. Intent: `explain` (deictic, no named primary hint from CC:1)
3. Explicit/named reference: none
4. Canonical referent / FINAL:6.2 continuity: Capacity Gap (`problem`, `ctx-problem-capacity`)
5. Stage focus: Capacity Gap
6. Collection context: leftover Scenario collection (historical)
7. ECA/NCA/NXA reasoning subject at CC:7: Capacity Gap
8. Scenario assessment candidate: Capacity Expansion Plan, introduced as if it were an **explicit** CC:2 target
9. Problem explanation candidate: Capacity Gap (MO:1 / explain engine)
10. Response selection: Scenario `describe` / assessment text won
11. Final composer: `buildNexoraConversationalExperienceResponse` preferred `scenarioResult.summary`
12. Manager-facing answer: Capacity Expansion Plan

First divergence: `applyContextualMeaningToIntent` stamped a pronoun-resolved **recent/collection** Scenario (`CONTEXT_RECENT_SUBJECT`) as a CC:1-style primary hint. CC:2 then treated Capacity Expansion Plan as `explicit-user-target-beats-automatic-context`. `applyScenarioExplanationFidelity` converted `explain` → `explain-scenario` (`describe`).

A second, related steal remains gated: `hasActiveScenarioAssessment` remapping deictic `explain` → `explain-scenario` (`impact-why`) when an evaluation exists. That path is now blocked when the resolved conversational subject is a non-scenario and the turn is deictic explain.

Not a new Object, Stage, or referent store. Conversation still consumes CC:7, FINAL:6.2, and CC:9.
