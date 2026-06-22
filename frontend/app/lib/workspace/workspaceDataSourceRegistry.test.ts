import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceDataSources } from "./workspaceContextResolver.ts";
import {
  getActiveWorkspaceDataSources,
  getWorkspaceDataSource,
  getWorkspaceDataSourceRegistrySnapshot,
  listWorkspaceDataSources,
  registerWorkspaceDataSource,
  removeWorkspaceDataSource,
  resetWorkspaceDataSourcesForTests,
  updateWorkspaceDataSource,
  WORKSPACE_DATA_SOURCE_REGISTRY_VERSION,
} from "./workspaceDataSourceRegistry.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
});

test("registers workspace-scoped data sources with canonical contract fields", () => {
  const workspace = createWorkspace("Finance Workspace");
  const result = registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    name: "Revenue CSV",
    type: "csv",
    status: "empty",
    createdAt: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(result.success, true);
  assert.ok(result.dataSource);
  assert.equal(result.dataSource.contractVersion, WORKSPACE_DATA_SOURCE_REGISTRY_VERSION);
  assert.equal(result.dataSource.workspaceId, workspace.workspaceId);
  assert.equal(result.dataSource.name, "Revenue CSV");
  assert.equal(result.dataSource.type, "csv");
  assert.equal(result.dataSource.status, "empty");
  assert.equal(typeof result.dataSource.dataSourceId, "string");
  assert.equal(typeof result.dataSource.createdAt, "string");
  assert.equal(typeof result.dataSource.updatedAt, "string");
});

test("keeps data source registries isolated by workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    name: "Pipeline API",
    type: "api",
    status: "connected",
  });

  assert.equal(listWorkspaceDataSources(workspaceA.workspaceId).length, 1);
  assert.equal(listWorkspaceDataSources(workspaceB.workspaceId).length, 0);
  assert.equal(getWorkspaceDataSources(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceDataSources(workspaceB.workspaceId).length, 0);

  const source = listWorkspaceDataSources(workspaceA.workspaceId)[0];
  assert.ok(source);
  assert.equal(getWorkspaceDataSource(workspaceB.workspaceId, source.dataSourceId), null);
});

test("switches active workspace data source context on workspace selection", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    name: "Forecast Excel",
    type: "excel",
    status: "processing",
  });
  registerWorkspaceDataSource({
    workspaceId: workspaceB.workspaceId,
    name: "Warehouse DB",
    type: "database",
    status: "connected",
  });

  setActiveWorkspace(workspaceA.workspaceId);
  assert.equal(getActiveWorkspaceId(), workspaceA.workspaceId);
  assert.equal(getActiveWorkspaceDataSources().length, 1);
  assert.equal(getActiveWorkspaceDataSources()[0]?.name, "Forecast Excel");

  setActiveWorkspace(workspaceB.workspaceId);
  assert.equal(getActiveWorkspaceId(), workspaceB.workspaceId);
  assert.equal(getActiveWorkspaceDataSources().length, 1);
  assert.equal(getActiveWorkspaceDataSources()[0]?.name, "Warehouse DB");
});

test("updates and removes workspace data sources in place", () => {
  const workspace = createWorkspace("Operations Workspace");
  const registered = registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_ops_csv",
    name: "Ops CSV",
    type: "csv",
    status: "empty",
  });
  assert.equal(registered.success, true);

  const updated = updateWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_ops_csv",
    name: "Ops CSV Updated",
    status: "connected",
    updatedAt: "2026-06-20T01:00:00.000Z",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.dataSource?.name, "Ops CSV Updated");
  assert.equal(updated.dataSource?.status, "connected");

  const removed = removeWorkspaceDataSource(workspace.workspaceId, "wds_ops_csv");
  assert.equal(removed.success, true);
  assert.equal(listWorkspaceDataSources(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceDataSourceRegistrySnapshot().byWorkspace[workspace.workspaceId]?.length ?? 0, 0);
});

test("rejects duplicate data source ids within the same workspace", () => {
  const workspace = createWorkspace("Duplicate Guard Workspace");
  const first = registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_duplicate",
    name: "Primary Source",
    type: "csv",
  });
  const second = registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_duplicate",
    name: "Duplicate Source",
    type: "excel",
  });

  assert.equal(first.success, true);
  assert.equal(second.success, false);
  assert.equal(second.reason, "duplicate_data_source");
});
