/**
 * Legacy object approval panel facade — delegates to DS-1:4 workspace modules.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  resetPipelineWorkspaceObjectsForTests,
  createWorkspaceObjectsFromAllApprovedCandidates,
} from "./objectCreationPipeline.ts";
import type { CandidateObjectProposal } from "./candidateObjectContract.ts";
import {
  buildManualCandidateId,
  OBJECT_APPROVAL_CONTRACT,
  OBJECT_APPROVAL_TAGS,
  OBJECT_APPROVAL_VERSION,
  objectApprovalRecordIsComplete,
  type ApprovedWorkspaceObjectRecord,
  type ObjectApprovalBatchMutationResult,
  type ObjectApprovalMutationResult,
  type ObjectApprovalRecord,
  type ObjectApprovalStatus,
} from "./objectApprovalContract.ts";
import {
  approveCandidateObject,
  findCandidateApprovalStateById,
  getApprovedCandidates,
  getCandidateApprovalStates,
  getWorkspaceObjectApprovalRegistryVersion as readWorkspaceObjectApprovalRegistryVersion,
  rejectCandidateObject,
  removeWorkspaceObjectApprovalStatesForDataSource,
  renameCandidateObject,
  resetWorkspaceObjectApprovalStoreForTests,
  subscribeWorkspaceObjectApprovalRegistry as subscribeWorkspaceObjectApprovalRegistryFromStore,
  syncApprovalStatesForWorkspace,
} from "./workspaceObjectApprovalRuntime.ts";
import {
  toLegacyObjectApprovalRecord,
} from "./workspaceObjectApprovalLegacyBridge.ts";
import { listWorkspaceCandidateObjectProfiles } from "./workspaceCandidateObjectDiscoveryEngine.ts";

export {
  OBJECT_APPROVAL_CONTRACT,
  OBJECT_APPROVAL_TAGS,
  OBJECT_APPROVAL_VERSION,
  objectApprovalRecordIsComplete,
};

export {
  approveCandidateObject,
  getApprovedCandidates,
  rejectCandidateObject,
  renameCandidateObject,
};

export const OBJECT_APPROVAL_PANEL_VERSION = "DS-1:4" as const;

export const OBJECT_APPROVAL_PANEL_TAGS = Object.freeze([
  "[DS14_OBJECT_APPROVAL]",
  "[OBJECT_REVIEW_WORKFLOW]",
  "MANAGER_APPROVAL_PANEL",
] as const);

export type ObjectApprovalPanelRow = Readonly<{
  candidateId: string;
  approvalId: string;
  dataSourceId: string;
  objectName: string;
  displayName: string;
  status: ObjectApprovalStatus | "suggested";
  statusLabel: string;
  approved: boolean;
  suggested: boolean;
  confidence: CandidateObjectProposal["confidence"];
  confidenceScore: number;
  primaryIdentifier: string | null;
  sourceColumns: readonly string[];
  sourceColumnCount: number;
  reason: string;
  manual: boolean;
}>;

export type ObjectApprovalPanelSnapshot = Readonly<{
  contractVersion: typeof OBJECT_APPROVAL_PANEL_VERSION;
  workspaceId: WorkspaceId | null;
  rows: readonly ObjectApprovalPanelRow[];
  selectedCandidateId: string | null;
  approvedCount: number;
  suggestedCount: number;
  pendingCount: number;
  rejectedCount: number;
  queuedObjectCount: number;
}>;

export type ObjectApprovalPanelActionResult = Readonly<{
  success: boolean;
  snapshot: ObjectApprovalPanelSnapshot;
  message: string;
  reason: string;
}>;

const QUEUED_STORAGE_KEY = "nexora.workspaceApprovedObjects.v1";

type ObjectApprovalListener = () => void;

const objectApprovalListeners = new Set<ObjectApprovalListener>();

let workspaceApprovedObjects: Record<WorkspaceId, readonly ApprovedWorkspaceObjectRecord[]> = {};
let queuedHydrated = false;
let panelRegistryVersion = 0;

const panelSelectionByWorkspace: Record<WorkspaceId, string | null> = {};
const manualApprovalRecords: Record<WorkspaceId, readonly ObjectApprovalRecord[]> = {};

const STATUS_LABELS: Readonly<Record<ObjectApprovalStatus | "suggested", string>> = Object.freeze({
  suggested: "Suggested",
  pending: "Suggested",
  approved: "Approved",
  rejected: "Rejected",
});

function nowIso(): string {
  return new Date().toISOString();
}

function notifyPanelListeners(): void {
  panelRegistryVersion += 1;
  objectApprovalListeners.forEach((listener) => listener());
}

function readQueuedStorage(): Record<WorkspaceId, readonly ApprovedWorkspaceObjectRecord[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(QUEUED_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, readonly ApprovedWorkspaceObjectRecord[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeQueuedStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUEUED_STORAGE_KEY, JSON.stringify(workspaceApprovedObjects));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateQueuedStore(): void {
  if (queuedHydrated) return;
  queuedHydrated = true;
  workspaceApprovedObjects = readQueuedStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function toPanelRow(record: ObjectApprovalRecord): ObjectApprovalPanelRow {
  const suggested = record.status === "pending";
  const state = findCandidateApprovalStateById(record.workspaceId, record.candidateId);
  return Object.freeze({
    candidateId: record.candidateId,
    approvalId: record.approvalId,
    dataSourceId: record.dataSourceId,
    objectName: record.objectName,
    displayName: record.displayName,
    status: suggested ? "suggested" : record.status,
    statusLabel: STATUS_LABELS[suggested ? "suggested" : record.status],
    approved: record.status === "approved",
    suggested,
    confidence: record.confidence,
    confidenceScore: state?.confidence ?? (record.confidence === "high" ? 0.9 : record.confidence === "medium" ? 0.7 : 0.4),
    primaryIdentifier: state?.primaryIdentifier ?? record.sourceColumns.find((column) => column.endsWith("_id")) ?? null,
    sourceColumns: record.sourceColumns,
    sourceColumnCount: state?.sourceColumnCount ?? record.sourceColumns.length,
    reason: record.reason,
    manual: record.manual,
  });
}

function listLegacyApprovalRecords(workspaceId: WorkspaceId): readonly ObjectApprovalRecord[] {
  syncApprovalStatesForWorkspace(workspaceId);
  const records: ObjectApprovalRecord[] = [];

  for (const profile of listWorkspaceCandidateObjectProfiles(workspaceId)) {
    for (const state of getCandidateApprovalStates(workspaceId, profile.dataSourceId)) {
      records.push(toLegacyObjectApprovalRecord(state));
    }
  }

  return Object.freeze([...records, ...(manualApprovalRecords[workspaceId] ?? [])]);
}

export function syncObjectApprovalRecordsFromCandidates(
  workspaceId?: WorkspaceId | null
): readonly ObjectApprovalRecord[] {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return listLegacyApprovalRecords(resolvedWorkspaceId);
}

export function subscribeObjectApprovalRegistry(listener: ObjectApprovalListener): () => void {
  const unsubscribeWorkspace = subscribeWorkspaceObjectApprovalRegistryFromStore(listener);
  objectApprovalListeners.add(listener);
  return () => {
    unsubscribeWorkspace();
    objectApprovalListeners.delete(listener);
  };
}

export function getObjectApprovalRegistryVersion(): number {
  return Math.max(readWorkspaceObjectApprovalRegistryVersion(), panelRegistryVersion);
}

export function listWorkspaceObjectApprovalRecords(
  workspaceId?: WorkspaceId | null
): readonly ObjectApprovalRecord[] {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return listLegacyApprovalRecords(resolvedWorkspaceId);
}

export function getWorkspaceObjectApprovalRecord(
  workspaceId: WorkspaceId,
  candidateId: string
): ObjectApprovalRecord | null {
  return (
    listWorkspaceObjectApprovalRecords(workspaceId).find(
      (record) => record.candidateId === candidateId.trim()
    ) ?? null
  );
}

export function listQueuedApprovedWorkspaceObjects(
  workspaceId?: WorkspaceId | null
): readonly ApprovedWorkspaceObjectRecord[] {
  hydrateQueuedStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return Object.freeze(workspaceApprovedObjects[resolvedWorkspaceId] ?? []);
}

function buildSnapshot(workspaceId?: WorkspaceId | null): ObjectApprovalPanelSnapshot {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      contractVersion: OBJECT_APPROVAL_PANEL_VERSION,
      workspaceId: null,
      rows: Object.freeze([]),
      selectedCandidateId: null,
      approvedCount: 0,
      suggestedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      queuedObjectCount: 0,
    });
  }

  const allRecords = listWorkspaceObjectApprovalRecords(resolvedWorkspaceId);
  const rows = allRecords
    .filter((record) => record.status !== "rejected")
    .map(toPanelRow);
  const selectedCandidateId =
    panelSelectionByWorkspace[resolvedWorkspaceId] &&
    rows.some((row) => row.candidateId === panelSelectionByWorkspace[resolvedWorkspaceId])
      ? panelSelectionByWorkspace[resolvedWorkspaceId]
      : rows[0]?.candidateId ?? null;

  panelSelectionByWorkspace[resolvedWorkspaceId] = selectedCandidateId;

  const suggestedCount = rows.filter((row) => row.suggested).length;
  return Object.freeze({
    contractVersion: OBJECT_APPROVAL_PANEL_VERSION,
    workspaceId: resolvedWorkspaceId,
    rows,
    selectedCandidateId,
    approvedCount: rows.filter((row) => row.approved).length,
    suggestedCount,
    pendingCount: suggestedCount,
    rejectedCount: allRecords.filter((record) => record.status === "rejected").length,
    queuedObjectCount: listQueuedApprovedWorkspaceObjects(resolvedWorkspaceId).length,
  });
}

function actionResult(
  success: boolean,
  workspaceId: WorkspaceId | null,
  message: string,
  reason: string
): ObjectApprovalPanelActionResult {
  if (success) notifyPanelListeners();
  return Object.freeze({
    success,
    snapshot: buildSnapshot(workspaceId),
    message,
    reason,
  });
}

export function buildObjectApprovalPanelSnapshot(
  workspaceId?: WorkspaceId | null
): ObjectApprovalPanelSnapshot {
  return buildSnapshot(workspaceId);
}

export function selectObjectApprovalPanelCandidate(
  workspaceId: WorkspaceId,
  candidateId: string
): ObjectApprovalPanelActionResult {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return actionResult(false, null, "Select a workspace to review discovered objects.", "missing_workspace");
  }
  const record = getWorkspaceObjectApprovalRecord(resolvedWorkspaceId, candidateId);
  if (!record || record.status === "rejected") {
    return actionResult(false, resolvedWorkspaceId, "That discovered object is not available.", "not_found");
  }
  panelSelectionByWorkspace[resolvedWorkspaceId] = record.candidateId;
  return actionResult(true, resolvedWorkspaceId, `${record.displayName} selected.`, "selected");
}

function resolveTargetCandidate(
  workspaceId: WorkspaceId,
  candidateId?: string | null
): { workspaceId: WorkspaceId; dataSourceId: string; candidateId: string } | null {
  const snapshot = buildSnapshot(workspaceId);
  const resolvedWorkspaceId = snapshot.workspaceId;
  if (!resolvedWorkspaceId) return null;
  const targetId = (candidateId ?? snapshot.selectedCandidateId)?.trim();
  if (!targetId) return null;
  const state = findCandidateApprovalStateById(resolvedWorkspaceId, targetId);
  if (!state) return null;
  return Object.freeze({
    workspaceId: resolvedWorkspaceId,
    dataSourceId: state.dataSourceId,
    candidateId: targetId,
  });
}

export function approveObjectApprovalCandidate(
  workspaceId: WorkspaceId,
  candidateId?: string | null
): ObjectApprovalPanelActionResult {
  const target = resolveTargetCandidate(workspaceId, candidateId);
  if (!target) {
    return actionResult(
      false,
      resolveWorkspaceId(workspaceId),
      "Select a discovered object to approve.",
      "missing_selection"
    );
  }

  const result = approveCandidateObject(
    target.workspaceId,
    target.dataSourceId,
    target.candidateId
  );
  if (!result.success || !result.state) {
    return actionResult(false, target.workspaceId, "Unable to approve the selected object.", result.reason);
  }

  panelSelectionByWorkspace[target.workspaceId] = result.state.candidateId;
  return actionResult(
    true,
    target.workspaceId,
    `${result.state.objectName} approved.`,
    "approved"
  );
}

export function rejectObjectApprovalCandidate(
  workspaceId: WorkspaceId,
  candidateId?: string | null
): ObjectApprovalPanelActionResult {
  const target = resolveTargetCandidate(workspaceId, candidateId);
  if (!target) {
    return actionResult(
      false,
      resolveWorkspaceId(workspaceId),
      "Select a discovered object to reject.",
      "missing_selection"
    );
  }

  const result = rejectCandidateObject(
    target.workspaceId,
    target.dataSourceId,
    target.candidateId
  );
  if (!result.success || !result.state) {
    return actionResult(false, target.workspaceId, "Unable to reject the selected object.", result.reason);
  }

  return actionResult(
    true,
    target.workspaceId,
    `${result.state.objectName} rejected.`,
    "rejected"
  );
}

export function renameObjectApprovalCandidate(
  workspaceId: WorkspaceId,
  newName: string,
  candidateId?: string | null
): ObjectApprovalPanelActionResult {
  const target = resolveTargetCandidate(workspaceId, candidateId);
  if (!target) {
    return actionResult(
      false,
      resolveWorkspaceId(workspaceId),
      "Select a discovered object to rename.",
      "missing_selection"
    );
  }

  const result = renameCandidateObject(
    target.workspaceId,
    target.dataSourceId,
    target.candidateId,
    newName
  );
  if (!result.success || !result.state) {
    return actionResult(false, target.workspaceId, "Unable to rename the selected object.", result.reason);
  }

  return actionResult(
    true,
    target.workspaceId,
    `Renamed to ${result.state.objectName}.`,
    "renamed"
  );
}

export function mergeObjectApprovalCandidates(
  workspaceId: WorkspaceId,
  candidateIds: readonly string[]
): ObjectApprovalPanelActionResult {
  return actionResult(
    false,
    resolveWorkspaceId(workspaceId),
    "Merge is reserved for a future release.",
    "merge_not_available"
  );
}

export function addManualObjectApprovalCandidate(
  workspaceId: WorkspaceId,
  objectName: string,
  dataSourceId?: string | null
): ObjectApprovalPanelActionResult {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  const trimmedName = objectName.trim();
  if (!resolvedWorkspaceId) {
    return actionResult(false, null, "Select a workspace to review discovered objects.", "missing_workspace");
  }
  if (!trimmedName) {
    return actionResult(false, resolvedWorkspaceId, "Enter a valid object name.", "missing_name");
  }

  const candidateId = buildManualCandidateId(resolvedWorkspaceId, trimmedName);
  const timestamp = nowIso();
  const record = Object.freeze({
    contractVersion: OBJECT_APPROVAL_VERSION,
    approvalId: candidateId,
    candidateId,
    workspaceId: resolvedWorkspaceId,
    dataSourceId: dataSourceId?.trim() || "manual",
    objectName: trimmedName,
    displayName: trimmedName,
    status: "pending" as const,
    confidence: "low" as const,
    sourceColumns: Object.freeze([] as readonly string[]),
    reason: `Manually added object proposal ${trimmedName}.`,
    mergedFromCandidateIds: Object.freeze([] as readonly string[]),
    manual: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  manualApprovalRecords[resolvedWorkspaceId] = Object.freeze([
    ...(manualApprovalRecords[resolvedWorkspaceId] ?? []),
    record,
  ]);
  panelSelectionByWorkspace[resolvedWorkspaceId] = candidateId;
  return actionResult(
    true,
    resolvedWorkspaceId,
    `${trimmedName} added for manager review.`,
    "manual_added"
  );
}

export function createSelectedApprovedObjects(
  workspaceId: WorkspaceId
): ObjectApprovalBatchMutationResult {
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) {
    return Object.freeze({
      success: false,
      records: Object.freeze([]),
      queuedObjects: Object.freeze([]),
      reason: "missing_workspace",
      message: "Select a workspace to create approved objects.",
    });
  }

  const approvedRecords = listWorkspaceObjectApprovalRecords(resolvedWorkspaceId).filter(
    (record) => record.status === "approved"
  );
  if (approvedRecords.length === 0) {
    return Object.freeze({
      success: false,
      records: Object.freeze([]),
      queuedObjects: Object.freeze([]),
      reason: "no_approved_objects",
      message: "Approve at least one discovered object before creating.",
    });
  }

  const pipeline = createWorkspaceObjectsFromAllApprovedCandidates(resolvedWorkspaceId);
  notifyPanelListeners();

  return Object.freeze({
    success: pipeline.success,
    records: Object.freeze(approvedRecords),
    queuedObjects: Object.freeze([]),
    reason: pipeline.reason,
    message: pipeline.message,
  });
}

export function removeWorkspaceObjectApprovalRecordsForDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): void {
  removeWorkspaceObjectApprovalStatesForDataSource(workspaceId, dataSourceId);
  const trimmedWorkspaceId = workspaceId.trim();
  manualApprovalRecords[trimmedWorkspaceId] = Object.freeze(
    (manualApprovalRecords[trimmedWorkspaceId] ?? []).filter(
      (record) => record.dataSourceId !== dataSourceId.trim() || record.manual
    )
  );
  notifyPanelListeners();
}

export function resetObjectApprovalPanelForTests(): void {
  resetWorkspaceObjectApprovalStoreForTests();
  resetPipelineWorkspaceObjectsForTests();
  workspaceApprovedObjects = {};
  queuedHydrated = false;
  panelRegistryVersion = 0;
  objectApprovalListeners.clear();
  for (const key of Object.keys(panelSelectionByWorkspace)) {
    delete panelSelectionByWorkspace[key];
  }
  for (const key of Object.keys(manualApprovalRecords)) {
    delete manualApprovalRecords[key];
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(QUEUED_STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export type {
  ApprovedWorkspaceObjectRecord,
  ObjectApprovalBatchMutationResult,
  ObjectApprovalMutationResult,
  ObjectApprovalRecord,
  ObjectApprovalStatus,
};
