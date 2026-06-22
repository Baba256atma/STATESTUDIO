# NW-B:9-5 Workspace Data Source Foundation Certification Report

Required tags:

[NWB95]
[DATA_SOURCE_FOUNDATION_CERTIFIED]
[WORKSPACE_DATA_PLATFORM_READY]
[DS1_READY]
[NW_B9_COMPLETE]

## Certification Result

**PASS**

The NW-B:9 workspace data source foundation is certified stable across registry, CSV upload, metadata capture, panel management, removal, isolation, ownership, and workspace switching. All validation gates and test scenarios passed. The platform is ready for DS-1.

## Scope

Certification covers the complete NW-B:9 data source foundation:

| Phase | Capability |
|---|---|
| NW-B:9-1 | Workspace data source registry |
| NW-B:9-2 | CSV upload manager |
| NW-B:9-3 | Data source panel |
| NW-B:9-4 | Workspace data source ownership and isolation |

## Deliverables

| Deliverable | Location |
|---|---|
| Certification contract | `frontend/app/lib/workspace/workspaceDataSourceFoundationCertificationContract.ts` |
| Certification runner | `frontend/app/lib/workspace/workspaceDataSourceFoundationCertification.ts` |
| Certification tests | `frontend/app/lib/workspace/workspaceDataSourceFoundationCertification.test.ts` |
| Registry (NW-B:9-1) | `frontend/app/lib/workspace/workspaceDataSourceRegistry.ts` |
| CSV upload (NW-B:9-2) | `frontend/app/lib/workspace/workspaceCsvUploadRuntime.ts` |
| Panel runtime (NW-B:9-3) | `frontend/app/lib/workspace/workspaceDataSourcePanelRuntime.ts` |
| Panel UI (NW-B:9-3) | `frontend/app/components/main-right-panel/workspace/operational/WorkspaceDataSourcePanel.tsx` |
| Ownership (NW-B:9-4) | `frontend/app/lib/workspace/workspaceDataSourceOwnershipContract.ts` |
| Isolation guard (NW-B:9-4) | `frontend/app/lib/workspace/workspaceDataSourceIsolationGuard.ts` |
| Owned resolver (NW-B:9-4) | `frontend/app/lib/workspace/workspaceDataSourceResolver.ts` |

## Certification Gates

| Gate | Name | Status | Evidence |
|---|---|---|---|
| A | Registry Created | PASS | Registry contract includes `workspaceId` and `dataSourceId`; snapshot version `NW-B:9-1`; registered sources carry required ownership fields |
| B | CSV Upload Works | PASS | `uploadWorkspaceCsv()` imports through `importWorkspaceDataSource()`; single and multi CSV upload scenarios succeeded |
| C | Metadata Captured | PASS | Upload captures `fileName`, `rowCount`, `columnCount`, `fileSize`; registry and panel expose metadata counts |
| D | Data Source Panel Works | PASS | Panel snapshot builder, UI component, and `OperationalWorkspace` sources context mount verified; multi-source list renders |
| E | Remove Works | PASS | Panel remove uses `removeOwnedWorkspaceDataSource()`; remove scenario leaves zero sources; missing source removal denied |
| F | Workspace Isolation Works | PASS | Workspace A/B each hold one source; cross-workspace read and update blocked |
| G | Ownership Works | PASS | Ownership verifier and isolation guard integrated in registry and resolver; cross-workspace bind denied; import scope valid |
| H | Workspace Switching Works | PASS | Active and context resolvers return correct per-workspace sources; owned bind succeeds in home workspace |
| I | No Runtime Errors | PASS | All seven certification scenarios passed |
| J | No Hydration Errors | PASS | Panel uses `useSyncExternalStore` with SSR fallbacks (`() => 0`, `() => null`); no `suppressHydrationWarning`; no direct panel-runtime localStorage reads |
| K | Build Passes | PASS | `npm run build` completed successfully |

## Test Scenarios

| Scenario | Status | Evidence |
|---|---|---|
| 1 — 1 Workspace + 0 CSV | PASS | Panel and resolver return zero sources for empty workspace |
| 2 — 1 Workspace + 1 CSV | PASS | `inventory.csv` uploaded with 2 rows and 3 columns; panel lists one source |
| 3 — 1 Workspace + Multiple CSV | PASS | Two CSV uploads registered; panel lists 2 workspace-scoped rows |
| 4 — Multiple Workspaces | PASS | Workspace A: `inventory.csv`; Workspace B: `sales.csv` |
| 5 — Workspace Switching | PASS | Active resolver and context resolver switch correctly; no cross-workspace read leak |
| 6 — CSV Remove | PASS | Selected source removed; panel and resolver return zero sources |
| 7 — Invalid CSV Upload | PASS | Empty CSV rejected with `empty_csv`; no registry entry created |

## Foundation Behavior

```text
Workspace A → inventory.csv
Workspace B → sales.csv

Switch workspace
  ↓
Resolver returns only that workspace's sources
  ↓
Cross-workspace read / update / delete / bind / import denied safely
```

Every data source record includes `workspaceId` and `dataSourceId`. All consumer paths should read and mutate through `workspaceDataSourceResolver.ts`.

## Diagnostics

Development-only diagnostics emitted across the foundation:

- `[WorkspaceDataSource] Registered | Updated | Removed`
- `[CsvUpload] Upload Success | Upload Failed`
- `[DataSourcePanel] Opened | Closed | Source Selected | Source Removed`
- `[DataSourceOwnership] Ownership Verified | Access Denied | Isolation Guard Triggered`

Certification completion diagnostic:

- `[WorkspaceDataSourceFoundation] Certification Complete`

## Verification Commands

```bash
cd frontend
npm run test:workspace-data-source-foundation-certification
npm run build
```

Certification runner invocation:

```bash
cd frontend
node --input-type=module -e "
import { runWorkspaceDataSourceFoundationCertification } from './app/lib/workspace/workspaceDataSourceFoundationCertification.ts';
const result = await runWorkspaceDataSourceFoundationCertification({ buildPassed: true, testsPassed: true });
console.log(result.result, result.certified);
"
```

Observed runner output: `PASS true`

Observed gate summary: `A:PASS B:PASS C:PASS D:PASS E:PASS F:PASS G:PASS H:PASS I:PASS J:PASS K:PASS`

Observed scenario summary: all seven scenarios `PASS`

Foundation test suite: 22 tests, 0 failures

## Acceptance Criteria

| Criterion | Status |
|---|---|
| All gates pass | PASS |
| Data source foundation stable | PASS |
| Ready for DS-1 | PASS |

## NW-B:9 Complete

With NW-B:9-5 certification passing, the workspace data source platform is frozen and ready for DS-1 engine integration. Future data source engines must consume registry state exclusively through the owned resolver path.
