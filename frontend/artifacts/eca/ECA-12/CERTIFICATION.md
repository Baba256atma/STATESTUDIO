# NPA-T ECA:12 — Learning & Reassessment Dialogue

**Status: CERTIFIED**

Certification date: 2026-09-14
Runtime: `http://localhost:3000/executive?reset=1`

Prerequisites ECA:1–11 remain CERTIFIED. None reopened. ECA:13 not started. ECA:12-FIX1 not created. Durable Learning architecture not created.

## Verdict

**NPA-T ECA:12 — Learning & Reassessment Dialogue: CERTIFIED**

**ECA:1–12 Executive Conversation Loop: CERTIFIED**

Ready for final ECA integrated certification: **YES**

## Architecture

| Item | Result |
| --- | --- |
| Module | `judgeEcaExecutiveLearningClosure` (existing) |
| New Learning / causal / reassessment / recommendation engine | None |
| Durable Learning store | None — `durableWrite: false`, `writesLearning: false`, `writesApp4: false` |
| Outcome authority | ECA:11 consumed; not recalculated |
| Learning scope | Fixed `case-specific` |
| Causal strength | Preserves ECA:11 `NOT_ESTABLISHED`; no inflation |
| Minimal extension | `SUPPORTED` when OBSERVED + IMPROVED + Goal MET/EXCEEDED; intent regexes for remember / change next time / change decision / retry considerations |

## Learning / reassessment terms (existing)

| Prompt concept | Existing term |
| --- | --- |
| NO_RELIABLE_LEARNING | `NONE` |
| HYPOTHESIS_ONLY | `WEAK` |
| TENTATIVE_LEARNING | `TENTATIVE` |
| SUPPORTED_LEARNING | `SUPPORTED` |
| Reassessment | `READY_TO_REASSESS` / advisory targets `ASSUMPTION` \| `GOAL` \| `DECISION` \| … |

## Evidence

| Gate | Result |
| --- | --- |
| Focused (prompt A–AO + legacy) | 74/74 PASS |
| Multi-turn (prompt 1–4) | 4/4 PASS |
| Live | 5/5 PASS, page errors 0, Learning writes 0 |
| Combined ECA regression | 701/701 PASS |
| ECA:11 focused / multi-turn | 72/72 · 4/4 protected |
| ECA:10 focused / multi-turn | 68/68 · 4/4 protected |
| ECA:1–9 | Protected in combined run |
| NXA Level 4 | 7/7 PASS (reused; L4 conversation funnel unaffected by advisory Learning mapping/intent) |
| TypeScript | 0 errors |
| ESLint | PASS |
| Production build | PASS (L4 reuse) |
| git diff --check | PASS |
| New S0/S1 | 0 |
| Authority violations | 0 |

## Live scenarios

1. Outcome → “What did we learn?” — bounded / tentative; causal NOT_ESTABLISHED
2. Causal challenge — no inflation; Learning stays tentative
3. Reconsider — reassessment advisory; Decision/Goal unchanged
4. “Should we do this again?” — no automatic repeat; Decision path preserved
5. Refresh — Learning writes 0; APP-4 writes 0

## Boundaries preserved

Outcome ≠ Learning · Learning ≠ proven causality · Learning ≠ durable truth · Reassessment ≠ mutation · Decision history unchanged · Goal/Risk/Scenario not written · APP-4 not Learning store · ECA:11 Outcome boundary preserved · ECA:7 remains recommendation authority
