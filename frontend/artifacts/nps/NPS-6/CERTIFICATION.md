# NPA-T NPS:6 — Decision & Commitment

**Status: CERTIFIED**

Certification date: 2026-09-15.

NPS:7 was not started.

## Verdict

**NPA-T NPS:6 — Decision & Commitment: CERTIFIED**

For a specific canonical Problem with a completed comparison/recommendation, Nexora can distinguish recommendation, manager preference, commitment, and explicit Decision authorization; use existing ECA:8 challenge/commitment behavior; preserve material uncertainty and target identity; and hand a valid manager-confirmed commitment to CC:10 as the sole canonical Decision authority—without auto-committing Nexora’s recommendation, accepting stale/ambiguous confirmation, or starting Execution.

Central rules:

- **Recommendation ≠ Preference**
- **Preference ≠ Commitment**
- **Commitment ≠ Approved Decision**
- **Approved Decision ≠ Execution**

**Nexora recommends. The manager commits. CC:10 records the Decision.**

## Architecture inspected

See `ARCHITECTURE-INSPECTION.md`.

## Canonical authorities reused

ECA:8 commitment/challenge; CC:10 pending confirmation and Decision writer; NPS:5 recommendation/options; CC:11 unused.

## Files created / modified

Created:

- `npsDecisionCommitment.ts`
- `npsDecisionCommitment.test.ts`
- `npsDecisionCommitmentRuntime.ts`
- `npsDecisionCommitment.runtime.test.ts`
- `frontend/artifacts/nps/NPS-6/*`

Modified:

- `ecaExecutiveCommitment.ts` — resolve named targets against considered options / candidate choices (still ECA:8)
- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — attach `npsDecisionCommitment`; feed prior NPS:5 options into ECA:8
- `managerObjectActive.ts` — `npsComparedOptions` continuity hint
- `npsProblemUnderstandingRuntime.ts` — preserve Problem on prefer / proceed / did-we-decide follow-ups

## Commitment contract

`composeNpsDecisionCommitment` exposes problem, candidate option/Scenario, Nexora recommendation vs manager preference, commitment status/intent, unresolved conditions, challenge, confirmation, `decisionHandoff` (`NOT_AUTHORIZED | READY_FOR_CC10 | APPLIED | FAILED | STALE`), and `approvedDecisionId` only from observed CC:10 success. `npsWritesDecision` is always false.

## Preference vs commitment

`I prefer External Capacity` → `PREFERENCE_EXPRESSED`, `approvedDecisionId = null`.

## Pre-Decision challenge

Unresolved supplier availability remains a visible condition. Explicit proceed maps to `CHALLENGE_REQUIRED` or `AWAITING_CONFIRMATION`, not approval.

## Confirmation boundary

Generic Yes without a pending proposal → `NOT_AUTHORIZED`. Topic change → `STALE`. Ambiguous target → `CLARIFY_TARGET`. Valid ECA:8 handoff → `READY_FOR_CC10` (NPS still does not write).

## CC:10 handoff / success / failure

Handoff projection carries problem, option/Scenario, challenge, confirmation, and conditions. `applied` → observe `DECIDED`. `failed` → `approvedDecisionId` stays null; path is not `DECIDED`.

## Manager override

Manager may commit to Capacity Expansion Plan while Nexora still recommends external capacity. Recommendation is not auto-selected.

## Decision vs Execution

Approved Decision keeps `startsExecution: false`. Next path is `EXECUTION_READINESS`. `Do it` / `Start it` do not approve and execute together.

## NPS:1–5 integration

Same Capacity Gap identity through options, comparison, recommendation, and commitment. Uncertain Problem blocks commitment.

## Live proof

`Which one should we choose?` → `I prefer External Capacity.` is preference only. `Let's proceed with it.` does not approve. `Yes.` does not start Execution. `Did we decide?` answers from canonical Decision truth. `Start it.` points to execution readiness without invoking CC:11.

## Test results

| Gate | Result |
| --- | --- |
| NPS:6 focused A–P | PASS |
| NPS:1–5 unit regression | PASS |
| NPS:4–6 live conversational proofs | PASS |
| ECA:8 | PASS |
| CC:10 `executiveDecisionCommitment.test.ts` | PASS |
| ESLint on changed surfaces | PASS |
| Full `tsc --noEmit` | Retained validation debt (prior OOM). Not re-run as L4. |

## Remaining gap for NPS:7

NPS:7 must consume `EXECUTION_READINESS` through ECA:9 and start/monitor work only via CC:11. An approved Decision still must not auto-start Execution.

Do not start NPS:7 in this slice.
