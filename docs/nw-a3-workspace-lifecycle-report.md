# NW-A:3 Workspace Lifecycle Report

Required tags:
[NWA3_WORKSPACE_LIFECYCLE]
[SAFE_WORKSPACE_OPERATIONS]
[WORKSPACE_CREATION_READY]
[WORKSPACE_ARCHIVE_READY]
[WORKSPACE_DELETE_PROTECTED]
[NW_A3_COMPLETE]

## Summary

NW-A:3 adds workspace lifecycle management on top of the certified workspace registry and switcher. Users can now create, rename, duplicate, archive, and delete workspaces from the existing Workspaces left-nav section without route reloads or changes to MRP, dashboard, assistant, scene rendering, object rendering, topology, or CSS contracts.

## Deliverables

- Workspace Creation Modal: `WorkspaceSwitcherNavSection.tsx`
- Workspace Rename Action: registry mutation and workspace menu action
- Workspace Duplicate Action: registry shell copy with `Original Copy` naming
- Workspace Archive Action: status changes to `archived`; archived workspaces are hidden from the active switcher list
- Workspace Delete Action: confirmation dialog required
- Active Workspace Protection Logic: registry fallback selects Demo Workspace or next active workspace; last active workspace cannot be archived or deleted
- Lifecycle Diagnostics: `[WorkspaceLifecycle]` create, rename, duplicate, archive, and delete logs in development

## Ownership Model

Workspace remains the top-level container for future NW phases:

- Objects
- Relationships
- KPI
- Risks
- Scenarios
- Data Sources
- Dashboard State
- Assistant Context

NW-A:3 manages only the lifecycle shell and metadata. It does not generate domains, situations, goals, drafts, data sources, scenes, or object models.

## Safety Notes

- Create immediately activates an empty workspace.
- Rename preserves `workspaceId`.
- Duplicate preserves metadata and records `duplicatedFromWorkspaceId`.
- Archive preserves the workspace in the registry and hides it from the active list.
- Delete physically removes a workspace from the registry only after confirmation.
- The last active workspace cannot be archived or deleted.
- `activeWorkspaceId` is never left null after lifecycle operations.

## Verification

- `node --test app/lib/workspace/workspaceRegistryStore.test.ts app/lib/workspace/workspaceSelectionBinding.test.ts` passes
- `npm run build` passes
