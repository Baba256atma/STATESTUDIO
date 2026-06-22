/**
 * DS-1:6 — Workspace scene sync contract.
 * Explicit one-way sync from workspace objects to scene objects only.
 */

import type { Vector3Tuple } from "../sceneTypes.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_SCENE_SYNC_VERSION = "DS-1:6" as const;

export const WORKSPACE_SCENE_SYNC_TAGS = Object.freeze([
  "[DS16_SCENE_SYNC]",
  "[WORKSPACE_OBJECTS_VISIBLE]",
  "[SCENE_SYNC_TRACEABILITY]",
  "[SCENE_SYNC_LOOP_PROTECTED]",
  "[DS17_READY]",
  "[DS_1_6_COMPLETE]",
] as const);

export const NEXORA_SCENE_SYNC_LOG_PREFIX = "[NexoraSceneSync]" as const;

export const WORKSPACE_SCENE_SYNC_SOURCE = "workspace_scene_sync" as const;

export type WorkspaceSceneSyncStatus = "synced" | "skipped" | "duplicate";

export type WorkspaceSceneSyncAction = "created" | "skipped" | "duplicate";

export type WorkspaceSceneSyncRecord = Readonly<{
  contractVersion: typeof WORKSPACE_SCENE_SYNC_VERSION;
  workspaceId: WorkspaceId;
  objectId: string;
  sceneObjectId: string;
  originCandidateId: string;
  syncStatus: WorkspaceSceneSyncStatus;
  syncedAt: string;
  syncSource: typeof WORKSPACE_SCENE_SYNC_SOURCE;
}>;

export type WorkspaceSceneSyncRecordMap = Readonly<Record<string, WorkspaceSceneSyncRecord>>;

export type WorkspaceSceneSyncStore = Readonly<
  Record<WorkspaceId, WorkspaceSceneSyncRecordMap>
>;

export type WorkspaceSceneSyncBatchResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  createdCount: number;
  skippedCount: number;
  duplicateCount: number;
  sceneObjectCount: number;
  records: readonly WorkspaceSceneSyncRecord[];
  reason: string;
  message: string;
}>;

export const DS_SCENE_PLACEMENT_GRID: readonly Vector3Tuple[] = Object.freeze([
  [0, 0, 0],
  [3, 0, 0],
  [-3, 0, 0],
  [0, 0, -3],
  [0, 0, 3],
]);

export function buildWorkspaceSceneObjectId(workspaceObjectId: string): string {
  const slug = workspaceObjectId.trim().replace(/^obj_/, "") || "entity";
  return `scene_obj_${slug}`;
}

export function resolveScenePlacement(index: number): Vector3Tuple {
  const grid = DS_SCENE_PLACEMENT_GRID;
  const slot = grid[index % grid.length] ?? ([0, 0, 0] as Vector3Tuple);
  const cycle = Math.floor(index / grid.length);
  if (cycle === 0) return [slot[0], slot[1], slot[2]];
  const offset = cycle * 1.5;
  return [slot[0], slot[1] + offset, slot[2]];
}

export function workspaceSceneSyncRecordIsComplete(
  record: WorkspaceSceneSyncRecord | null | undefined
): record is WorkspaceSceneSyncRecord {
  if (!record || typeof record !== "object") return false;
  if (record.contractVersion !== WORKSPACE_SCENE_SYNC_VERSION) return false;
  if (typeof record.workspaceId !== "string" || !record.workspaceId.trim()) return false;
  if (typeof record.objectId !== "string" || !record.objectId.trim()) return false;
  if (typeof record.sceneObjectId !== "string" || !record.sceneObjectId.trim()) return false;
  if (typeof record.originCandidateId !== "string" || !record.originCandidateId.trim()) return false;
  if (record.syncSource !== WORKSPACE_SCENE_SYNC_SOURCE) return false;
  return true;
}
