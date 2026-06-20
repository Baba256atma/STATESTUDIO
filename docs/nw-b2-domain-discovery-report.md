# NW-B:2 Domain Discovery Report

Required Tags:

- [NWB2_DOMAIN_DISCOVERY]
- [WORKSPACE_DOMAIN_READY]
- [DOMAIN_SELECTION_COMPLETE]
- [DOMAIN_CONTEXT_SAVED]
- [SITUATION_DISCOVERY_READY]
- [NW_B2_COMPLETE]

## Summary

NW-B:2 introduces Domain Discovery as the first modeling step for empty Nexora workspaces. The `Start Modeling` entry point now opens a centralized Domain Discovery overlay, lets the user choose one first-party Nexora domain, saves that domain as workspace-scoped context, and advances to a Situation Discovery placeholder for NW-B:3.

This phase does not generate objects, KPIs, risks, scenarios, relationships, data sources, or topology.

## Delivered

- Domain Discovery overlay rendered through the existing workspace modal host.
- Workspace domain contract and runtime persistence.
- First-party Nexora domain options:
  - Manufacturing
  - Finance
  - Project Management
  - Supply Chain
  - Operations
  - Sales
  - Human Resources
  - Technology
  - Custom
- Single-select domain cards with active state.
- Disabled `Continue` action until a domain is selected.
- Workspace-scoped domain save operation with local runtime persistence.
- Situation Discovery placeholder handoff for NW-B:3.
- MRP domain awareness with `Selected Domain` or `No Domain Selected` messaging.
- Development diagnostics under `[DomainDiscovery]`.

## Architecture Notes

- `WorkspaceDomainSelection` is keyed by `workspaceId`, preserving separate domain context per workspace.
- Domain state is stored independently from model content so selecting a domain does not create business objects or topology.
- `WorkspaceModalHost` remains the single overlay authority for workspace and modeling flows.
- Scene rendering remains mounted and unchanged.
- MRP remains mounted and only receives read-only domain context.

## Acceptance Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| Start Modeling opens Domain Discovery | PASS | Empty workspace overlay calls `openDomainDiscoveryModal(workspaceId)`. |
| Domain cards render correctly | PASS | Domain options render as selectable cards in `DomainDiscoveryDialog`. |
| Single domain selection works | PASS | One `WorkspaceDomainId` is tracked per dialog and saved per workspace. |
| Continue disabled until selection | PASS | `Continue` is disabled until `selectedDomainId` exists. |
| Domain saved to workspace | PASS | `saveWorkspaceDomainSelection` persists a `WorkspaceDomainSelection` by `workspaceId`. |
| Workspace switching preserves domain | PASS | Domain lookup is workspace-scoped through `getWorkspaceDomainSelection(workspaceId)`. |
| MRP becomes domain-aware | PASS | `MainRightPanelShell` displays selected domain or empty domain state. |
| Scene remains stable | PASS | No scene, topology, or object generation path was changed. |
| No object generation occurs | PASS | Domain Discovery writes only domain selection state. |
| No runtime errors | PASS | Focused workspace/domain tests pass. |
| No hydration errors | PASS | Production build completes. |
| Build passes | PASS | `npm run build` completes successfully. |

## Verification

- `node --test app/lib/workspace/workspaceDomainContract.test.ts`
  - PASS: 4 tests
- `node --test app/lib/workspace/workspaceDomainContract.test.ts app/lib/workspace/emptyWorkspaceContract.test.ts app/lib/workspace/workspaceRegistryStore.test.ts app/lib/workspace/workspaceSelectionBinding.test.ts app/lib/workspace/workspaceOwnershipContract.test.ts`
  - PASS: 24 tests
- `npm run build`
  - PASS

Known existing warnings:

- Node test runner reports `MODULE_TYPELESS_PACKAGE_JSON` for TypeScript ESM tests.
- Build reports stale `baseline-browser-mapping` data.

## Safety Review

- Domain Discovery only stores workspace domain context.
- Situation Discovery is not implemented beyond a placeholder handoff.
- Goal Discovery is not implemented.
- Draft model generation is not implemented.
- Object, KPI, risk, scenario, relationship, data source, and topology generation are not implemented.
- Workspace registry, lifecycle, ownership, scene, MRP, assistant, routing, and topology contracts remain intact.

## Result

NW-B:2 is complete and ready for NW-B:3 Situation Discovery.

