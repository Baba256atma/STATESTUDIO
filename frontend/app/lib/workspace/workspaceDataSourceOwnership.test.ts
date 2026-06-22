import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import {
  registerWorkspaceDataSource,
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";
import {
  assertWorkspaceDataSourceOwnership,
  verifyWorkspaceDataSourceOwnership,
  workspaceDataSourceHasRequiredOwnership,
} from "./workspaceDataSourceOwnershipContract.ts";
import {
  guardWorkspaceDataSourceAccess,
  resetWorkspaceDataSourceIsolationGuardForTests,
} from "./workspaceDataSourceIsolationGuard.ts";
import {
  bindWorkspaceDataSource,
  importWorkspaceDataSource,
  removeOwnedWorkspaceDataSource,
  resolveActiveWorkspaceDataSources,
  resolveWorkspaceDataSource,
  resolveWorkspaceDataSources,
  updateOwnedWorkspaceDataSource,
} from "./workspaceDataSourceResolver.ts";
import { getWorkspaceDataSources } from "./workspaceContextResolver.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceIsolationGuardForTests();
});

test("requires workspaceId on every data source record", () => {
  const workspace = createWorkspace("Ownership Workspace");
  registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_inventory",
    name: "inventory",
    type: "csv",
    status: "connected",
    metadata: { fileName: "inventory.csv", rowCount: 3, columnCount: 2 },
  });

  const source = resolveWorkspaceDataSource(workspace.workspaceId, "wds_inventory");
  assert.ok(source);
  assert.equal(workspaceDataSourceHasRequiredOwnership(source), true);
  assert.equal(assertWorkspaceDataSourceOwnership(source, workspace.workspaceId), true);
});

test("denies cross-workspace read update delete bind and import access", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_inventory",
    name: "inventory",
    type: "csv",
    status: "connected",
    metadata: { fileName: "inventory.csv", rowCount: 2, columnCount: 2 },
  });
  registerWorkspaceDataSource({
    workspaceId: workspaceB.workspaceId,
    dataSourceId: "wds_sales",
    name: "sales",
    type: "csv",
    status: "connected",
    metadata: { fileName: "sales.csv", rowCount: 5, columnCount: 3 },
  });

  assert.equal(resolveWorkspaceDataSource(workspaceB.workspaceId, "wds_inventory"), null);
  assert.equal(
    updateOwnedWorkspaceDataSource({
      workspaceId: workspaceB.workspaceId,
      dataSourceId: "wds_inventory",
      status: "error",
    }).success,
    false
  );
  assert.equal(removeOwnedWorkspaceDataSource(workspaceB.workspaceId, "wds_inventory").success, false);
  assert.equal(bindWorkspaceDataSource(workspaceB.workspaceId, "wds_inventory").success, false);

  const denied = verifyWorkspaceDataSourceOwnership({
    action: "read",
    expectedWorkspaceId: workspaceB.workspaceId,
    dataSource: {
      workspaceId: workspaceA.workspaceId,
      dataSourceId: "wds_inventory",
    },
  });
  assert.equal(denied.owned, false);
  assert.equal(denied.reason, "cross_workspace_access_denied");

  const guard = guardWorkspaceDataSourceAccess({
    action: "read",
    workspaceId: workspaceB.workspaceId,
    dataSource: {
      workspaceId: workspaceA.workspaceId,
      dataSourceId: "wds_inventory",
    },
  });
  assert.equal(guard.allowed, false);
});

test("switching workspaces resolves the correct isolated data source lists", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_inventory",
    name: "inventory",
    type: "csv",
    metadata: { fileName: "inventory.csv", rowCount: 1, columnCount: 1 },
  });
  registerWorkspaceDataSource({
    workspaceId: workspaceB.workspaceId,
    dataSourceId: "wds_sales",
    name: "sales",
    type: "csv",
    metadata: { fileName: "sales.csv", rowCount: 1, columnCount: 1 },
  });

  setActiveWorkspace(workspaceA.workspaceId);
  assert.equal(resolveActiveWorkspaceDataSources()[0]?.metadata?.fileName, "inventory.csv");
  assert.equal(getWorkspaceDataSources(workspaceA.workspaceId).length, 1);

  setActiveWorkspace(workspaceB.workspaceId);
  assert.equal(resolveActiveWorkspaceDataSources()[0]?.metadata?.fileName, "sales.csv");
  assert.equal(resolveWorkspaceDataSources(workspaceA.workspaceId)[0]?.metadata?.fileName, "inventory.csv");
  assert.equal(resolveWorkspaceDataSources(workspaceB.workspaceId)[0]?.metadata?.fileName, "sales.csv");
});

test("imports data sources only into the requested workspace", () => {
  const workspace = createWorkspace("Import Workspace");
  const result = importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_imported",
    name: "suppliers",
    type: "csv",
    status: "connected",
    metadata: { fileName: "suppliers.csv", rowCount: 4, columnCount: 2 },
  });

  assert.equal(result.success, true);
  assert.equal(result.dataSource?.workspaceId, workspace.workspaceId);
  assert.equal(resolveWorkspaceDataSources(workspace.workspaceId).length, 1);
});
