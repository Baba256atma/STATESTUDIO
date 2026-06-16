import test from "node:test";
import assert from "node:assert/strict";

import type { DataSourceRegistrySnapshot } from "./dataSourceRegistryContract.ts";
import {
  listDataSources,
  resetDataSourceRegistryForTests,
  setDataSourceRegistryPersistenceAdapterForTests,
} from "./dataSourceRegistryRuntime.ts";
import { DS_1_2_FILE_UPLOAD_RUNTIME_TAG } from "./dataSourceUploadContract.ts";
import {
  extractRecordCount,
  readSourceMetadata,
  uploadDataSource,
  validateFile,
} from "./dataSourceUploadRuntime.ts";

type TestFile = Readonly<{
  name: string;
  type: string;
  size: number;
  lastModified: number;
  text: () => Promise<string>;
}>;

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

function makeFile(input: {
  name: string;
  type?: string;
  body?: string;
  lastModified?: number;
}): TestFile {
  const body = input.body ?? "";
  return Object.freeze({
    name: input.name,
    type: input.type ?? "",
    size: body.length,
    lastModified: input.lastModified ?? Date.parse("2026-06-16T12:00:00.000Z"),
    text: async () => body,
  });
}

test.beforeEach(() => {
  resetDataSourceRegistryForTests();
  installMemoryAdapter();
});

test("exports DS:1:2 freeze tag", () => {
  assert.equal(DS_1_2_FILE_UPLOAD_RUNTIME_TAG, "[DS:1:2_FILE_UPLOAD_RUNTIME]");
});

test("A — upload CSV registers metadata with extracted record count", async () => {
  const file = makeFile({
    name: "inventory.csv",
    type: "text/csv",
    body: "sku,count\nA,10\nB,20\n",
  });

  const result = await uploadDataSource(file);

  assert.equal(validateFile(file).sourceType, "csv");
  assert.equal(result.success, true);
  assert.equal(result.source?.sourceName, "inventory");
  assert.equal(result.source?.sourceType, "csv");
  assert.equal(result.source?.recordCount, 2);
  assert.equal(listDataSources().length, 1);
});

test("B — upload XLSX registers workbook metadata only", async () => {
  const file = makeFile({
    name: "demand.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: "binary-placeholder",
  });

  const result = await uploadDataSource(file);

  assert.equal(result.success, true);
  assert.equal(result.source?.sourceName, "demand");
  assert.equal(result.source?.sourceType, "excel");
  assert.equal(result.source?.recordCount, 0);
});

test("C — upload JSON registers metadata with array record count", async () => {
  const file = makeFile({
    name: "signals.json",
    type: "application/json",
    body: JSON.stringify({ records: [{ id: 1 }, { id: 2 }, { id: 3 }] }),
  });

  const metadata = await readSourceMetadata(file);
  const result = await uploadDataSource(file);

  assert.equal(metadata?.recordCount, 3);
  assert.equal(await extractRecordCount(file, "json"), 3);
  assert.equal(result.success, true);
  assert.equal(result.source?.sourceType, "json");
  assert.equal(result.source?.recordCount, 3);
});

test("D — unsupported files are rejected without registry mutation", async () => {
  const file = makeFile({
    name: "briefing.pdf",
    type: "application/pdf",
    body: "%PDF",
  });

  const validation = validateFile(file);
  const result = await uploadDataSource(file);

  assert.equal(validation.valid, false);
  assert.equal(validation.reason, "unsupported_file_type");
  assert.equal(result.success, false);
  assert.equal(result.reason, "unsupported_file_type");
  assert.equal(listDataSources().length, 0);
});

