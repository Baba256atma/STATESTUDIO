# APP-9:6 — Confidence Calibration + Accuracy Layer

## Purpose

APP-9:6 is the **read-only confidence reliability metadata layer** built on APP-9:1 through APP-9:5.

It evaluates whether confidence appears calibrated against observed evidence and reason metadata already present in APP-9 records. No truth judgment, prediction, recommendation, AI reasoning, visualization, dashboard, assistant, persistence, or APP-6/7/8 integration.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-9 |
| Calibration contract | APP-9/6 |
| Prerequisites | APP-9/1, APP-9/2, APP-9/3, APP-9/4, APP-9/5 |
| Status | build (reliability metadata) |

## Calibration statuses

`calibrated`, `overconfident`, `underconfident`, `weakly_supported`, `unsupported`, `unknown`

## Accuracy levels

`unknown`, `low`, `medium`, `high`, `very_high`

## Calibration flags

`high-confidence-low-evidence`, `low-confidence-high-evidence`, `confidence-reason-misaligned`, `confidence-source-misaligned`, `stable-calibrated`, `volatile-uncalibrated`, `unsupported-confidence`, `evidence-supported-confidence`, `calibration-unknown`

## Scoring rules

| Rule | Value |
| --- | --- |
| Evidence support score | 0.75–1.0 with evidence refs; 0.35 reason-only; 0 none |
| Calibration gap | `confidenceScore - evidenceSupportScore` |
| Calibrated | `|gap| <= 0.2` |
| Overconfident | `gap >= 0.35` |
| Underconfident | `gap <= -0.35` |
| Unsupported | `evidenceSupportScore = 0`, no reason, `confidenceScore >= 0.6` |
| Calibration score | `1 - |gap|`, clamped 0–1 |
| Accuracy score | `1 - |gap|`, clamped 0–1 |

## Public API

- `buildConfidenceCalibrationModel()`
- `evaluateConfidenceCalibration()`
- `calculateConfidenceCalibrationScore()`
- `calculateConfidenceAccuracyScore()`
- `classifyConfidenceCalibrationStatus()`
- `classifyConfidenceAccuracyLevel()`
- `detectConfidenceCalibrationFlags()`
- `validateConfidenceCalibrationModel()`
- `runConfidenceCalibrationCertification()`

## Certification groups (A–X)

Foundation, engine, query layer, trend layer, evidence/reason layer, calibration initialization, empty/single workspace safety, workspace isolation, calibration/accuracy scoring determinism, status/level/flag determinism, distributions, average scores, confidence bounds, read-only enforcement, no dashboard/assistant/visualization/persistence coupling, no APP-6/7/8 integration, prior platforms untouched.

## Next phase

When APP-9:6 passes certification, proceed to **APP-9:7 — Confidence API + Consumer Contract Layer**.
