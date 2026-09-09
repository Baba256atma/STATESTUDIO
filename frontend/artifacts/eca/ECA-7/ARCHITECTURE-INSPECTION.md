# NPA-T ECA:7 — Architecture Inspection

Date: 2026-09-08

## Stop condition

ECA:7 may be certified only when a read-only recommendation-readiness and framing judgment consumes ECA:1–6 plus existing NCA:4 / NXA:5 / NCA-POST:4 / DTH:7 / CC:10 authorities; never writes Decision/Stage/Data/business state; can defer, conditionally recommend, or return no clear preference; preserves trade-offs and uncertainty; and passes focused A–T, sequences 1–8, seven live `/executive` proofs, NXA Level 4, TypeScript, ESLint, production build, and `git diff --check`.

## Who currently produces recommendation text

| Authority | Path | Owns |
| --- | --- | --- |
| **NCA:4** | `nexoraNca4AdvisoryIntelligence.ts` | Advisory position, strength (`LEAN_TOWARD` / `RECOMMEND` / `STRONGLY_RECOMMEND`), trade-offs, counterargument, dialogue moves |
| **NXA:5** | `nexoraNxa5ExecutiveJudgment.ts` | Defensible preference over POST:4 candidates; `preferredCandidateId`, `recommendationStrength`, `decisionReadiness`, `managerMessage` |
| **CC:8** | `executiveRecommendationResolver.ts` | Conversational-control recommend path (not ECA) |
| **ECA:2** | `ecaExecutiveIntentActionPlan.ts` | Plans `SEEK_RECOMMENDATION` → `RECOMMEND_OPTION`; does not write recommendation prose |

NCA:4 identity: `NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence`. Boundary: `createsSecondRecommendationEngine: false`, `commitsDecision: false`.

## Who currently compares scenarios

**NCA-POST:4** owns candidate set, criterion, evidence state, and comparison isolation. It does not invent ranking (`preferredCandidateId` is not a second Decision).

**DTH:7** (`DTH:7/DecisionComparison`) owns Theatre **presentation** of comparison, trade-offs, uncertainty, and a display slot for an authoritative preferred candidate. It does not invent recommendation or commit Decision.

**DTH:8 / CC:10** own Decision commitment experience. Recommendation never auto-commits.

## Existing recommendation and readiness contracts

Do **not** invent parallel contracts.

- NCA:4 `ExecutiveAdvisoryPosition` / `RecommendationStrength` / `AdvisoryPositionStatus`
- NXA:5 `Nxa5RecommendationStrength` (`STRONG` \| `QUALIFIED` \| `TENTATIVE` \| `INSUFFICIENT`) and `Nxa5DecisionReadiness` (`NOT_READY` \| `READY_WITH_KNOWN_UNCERTAINTY` \| `READY` \| `NOT_APPLICABLE`)
- DTH:7 comparison authority display
- ECA:6 milestones `FORM_RECOMMENDATION` / `REVIEW_DECISION_READINESS`

## What ECA:7 uniquely adds

A conversation-layer **readiness + framing** judgment that binds:

- ECA:2 recommendation *request* vs evaluation
- ECA:4 material vs non-material unknowns
- ECA:5 estimate / conflict / CAP_AV non-promotion
- ECA:6 `PREPARE_RECOMMENDATION` objective
- NCA:4 / NXA:5 advisory preference when present

into one bounded frame: whether to recommend, conditionally recommend, defer, continue investigation, or state no clear preference — without becoming Decision truth.

## How duplicate Decision / comparison / recommendation engines are avoided

ECA:7 does **not** rank, score, or write `preferredCandidateId`. It consumes NXA:5/NCA:4 preference when available. When those authorities have no winner, ECA:7 returns `NO_CLEAR_PREFERENCE` or `DEFER_RECOMMENDATION` rather than inventing a score.

Session overlay (`ecaRecommendationSession`) stores only last criterion fingerprint, last delivered frame identity, and considered option labels for staleness/repetition suppression. It is not `EcaRecommendationStore` and not canonical Decision state.

## Criteria source

Priority: explicit manager criterion > NCA-POST:4 / ECA:1 comparison criterion > Goal-derived (read-only) > none. Explicit manager criteria outrank inferred preference.

## Trade-off, uncertainty, reversibility sources

Consumed from NCA:4 tradeoffs/counterargument, NXA:5 tradeoffs/uncertainty/changeConditions/reversibility, and ECA:4/5 need/intake. ECA:7 does not create a reversibility doctrine.

## Relationship to ECA:1–6

Acyclic: ECA:1 → 2 → 3 → 4 → 5 → 6 → **ECA:7**. ECA:7 does not call those judges. ECA:6 may mark `PREPARE_RECOMMENDATION`; ECA:7 decides whether advice is justified.

## Stage / Director / DTH

ECA:7 may inform diagnostics. It does not write Stage, bypass Director, or drive DTH:8 commitment.

## Durability

Session-only, same as ECA:3–6. After refresh, recommendation is recomputed from current valid context. No reconstruction of a stale conversational recommendation from Stage alone. No durable manager-preference learning.

## Strategy vs Decision

Recommendation ≠ Decision. Decision-ready ≠ Decision made. Suggested “Review Decision” ≠ Approve.

## Architecture questions (certification)

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second Decision engine? | NO | NO |
| Q2 Replace NCA:4? | NO | NO |
| Q3 Replace DTH:7? | NO | NO |
| Q4 Defer when insufficient? | YES | YES |
| Q5 Conditional recommendation? | YES | YES |
| Q6 No clear preference? | YES | YES |
| Q7 Trade-offs preserved? | YES | YES |
| Q8 Uncertainty/counter-evidence? | YES | YES |
| Q9 Criteria change recommendation? | YES | YES |
| Q10 Readiness ≠ commitment? | YES | YES |
| Q11 Reassess on evidence change? | YES | YES |
| Q12 Direct business writes? | NO | NO |

