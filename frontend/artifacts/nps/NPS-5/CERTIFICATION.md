# NPA-T NPS:5 — Comparison & Recommendation

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:6 was not started.

## Verdict

**NPA-T NPS:5 — Comparison & Recommendation: CERTIFIED**

For a specific canonical Problem with comparison-ready options, Nexora can compare those options using relevant evidence-backed criteria, expose meaningful trade-offs, incorporate confirmed manager priorities, preserve assumptions and uncertainty, and produce a defensible recommendation, conditional recommendation, defer, or no-clear-preference outcome through existing comparison/advisory authorities—without inventing precision, hiding uncertainty, creating a parallel recommendation authority, or turning recommendation into commitment or Decision.

Central rules preserved:

- **Comparison ≠ Recommendation**
- **Recommendation ≠ Manager Preference**
- **Recommendation ≠ Commitment**
- **Recommendation ≠ Decision**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`.

## Canonical authorities reused

NPS:1–4 Problem/options/evidence; NCA-POST:4 comparison owner; ECA:7 / NCA:4 recommendation owner; CC:9 Scenario identity; CC:10 / CC:11 / ECA:8 unused as writers.

## Files created / modified

Created:

- `npsComparisonRecommendation.ts`
- `npsComparisonRecommendation.test.ts`
- `npsComparisonRecommendationRuntime.ts`
- `npsComparisonRecommendation.runtime.test.ts`
- `frontend/artifacts/nps/NPS-5/*`

Modified:

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach `npsComparisonRecommendation`
- `npsOptionGenerationRuntime.ts` — stop intercepting choose/recommend (NPS:5 owns those turns)
- `npsProblemUnderstandingRuntime.ts` — preserve Problem on compare / why / Decision-challenge follow-ups
- `npsOptionGeneration.runtime.test.ts` — choose/recommend moved to the NPS:5 live chain

## Comparison contract

`composeNpsComparisonRecommendation` exposes compared options, relevant criteria, trade-offs, advantages and disadvantages, constraints, assumptions, uncertainties, evidence support, dominance status, recommendation status, optional recommended option, rationale, conditions, manager preference vs Nexora recommendation, commitment readiness, and CC:10-safe flags (`committedOption` / `approvedDecision` null).

Expected cost/time are `UNKNOWN`. `score` is always null.

## Criteria resolution

Capacity Gap uses speed, capacity impact, cost, operational risk, and reversibility. Fast-recovery priority keeps speed and drops mechanical extras such as `evidenceStrength`.

## Trade-off behavior

External capacity: faster, more reversible, higher variable cost, unconfirmed availability. Capacity Expansion Plan: stronger long-term capacity, slower, higher commitment. Weaknesses remain visible if that option is recommended.

## Manager-priority handling

Unknown discriminator → `ASK_MANAGER`. Confirmed fast recovery may frame a conditional external recommendation. Invented priorities are not used.

## Recommendation status

`RECOMMEND | CONDITIONAL_RECOMMENDATION | DEFER | NO_CLEAR_PREFERENCE`. Unconfirmed supplier → conditional. Missing critical fact → defer. Balanced options without a discriminator → no clear preference.

## Evidence traceability

Rationale stays on Capacity Gap and NPS:3 observations. Demand Surge remains a possible contributor, not a confirmed cause.

## Preference vs recommendation

Manager may prefer Capacity Expansion Plan while Nexora recommends external capacity. Both remain visible. Neither is a Decision.

## Commitment / Decision boundary

Path may reach `RECOMMENDATION_READY` with next `AWAITING_COMMITMENT`. NPS:5 does not enter commitment or write CC:10 / CC:11.

## NPS:1–4 integration

UNCERTAIN Problem → `CLARIFY_PROBLEM`. Insufficient option coverage → `NEED_MORE_OPTIONS`. Canonical Capacity Expansion Plan identity is reused, not copied.

## Live proof

`What options do we have for Capacity Gap?` → `Compare them.` keeps Capacity Gap and Scenario identity with explicit trade-offs. `Which one should we choose?` produces recommendation/condition/uncertainty without a Decision. `So that's our decision?` is refused. `Why that one?` stays on Capacity Gap.

## Test results

| Gate | Result |
| --- | --- |
| NPS:5 focused A–N | PASS |
| NPS:1–4 unit regression | PASS |
| NPS:2–4 runtime | PASS |
| NCA-POST:4 | PASS |
| ECA:7 | PASS |
| NPS:5 live conversational proof | PASS |
| ESLint on changed surfaces | PASS |
| Full `tsc --noEmit` | Retained NPS:4 validation debt (prior OOM). Not re-run as L4. |

## Remaining gap for NPS:6

NPS:6 must consume `READY_FOR_COMMITMENT_REVIEW` / `AWAITING_COMMITMENT` through ECA:8 and write Decisions only via CC:10. Recommendation still must not auto-commit.

Do not start NPS:6 in this slice.
