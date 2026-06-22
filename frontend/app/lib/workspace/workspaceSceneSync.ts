/**
 * Legacy workspace scene sync facade — delegates to DS-1:6 workspace modules.
 */

import type { SceneJson } from "../sceneTypes.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { PipelineWorkspaceObject } from "./objectCreationPipeline.ts";
import {
  WORKSPACE_SCENE_SYNC_TAGS,
  WORKSPACE_SCENE_SYNC_VERSION,
} from "./workspaceSceneSyncContract.ts";
import {
  getWorkspaceSceneSyncPipelineVersion,
  getWorkspaceSceneSyncRecords,
  getWorkspaceSceneSyncState as readWorkspaceSceneSyncState,
  getWorkspaceSyncedSceneObjects as readWorkspaceSyncedSceneObjects,
  resetWorkspaceSceneSyncPipelineForTests,
  subscribeWorkspaceSceneSyncPipeline,
  syncWorkspaceObjectsToScene,
} from "./workspaceSceneSyncPipeline.ts";
import type { LegacyWorkspaceSyncedSceneObject } from "./workspaceSceneSyncLegacyBridge.ts";
import {
  adaptSceneRelationshipsToNexoraRelationships,
  getSceneRelationships,
  getWorkspaceRelationshipSceneSyncRegistryVersion,
  subscribeWorkspaceRelationshipSceneSyncRegistry,
} from "./workspaceRelationshipSceneSyncContract.ts";

export { WORKSPACE_SCENE_SYNC_VERSION };

export { WORKSPACE_SCENE_SYNC_TAGS };

export type WorkspaceSyncedSceneObjectSource = "workspace_scene_sync" | "DataSourcePipeline";

export type WorkspaceSyncedSceneObject = LegacyWorkspaceSyncedSceneObject & Readonly<{
  source: WorkspaceSyncedSceneObjectSource;
  confidence?: "high" | "medium" | "low";
}>;

export type WorkspaceSceneSyncState = Readonly<{
  contractVersion: typeof WORKSPACE_SCENE_SYNC_VERSION;
  workspaceId: WorkspaceId;
  sceneObjectIds: readonly string[];
  syncedAt: string;
  source: WorkspaceSyncedSceneObjectSource;
  sceneReady: boolean;
}>;

export type WorkspaceSceneSyncResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  createdCount: number;
  removedCount: number;
  updatedCount: number;
  sceneObjectCount: number;
  reason: string;
  message?: string;
}>;

function toFacadeSceneObject(
  object: LegacyWorkspaceSyncedSceneObject
): WorkspaceSyncedSceneObject {
  return Object.freeze({
    ...object,
    source: "workspace_scene_sync",
  });
}

function toFacadeSyncState(
  state: ReturnType<typeof readWorkspaceSceneSyncState>
): WorkspaceSceneSyncState | null {
  if (!state) return null;
  return Object.freeze({
    contractVersion: WORKSPACE_SCENE_SYNC_VERSION,
    workspaceId: state.workspaceId,
    sceneObjectIds: state.sceneObjectIds,
    syncedAt: state.syncedAt,
    source: "workspace_scene_sync",
    sceneReady: state.sceneReady,
  });
}

function buildSyncedWorkspaceSceneJson(input: {
  workspaceId: WorkspaceId;
  objects: readonly WorkspaceSyncedSceneObject[];
  syncState: WorkspaceSceneSyncState;
}): SceneJson {
  const objectIdToSceneId = new Map(
    input.objects.map((object) => [object.originWorkspaceObjectId ?? object.objectId, object.id])
  );
  const relationships = adaptSceneRelationshipsToNexoraRelationships({
    relationships: getSceneRelationships(input.workspaceId),
    objectIdToSceneId,
  });
  return {
    state_vector: {},
    meta: {
      phase: "DS-1:6",
      workspaceId: input.workspaceId,
      workspaceSceneSynced: true,
      workspaceSceneCreated: true,
      source: "workspace_scene_sync",
      sceneSyncContractVersion: WORKSPACE_SCENE_SYNC_VERSION,
      sceneObjectCount: input.objects.length,
      syncedAt: input.syncState.syncedAt,
    },
    scene: {
      camera: { autoFrame: true },
      objects: [...input.objects],
      relationships: [...relationships],
      loops: [],
      animations: [],
    },
    workspace_scene_sync: {
      workspaceId: input.workspaceId,
      sceneReady: input.syncState.sceneReady,
      syncedAt: input.syncState.syncedAt,
      sceneObjectIds: [...input.syncState.sceneObjectIds],
    },
  } as SceneJson;
}

export function subscribeWorkspaceSceneSync(listener: () => void): () => void {
  const unsubscribeObjects = subscribeWorkspaceSceneSyncPipeline(listener);
  const unsubscribeRelationships = subscribeWorkspaceRelationshipSceneSyncRegistry(listener);
  return () => {
    unsubscribeObjects();
    unsubscribeRelationships();
  };
}

export function getWorkspaceSceneSyncVersionSnapshot(): number {
  return getWorkspaceSceneSyncPipelineVersion() + getWorkspaceRelationshipSceneSyncRegistryVersion();
}

export function getWorkspaceSyncedSceneObjects(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceSyncedSceneObject[] {
  return Object.freeze(readWorkspaceSyncedSceneObjects(workspaceId).map(toFacadeSceneObject));
}

export function getWorkspaceSceneSyncState(
  workspaceId?: WorkspaceId | null
): WorkspaceSceneSyncState | null {
  return toFacadeSyncState(readWorkspaceSceneSyncState(workspaceId));
}

export function syncWorkspaceObjectsToSceneAction(
  workspaceId?: WorkspaceId | null
): WorkspaceSceneSyncResult {
  const result = syncWorkspaceObjectsToScene(workspaceId);
  return Object.freeze({
    success: result.success,
    workspaceId: result.workspaceId,
    createdCount: result.createdCount,
    removedCount: 0,
    updatedCount: result.duplicateCount,
    sceneObjectCount: result.sceneObjectCount,
    reason: result.reason,
    message: result.message,
  });
}

export function syncWorkspacePipelineObjectsToScene(
  workspaceId?: WorkspaceId | null
): WorkspaceSceneSyncResult {
  return syncWorkspaceObjectsToSceneAction(workspaceId);
}

export function adaptPipelineWorkspaceObjectToSceneObject(input: {
  object: PipelineWorkspaceObject;
  index: number;
  total: number;
}): WorkspaceSyncedSceneObject {
  void input.total;
  const position = [
    [0, 0, 0],
    [3, 0, 0],
    [-3, 0, 0],
    [0, 0, -3],
    [0, 0, 3],
  ][input.index % 5] as [number, number, number];
  return Object.freeze({
    id: `scene_${input.object.objectId}`,
    objectId: input.object.objectId,
    sceneObjectId: `scene_${input.object.objectId}`,
    workspaceId: input.object.workspaceId,
    originWorkspaceObjectId: input.object.objectId,
    originCandidateId: input.object.candidateId,
    candidateId: input.object.candidateId,
    dataSourceId: input.object.dataSourceId,
    label: input.object.objectName,
    name: input.object.objectName,
    objectName: input.object.objectName,
    type: "entity",
    objectType: "entity",
    source: "workspace_scene_sync",
    sourceColumns: Object.freeze([...input.object.sourceColumns]),
    primaryIdentifier: null,
    position,
    pos: position,
    status: "scene_ready",
    color: "#cbd5e1",
    scale: 1,
    role: "entity",
    confidence: input.object.confidence,
  });
}

export function getWorkspaceSyncedSceneJson(workspaceId?: WorkspaceId | null): SceneJson | null {
  const objects = getWorkspaceSyncedSceneObjects(workspaceId);
  const syncState = getWorkspaceSceneSyncState(workspaceId);
  if (!syncState || objects.length === 0) return null;
  const resolvedWorkspaceId = syncState.workspaceId;
  return buildSyncedWorkspaceSceneJson({
    workspaceId: resolvedWorkspaceId,
    objects,
    syncState,
  });
}

export function resetWorkspaceSceneSyncForTests(): void {
  resetWorkspaceSceneSyncPipelineForTests();
}

export {
  getWorkspaceSceneSyncRecords,
  syncWorkspaceObjectsToScene,
};
