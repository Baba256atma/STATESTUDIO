# NXA:5-FIX3B-DIAG2 — Advisor / DIR / Stage

| Turn | Advisor | DIR | Stage mode | Focus | Members | Queue (live) |
| --- | --- | --- | --- | --- | --- | --- |
| hi | Hi. I’m ready. | NO_CHANGE | overview | none | [] | none |
| show problems | Current Problems: … | SHOW_COLLECTION | collection | none | capacity, margin | Problems · 2 |
| show all executive | Do you mean Margin Pressure or Capacity Gap? | NO_CHANGE | collection | none | same problems | Problems · 2 |
| I am asking of Executions | capacity-pressure copy | NO_CHANGE | collection | none | same problems | Problems · 2 |
| show me execution | I'm not sure which issue… | SHOW_COLLECTION | collection | none | execution-capacity, execution-rollout | **Executions · 2** |

Turn C: **Advisor/Stage divergence**. DIR received SHOW_COLLECTION. Stage presented Executions. Advisor did not. User report that Stage failed is **not** confirmed on the healthy server; Queue header proves Executions.

D1–D3/D7: same pattern when 6.3 COMMITMENT copy wins: Stage collection present, Advisor asks a decision/problem question.

Do not change DIR to compensate for a wrong Advisor route. Repair 6.3/NCA:2 so Advisor follows the collection instruction that DIR already produced.
