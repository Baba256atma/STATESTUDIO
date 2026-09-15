# Long-session evidence

Isolated **LONG-55** (55 turns, no reset) and live **longSession** (55 turns after CSV import).

Domains crossed: Stage, Problems, typo Capacity Gap, Scenarios, CSV, Capacity Gap explain, Demand Surge, KPI Capacity, Risk, recommendation, preference, Approve, start Execution, mutation interrupt, causality, return to first Problem, Pricing Response, Approve Repricing, Pricing Rollout.

## Composition samples (isolated)

| Turn | Intended | Response subject |
| --- | --- | --- |
| CSV explain it | Data | Unresolved CSV fields |
| Capacity Gap / explain it | Problem | Capacity Gap |
| Demand Surge / tell me more | Scenario | **Capacity Expansion Plan investigation** (S1) |
| go back to first problem / explain it | Problem | Capacity Gap |
| Approve Demand Surge | Decision | Approved; leftover “already committed” overlay (S2) |
| start it | Execution | Execution started (canonical count 1) |
| did the decision cause better delivery | Outcome | Treated as hypothesis, not proof |

Live long session last Problem `explain it` remained Capacity Gap. Pricing Response `explain it` remained that Scenario. Pricing Rollout `explain it` remained Execution.

Turn count: **55** isolated, **55** live.
