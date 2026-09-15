# NPA-T NPS:4 — Options & Scenario Generation

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:5 was not started.

## Verdict

**NPA-T NPS:4 — Options & Scenario Generation: CERTIFIED**

For a specific canonical Problem that is ready for Options, Nexora can compose multiple meaningful and traceable response options from the existing Evidence/contributor picture, preserve causal uncertainty, constraints and assumptions, reuse existing Scenarios where appropriate, safely hand candidates to the canonical Scenario authority, and determine readiness for comparison without recommending, deciding, executing, or creating a parallel Scenario authority.

Central rules preserved:

- **Option ≠ Recommendation ≠ Decision**
- **Possible Contributor ≠ Confirmed Cause**
- **OPTION_CANDIDATE ≠ CANONICAL_SCENARIO**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`.

## Canonical authorities reused

NPS:1–3 Problem ownership and Evidence/Cause picture; catalog Scenarios (`ctx-scenario-capacity` Capacity Expansion Plan); CC:9 as Scenario writer (handoff only); NCA-POST:4 as comparison owner (not invoked); ECA:7 / NCA:4 as recommendation owners (null preference); CC:10 / CC:11 untouched.

## Files created / modified

Created:

- `npsOptionGeneration.ts`
- `npsOptionGeneration.test.ts`
- `npsOptionGenerationRuntime.ts`
- `npsOptionGeneration.runtime.test.ts`
- `frontend/artifacts/nps/NPS-4/*`

Modified:

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach `npsOptionGeneration`
- `npsProblemUnderstandingRuntime.ts` — preserve Problem on option follow-ups
- `managerObjectActive.ts` — session `npsOptionCandidateId` continuity hint (not a Scenario store)

## Option-generation contract

`composeNpsOptionGeneration` exposes problem identity, generation status, objective, relevant evidence, contributors, constraints, uncertainties, option candidates, coverage, missing-option need, next step, `recommendation: null`, `preferredOption: null`, CC:9 handoff, and a manager projection without a winner.

Each candidate includes intent, addresses, mechanism, assumptions, required conditions, constraints, supporting evidence, contributor labels, uncertainties, expected direction, potential risks, and `scenarioStatus` (`OPTION_CANDIDATE | REUSES_CANONICAL | CURRENTLY_INFEASIBLE | REQUIRES_VALIDATION`).

## Evidence → Option traceability

Candidates keep `problemId`, `supportingEvidence`, and `contributorLabels` from the NPS:3 picture. Internal-capacity options address demand/capacity mismatch; maintenance options address downtime as an alternative explanation, not a proven cause.

## Causal uncertainty

Demand Surge may be a possible/supported contributor with `confirmedCause = null`. Manager text uses “may be contributing” and does not say Demand Surge caused the Problem or that capacity must be increased.

## Constraints / assumptions

Hiring freeze → `CURRENTLY_INFEASIBLE`. Unknown external capacity → `REQUIRES_VALIDATION` with an explicit unconfirmed assumption.

## Existing Scenario reuse

Capacity Expansion Plan is referenced (`REUSES_CANONICAL`); no “Capacity Expansion Plan 2”.

## Candidate → canonical Scenario boundary

Handoff owner is `CC:9/ScenarioConversation` with `npsWritesScenario: false`. Path observation of option ids is not a CC:9 write.

## Option diversity / coverage

Capacity Gap candidates cover internal absorb, external transfer, demand/schedule adapt, and do-nothing/monitor. Distinct intents with ≥3 feasible options → `SUFFICIENT` / `READY_FOR_COMPARISON`. Path current state `OPTIONS_AVAILABLE`; next available `COMPARING_OPTIONS` without performing comparison.

## NPS:1–3 integration

UNCERTAIN ownership → `CLARIFY_PROBLEM` and zero options. Insufficient evidence → `NOT_READY` without fabricated intervention options. NPS:3 `READY_FOR_OPTIONS` remains the entry for a meaningful option set.

## Live proof

`Investigate Capacity Gap.` → `What options do we have for Capacity Gap?` keeps Capacity Gap, surfaces multiple options, reuses Capacity Expansion Plan, no recommendation. `Which one should we choose?` defers to comparison trade-offs. `Tell me more about the external option.` keeps Capacity Gap and focuses `opt-external-capacity`.

## Test results

| Gate | Result |
| --- | --- |
| NPS:4 focused A–L | PASS |
| NPS:1 regression | PASS |
| NPS:2 unit + runtime | PASS |
| NPS:3 unit + runtime | PASS |
| CC:9 `executiveScenarioConversation.test.ts` | PASS |
| ECA:7 recommendation tests | PASS |
| NCA-POST:4 comparison tests | PASS |
| NexoraExecutiveShell | PASS |
| NPS:4 live `/executive` conversational proof | PASS |
| ESLint on changed surfaces | PASS |
| Full `tsc --noEmit` | Not completed (process abort / OOM). Changed files type-checked by `tsx --test`. |

## Remaining gaps for NPS:5

NPS:5 must consume `READY_FOR_COMPARISON` option sets, reuse NCA-POST:4 / ECA:7 for comparison and recommendation, still not write Decision (CC:10) or Execution (CC:11), and still not treat a preferred option as a Decision.

Do not start NPS:5 in this slice.
