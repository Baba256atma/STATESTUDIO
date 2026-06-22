/**
 * Legacy DS-1:6 bridge for scene sync facade and scene JSON builders.
 */

import type { SceneObject, Vector3Tuple } from "../sceneTypes.ts";
import type { WorkspaceCreatedObject } from "./workspaceObjectCreationContract.ts";
import {
  WORKSPACE_SCENE_SYNC_SOURCE,
  WORKSPACE_SCENE_SYNC_VERSION,
  buildWorkspaceSceneObjectId,
  type WorkspaceSceneSyncRecord,
} from "./workspaceSceneSyncContract.ts";

export type LegacyWorkspaceSyncedSceneObjectSource = "workspace_scene_sync";

export type LegacyWorkspaceSyncedSceneObject = SceneObject &
  Readonly<{
    objectId: string;
    sceneObjectId: string;
    workspaceId: string;
    originWorkspaceObjectId: string;
    originCandidateId: string;
    dataSourceId: string;
    objectName: string;
    objectType: string;
    source: LegacyWorkspaceSyncedSceneObjectSource;
    sourceColumns: readonly string[];
    primaryIdentifier: string | null;
    position: Vector3Tuple;
    pos: Vector3Tuple;
    status: "scene_ready";
  }>;

function sceneColorForType(objectType: string): string {
  const normalized = objectType.trim().toLowerCase();
  if (normalized.includes("customer")) return "#38bdf8";
  if (normalized.includes("supplier")) return "#34d399";
  if (normalized.includes("warehouse")) return "#a78bfa";
  if (normalized.includes("product")) return "#f8fafc";
  return "#cbd5e1";
}

export function toLegacyWorkspaceSyncedSceneObject(input: {
  workspaceObject: WorkspaceCreatedObject;
  record: WorkspaceSceneSyncRecord;
  position: Vector3Tuple;
}): LegacyWorkspaceSyncedSceneObject {
  const sceneObjectId = input.record.sceneObjectId;
  return Object.freeze({
    id: sceneObjectId,
    objectId: input.workspaceObject.objectId,
    sceneObjectId,
    workspaceId: input.workspaceObject.workspaceId,
    originWorkspaceObjectId: input.workspaceObject.objectId,
    originCandidateId: input.workspaceObject.originCandidateId,
    candidateId: input.workspaceObject.originCandidateId,
    dataSourceId: input.workspaceObject.dataSourceId,
    label: input.workspaceObject.objectName,
    name: input.workspaceObject.objectName,
    objectName: input.workspaceObject.objectName,
    type: input.workspaceObject.objectType,
    objectType: input.workspaceObject.objectType,
    source: WORKSPACE_SCENE_SYNC_SOURCE,
    sourceColumns: Object.freeze([...input.workspaceObject.sourceColumns]),
    primaryIdentifier: input.workspaceObject.primaryIdentifier,
    position: input.position,
    pos: input.position,
    status: "scene_ready",
    color: sceneColorForType(input.workspaceObject.objectType),
    scale: 1,
    role: "entity",
    semantic: Object.freeze({
      display_label: input.workspaceObject.objectName,
      canonical_name: input.workspaceObject.objectName,
      role: "entity",
      source: WORKSPACE_SCENE_SYNC_SOURCE,
    }),
    metadata: Object.freeze({
      phase: WORKSPACE_SCENE_SYNC_VERSION,
      originWorkspaceObjectId: input.workspaceObject.objectId,
      originCandidateId: input.workspaceObject.originCandidateId,
      sceneObjectId,
      dataSourceId: input.workspaceObject.dataSourceId,
      sourceColumns: Object.freeze([...input.workspaceObject.sourceColumns]),
      primaryIdentifier: input.workspaceObject.primaryIdentifier,
      syncSource: WORKSPACE_SCENE_SYNC_SOURCE,
      createsRelationships: false,
      createsTopology: false,
    }),
  });
}

export function buildLegacySceneObjectId(workspaceObject: WorkspaceCreatedObject): string {
  return buildWorkspaceSceneObjectId(workspaceObject.objectId);
}
