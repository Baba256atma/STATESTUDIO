# NPA-A VAI:8 — Experiment-to-Decision Integration

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:9.

## Status

**NPA-A VAI:8 — CERTIFIED**

## Architecture inspected

VAI:1–7, NPS:4 option/scenario boundary, CC:9 Scenario conversation, Scenario comparison, CC:8 Evidence, CC:10/CC:11, Outcome/Learning, ECA:7–8, DTH:1–12 / DIR:1, CC:5, Stage/referent, Data Reality.

## VAI:1–7 contracts reused

Variables, roles, causal ladder, Advisor, Theatre symbols, Impact Scene, WHAT_IF_EXPERIMENT overlay and VAI:7 proposal seed.

## Existing Scenario/NPS authorities reused

CC:9 `resolveNexoraExecutiveScenarioConversation` is the only Scenario writer. NPS:4 remains `createsScenarioAuthority: false`.

## Files created

- `frontend/app/lib/vai/vaiExperimentDecisionIdentity.ts`
- `frontend/app/lib/vai/vaiExperimentDecisionContract.ts`
- `frontend/app/lib/vai/vaiExperimentDecisionResolver.ts`
- `frontend/app/lib/vai/vaiExperimentDecisionDiagnostics.ts`
- `frontend/app/lib/vai/vaiExperimentDecision.test.ts`
- `frontend/artifacts/vai/VAI-8/*`

## Files modified

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — VAI:8 session overlay and Scenario session merge
- `ecaExecutiveCommitment.ts` — optional `analyticalUncertainty` consumed by ECA:8 (ECA still owns the challenge)

## Experiment→Scenario proposal contract

`EXPERIMENT_SCENARIO_PROPOSAL` is not a Scenario Object (`isScenarioObject: false`, `writesScenario: false`).

## Explicit-manager-intent / confirmation / canonical writer

Lever/what-if/inspect do not promote. “Make this a scenario” opens `PENDING_CONFIRMATION`. Write occurs only on explicit yes, through CC:9.

## Identity/provenance chain

`experimentId` → `vai8:proposal:…` → `cc9:scenario:…` remain distinct.

## Assumption vs reality / classifications / confounders

Canonical Variables unchanged. DETERMINISTIC / MODEL_ESTIMATE / UNKNOWN preserved. Seasonality survives. Unknown OTD is not invented.

## Comparison / NPS / recommendation / Decision / ECA / Execution / Outcome / Learning

VAI `winnerSelected: false`. NPS owns solution-path routing. No VAI recommendation. No Decision/Execution/Outcome/Learning writes. ECA:8 can challenge with VAI unknowns. No coefficient update.

## Theatre / cancel / failure / duplicate / referent / Advisor / leakage / mutation

Impact Scene + experiment overlay continue. Proposed-as-Scenario is not canonical until CC:9 succeeds. Cancel/fail leave no Scenario. Repeat promotion reuses the mapped ID. Changed referent clarifies. Manager copy has no architecture leak. Pre-confirmation mutation flags remain false.

## Focused test results

A–AB + CC:5 overlay: **30 pass / 0 fail**.

## Regression results

VAI:1–8 + DTH:1 + DTH:5 + NPS:4 + ECA:8: **270 pass / 0 fail**.

## ESLint

Touched files: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`.

## Final status

**NPA-A VAI:8 — CERTIFIED**
