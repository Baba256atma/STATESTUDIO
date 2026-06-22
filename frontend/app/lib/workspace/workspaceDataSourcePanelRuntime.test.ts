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
  buildWorkspaceDataSourcePanelSnapshot,
  refreshWorkspaceDataSourcePanelMetadata,
  removeWorkspaceDataSourcePanelSource,
  resetWorkspaceDataSourcePanelForTests,
  selectWorkspaceDataSourcePanelSource,
} from "./workspaceDataSourcePanelRuntime.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourcePanelForTests();
});

test("lists workspace-scoped data sources with status and metadata counts", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_inventory",
    name: "inventory",
    type: "csv",
    status: "connected",
    metadata: {
      fileName: "inventory.csv",
      rowCount: 12,
      columnCount: 4,
      fileSize: 2048,
      uploadTime: "2026-06-20T00:00:00.000Z",
    },
  });
  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_orders",
    name: "orders",
    type: "csv",
    status: "processing",
    metadata: {
      fileName: "orders.csv",
      rowCount: 8,
      columnCount: 3,
    },
  });

  setActiveWorkspace(workspaceA.workspaceId);
  const snapshot = buildWorkspaceDataSourcePanelSnapshot(workspaceA.workspaceId);

  assert.equal(snapshot.rows.length, 2);
  assert.equal(snapshot.rows[0]?.fileName, "inventory.csv");
  assert.equal(snapshot.rows[0]?.statusLabel, "Connected");
  assert.equal(snapshot.rows[0]?.rowCount, 12);
  assert.equal(snapshot.rows[0]?.columnCount, 4);
  assert.equal(buildWorkspaceDataSourcePanelSnapshot(workspaceB.workspaceId).rows.length, 0);
});

test("selects, refreshes, and removes workspace data sources", () => {
  const workspace = createWorkspace("Finance Workspace");
  registerWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_suppliers",
    name: "suppliers",
    type: "csv",
    status: "connected",
    metadata: {
      fileName: "suppliers.csv",
      rowCount: 5,
      columnCount: 2,
      uploadTime: "2026-06-20T00:00:00.000Z",
    },
  });

  const selected = selectWorkspaceDataSourcePanelSource(workspace.workspaceId, "wds_suppliers");
  assert.equal(selected.success, true);
  assert.equal(selected.snapshot.selectedSource?.fileName, "suppliers.csv");

  const refreshed = refreshWorkspaceDataSourcePanelMetadata(workspace.workspaceId, "wds_suppliers");
  assert.equal(refreshed.success, true);
  assert.equal(refreshed.snapshot.selectedSource?.rowCount, 5);
  assert.equal(refreshed.snapshot.selectedSource?.columnCount, 2);

  const removed = removeWorkspaceDataSourcePanelSource(workspace.workspaceId, "wds_suppliers");
  assert.equal(removed.success, true);
  assert.equal(removed.snapshot.rows.length, 0);
});

test("does not expose data sources from another workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerWorkspaceDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_private",
    name: "private",
    type: "csv",
    status: "connected",
    metadata: { fileName: "private.csv", rowCount: 1, columnCount: 1 },
  });

  setActiveWorkspace(workspaceB.workspaceId);
  const snapshot = buildWorkspaceDataSourcePanelSnapshot();
  assert.equal(snapshot.workspaceId, workspaceB.workspaceId);
  assert.equal(snapshot.rows.length, 0);

  const removeAttempt = removeWorkspaceDataSourcePanelSource(workspaceB.workspaceId, "wds_private");
  assert.equal(removeAttempt.success, false);
  assert.equal(buildWorkspaceDataSourcePanelSnapshot(workspaceA.workspaceId).rows.length, 1);
});
