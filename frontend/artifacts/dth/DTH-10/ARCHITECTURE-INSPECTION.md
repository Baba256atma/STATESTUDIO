# DTH:10 — Architecture inspection

## Smallest extension point

Project a read-only **Live Execution Theatre** after DTH:9 `EXECUTION_STARTED` / CC:11 `in-progress` (also `blocked`, `at-risk`, `completed`). Scene intent reuses DTH:5 `REVIEW_EXECUTION`. No `LIVE_EXECUTION` intent.

Canonical flow:

CC:10 / CC:10R committed Decision → DTH:9 readiness → explicit “Start it.” → CC:11 create/prepare/start → DTH:10 Live Execution Theatre → Director → Stage.

DTH:10 consumes Execution truth. It does not become Execution truth.

## Canonical Execution facts that actually exist (CC:11)

`NexoraCanonicalExecution`:

- `executionId`, `decisionId`, `title`
- `status`: `planned | ready | in-progress | blocked | at-risk | completed | cancelled`
- optional `progress` (number). Create/start does **not** set progress.
- `ownerIds`, `blockers`, `risks`, `milestones` (milestone may have optional `deadline`, `completed`)
- `source`, `createdFromDecision`, `workspaceId`, `modelId`

**Not present** on the canonical record: created/started timestamps, KPI links, Outcome id, fabricated owners, fabricated deadlines.

Completion is CC:11 `transitionExecution({ action: "complete" })` and requires confirmation (`execution-confirmation-required`). DTH:10 does not invent `completeExecution()`.

Catalog still has unrelated Execution objects (`ctx-execution-capacity`, `ctx-execution-rollout`). Those are not the CC:11 Execution for the committed Demand Surge Decision.

## Theatre interpretation (not a second lifecycle)

| Canonical status | Theatre state |
|---|---|
| none / planned / ready | DTH:9 owns; DTH:10 does not project |
| `in-progress`, no supported signals | `EXECUTION_ACTIVE` |
| `in-progress` + related Risk/Constraint, or `at-risk` | `EXECUTION_ATTENTION` |
| `blocked` | `EXECUTION_BLOCKED` |
| `completed` | `EXECUTION_COMPLETED` |

Missing owner / progress / timing / Outcome remain **unknown**. They are not blocked, delayed, 0%, failed, or attention.

Related Constraint is associated, not causal, unless canonical status is `blocked`.

## Scene

CC:11 Execution ids are not catalog Stage objects. A sparse truthful scene (committed Decision context + live overlay with Execution as Theatre primary actor) is used rather than manufacturing Stage objects. Comparison overlay stays hidden after commitment (`decisionCommitment != null`). Live overlay replaces DTH:9 readiness overlay after start.

## Conversation

Advisor overlays on existing `/executive` only. Entrance NEX-EXP:8/9 keep ownership via `shouldNexoraExecutionPlanningOwnUtterance` / `shouldNexoraOutcomeMonitoringOwnUtterance`. Collection queries remain read-only. Click remains DTH:6 investigation.

## Reload

Projection reconstructs from `listExecutions()` + Approved CC:10R Decisions. CC:11 in-memory runtime does not survive a full page reload (same as CC:10R). In-session overview → return reconstructs from canonical adapter state.

## Not started

DTH:11 Outcome Theatre, Learning Theatre, NexoTime/Timeline, task/project/workflow engines.
