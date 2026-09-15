# NPA-T NPS:8 — Outcome, Learning & Reassessment

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:FINAL was not started.

## Verdict

**NPA-T NPS:8 — Outcome, Learning & Reassessment: CERTIFIED**

For a canonical Problem whose Decision has been executed (or is otherwise suitable for Outcome Review), Nexora can observe and interpret Outcome evidence through existing authorities, distinguish expected from observed and improvement from resolution, derive bounded Learning without inventing causality or durability, determine whether the Problem is resolved or requires reassessment, and route the NPS path back to the smallest justified earlier state without automatically creating another Scenario, Decision, or Execution.

Central rules:

- **Execution Completed ≠ Successful Outcome**
- **Improvement ≠ Problem Resolved**
- **Outcome After Action ≠ Caused By Action**
- **Learning ≠ Proven Causality**

**NPS closes the loop; it does not manufacture success.**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`.

NPS:7 is not in this tree. NPS:8 composes over NPS:1 path states, NPS:6 Decision observation, CC:11 Execution facts when present, CORE-OUT, and ECA:11–12.

## Canonical authorities reused

- CORE-OUT:1 / 1A — Outcome evaluation / capture
- ECA:11 — Outcome dialogue
- CORE-OUT:2 / ECA:12 / DTH:12 — Learning interpretation and reassessment framing
- CC:11 — Execution identity (observe only)
- CC:10 — Decision identity (observe only)
- APP-4 — durable memory owner; **not written**. Gap: no durable Learning writer on `/executive`

## Files created / modified

Created:

- `npsOutcomeLearning.ts`
- `npsOutcomeLearning.test.ts`
- `npsOutcomeLearningRuntime.ts`
- `npsOutcomeLearning.runtime.test.ts`
- `frontend/artifacts/nps/NPS-8/*`

Modified:

- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach `npsOutcomeLearning`; `npsPath` prefers NPS:8 path when composed
- `npsProblemUnderstandingRuntime.ts` — preserve Problem on did-it-work / solved / next / caused follow-ups

## Outcome contract

`composeNpsOutcomeLearning` exposes problem, Decision, Execution, baseline, Goal, expected, observed, `outcomeStatus`, variance, evidence, uncertainties, `learningStatus` / statements with `learningDurable: false`, `resolutionStatus`, `reassessmentStatus`, `loopBackState`, and `attribution: NOT_ESTABLISHED`. Writes remain false.

## Baseline / Goal / observed

91 / 96 / 94 stay distinct. Expected is not rewritten to match observed.

## Outcome status

Missing evidence after completion → `UNKNOWN` (not `RESOLVED`). Improvement below Goal → `PARTIAL`. Goal reached → `MEETS_EXPECTATION` / `EXCEEDS_EXPECTATION`. Below baseline → `BELOW_EXPECTATION`.

## Causal safety

Improvement is association during/after Execution. `attribution` stays `NOT_ESTABLISHED`. Weakened hypothesis does not claim capacity is irrelevant.

## Learning and durability

Bounded, case-specific statements only. `learningDurable = false`. No new Learning store. CORE-OUT:2 `writesMemory: false` is preserved.

## Problem resolution

Completion alone is not resolution. 94 vs Goal 96 → `PARTIALLY_RESOLVED`. 96.4 vs Goal 96 → path `RESOLVED` as an NPS composition of evidence, not a Problem-record mutation.

## Reassessment / loop-back

Unresolved or contradictory Outcome → `REASSESSMENT` available. Invalidated cause picture → `loopBackState = CAUSE_ANALYSIS`, not `PROBLEM_IDENTIFIED`. Poor Outcome → 0 CC:10 and 0 CC:11 writes.

## NPS:1–6 integration

Same Capacity Gap identity through investigation, options, commitment, and Outcome questions. Uncertain Problem blocks resolution.

## Live proof

Capacity Gap journey → “Did it work?” does not invent success → “Is Capacity Gap solved?” is not Execution completion → “What should we do now?” points to reassessment without a new Decision → “So External Capacity caused the improvement?” keeps causal uncertainty.

## Focused / regression results

NPS:8 A–L plus ownership/baseline tests passed. NPS:1–6 unit/runtime, ECA:11, ECA:12, and ECA:10 runtime proofs passed. ESLint on changed surfaces: 0 errors.

## Validation debt

Full `tsc --noEmit` remains the known OOM issue. L4 / long-session certification was not run.

## Remaining work for NPS:FINAL

NPS:FINAL should freeze the full path contract, confirm NPS:7 (Execution & Monitoring) if still absent, and certify end-to-end loop closure without adding authorities. Durable Learning on `/executive` remains an architectural gap owned by APP-4, not NPS.

Do not start NPS:FINAL in this slice.
