# MRP:5B:2 — Governance Runtime State Report

**Tag:** `[MRP_5B2_RUNTIME]`

**Version:** 5B.2.0

**Date:** 2026-06-13

## Objective

Integrate Governance into MRP runtime with launchable, routable, selectable workspace behavior, preserved object context, and Dashboard tab only.

## State Model

`governanceWorkspaceState.ts` owns the canonical runtime store:

| Field | Type | Purpose |
| --- | --- | --- |
| `workspaceId` | `"governance"` | Fixed workspace identity |
| `selectedObjectId` | `string \| null` | Read-only object context from route / MRP snapshot |
| `approvalStatus` | `pending_review \| awaiting_authority \| ready_for_review \| unknown` | Approval posture |
| `policyStatus` | `aligned \| partial \| unknown` | Policy alignment posture |
| `constraintStatus` | `clear \| review_required \| unknown` | Constraint review posture |
| `phase` | `loading \| ready \| empty \| closed` | Mount lifecycle phase |
| `revision` | `number` | Monotonic publish revision |
| `signature` | `string` | Dedupe key for publish guard |

## Modules Created / Updated

| Module | Purpose |
| --- | --- |
| `governance/governanceWorkspaceState.ts` | Runtime state store — publish, subscribe, hydrate, teardown, context sync |
| `governance/governanceWorkspaceStateViewMapper.ts` | Maps runtime state → panel headlines and view model |
| `governance/useGovernanceWorkspaceState.ts` | `useSyncExternalStore` hook + view hook (SSR-safe server snapshot) |
| `governance/useSyncGovernanceWorkspaceContext.ts` | Syncs `selectedObjectId` from MRP context (read-only) |
| `object-panel/governanceWorkspaceRouteRuntime.ts` | Route commit — `setDashboardMode("governance")`, Dashboard tab only |
| `governance/governanceWorkspaceRuntime.ts` | Delegates hydrate/build to runtime state store |
| `components/.../governance/GovernanceWorkspace.tsx` | Wired to state hooks, context sync, mount/unmount lifecycle |
| `screens/HomeScreen.tsx` | Governance launch handoff via `commitGovernanceWorkspaceRoute` |

## Integration

| Layer | Change |
| --- | --- |
| `governanceWorkspaceContract.ts` | Version `5B.2.0`; view source includes `governance_workspace_runtime_state`; `selectedObjectId` on view |
| `governanceWorkspaceRuntime.ts` | Runtime contract tag → `[MRP_5B2_RUNTIME]`; build view from state store |
| `HomeScreen.tsx` | Certified governance workspace launch path (Dashboard tab, object route preserved) |

## Acceptance Criteria

| ID | Criterion | Status |
| --- | --- | --- |
| A | Workspace launches | **Pass** — registry resolves `governance_workspace`; route commit sets `dashboardMode: governance` + Dashboard tab |
| B | Workspace closes correctly | **Pass** — `teardownGovernanceWorkspaceStateOnUnmount` sets `phase: closed` on unmount |
| C | Object context survives | **Pass** — `syncGovernanceWorkspaceContext` resolves route → props → MRP snapshot; survives remount |
| D | No hydration warnings | **Pass** — `getGovernanceWorkspaceStateServerSnapshot()` returns loading phase for SSR/client parity |
| E | No runtime errors | **Pass** — build and tests green |

## Hydration Safety

- Server snapshot: `phase: "loading"`, `selectedObjectId: null`
- Client hydrates on mount → `phase: "ready"`
- `useGovernanceWorkspaceState` uses `useSyncExternalStore` with dedicated server snapshot getter

## Dashboard Tab Only

`commitGovernanceWorkspaceRoute` dispatches:

```typescript
dispatch({ type: "setMRPTab", tab: "dashboard" });
```

No Assistant tab routing is introduced for Governance.

## Tests

| Suite | Count | Result |
| --- | --- | --- |
| `governanceWorkspaceState.test.ts` | 11 | Pass |
| `governanceWorkspaceFoundation.test.ts` | 8 | Pass |
| `governanceWorkspaceRouteRuntime.test.ts` | 3 | Pass |
| **Total** | **22** | **Pass** |

## Build

`npm run build` — **Pass**

## Governance Does NOT (unchanged from 5B:1)

- generate forecasts
- create scenarios
- execute decisions
- replace Advisory
- replace War Room
- write to scene
- mutate objects

## Tag Verification

Runtime traces emit `[MRP_5B2_RUNTIME]`; state traces emit `[GOVERNANCE_STATE]`.
