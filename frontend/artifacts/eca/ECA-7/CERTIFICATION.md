# NPA-T ECA:7 — Recommendation Framing & Decision Readiness

**Status: CERTIFIED**

Certification date: 2026-09-14
Runtime: `http://localhost:3000/executive?reset=1`

Prerequisites ECA:1–6 remain CERTIFIED. None reopened. ECA:8 not started. ECA:7-FIX1 not created.

## Verdict

**NPA-T ECA:7 — Recommendation Framing & Decision Readiness: CERTIFIED**

## Architecture

| Item | Result |
| --- | --- |
| Module | `judgeEcaExecutiveRecommendation` (existing) |
| New engine / store / Decision writer | None |
| Consumes | ECA:1–6, NCA:4, NXA:5, POST:4/DTH:7, DATA-ADV, Risk (read-only) |
| Disposition | PREFER_OPTION / DEFER_DECISION / NO_CLEAR_PREFERENCE (+ conditional / investigation) |
| Decision readiness | NOT_READY / READY_WITH_CONDITIONS / READY / BLOCKED (advisory only) |

## Evidence

| Gate | Result |
| --- | --- |
| Focused (prompt A–X + legacy + sequences) | 57/57 PASS |
| Multi-turn (prompt 1–4) | 4/4 PASS |
| Runtime | 7/7 PASS |
| Live | 5/5 PASS, page errors 0 |
| Combined ECA regression | 343/343 PASS |
| ECA:6 / 5 / 4 / 3 / 2 / 1 | Protected (no reopen; suites green in combined run) |
| NXA Level 4 | 7/7 PASS (reused CLEANUP-3; ECA:7 production module unchanged) |
| TypeScript | 0 errors |
| ESLint | PASS |
| Production build | PASS (L4 reuse) |
| git diff --check | PASS |
| New S0/S1 | 0 |
| Authority violations | 0 |

## Live scenarios

1. Grounded recommendation (Capacity Gap → Demand Surge / Pricing Response compare) — writes7 false, Decision count 0
2. Insufficient evidence → NOT_READY / no option
3. Preference framing shift (delivery speed → cost) — no Decision write
4. Decision readiness without automatic Decision
5. Choose utterance — ECA:7 does not write Decision; Execution count 0

## Boundaries preserved

Recommendation ≠ Decision · Preference ≠ commitment · Readiness ≠ Decision existence · CC:10 / CC:11 sole writers · No duplicate recommendation/scoring engine · Causal + Data safety preserved
