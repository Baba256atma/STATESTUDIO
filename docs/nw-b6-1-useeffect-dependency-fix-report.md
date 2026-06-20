# NW-B:6.1 useEffect Dependency Fix Report

Required Tags:

- [NWB61_USEEFFECT_FIX]
- [FIXED_DYNAMIC_DEPENDENCY_ARRAY]
- [HOME_SCREEN_RUNTIME_STABLE]
- [NW_B6_RECOVERY_READY]

## Summary

Fixed the HomeScreen inspector-context `useEffect` dependency stability issue near line 17247. The effect no longer depends directly on mutable workspace arrays and model objects that can create unstable runtime dependency behavior during workspace/model transitions.

## Fix

- Added stable scalar signatures for workspace discovery/model context:
  - `workspaceGoalSignature`
  - `workspaceObjectSignature`
  - `workspaceDomainSignature`
  - `workspaceSituationSignature`
  - `workspaceDraftModelSignature`
  - `workspaceModelSignature`
  - `inspectorMessageSignature`
- Updated the inspector-context `useEffect` dependency array to use those signatures.
- Kept the dependency array fixed in length and order.
- Preserved the dispatched inspector payload and business logic.

## Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Console error disappears | PASS | Dependency array is fixed-length and no longer uses workspace arrays directly. |
| useEffect dependency array has fixed length | PASS | Dependency list is static and ordered. |
| Inspector context still dispatches correctly | PASS | Dispatch payload still includes domain, situation, goals, draft model, approved model, and workspace objects. |
| Workspace switching still works | PASS | Workspace context signatures are scoped by workspace-derived values. |
| Draft model approval still works | PASS | Approval regression tests pass. |
| Build passes | PASS | `npm run build` completes successfully. |
| No hydration errors | PASS | Production build completes. |
| No runtime errors | PASS | Focused workspace tests pass. |

## Verification

- `node --test app/lib/workspace/workspaceApprovedModelContract.test.ts app/lib/workspace/workspaceDraftModelContract.test.ts app/lib/workspace/workspaceGoalContract.test.ts app/lib/workspace/workspaceSituationContract.test.ts app/lib/workspace/workspaceDomainContract.test.ts app/lib/workspace/emptyWorkspaceContract.test.ts`
  - PASS: 28 tests
- `npm run build`
  - PASS

Known existing warnings:

- Node test runner reports `MODULE_TYPELESS_PACKAGE_JSON` for TypeScript ESM tests.
- Build reports stale `baseline-browser-mapping` data.

## Safety Review

- No business logic changed.
- No MRP architecture changed.
- No Scene architecture changed.
- No Assistant architecture changed.
- No Topology logic changed.
- No CSS or routing changed.

## Result

NW-B:6.1 recovery is complete. HomeScreen runtime dependencies are stable.

