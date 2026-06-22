import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  OBJECT_APPROVAL_CONTRACT,
  OBJECT_APPROVAL_TAGS,
} from "./objectApprovalContract.ts";
import {
  approveObjectApprovalCandidate,
  buildObjectApprovalPanelSnapshot,
  createSelectedApprovedObjects,
  listQueuedApprovedWorkspaceObjects,
  rejectObjectApprovalCandidate,
  renameObjectApprovalCandidate,
  resetObjectApprovalPanelForTests,
  syncObjectApprovalRecordsFromCandidates,
} from "./objectApprovalPanelRuntime.ts";
import {
  discoverAndSaveCandidateObjectsFromClassification,
  resetWorkspaceCandidateObjectsForTests,
} from "./candidateObjectDiscoveryEngine.ts";
import { resetPipelineWorkspaceObjectsForTests } from "./objectCreationPipeline.ts";
import {
  classifyAndSaveWorkspaceColumnsFromSchema,
  resetWorkspaceColumnClassificationForTests,
} from "./columnClassificationEngine.ts";
import {
  discoverCsvDataSourceSchema,
  resetWorkspaceSchemaRegistryForTests,
} from "./workspaceSchemaRegistry.ts";
import {
  resetWorkspaceDataSourcesForTests,
} from "./workspaceDataSourceRegistry.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationForTests();
  resetWorkspaceCandidateObjectsForTests();
  resetObjectApprovalPanelForTests();
  resetPipelineWorkspaceObjectsForTests();
});

function seedApprovalWorkspace(workspaceName: string) {
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
  return workspace;
}

test("exports DS-1:4 object approval contract", () => {
  assert.equal(OBJECT_APPROVAL_CONTRACT.contractVersion, "DS-1:4");
  assert.equal(OBJECT_APPROVAL_CONTRACT.requiredManagerApproval, true);
  assert.deepEqual(OBJECT_APPROVAL_TAGS, [
    "[DS14_OBJECT_APPROVAL]",
    "[OBJECT_REVIEW_WORKFLOW]",
    "[APPROVAL_PERSISTENCE_READY]",
    "[DS15_READY]",
    "[DS_1_4_COMPLETE]",
  ]);
});

test("approves discovered object proposals for manager review", () => {
  const workspace = seedApprovalWorkspace("Approval Workspace");
  const snapshot = buildObjectApprovalPanelSnapshot(workspace.workspaceId);
  const customer = snapshot.rows.find((row) => row.objectName === "Customer");
  assert.ok(customer);

  const approved = approveObjectApprovalCandidate(workspace.workspaceId, customer.candidateId);
  assert.equal(approved.success, true);
  assert.equal(approved.snapshot.rows.find((row) => row.candidateId === customer.candidateId)?.approved, true);
});

test("rejects discovered object proposals", () => {
  const workspace = seedApprovalWorkspace("Reject Workspace");
  const snapshot = buildObjectApprovalPanelSnapshot(workspace.workspaceId);
  const supplier = snapshot.rows.find((row) => row.objectName === "Supplier");
  assert.ok(supplier);

  const rejected = rejectObjectApprovalCandidate(workspace.workspaceId, supplier.candidateId);
  assert.equal(rejected.success, true);
  assert.equal(
    rejected.snapshot.rows.some((row) => row.candidateId === supplier.candidateId),
    false
  );
});

test("renames discovered object proposals", () => {
  const workspace = seedApprovalWorkspace("Rename Workspace");
  const snapshot = buildObjectApprovalPanelSnapshot(workspace.workspaceId);
  const warehouse = snapshot.rows.find((row) => row.objectName === "Warehouse");
  assert.ok(warehouse);

  const renamed = renameObjectApprovalCandidate(
    workspace.workspaceId,
    "Distribution Center",
    warehouse.candidateId
  );
  assert.equal(renamed.success, true);
  assert.equal(
    renamed.snapshot.rows.find((row) => row.candidateId === warehouse.candidateId)?.displayName,
    "Distribution Center"
  );
});

test("queues approved objects only after explicit manager action", () => {
  const workspace = seedApprovalWorkspace("Create Selected Workspace");
  const snapshot = buildObjectApprovalPanelSnapshot(workspace.workspaceId);

  for (const row of snapshot.rows) {
    approveObjectApprovalCandidate(workspace.workspaceId, row.candidateId);
  }

  const created = createSelectedApprovedObjects(workspace.workspaceId);
  assert.equal(created.success, true);
  assert.match(created.message, /created/i);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 3);
});
