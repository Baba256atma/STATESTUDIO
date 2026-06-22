import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import {
  NEXORA_SCENE_SYNC_LOG_PREFIX,
  WORKSPACE_SCENE_SYNC_SOURCE,
  WORKSPACE_SCENE_SYNC_TAGS,
  buildWorkspaceSceneObjectId,
  resolveScenePlacement,
} from "./workspaceSceneSyncContract.ts";
import {
  approveCandidateObject,
  resetWorkspaceObjectApprovalStoreForTests,
  syncApprovalStatesForDataSource,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  createWorkspaceObjectsFromApprovedCandidates,
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
import { resetObjectApprovalPanelForTests } from "./objectApprovalPanelRuntime.ts";
import {
  getWorkspaceSceneSyncRecords,
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncPipelineForTests,
  syncWorkspaceObjectsToScene,
} from "./workspaceSceneSyncPipeline.ts";
import { getWorkspaceSceneJson, resetWorkspaceScenesForTests } from "./workspaceSceneCreationContract.ts";

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

function seedSyncWorkspace(workspaceName: string) {
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

function approveAndCreate(workspaceId: string, objectNames: readonly string[]) {
  for (const objectName of objectNames) {
    const candidate = findCandidateByName(workspaceId, objectName);
    approveCandidateObject(workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  }
  createWorkspaceObjectsFromApprovedCandidates(workspaceId, DATA_SOURCE_ID);
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
  resetWorkspaceSceneSyncPipelineForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-1:6 tags and diagnostic prefix", () => {
  assert.equal(NEXORA_SCENE_SYNC_LOG_PREFIX, "[NexoraSceneSync]");
  assert.equal(WORKSPACE_SCENE_SYNC_SOURCE, "workspace_scene_sync");
  assert.deepEqual(WORKSPACE_SCENE_SYNC_TAGS, [
    "[DS16_SCENE_SYNC]",
    "[WORKSPACE_OBJECTS_VISIBLE]",
    "[SCENE_SYNC_TRACEABILITY]",
    "[SCENE_SYNC_LOOP_PROTECTED]",
    "[DS17_READY]",
    "[DS_1_6_COMPLETE]",
  ]);
});

test("uses deterministic DS scene placement grid", () => {
  assert.deepEqual(resolveScenePlacement(0), [0, 0, 0]);
  assert.deepEqual(resolveScenePlacement(1), [3, 0, 0]);
  assert.deepEqual(resolveScenePlacement(2), [-3, 0, 0]);
  assert.deepEqual(resolveScenePlacement(3), [0, 0, -3]);
  assert.deepEqual(resolveScenePlacement(4), [0, 0, 3]);
});

test("syncs Customer workspace object to one scene object", () => {
  const workspace = seedSyncWorkspace("Sync Customer");
  approveAndCreate(workspace.workspaceId, ["Customer"]);

  const sync = syncWorkspaceObjectsToScene(workspace.workspaceId);
  assert.equal(sync.success, true);
  assert.equal(sync.createdCount, 1);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 1);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId)[0]?.objectName, "Customer");
  assert.equal(
    getWorkspaceSyncedSceneObjects(workspace.workspaceId)[0]?.sceneObjectId,
    buildWorkspaceSceneObjectId("obj_customer")
  );
});

test("syncs Supplier workspace object to one scene object", () => {
  const workspace = seedSyncWorkspace("Sync Supplier");
  approveAndCreate(workspace.workspaceId, ["Supplier"]);

  const sync = syncWorkspaceObjectsToScene(workspace.workspaceId);
  assert.equal(sync.createdCount, 1);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId)[0]?.objectName, "Supplier");
});

test("syncs multiple workspace objects to the scene", () => {
  const workspace = seedSyncWorkspace("Sync Multiple");
  approveAndCreate(workspace.workspaceId, ["Customer", "Supplier", "Product"]);

  const sync = syncWorkspaceObjectsToScene(workspace.workspaceId);
  assert.equal(sync.createdCount, 3);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 3);
});

test("skips duplicate scene sync attempts", () => {
  const workspace = seedSyncWorkspace("Duplicate Sync");
  approveAndCreate(workspace.workspaceId, ["Customer"]);

  const first = syncWorkspaceObjectsToScene(workspace.workspaceId);
  const second = syncWorkspaceObjectsToScene(workspace.workspaceId);

  assert.equal(first.createdCount, 1);
  assert.equal(second.createdCount, 0);
  assert.equal(second.duplicateCount, 1);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 1);
});

test("preserves workspace isolation when switching active workspace", () => {
  const workspaceA = seedSyncWorkspace("Scene Workspace A");
  const workspaceB = seedSyncWorkspace("Scene Workspace B");
  approveAndCreate(workspaceA.workspaceId, ["Customer"]);
  approveAndCreate(workspaceB.workspaceId, ["Supplier"]);
  syncWorkspaceObjectsToScene(workspaceA.workspaceId);
  syncWorkspaceObjectsToScene(workspaceB.workspaceId);

  setActiveWorkspace(workspaceA.workspaceId);
  assert.equal(getWorkspaceSyncedSceneObjects().length, 1);
  assert.equal(getWorkspaceSyncedSceneObjects()[0]?.objectName, "Customer");

  setActiveWorkspace(workspaceB.workspaceId);
  assert.equal(getWorkspaceSyncedSceneObjects().length, 1);
  assert.equal(getWorkspaceSyncedSceneObjects()[0]?.objectName, "Supplier");
});

test("preserves traceability chain from scene to candidate", () => {
  const workspace = seedSyncWorkspace("Traceability Sync");
  const customer = findCandidateByName(workspace.workspaceId, "Customer");
  approveAndCreate(workspace.workspaceId, ["Customer"]);
  syncWorkspaceObjectsToScene(workspace.workspaceId);

  const sceneObject = getWorkspaceSyncedSceneObjects(workspace.workspaceId)[0];
  const record = getWorkspaceSceneSyncRecords(workspace.workspaceId)[0];
  assert.ok(sceneObject);
  assert.ok(record);
  assert.equal(sceneObject.originWorkspaceObjectId, "obj_customer");
  assert.equal(sceneObject.originCandidateId, customer.candidateId);
  assert.equal(record.originCandidateId, customer.candidateId);
  assert.equal(record.objectId, "obj_customer");
});

test("builds scene json without relationships or topology", () => {
  const workspace = seedSyncWorkspace("Scene Json Sync");
  approveAndCreate(workspace.workspaceId, ["Product"]);
  syncWorkspaceObjectsToScene(workspace.workspaceId);

  const sceneJson = getWorkspaceSceneJson(workspace.workspaceId);
  assert.ok(sceneJson);
  assert.equal(sceneJson.meta?.workspaceSceneSynced, true);
  assert.equal(sceneJson.scene?.objects.length, 1);
  assert.deepEqual(sceneJson.scene?.relationships, []);
});

test("does not sync when no workspace objects exist", () => {
  const workspace = seedSyncWorkspace("No Objects");
  const sync = syncWorkspaceObjectsToScene(workspace.workspaceId);
  assert.equal(sync.success, false);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);
});
