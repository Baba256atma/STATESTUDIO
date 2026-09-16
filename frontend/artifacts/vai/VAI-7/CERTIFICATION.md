# NPA-A VAI:7 — Interactive Analysis & What-If Scenarios

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:8.

## Status

**NPA-A VAI:7 — CERTIFIED**

## Architecture inspected

VAI:1–6, CC:5 optional bundle overlay, CC:9 Scenario confirmation, CC:8 Evidence, CC:10/CC:11 Decision/Execution, Data Reality / DATA-ADV, Outcome/Learning, DTH:1–12 / DIR:1, Stage/referent, Advisor/VAI:4, NPS option/scenario boundaries, RMS/D7 `frontend/app/lib/simulation` (`RMS_AUTHORITY_BOUNDARY.vai === false`), conversational WHAT_IF grammar (executive Scenario, not VAI overlay).

## VAI:1–6 contracts reused

Variables, six contextual roles, VAI:3 ladder (`evidenceSupportedCausal` ≠ effect size), VAI:4 composition for next-investigation copy, VAI:5 symbols, VAI:6 Impact Scene as presentation host. No parallel Variable/role/causal/Director/Advisor store.

## Existing calculation/simulation authorities inspected

CC:9 scenario drafts, conversational what-if state grammar, RMS/D7 operational simulation. None made canonical VAI truth. Smallest authority: session overlay in `frontend/app/lib/vai/`.

## Files created

- `frontend/app/lib/vai/vaiWhatIfIdentity.ts`
- `frontend/app/lib/vai/vaiWhatIfContract.ts`
- `frontend/app/lib/vai/vaiWhatIfResolver.ts`
- `frontend/app/lib/vai/vaiWhatIfAdvisor.ts`
- `frontend/app/lib/vai/vaiWhatIfTheatre.ts`
- `frontend/app/lib/vai/vaiWhatIfDiagnostics.ts`
- `frontend/app/lib/vai/vaiWhatIfExperiment.test.ts`
- `frontend/artifacts/vai/VAI-7/*`

## Files modified

- `conversationalExperience.ts` — optional experiment/session/theatre/proposal
- `conversationalExperienceOrchestrator.ts` — optional session/models, CC:5 overlay after VAI:4

VAI:1–6 production contracts unchanged (`startsVai7` remains false on VAI:6).

## What-if experiment contract

`WHAT_IF_EXPERIMENT`: temporary analytical overlay. `isExecutiveObject: false`, `isScenario: false`. Identity includes experiment ID, analysis context, focal Object, `createdFrom: MANAGER_INTERACTION`, assumptions, classified views, uncertainty, provenance flags all false for Scenario/Decision/Execution/Outcome/Evidence/Data Reality.

## Baseline contract

Every changed Variable uses trusted VAI:1 `KNOWN` value as baseline. Missing baseline → `UNKNOWN_BASELINE`; no invented 100/0.

## Assumption-overlay behavior

Trusted baseline + session assumption = experiment view. Canonical Variable JSON unchanged after create/modify/compare/discard.

## Result classification ladder

`ASSUMPTION_ONLY` | `DETERMINISTIC_CALCULATION` | `MODEL_ESTIMATE` | `UNSUPPORTED_PREDICTION` plus `UNKNOWN_BASELINE` | `UNIT_BLOCKED` | `SCOPE_BLOCKED` | `MISSING_INPUT`.

## Deterministic-calculation proof

Capacity 1,000 +10% → 1,100, class `DETERMINISTIC_CALCULATION`, not `MODEL_ESTIMATE`.

## Unsupported-prediction proof

Staffing +10% with no trusted Staffing→OTD model → OTD `Unknown` / `UNSUPPORTED_PREDICTION`.

## Causality-vs-effect-size proof

`evidenceSupportedCausal: true` still yields no numerical OTD; reason states effect size is not provided.

## Trusted-model provenance behavior

Caller-supplied `LINEAR_DELTA` model with `modelId`, units, scope, uncertainty range, `sourceRef`. Estimate is not observed Outcome.

## Scope / unit / missing-value safety

Plant A model + Plant B request → `SCOPE_BLOCKED`. Incompatible units → `UNIT_BLOCKED`. Unknown required input → `MISSING_INPUT`, not zero.

## LEVER / CONTROL / MODERATOR / CONFOUNDER / PATH

LEVER overlay only; no Scenario/Decision/Execution. CONTROL `hold` keeps canonical state. Moderator without quantitative model: uncertainty preserved. Seasonality remains visible. Path does not numerically propagate without a trusted edge.

## Multi-variable / Theatre / comparison

Two assumptions preserved; combined OTD unknown. Theatre rows labeled CURRENT / BASELINE vs WHAT-IF / ASSUMED. Comparison lists experiments with `winnerSelected: false`.

## Advisor / discard / isolation

CC:5 overlay reuses existing Advisor path; no second engine. Discard clears session experiments. Capacity Gap session does not copy into Margin Pressure context.

## Scenario / Decision / Execution / Outcome / Evidence

Promotion is `writesScenario: false` proposal for CC:9 confirmation. `decisionApproved`, `executionStarted`, `outcomeWritten`, `evidenceWritten` remain false.

## No-optimization / no new causal authority / mutation

Boundary: `optimization`, `monteCarlo`, `modelTraining`, `causalGraphAuthority`, `startsVai8` all false. Catalog and Variable JSON unchanged (test AC).

## Focused test results

A–AC + boundary + CC:5 overlay: **31 pass / 0 fail**.

## Regression results

VAI:1–7 + DTH:1 + DTH:5 Scene Intent: **157 pass / 0 fail**.

## ESLint

Touched files: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. No authority, prediction, or mutation failure classified as debt.

## Final status

**NPA-A VAI:7 — CERTIFIED**
