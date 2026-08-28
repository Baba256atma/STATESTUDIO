# Authority / reuse map

Inspected before reproduction: root `AGENTS.md`, `.cursor/rules/nexora-debugging-certification.mdc`, NXA:6-PREP diagnosis/funnel/harness/ledger, CC:5 executor, P1:5 composer, NCA:6, NXA:5, MO:2, P1:2 evidence, KPI/unit metadata, RDI/Data Reality, Stage KPI format, Advisor overlay.

| Concept | Existing authority | Used by this report? | Reuse rule for Fix |
| --- | --- | --- | --- |
| Canonical KPI number | `kpiComputation.ts` score-percent / growth-rate | Yes, stored IEEE | **Do not change** |
| Locale-independent number trim | Private P1:2 `formatDeterministicNumber` (`toFixed(4)` + strip trailing zeros) | Yes on `evidence.summary`; **no** on P1:5 KPI sentence | Elevate/reuse; do not add a second KPI math layer |
| Stage KPI display | `formatCanonicalStageKpiValue` `toFixed(1)` | Only when validated dataset stamps catalog | Do **not** adopt as the only policy (`84.05` → `84.1`) |
| Confidence % | `formatConfidencePercent` rounds 0–100 integer | No | Separate semantic type |
| Analytics % | `formatMetricPercent` `Math.round(rate*100)` | No | Drop-off telemetry, not Advisor |
| Domain KPI precision | `domainKpiValidation` precision 0–12 | Not wired to Data Reality demo KPIs | Do not create a second catalog; Data Reality KPI defs have `unit` string only, **no precision field** |
| Display labels | KPI `name`; CSV vertical slice `label` (`Maximum Satisfaction Score`) | KPI name used for KPI evidence; fact metricKey used for facts | Reuse KPI/CSV labels; **no second registry** |
| Architecture leak lists | NCA:6 `ARCHITECTURE_LEAK`; FINAL:6.4 `NEXORA_MANAGER_ARCHITECTURE_LEAK`; MO-INT:1 `sanitizeManagerCopy`; UX:3 `looksTechnical` / `simplifyExecutiveStatement` | **Bypassed** by P1:5→P2:4 overlay. NCA:6 `watch` rewrite is locked-path / strategy, not this overlay | Do not expand NCA:6 as a second composer of P1:5 truth |
| Tautology rewrite | POST:2 `rewriteTautologicalAttentionLanguage` | Does not match this pattern | Insufficient for this dump |
| Section density | P2:4 `presentationDensityFor` (minimum hides summary) | Live minimum hid dump; **report** revealed it | Density is not a language Fix |
| NXA:5 judgment | `nexoraNxa5ExecutiveJudgment` | Does not compose this copy | Out of bounds |
| FIX3A/B/C | NLU overlay / POST:4 / empty Goals | Unrelated | Do not implement in FIX3D |

Trace:

Canonical Customer facts → score-percent KPI → P1:2 evidence (formatted summary **and** raw `value`) → P1:4 guidance title → P1:5 `formatEvidenceText` + `summaryParts.join` → P2:1/P2:2/P2:4 `executiveSummary.summary` → Advisor overlay rationale in report density.

First manager-facing **text** for the IEEE percent: P1:5 KPI branch. First manager-facing **text** for camelCase/`raw fact`/`5 score`: P1:2 business-fact summary (then passed through).
