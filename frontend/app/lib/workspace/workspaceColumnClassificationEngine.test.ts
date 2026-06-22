import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX,
  WORKSPACE_COLUMN_CLASSIFICATION_TAGS,
} from "./workspaceColumnClassificationContract.ts";
import {
  classifyColumnFromSchemaColumn,
  classifyDataSourceColumns,
  getColumnClassification,
  getColumnClassifications,
  resetWorkspaceColumnClassificationStoreForTests,
} from "./workspaceColumnClassificationEngine.ts";
import { importWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import { resetWorkspaceDataSourcesForTests } from "./workspaceDataSourceRegistry.ts";
import {
  discoverAndSaveWorkspaceDataSourceSchema,
  resetWorkspaceDataSourceSchemaRegistryForTests,
} from "./workspaceDataSourceSchemaResolver.ts";
import { resetPipelineWorkspaceObjectsForTests } from "./objectCreationPipeline.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";

function seedSchema(input: {
  workspaceId: string;
  dataSourceId: string;
  fileName: string;
  csvText: string;
}): void {
  importWorkspaceDataSource({
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
  const saved = discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: input.workspaceId,
    dataSourceId: input.dataSourceId,
    fileName: input.fileName,
    csvText: input.csvText,
  });
  assert.equal(saved.success, true, saved.reason);
}

function classifyColumn(input: {
  workspaceId: string;
  dataSourceId: string;
  columnName: string;
  detectedType:
    | "text"
    | "number"
    | "currency"
    | "percentage"
    | "date"
    | "boolean"
    | "identifier"
    | "unknown";
}) {
  return classifyColumnFromSchemaColumn({
    workspaceId: input.workspaceId,
    dataSourceId: input.dataSourceId,
    column: Object.freeze({
      columnName: input.columnName,
      detectedType: input.detectedType,
      uniqueValueCount: 2,
      nullPercentage: 0,
      sampleValues: Object.freeze(["sample"]),
    }),
  });
}

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetPipelineWorkspaceObjectsForTests();
});

test("exports DS-1:2 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX, "[NexoraColumnClassification]");
  assert.deepEqual(WORKSPACE_COLUMN_CLASSIFICATION_TAGS, [
    "[DS12_COLUMN_CLASSIFICATION]",
    "[COLUMN_BUSINESS_ROLE_READY]",
    "[COLUMN_CLASSIFICATION_PERSISTED]",
    "[WORKSPACE_COLUMN_ISOLATION]",
    "[DS13_READY]",
    "[DS_1_2_COMPLETE]",
  ]);
});

test("classifies identifier columns from schema", () => {
  const workspace = createWorkspace("Identifier Workspace");
  const customerId = classifyColumn({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_ids",
    columnName: "customer_id",
    detectedType: "identifier",
  });
  const accountId = classifyColumn({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_ids",
    columnName: "account_id",
    detectedType: "identifier",
  });

  assert.equal(customerId.businessRole, "Identifier");
  assert.equal(accountId.businessRole, "Identifier");
  assert.ok(customerId.confidence >= 0.9);
  assert.ok(accountId.confidence >= 0.9);
  assert.ok(customerId.reason.length > 0);
});

test("classifies name columns from schema", () => {
  const workspace = createWorkspace("Name Workspace");
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_names",
      columnName: "customer_name",
      detectedType: "text",
    }).businessRole,
    "Name"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_names",
      columnName: "supplier_name",
      detectedType: "text",
    }).businessRole,
    "Name"
  );
});

test("classifies financial metric columns from schema", () => {
  const workspace = createWorkspace("Finance Workspace");
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_finance",
      columnName: "revenue",
      detectedType: "currency",
    }).businessRole,
    "Currency"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_finance",
      columnName: "expenses",
      detectedType: "number",
    }).businessRole,
    "Metric"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_finance",
      columnName: "margin_percent",
      detectedType: "percentage",
    }).businessRole,
    "Percentage"
  );
});

test("classifies date columns from schema", () => {
  const workspace = createWorkspace("Date Workspace");
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_dates",
      columnName: "order_date",
      detectedType: "date",
    }).businessRole,
    "Date"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_dates",
      columnName: "invoice_date",
      detectedType: "date",
    }).businessRole,
    "Date"
  );
});

test("classifies category columns from schema", () => {
  const workspace = createWorkspace("Category Workspace");
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_categories",
      columnName: "region",
      detectedType: "text",
    }).businessRole,
    "Category"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_categories",
      columnName: "department",
      detectedType: "text",
    }).businessRole,
    "Category"
  );
  assert.equal(
    classifyColumn({
      workspaceId: workspace.workspaceId,
      dataSourceId: "wds_categories",
      columnName: "category",
      detectedType: "text",
    }).businessRole,
    "Category"
  );
});

test("classifies unknown columns from schema", () => {
  const workspace = createWorkspace("Unknown Workspace");
  const notes = classifyColumn({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_unknown",
    columnName: "notes",
    detectedType: "text",
  });
  const misc = classifyColumn({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_unknown",
    columnName: "misc",
    detectedType: "text",
  });

  assert.equal(notes.businessRole, "Unknown");
  assert.equal(misc.businessRole, "Unknown");
  assert.equal(notes.confidence, 0.2);
  assert.equal(misc.confidence, 0.2);
});

test("classifyDataSourceColumns persists classifications from DS-1:1 schema only", () => {
  const workspace = createWorkspace("Persist Workspace");
  seedSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_sales",
    fileName: "sales.csv",
    csvText:
      "customer_id,customer_name,revenue,order_date,region,status,notes\n1,Acme,$500,2024-01-01,East,active,hello\n",
  });

  const result = classifyDataSourceColumns(workspace.workspaceId, "wds_sales");
  assert.equal(result.success, true);
  assert.equal(result.created, true);
  assert.equal(result.classifications.length, 7);
  assert.ok(result.classifications.every((entry) => entry.reason.length > 0));
  assert.ok(result.classifications.every((entry) => entry.confidence >= 0.2));

  const stored = getColumnClassifications(workspace.workspaceId, "wds_sales");
  assert.equal(stored.length, 7);
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "customer_id")?.businessRole, "Identifier");
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "customer_name")?.businessRole, "Name");
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "revenue")?.businessRole, "Currency");
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "order_date")?.businessRole, "Date");
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "region")?.businessRole, "Category");
  assert.equal(getColumnClassification(workspace.workspaceId, "wds_sales", "notes")?.businessRole, "Unknown");
});

test("keeps column classifications isolated by workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  seedSchema({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_shared",
    fileName: "shared.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });
  classifyDataSourceColumns(workspaceA.workspaceId, "wds_shared");

  assert.equal(getColumnClassifications(workspaceA.workspaceId, "wds_shared").length, 2);
  assert.equal(getColumnClassifications(workspaceB.workspaceId, "wds_shared").length, 0);
  assert.equal(getColumnClassification(workspaceB.workspaceId, "wds_shared", "customer_id"), null);
});

test("column classification does not create objects or scene writes", () => {
  const workspace = createWorkspace("Safety Workspace");
  seedSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_safe",
    fileName: "safe.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });

  const result = classifyDataSourceColumns(workspace.workspaceId, "wds_safe");
  assert.equal(result.success, true);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});

test("classifyDataSourceColumns fails when DS-1:1 schema is missing", () => {
  const workspace = createWorkspace("Missing Schema Workspace");
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_missing_schema",
    name: "Missing Schema",
    type: "csv",
    status: "connected",
  });

  const result = classifyDataSourceColumns(workspace.workspaceId, "wds_missing_schema");
  assert.equal(result.success, false);
  assert.equal(result.reason, "schema_not_found");
});
