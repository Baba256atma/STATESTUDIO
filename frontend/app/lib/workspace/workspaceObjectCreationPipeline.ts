/**
 * DS-1:5 — Workspace object creation pipeline.
 * Reads approved candidates via getApprovedCandidates only — workspace objects only.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";
import { resolveWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import { getApprovedCandidates } from "./workspaceObjectApprovalRuntime.ts";
import type { WorkspaceCandidateApprovalState } from "./workspaceObjectApprovalContract.ts";
import {
  NEXORA_OBJECT_CREATION_LOG_PREFIX,
  WORKSPACE_OBJECT_CREATION_SOURCE,
  WORKSPACE_OBJECT_CREATION_TAGS,
  WORKSPACE_OBJECT_CREATION_VERSION,
  buildWorkspaceCreatedObjectId,
  resolveWorkspaceObjectType,
  workspaceCreatedObjectIsComplete,
  type WorkspaceCreatedObject,
  type WorkspaceObjectCreationAction,
  type WorkspaceObjectCreationBatchResult,
  type WorkspaceObjectCreationItemResult,
  type WorkspaceObjectCreationStore,
} from "./workspaceObjectCreationContract.ts";

const STORAGE_KEY = "nexora.workspaceCreatedObjects.v2";

type ObjectCreationListener = () => void;

const objectCreationListeners = new Set<ObjectCreationListener>();

let workspaceCreatedObjects: WorkspaceObjectCreationStore = {};
let objectCreationHydrated = false;
let objectCreationVersion = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function emitNexoraObjectCreationDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    candidateId: string;
    objectId: string;
    objectName: string;
    action: WorkspaceObjectCreationAction;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("objectCreation", `${NEXORA_OBJECT_CREATION_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_OBJECT_CREATION_TAGS,
    phase: "DS-1:5",
  });
}

function notifyObjectCreationListeners(): void {
  objectCreationVersion += 1;
  objectCreationListeners.forEach((listener) => listener());
}

function normalizeStoredObjects(raw: unknown): WorkspaceObjectCreationStore {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<WorkspaceId, Record<string, WorkspaceCreatedObject>> = {};

  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const byObjectId: Record<string, WorkspaceCreatedObject> = {};
      for (const object of value as WorkspaceCreatedObject[]) {
        if (!object?.objectId) continue;
        byObjectId[object.objectId] = object;
      }
      normalized[workspaceId] = Object.freeze(byObjectId);
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({
        ...(value as Record<string, WorkspaceCreatedObject>),
      });
    }
  }

  return Object.freeze(normalized);
}

function readStorage(): WorkspaceObjectCreationStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeStoredObjects(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceCreatedObjects));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateObjectCreationStore(): void {
  if (objectCreationHydrated) return;
  objectCreationHydrated = true;
  workspaceCreatedObjects = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function getWorkspaceObjectMap(workspaceId: WorkspaceId): WorkspaceObjectCreationStore[WorkspaceId] {
  return workspaceCreatedObjects[workspaceId] ?? Object.freeze({});
}

function freezeCreatedObject(object: WorkspaceCreatedObject): WorkspaceCreatedObject {
  return Object.freeze({
    ...object,
    sourceColumns: Object.freeze([...object.sourceColumns]),
  });
}

function commitObjectCreationChange(): void {
  writeStorage();
  notifyObjectCreationListeners();
}

function guardCreationRead(workspaceId: WorkspaceId, dataSourceId?: string | null): boolean {
  const trimmedDataSourceId = dataSourceId?.trim() ?? null;
  if (!trimmedDataSourceId) {
    return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
  }

  const dataSource = resolveWorkspaceDataSource(workspaceId, trimmedDataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId,
      dataSource,
      dataSourceId: trimmedDataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({ action: "read", workspaceId }).allowed;
}

function guardCreationWrite(workspaceId: WorkspaceId, dataSourceId: string): boolean {
  const dataSource = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "import",
      workspaceId,
      dataSource,
      dataSourceId,
    }).allowed;
  }

  return guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
    dataSourceId,
  }).allowed;
}

function buildCreatedObjectFromApproval(
  approval: WorkspaceCandidateApprovalState
): WorkspaceCreatedObject {
  const timestamp = nowIso();
  const objectName = approval.objectName.trim();
  return freezeCreatedObject(
    Object.freeze({
      contractVersion: WORKSPACE_OBJECT_CREATION_VERSION,
      objectId: buildWorkspaceCreatedObjectId(objectName),
      workspaceId: approval.workspaceId,
      dataSourceId: approval.dataSourceId,
      objectName,
      objectType: resolveWorkspaceObjectType(objectName),
      primaryIdentifier: approval.primaryIdentifier,
      sourceColumns: Object.freeze([...approval.sourceColumns]),
      originCandidateId: approval.candidateId,
      createdAt: timestamp,
      updatedAt: timestamp,
      creationSource: WORKSPACE_OBJECT_CREATION_SOURCE,
    })
  );
}

function createObjectFromApprovedCandidate(
  approval: WorkspaceCandidateApprovalState
): WorkspaceObjectCreationItemResult {
  hydrateObjectCreationStore();

  const workspaceId = approval.workspaceId.trim();
  const dataSourceId = approval.dataSourceId.trim();
  if (!workspaceId || !dataSourceId) {
    return Object.freeze({
      success: false,
      object: null,
      action: "skipped",
      reason: "missing_required_fields",
    });
  }

  if (!guardCreationWrite(workspaceId, dataSourceId)) {
    return Object.freeze({
      success: false,
      object: null,
      action: "skipped",
      reason: "access_denied",
    });
  }

  const existingMap = getWorkspaceObjectMap(workspaceId);
  const duplicateByCandidate = Object.values(existingMap).find(
    (object) => object.originCandidateId === approval.candidateId
  );
  if (duplicateByCandidate) {
    emitNexoraObjectCreationDiagnostic("Duplicate candidate skipped", {
      workspaceId,
      dataSourceId,
      candidateId: approval.candidateId,
      objectId: duplicateByCandidate.objectId,
      objectName: duplicateByCandidate.objectName,
      action: "duplicate",
    });
    return Object.freeze({
      success: true,
      object: freezeCreatedObject(duplicateByCandidate),
      action: "duplicate",
      reason: "duplicate_candidate",
    });
  }

  const next = buildCreatedObjectFromApproval(approval);
  const duplicateByObjectId = existingMap[next.objectId] ?? null;
  if (duplicateByObjectId) {
    emitNexoraObjectCreationDiagnostic("Duplicate object skipped", {
      workspaceId,
      dataSourceId,
      candidateId: approval.candidateId,
      objectId: next.objectId,
      objectName: next.objectName,
      action: "duplicate",
    });
    return Object.freeze({
      success: true,
      object: freezeCreatedObject(duplicateByObjectId),
      action: "duplicate",
      reason: "duplicate_object",
    });
  }

  if (!workspaceCreatedObjectIsComplete(next)) {
    return Object.freeze({
      success: false,
      object: null,
      action: "skipped",
      reason: "invalid_created_object",
    });
  }

  workspaceCreatedObjects = Object.freeze({
    ...workspaceCreatedObjects,
    [workspaceId]: Object.freeze({
      ...existingMap,
      [next.objectId]: next,
    }),
  });
  commitObjectCreationChange();

  emitNexoraObjectCreationDiagnostic("Workspace object created", {
    workspaceId,
    dataSourceId,
    candidateId: approval.candidateId,
    objectId: next.objectId,
    objectName: next.objectName,
    action: "created",
  });

  return Object.freeze({
    success: true,
    object: next,
    action: "created",
    reason: "created",
  });
}

export function createWorkspaceObjectsFromApprovedCandidates(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceObjectCreationBatchResult {
  hydrateObjectCreationStore();

  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      dataSourceId: trimmedDataSourceId || null,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      objects: Object.freeze([]),
      reason: "missing_scope",
      message: "Provide a workspace and data source to create objects.",
    });
  }

  if (!guardCreationRead(trimmedWorkspaceId, trimmedDataSourceId)) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      objects: Object.freeze([]),
      reason: "access_denied",
      message: "Unable to create workspace objects for this data source.",
    });
  }

  const approvedCandidates = getApprovedCandidates(trimmedWorkspaceId, trimmedDataSourceId);
  if (approvedCandidates.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      dataSourceId: trimmedDataSourceId,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      objects: Object.freeze([]),
      reason: "no_approved_candidates",
      message: "Approve at least one candidate before creating workspace objects.",
    });
  }

  let createdCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  const objects: WorkspaceCreatedObject[] = [];

  for (const approval of approvedCandidates) {
    const result = createObjectFromApprovedCandidate(approval);
    if (!result.object) {
      skippedCount += 1;
      continue;
    }
    objects.push(result.object);
    if (result.action === "created") createdCount += 1;
    else if (result.action === "duplicate") duplicateCount += 1;
    else skippedCount += 1;
  }

  const success = createdCount > 0 || duplicateCount > 0;
  const message =
    createdCount > 0
      ? `${createdCount} workspace object${createdCount === 1 ? "" : "s"} created${
          duplicateCount > 0 ? `, ${duplicateCount} duplicate${duplicateCount === 1 ? "" : "s"} skipped` : ""
        }.`
      : duplicateCount > 0
        ? `${duplicateCount} duplicate object${duplicateCount === 1 ? "" : "s"} skipped.`
        : "No workspace objects were created from approved candidates.";

  return Object.freeze({
    success,
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    createdCount,
    skippedCount,
    duplicateCount,
    objects: Object.freeze(objects.map(freezeCreatedObject)),
    reason: createdCount > 0 ? "created" : duplicateCount > 0 ? "duplicate" : "skipped",
    message,
  });
}

export function getWorkspaceCreatedObjects(
  workspaceId: WorkspaceId
): readonly WorkspaceCreatedObject[] {
  hydrateObjectCreationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId || !guardCreationRead(trimmedWorkspaceId)) return Object.freeze([]);
  return Object.freeze(Object.values(getWorkspaceObjectMap(trimmedWorkspaceId)).map(freezeCreatedObject));
}

export function getWorkspaceCreatedObject(
  workspaceId: WorkspaceId,
  objectId: string
): WorkspaceCreatedObject | null {
  hydrateObjectCreationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectId = objectId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectId) return null;
  const match = getWorkspaceObjectMap(trimmedWorkspaceId)[trimmedObjectId] ?? null;
  return match ? freezeCreatedObject(match) : null;
}

export function getWorkspaceCreatedObjectByCandidateId(
  workspaceId: WorkspaceId,
  candidateId: string
): WorkspaceCreatedObject | null {
  hydrateObjectCreationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedCandidateId = candidateId.trim();
  if (!trimmedWorkspaceId || !trimmedCandidateId) return null;
  const match =
    Object.values(getWorkspaceObjectMap(trimmedWorkspaceId)).find(
      (object) => object.originCandidateId === trimmedCandidateId
    ) ?? null;
  return match ? freezeCreatedObject(match) : null;
}

export function removeWorkspaceCreatedObjectsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): readonly WorkspaceCreatedObject[] {
  hydrateObjectCreationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return Object.freeze([]);

  const existingMap = getWorkspaceObjectMap(trimmedWorkspaceId);
  const removed = Object.values(existingMap).filter(
    (object) => object.dataSourceId === trimmedDataSourceId
  );
  if (removed.length === 0) return Object.freeze([]);

  const remaining = Object.fromEntries(
    Object.entries(existingMap).filter(([, object]) => object.dataSourceId !== trimmedDataSourceId)
  );

  workspaceCreatedObjects = Object.freeze({
    ...workspaceCreatedObjects,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  });
  commitObjectCreationChange();
  return Object.freeze(removed.map(freezeCreatedObject));
}

export function subscribeWorkspaceObjectCreationRegistry(
  listener: ObjectCreationListener
): () => void {
  hydrateObjectCreationStore();
  objectCreationListeners.add(listener);
  return () => objectCreationListeners.delete(listener);
}

export function getWorkspaceObjectCreationRegistryVersion(): number {
  hydrateObjectCreationStore();
  return objectCreationVersion;
}

export function resetWorkspaceObjectCreationStoreForTests(): void {
  workspaceCreatedObjects = {};
  objectCreationHydrated = false;
  objectCreationVersion = 0;
  objectCreationListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspacePipelineObjects.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function createWorkspaceObjectsFromAllApprovedCandidates(
  workspaceId: WorkspaceId
): WorkspaceObjectCreationBatchResult {
  hydrateObjectCreationStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      dataSourceId: null,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      objects: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace to create approved objects.",
    });
  }

  const approvedCandidates = getApprovedCandidates(trimmedWorkspaceId);
  const dataSourceIds = [
    ...new Set(approvedCandidates.map((candidate) => candidate.dataSourceId.trim()).filter(Boolean)),
  ];

  if (dataSourceIds.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      dataSourceId: null,
      createdCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      objects: Object.freeze([]),
      reason: "no_approved_candidates",
      message: "Approve at least one candidate before creating workspace objects.",
    });
  }

  let createdCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  const objects: WorkspaceCreatedObject[] = [];

  for (const dataSourceId of dataSourceIds) {
    const result = createWorkspaceObjectsFromApprovedCandidates(trimmedWorkspaceId, dataSourceId);
    createdCount += result.createdCount;
    skippedCount += result.skippedCount;
    duplicateCount += result.duplicateCount;
    objects.push(...result.objects);
  }

  const success = createdCount > 0 || duplicateCount > 0;
  const message =
    createdCount > 0
      ? `${createdCount} workspace object${createdCount === 1 ? "" : "s"} created${
          duplicateCount > 0 ? `, ${duplicateCount} duplicate${duplicateCount === 1 ? "" : "s"} skipped` : ""
        }.`
      : duplicateCount > 0
        ? `${duplicateCount} duplicate object${duplicateCount === 1 ? "" : "s"} skipped.`
        : "No workspace objects were created from approved candidates.";

  return Object.freeze({
    success,
    workspaceId: trimmedWorkspaceId,
    dataSourceId: null,
    createdCount,
    skippedCount,
    duplicateCount,
    objects: Object.freeze(objects.map(freezeCreatedObject)),
    reason: createdCount > 0 ? "created" : duplicateCount > 0 ? "duplicate" : "skipped",
    message,
  });
}
