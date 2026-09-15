# NPA-T NPS:8 — Architecture Inspection

Inspection date: 2026-09-15.

NPS:8 composes Outcome, bounded Learning, Problem resolution, and reassessment loop-back. It does not own Outcome capture, Outcome evaluation, Learning durability, Problem mutation, Decision writes, or Execution writes.

NPS:7 (Execution & Monitoring) is not present in this tree. NPS:8 therefore enters from NPS:1 path states plus observed CC:11 Execution / CORE-OUT evidence when those facts exist. It does not invent an Execution engine to fill that gap.

## Canonical owners

| Concern | Owner | NPS:8 role |
| --- | --- | --- |
| Problem truth | NPS:1–6 | `UNCERTAIN`/`CONFLICTED` → `CLARIFY_PROBLEM`; 0 writes |
| Approved Decision | CC:10 / NPS:6 observation | Trace only |
| Execution completion | CC:11 | Observe `executionId` / status; never start |
| Execution readiness / live deviation | ECA:9 / ECA:10 | Downstream of NPS:6/7; not replaced |
| Outcome capture | CORE-OUT:1A | Observe; no second capture store |
| Outcome evaluation (expected vs actual) | CORE-OUT:1 / ECA:11 | Observe baseline, Goal, observed |
| Outcome Theatre | DTH:11 | Unchanged |
| Learning interpretation | CORE-OUT:2 / ECA:12 / DTH:12 | Bounded statements; `writesMemory: false` |
| Durable Learning | APP-4 (promotion only; not written on `/executive`) | **Gap:** no durable Learning writer on existing `/executive`. NPS:8 sets `learningDurable = false` and does not create one |
| Problem resolution write | Canonical Problem authority | NPS composes `RESOLVED` / `REASSESSMENT` from evidence; does not mutate Problem records |
| Reassessment | ECA:12 / DTH:12 / NPS path | Smallest justified earlier state; no auto Decision |

## Trace

Problem → Evidence → Options → Recommendation → Decision → Execution → Outcome → Learning / Reassessment.

Stale Stage/conversation/Scenario ids are not used as Outcome identity.

## Path

`MONITORING` / completed Execution without evidence → Outcome `UNKNOWN`, path `OUTCOME_REVIEW`, not `RESOLVED`.

Observed improvement below Goal → `PARTIALLY_RESOLVED` / `REASSESSMENT`.

Goal met on canonical numbers → resolution assessment `RESOLVED` (path only; Problem record unchanged).

Cause hypothesis weakened → `loopBackState = CAUSE_ANALYSIS` (not `PROBLEM_IDENTIFIED`).

NPS:FINAL was not started.
