import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  NEXORA_OBJECT_APPROVAL_LOG_PREFIX,
  WORKSPACE_OBJECT_APPROVAL_TAGS,
} from "./workspaceObjectApprovalContract.ts";
import {
  approveCandidateObject,
  getApprovedCandidates,
  getCandidateApprovalState,
  getCandidateApprovalStates,
  rejectCandidateObject,
  renameCandidateObject,
  resetWorkspaceObjectApprovalStoreForTests,
  syncApprovalStatesForDataSource,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  discoverCandidateObjects,
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
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
} from "./workspaceSceneSync.ts";
import { resetPipelineWorkspaceObjectsForTests } from "./objectCreationPipeline.ts";

const DATA_SOURCE_ID = "wds_entities";

const STORAGE_KEY = "nexora.workspaceObjectApprovals.v2";

function ensureBrowserStorage(): void {
  if (typeof globalThis.window !== "undefined") return;
  const store: Record<string, string> = {};
  (globalThis as typeof globalThis & { window: Window }).window = {
    localStorage: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) delete store[key];
      },
    },
  } as unknown as Window;
}

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
  const discovered = discoverCandidateObjects(input.workspaceId, input.dataSourceId);
  assert.equal(discovered.success, true, discovered.reason);
}

function seedApprovalWorkspace(workspaceName: string) {
  const workspace = createWorkspace(workspaceName);
  seedClassifiedDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    fileName: "entities.csv",
    csvText:
      "customer_id,customer_name,customer_status,customer_region,supplier_id,supplier_name,supplier_region,product_id,product_name,product_category\n1,Acme,active,East,10,Global Supply,West,100,Widget,Hardware\n",
  });
  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID);
  return workspace;
}

function findCandidateByName(
  workspaceId: string,
  objectName: string
): ReturnType<typeof getCandidateApprovalStates>[number] {
  const state = getCandidateApprovalStates(workspaceId, DATA_SOURCE_ID).find(
    (entry) => entry.objectName === objectName
  );
  assert.ok(state, `Expected candidate ${objectName}`);
  return state;
}

test.beforeEach(() => {
  ensureBrowserStorage();
  window.localStorage.clear();
  resetWorkspaceRegistryForTests();
  resetWorkspaceDataSourcesForTests();
  resetWorkspaceDataSourceSchemaRegistryForTests();
  resetWorkspaceColumnClassificationStoreForTests();
  resetWorkspaceCandidateObjectStoreForTests();
  resetWorkspaceObjectApprovalStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetPipelineWorkspaceObjectsForTests();
});

test("exports DS-1:4 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_APPROVAL_LOG_PREFIX, "[NexoraObjectApproval]");
  assert.deepEqual(WORKSPACE_OBJECT_APPROVAL_TAGS, [
    "[DS14_OBJECT_APPROVAL]",
    "[OBJECT_REVIEW_WORKFLOW]",
    "[APPROVAL_PERSISTENCE_READY]",
    "[DS15_READY]",
    "[DS_1_4_COMPLETE]",
  ]);
});

test("approves Customer candidate", () => {
  const workspace = seedApprovalWorkspace("Approve Customer");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  assert.equal(customer.status, "suggested");

  const approved = approveCandidateObject(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    customer.candidateId
  );
  assert.equal(approved.success, true);
  assert.equal(approved.state?.status, "approved");

  const persisted = getCandidateApprovalState(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    customer.candidateId
  );
  assert.equal(persisted?.status, "approved");
});

test("rejects Supplier candidate", () => {
  const workspace = seedApprovalWorkspace("Reject Supplier");
  const supplier = findCandidateByName(workspace.workspaceId, "Supplier");

  const rejected = rejectCandidateObject(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    supplier.candidateId
  );
  assert.equal(rejected.success, true);
  assert.equal(rejected.state?.status, "rejected");
});

test("renames Product candidate to Inventory Item", () => {
  const workspace = seedApprovalWorkspace("Rename Product");
  const product = findCandidateByName(workspace.workspaceId, "Product");

  const renamed = renameCandidateObject(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    product.candidateId,
    "Inventory Item"
  );
  assert.equal(renamed.success, true);
  assert.equal(renamed.state?.objectName, "Inventory Item");
  assert.equal(renamed.state?.originalObjectName, "Product");
});

test("persists multiple approvals independently", () => {
  const workspace = seedApprovalWorkspace("Multiple Approvals");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  const product = findCandidateByName(workspace.workspaceId, "Product");

  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, product.candidateId);

  const approved = getApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(approved.length, 2);
  assert.deepEqual(
    approved.map((entry) => entry.objectName).sort(),
    ["Customer", "Product"]
  );
});

test("keeps workspace approval state isolated", () => {
  const workspaceA = seedApprovalWorkspace("Workspace A");
  const workspaceB = seedApprovalWorkspace("Workspace B");
  const customerA = findCandidateByName(workspaceA.workspaceId, "Customer");
  const customerB = findCandidateByName(workspaceB.workspaceId, "Customer");

  approveCandidateObject(workspaceA.workspaceId, DATA_SOURCE_ID, customerA.candidateId);

  assert.equal(
    getCandidateApprovalState(workspaceA.workspaceId, DATA_SOURCE_ID, customerA.candidateId)?.status,
    "approved"
  );
  assert.equal(
    getCandidateApprovalState(workspaceB.workspaceId, DATA_SOURCE_ID, customerB.candidateId)?.status,
    "suggested"
  );
});

test("reloads persisted approval state from storage", () => {
  const workspace = seedApprovalWorkspace("Reload Persistence");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);

  const raw = window.localStorage.getItem(STORAGE_KEY);
  assert.ok(raw);

  resetWorkspaceObjectApprovalStoreForTests();
  window.localStorage.setItem(STORAGE_KEY, raw);

  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID);

  const reloaded = getCandidateApprovalState(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    customer.candidateId
  );
  assert.equal(reloaded?.status, "approved");
});

test("does not create workspace objects, scene nodes, or topology during approval", () => {
  const workspace = seedApprovalWorkspace("Approval Only");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  const supplier = findCandidateByName(workspace.workspaceId, "Supplier");

  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);
  rejectCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, supplier.candidateId);

  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});
