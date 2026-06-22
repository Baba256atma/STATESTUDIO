import assert from "node:assert/strict";
import test from "node:test";

import {
  createWorkspace,
  resetWorkspaceRegistryForTests,
} from "./workspaceRegistryStore.ts";
import {
  getWorkspaceSceneJson,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  WORKSPACE_SCENE_SYNC_TAGS,
  WORKSPACE_SCENE_SYNC_VERSION,
  getWorkspaceSceneSyncState,
  getWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncForTests,
  syncWorkspaceObjectsToSceneAction,
  syncWorkspacePipelineObjectsToScene,
} from "./workspaceSceneSync.ts";
import { resetObjectApprovalPanelForTests } from "./objectApprovalPanelRuntime.ts";
import { resetPipelineWorkspaceObjectsForTests } from "./objectCreationPipeline.ts";
import {
  approveAndCreateViaPanel,
} from "./workspaceSceneSyncTestHelpers.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetPipelineWorkspaceObjectsForTests();
  resetObjectApprovalPanelForTests();
  resetWorkspaceSceneSyncForTests();
  resetWorkspaceScenesForTests();
});

test("exports DS-1:6 workspace scene sync metadata", () => {
  assert.equal(WORKSPACE_SCENE_SYNC_VERSION, "DS-1:6");
  assert.deepEqual(WORKSPACE_SCENE_SYNC_TAGS, [
    "[DS16_SCENE_SYNC]",
    "[WORKSPACE_OBJECTS_VISIBLE]",
    "[SCENE_SYNC_TRACEABILITY]",
    "[SCENE_SYNC_LOOP_PROTECTED]",
    "[DS17_READY]",
    "[DS_1_6_COMPLETE]",
  ]);
});

test("facade sync action exposes explicit scene sync only", () => {
  const workspace = createWorkspace("Facade Sync Workspace");
  approveAndCreateViaPanel(workspace, ["Customer"]);

  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 0);

  const sync = syncWorkspaceObjectsToSceneAction(workspace.workspaceId);
  assert.equal(sync.success, true);
  assert.equal(sync.createdCount, 1);
  assert.equal(getWorkspaceSyncedSceneObjects(workspace.workspaceId).length, 1);
});

test("legacy syncWorkspacePipelineObjectsToScene aliases explicit sync", () => {
  const workspace = createWorkspace("Legacy Alias Workspace");
  approveAndCreateViaPanel(workspace, ["Supplier"]);

  const sync = syncWorkspacePipelineObjectsToScene(workspace.workspaceId);
  assert.equal(sync.success, true);
  assert.equal(sync.sceneObjectCount, 1);
});

test("builds scene json from synced objects without relationships", () => {
  const workspace = createWorkspace("Facade Scene Json Workspace");
  approveAndCreateViaPanel(workspace, ["Product"]);
  syncWorkspaceObjectsToSceneAction(workspace.workspaceId);

  const sceneJson = getWorkspaceSceneJson(workspace.workspaceId);
  assert.ok(sceneJson);
  assert.equal(sceneJson.scene?.objects.length, 1);
  assert.deepEqual(sceneJson.scene?.relationships, []);

  const syncState = getWorkspaceSceneSyncState(workspace.workspaceId);
  assert.ok(syncState);
  assert.equal(syncState.sceneReady, true);
});
