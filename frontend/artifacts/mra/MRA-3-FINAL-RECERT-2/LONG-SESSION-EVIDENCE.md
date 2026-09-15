# Long-session evidence

Live `/executive` journey `longSession`: **57** manager turns, one session, no reset.

Isolated `LONG-55`: **57** turns (`runtime-turns.json`). Combined isolated journeys: **172** turns.

## Coverage (live long session)

Stage, Problems, typo `capcity` (resolved to Capacity Gap in this path), CSV inventory, Capacity Gap, Demand Surge, `tell me more`, `look deeper` (Demand Surge on this path), KPI Capacity, Risk, corrections (`no I meant Capacity Gap`, `That's not what I meant`, `Forget that request`, `Go back to the problem`), compare / importance, preference vs Approve, Start Execution, stale mutation `yes`, delete refusal, causal question, return to first problem, Pricing Response / Approve Repricing / Pricing Rollout, Stage again.

## Subject fidelity samples (live)

| Intended | Resolved / reply |
| --- | --- |
| look at capcity | Capacity Gap |
| explain it (CSV after inventory) | pending CSV, unresolved fields |
| Demand Surge → tell me more | Demand Surge |
| look deeper into it | Demand Surge |
| I prefer Demand Surge | preference only |
| Approve Demand Surge | approved Demand Surge; leftover “Capacity Gap is already the committed Decision” |
| start it | Execution started |
| yes after topic change | no mutation write |
| tell me more after return to first problem | Demand Surge investigation overlay (related Scenario, not Expansion Plan steal) |

## Isolated long session

57 turns; 0 architecture leaks. Historical Expansion Plan steal on Demand Surge `tell me more` did not appear.

The live S1 (`investigate it` → Margin Pressure) was reproduced on a **dedicated clean deictic journey**, not on every long-session INVESTIGATE-like turn.
