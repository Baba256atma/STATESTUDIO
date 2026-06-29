# APP-9:4 — Confidence Trend + Volatility Layer

## Purpose

APP-9:4 is the **read-only confidence movement analysis layer** built on APP-9:1, APP-9:2, and APP-9:3.

It transforms ordered confidence records into deterministic historical movement metadata: trend direction, deltas, volatility, stability, peaks, drops, and recoveries.

No prediction, recommendation, AI reasoning, visualization, dashboard, assistant, persistence, or APP-6/7/8 integration.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-9 |
| Trend contract | APP-9/4 |
| Prerequisites | APP-9/1, APP-9/2, APP-9/3 |
| Status | build (movement analysis) |

## Movement rules

| Rule | Value |
| --- | --- |
| Delta | `currentScore - previousScore` |
| Total delta | `lastScore - firstScore` |
| Average delta | Mean absolute consecutive movement |
| Volatility score | Average absolute delta, clamped 0–1 |
| Stable threshold | 0.05 |
| Drop threshold | delta ≤ -0.2 |
| Peak | Local maximum vs previous and next score |
| Recovery | Positive delta immediately after drop |

## Trend directions

`increasing`, `decreasing`, `stable`, `mixed`, `unknown`

## Volatility levels

`none`, `low`, `medium`, `high`, `extreme`

## Stability levels

`stable`, `moderately_stable`, `unstable`, `highly_unstable`, `unknown`

## Public API

- `buildConfidenceTrendModel()`
- `calculateConfidenceDeltas()`
- `classifyConfidenceTrendDirection()`
- `calculateConfidenceVolatility()`
- `classifyConfidenceStability()`
- `detectConfidencePeaks()`
- `detectConfidenceDrops()`
- `detectConfidenceRecoveries()`
- `validateConfidenceTrendModel()`
- `runConfidenceTrendCertification()`

## Certification groups (A–W)

Foundation, engine, query layer, trend initialization, empty/single workspace safety, workspace isolation, delta/direction/volatility/stability determinism, peak/drop/recovery detection, confidence bounds, read-only enforcement, no dashboard/assistant/visualization/persistence coupling, no APP-6/7/8 integration, prior platforms untouched.

## Next phase

When APP-9:4 passes certification, proceed to **APP-9:5 — Confidence Evidence + Reason Link Layer**.
