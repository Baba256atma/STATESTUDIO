# APP-1:5 — Executive Time Transition Engine Report

## Purpose

APP-1:5 introduces the **Executive Time Transition Engine** — the orchestration layer for temporal entity lifecycle transitions. The engine evaluates, validates, orchestrates, explains, and recommends transitions without mutating entity state directly.

All successful transitions must flow through:

```
Transition Request → Transition Authority → Transition Engine → Transition Decision → State Engine.applyApprovedTransition()
```

## Architecture

| Module | Responsibility |
|--------|----------------|
| `executiveTimeTransitionPolicy.ts` | Primary-path transition metadata (scenario, decision, risk, kpi, etc.) |
| `executiveTimeTransitionDependency.ts` | Read-only dependency validation (state, entity, context, camera, workspace) |
| `executiveTimeTransitionApproval.ts` | Approval requirement metadata (none, manager, executive, multi-stage, policy) |
| `executiveTimeTransitionResolver.ts` | Resolution and immutable decision construction |
| `executiveTimeTransitionEngine.ts` | Orchestration and authority delegation |
| `executiveTimeTransitionCertification.ts` | Gates A–V certification runner |

## Transition Pipeline

1. Validate entity identity
2. Validate current state
3. Validate target state
4. Validate transition policy (primary-path edge)
5. Validate dependencies (read-only camera/context/state)
6. Validate approval requirements
7. Delegate to Transition Authority
8. Produce immutable transition decision
9. Apply only via `applyApprovedTransition()` when explicitly invoked

## Policy Model

Policies define **metadata-only primary paths**:

- **Scenario:** draft → planned → active → completed
- **Decision:** draft → review → approved → executed
- **Risk:** detected → monitoring → mitigated → closed
- **KPI:** inactive → collecting → monitoring → completed

Policy validation requires a direct primary-path edge. Lifecycle skip transitions are rejected at the policy layer.

## Dependency Model

Each transition may declare dependencies across:

- `state_dependency` — declared current state matches stored state
- `entity_dependency` — entity id present
- `context_dependency` — executive time context available (read-only)
- `camera_dependency` — camera position available (read-only)
- `workspace_dependency` — workspace id present
- External metadata dependencies (validation-only, not resolved)

## Approval Model

Approval levels are metadata-only with no user interaction:

- **none** — KPI and lightweight entities
- **manager** — scenario transitions
- **executive** — decision transitions
- **policy** — risk transitions
- **multi_stage** — reserved for future staged approval metadata

## Decision Object

`ExecutiveTimeTransitionDecision` is an immutable frozen object containing:

- `approved` / `rejected`
- `currentState` / `targetState` / `entityType`
- `policyResult`, `dependencyResult`, `approvalResult`
- `explanation`, `warnings`, `blockingIssues`, `recommendations`
- `metadata`

## Certification

Certification tag: `[APP1_5_TIME_TRANSITION_ENGINE]`

Required tags:

- `[TIME_TRANSITION_ENGINE_READY]`
- `[TRANSITION_POLICY_READY]`
- `[TRANSITION_DEPENDENCY_READY]`
- `[TRANSITION_APPROVAL_READY]`
- `[NO_DIRECT_STATE_MUTATION]`
- `[NO_UI_MUTATION]`

Gates A–V verify engine existence, policy/dependency/approval/resolver modules, evaluation, authority usage, read-only upstream consumption, future contracts, UI isolation, tests, and report presence.

## Tests

Lightweight tests cover:

- Policy validation (allowed vs blocked edges)
- Dependency validation (camera/context/state)
- Approval validation (required vs granted)
- Available and blocked transition resolution
- Immutable decision objects
- Transition explanation
- Authority usage and State Engine-only mutation
- Certification regression

Run:

```bash
cd frontend && node --test app/lib/executive-time/executiveTimeTransitionCertification.test.ts
```

## Isolation Summary

No modifications to:

- Dashboard, Assistant, Timeline, Time Panel UI
- Scenario, Risk, KPI runtimes
- Workspace, Scene, Executive Memory
- DS/INT engines

Library-only under `frontend/app/lib/executive-time/`.

## Deferred Features

- Automatic transitions
- Entity/workflow execution
- Persistence
- UI synchronization
- ML / prediction
- User approval interaction flows

## Next Phase

**APP-1:6 — Executive Time Priority Engine**

Temporal priority scoring (Critical, Urgent, Soon, Normal, Later, Expired), priority resolution, urgency policies, escalation metadata, and priority contracts for future Dashboard and Assistant integration — without modifying UI or business engines.
