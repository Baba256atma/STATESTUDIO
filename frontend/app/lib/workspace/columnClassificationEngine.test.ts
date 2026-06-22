import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import {
  COLUMN_CLASSIFICATION_BUSINESS_MEANINGS,
  COLUMN_CLASSIFICATION_CONTRACT,
  COLUMN_CLASSIFICATION_TAGS,
} from "./columnClassificationContract.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  classifyColumn,
  classifySchemaColumns,
  getWorkspaceColumnClassificationProfile,
  listWorkspaceColumnClassificationProfiles,
  removeWorkspaceColumnClassificationProfile,
  resetWorkspaceColumnClassificationForTests,
} from "./columnClassificationEngine.ts";
import {
  discoverAndSaveWorkspaceCsvSchema,
  discoverCsvDataSourceSchema,
  removeWorkspaceDataSourceSchema,
  resetWorkspaceSchemaRegistryForTests,
} from "./workspaceSchemaRegistry.ts";
import { resolveWorkspaceDataSourceSchema, resetWorkspaceDataSourceSchemaRegistryForTests } from "./workspaceDataSourceSchemaResolver.ts";
import { toLegacyDataSourceSchemaProfile } from "./workspaceDataSourceSchemaLegacyBridge.ts";
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

function makeCsvFile(input: { name: string; body: string }): TestCsvFile {
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
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationForTests();
});

test("exports DS-1:2 column classification contract and business meanings", () => {
  assert.equal(COLUMN_CLASSIFICATION_CONTRACT.contractVersion, "DS-1:2");
  assert.deepEqual(COLUMN_CLASSIFICATION_TAGS, [
    "[DS12_COLUMN_CLASSIFICATION]",
    "[COLUMN_BUSINESS_ROLE_READY]",
    "[COLUMN_CLASSIFICATION_PERSISTED]",
    "[WORKSPACE_COLUMN_ISOLATION]",
    "[DS13_READY]",
    "[DS_1_2_COMPLETE]",
  ]);
  assert.equal(COLUMN_CLASSIFICATION_BUSINESS_MEANINGS.name, "Entity Name");
  assert.equal(COLUMN_CLASSIFICATION_BUSINESS_MEANINGS.identifier, "Entity Identifier");
  assert.equal(COLUMN_CLASSIFICATION_BUSINESS_MEANINGS.metric, "Metric");
  assert.equal(COLUMN_CLASSIFICATION_BUSINESS_MEANINGS.date, "Time");
  assert.equal(COLUMN_CLASSIFICATION_BUSINESS_MEANINGS.category, "Category");
});

test("classifies canonical business column examples", () => {
  assert.equal(classifyColumn({ columnName: "customer_name" }).classification, "name");
  assert.equal(
    classifyColumn({ columnName: "customer_name" }).businessMeaning,
    "Entity Name"
  );
  assert.equal(classifyColumn({ columnName: "customer_id" }).classification, "identifier");
  assert.equal(
    classifyColumn({ columnName: "customer_id" }).businessMeaning,
    "Entity Identifier"
  );
  assert.equal(classifyColumn({ columnName: "revenue", detectedType: "number" }).classification, "metric");
  assert.equal(classifyColumn({ columnName: "date", detectedType: "date" }).classification, "date");
  assert.equal(classifyColumn({ columnName: "region" }).classification, "category");
  assert.equal(classifyColumn({ columnName: "status", detectedType: "boolean" }).classification, "status");
});

test("classifies all schema columns and stores workspace-scoped profiles", () => {
  const workspace = createWorkspace("Classification Workspace");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_sales",
    fileName: "sales.csv",
    csvText:
      "customer_id,customer_name,revenue,date,region,status\n1,Acme,1000,2024-01-01,East,active\n",
  });

  const entries = classifySchemaColumns(schema);
  assert.equal(entries.length, 6);
  assert.equal(entries[0]?.classification, "identifier");
  assert.equal(entries[1]?.classification, "name");
  assert.equal(entries[2]?.classification, "metric");
  assert.equal(entries[3]?.classification, "date");
  assert.equal(entries[4]?.classification, "category");
  assert.equal(entries[5]?.classification, "status");

  const saved = classifyAndSaveWorkspaceColumnsFromSchema(schema);
  assert.equal(saved.success, true);
  assert.equal(saved.created, true);

  const profile = getWorkspaceColumnClassificationProfile(workspace.workspaceId, "wds_sales");
  assert.ok(profile);
  assert.equal(profile.columns.length, 6);
  assert.equal(profile.fileName, "sales.csv");
});

test("keeps column classifications isolated by workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_a",
    fileName: "inventory.csv",
    csvText: "sku,name,count\nA,Widget,10\n",
  });

  classifyAndSaveWorkspaceColumnsFromSchema(schema);

  assert.equal(listWorkspaceColumnClassificationProfiles(workspaceA.workspaceId).length, 1);
  assert.equal(listWorkspaceColumnClassificationProfiles(workspaceB.workspaceId).length, 0);
  assert.equal(getWorkspaceColumnClassificationProfile(workspaceB.workspaceId, "wds_a"), null);
});

test("upload and schema discovery persist column classifications without object generation", async () => {
  const workspace = createWorkspace("Upload Classification Workspace");
  const result = await uploadWorkspaceCsv(
    makeCsvFile({
      name: "pipeline.csv",
      body: "customer_id,customer_name,revenue,region\n1,Acme,500,West\n",
    }),
    workspace.workspaceId
  );

  assert.equal(result.success, true);
  assert.ok(result.dataSource);

  const schema = resolveWorkspaceDataSourceSchema(
    workspace.workspaceId,
    result.dataSource!.dataSourceId
  );
  assert.ok(schema);
  const legacySchema = toLegacyDataSourceSchemaProfile(schema);
  classifyAndSaveWorkspaceColumnsFromSchema(legacySchema, legacySchema.updatedAt);

  const profile = getWorkspaceColumnClassificationProfile(
    workspace.workspaceId,
    result.dataSource!.dataSourceId
  );
  assert.ok(profile);
  assert.equal(profile.columns.find((entry) => entry.columnName === "customer_name")?.classification, "name");
  assert.equal(profile.columns.find((entry) => entry.columnName === "customer_id")?.classification, "identifier");
  assert.equal(profile.columns.find((entry) => entry.columnName === "revenue")?.classification, "metric");
  assert.equal(profile.columns.find((entry) => entry.columnName === "region")?.classification, "category");
});

test("removes column classifications when schema is removed", () => {
  const workspace = createWorkspace("Remove Classification Workspace");
  discoverAndSaveWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_temp",
    fileName: "temp.csv",
    csvText: "id,value\n1,alpha\n",
    enableDownstreamIntelligence: true,
  });

  assert.equal(listWorkspaceColumnClassificationProfiles(workspace.workspaceId).length, 1);

  removeWorkspaceDataSourceSchema(workspace.workspaceId, "wds_temp");
  assert.equal(listWorkspaceColumnClassificationProfiles(workspace.workspaceId).length, 0);

  const removed = removeWorkspaceColumnClassificationProfile(workspace.workspaceId, "wds_temp");
  assert.equal(removed.success, false);
});
