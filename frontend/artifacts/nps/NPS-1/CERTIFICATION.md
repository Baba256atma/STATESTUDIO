# NPA-T NPS:1 — Problem-Solving Path Foundation

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:2 was not started.

## Verdict

**NPA-T NPS:1 — Problem-Solving Path Foundation: CERTIFIED**

Nexora can deterministically identify where a specific Problem currently sits in the end-to-end problem-solving journey, and identify the next valid step, by reading existing canonical facts. NPS is a path composer, not a new authority, and path advancement produces no canonical mutations.

## Architecture inspected

Recorded in `ARCHITECTURE-INSPECTION.md`. Existing owners for Manager–Object/Stage, ECA, Problem, Investigation, Data Reality/Evidence, CORE-INT:3, Scenario, Comparison, Recommendation, CC:10, CC:11, Outcome/Learning, Theatre/Director, and MO:5 were inspected before code was added.

## Canonical authorities reused

Observed, not replaced: MO Context Problem anchor, FINAL:5 investigation, Data Reality / CC:8 evidence, CORE-INT:3 causes, CC:9 scenarios, NCA-POST:4 comparison, ECA:7 / NCA:4 recommendation, ECA:8 pending commitment, CC:10 Decision, CC:11 Execution, CORE-OUT / ECA:11–12 Outcome and Learning.

MO:5 remains the Goal journey. Advisor and Stage were not redesigned.

## Path states

`PROBLEM_IDENTIFIED`, `UNDERSTANDING`, `INVESTIGATING`, `EVIDENCE_REVIEW`, `CAUSE_ANALYSIS`, `OPTIONS_AVAILABLE`, `COMPARING_OPTIONS`, `RECOMMENDATION_READY`, `AWAITING_COMMITMENT`, `DECIDED`, `EXECUTION_READINESS`, `EXECUTING`, `MONITORING`, `OUTCOME_REVIEW`, `REASSESSMENT`, `RESOLVED`.

Names follow the NPS:1 bounded model. MO:5 `JourneyState` was not reused as the Problem path because it is Goal-centered and coarser.

When the active Problem cannot be determined, `problemOwnership` is `UNCERTAIN` or `CONFLICTED`, `currentState` is null, and the composer does not guess from Stage focus, collection, Scenario, or conversation subject.

## Resolver / composer

- Identity: `NPA-T NPS:1/ProblemSolvingPathFoundation`
- Module: `frontend/app/lib/nexora-problem-solving/npsProblemSolvingPath.ts`
- Composer: `composeNpsProblemSolvingPath`
- Advancement (explicitly non-mutating): `attemptNpsPathAdvancement`

## Tests passed

Focused `npsProblemSolvingPath.test.ts`: **18 passed / 0 failed**

Covers prompt A–J plus uncertainty, stale-context substitution refusal, manager-facing language, awaiting commitment, resolved Outcome, and incomplete-evidence blocking.

## Regression results

| Gate | Result |
| --- | --- |
| Focused NPS:1 | 18/18 PASS |
| MO:5 journey suite (adjacent Goal journey, not replaced) | 13/13 PASS |
| ESLint on NPS:1 files | PASS |
| `git diff --check` on NPS:1 files | PASS |
| Full NXA Level 4 / long-session certification | Not run (not required for this foundation slice) |

## Parallel authority / store

None introduced.

- No Problem store
- No Scenario store
- No Evidence writer
- No Decision approval
- No Execution start
- No Outcome or Learning invention
- No ECA bypass
- No CC:10 / CC:11 bypass
- `canonicalMutations` is always empty

## Remaining gaps for NPS:2

- Production fact adapter that reads live MO / ECA / CC:10 / CC:11 / CORE-OUT state into `NpsCanonicalFacts` without a second store
- Optional ECA/CC:5 consumption of the path projection (Advisor still must not own the path)
- Optional Theatre/Director presentation of the manager projection
- Investigation/evidence/cause adapters beyond the observed-boolean facts used in NPS:1
- Live browser proof of the path on `/executive`

Do not start NPS:2 from this certification.
