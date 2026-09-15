# NPA-T CLEANUP-1 — NXA Level 4 Five Failures

**Status: NOT CERTIFIED**

Date: 2026-09-14

## Verdict

**NPA-T CLEANUP-1 — NOT CERTIFIED**

Reason: the five prior L4 product failures are resolved and the executive omnibus is green, but the required Level 4 barrier still fails on **pre-existing out-of-scope TypeScript errors** (CLEANUP-2).

## Five-failure map

### 1. MO:4 — conversation: goal continuity, guidance, and goal change
- Expected: `What is my current goal?` answers with manager-stated Improve Delivery Reliability
- Actual: catalog Goal object Explain (`Close Capacity Gap: This goal represents…`)
- First divergence: orchestrator KNOW→explanation overwrite after goal lane already composed the answer
- Owning layer: `conversationalExperienceOrchestrator.ts` (goal-lane precedence)
- Classification: **A — real product behavior defect** (Manager–Object goal lane hijacked)

### 2. NEX-EXP:8 — plan is explicit, owners unknown, and plan does not start execution
- Expected: Entrance execution planning `Not yet…`
- Actual: ECA readiness note (`The Decision is committed, but execution is not ready yet…`)
- First divergence: `explicitAdvisoryPurpose === "execution-readiness"` overwrote Entrance-owned copy
- Owning layer: orchestrator advisory-purpose precedence
- Classification: **A — real product behavior defect** (Entrance ownership leak)

### 3. NEX-ENT:3 — Proof H — Outcome does not prove causation
- Expected: Object-education causality wording
- Actual: generic causal-assessment advisory text
- First divergence: `explicitAdvisoryPurpose === "causal-assessment"` overwrite
- Owning layer: orchestrator advisory-purpose precedence
- Classification: **A — real product behavior defect** (Entrance ownership leak)

### 4. NEX-EXP:9 — numeric Goal gap… causality unconfirmed
- Expected: Outcome-monitoring `cannot confirm`
- Actual: generic causal-assessment advisory text
- First divergence: same advisory-purpose overwrite
- Owning layer: orchestrator advisory-purpose precedence
- Classification: **A — real product behavior defect** (Entrance ownership leak)

### 5. NEX-ENT:9 — Proof G/H — evidence and Outcome are not cause
- Expected: Trust-review `does not, by itself, prove`
- Actual: ECA outcome causality wording
- First divergence: advisory-purpose / non-Entrance overwrite of Trust Review ownership
- Owning layer: orchestrator advisory-purpose precedence
- Classification: **A — real product behavior defect** (Entrance ownership leak)

## Repair

In `conversationalExperienceOrchestrator.ts` only:

1. Skip KNOW→catalog explanation overwrite when `managerExperience.lane` is `goal` or `next-action`.
2. Expand Entrance ownership guard (execution planning, outcome monitoring, learning, object education, trust review) and skip executive-advisory purpose overwrites when Entrance owns the utterance or the response is locked.

No new architecture. No ECA:1/ECA:2 planner redesign.

## Validation

| Gate | Result |
| --- | --- |
| Previous 5 L4 failures | **5/5 PASS** |
| L4 omnibus | **1612/1612 PASS** |
| L4 DIR inventory | **58/58 PASS** |
| L4 ESLint (PREP) | PASS |
| L4 scoped git diff --check | PASS |
| L4 TypeScript | **FAIL** — 2 pre-existing MRA runtime test errors (CLEANUP-2) |
| L4 build / live-smoke | Not completed (barrier stops at typecheck) |
| Required NXA L4 | **2/7 required passed this barrier attempt** (omnibus + dir); blocked by typecheck |
| ECA:2 focused | **22/22 PASS** |
| ECA:2 multi-turn | **4/4 PASS** |
| ECA:2-FIX1 continuity | **PASS** (8/8 FIX1 tests) |

## Pre-existing / out of scope

- MRA TypeScript: 2 errors in `mra3RecertFix4B1Fix1NxaDecisionProjection.runtime.test.ts` and `mra3RecertFix4B2ExecutionProjection.runtime.test.ts`
- Artifact whitespace: pending CLEANUP-3

## Stop

CLEANUP-2 / CLEANUP-3 not started. ECA:3 / VAI / VAL / AVI not started.
