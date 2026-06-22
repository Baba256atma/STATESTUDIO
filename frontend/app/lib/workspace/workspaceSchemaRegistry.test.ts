import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import {
  DATA_SOURCE_SCHEMA_CONTRACT,
  DATA_SOURCE_SCHEMA_TAGS,
  dataSourceSchemaProfileIsComplete,
} from "./dataSourceSchemaContract.ts";
import {
  discoverAndSaveWorkspaceCsvSchema,
  discoverCsvDataSourceSchema,
  getWorkspaceDataSourceSchema,
  listWorkspaceDataSourceSchemas,
  removeWorkspaceDataSourceSchema,
  resetWorkspaceSchemaRegistryForTests,
  saveWorkspaceDataSourceSchema,
} from "./workspaceSchemaRegistry.ts";
import {
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";
import {
  resetWorkspaceCsvUploadForTests,
  uploadWorkspaceCsv,
} from "./workspaceCsvUploadRuntime.ts";

type TestCsvFile = Readonly<{
  name: string;
  type: string;
  size: number;
  text: () => Promise<string>;
}>;

function makeCsvFile(input: {
  name: string;
  body: string;
}): TestCsvFile {
  return Object.freeze({
    name: input.name,
    type: "text/csv",
    size: input.body.length,
    text: async () => input.body,
  });
}

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceCsvUploadForTests();
  resetWorkspaceSchemaRegistryForTests();
});

test("exports DS-1:1 schema contract with required profile fields", () => {
  assert.equal(DATA_SOURCE_SCHEMA_CONTRACT.contractVersion, "DS-1:1");
  assert.deepEqual(DATA_SOURCE_SCHEMA_CONTRACT.supportedSourceTypes, ["csv"]);
  assert.deepEqual(DATA_SOURCE_SCHEMA_TAGS, ["[DS11]", "[SCHEMA_DISCOVERY]"]);
  assert.equal(DATA_SOURCE_SCHEMA_CONTRACT.profileFields.includes("columnNames"), true);
  assert.equal(DATA_SOURCE_SCHEMA_CONTRACT.profileFields.includes("duplicateColumns"), true);
});

test("discovers CSV schema profile with column metadata", () => {
  const workspace = createWorkspace("Schema Workspace");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_inventory",
    fileName: "inventory.csv",
    csvText: "sku,name,count,notes,notes\nA-1,Widget,10,,dup\nA-2,Gadget,20,,dup\n",
  });

  assert.equal(schema.fileName, "inventory.csv");
  assert.equal(schema.rowCount, 2);
  assert.equal(schema.columnCount, 5);
  assert.deepEqual(schema.columnNames, ["sku", "name", "count", "notes", "notes"]);
  assert.equal(schema.detectedTypes.length, 5);
  assert.equal(schema.detectedTypes[0], "string");
  assert.equal(schema.detectedTypes[2], "number");
  assert.equal(schema.emptyColumns.includes("notes"), true);
  assert.deepEqual(schema.duplicateColumns, ["notes"]);
  assert.equal(dataSourceSchemaProfileIsComplete(schema), true);
});

test("detects empty columns and mixed types as string", () => {
  const workspace = createWorkspace("Empty Column Workspace");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_mixed",
    fileName: "mixed.csv",
    csvText: "id,blank,score,active,started\n1,,10,true,2024-01-01\n2,,20,false,2024-02-01\n",
  });

  assert.equal(schema.emptyColumns.includes("blank"), true);
  assert.equal(schema.detectedTypes[schema.columnNames.indexOf("score")], "number");
  assert.equal(schema.detectedTypes[schema.columnNames.indexOf("active")], "boolean");
  assert.equal(schema.detectedTypes[schema.columnNames.indexOf("started")], "date");
});

test("saves and updates workspace-scoped schema profiles", () => {
  const workspace = createWorkspace("Registry Workspace");
  const created = discoverAndSaveWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_orders",
    fileName: "orders.csv",
    csvText: "order_id,amount\n100,42\n101,55\n",
  });

  assert.equal(created.success, true);
  assert.equal(created.created, true);
  assert.equal(created.schema?.rowCount, 2);

  const updated = saveWorkspaceDataSourceSchema({
    ...created.schema!,
    rowCount: 3,
    updatedAt: "2026-06-20T12:00:00.000Z",
  });

  assert.equal(updated.success, true);
  assert.equal(updated.created, false);
  assert.equal(updated.reason, "updated");
  assert.equal(getWorkspaceDataSourceSchema(workspace.workspaceId, "wds_orders")?.rowCount, 3);
});

test("keeps schema registries isolated by workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  discoverAndSaveWorkspaceCsvSchema({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_a",
    fileName: "inventory.csv",
    csvText: "sku,count\nA,1\n",
  });

  assert.equal(listWorkspaceDataSourceSchemas(workspaceA.workspaceId).length, 1);
  assert.equal(listWorkspaceDataSourceSchemas(workspaceB.workspaceId).length, 0);
  assert.equal(getWorkspaceDataSourceSchema(workspaceB.workspaceId, "wds_a"), null);

  const removed = removeWorkspaceDataSourceSchema(workspaceB.workspaceId, "wds_a");
  assert.equal(removed.success, false);
  assert.equal(listWorkspaceDataSourceSchemas(workspaceA.workspaceId).length, 1);
});

test("uploads CSV and discovers schema without object generation", async () => {
  const workspace = createWorkspace("Upload Schema Workspace");
  const result = await uploadWorkspaceCsv(
    makeCsvFile({
      name: "pipeline.csv",
      body: "id,region,revenue\n1,East,1000\n2,West,1500\n",
    }),
    workspace.workspaceId
  );

  assert.equal(result.success, true);
  assert.ok(result.dataSource);

  const schema = getWorkspaceDataSourceSchema(
    workspace.workspaceId,
    result.dataSource!.dataSourceId
  );
  assert.ok(schema);
  assert.equal(schema.fileName, "pipeline.csv");
  assert.equal(schema.rowCount, 2);
  assert.equal(schema.columnCount, 3);
  assert.deepEqual(schema.columnNames, ["id", "region", "revenue"]);
  assert.equal(schema.detectedTypes[2], "number");
});

test("removes schema when workspace data source schema entry is deleted", () => {
  const workspace = createWorkspace("Remove Schema Workspace");
  discoverAndSaveWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_temp",
    fileName: "temp.csv",
    csvText: "id,value\n1,alpha\n",
  });

  const removed = removeWorkspaceDataSourceSchema(workspace.workspaceId, "wds_temp");
  assert.equal(removed.success, true);
  assert.equal(listWorkspaceDataSourceSchemas(workspace.workspaceId).length, 0);
});
