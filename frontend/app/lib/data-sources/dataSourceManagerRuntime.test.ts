import test from "node:test";
import assert from "node:assert/strict";

import type { DataSourceRegistrySnapshot } from "./dataSourceRegistryContract.ts";
import {
  listDataSources,
  registerDataSource,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
} from "./dataSourceRegistryRuntime.ts";
import { DS_1_3_DATA_SOURCE_MANAGER_TAG } from "./dataSourceManagerContract.ts";
import {
  buildDataSourceManagerSnapshot,
  deleteDataSource,
  refreshDataSource,
  viewDataSource,
} from "./dataSourceManagerRuntime.ts";
import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";

function installMemoryAdapter(initial: DataSourceRegistrySnapshot | null = null): void {
  let snapshot = initial;
  setDataSourceRegistryPersistenceAdapterForTests(
    Object.freeze({
      load: () => snapshot,
      save: (next) => {
        snapshot = next;
      },
      clear: () => {
        snapshot = null;
      },
    })
  );
}

test.beforeEach(() => {
  resetDataSourceRegistryForTests();
  installMemoryAdapter();
});

test("exports DS:1:3 freeze tag", () => {
  assert.equal(DS_1_3_DATA_SOURCE_MANAGER_TAG, "[DS:1:3_DATA_SOURCE_MANAGER]");
});

test("A — manager snapshot exposes registry rows", () => {
  registerDataSource({
    sourceId: "source-csv",
    sourceName: "Inventory CSV",
    sourceType: "csv",
    sourceStatus: "registered",
    recordCount: 42,
  });

  const snapshot = buildDataSourceManagerSnapshot();

  assert.equal(snapshot.sourceCount, 1);
  assert.equal(snapshot.rows[0]?.sourceName, "Inventory CSV");
  assert.equal(snapshot.rows[0]?.typeLabel, "CSV");
  assert.equal(snapshot.rows[0]?.statusLabel, "Registered");
  assert.equal(snapshot.rows[0]?.syncLabel, "Warning");
  assert.equal(snapshot.rows[0]?.recordsLabel, "42");
  assert.equal(snapshot.rows[0]?.lastSyncLabel, "Never");
});

test("B — view refresh and delete actions are functional", () => {
  registerDataSource({
    sourceId: "source-json",
    sourceName: "Signals JSON",
    sourceType: "json",
    recordCount: 3,
  });

  const viewed = viewDataSource("source-json");
  assert.equal(viewed.success, true);
  assert.equal(viewed.action, "view");
  assert.equal(viewed.source?.sourceName, "Signals JSON");

  const refreshed = refreshDataSource("source-json");
  assert.equal(refreshed.success, true);
  assert.equal(refreshed.reason, "refreshed");
  assert.equal(refreshed.source?.sourceStatus, "active");
  assert.equal(refreshed.snapshot.rows[0]?.syncLabel, "Healthy");
  assert.ok(refreshed.source?.lastSyncAt);

  const deleted = deleteDataSource("source-json");
  assert.equal(deleted.success, true);
  assert.equal(deleted.reason, "deleted");
  assert.equal(listDataSources().length, 0);
});

test("C — sources dashboard context keeps operational workspace routing", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "sources",
  });

  assert.equal(plan.workspaceId, "operational");
  assert.equal(plan.mountTarget, "operational_workspace");
});

