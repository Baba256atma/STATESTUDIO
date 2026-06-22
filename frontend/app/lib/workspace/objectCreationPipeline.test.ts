import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects, getWorkspaceScopedResources } from "./workspaceContextResolver.ts";
import {
  OBJECT_CREATION_PIPELINE_TAGS,
  OBJECT_CREATION_PIPELINE_VERSION,
  buildPipelineWorkspaceObjectId,
  createWorkspaceObjectFromApprovedCandidate,
  listPipelineWorkspaceObjects,
  resetPipelineWorkspaceObjectsForTests,
  runObjectCreationPipelineFromApprovalRecords,
} from "./objectCreationPipeline.ts";
import { buildWorkspaceCreatedObjectId } from "./workspaceObjectCreationContract.ts";
import {
  approveObjectApprovalCandidate,
  createSelectedApprovedObjects,
  resetObjectApprovalPanelForTests,
  syncObjectApprovalRecordsFromCandidates,
} from "./objectApprovalPanelRuntime.ts";
import {
  discoverAndSaveCandidateObjectsFromClassification,
  resetWorkspaceCandidateObjectsForTests,
} from "./candidateObjectDiscoveryEngine.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  resetWorkspaceColumnClassificationForTests,
} from "./columnClassificationEngine.ts";
import {
  discoverCsvDataSourceSchema,
  resetWorkspaceSchemaRegistryForTests,
} from "./workspaceSchemaRegistry.ts";
import { resetWorkspaceDataSourcesForTests } from "./workspaceDataSourceRegistry.ts";
import { assertWorkspaceOwnership } from "./workspaceOwnershipContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationForTests();
  resetWorkspaceCandidateObjectsForTests();
  resetObjectApprovalPanelForTests();
  resetPipelineWorkspaceObjectsForTests();
  resetWorkspaceSceneSyncForTests();
});

function seedApprovedCandidates(workspaceName: string) {
  const workspace = createWorkspace(workspaceName);
  const schema = discoverCsvDataSourceSchema({
    workspaceId: workspace.workspaceId,
    dataSourceId: "wds_entities",
    fileName: "entities.csv",
    csvText:
      "customer_id,customer_name,supplier_id,supplier_name,warehouse_id,warehouse_name\n1,Acme,10,Global Supply,20,East\n",
  });
  const classification = classifyAndSaveWorkspaceColumnsFromSchema(schema);
  discoverAndSaveCandidateObjectsFromClassification(classification.profile!);
  syncObjectApprovalRecordsFromCandidates(workspace.workspaceId);

  const records = syncObjectApprovalRecordsFromCandidates(workspace.workspaceId);
  for (const record of records) {
    approveObjectApprovalCandidate(workspace.workspaceId, record.candidateId);
  }

  return workspace;
}

test("exports DS-1:5 object creation pipeline metadata", () => {
  assert.equal(OBJECT_CREATION_PIPELINE_VERSION, "DS-1:5");
  assert.deepEqual(OBJECT_CREATION_PIPELINE_TAGS, [
    "[DS15_OBJECT_CREATION]",
    "[WORKSPACE_OBJECTS_CREATED]",
    "[APPROVED_CANDIDATES_CONSUMED]",
    "[OBJECT_TRACEABILITY_ENABLED]",
    "[DS16_READY]",
    "[DS_1_5_COMPLETE]",
  ]);
});

test("creates workspace objects from approved candidates preserving ownership fields", () => {
  const workspace = createWorkspace("Pipeline Workspace");
  const result = createWorkspaceObjectFromApprovedCandidate({
    workspaceId: workspace.workspaceId,
    candidateId: "cand_customer",
    approvedObjectId: "appr_customer",
    objectName: "Customer",
    confidence: "high",
    sourceColumns: Object.freeze(["customer_id", "customer_name"]),
    dataSourceId: "wds_entities",
  });

  assert.equal(result.success, false);
  assert.equal(result.created, false);
});

test("skips duplicate workspace objects when approved candidates are recreated", () => {
  const workspace = seedApprovedCandidates("Duplicate Pipeline Workspace");
  const records = syncObjectApprovalRecordsFromCandidates(workspace.workspaceId);
  const pipeline = runObjectCreationPipelineFromApprovalRecords(records);
  assert.equal(pipeline.success, true);
  assert.equal(pipeline.createdCount, 3);

  const duplicate = runObjectCreationPipelineFromApprovalRecords(records);
  assert.equal(duplicate.createdCount, 0);
  assert.equal(duplicate.updatedCount, 3);
  assert.equal(listPipelineWorkspaceObjects(workspace.workspaceId).length, 3);
  assert.equal(
    listPipelineWorkspaceObjects(workspace.workspaceId)[0]?.objectId,
    buildWorkspaceCreatedObjectId(listPipelineWorkspaceObjects(workspace.workspaceId)[0]!.objectName)
  );
});

test("runs object creation pipeline from approved records without creating relationships or scene nodes", () => {
  const workspace = seedApprovedCandidates("Approved Pipeline Workspace");
  const records = syncObjectApprovalRecordsFromCandidates(workspace.workspaceId);
  const pipeline = runObjectCreationPipelineFromApprovalRecords(records);

  assert.equal(pipeline.success, true);
  assert.equal(pipeline.createdCount, 3);
  assert.equal(pipeline.objects.length, 3);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 3);
  assert.equal(getWorkspaceScopedResources(workspace.workspaceId).relationships.length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});

test("create selected objects action materializes approved candidates into workspace objects", () => {
  const workspace = seedApprovedCandidates("Create Selected Pipeline Workspace");
  const created = createSelectedApprovedObjects(workspace.workspaceId);

  assert.equal(created.success, true);
  assert.match(created.message, /created/i);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 3);
  assert.equal(
    getWorkspaceObjects(workspace.workspaceId).every(
      (object) => object.workspaceId === workspace.workspaceId
    ),
    true
  );
  assert.equal(
    buildPipelineWorkspaceObjectId({
      workspaceId: workspace.workspaceId,
      candidateId: "ignored",
      objectName: "Customer",
    }),
    buildWorkspaceCreatedObjectId("Customer")
  );
});

test("preserves workspace ownership on created objects", () => {
  const workspace = seedApprovedCandidates("Ownership Pipeline Workspace");
  createSelectedApprovedObjects(workspace.workspaceId);
  const owned = getWorkspaceObjects(workspace.workspaceId)[0];
  assert.ok(owned);
  assert.equal(assertWorkspaceOwnership(owned, workspace.workspaceId), true);
});
