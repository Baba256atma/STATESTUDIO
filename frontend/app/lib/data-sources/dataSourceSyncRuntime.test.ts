import test from "node:test";
import assert from "node:assert/strict";

import type { DataSourceRegistrySnapshot } from "./dataSourceRegistryContract.ts";
import {
  registerDataSource,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
} from "./dataSourceRegistryRuntime.ts";
import { buildDataSourceManagerSnapshot } from "./dataSourceManagerRuntime.ts";
import { DS_1_5_RUNTIME_SYNC_TAG } from "./dataSourceSyncContract.ts";
import {
  markSourceStale,
  refreshSource,
  resolveDataSourceSyncState,
  syncDataSource,
} from "./dataSourceSyncRuntime.ts";

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

test("exports DS:1:5 freeze tag", () => {
  assert.equal(DS_1_5_RUNTIME_SYNC_TAG, "[DS:1:5_RUNTIME_SYNC]");
});

test("A — sync state is visible through manager rows", () => {
  registerDataSource({
    sourceId: "source-warning",
    sourceName: "Inventory CSV",
    sourceType: "csv",
    sourceStatus: "registered",
    recordCount: 10,
  });

  const snapshot = buildDataSourceManagerSnapshot();

  assert.equal(snapshot.rows[0]?.syncState, "warning");
  assert.equal(snapshot.rows[0]?.syncLabel, "Warning");
});

test("B — sync state updates from warning to healthy to out of sync", () => {
  const registered = registerDataSource({
    sourceId: "source-sync",
    sourceName: "Supplier CSV",
    sourceType: "csv",
    sourceStatus: "registered",
    recordCount: 4,
  });

  assert.equal(registered.success, true);
  assert.equal(resolveDataSourceSyncState(registered.source!).syncLabel, "Warning");

  const synced = syncDataSource({
    sourceId: "source-sync",
    syncedAt: "2026-06-16T13:00:00.000Z",
  });

  assert.equal(synced.success, true);
  assert.equal(synced.reason, "synced");
  assert.equal(synced.sync?.syncLabel, "Healthy");
  assert.equal(synced.source?.sourceStatus, "active");
  assert.equal(synced.source?.lastSyncAt, "2026-06-16T13:00:00.000Z");

  const stale = markSourceStale("source-sync");

  assert.equal(stale.success, true);
  assert.equal(stale.reason, "marked_stale");
  assert.equal(stale.sync?.syncLabel, "Out Of Sync");
  assert.equal(stale.source?.sourceStatus, "inactive");
});

test("refreshSource performs manual sync only", () => {
  registerDataSource({
    sourceId: "source-refresh",
    sourceName: "Customer JSON",
    sourceType: "json",
  });

  const refreshed = refreshSource("source-refresh");

  assert.equal(refreshed.success, true);
  assert.equal(refreshed.reason, "synced");
  assert.equal(refreshed.sync?.manualSyncOnly, true);
  assert.equal(refreshed.sync?.automaticUpdatesEnabled, false);
});

