import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX,
  WORKSPACE_DATA_SOURCE_SCHEMA_TAGS,
  workspaceDataSourceSchemaProfileIsComplete,
} from "./workspaceDataSourceSchemaContract.ts";
import {
  buildSchemaContract,
  discoverWorkspaceCsvSchema,
  inferColumnTypes,
  inspectColumns,
  parseCsvMetadata,
} from "./workspaceDataSourceSchemaDiscovery.ts";
import { importWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import {
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import { resetPipelineWorkspaceObjectsForTests } from "./objectCreationPipeline.ts";
import {
  discoverDataSourceSchema,
  getDataSourceSchema,
  removeWorkspaceDataSourceSchemaProfile,
  resetWorkspaceDataSourceSchemaRegistryForTests,
  resolveWorkspaceDataSourceSchemas,
} from "./workspaceDataSourceSchemaResolver.ts";

function registerCsvDataSource(input: {
  workspaceId: string;
  dataSourceId: string;
  fileName: string;
  csvText: string;
}): void {
  const result = importWorkspaceDataSource({
    workspaceId: input.workspaceId,
    dataSourceId: input.dataSourceId,
    name: input.fileName.replace(/\.csv$/i, ""),
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: input.fileName,
      csvText: input.csvText,
    }),
  });
  assert.equal(result.success, true, result.reason);
}

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceSceneSyncForTests();
  resetPipelineWorkspaceObjectsForTests();
});

test("exports DS-1:1 schema tags and diagnostic prefix", () => {
  assert.deepEqual(WORKSPACE_DATA_SOURCE_SCHEMA_TAGS, ["[DS11]", "[SCHEMA_DISCOVERY]"]);
  assert.equal(NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX, "[NexoraSchemaDiscovery]");
});

test("pipeline: empty CSV is rejected as invalid", () => {
  const workspace = createWorkspace("Empty CSV Workspace");
  assert.throws(() => parseCsvMetadata("   \n"), /empty_csv/);
  assert.throws(
    () =>
      discoverWorkspaceCsvSchema({
        workspaceId: workspace.workspaceId,
        dataSourceId: "wds_empty",
        fileName: "empty.csv",
        csvText: "   \n",
      }),
    /empty_csv/
  );
});

test("pipeline: one column CSV discovers schema contract", () => {
  const workspace = createWorkspace("One Column Workspace");
  const metadata = parseCsvMetadata("region\nEast\nWest\n");
  const columns = inferColumnTypes(inspectColumns(metadata));
  const schema = buildSchemaContract({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_region",
    fileName: "region.csv",
    metadata,
    columns,
  });

  assert.equal(schema.columnCount, 1);
  assert.equal(schema.rowCount, 2);
  assert.equal(schema.columns[0]?.columnName, "region");
  assert.equal(schema.columns[0]?.detectedType, "text");
  assert.equal(workspaceDataSourceSchemaProfileIsComplete(schema), true);
});

test("pipeline: mixed type CSV inspects columns and infers types", () => {
  const workspace = createWorkspace("Mixed Type Workspace");
  const schema = discoverWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_inventory",
    fileName: "inventory.csv",
    csvText:
      "sku,name,revenue,active,started,blank\nA-1,Widget,$10.50,true,2024-01-01,\nA-2,Gadget,$20.00,false,01/15/2024,\n",
  });

  assert.equal(schema.rowCount, 2);
  assert.equal(schema.columnCount, 6);
  assert.equal(schema.columns.find((column) => column.columnName === "sku")?.detectedType, "identifier");
  assert.equal(schema.columns.find((column) => column.columnName === "revenue")?.detectedType, "currency");
  assert.equal(schema.columns.find((column) => column.columnName === "active")?.detectedType, "boolean");
  assert.equal(schema.columns.find((column) => column.columnName === "started")?.detectedType, "date");
  assert.equal(schema.columns.find((column) => column.columnName === "blank")?.nullPercentage, 100);
});

test("pipeline: finance CSV discovers currency percentage and date columns", () => {
  const workspace = createWorkspace("Finance Workspace");
  const schema = discoverWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_finance",
    fileName: "finance.csv",
    csvText:
      "account_id,account_name,revenue,margin_pct,as_of,is_active\n1001,Operating,$125000.50,12.5%,2024-03-31,true\n1002,Treasury,$88000.00,8.1%,2024-03-31,false\n",
  });

  assert.equal(schema.columns.find((column) => column.columnName === "account_id")?.detectedType, "identifier");
  assert.equal(schema.columns.find((column) => column.columnName === "revenue")?.detectedType, "currency");
  assert.equal(schema.columns.find((column) => column.columnName === "margin_pct")?.detectedType, "percentage");
  assert.equal(schema.columns.find((column) => column.columnName === "as_of")?.detectedType, "date");
  assert.equal(schema.columns.find((column) => column.columnName === "is_active")?.detectedType, "boolean");
});

test("pipeline: invalid CSV rejects malformed quoting", () => {
  const workspace = createWorkspace("Invalid CSV Workspace");
  assert.throws(
    () =>
      discoverWorkspaceCsvSchema({
        workspaceId: workspace.workspaceId,
        dataSourceId: "wds_invalid",
        fileName: "invalid.csv",
        csvText: 'id,name\n1,"unclosed\n',
      }),
    /unclosed_quote/
  );
});

test("API discoverDataSourceSchema and getDataSourceSchema persist workspace-scoped schema", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  registerCsvDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_a",
    fileName: "inventory.csv",
    csvText: "sku,count\nA,1\n",
  });

  const discovered = discoverDataSourceSchema(workspaceA.workspaceId, "wds_a");
  assert.equal(discovered.success, true);
  assert.equal(discovered.created, true);
  assert.equal(discovered.schema?.rowCount, 1);
  assert.equal(discovered.schema?.columnCount, 2);

  const stored = getDataSourceSchema(workspaceA.workspaceId, "wds_a");
  assert.ok(stored);
  assert.equal(stored.dataSourceId, "wds_a");
  assert.equal(getDataSourceSchema(workspaceB.workspaceId, "wds_a"), null);

  const removed = removeWorkspaceDataSourceSchemaProfile(workspaceB.workspaceId, "wds_a");
  assert.equal(removed.success, false);
  assert.equal(resolveWorkspaceDataSourceSchemas(workspaceA.workspaceId).length, 1);
});

test("schema discovery does not mutate workspace objects scene or pipeline", () => {
  const workspace = createWorkspace("Isolation Workspace");
  registerCsvDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_safe",
    fileName: "safe.csv",
    csvText: "id,value\n1,alpha\n",
  });

  const result = discoverDataSourceSchema(workspace.workspaceId, "wds_safe");
  assert.equal(result.success, true);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});

test("discoverDataSourceSchema fails when csv content is missing from data source metadata", () => {
  const workspace = createWorkspace("Missing CSV Workspace");
  const registered = importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_missing_csv",
    name: "Missing CSV",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({ fileName: "missing.csv" }),
  });
  assert.equal(registered.success, true);

  const result = discoverDataSourceSchema(workspace.workspaceId, "wds_missing_csv");
  assert.equal(result.success, false);
  assert.equal(result.reason, "missing_csv_content");
});
