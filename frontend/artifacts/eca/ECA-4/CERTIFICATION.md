# NPA-T ECA:4 — Executive Questioning & Information Acquisition

**Status: CERTIFIED**

Certification date: 2026-09-14
Prerequisite: ECA:1–3 CERTIFIED. None reopened.
ECA:5 was not started. ECA:4-FIX1 was not created.

## Verdict

**NPA-T ECA:4 — Executive Questioning & Information Acquisition: CERTIFIED**

## Architecture

Reused existing canonical module `judgeEcaExecutiveInformationNeed` (2026-09-07).
NEW PHASE work: architecture re-inspection, prompt A–P + multi-turn contract tests, short live proofs (5) with canonical catalog names, re-certification gates.

| Item | Result |
| --- | --- |
| New clarification engine | NO |
| New memory / store / writer | NO |
| ECA:5 answer-ingestion | NO |
| Production ECA:4 judgment changed this phase | NO |

Questioning model: `shouldAsk` + `acquisitionAction` (ASK_MANAGER / REQUEST_SEMANTIC_CONFIRMATION / NO_ACQUISITION_NEEDED / PROCEED_WITH_UNCERTAINTY / …).

## Focused coverage

| Suite | Result |
| --- | --- |
| Legacy A–T + sequences + regressions | PASS |
| Prompt A–P | PASS |
| Prompt multi-turn 1–4 | PASS |
| Combined focused file | **49/49 PASS** |
| Orchestrator runtime | **8/8 PASS** |

ASK cases: material cost/preference, CAP_AV semantic confirmation, Decision/Execution prerequisites, outcome observation.
NO-ASK cases: known Goal/target, optional detail, confirmed Data, repetition, subject switch, ECA:3-only intervene.

## Live runtime (short, max 5)

Evidence: `live-proofs.json` via `scripts/eca-4-live-proofs.mjs`.

| Proof | Result |
| --- | --- |
| 1 Known information → no unnecessary question | PASS |
| 2 Missing material preference (Demand Surge / Pricing Response) | PASS |
| 3 CAP_AV uncertainty → no Data mutation | PASS |
| 4 Decision-related → no Decision mutation | PASS |
| 5 Execution readiness → no Execution start | PASS |

**5/5 PASS**, page errors **0**.

## Safety matrix

| Gate | Result |
| --- | --- |
| Known-information-first | PASS |
| Materiality / UNKNOWN ≠ ASK | PASS |
| Smallest useful question | PASS |
| One-question-at-a-time | PASS |
| Clarification vs acquisition | PASS |
| Repetition protection | PASS |
| Explicit-intent protection | PASS |
| Data / causal / Decision / Execution safety | PASS |
| Answer-ingestion boundary (no ECA:5) | PASS |

## ECA regressions (this run)

Combined ECA:1–4 regression: **151/151 PASS**
- ECA:3 focused 45/45 + multi-turn 4/4 (included)
- ECA:2 focused 22/22 + multi-turn 4/4 (included)
- ECA:1 / FIX1 (included)

## Quality gates

| Gate | Result | Notes |
| --- | --- | --- |
| TypeScript | **0 errors** | this run |
| ESLint (ECA:4 surface) | PASS | this run |
| git diff --check | PASS | this run |
| NXA Level 4 | **7/7 PASS** | reused CLEANUP-3 (no production behavior change) |
| Production build | PASS | reused CLEANUP-3 |

New S0/S1: **0**. Authority violations: **0**.

## Stop

ECA:5 was not started. Ready for ECA:5: **YES** (do not start automatically).
