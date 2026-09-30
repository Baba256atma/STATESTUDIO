# SIM-TEST:6-FIX14-R1 Level 2 Classification

## Controlled comparison

The comparison removed only the FIX14 `terseDetails` branch from CC:1 `matchFocusOrOpen`, ran the eight exact failing cases, and restored the branch unchanged. All eight failures reproduced with identical assertions before and after FIX14.

| # | Test | Utterance/input | Expected | Actual | FIX14 branch involved | Classification |
|---:|---|---|---|---|---|---|
| 1 | `conversationalExperience` 4–6 | `Go back` after Revenue → Capacity | `applied`, Revenue | `clarification-required` | No; navigation matcher is selected and input cannot match `details?` suffix | B — PRE-EXISTING |
| 2 | `executiveRecommendation` 25 | `Go back` after Revenue → Capacity | `applied`, runtime commit | `clarification-required` | No | B — PRE-EXISTING |
| 3 | `executiveScenarioConversation` 26–27 | `Go back` after Revenue → Capacity | `applied`, runtime commit | `clarification-required` | No | B — PRE-EXISTING |
| 4 | `mvpOut1Fix2ScenarioFollowup` E | `What is Demand Surge Scenario?` | `shouldCommitRuntime=false` | `true` | No; named Scenario inquiry resolves before `matchFocusOrOpen` | B — PRE-EXISTING |
| 5 | `mvpOut1Fix2ScenarioFollowup` Q–W | `What is Demand Surge Scenario?` | no Runtime mutation | `shouldCommitRuntime=true` | No | B — PRE-EXISTING |
| 6 | `mvpOut1Fix4GroundedScenarioImpact` V–Z | `why?` after `what if delivery be too late` | response contains `modeled relationship` | response says scenario model `associates` Delivery with Capacity | No; deictic Scenario follow-up cannot match the new branch | B — PRE-EXISTING |
| 7 | `mvpOut1Fix5ExplainSemanticFidelity` I | `why?` after `explain DEMAND SURGE` | Scenario operation is not `describe` | operation remains `describe` | No | B — PRE-EXISTING |
| 8 | `mvpOut1Fix5ExplainSemanticFidelity` T | `explain DEMAND SURGE` | `shouldCommitRuntime=false` | `true` | No; explicit explain grammar resolves before `matchFocusOrOpen` | B — PRE-EXISTING |

## Causal result

- Pre-FIX14 controlled result: 0 pass / 8 fail.
- Post-FIX14 result: 0 pass / 8 fail.
- Semantic difference in the eight cases: none.
- FIX14 regressions: 0.
- Pre-existing failures: 8.
- FIX14-exposed defects: 0.
- Test expectation errors: 0 proven.
- Uncertain/shared-root classifications: 0.

The failures form three historical debt families: navigation being diverted into clarification; Scenario explanation incorrectly requesting Runtime commit; and Scenario `why?` follow-up semantic/response fidelity. None lies on the required `<named subject> details` path.
