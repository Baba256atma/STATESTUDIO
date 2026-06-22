import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  NEXORA_CANDIDATE_DISCOVERY_LOG_PREFIX,
  WORKSPACE_CANDIDATE_OBJECT_TAGS,
} from "./workspaceCandidateObjectContract.ts";
import {
  discoverCandidateObjects,
  getCandidateObject,
  getCandidateObjects,
  resetWorkspaceCandidateObjectStoreForTests,
} from "./workspaceCandidateObjectDiscoveryEngine.ts";
import {
  classifyDataSourceColumns,
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

function seedClassifiedDataSource(input: {
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
  const schema = discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: input.workspaceId,
    dataSourceId: input.dataSourceId,
    fileName: input.fileName,
    csvText: input.csvText,
  });
  assert.equal(schema.success, true, schema.reason);
  const classified = classifyDataSourceColumns(input.workspaceId, input.dataSourceId);
  assert.equal(classified.success, true, classified.reason);
}

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationStoreForTests();
  resetWorkspaceCandidateObjectStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetPipelineWorkspaceObjectsForTests();
});

test("exports DS-1:3 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_CANDIDATE_DISCOVERY_LOG_PREFIX, "[NexoraCandidateDiscovery]");
  assert.deepEqual(WORKSPACE_CANDIDATE_OBJECT_TAGS, [
    "[DS13_CANDIDATE_OBJECT_DISCOVERY]",
    "[CANDIDATE_OBJECTS_READY]",
    "[OBJECT_GROUPING_ENGINE]",
    "[OBJECT_DISCOVERY_PERSISTED]",
    "[DS14_READY]",
    "[DS_1_3_COMPLETE]",
  ]);
});

test("discovers Customer candidate from customer dataset", () => {
  const workspace = createWorkspace("Customer Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_customer",
    fileName: "customers.csv",
    csvText:
      "customer_id,customer_name,customer_status,customer_region\n1,Acme,active,East\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_customer");
  assert.equal(result.success, true);
  const customer = result.candidates.find((candidate) => candidate.objectName === "Customer");
  assert.ok(customer);
  assert.equal(customer.primaryIdentifier, "customer_id");
  assert.ok(customer.confidence >= 0.9);
  assert.deepEqual(customer.sourceColumns, [
    "customer_id",
    "customer_name",
    "customer_region",
    "customer_status",
  ]);
  assert.equal(customer.status, "suggested");
  assert.ok(customer.reason.length > 0);
});

test("discovers Supplier candidate from supplier dataset", () => {
  const workspace = createWorkspace("Supplier Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_supplier",
    fileName: "suppliers.csv",
    csvText: "supplier_id,supplier_name,supplier_region\n10,Global Supply,West\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_supplier");
  const supplier = result.candidates.find((candidate) => candidate.objectName === "Supplier");
  assert.ok(supplier);
  assert.equal(supplier.primaryIdentifier, "supplier_id");
  assert.ok(supplier.sourceColumns.includes("supplier_name"));
});

test("discovers Employee candidate from employee dataset", () => {
  const workspace = createWorkspace("Employee Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_employee",
    fileName: "employees.csv",
    csvText: "employee_id,employee_name,employee_department\n7,Jane Doe,Finance\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_employee");
  const employee = result.candidates.find((candidate) => candidate.objectName === "Employee");
  assert.ok(employee);
  assert.equal(employee.primaryIdentifier, "employee_id");
});

test("discovers Project candidate from project dataset", () => {
  const workspace = createWorkspace("Project Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_project",
    fileName: "projects.csv",
    csvText: "project_id,project_name,project_status\n42,Nexora Rollout,active\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_project");
  const project = result.candidates.find((candidate) => candidate.objectName === "Project");
  assert.ok(project);
  assert.equal(project.primaryIdentifier, "project_id");
});

test("discovers Product candidate from product dataset", () => {
  const workspace = createWorkspace("Product Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_product",
    fileName: "products.csv",
    csvText: "product_id,product_name,product_category\n100,Widget,Hardware\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_product");
  const product = result.candidates.find((candidate) => candidate.objectName === "Product");
  assert.ok(product);
  assert.equal(product.primaryIdentifier, "product_id");
});

test("discovers two candidates from mixed customer and supplier dataset", () => {
  const workspace = createWorkspace("Mixed Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_mixed",
    fileName: "mixed.csv",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name\n1,Acme,10,Global Supply\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_mixed");
  assert.equal(result.candidates.length, 2);
  assert.equal(result.candidates.some((candidate) => candidate.objectName === "Customer"), true);
  assert.equal(result.candidates.some((candidate) => candidate.objectName === "Supplier"), true);
});

test("discovers generic candidate from weak dataset without prefixes", () => {
  const workspace = createWorkspace("Weak Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_weak",
    fileName: "weak.csv",
    csvText: "id,name,status\n1,Alpha,active\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_weak");
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0]?.objectName, "Business Entity");
  assert.equal(result.candidates[0]?.candidateType, "generic_entity");
  assert.ok(result.candidates[0]!.confidence <= 0.68);
});

test("persists and reads candidate objects via API", () => {
  const workspace = createWorkspace("API Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_api",
    fileName: "customers.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });
  const discovered = discoverCandidateObjects(workspace.workspaceId, "wds_api");
  assert.equal(discovered.success, true);

  const stored = getCandidateObjects(workspace.workspaceId, "wds_api");
  assert.equal(stored.length, 1);
  assert.ok(getCandidateObject(workspace.workspaceId, "wds_api", stored[0]!.candidateId));
});

test("keeps candidate objects isolated by workspace", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");

  seedClassifiedDataSource({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_shared",
    fileName: "shared.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });
  discoverCandidateObjects(workspaceA.workspaceId, "wds_shared");

  assert.equal(getCandidateObjects(workspaceA.workspaceId, "wds_shared").length, 1);
  assert.equal(getCandidateObjects(workspaceB.workspaceId, "wds_shared").length, 0);
});

test("candidate discovery does not create workspace objects or scene nodes", () => {
  const workspace = createWorkspace("Safety Workspace");
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_safe",
    fileName: "safe.csv",
    csvText: "customer_id,customer_name,customer_status\n1,Acme,active\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_safe");
  assert.equal(result.success, true);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});

test("discoverCandidateObjects fails when DS-1:2 classifications are missing", () => {
  const workspace = createWorkspace("Missing Classification Workspace");
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_missing",
    name: "Missing",
    type: "csv",
    status: "connected",
  });
  discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_missing",
    fileName: "missing.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });

  const result = discoverCandidateObjects(workspace.workspaceId, "wds_missing");
  assert.equal(result.success, false);
  assert.equal(result.reason, "classifications_not_found");
});
