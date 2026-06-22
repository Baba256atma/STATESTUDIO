import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  CANDIDATE_OBJECT_CONTRACT,
  CANDIDATE_OBJECT_TAGS,
  candidateObjectProposalIsComplete,
} from "./candidateObjectContract.ts";
import {
  discoverAndSaveCandidateObjectsFromClassification,
  discoverCandidateObjectsFromClassification,
  getWorkspaceCandidateObject,
  listWorkspaceCandidateObjects,
  listWorkspaceCandidateObjectsForDataSource,
  removeWorkspaceCandidateObjectsForDataSource,
  resetWorkspaceCandidateObjectsForTests,
} from "./candidateObjectDiscoveryEngine.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  resetWorkspaceColumnClassificationForTests,
} from "./columnClassificationEngine.ts";
import {
  discoverAndSaveWorkspaceCsvSchema,
  removeWorkspaceDataSourceSchema,
  resetWorkspaceSchemaRegistryForTests,
} from "./workspaceSchemaRegistry.ts";
import {
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";
import {
  resetWorkspaceCsvUploadForTests,
  uploadWorkspaceCsv,
} from "./workspaceCsvUploadRuntime.ts";
import { discoverCsvDataSourceSchema } from "./workspaceSchemaRegistry.ts";
import { resolveWorkspaceDataSourceSchema } from "./workspaceDataSourceSchemaResolver.ts";
import { toLegacyDataSourceSchemaProfile } from "./workspaceDataSourceSchemaLegacyBridge.ts";

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
  resetWorkspaceColumnClassificationForTests();
  resetWorkspaceCandidateObjectsForTests();
});

test("exports DS-1:3 candidate object contract", () => {
  assert.equal(CANDIDATE_OBJECT_CONTRACT.contractVersion, "DS-1:3");
  assert.deepEqual(CANDIDATE_OBJECT_TAGS, [
    "[DS13_CANDIDATE_OBJECT_DISCOVERY]",
    "[CANDIDATE_OBJECTS_READY]",
    "[OBJECT_GROUPING_ENGINE]",
    "[OBJECT_DISCOVERY_PERSISTED]",
    "[DS14_READY]",
    "[DS_1_3_COMPLETE]",
  ]);
  assert.equal(CANDIDATE_OBJECT_CONTRACT.requiredFields.includes("reason"), true);
});

test("discovers Customer Warehouse and Supplier candidates from classified columns", () => {
  const workspace = createWorkspace("Discovery Workspace");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_entities",
    fileName: "entities.csv",
    csvText:
      "customer_id,customer_name,warehouse_id,warehouse_name,supplier_id,supplier_name\n1,Acme,10,East,100,Global Supply\n",
  });
  const classification = classifyAndSaveWorkspaceColumnsFromSchema(schema);
  assert.equal(classification.success, true);

  const candidates = discoverCandidateObjectsFromClassification(classification.profile!);
  const objectNames = candidates.map((candidate) => candidate.objectName).sort();
  assert.deepEqual(objectNames, ["Customer", "Supplier", "Warehouse"]);

  const customer = candidates.find((candidate) => candidate.objectName === "Customer");
  assert.ok(customer);
  assert.equal(candidateObjectProposalIsComplete(customer), true);
  assert.deepEqual(customer.sourceColumns, ["customer_id", "customer_name"]);
  assert.equal(customer.confidence, "high");
  assert.match(customer.reason, /customer_id/);
  assert.match(customer.reason, /customer_name/);
  assert.match(customer.reason, /Customer/);
});

test("stores workspace-scoped candidate objects with explanations", () => {
  const workspaceA = createWorkspace("Workspace A");
  const workspaceB = createWorkspace("Workspace B");
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspaceA.workspaceId,
    dataSourceId: "wds_a",
    fileName: "customers.csv",
    csvText: "customer_id,customer_name\n1,Acme\n",
  });
  const classification = classifyAndSaveWorkspaceColumnsFromSchema(schema);
  const saved = discoverAndSaveCandidateObjectsFromClassification(classification.profile!);

  assert.equal(saved.success, true);
  assert.equal(saved.candidates.length, 1);
  assert.equal(listWorkspaceCandidateObjects(workspaceA.workspaceId).length, 1);
  assert.equal(listWorkspaceCandidateObjects(workspaceB.workspaceId).length, 0);
  assert.equal(
    listWorkspaceCandidateObjectsForDataSource(workspaceA.workspaceId, "wds_a").length,
    1
  );
  assert.ok(getWorkspaceCandidateObject(workspaceA.workspaceId, saved.candidates[0]!.candidateId));
});

test("upload pipeline discovers candidate objects without creating workspace objects", async () => {
  const workspace = createWorkspace("Upload Candidate Workspace");
  const result = await uploadWorkspaceCsv(
    makeCsvFile({
      name: "operations.csv",
      body:
        "customer_id,customer_name,warehouse_id,warehouse_name,supplier_id,supplier_name,revenue\n1,Acme,10,East,100,Global Supply,500\n",
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
  const classification = classifyAndSaveWorkspaceColumnsFromSchema(legacySchema, legacySchema.updatedAt);
  assert.ok(classification.profile);
  discoverAndSaveCandidateObjectsFromClassification(classification.profile);

  const candidates = listWorkspaceCandidateObjectsForDataSource(
    workspace.workspaceId,
    result.dataSource!.dataSourceId
  );
  assert.equal(candidates.length, 3);
  assert.equal(candidates.some((candidate) => candidate.objectName === "Customer"), true);
  assert.equal(candidates.every((candidate) => candidate.reason.length > 0), true);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 0);
});

test("removes candidate objects when data source schema is removed", () => {
  const workspace = createWorkspace("Remove Candidate Workspace");
  discoverAndSaveWorkspaceCsvSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_temp",
    fileName: "temp.csv",
    csvText: "supplier_id,supplier_name\n1,Supply Co\n",
    enableDownstreamIntelligence: true,
  });

  assert.equal(listWorkspaceCandidateObjects(workspace.workspaceId).length, 1);

  removeWorkspaceDataSourceSchema(workspace.workspaceId, "wds_temp");
  assert.equal(listWorkspaceCandidateObjects(workspace.workspaceId).length, 0);

  const removed = removeWorkspaceCandidateObjectsForDataSource(workspace.workspaceId, "wds_temp");
  assert.equal(removed.success, false);
});
