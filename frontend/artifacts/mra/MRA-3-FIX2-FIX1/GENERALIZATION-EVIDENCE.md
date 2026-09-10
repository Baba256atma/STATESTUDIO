# Generalization evidence

| Transition | Follow-up | Result |
| --- | --- | --- |
| Scenario → unique CSV inventory | `explain it.` | CSV / DATA-ADV |
| CSV → named Capacity Gap | `explain it.` | Problem |
| Problem → named Demand Surge | `explain it.` | Scenario |
| Scenario → `look at Capacity` | `explain it.` | Capacity (KPI/object), not Capacity Expansion Plan |
| Unique CSV | `tell me more about it` | CSV |
| Scenario + CSV + HELP | `explain it.` | clarify (no guess) |
| Expand Capacity → Capacity Expansion | `explain it.` | Execution |

Intent is resolved first. Object family does not rewrite EXPLAIN / SHOW / INVESTIGATE / DELETE.

FIX2 regressions still pass: first-problem → explain it; compare → second one; pending `Explain that.`; `look at capcity` suite in `mra3Fix2ReferentialContinuity.runtime.test.ts`.

No filename phrase-patches. Unique bind is from resolved DATA-ADV source ids.
