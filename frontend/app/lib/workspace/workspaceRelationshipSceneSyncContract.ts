/**
 * DS-2:5 — Workspace relationship scene sync contract.
 * Sync only — no discovery, classification, approval, creation, topology, or rendering engine changes.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { NexoraRelationship, NexoraRelationshipType } from "../relationships/relationshipTypes.ts";
import {
  getWorkspaceRelationships,
  type WorkspaceRelationship,
} from "./workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_SCENE_SYNC_VERSION = "DS-2:5" as const;

export const WORKSPACE_RELATIONSHIP_SCENE_SYNC_TAGS = Object.freeze([
  "[DS25_RELATIONSHIP_SCENE_SYNC]",
  "[RELATIONSHIPS_VISIBLE_IN_SCENE]",
  "[RELATIONSHIP_TRACEABILITY_COMPLETE]",
  "[RELATIONSHIP_SYNC_LOOP_PROTECTED]",
  "[DS26_READY]",
  "[DS_2_5_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX =
  "[NexoraRelationshipSceneSync]" as const;

export const WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE = "ds-2:5-scene-sync" as const;

export type WorkspaceSceneRelationshipSyncStatus = "synced";

export type WorkspaceSceneRelationshipRecord = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_SCENE_SYNC_VERSION;
  sceneRelationshipId: string;
  workspaceId: WorkspaceId;
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  relationshipStrength: string;
  confidence: number;
  syncedAt: string;
  syncStatus: WorkspaceSceneRelationshipSyncStatus;
  source: typeof WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE;
}>;

export type WorkspaceSceneRelationshipMap = Readonly<
  Record<string, WorkspaceSceneRelationshipRecord>
>;

export type WorkspaceSceneRelationshipStore = Readonly<
  Record<WorkspaceId, WorkspaceSceneRelationshipMap>
>;

export type SyncWorkspaceRelationshipsToSceneResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  createdCount: number;
  duplicateCount: number;
  skippedCount: number;
  sceneRelationships: readonly WorkspaceSceneRelationshipRecord[];
  reason: string;
  message: string;
}>;

type RelationshipSceneSyncAction = "created" | "duplicate" | "skipped";

const STORAGE_KEY = "nexora.workspaceSceneRelationships.v1";

let workspaceSceneRelationshipStore: WorkspaceSceneRelationshipStore = {};
let workspaceSceneRelationshipHydrated = false;
let workspaceSceneRelationshipVersion = 0;

type WorkspaceRelationshipSceneSyncListener = () => void;

const workspaceRelationshipSceneSyncListeners = new Set<WorkspaceRelationshipSceneSyncListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "relationship"
  );
}

function freezeSceneRelationship(
  relationship: WorkspaceSceneRelationshipRecord
): WorkspaceSceneRelationshipRecord {
  return Object.freeze({ ...relationship });
}

function readStorage(): WorkspaceSceneRelationshipStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceSceneRelationshipStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceSceneRelationshipStore));
  } catch {
    // Relationship scene sync remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceSceneRelationshipStore(): void {
  if (workspaceSceneRelationshipHydrated) return;
  workspaceSceneRelationshipHydrated = true;
  workspaceSceneRelationshipStore = readStorage();
}

function notifyWorkspaceSceneRelationshipListeners(): void {
  workspaceSceneRelationshipVersion += 1;
  workspaceRelationshipSceneSyncListeners.forEach((listener) => listener());
}

function commitWorkspaceSceneRelationshipChange(): void {
  writeStorage();
  notifyWorkspaceSceneRelationshipListeners();
}

function emitRelationshipSceneSyncDiagnostic(input: {
  workspaceId: WorkspaceId;
  relationshipId: string;
  sceneRelationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  action: RelationshipSceneSyncAction;
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("relationshipSceneSync", NEXORA_RELATIONSHIP_SCENE_SYNC_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    relationshipId: input.relationshipId,
    sceneRelationshipId: input.sceneRelationshipId,
    sourceObjectId: input.sourceObjectId,
    targetObjectId: input.targetObjectId,
    action: input.action,
    created: input.action === "created",
    duplicate: input.action === "duplicate",
    skipped: input.action === "skipped",
    tags: WORKSPACE_RELATIONSHIP_SCENE_SYNC_TAGS,
    phase: "DS-2:5",
  });
}

function buildSceneRelationshipId(relationshipId: string): string {
  return `scene_rel_${slugify(relationshipId)}`;
}

function sceneRelationshipFromWorkspaceRelationship(
  relationship: WorkspaceRelationship,
  syncedAt: string
): WorkspaceSceneRelationshipRecord {
  return freezeSceneRelationship(
    Object.freeze({
      contractVersion: WORKSPACE_RELATIONSHIP_SCENE_SYNC_VERSION,
      sceneRelationshipId: buildSceneRelationshipId(relationship.relationshipId),
      workspaceId: relationship.workspaceId,
      relationshipId: relationship.relationshipId,
      sourceObjectId: relationship.sourceObjectId,
      targetObjectId: relationship.targetObjectId,
      relationshipType: relationship.relationshipType,
      relationshipStrength: relationship.relationshipStrength,
      confidence: relationship.confidence,
      syncedAt,
      syncStatus: "synced",
      source: WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE,
    })
  );
}

function sceneRelationshipIsComplete(
  relationship: WorkspaceSceneRelationshipRecord | null | undefined
): relationship is WorkspaceSceneRelationshipRecord {
  if (!relationship || typeof relationship !== "object") return false;
  if (relationship.contractVersion !== WORKSPACE_RELATIONSHIP_SCENE_SYNC_VERSION) return false;
  if (typeof relationship.sceneRelationshipId !== "string" || !relationship.sceneRelationshipId.trim()) return false;
  if (typeof relationship.workspaceId !== "string" || !relationship.workspaceId.trim()) return false;
  if (typeof relationship.relationshipId !== "string" || !relationship.relationshipId.trim()) return false;
  if (typeof relationship.sourceObjectId !== "string" || !relationship.sourceObjectId.trim()) return false;
  if (typeof relationship.targetObjectId !== "string" || !relationship.targetObjectId.trim()) return false;
  if (typeof relationship.relationshipType !== "string" || !relationship.relationshipType.trim()) return false;
  if (!Number.isFinite(relationship.confidence) || relationship.confidence < 0 || relationship.confidence > 1) return false;
  if (typeof relationship.syncedAt !== "string" || !relationship.syncedAt.trim()) return false;
  return relationship.source === WORKSPACE_RELATIONSHIP_SCENE_SYNC_SOURCE;
}

export function syncWorkspaceRelationshipsToScene(
  workspaceId: WorkspaceId
): SyncWorkspaceRelationshipsToSceneResult {
  hydrateWorkspaceSceneRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      sceneRelationships: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace before syncing relationships to the scene.",
    });
  }

  const workspaceRelationships = getWorkspaceRelationships(trimmedWorkspaceId);
  if (workspaceRelationships.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      createdCount: 0,
      duplicateCount: 0,
      skippedCount: 0,
      sceneRelationships: Object.freeze([]),
      reason: "no_workspace_relationships",
      message: "Create workspace relationships before syncing them to the scene.",
    });
  }

  const existingMap = workspaceSceneRelationshipStore[trimmedWorkspaceId] ?? Object.freeze({});
  const nextMap: Record<string, WorkspaceSceneRelationshipRecord> = { ...existingMap };
  const syncedRelationshipIds = new Set(
    Object.values(existingMap).map((relationship) => relationship.relationshipId)
  );
  const sceneRelationships: WorkspaceSceneRelationshipRecord[] = [];
  let createdCount = 0;
  let duplicateCount = 0;
  let skippedCount = 0;

  for (const workspaceRelationship of workspaceRelationships) {
    const next = sceneRelationshipFromWorkspaceRelationship(workspaceRelationship, nowIso());
    if (!sceneRelationshipIsComplete(next)) {
      skippedCount += 1;
      emitRelationshipSceneSyncDiagnostic({
        workspaceId: trimmedWorkspaceId,
        relationshipId: workspaceRelationship.relationshipId,
        sceneRelationshipId: buildSceneRelationshipId(workspaceRelationship.relationshipId),
        sourceObjectId: workspaceRelationship.sourceObjectId,
        targetObjectId: workspaceRelationship.targetObjectId,
        action: "skipped",
      });
      continue;
    }

    if (syncedRelationshipIds.has(next.relationshipId)) {
      duplicateCount += 1;
      const duplicate =
        Object.values(existingMap).find(
          (relationship) => relationship.relationshipId === next.relationshipId
        ) ?? next;
      sceneRelationships.push(freezeSceneRelationship(duplicate));
      emitRelationshipSceneSyncDiagnostic({
        workspaceId: trimmedWorkspaceId,
        relationshipId: duplicate.relationshipId,
        sceneRelationshipId: duplicate.sceneRelationshipId,
        sourceObjectId: duplicate.sourceObjectId,
        targetObjectId: duplicate.targetObjectId,
        action: "duplicate",
      });
      continue;
    }

    nextMap[next.sceneRelationshipId] = next;
    syncedRelationshipIds.add(next.relationshipId);
    sceneRelationships.push(next);
    createdCount += 1;
    emitRelationshipSceneSyncDiagnostic({
      workspaceId: trimmedWorkspaceId,
      relationshipId: next.relationshipId,
      sceneRelationshipId: next.sceneRelationshipId,
      sourceObjectId: next.sourceObjectId,
      targetObjectId: next.targetObjectId,
      action: "created",
    });
  }

  workspaceSceneRelationshipStore = Object.freeze({
    ...workspaceSceneRelationshipStore,
    [trimmedWorkspaceId]: Object.freeze(nextMap),
  });
  if (createdCount > 0) commitWorkspaceSceneRelationshipChange();

  return Object.freeze({
    success: createdCount > 0 || duplicateCount > 0,
    workspaceId: trimmedWorkspaceId,
    createdCount,
    duplicateCount,
    skippedCount,
    sceneRelationships: Object.freeze(sceneRelationships.map(freezeSceneRelationship)),
    reason: createdCount > 0 ? "synced" : duplicateCount > 0 ? "duplicate" : "skipped",
    message:
      createdCount > 0
        ? `${createdCount} relationship${createdCount === 1 ? "" : "s"} synced to scene.`
        : duplicateCount > 0
          ? `${duplicateCount} duplicate scene relationship${duplicateCount === 1 ? "" : "s"} skipped.`
          : "No relationships were synced to the scene.",
  });
}

export function getSceneRelationships(
  workspaceId: WorkspaceId
): readonly WorkspaceSceneRelationshipRecord[] {
  hydrateWorkspaceSceneRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceSceneRelationshipStore[trimmedWorkspaceId] ?? {}).map(
      freezeSceneRelationship
    )
  );
}

export function getSceneRelationship(
  workspaceId: WorkspaceId,
  sceneRelationshipId: string
): WorkspaceSceneRelationshipRecord | null {
  hydrateWorkspaceSceneRelationshipStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedSceneRelationshipId = sceneRelationshipId.trim();
  if (!trimmedWorkspaceId || !trimmedSceneRelationshipId) return null;
  const match =
    workspaceSceneRelationshipStore[trimmedWorkspaceId]?.[trimmedSceneRelationshipId] ?? null;
  return match ? freezeSceneRelationship(match) : null;
}

function mapWorkspaceRelationshipTypeToNexoraType(type: string): NexoraRelationshipType {
  switch (type) {
    case "supplies":
      return "supplies";
    case "owns":
    case "owned_by":
    case "managed_by":
    case "belongs_to":
    case "contains":
      return "ownership";
    case "reports_to":
      return "reports_to";
    case "depends_on":
      return "dependency";
    case "assigned_to":
      return "resource";
    case "purchases":
    case "vendor_supplies":
      return "flow";
    case "related_to":
    case "unknown":
    default:
      return "custom";
  }
}

export function adaptSceneRelationshipToNexoraRelationship(
  relationship: WorkspaceSceneRelationshipRecord,
  objectIdToSceneId?: ReadonlyMap<string, string>
): NexoraRelationship {
  const sourceSceneId = objectIdToSceneId?.get(relationship.sourceObjectId) ?? relationship.sourceObjectId;
  const targetSceneId = objectIdToSceneId?.get(relationship.targetObjectId) ?? relationship.targetObjectId;
  return Object.freeze({
    id: relationship.sceneRelationshipId,
    sourceId: sourceSceneId,
    targetId: targetSceneId,
    type: mapWorkspaceRelationshipTypeToNexoraType(relationship.relationshipType),
    direction: "uni",
    createdAt: relationship.syncedAt,
    metadata: Object.freeze({
      workspaceId: relationship.workspaceId,
      relationshipId: relationship.relationshipId,
      sourceObjectId: relationship.sourceObjectId,
      targetObjectId: relationship.targetObjectId,
      relationshipType: relationship.relationshipType,
      relationshipStrength: relationship.relationshipStrength,
      confidence: relationship.confidence,
      source: relationship.source,
      phase: "DS-2:5",
    }),
  });
}

export function adaptSceneRelationshipsToNexoraRelationships                      (input: {
  relationships: readonly WorkspaceSceneRelationshipRecord[];
  objectIdToSceneId?: ReadonlyMap<string, string>;
}): readonly NexoraRelationship[] {
  return Object.freeze(
    input.relationships.map((relationship) =>
      adaptSceneRelationshipToNexoraRelationship(relationship, input.objectIdToSceneId)
    )
  );
}

export function subscribeWorkspaceRelationshipSceneSyncRegistry(
  listener: WorkspaceRelationshipSceneSyncListener
): () => void {
  hydrateWorkspaceSceneRelationshipStore();
  workspaceRelationshipSceneSyncListeners.add(listener);
  return () => workspaceRelationshipSceneSyncListeners.delete(listener);
}

export function getWorkspaceRelationshipSceneSyncRegistryVersion(): number {
  hydrateWorkspaceSceneRelationshipStore();
  return workspaceSceneRelationshipVersion;
}

export function resetWorkspaceRelationshipSceneSyncStoreForTests(): void {
  workspaceSceneRelationshipStore = {};
  workspaceSceneRelationshipHydrated = false;
  workspaceSceneRelationshipVersion = 0;
  workspaceRelationshipSceneSyncListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
