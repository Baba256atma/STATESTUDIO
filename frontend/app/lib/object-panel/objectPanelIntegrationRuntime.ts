/**
 * DS-3:6 — Object Panel integration runtime.
 * Integration only: selected object id -> workspace object id -> intelligence profile state.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import {
  getWorkspaceCreatedObject,
  getWorkspaceCreatedObjects,
} from "../workspace/workspaceObjectCreationPipeline.ts";
import { getWorkspaceSyncedSceneObjects } from "../workspace/workspaceSceneSync.ts";
import {
  getObjectIntelligenceProfile,
  type WorkspaceObjectIntelligenceProfile,
} from "../workspace/workspaceObjectIntelligenceContract.ts";
import {
  getImpactProfile,
  type WorkspaceImpactRecord,
} from "../workspace/workspaceImpactEngineContract.ts";
import {
  getDependencyProfile,
  type WorkspaceDependencyRecord,
} from "../workspace/workspaceDependencyEngineContract.ts";
import {
  getConfidenceProfile,
  type WorkspaceConfidenceRecord,
} from "../workspace/workspaceConfidenceEngineContract.ts";

export const OBJECT_PANEL_INTEGRATION_TAGS = Object.freeze([
  "[DS36_OBJECT_PANEL_INTEGRATION]",
  "[OBJECT_CLICK_INTELLIGENCE_CONNECTED]",
  "[OBJECT_PANEL_RUNTIME_STABLE]",
  "[OBJECT_INTELLIGENCE_MVP_READY]",
  "[DS37_READY]",
  "[DS_3_6_COMPLETE]",
] as const);

export const NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX =
  "[NexoraObjectPanelIntegration]" as const;

export type ObjectPanelIntegrationResolutionKind =
  | "workspace_object"
  | "synced_scene_object"
  | "scene_object_prefix"
  | "intelligence_only"
  | "unresolved";

export type ObjectPanelIntegrationState = Readonly<{
  workspaceId: string;
  objectId: string;
  resolvedObjectId: string;
  resolutionKind: ObjectPanelIntegrationResolutionKind;
  objectExists: boolean;
  intelligenceProfile: WorkspaceObjectIntelligenceProfile | null;
  impactProfile: WorkspaceImpactRecord | null;
  dependencyProfile: WorkspaceDependencyRecord | null;
  confidenceProfile: WorkspaceConfidenceRecord | null;
  impactLoaded: boolean;
  dependencyLoaded: boolean;
  confidenceLoaded: boolean;
  panelRendered: boolean;
}>;

export type ObjectPanelIntegrationInput = Readonly<{
  workspaceId?: string | null;
  objectId?: string | null;
}>;

function normalizeId(value: unknown): string {
  return String(value ?? "").trim();
}

function findSyncedSceneObjectOrigin(input: {
  workspaceId: string;
  objectId: string;
}): string | null {
  const syncedObjects = getWorkspaceSyncedSceneObjects(input.workspaceId);
  const match =
    syncedObjects.find((object) => {
      const ids = [
        object.id,
        object.objectId,
        object.sceneObjectId,
        object.originWorkspaceObjectId,
      ].map(normalizeId);
      return ids.includes(input.objectId);
    }) ?? null;
  return normalizeId(match?.originWorkspaceObjectId ?? match?.objectId) || null;
}

function resolveSelectedObjectId(input: {
  workspaceId: string;
  objectId: string;
}): Readonly<{
  resolvedObjectId: string;
  resolutionKind: ObjectPanelIntegrationResolutionKind;
}> {
  if (!input.workspaceId || !input.objectId) {
    return Object.freeze({ resolvedObjectId: "", resolutionKind: "unresolved" });
  }

  if (getWorkspaceCreatedObject(input.workspaceId, input.objectId)) {
    return Object.freeze({
      resolvedObjectId: input.objectId,
      resolutionKind: "workspace_object",
    });
  }

  const syncedOrigin = findSyncedSceneObjectOrigin(input);
  if (syncedOrigin && getWorkspaceCreatedObject(input.workspaceId, syncedOrigin)) {
    return Object.freeze({
      resolvedObjectId: syncedOrigin,
      resolutionKind: "synced_scene_object",
    });
  }

  if (input.objectId.startsWith("scene_")) {
    const withoutScenePrefix = input.objectId.slice("scene_".length);
    if (getWorkspaceCreatedObject(input.workspaceId, withoutScenePrefix)) {
      return Object.freeze({
        resolvedObjectId: withoutScenePrefix,
        resolutionKind: "scene_object_prefix",
      });
    }
  }

  const createdObjects = getWorkspaceCreatedObjects(input.workspaceId);
  if (createdObjects.length === 0) {
    const directProfile = getObjectIntelligenceProfile(input.workspaceId, input.objectId);
    if (directProfile) {
      return Object.freeze({
        resolvedObjectId: input.objectId,
        resolutionKind: "intelligence_only",
      });
    }
    if (input.objectId.startsWith("scene_")) {
      const withoutScenePrefix = input.objectId.slice("scene_".length);
      if (getObjectIntelligenceProfile(input.workspaceId, withoutScenePrefix)) {
        return Object.freeze({
          resolvedObjectId: withoutScenePrefix,
          resolutionKind: "intelligence_only",
        });
      }
    }
  }

  return Object.freeze({ resolvedObjectId: "", resolutionKind: "unresolved" });
}

export function resolveObjectPanelIntegrationState(
  input: ObjectPanelIntegrationInput
): ObjectPanelIntegrationState {
  const workspaceId = normalizeId(input.workspaceId ?? getActiveWorkspaceId());
  const objectId = normalizeId(input.objectId);
  const resolved = resolveSelectedObjectId({ workspaceId, objectId });
  const objectExists = Boolean(
    resolved.resolvedObjectId &&
      (getWorkspaceCreatedObject(workspaceId, resolved.resolvedObjectId) ||
        resolved.resolutionKind === "intelligence_only")
  );
  const intelligenceProfile =
    objectExists && resolved.resolvedObjectId
      ? getObjectIntelligenceProfile(workspaceId, resolved.resolvedObjectId)
      : null;
  const impactProfile =
    objectExists && resolved.resolvedObjectId
      ? getImpactProfile(workspaceId, resolved.resolvedObjectId)
      : null;
  const dependencyProfile =
    objectExists && resolved.resolvedObjectId
      ? getDependencyProfile(workspaceId, resolved.resolvedObjectId)
      : null;
  const confidenceProfile =
    objectExists && resolved.resolvedObjectId
      ? getConfidenceProfile(workspaceId, resolved.resolvedObjectId)
      : null;
  const panelRendered = Boolean(objectId && objectExists);

  const state = Object.freeze({
    workspaceId,
    objectId,
    resolvedObjectId: resolved.resolvedObjectId,
    resolutionKind: resolved.resolutionKind,
    objectExists,
    intelligenceProfile,
    impactProfile,
    dependencyProfile,
    confidenceProfile,
    impactLoaded: Boolean(impactProfile),
    dependencyLoaded: Boolean(dependencyProfile),
    confidenceLoaded: Boolean(confidenceProfile),
    panelRendered,
  });

  if (workspaceId || objectId) {
    devDiagnosticLog("objectPanelIntegration", NEXORA_OBJECT_PANEL_INTEGRATION_LOG_PREFIX, {
      workspaceId,
      objectId,
      resolvedObjectId: state.resolvedObjectId,
      impactLoaded: state.impactLoaded,
      dependencyLoaded: state.dependencyLoaded,
      confidenceLoaded: state.confidenceLoaded,
      panelRendered: state.panelRendered,
      tags: OBJECT_PANEL_INTEGRATION_TAGS,
      phase: "DS-3:6",
    });
  }

  return state;
}
