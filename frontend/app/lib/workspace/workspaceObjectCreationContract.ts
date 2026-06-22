/**
 * DS-1:5 — Workspace object creation contract.
 * Creates workspace objects from approved candidates only — no scene, topology, or relationships.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_OBJECT_CREATION_VERSION = "DS-1:5" as const;

export const WORKSPACE_OBJECT_CREATION_TAGS = Object.freeze([
  "[DS15_OBJECT_CREATION]",
  "[WORKSPACE_OBJECTS_CREATED]",
  "[APPROVED_CANDIDATES_CONSUMED]",
  "[OBJECT_TRACEABILITY_ENABLED]",
  "[DS16_READY]",
  "[DS_1_5_COMPLETE]",
] as const);

export const NEXORA_OBJECT_CREATION_LOG_PREFIX = "[NexoraObjectCreation]" as const;

export const WORKSPACE_OBJECT_CREATION_SOURCE = "ds-1-approved-candidate" as const;

export type WorkspaceObjectCreationAction = "created" | "skipped" | "duplicate";

export type WorkspaceCreatedObject = Readonly<{
  contractVersion: typeof WORKSPACE_OBJECT_CREATION_VERSION;
  objectId: string;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  objectName: string;
  objectType: string;
  primaryIdentifier: string | null;
  sourceColumns: readonly string[];
  originCandidateId: string;
  createdAt: string;
  updatedAt: string;
  creationSource: typeof WORKSPACE_OBJECT_CREATION_SOURCE;
}>;

export type WorkspaceCreatedObjectMap = Readonly<Record<string, WorkspaceCreatedObject>>;

export type WorkspaceObjectCreationStore = Readonly<
  Record<WorkspaceId, WorkspaceCreatedObjectMap>
>;

export type WorkspaceObjectCreationItemResult = Readonly<{
  success: boolean;
  object: WorkspaceCreatedObject | null;
  action: WorkspaceObjectCreationAction;
  reason: string;
}>;

export type WorkspaceObjectCreationBatchResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  dataSourceId: string | null;
  createdCount: number;
  skippedCount: number;
  duplicateCount: number;
  objects: readonly WorkspaceCreatedObject[];
  reason: string;
  message: string;
}>;

export function buildWorkspaceCreatedObjectId(objectName: string): string {
  const slug =
    objectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48) || "entity";
  return `obj_${slug}`;
}

export function resolveWorkspaceObjectType(objectName: string): string {
  return (
    objectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48) || "entity"
  );
}

export function workspaceCreatedObjectIsComplete(
  object: WorkspaceCreatedObject | null | undefined
): object is WorkspaceCreatedObject {
  if (!object || typeof object !== "object") return false;
  if (object.contractVersion !== WORKSPACE_OBJECT_CREATION_VERSION) return false;
  if (typeof object.objectId !== "string" || !object.objectId.trim()) return false;
  if (typeof object.workspaceId !== "string" || !object.workspaceId.trim()) return false;
  if (typeof object.dataSourceId !== "string" || !object.dataSourceId.trim()) return false;
  if (typeof object.objectName !== "string" || !object.objectName.trim()) return false;
  if (typeof object.objectType !== "string" || !object.objectType.trim()) return false;
  if (!Array.isArray(object.sourceColumns)) return false;
  if (typeof object.originCandidateId !== "string" || !object.originCandidateId.trim()) return false;
  if (object.creationSource !== WORKSPACE_OBJECT_CREATION_SOURCE) return false;
  return true;
}
