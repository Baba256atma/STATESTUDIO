# Cross-surface presentation comparison

Authoritative Customer KPI (Dataset A): `(4.2 / 5) * 100` stored as IEEE number `84.00000000000001`, unit `%`. Canonical value is unchanged on every surface.

| Surface | Path | Manager-facing Customer KPI | Label / language |
| --- | --- | --- | --- |
| Canonical snapshot | `kpiComputation` score-percent | number `84.00000000000001` | `kpi.customer.satisfaction-index` |
| P1:2 evidence.summary | `formatDeterministicNumber` + kpiName | `Customer Satisfaction Index = 84%` | manager KPI name |
| P1:5 Advisor report (standard) | `formatEvidenceText` `String(value)+unit` | `Customer Satisfaction Index is 84.00000000000001%` | plus `maximumSatisfactionScore raw fact` |
| P2:4 Advisor overlay rationale (report density) | `binding.summary.summary` = P1:5 summary | same dump as P1:5 | same leaks |
| CC:5 chat | `executeNexoraConversationalExperience` | `Focused on Customer.` / live `Already on Customer.` | no IEEE, no raw fact |
| MO:2 explain | GenericExplainEngine | live: attention tautology + Delivery relationship; no 84% | no camelCase field |
| Stage catalog stamp | `formatCanonicalStageKpiValue` only if validated `dataset` passed | `84.0%` (toFixed(1)) | object label, not metricKey |
| Subject report KPI card | presentation fixture / aligned live KPI | Customer has **no** fixture KPI; live session had no validated demo dataset so card did not show 84% | n/a |
| Live RDI monitoring panel (this environment) | proactive/live connector, **different facts** | `Customer Satisfaction Index is 50.0%` | formatted to 1 decimal; CRITICAL copy. Neighboring surface, not the P1:5 Dataset A path |

Conclusion: the IEEE percent is **not** the stored-display canonical on every surface. P1:2 already formats `84%`. The leak is P1:5 KPI interpolation plus P2:4 overlay of that summary. Stage’s `toFixed(1)` is a second, incompatible presentation policy (`84.05` → `84.1`).
