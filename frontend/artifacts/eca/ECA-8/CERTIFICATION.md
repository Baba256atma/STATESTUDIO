# NPA-T ECA:8 — Commitment Dialogue & Pre-Decision Challenge

**Status: CERTIFIED**

Certification date: 2026-09-14
Runtime: `http://localhost:3000/executive?reset=1`

Prerequisites ECA:1–7 remain CERTIFIED. None reopened. ECA:9 not started. ECA:8-FIX1 not created.

## Verdict

**NPA-T ECA:8 — Commitment Dialogue & Pre-Decision Challenge: CERTIFIED**

## Architecture

| Item | Result |
| --- | --- |
| Module | `judgeEcaExecutiveCommitment` (existing) |
| New engine / store / Decision writer | None |
| Consumes | ECA:1–7, CC:10/CC:10R, DTH:8 (not replaced) |
| Commitment states | NONE / PREFERENCE / INTENT / EXPLICIT_COMMITMENT / AWAITING_CONFIRMATION / CANCELLED |
| Challenge model | One material `preDecisionChallenge`; no mandatory challenge |

## Evidence

| Gate | Result |
| --- | --- |
| Focused (prompt A–Z + legacy + sequences) | 59/59 PASS |
| Multi-turn (prompt 1–4) | 4/4 PASS |
| Runtime | 7/7 PASS |
| Live | 5/5 PASS, page errors 0 |
| Combined ECA regression | 409/409 PASS |
| ECA:7 / 6 / 5 / 4 / 3 / 2 / 1 | Protected (suites green in combined run) |
| NXA Level 4 | 7/7 PASS (reused; ECA:8 production module unchanged) |
| TypeScript | 0 errors |
| ESLint | PASS |
| Production build | PASS (L4 reuse) |
| git diff --check | PASS |
| New S0/S1 | 0 |
| Authority violations | 0 |

## Live scenarios

1. Preference without commitment — PREFERENCE, Decision count unchanged
2. Compare → recommend → choose — challenge / conditions path; writes8 false
3. Challenge accepted — still no ECA:8 Decision write
4. Explicit Approve Demand Surge — CC:10 handoff path only
5. Choose after compare — Execution count unchanged

## Boundaries preserved

Preference ≠ commitment · Challenge acceptance ≠ Decision · Uncertainty accepted ≠ DATA resolved · Stale / ambiguous commitment blocked · Cancellation works · CC:10 sole Decision writer · CC:11 sole Execution start · ECA:8 mutation count = 0
