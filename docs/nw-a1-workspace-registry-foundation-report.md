# NW-A:1 Workspace Registry Foundation Report

Required tags:
[NWA1_WORKSPACE_REGISTRY]
[WORKSPACE_STORE_READY]
[ACTIVE_WORKSPACE_POINTER]
[DEMO_WORKSPACE_MIGRATED]
[NW_ARCHITECTURE_FOUNDATION]

## Summary

NW-A:1 adds the foundational multi-workspace registry for Nexora Type-C without changing current user behavior. Existing demo runtime ownership remains unchanged; scene objects, dashboard state, assistant state, routing, styling, and navigation continue to operate as before.

## Deliverables

- Workspace contract: `frontend/app/lib/workspace/workspaceRegistryContract.ts`
- Workspace registry store: `frontend/app/lib/workspace/workspaceRegistryStore.ts`
- Active workspace resolver: `frontend/app/lib/workspace/activeWorkspaceResolver.ts`
- Demo workspace migration: default registry state wraps current runtime in `Demo Workspace`
- Diagnostic hooks: development-safe `[WorkspaceRegistry]` and `[ActiveWorkspace]` logs via the existing diagnostic switch

## Contract

The canonical workspace shape includes:

- `workspaceId`
- `workspaceName`
- `status`: `active` or `archived`
- `createdAt`
- `updatedAt`
- `lastOpenedAt`
- Optional placeholders: `domain`, `objectCount`, `dataSourceCount`, `metadata`

## Runtime Behavior

The registry initializes with a single active workspace:

- `workspaceId`: `demo_workspace`
- `workspaceName`: `Demo Workspace`
- `status`: `active`

`getActiveWorkspace()` now resolves this workspace context for future systems. The manager workspace shell initializes the registry idempotently at runtime, but no UI consumes it yet.

## Safety Notes

- MRP architecture unchanged
- Dashboard unchanged
- Assistant unchanged
- Scene topology unchanged
- Object rendering unchanged
- Routing unchanged
- CSS and left navigation unchanged

## Verification

- Added focused registry tests in `workspaceRegistryStore.test.ts`
- `node --test app/lib/workspace/workspaceRegistryStore.test.ts` passes
- `npm run build` passes
