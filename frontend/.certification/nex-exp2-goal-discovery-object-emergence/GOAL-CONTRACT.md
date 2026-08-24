# NEX-EXP:2 — Goal Discovery & Goal Object Emergence

Identity: `NEX-EXP:2/GoalDiscoveryGoalObjectEmergence` `1.0.0`  
Namespace: `nexora.experience.goal-discovery.object-emergence`

## Handoff

Starts only after NEX-EXP:1 `READY_FOR_GOAL_DISCOVERY`. Does not start NEX-EXP:3.

## State model

`NOT_STARTED` → `LISTENING` → `GOAL_SIGNAL_FOUND` → `CLARIFYING` → `GOAL_UNDERSTOOD` → `GOAL_CONFIRMED` → `GOAL_OBJECT_READY` → `GOAL_OBJECT_ACTIVE` → `READY_FOR_EXECUTIVE_CONTEXT`

## Precedence

`EXPLICIT CURRENT MANAGER GOAL > CONFIRMED EXISTING GOAL > AUTHORITATIVE WORKSPACE OBJECTIVE > INFERRED GOAL > UNKNOWN`

Registered Goal reuse (`goal-capacity-availability`) only when that object is already in the live catalog. First-time entrance projects `goal-executive-discovered` as `SESSION_ONLY`.

## Persistence

`SESSION_ONLY` for discovered first-time Goals. `REGISTERED_RUNTIME` only when an existing catalog Goal is reused. Durability is not claimed.

## Stage

Center transfer uses `selectNexoraMVPInteractionSubject`. Goal at `(0,0,0)`, Manager/Company related at `(0, 1.55, 0)`, relationship `rel-executive-context-goal`. No rogue x/y/z writer.

## LLM

Deterministic extraction only. No invented goals, priorities, targets, deadlines, KPIs, or relationships.
