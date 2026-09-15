# NPA-T NPS:3 — Evidence & Cause Analysis

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:4 was not started.

## Verdict

**NPA-T NPS:3 — Evidence & Cause Analysis: CERTIFIED**

For a specific canonical Problem, Nexora can say what trusted evidence supports, keep observation / relationship / contributor / cause distinct, retain contradictions, confounders, and alternatives, name the next useful causal test, and mark readiness for Options without inventing Evidence, overstating causality, or adding a parallel Evidence or Causal authority.

Central rule preserved: **Data ≠ Evidence ≠ Correlation ≠ Contributor ≠ Cause**.

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`.

## Canonical authorities reused

NPS:1–2 Problem ownership, Data Reality / catalog observations, CC:8 provenance shape, DATA-ADV semantic confidence, FINAL:5 investigation continuity, CORE-INT:3 recorded contributors/constraints, EI:3 confidence. No VAI/AVI runtime consumed; gap is explicit.

## Files created / modified

Created:

- `npsEvidenceCauseAnalysis.ts`
- `npsEvidenceCauseAnalysis.test.ts`
- `npsEvidenceCauseAnalysisRuntime.ts`
- `npsEvidenceCauseAnalysis.runtime.test.ts`
- `frontend/artifacts/nps/NPS-3/*`

Modified:

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach `npsEvidenceCause`
- `npsProblemUnderstandingRuntime.ts` — preserve Problem ownership on evidence/cause follow-ups

## Evidence Analysis contract

`composeNpsEvidenceCauseAnalysis` exposes problem identity, evidence items, status, sufficiency, observations vs interpretations, patterns, relationships, contributors, possible/supported/rejected hypotheses, uncertainties, confounders, alternatives, causal ladder, next evidence need, next causal test, and supporting references.

## Evidence-sufficiency model

`NONE | INSUFFICIENT | LIMITED | USABLE | STRONG | CONFLICTING` — answers whether evidence can support the next reasoning step, not whether a cause is proven.

## Contributor / cause model

Contributors: `POSSIBLE | SUPPORTED_CONTRIBUTOR | WEAK | CONFLICTING | REJECTED`.

Hypotheses: `POSSIBLE_CAUSE | SUPPORTED_CAUSE | WEAKENED | REJECTED`.

`confirmedCause` is null unless an existing causal authority already confirmed it.

## Causal-safety ladder

`OBSERVED → ASSOCIATED → POSSIBLE_CONTRIBUTOR → SUPPORTED_CONTRIBUTOR → POSSIBLE_CAUSE → SUPPORTED_CAUSE → CONFIRMED_CAUSE`

NPS never independently promotes ASSOCIATED to CAUSE.

## Provenance

Items keep sourceId, sourceType, field, timeRange, semanticConfidence, managerConfirmation, evidenceStatus. Unconfirmed `CAP_AV` cannot become “Available Capacity”. Manager-confirmed meaning may participate.

## Confounders / alternatives

Contradicting observations remain visible. Competing recorded factors remain alternative explanations. No collapse to a single winner without existing support.

## NPS:1–2 integration

Investigation without usable evidence stays at evidence request. Usable contributor understanding can reach `CAUSE_ANALYSIS` and `READY_FOR_OPTIONS` without generating Scenarios (`scenarioIds` stay empty).

## Live proof

`Investigate Capacity Gap.` → `What does the evidence say is causing it?` keeps Capacity Gap, separates observation from cause, states uncertainty. `So is Demand Surge definitely the cause?` does not convert a contributor into confirmed causality.

## Test results

| Gate | Result |
| --- | --- |
| NPS:3 focused A–L (+ ownership) | 14/14 PASS |
| NPS:1 regression | 18/18 PASS |
| NPS:2 focused + live | 13/13 PASS |
| NPS:3 live | 1/1 PASS |
| CORE-INT:3 + ECA:4 semantic + MRA deictic | 90/90 PASS |
| ESLint on changed files | PASS |
| Full typecheck / L4 | Not run |

## Remaining gaps for NPS:4

- Generate or reuse Scenarios/options from bounded contributor understanding without treating them as confirmed causes
- Comparison of options remains NCA-POST:4 / CC:9
- Theatre presentation of cause vs option scenes

Do not start NPS:4 from this certification.
