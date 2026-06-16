import test from "node:test";
import assert from "node:assert/strict";

import type { DataSourceRegistrySnapshot } from "./dataSourceRegistryContract.ts";
import {
  registerDataSource,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
} from "./dataSourceRegistryRuntime.ts";
import {
  createObjectsFromCandidates,
  discoverSourceRecords,
  generateObjectCandidates,
  resetDataSourceObjectAutoCreationForTests,
  runDataSourceObjectAutoCreation,
} from "./dataSourceObjectAutoCreationRuntime.ts";
import {
  DATA_OBJECT_PIPELINE_COMPLETE_TAG,
  DS2_CERTIFIED_TAG,
} from "./dataSourceObjectAutoCreationContract.ts";
import { runDataSourceObjectAutoCreationCertification } from "./dataSourceObjectAutoCreationCertification.ts";

function installMemoryAdapter(): void {
  let snapshot: DataSourceRegistrySnapshot | null = null;
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
  resetDataSourceObjectAutoCreationForTests();
  installMemoryAdapter();
});

test("exports DS-2 freeze tags", () => {
  assert.equal(DS2_CERTIFIED_TAG, "[DS2_CERTIFIED]");
  assert.equal(DATA_OBJECT_PIPELINE_COMPLETE_TAG, "[DATA_OBJECT_PIPELINE_COMPLETE]");
});

test("pipeline creates objects with duplicate protection", () => {
  registerDataSource({
    sourceId: "source-project",
    sourceName: "Project CSV",
    sourceType: "csv",
    recordCount: 2,
  });

  const first = runDataSourceObjectAutoCreation({ sourceId: "source-project" });
  const second = runDataSourceObjectAutoCreation({ sourceId: "source-project" });

  assert.equal(first?.creation.created.length, 2);
  assert.equal(second?.creation.created.length, 0);
  assert.equal(second?.creation.skippedDuplicates, 2);
});

test("DS-2:6 certification passes all gates", () => {
  const result = runDataSourceObjectAutoCreationCertification();
  assert.equal(result.certified, true);
  assert.equal(result.gates.every((gate) => gate.status === "PASS"), true);
});

test("discovery and candidate generation produce typed records", () => {
  const source = registerDataSource({
    sourceId: "source-customer",
    sourceName: "Customer CSV",
    sourceType: "csv",
    recordCount: 1,
  }).source!;

  const discovery = discoverSourceRecords(source);
  const candidates = generateObjectCandidates(discovery);

  assert.equal(discovery.records[0]?.objectType, "customer");
  assert.equal(candidates.length, 1);
  assert.equal(createObjectsFromCandidates(candidates).created.length, 1);
});
