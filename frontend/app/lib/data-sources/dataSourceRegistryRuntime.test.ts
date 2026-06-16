import test from "node:test";
import assert from "node:assert/strict";

import {
  DATA_SOURCE_REGISTRY_VERSION,
  DS_1_1_DATA_SOURCE_REGISTRY_TAG,
  type DataSourceRegistrySnapshot,
} from "./dataSourceRegistryContract.ts";
import {
  getDataSourceRegistrySnapshot,
  listDataSources,
  registerDataSource,
  removeDataSource,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
  updateDataSource,
} from "./dataSourceRegistryRuntime.ts";

function installMemoryAdapter(initial: DataSourceRegistrySnapshot | null = null): {
  read(): DataSourceRegistrySnapshot | null;
} {
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
  return { read: () => snapshot };
}

test.beforeEach(() => {
  resetDataSourceRegistryForTests();
});

test("exports DS:1:1 freeze tag", () => {
  assert.equal(DS_1_1_DATA_SOURCE_REGISTRY_TAG, "[DS:1:1_DATA_SOURCE_REGISTRY]");
});

test("A — create source registers canonical source model", () => {
  installMemoryAdapter();

  const result = registerDataSource({
    sourceId: "source-inventory-csv",
    sourceName: "Inventory CSV",
    sourceType: "CSV",
    recordCount: 42,
    createdAt: "2026-06-16T10:00:00.000Z",
  });

  assert.equal(result.success, true);
  assert.equal(result.source?.sourceId, "source-inventory-csv");
  assert.equal(result.source?.sourceName, "Inventory CSV");
  assert.equal(result.source?.sourceType, "csv");
  assert.equal(result.source?.sourceStatus, "registered");
  assert.equal(result.source?.recordCount, 42);
  assert.equal(listDataSources().length, 1);
});

test("B — edit source updates metadata without changing identity", () => {
  installMemoryAdapter();
  registerDataSource({
    sourceId: "source-manual",
    sourceName: "Manual Intake",
    sourceType: "manual entry",
    recordCount: 3,
  });

  const result = updateDataSource({
    sourceId: "source-manual",
    sourceName: "Manual Intake Updated",
    sourceStatus: "active",
    lastSyncAt: "2026-06-16T11:00:00.000Z",
    recordCount: 5,
  });

  assert.equal(result.success, true);
  assert.equal(result.source?.sourceId, "source-manual");
  assert.equal(result.source?.sourceName, "Manual Intake Updated");
  assert.equal(result.source?.sourceStatus, "active");
  assert.equal(result.source?.lastSyncAt, "2026-06-16T11:00:00.000Z");
  assert.equal(result.source?.recordCount, 5);
});

test("C — delete source removes only registry entry", () => {
  installMemoryAdapter();
  registerDataSource({
    sourceId: "source-json",
    sourceName: "Signals JSON",
    sourceType: "json",
  });

  const removed = removeDataSource("source-json");

  assert.equal(removed.success, true);
  assert.equal(removed.source?.sourceName, "Signals JSON");
  assert.deepEqual(listDataSources(), []);
});

test("D — persist source survives registry reinitialization", () => {
  const adapter = installMemoryAdapter();
  registerDataSource({
    sourceId: "source-excel",
    sourceName: "Demand Workbook",
    sourceType: "excel",
    sourceStatus: "active",
    recordCount: 10,
  });

  const persisted = adapter.read();
  assert.equal(persisted?.version, DATA_SOURCE_REGISTRY_VERSION);
  assert.equal(persisted?.sources.length, 1);

  resetDataSourceRegistryForTests();
  installMemoryAdapter(persisted);

  const loaded = listDataSources();
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0]?.sourceId, "source-excel");
  assert.equal(loaded[0]?.sourceType, "excel");
  assert.equal(getDataSourceRegistrySnapshot().sources.length, 1);
});

test("registry rejects duplicate and invalid source inputs", () => {
  installMemoryAdapter();
  assert.equal(
    registerDataSource({
      sourceId: "source-api",
      sourceName: "Future API",
      sourceType: "future api connector",
    }).success,
    true
  );
  assert.equal(
    registerDataSource({
      sourceId: "source-api",
      sourceName: "Future API Duplicate",
      sourceType: "future_api_connector",
    }).reason,
    "duplicate_source"
  );
  assert.equal(
    registerDataSource({
      sourceName: "",
      sourceType: "csv",
    }).reason,
    "invalid_source"
  );
});

