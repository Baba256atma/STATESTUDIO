# Composition evidence

Observed circular composition:

Manager: which one is more important? → criterion asked.  
Manager: risk exposure.  
Nexora: comparable Risk evidence is insufficient, then suggested comparing on **risk exposure** again.

Repair is in existing NXA:5 manager-facing composition (`evaluateNxa5ExecutiveJudgment`), not a new recommendation engine.

When the selected criterion lacks comparable evidence:

- state that;
- name missing evidence when known (e.g. unknown risk exposure on named candidates);
- suggest **other** explicit criteria (`alternativeCriterionSuggestion` excludes the failed criterion).

Test: `nexoraNxa5ExecutiveJudgment.test.ts` — unsupported RISK does not match `/such as risk exposure/`.
OVERALL_SIGNIFICANCE insufficiency may still offer risk exposure because that is a different criterion.
