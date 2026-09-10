# MRA:3 — Simulation Plan

Date: 2026-09-09

Validation only. No product redesign. Do not start Manager-Ready certification.

## Inputs

MRA:1 Failure Map + clusters. MRA:2 SYSTEMIC-FIXES, FAILURE-REGRESSION-MATRIX, RUNTIME-EVIDENCE, CERTIFICATION. Deferred S1s **002, 008, 012 remainder** are exercised, not hidden.

## Drivers

| Kind | Script | Output |
| --- | --- | --- |
| Isolated CC:5 (seeded CSV, threaded CC:10/11) | `scripts/mra-3-runtime-simulation.ts` | `runtime-turns.json` |
| Live `/executive` | `scripts/mra-3-live-simulation.mjs` | `live-audit.json`, `live-proofs.png` |

## Journeys

1. Business orientation — Persona C entrance-like context → situation → Problems → Stage → correction.
2. Problem investigation — Persona A Problems → why → evidence → switch → `go back to the first problem`.
3. Real data — seeded/imported CSV; required explain-CSV; unseen wording; cause question.
4. Scenario development — Problem → scenarios → compare → second one → preference.
5. Recommendation challenge — What should I do? then why / sure / missing / do nothing / rec vs decision.
6. Decision commitment — compare → prefer → Approve; verify canonical vs Stage counts.
7. Execution — readiness → start it → progress.
8. Deviation — delay/blocker language; on track; change plan; affect the decision.
9. Outcome — observed vs goal vs cause.
10. Mutation safety — add Risk → confirm/cancel/delete/reject/correct/topic change/ambiguous yes.
11. Long session — 50+ turns, one conversation, no reset.
12. Deferred S1s — explicit 002 / 008 / 012 remainder.
13. Live nav/refresh — Stage collection, Back, Forward, Overview, reload.

## Scoring

0–5 dimensions in MANAGER-TRUST-SCORES.md. Evidence required below 4.

## Stop

MRA:3 certification = simulation complete and stable enough to *consider* final certification. Not Manager-Ready.
