# NPA-T ECA:7 — Architecture Inspection

**Phase:** Recommendation Framing & Decision Readiness
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:7 only. Do not start ECA:8.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:7 |
| --- | --- | --- |
| Executive context / subject | ECA:1 (`composeEcaWorkingConversationContext`) | Consume subject fidelity |
| Intent / next action | ECA:2 (`planEcaExecutiveConversationAction`) | Consume; do not own next turn |
| Initiative | ECA:3 (`judgeEcaExecutiveInitiative`) | Consume; ECA:7 is not initiative |
| Information need / ask | ECA:4 (`judgeEcaExecutiveInformationNeed`) | Blocker identification only; ECA:4 owns ask |
| Answer meaning | ECA:5 (`judgeEcaExecutiveAnswerIntake`) | Preference / estimate intake |
| Dialogue objective / progress | ECA:6 (`judgeEcaExecutiveDialogueStrategy`) | Progress may target recommendation; must not force recommend |
| Advisory strategy | NCA:4 | Consumed; not replaced |
| Judgment / preference / tradeoffs | NXA:5 | Analytical recommendation source |
| Comparison | NCA-POST:4 / DTH:7 | Option set; not ranking authority for ECA:7 |
| Decision create/approve | CC:10 | Sole Decision writer |
| Execution | CC:11 | Sole Execution writer |
| Data semantics | DATA-ADV | CAP_AV / unresolved meaning |
| Risk / Goal / Stage / Outcome | Canonical owners | Read-only context |
| Recommendation framing | `judgeEcaExecutiveRecommendation` | **This phase** — read-only projection |

## ECA:7 module

- `frontend/app/lib/nexora-conversation/ecaExecutiveRecommendation.ts`
- Entry: `judgeEcaExecutiveRecommendation`
- Session: ephemeral `EcaRecommendationSession` (no persistence store)
- Overlay: `applyEcaRecommendationToPresentedResponse` (presentation only)

## Disposition / readiness (existing terms)

**Recommendation types:** `PREFER_OPTION` | `CONDITIONAL_PREFERENCE` | `NO_CLEAR_PREFERENCE` | `DEFER_DECISION` | `CONTINUE_INVESTIGATION` | `REVIEW_EVIDENCE` | `NONE`

**Recommendation readiness:** `READY` | `READY_WITH_CONDITIONS` | `NOT_READY` | `NO_CLEAR_PREFERENCE` | `BLOCKED_BY_CRITICAL_UNKNOWN`

**Decision readiness:** `READY` | `READY_WITH_CONDITIONS` | `NOT_READY` | `BLOCKED`

Maps to prompt RECOMMEND / DEFER / NO_CLEAR_PREFERENCE and NOT_READY / CONDITIONALLY_READY / READY without a second vocabulary.

## Boundaries (hard)

- Recommendation ≠ Decision
- Preference ≠ commitment
- Readiness ≠ Decision existence
- No second recommendation / scoring / Decision engine
- No Decision / Execution / Stage / Data / Risk / Goal / Outcome / Learning writes
- Causal safety and DATA-ADV uncertainty preserved
- Does not replace NCA:4 or DTH:7

## Not introduced

- Second recommendation engine
- Second scoring engine
- Second Decision readiness lifecycle authority
- Decision store / autonomous decision maker
- Generic option-ranking authority

## ECA layering

ECA:6 may set objective toward recommendation.
ECA:7 decides whether recommendation is justified.
ECA:4 owns whether to ask about blockers.
ECA:3 owns whether to speak.
ECA:2 owns safest next conversational action.
CC:10 / CC:11 remain sole writers for Decision / Execution.
