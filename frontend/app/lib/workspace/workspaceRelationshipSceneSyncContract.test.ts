import assert from "node:assert/strict";
import test from "node:test";

import { readValidatedSceneRelationshipsForRender } from "../relationships/relationshipRendererRuntime.ts";
import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
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
import {
  discoverCandidateRelationships,
  resetWorkspaceRelationshipCandidateStoreForTests,
} from "./workspaceRelationshipCandidateContract.ts";
import {
  classifyCandidateRelationships,
  resetWorkspaceRelationshipClassificationStoreForTests,
} from "./workspaceRelationshipClassificationContract.ts";
import {
  approveRelationshipCandidate,
  getRelationshipApprovalState,
  resetWorkspaceRelationshipApprovalStoreForTests,
} from "./workspaceRelationshipApprovalContract.ts";
import {
  createApprovedRelationships,
  resetWorkspaceRelationshipCreationStoreForTests,
} from "./workspaceRelationshipCreationContract.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
  syncWorkspaceObjectsToSceneAction,
} from "./workspaceSceneSync.ts";
import {
  NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX,
  WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE,
  WORKSPACE_RELATIONSHIP_SCENE_SYNC_TAGS,
  getSceneRelationship,
  getSceneRelationships,
  resetWorkspaceRelationshipSceneSyncStoreForTests,
  syncWorkspaceRelationshipsToScene,
} from "./workspaceRelationshipSceneSyncContract.ts";

const DATA_SOURCE_ID = "wds_relationship_scene_sync_entities";

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

function seedRelationshipSceneSyncWorkspace(workspaceName: string, csvText: string) {
  const workspace = createWorkspace(workspaceName);
  importWorkspaceDataSource({
    workspaceId: workspace.workspaceId,
    dataSourceId: DATA_SOURCE_ID,
    name: "relationship_scene_sync_entities",
    type: "csv",
    status: "connected",
    metadata: Object.freeze({
      fileName: "relationship_scene_sync_entities.csv",
      csvText,
    }),
  });
  assert.equal(
    discoverAndSaveWorkspaceDataSourceSchema({
      workspaceId: workspace.workspaceId,
      dataSourceId: DATA_SOURCE_ID,
      fileName: "relationship_scene_sync_entities.csv",
      csvText,
    }).success,
    true
  );
  assert.equal(classifyDataSourceColumns(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  assert.equal(discoverCandidateObjects(workspace.workspaceId, DATA_SOURCE_ID).success, true);
  syncApprovalStatesForDataSource(workspace.workspaceId, DATA_SOURCE_ID).forEach((candidate) => {
    approveCandidateObject(workspace.workspaceId, DATA_SOURCE_ID, candidate.candidateId);
  });
  assert.equal(
    createWorkspaceObjectsFromApprovedCandidates(workspace.workspaceId, DATA_SOURCE_ID).success,
    true
  );
  assert.equal(discoverCandidateRelationships(workspace.workspaceId).success, true);
  assert.equal(classifyCandidateRelationships(workspace.workspaceId).success, true);
  assert.equal(syncWorkspaceObjectsToSceneAction(workspace.workspaceId).success, true);
  return workspace;
}

function approveAndCreateRelationship(workspaceId: string, relationshipType: string): void {
  const approval = getRelationshipApprovalState(workspaceId).approvals.find(
    (entry) => entry.relationshipType === relationshipType
  );
  assert.ok(approval, `Expected relationship approval ${relationshipType}`);
  assert.equal(approveRelationshipCandidate(workspaceId, approval.candidateRelationshipId).success, true);
  assert.equal(createApprovedRelationships(workspaceId).success, true);
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
  resetWorkspaceRelationshipCandidateStoreForTests();
  resetWorkspaceRelationshipClassificationStoreForTests();
  resetWorkspaceRelationshipApprovalStoreForTests();
  resetWorkspaceRelationshipCreationStoreForTests();
  resetWorkspaceRelationshipSceneSyncStoreForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-2:5 tags, source, and diagnostic prefix", () => {
  assert.equal(NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX, "[NexoraRelationshipSceneSync]");
  assert.equal(WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE, "ds-2:5-scene-sync");
  assert.deepEqual(WORKSPACE_RELATIONSHIP_SCENE_SYNC_TAGS, [
    "[DS25_RELATIONSHIP_SCENE_SYNC]",
    "[RELATIONSHIPS_VISIBLE_IN_SCENE]",
    "[RELATIONSHIP_TRACEABILITY_COMPLETE]",
    "[RELATIONSHIP_SYNC_LOOP_PROTECTED]",
    "[DS26_READY]",
    "[DS_2_5_COMPLETE]",
  ]);
});

test("syncs a single Supplier to Product relationship to the scene", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Single Relationship Scene Sync",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");

  const result = syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  assert.equal(result.success, true);
  assert.equal(result.createdCount, 1);
  assert.equal(getSceneRelationships(workspace.workspaceId).length, 1);
  const sceneRelationship = result.sceneRelationships[0];
  assert.ok(sceneRelationship);
  assert.equal(sceneRelationship.sourceObjectId, "obj_supplier");
  assert.equal(sceneRelationship.targetObjectId, "obj_product");
  assert.equal(sceneRelationship.source, WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE);
});

test("syncs multiple relationships", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Multiple Relationship Scene Sync",
    "customer_id,customer_name,supplier_id,supplier_name,product_id,product_name\n1,Acme,10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "purchases");
  approveAndCreateRelationship(workspace.workspaceId, "supplies");

  const result = syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  assert.equal(result.createdCount, 2);
  assert.equal(getSceneRelationships(workspace.workspaceId).length, 2);
});

test("skips duplicate scene sync", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Duplicate Relationship Scene Sync",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");

  const first = syncWorkspaceRelationshipsToScene(workspace.workspaceId);
  const second = syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  assert.equal(first.createdCount, 1);
  assert.equal(second.createdCount, 0);
  assert.equal(second.duplicateCount, 1);
  assert.equal(getSceneRelationships(workspace.workspaceId).length, 1);
});

test("preserves workspace isolation and workspace switching", () => {
  const workspaceA = seedRelationshipSceneSyncWorkspace(
    "Scene Sync Workspace A",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  const workspaceB = seedRelationshipSceneSyncWorkspace(
    "Scene Sync Workspace B",
    "customer_id,customer_name,product_id,product_name\n1,Acme,100,Widget\n"
  );
  approveAndCreateRelationship(workspaceA.workspaceId, "supplies");
  syncWorkspaceRelationshipsToScene(workspaceA.workspaceId);

  assert.equal(getSceneRelationships(workspaceA.workspaceId).length, 1);
  assert.equal(getSceneRelationships(workspaceB.workspaceId).length, 0);

  setActiveWorkspace(workspaceA.workspaceId);
  assert.equal(getWorkspaceSceneJson()?.scene.relationships?.length, 1);
  setActiveWorkspace(workspaceB.workspaceId);
  assert.equal(getWorkspaceSceneJson()?.scene.relationships?.length ?? 0, 0);
});

test("preserves relationship traceability", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Relationship Scene Traceability",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");
  syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  const sceneRelationship = getSceneRelationships(workspace.workspaceId)[0];
  assert.ok(sceneRelationship);
  assert.equal(
    getSceneRelationship(workspace.workspaceId, sceneRelationship.sceneRelationshipId)?.relationshipId,
    sceneRelationship.relationshipId
  );
  assert.match(sceneRelationship.relationshipId, /obj_supplier_obj_product/);
});

test("relationship rendering appears through existing renderer contract", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Relationship Rendering Appears",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");
  syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  const sceneJson = getWorkspaceSceneJson(workspace.workspaceId);
  assert.ok(sceneJson);
  const rendered = readValidatedSceneRelationshipsForRender(sceneJson, sceneJson.scene.objects);

  assert.equal(rendered.length, 1);
  assert.equal(rendered[0]?.sourceId, "scene_obj_supplier");
  assert.equal(rendered[0]?.targetId, "scene_obj_product");
});

test("does not move objects or create topology", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "No Movement Relationship Sync",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");
  const beforePositions = getWorkspaceSyncedSceneObjects(workspace.workspaceId).map((object) => ({
    id: object.id,
    position: object.position,
  }));

  syncWorkspaceRelationshipsToScene(workspace.workspaceId);

  const afterPositions = getWorkspaceSyncedSceneObjects(workspace.workspaceId).map((object) => ({
    id: object.id,
    position: object.position,
  }));
  const sceneJson = getWorkspaceSceneJson(workspace.workspaceId);
  assert.deepEqual(afterPositions, beforePositions);
  assert.deepEqual(sceneJson?.scene.loops, []);
  assert.equal((sceneJson as { scene?: { topology?: unknown } })?.scene?.topology, undefined);
});

test("does not automatically sync during relationship creation", () => {
  const workspace = seedRelationshipSceneSyncWorkspace(
    "Explicit Relationship Scene Sync",
    "supplier_id,supplier_name,product_id,product_name\n10,Global Supply,100,Widget\n"
  );
  approveAndCreateRelationship(workspace.workspaceId, "supplies");

  assert.equal(getSceneRelationships(workspace.workspaceId).length, 0);
  assert.equal(getWorkspaceSceneJson(workspace.workspaceId)?.scene.relationships?.length ?? 0, 0);
});
