# APP-9:5 — Confidence Evidence + Reason Link Layer

## Purpose

APP-9:5 is the **read-only explanation-link metadata layer** built on APP-9:1 through APP-9:4.

It links confidence changes to their declared reasons and evidence references using fields already present on confidence records. No semantic reasoning, AI explanation, prediction, recommendation, visualization, dashboard, assistant, persistence, or APP-6/7/8 integration.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-9 |
| Link contract | APP-9/5 |
| Prerequisites | APP-9/1, APP-9/2, APP-9/3, APP-9/4 |
| Status | build (explanation-link metadata) |

## Link types

`reason-link`, `evidence-link`, `movement-link`, `explained-movement`, `unexplained-movement`, `large-change`, `source-link`, `unknown`

## Explanation flags

`has-reason`, `has-evidence`, `reason-without-evidence`, `evidence-without-reason`, `large-change-explained`, `large-change-unexplained`, `movement-supported`, `movement-unsupported`, `source-reason-aligned`, `source-reason-misaligned`

## Scoring rules

| Rule | Value |
| --- | --- |
| Evidence coverage | `recordsWithEvidence / totalRecords` |
| Explained movement | reason exists OR evidence exists |
| Large movement threshold | absolute delta ≥ 0.2 |
| Movement supported | delta exists AND evidence exists |
| Source-reason aligned | static `SOURCE_REASON_ALIGNMENT_MAP` match |
| Confidence bounds | clamped 0–1 |

## Link model

`ConfidenceEvidenceReasonLinkModel` includes workspace isolation, link counts, flags, evidence coverage, reason/source distributions, explained/unexplained/large movement counts, and bounded confidence.

## Public API

- `buildConfidenceEvidenceReasonLinkModel()`
- `buildConfidenceReasonLinks()`
- `buildConfidenceEvidenceLinks()`
- `mapConfidenceMovementsToReasons()`
- `mapConfidenceMovementsToEvidence()`
- `calculateConfidenceEvidenceCoverage()`
- `detectConfidenceExplanationFlags()`
- `validateConfidenceEvidenceReasonLinkModel()`
- `runConfidenceEvidenceReasonCertification()`

## Certification groups (A–W)

Foundation, engine, query layer, trend layer, link layer initialization, empty/single workspace safety, workspace isolation, reason/evidence link determinism, movement mapping, explanation flags, evidence coverage, reason/source distributions, large movement explanation, confidence bounds, read-only enforcement, no dashboard/assistant/visualization/persistence coupling, no APP-6/7/8 integration, prior platforms untouched.

## Next phase

When APP-9:5 passes certification, proceed to **APP-9:6 — Confidence Calibration + Accuracy Layer**.
