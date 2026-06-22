/**
 * DS-1:6 — Workspace scene sync pipeline.
 * Reads workspace objects via getWorkspaceCreatedObjects only — explicit sync only.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";
import { getWorkspaceCreatedObjects } from "./workspaceObjectCreationPipeline.ts";
import type { WorkspaceCreatedObject } from "./workspaceObjectCreationContract.ts";
import {
  NEXORA_SCENE_SYNC_LOG_PREFIX,
  WORKSPACE_SCENE_SYNC_SOURCE,
  WORKSPACE_SCENE_SYNC_TAGS,
  WORKSPACE_SCENE_SYNC_VERSION,
  buildWorkspaceSceneObjectId,
  resolveScenePlacement,
  workspaceSceneSyncRecordIsComplete,
  type WorkspaceSceneSyncAction,
  type WorkspaceSceneSyncBatchResult,
  type WorkspaceSceneSyncRecord,
  type WorkspaceSceneSyncStore,
} from "./workspaceSceneSyncContract.ts";
import {
  toLegacyWorkspaceSyncedSceneObject,
  type LegacyWorkspaceSyncedSceneObject,
} from "./workspaceSceneSyncLegacyBridge.ts";

const SYNC_RECORDS_STORAGE_KEY = "nexora.workspaceSceneSyncRecords.v2";
const SYNC_OBJECTS_STORAGE_KEY = "nexora.workspaceSceneSyncObjects.v2";
const SYNC_STATE_STORAGE_KEY = "nexora.workspaceSceneSyncState.v2";

type WorkspaceSceneSyncListener = () => void;

const workspaceSceneSyncListeners = new Set<WorkspaceSceneSyncListener>();

let workspaceSceneSyncRecords: WorkspaceSceneSyncStore = {};
let workspaceSyncedSceneObjects: Record<WorkspaceId, readonly LegacyWorkspaceSyncedSceneObject[]> = {};
let workspaceSceneSyncStates: Record<
  WorkspaceId,
  Readonly<{
    contractVersion: typeof WORKSPACE_SCENE_SYNC_VERSION;
    workspaceId: WorkspaceId;
    sceneObjectIds: readonly string[];
    syncedAt: string;
    syncSource: typeof WORKSPACE_SCENE_SYNC_SOURCE;
    sceneReady: boolean;
  }>
> = {};
let workspaceSceneSyncHydrated = false;
let workspaceSceneSyncVersion = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function emitNexoraSceneSyncDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    objectId: string;
    sceneObjectId: string;
    action: WorkspaceSceneSyncAction;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("sceneSync", `${NEXORA_SCENE_SYNC_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_SCENE_SYNC_TAGS,
    phase: "DS-1:6",
  });
}

function notifyWorkspaceSceneSyncListeners(): void {
  workspaceSceneSyncVersion += 1;
  workspaceSceneSyncListeners.forEach((listener) => listener());
}

function normalizeRecordStore(raw: unknown): WorkspaceSceneSyncStore {
  if (!raw || typeof raw !== "object") return {};
  const normalized: Record<WorkspaceId, Record<string, WorkspaceSceneSyncRecord>> = {};
  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const records: Record<string, WorkspaceSceneSyncRecord> = {};
      for (const record of value as WorkspaceSceneSyncRecord[]) {
        if (!record?.objectId) continue;
        records[record.objectId] = record;
      }
      normalized[workspaceId] = Object.freeze(records);
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({
        ...(value as Record<string, WorkspaceSceneSyncRecord>),
      });
    }
  }
  return Object.freeze(normalized);
}

function readRecordStorage(): WorkspaceSceneSyncStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SYNC_RECORDS_STORAGE_KEY);
    if (!raw) return {};
    return normalizeRecordStore(JSON.parse(raw));
  } catch {
    return {};
  }
}

function readObjectStorage(): Record<WorkspaceId, readonly LegacyWorkspaceSyncedSceneObject[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SYNC_OBJECTS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<WorkspaceId, readonly LegacyWorkspaceSyncedSceneObject[]>;
  } catch {
    return {};
  }
}

function readStateStorage(): typeof workspaceSceneSyncStates {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SYNC_STATE_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as typeof workspaceSceneSyncStates;
  } catch {
    return {};
  }
}

function writeStorage(storageKey: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Sync state remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceSceneSyncStore(): void {
  if (workspaceSceneSyncHydrated) return;
  workspaceSceneSyncHydrated = true;
  workspaceSceneSyncRecords = readRecordStorage();
  workspaceSyncedSceneObjects = readObjectStorage();
  workspaceSceneSyncStates = readStateStorage();
}

function writeAllSyncStorage(): void {
  writeStorage(SYNC_RECORDS_STORAGE_KEY, workspaceSceneSyncRecords);
  writeStorage(SYNC_OBJECTS_STORAGE_KEY, workspaceSyncedSceneObjects);
  writeStorage(SYNC_STATE_STORAGE_KEY, workspaceSceneSyncStates);
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function getSyncRecordMap(workspaceId: WorkspaceId): WorkspaceSceneSyncStore[WorkspaceId] {
  return workspaceSceneSyncRecords[workspaceId] ?? Object.freeze({});
}

function freezeSyncedSceneObject(
  object: LegacyWorkspaceSyncedSceneObject
): LegacyWorkspaceSyncedSceneObject {
  return Object.freeze({
    ...object,
    sourceColumns: Object.freeze([...object.sourceColumns]),
  });
}

function freezeSyncRecord(record: WorkspaceSceneSyncRecord): WorkspaceSceneSyncRecord {
  return Object.freeze({ ...record });
}

function guardSceneSyncRead(workspaceId: WorkspaceId): boolean {
  return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
}

function sortWorkspaceObjects(
  objects: readonly WorkspaceCreatedObject[]
): readonly WorkspaceCreatedObject[] {
  return Object.freeze(
    [...objects].sort((left, right) => {
      const byName = left.objectName.localeCompare(right.objectName);
      if (byName !== 0) return byName;
      return left.objectId.localeCompare(right.objectId);
    })
  );
}

function syncSingleWorkspaceObject(input: {
  workspaceObject: WorkspaceCreatedObject;
  placementIndex: number;
  existingRecord: WorkspaceSceneSyncRecord | null;
  existingSceneObject: LegacyWorkspaceSyncedSceneObject | null;
}): {
  record: WorkspaceSceneSyncRecord;
  sceneObject: LegacyWorkspaceSyncedSceneObject | null;
  action: WorkspaceSceneSyncAction;
} {
  const workspaceId = input.workspaceObject.workspaceId;
  const objectId = input.workspaceObject.objectId;
  const sceneObjectId = buildWorkspaceSceneObjectId(objectId);
  const timestamp = nowIso();

  if (input.existingRecord?.syncStatus === "synced" && input.existingSceneObject) {
    emitNexoraSceneSyncDiagnostic("Duplicate scene sync skipped", {
      workspaceId,
      objectId,
      sceneObjectId: input.existingRecord.sceneObjectId,
      action: "duplicate",
    });
    return Object.freeze({
      record: input.existingRecord,
      sceneObject: input.existingSceneObject,
      action: "duplicate",
    });
  }

  const placementIndex = Math.max(0, input.placementIndex);
  const position = resolveScenePlacement(placementIndex);
  const nextRecord = freezeSyncRecord(
    Object.freeze({
      contractVersion: WORKSPACE_SCENE_SYNC_VERSION,
      workspaceId,
      objectId,
      sceneObjectId,
      originCandidateId: input.workspaceObject.originCandidateId,
      syncStatus: "synced",
      syncedAt: timestamp,
      syncSource: WORKSPACE_SCENE_SYNC_SOURCE,
    })
  );

  if (!workspaceSceneSyncRecordIsComplete(nextRecord)) {
    emitNexoraSceneSyncDiagnostic("Scene sync skipped", {
      workspaceId,
      objectId,
      sceneObjectId,
      action: "skipped",
      reason: "invalid_sync_record",
    });
    return Object.freeze({
      record: freezeSyncRecord(
        Object.freeze({
          contractVersion: WORKSPACE_SCENE_SYNC_VERSION,
          workspaceId,
          objectId,
          sceneObjectId,
          originCandidateId: input.workspaceObject.originCandidateId,
          syncStatus: "skipped",
          syncedAt: timestamp,
          syncSource: WORKSPACE_SCENE_SYNC_SOURCE,
        })
      ),
      sceneObject: null,
      action: "skipped",
    });
  }

  const sceneObject = toLegacyWorkspaceSyncedSceneObject({
    workspaceObject: input.workspaceObject,
    record: nextRecord,
    position,
  });

  emitNexoraSceneSyncDiagnostic("Scene object created", {
    workspaceId,
    objectId,
    sceneObjectId,
    action: "created",
    objectName: input.workspaceObject.objectName,
    originCandidateId: input.workspaceObject.originCandidateId,
  });

  return Object.freeze({
    record: nextRecord,
    sceneObject: freezeSyncedSceneObject(sceneObject),
    action: "created",
  });
}

export function syncWorkspaceObjectsToScene(
  workspaceId?: WorkspaceId | null
): WorkspaceSceneSyncBatchResult {
  hydrateWorkspaceSceneSyncStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      sceneObjectCount: 0,
      records: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace to sync objects to the scene.",
    });
  }

  if (!guardSceneSyncRead(resolvedWorkspaceId)) {
    return Object.freeze({
      success: false,
      workspaceId: resolvedWorkspaceId,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      sceneObjectCount: 0,
      records: Object.freeze([]),
      reason: "access_denied",
      message: "Unable to sync workspace objects to the scene.",
    });
  }

  const workspaceObjects = sortWorkspaceObjects(getWorkspaceCreatedObjects(resolvedWorkspaceId));
  if (workspaceObjects.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: resolvedWorkspaceId,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      sceneObjectCount: getWorkspaceSyncedSceneObjects(resolvedWorkspaceId).length,
      records: Object.freeze([]),
      reason: "no_workspace_objects",
      message: "Create workspace objects before syncing to the scene.",
    });
  }

  const existingRecords = getSyncRecordMap(resolvedWorkspaceId);
  const existingSceneObjects = workspaceSyncedSceneObjects[resolvedWorkspaceId] ?? [];
  const existingSceneByObjectId = new Map(
    existingSceneObjects.map((object) => [object.objectId, object])
  );

  let createdCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  const nextRecords: Record<string, WorkspaceSceneSyncRecord> = { ...existingRecords };
  const nextSceneObjects = new Map(
    existingSceneObjects.map((object) => [object.objectId, object])
  );

  workspaceObjects.forEach((workspaceObject, index) => {
    const existingRecord = existingRecords[workspaceObject.objectId] ?? null;
    const existingSceneObject = existingSceneByObjectId.get(workspaceObject.objectId) ?? null;
    const result = syncSingleWorkspaceObject({
      workspaceObject,
      placementIndex: existingSceneObject ? existingSceneObjects.indexOf(existingSceneObject) : nextSceneObjects.size,
      existingRecord,
      existingSceneObject,
    });

    nextRecords[workspaceObject.objectId] = result.record;
    if (result.action === "created" && result.sceneObject) {
      createdCount += 1;
      nextSceneObjects.set(workspaceObject.objectId, result.sceneObject);
      return;
    }
    if (result.action === "duplicate") {
      duplicateCount += 1;
      return;
    }
    skippedCount += 1;
    void index;
  });

  const syncedSceneObjects = Object.freeze(
    sortWorkspaceObjects(workspaceObjects)
      .map((object) => nextSceneObjects.get(object.objectId))
      .filter((object): object is LegacyWorkspaceSyncedSceneObject => Boolean(object))
      .map(freezeSyncedSceneObject)
  );

  const syncedAt = nowIso();
  workspaceSceneSyncRecords = Object.freeze({
    ...workspaceSceneSyncRecords,
    [resolvedWorkspaceId]: Object.freeze(nextRecords),
  });
  workspaceSyncedSceneObjects = Object.freeze({
    ...workspaceSyncedSceneObjects,
    [resolvedWorkspaceId]: syncedSceneObjects,
  });
  workspaceSceneSyncStates = Object.freeze({
    ...workspaceSceneSyncStates,
    [resolvedWorkspaceId]: Object.freeze({
      contractVersion: WORKSPACE_SCENE_SYNC_VERSION,
      workspaceId: resolvedWorkspaceId,
      sceneObjectIds: Object.freeze(syncedSceneObjects.map((object) => object.sceneObjectId)),
      syncedAt,
      syncSource: WORKSPACE_SCENE_SYNC_SOURCE,
      sceneReady: syncedSceneObjects.length > 0,
    }),
  });

  writeAllSyncStorage();
  notifyWorkspaceSceneSyncListeners();

  const success = createdCount > 0 || duplicateCount > 0 || syncedSceneObjects.length > 0;
  const message =
    createdCount > 0
      ? `${createdCount} scene object${createdCount === 1 ? "" : "s"} synced${
          duplicateCount > 0 ? `, ${duplicateCount} duplicate${duplicateCount === 1 ? "" : "s"} skipped` : ""
        }.`
      : duplicateCount > 0
        ? `${duplicateCount} scene object${duplicateCount === 1 ? "" : "s"} already synced.`
        : "No workspace objects were synced to the scene.";

  return Object.freeze({
    success,
    workspaceId: resolvedWorkspaceId,
    createdCount,
    skippedCount,
    duplicateCount,
    sceneObjectCount: syncedSceneObjects.length,
    records: Object.freeze(Object.values(nextRecords).map(freezeSyncRecord)),
    reason: createdCount > 0 ? "created" : duplicateCount > 0 ? "duplicate" : "skipped",
    message,
  });
}

export function getWorkspaceSceneSyncRecords(
  workspaceId: WorkspaceId
): readonly WorkspaceSceneSyncRecord[] {
  hydrateWorkspaceSceneSyncStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(Object.values(getSyncRecordMap(trimmedWorkspaceId)).map(freezeSyncRecord));
}

export function getWorkspaceSyncedSceneObjects(
  workspaceId?: WorkspaceId | null
): readonly LegacyWorkspaceSyncedSceneObject[] {
  hydrateWorkspaceSceneSyncStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    (workspaceSyncedSceneObjects[resolvedWorkspaceId] ?? []).map(freezeSyncedSceneObject)
  );
}

export function getWorkspaceSceneSyncState(workspaceId?: WorkspaceId | null) {
  hydrateWorkspaceSceneSyncStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceSceneSyncStates[resolvedWorkspaceId] ?? null;
}

export function subscribeWorkspaceSceneSyncPipeline(
  listener: WorkspaceSceneSyncListener
): () => void {
  hydrateWorkspaceSceneSyncStore();
  workspaceSceneSyncListeners.add(listener);
  return () => workspaceSceneSyncListeners.delete(listener);
}

export function getWorkspaceSceneSyncPipelineVersion(): number {
  hydrateWorkspaceSceneSyncStore();
  return workspaceSceneSyncVersion;
}

export function resetWorkspaceSceneSyncPipelineForTests(): void {
  workspaceSceneSyncRecords = {};
  workspaceSyncedSceneObjects = {};
  workspaceSceneSyncStates = {};
  workspaceSceneSyncHydrated = false;
  workspaceSceneSyncVersion = 0;
  workspaceSceneSyncListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SYNC_RECORDS_STORAGE_KEY);
      window.localStorage.removeItem(SYNC_OBJECTS_STORAGE_KEY);
      window.localStorage.removeItem(SYNC_STATE_STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspaceSceneSyncObjects.v1");
      window.localStorage.removeItem("nexora.workspaceSceneSyncState.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}
