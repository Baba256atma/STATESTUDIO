# APP-8:6 — Decision Journal Outcome + Retrospective Layer

## Purpose

APP-8:6 is the **read-only outcome and retrospective layer** for the Decision Journal platform.

It structures learning metadata by comparing expected outcomes with observed outcomes recorded in entry metadata — capturing assumption accuracy, risk realization, evidence reliability, and review completeness.

This is not prediction, recommendation, or automatic judgment. It is structured retrospective metadata only.

## Prerequisites

- APP-8:1 through APP-8:5 (all certified)

## Layer identity

| Field | Value |
| --- | --- |
| Stage ID | APP-8/6 |
| Contract version | APP-8/6 |
| Runtime path | library-only (read-only retrospective metadata) |

## Public API

| Function | Purpose |
| --- | --- |
| `initializeDecisionJournalRetrospectiveLayer()` | Bootstrap retrospective layer |
| `buildDecisionJournalRetrospectiveModel()` | Build full workspace retrospective model |
| `evaluateDecisionJournalOutcome()` | Per-entry outcome evaluation |
| `evaluateDecisionJournalRetrospective()` | Full per-entry retrospective model |
| `calculateOutcomeStatus()` | Deterministic outcome comparison |
| `calculateAssumptionAccuracy()` | Assumption accuracy score (0–1) |
| `calculateRiskRealization()` | Risk realization score (0–1) |
| `calculateEvidenceReliability()` | Evidence reliability score (0–1) |
| `calculateReviewCompleteness()` | Review completeness score (0–1) |
| `validateDecisionJournalRetrospectiveModel()` | Validate retrospective model contract |
| `runDecisionJournalRetrospectiveCertification()` | Full certification runner |

## Outcome status vocabulary

`not_observed`, `aligned`, `partially_aligned`, `misaligned`, `exceeded`, `unknown`

Retrospective fields are read from `entry.metadata.extensions`:

- `observedOutcome`, `retrospectiveNotes`, `lessonsLearned`
- `assumptionAccuracy`, `riskRealization`, `evidenceReliability`, `outcomeStatus`

## Retrospective flags

`no-observed-outcome`, `outcome-aligned`, `outcome-misaligned`, `outcome-exceeded`, `assumptions-verified`, `assumptions-invalidated`, `risk-realized`, `evidence-reliable`, `evidence-unreliable`, `review-incomplete`, `lessons-missing`, `lessons-recorded`

## Architecture rules

- Does **not** modify APP-8:1 through APP-8:5 or any prior APP platform
- Reads entries via APP-8:3; uses APP-8:5 quality evaluators
- No entry mutation, AI, recommendations, predictions, or integrations

## Certification groups (A–V)

Foundation through evidence/assumption layers available; retrospective initialized; empty journal safe; workspace isolation; outcome status and flags deterministic; accuracy metrics valid; confidence bounded; read-only; no dashboard/assistant/visualization/persistence; no APP-6 integration; prior platforms untouched.

## Next phase

When APP-8:6 passes certification, proceed to **APP-8:7 — Decision Journal API + Consumer Contract Layer**.
