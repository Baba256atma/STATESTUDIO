# MVP-OUT:1-FIX5 — Root cause

## Observed failure

After `show me delivery` → `Focused on Delivery.`, the manager asked:

`explain DEMAND SURGE`

Nexora answered with recommendation semantics:

> Investigate Demand Surge as a possible contributor — evidence is not strong enough to prioritize action.

The manager asked for a Scenario explanation. The answer began with investigate/recommend.

## Classification

**Semantic routing / composition (A + C), not a missing Scenario engine.**

1. CC:1 matched `explain <name>` as generic **`explain`**, not **`explain-scenario` / describe**. Named Scenario describe required a trailing `scenario` token (`what is DEMAND SURGE SCENARIO`).
2. CC:3 mapped `explain` → `request-explanation`.
3. CC:5 treated `request-explanation` as a recommendation command (`isRecommendationCommandKind`).
4. CC:8 `executiveRecommendationResolver` produced `Investigate ${label} as a possible contributor…`.
5. CC:5 response composition preferred that recommendation summary whenever `intent.kind === "explain"` and a recommendation result existed.
6. Demand Surge *was* resolvable as a Scenario subject (`ctx-scenario-demand`). CC:9 already had a `describe` path. Recommendation outranked it.
7. EXI did not intercept this utterance (`explain demand surge` is not `explain \w+`). Stage Delivery did not beat the explicit named hint.

## Exact loss point

USER INTENT (`explain`) → CANONICAL SUBJECT (Scenario) → **generic executive recommendation**

instead of:

USER INTENT → CANONICAL SUBJECT (Scenario) → CC:9 describe projection → ANSWER

## Correction (generic, no Demand Surge/Delivery hardcoding)

After CC:2 subject resolution, if the utterance is a definition inquiry (`explain` / `what is` / `describe` / `tell me about`) and the primary subject kind is `scenario`, remap to `explain-scenario` + `operation: describe`.

CC:9 `describe` now projects a `NexoraScenarioExplanationProjection` from existing presentation fixtures: identity, represented change, canonical related subjects, projection-vs-Reality, withheld causal proof. Recommendation is not composed unless recommend intent is explicit.

Unevaluated follow-ups (`what could be affected?`, `what risks?`, `why?`, `how sure are you?`) reuse the same canonical Scenario fields instead of requiring an intervention evaluation that the manager never asked for.

Recommend / prioritize / trade-off / what-happened / What-If paths remain distinct intents.
