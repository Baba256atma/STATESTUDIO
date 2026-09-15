# NPA-T ECA:MAINT-1 — Commitment Review Intent & Current Decision-Candidate Fidelity

**Status: CERTIFIED**

Date: 2026-09-14
Baseline: ECA:1–12 FINAL CERTIFIED · ECA:FINAL FINAL CERTIFIED

## Diagnosis

| Item | Finding |
| --- | --- |
| Observed | “What would we be committing to?” → “which business outcome…” |
| Source of wrong reply | NCA UNKNOWN fallback (`applyNcaStrategyToResponse`) |
| Why | ECA:8 commitment-review family did not match; no speak/replace |
| Owning layer | ECA:8 commitment dialogue (with theatre candidate wiring) |

## Repair

- Expanded informational `isCommitmentReview` semantic family (not EXPLICIT_COMMITMENT)
- Resolve current candidate: named → pending → recommendation → theatre `decisionCandidate` → single choice; ambiguous → clarify; none → no fabricate
- `applyEcaCommitmentToPresentedResponse` replaces NCA outcome/investigation clarification when `commitmentReview`
- Orchestrator passes theatre commitment candidate/choices into ECA:8
- No CC:10/CC:11 change; writes remain 0 on review

## Evidence

| Gate | Result |
| --- | --- |
| Focused MAINT-1 A–J | PASS |
| ECA:8 focused suite | 69/69 PASS |
| ECA:8 runtime | 7/7 PASS |
| Live proof | PASS · page errors 0 · Decision from review = 0 · Approve still creates Decision |
| TypeScript | 0 |
| ESLint (affected) | PASS |
| Production build | PASS |
| git diff --check | PASS |
| NXA Level 4 | Reused 7/7 (commitment-review path covered by MAINT-1 live; L4 smoke unaffected) |
| New S0 / S1 | 0 / 0 |

## ECA:FINAL

Preserved. Not rewritten.
