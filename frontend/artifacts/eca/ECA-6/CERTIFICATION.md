# NPA-T ECA:6 — Dialogue Strategy & Multi-Turn Objective Control

**Status: CERTIFIED**

Certification date: 2026-09-14
Prerequisite: ECA:1–5 CERTIFIED. None reopened.
ECA:7 was not started. ECA:6-FIX1 was not created.

## Verdict

**NPA-T ECA:6 — Dialogue Strategy & Multi-Turn Objective Control: CERTIFIED**

## Architecture

Reused existing canonical module `judgeEcaExecutiveDialogueStrategy` (2026-09-08).
NEW PHASE work: architecture re-inspection, prompt A–T + multi-turn contract tests, short live proofs (5) with canonical catalog names, re-certification gates.

| Item | Result |
| --- | --- |
| Workflow engine | NO |
| Second objective store | NO |
| Second conversation memory | NO |
| Production ECA:6 judgment changed this phase | NO |

Dialogue strategy model: `objectiveType` + `lifecycle` + `progress` + `unresolvedNeedId` + `recommendedMilestone`.

## Focused coverage

| Suite | Result |
| --- | --- |
| Legacy A–T + sequences | PASS |
| Prompt A–T | PASS |
| Prompt multi-turn 1–4 | PASS |
| Combined focused file | **56/56 PASS** |
| Orchestrator runtime | **7/7 PASS** |

## Live runtime (short, max 5)

Evidence: `live-proofs.json` via `scripts/eca-6-live-proofs.mjs`.

| Proof | Result |
| --- | --- |
| 1 Investigation objective + progress | PASS |
| 2 Comparison objective | PASS |
| 3 Data detour + resume | PASS |
| 4 Decision readiness without automatic Decision | PASS |
| 5 Execution readiness/start boundary | PASS |

**5/5 PASS**, page errors **0**.

## Safety matrix

| Gate | Result |
| --- | --- |
| Objective persistence / switching | PASS |
| Temporary detour / resume | PASS |
| Completion / abandonment (pause) | PASS |
| Subject/objective and Goal/objective separation | PASS |
| No-workflow-engine protection | PASS |
| Data / causal / Decision / Execution boundaries | PASS |

## ECA regressions (this run)

Combined ECA:1–6 regression: **259/259 PASS**
- ECA:5 53/53 + multi-turn 4/4 (included)
- ECA:4 49/49 + multi-turn 4/4 (included)
- ECA:3 45/45 + multi-turn 4/4 (included)
- ECA:2 22/22 + multi-turn 4/4 (included)
- ECA:1 / FIX1 (included)

## Quality gates

| Gate | Result | Notes |
| --- | --- | --- |
| TypeScript | **0 errors** | this run |
| ESLint (ECA:6 surface) | PASS | this run |
| git diff --check | PASS | this run |
| NXA Level 4 | **7/7 PASS** | reused CLEANUP-3 (no production behavior change) |
| Production build | PASS | reused CLEANUP-3 |

New S0/S1: **0**. Authority violations: **0**.

## Stop

ECA:7 was not started. Ready for ECA:7: **YES** (do not start automatically).
