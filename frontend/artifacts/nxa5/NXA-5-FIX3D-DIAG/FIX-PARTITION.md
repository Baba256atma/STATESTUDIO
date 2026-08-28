# Future Fix partition — NXA:5-FIX3D (not implemented)

Do **not** merge with FIX3A/B/C. Those have different first layers (NLU overlay, POST:4 insufficiency, POST:3 empty Goals).

Recommend **four** focused Fixes. Combine only where first layer, owner, surface, and tests overlap.

## NXA:5-FIX3D1 — Manager-facing numeric presentation (percent/score composition)

- **Root cause:** P1:5 `formatEvidenceText` KPI path uses `String(evidence.value)+unit`, bypassing P1:2 `formatDeterministicNumber` already applied to `evidence.summary`.
- **Owner:** P1:5 `dataRealityExecutiveAdvisorResponseComposition.ts`. Optionally extract P1:2 helper to a **single** shared presentation formatter consumed by P1:5 (not a second registry).
- **Permitted:** presentation-only formatting at the manager-facing composition seam; unit-aware policy; non-finite guards in **display**.
- **Forbidden:** changing `kpiComputation` results; rewriting Dataset A `4.2`/`5`; Customer-only hard-codes; blindly `toFixed(2)` or adopting Stage `toFixed(1)` as the only policy; locale/abbreviation unless an existing authority already owns it (none for this path).
- **Focused example:** Customer Satisfaction Index evidence sentence contains `84.00000000000001%`.
- **Expected (illustration, not implemented policy):** floating-point noise removed; integer-looking percent `84%`; `84.05` and `84.5` preserved per user examples; canonical number unchanged.
- **Neighbors:** Stage `84.0%`; P1:2 summary already `84%`; live RDI `50.0%` (different dataset).
- **Tests:** P1:5 composition unit test on Dataset A Customer; formatter inventory cases as unit tests of the shared helper; regression that snapshot KPI value still equals `(4.2/5)*100`.
- **Stop:** IEEE residue gone from P1:5/P2:4 text; canonical KPI unchanged.

## NXA:5-FIX3D2 — Evidence fact language (label, provenance wording, unit token)

- **Root cause:** P1:2 `buildBusinessFactEvidence` interpolates `metricKey`, the phrase `raw fact`, and raw `fact.unit`.
- **Owner:** P1:2 `dataRealityExecutiveObservationResolution.ts`. Reuse CSV/KPI **existing** labels (`Maximum Satisfaction Score`).
- **Permitted:** manager-facing label lookup from existing metadata; provenance wording that still distinguishes fact vs assumption vs prediction.
- **Forbidden:** second label registry; Customer-only map `maximumSatisfactionScore → …`; dropping provenance; camelCase-split as sole authority.
- **Focused example:** `Customer maximumSatisfactionScore raw fact = 5 score.`
- **Expected:** manager label + honest fact provenance without architecture jargon; unit policy TBD with D1 (do not hide that the stored unit is score).
- **Neighbors:** KPI evidence already uses `Customer Satisfaction Index`.
- **Tests:** P1:2/P1:5 Customer and at least one other object’s business-fact evidence (generic, not Customer-only).
- **Stop:** no camelCase keys or `raw fact` in manager-facing Advisor copy; fact/assumption/prediction distinction preserved.

Same Fix **may** include `executive state is attention` because it is the sibling P1:2 template `buildExecutiveStateEvidence` (`summary: … executive state = ${state}`) and P1:5 only swaps `=`/`is`. If that template change is larger than fact-label work, split **FIX3D2b** (executive-state enum copy) rather than stuffing it into D1.

## NXA:5-FIX3D3 — Guidance title (watch/state enum + vague investigate)

- **Root cause:** P1:4 `guidanceTitle` `Investigate ${displayName} ${state} conditions` for non-Production investigate.
- **Owner:** `dataRealityExecutiveAdvisoryResolution.ts`.
- **Permitted:** manager-language title that still names an investigable condition/evidence gap without inventing a cause.
- **Forbidden:** inventing a ranked problem; Production-only special case as the only Customer patch; routing this through NCA:6 as a second composer.
- **Focused example:** `Investigate Customer watch conditions.`
- **Expected:** actionable, non-enum wording; still investigate, not a decision.
- **Tests:** P1:4 Customer watch + one other object watch/critical; Production special case unchanged unless generalized.
- **Stop:** no `watch`/`risk` enum tokens in manager-facing guidance titles.

## NXA:5-FIX3D4 — Response-section redundancy

- **Root cause:** P1:5 concatenates headline, situation, evidence (including state), meaning, and guidance with no dedupe, despite “Conciseness before Narrative”.
- **Owner:** P1:5 `composeDataRealityExecutiveAdvisorResponse` `summaryParts` / overlay consumers.
- **Permitted:** omit restating the same attention fact when a later section adds no new information; keep distinct KPI/fact sentences.
- **Forbidden:** deleting evidence values to shorten; using NXA:5 to rewrite P1:5.
- **Focused example:** four attention restatements in one summary.
- **Tests:** P1:5 standard Customer; brief/minimum modes still valid; no loss of KPI sentence.
- **Stop:** attention stated once unless a section adds new evidence.

## Shared milestone

All of FIX3A, FIX3B, FIX3C, and FIX3D1–D4 should share **one** NXA:5-FIX3 milestone certification (Funnel L4) **after** the focused Fixes, **before** NXA:6. Do not recertify NXA:5/FIX1/FIX2 as a side effect of diagnosis.

## Generic principles (existence)

| Principle | Status | Enforce at |
| --- | --- | --- |
| Canonical numeric truth unchanged | Exists (P0 computation) | Keep at `kpiComputation` |
| IEEE artifacts never in manager text | Missing on P1:5 KPI path; partial P1:2/Stage | D1 |
| Semantic-type-aware formatting | Missing (unit is a string; no precision metadata on Data Reality KPIs) | D1 policy; do not assume 2 decimals |
| Integer-looking omit extra decimals | Partial P1:2; missing P1:5; Stage always `.0` | D1 |
| Meaningful decimals preserved | P1:2 4-decimal cap; Stage 1 decimal; **no** certified percent-scale policy | D1 must define; user examples ≠ Stage |
| Trailing zeros removed | P1:2 yes; Stage no | D1 |
| Distinct % / score / ratio / currency / count / duration / confidence | Missing unified policy; confidence/currency formatters exist **elsewhere** | D1 must not collapse types |
| No NaN/Infinity in copy | KPI computation rejects non-finite; P1:5 `String()` would leak if a value arrived | D1 guard |
| Internal keys not labels | Missing for facts | D2 |
| Architecture terms translated without hiding uncertainty | Partial NCA:6/FINAL:6.4; **bypassed here** | D2/D3 at source templates |
| Sections do not repeat the same state | Declared, not enforced | D4 |
| Generic not Customer-specific | Required | all D Fixes |
