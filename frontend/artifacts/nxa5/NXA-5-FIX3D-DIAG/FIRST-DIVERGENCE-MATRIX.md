# First-divergence matrix

| Defect | Verdict | Impact | Canonical source | Actual presentation path | First divergent layer | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `84.00000000000001%` | REPRODUCED | NUMERIC_PRESENTATION_DEFECT | KPI number from `(4.2/5)*100` | P1:5 `formatEvidenceText` KPI branch | `String(evidence.value)` instead of P1:2 `formatDeterministicNumber` already in `evidence.summary` | P1:5 response composition |
| `maximumSatisfactionScore` | REPRODUCED | INTERNAL_LABEL_LEAK | `NexoraBusinessFact.metricKey` | P1:2 `buildBusinessFactEvidence` label/summary | metricKey interpolated; CSV label `Maximum Satisfaction Score` unused | P1:2 observation resolution |
| `raw fact` | REPRODUCED | ARCHITECTURE_LANGUAGE_LEAK | same business-fact template | P1:5 `formatEvidenceText` business-fact → `ensureSentence(summary)` | template string `raw fact =` | P1:2 |
| `executive state is attention` | REPRODUCED | ARCHITECTURE_LANGUAGE_LEAK | P0 `objectState.state` = `attention`; Advisor state = `watch` | P1:2 `buildExecutiveStateEvidence`; P1:5 replaces ` = ` with ` is ` | enum interpolated as copy | P1:2 + P1:5 evidence branch |
| `watch conditions` | REPRODUCED | ARCHITECTURE_LANGUAGE_LEAK | Advisor state `watch` | P1:4 `guidanceTitle(investigate)` | `` Investigate ${displayName} ${state} conditions `` | P1:4 advisory resolution |
| `5 score` | REPRODUCED | UNIT_PRESENTATION_DEFECT | fact.unit `score`, value 5 | P1:2 unitSuffix ` ${fact.unit}` | raw unit token, not manager unit policy | P1:2 |
| Attention repetition | REPRODUCED | RESPONSE_REDUNDANCY | watch headline/situation/meaning + state evidence | P1:5 `summaryParts.join(" ")` and overlay rationale | no section dedupe; four restatements of attention | P1:5 composition |
| `Investigate Customer watch conditions` | REPRODUCED | ADVISORY_QUALITY_GAP | investigate guidance for watch, non-Production | P1:4 title only (P1:5 copies title) | generic template, no evidence gap or object condition | P1:4 |

CC:5 chat for `Continue reviewing Customer` is **EXPECTED_BEHAVIOR** for navigation confirmations (`Focused on` / `Already on`). It is not the first divergence of the dump. The dump is the Advisor report overlay in **report** presentation density.
