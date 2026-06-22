import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import { getWorkspaceObjects } from "./workspaceContextResolver.ts";
import {
  NEXORA_OBJECT_CREATION_LOG_PREFIX,
  WORKSPACE_OBJECT_CREATION_SOURCE,
  WORKSPACE_OBJECT_CREATION_TAGS,
  buildWorkspaceCreatedObjectId,
} from "./workspaceObjectCreationContract.ts";
import {
  approveCandidateObject,
  rejectCandidateObject,
  resetWorkspaceObjectApprovalStoreForTests,
  syncApprovalStatesForDataSource,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  createWorkspaceObjectsFromApprovedCandidates,
  getWorkspaceCreatedObject,
  getWorkspaceCreatedObjects,
  resetWorkspaceObjectCreationStoreForTests,
} from "./workspaceObjectCreationPipeline.ts";
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
import { createSelectedApprovedObjects, resetObjectApprovalPanelForTests } from "./objectApprovalPanelRuntime.ts";

const DATA_SOURCE_ID = "wds_entities";

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

function seedCreationWorkspace(workspaceName: string) {
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

function findCandidateByName(workspaceId: string, objectName: string) {
  const candidate = syncApprovalStatesForDataSource(workspaceId, DATA_SOURCE_ID).find(
    (entry) => entry.objectName === objectName
  );
  assert.ok(candidate, `Expected candidate ${objectName}`);
  return candidate;
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
  resetWorkspaceObjectCreationStoreForTests();
  resetObjectApprovalPanelForTests();
  resetWorkspaceSceneSyncForTests();
});

test("exports DS-1:5 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_OBJECT_CREATION_LOG_PREFIX, "[NexoraObjectCreation]");
  assert.equal(WORKSPACE_OBJECT_CREATION_SOURCE, "ds-1-approved-candidate");
  assert.deepEqual(WORKSPACE_OBJECT_CREATION_TAGS, [
    "[DS15_OBJECT_CREATION]",
    "[WORKSPACE_OBJECTS_CREATED]",
    "[APPROVED_CANDIDATES_CONSUMED]",
    "[OBJECT_TRACEABILITY_ENABLED]",
    "[DS16_READY]",
    "[DS_1_5_COMPLETE]",
  ]);
});

test("creates Customer workspace object from approved candidate", () => {
  const workspace = seedCreationWorkspace("Create Customer");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  assert.ok(customer);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);

  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.success, true);
  assert.equal(created.createdCount, 1);
  assert.equal(created.objects.length, 1);
  assert.equal(created.objects[0]?.objectName, "Customer");
  assert.equal(created.objects[0]?.objectId, buildWorkspaceCreatedObjectId("Customer"));
  assert.equal(created.objects[0]?.primaryIdentifier, "customer_id");
  assert.equal(created.objects[0]?.creationSource, WORKSPACE_OBJECT_CREATION_SOURCE);
});

test("creates Supplier workspace object from approved candidate", () => {
  const workspace = seedCreationWorkspace("Create Supplier");
  const supplier = findCandidateByName(workspace.workspaceId, "Supplier");
  assert.ok(supplier);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, supplier.candidateId);

  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.createdCount, 1);
  assert.equal(created.objects[0]?.objectName, "Supplier");
  assert.equal(created.objects[0]?.objectId, buildWorkspaceCreatedObjectId("Supplier"));
});

test("creates multiple approved candidates into workspace objects", () => {
  const workspace = seedCreationWorkspace("Create Multiple");
  for (const objectName of ["Customer", "Supplier", "Product"]) {
    const candidate = findCandidateByName(workspace.workspaceId, objectName);
    assert.ok(candidate, objectName);
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  }

  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.createdCount, 3);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId).length, 3);
  assert.equal(getWorkspaceObjects(workspace.workspaceId).length, 3);
});

test("ignores rejected candidates during creation", () => {
  const workspace = seedCreationWorkspace("Rejected Ignored");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  const supplier = findCandidateByName(workspace.workspaceId, "Supplier");
  assert.ok(customer);
  assert.ok(supplier);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);
  rejectCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, supplier.candidateId);

  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.createdCount, 1);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId).length, 1);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId)[0]?.objectName, "Customer");
});

test("ignores suggested candidates during creation", () => {
  const workspace = seedCreationWorkspace("Suggested Ignored");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  assert.ok(customer);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);

  const created = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(created.createdCount, 1);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId).length, 1);
});

test("skips duplicate create attempts", () => {
  const workspace = seedCreationWorkspace("Duplicate Skip");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  assert.ok(customer);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);

  const first = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  const second = createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);

  assert.equal(first.createdCount, 1);
  assert.equal(second.createdCount, 0);
  assert.equal(second.duplicateCount, 1);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId).length, 1);
});

test("preserves workspace isolation for created objects", () => {
  const workspaceA = seedCreationWorkspace("Workspace A Objects");
  const workspaceB = seedCreationWorkspace("Workspace B Objects");
  const customerA = findCandidateByName(workspaceA.workspaceId, "Customer");
  const customerB = findCandidateByName(workspaceB.workspaceId, "Customer");
  assert.ok(customerA);
  assert.ok(customerB);

  approveCandidateObject(workspaceA.workspaceId, DATA_SOURCE_ID, customerA.candidateId);
  createWorkspaceObjectsFromApprovedCandidates(workspaceA.workspaceId, DATA_SOURCE_ID);

  assert.equal(getWorkspaceCreatedObjects(workspaceA.workspaceId).length, 1);
  assert.equal(getWorkspaceCreatedObjects(workspaceB.workspaceId).length, 0);
});

test("preserves originCandidateId traceability", () => {
  const workspace = seedCreationWorkspace("Traceability");
  const product = findCandidateByName(workspace.workspaceId, "Product");
  assert.ok(product);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, product.candidateId);

  createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  const created = getWorkspaceCreatedObjects(workspace.workspaceId)[0];
  assert.ok(created);
  assert.equal(created.originCandidateId, product.candidateId);
  assert.equal(
    getWorkspaceCreatedObject(workspace.workspaceId, created.objectId)?.originCandidateId,
    product.candidateId
  );
});

test("does not create scene nodes during object creation", () => {
  const workspace = seedCreationWorkspace("No Scene Writes");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  assert.ok(customer);
  approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, customer.candidateId);

  createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});

test("create selected objects action uses approved candidates only", () => {
  const workspace = seedCreationWorkspace("Create Selected");
  for (const objectName of ["Customer", "Supplier"]) {
    const candidate = findCandidateByName(workspace.workspaceId, objectName);
    assert.ok(candidate);
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  }
  rejectCandidateObject(
    workspace.workspaceId,
    DATA_SOURCE_ID,
    findCandidateByName(workspace.workspaceId, "Product")!.candidateId
  );

  const created = createSelectedApprovedObjects(workspace.workspaceId);
  assert.equal(created.success, true);
  assert.equal(getWorkspaceCreatedObjects(workspace.workspaceId).length, 2);
});
