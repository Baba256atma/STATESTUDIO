/**
 * DS-2:3 — Workspace relationship approval contract.
 * Approval only — no relationship creation, scene mutation, topology mutation, or rendering sync.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getRelationshipClassifications,
  type WorkspaceRelationshipCategory,
  type WorkspaceRelationshipClassification,
  type WorkspaceRelationshipStrength,
} from "./workspaceRelationshipClassificationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_RELATIONSHIP_APPROVAL_VERSION = "DS-2:3" as const;

export const WORKSPACE_RELATIONSHIP_APPROVAL_TAGS = Object.freeze([
  "[DS23_RELATIONSHIP_APPROVAL]",
  "[RELATIONSHIP_REVIEW_WORKFLOW]",
  "[RELATIONSHIP_APPROVAL_PERSISTED]",
  "[DS24_READY]",
  "[DS_2_3_COMPLETE]",
] as const);

export const NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX =
  "[NexoraRelationshipApproval]" as const;

export type WorkspaceRelationshipApprovalStatus = "suggested" | "approved" | "rejected";

export type WorkspaceRelationshipApprovalRecord = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_APPROVAL_VERSION;
  candidateRelationshipId: string;
  workspaceId: WorkspaceId;
  relationshipType: string;
  relationshipCategory: WorkspaceRelationshipCategory;
  relationshipStrength: WorkspaceRelationshipStrength;
  confidence: number;
  approvalStatus: WorkspaceRelationshipApprovalStatus;
  approvalReason: string;
  approvedAt: string | null;
  updatedAt: string;
}>;

export type WorkspaceRelationshipApprovalMap = Readonly<
  Record<string, WorkspaceRelationshipApprovalRecord>
>;

export type WorkspaceRelationshipApprovalStore = Readonly<
  Record<WorkspaceId, WorkspaceRelationshipApprovalMap>
>;

export type WorkspaceRelationshipApprovalState = Readonly<{
  contractVersion: typeof WORKSPACE_RELATIONSHIP_APPROVAL_VERSION;
  workspaceId: WorkspaceId | null;
  approvals: readonly WorkspaceRelationshipApprovalRecord[];
  suggestedCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
}>;

export type WorkspaceRelationshipApprovalActionResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  approval: WorkspaceRelationshipApprovalRecord | null;
  state: WorkspaceRelationshipApprovalState;
  reason: string;
  message: string;
}>;

export type WorkspaceRelationshipApprovalFilter = Readonly<{
  status?: WorkspaceRelationshipApprovalStatus | "all";
  category?: WorkspaceRelationshipCategory | "all";
  strength?: WorkspaceRelationshipStrength | "all";
}>;

const STORAGE_KEY = "nexora.workspaceRelationshipApprovals.v1";

let relationshipApprovalStore: WorkspaceRelationshipApprovalStore = {};
let relationshipApprovalHydrated = false;
let relationshipApprovalVersion = 0;

type RelationshipApprovalListener = () => void;

const relationshipApprovalListeners = new Set<RelationshipApprovalListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeRelationshipType(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 64) || "unknown"
  );
}

function freezeApproval(
  approval: WorkspaceRelationshipApprovalRecord
): WorkspaceRelationshipApprovalRecord {
  return Object.freeze({ ...approval });
}

function readStorage(): WorkspaceRelationshipApprovalStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRelationshipApprovalStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(relationshipApprovalStore));
  } catch {
    // Approval state remains available in-memory if storage is unavailable.
  }
}

function hydrateRelationshipApprovalStore(): void {
  if (relationshipApprovalHydrated) return;
  relationshipApprovalHydrated = true;
  relationshipApprovalStore = readStorage();
}

function notifyRelationshipApprovalListeners(): void {
  relationshipApprovalVersion += 1;
  relationshipApprovalListeners.forEach((listener) => listener());
}

function commitRelationshipApprovalChange(): void {
  writeStorage();
  notifyRelationshipApprovalListeners();
}

function emitRelationshipApprovalDiagnostic(input: {
  workspaceId: WorkspaceId;
  candidateRelationshipId: string;
  action: "approved" | "rejected" | "renamed" | "synced";
  relationshipType: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("relationshipApproval", NEXORA_RELATIONSHIP_APPROVAL_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    candidateRelationshipId: input.candidateRelationshipId,
    action: input.action,
    approved: input.action === "approved",
    rejected: input.action === "rejected",
    renamed: input.action === "renamed",
    relationshipType: input.relationshipType,
    tags: WORKSPACE_RELATIONSHIP_APPROVAL_TAGS,
    phase: "DS-2:3",
  });
}

function approvalFromClassification(
  classification: WorkspaceRelationshipClassification,
  current?: WorkspaceRelationshipApprovalRecord
): WorkspaceRelationshipApprovalRecord {
  const updatedAt = current?.updatedAt ?? classification.classifiedAt;
  return Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_APPROVAL_VERSION,
    candidateRelationshipId: classification.candidateRelationshipId,
    workspaceId: classification.workspaceId,
    relationshipType: current?.relationshipType ?? classification.relationshipType,
    relationshipCategory: classification.relationshipCategory,
    relationshipStrength: classification.relationshipStrength,
    confidence: classification.confidence,
    approvalStatus: current?.approvalStatus ?? "suggested",
    approvalReason: current?.approvalReason ?? classification.classificationReason,
    approvedAt: current?.approvedAt ?? null,
    updatedAt,
  });
}

function syncApprovalsFromClassifications(workspaceId: WorkspaceId): WorkspaceRelationshipApprovalMap {
  hydrateRelationshipApprovalStore();
  const currentMap = relationshipApprovalStore[workspaceId] ?? Object.freeze({});
  const classifications = getRelationshipClassifications(workspaceId);
  const nextMap = Object.freeze(
    Object.fromEntries(
      classifications.map((classification) => [
        classification.candidateRelationshipId,
        approvalFromClassification(
          classification,
          currentMap[classification.candidateRelationshipId]
        ),
      ])
    )
  );

  relationshipApprovalStore = Object.freeze({
    ...relationshipApprovalStore,
    [workspaceId]: nextMap,
  });
  writeStorage();
  return nextMap;
}

function buildState(workspaceId?: WorkspaceId | null): WorkspaceRelationshipApprovalState {
  hydrateRelationshipApprovalStore();
  const trimmedWorkspaceId = workspaceId?.trim() ?? "";
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      contractVersion: WORKSPACE_RELATIONSHIP_APPROVAL_VERSION,
      workspaceId: null,
      approvals: Object.freeze([]),
      suggestedCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      totalCount: 0,
    });
  }

  const approvals = Object.freeze(
    Object.values(syncApprovalsFromClassifications(trimmedWorkspaceId)).map(freezeApproval)
  );
  return Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_APPROVAL_VERSION,
    workspaceId: trimmedWorkspaceId,
    approvals,
    suggestedCount: approvals.filter((approval) => approval.approvalStatus === "suggested").length,
    approvedCount: approvals.filter((approval) => approval.approvalStatus === "approved").length,
    rejectedCount: approvals.filter((approval) => approval.approvalStatus === "rejected").length,
    totalCount: approvals.length,
  });
}

function actionResult(input: {
  success: boolean;
  workspaceId: WorkspaceId | null;
  approval: WorkspaceRelationshipApprovalRecord | null;
  reason: string;
  message: string;
}): WorkspaceRelationshipApprovalActionResult {
  return Object.freeze({
    success: input.success,
    workspaceId: input.workspaceId,
    approval: input.approval ? freezeApproval(input.approval) : null,
    state: buildState(input.workspaceId),
    reason: input.reason,
    message: input.message,
  });
}

function updateApproval(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string,
  update: (
    approval: WorkspaceRelationshipApprovalRecord,
    timestamp: string
  ) => WorkspaceRelationshipApprovalRecord,
  action: "approved" | "rejected" | "renamed"
): WorkspaceRelationshipApprovalActionResult {
  hydrateRelationshipApprovalStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedCandidateRelationshipId = candidateRelationshipId.trim();
  if (!trimmedWorkspaceId || !trimmedCandidateRelationshipId) {
    return actionResult({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      approval: null,
      reason: "missing_identifier",
      message: "Select a relationship candidate before reviewing it.",
    });
  }

  const map = syncApprovalsFromClassifications(trimmedWorkspaceId);
  const current = map[trimmedCandidateRelationshipId] ?? null;
  if (!current) {
    return actionResult({
      success: false,
      workspaceId: trimmedWorkspaceId,
      approval: null,
      reason: "not_found",
      message: "That relationship candidate is not available for approval.",
    });
  }

  const next = freezeApproval(update(current, nowIso()));
  relationshipApprovalStore = Object.freeze({
    ...relationshipApprovalStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...map,
      [trimmedCandidateRelationshipId]: next,
    }),
  });
  commitRelationshipApprovalChange();
  emitRelationshipApprovalDiagnostic({
    workspaceId: trimmedWorkspaceId,
    candidateRelationshipId: trimmedCandidateRelationshipId,
    action,
    relationshipType: next.relationshipType,
  });

  return actionResult({
    success: true,
    workspaceId: trimmedWorkspaceId,
    approval: next,
    reason: action,
    message:
      action === "approved"
        ? "Relationship candidate approved."
        : action === "rejected"
          ? "Relationship candidate rejected."
          : "Relationship type renamed.",
  });
}

export function approveRelationshipCandidate(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string
): WorkspaceRelationshipApprovalActionResult {
  return updateApproval(
    workspaceId,
    candidateRelationshipId,
    (approval, timestamp) =>
      Object.freeze({
        ...approval,
        approvalStatus: "approved",
        approvalReason: "Manager approved relationship candidate.",
        approvedAt: timestamp,
        updatedAt: timestamp,
      }),
    "approved"
  );
}

export function rejectRelationshipCandidate(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string
): WorkspaceRelationshipApprovalActionResult {
  return updateApproval(
    workspaceId,
    candidateRelationshipId,
    (approval, timestamp) =>
      Object.freeze({
        ...approval,
        approvalStatus: "rejected",
        approvalReason: "Manager rejected relationship candidate.",
        approvedAt: null,
        updatedAt: timestamp,
      }),
    "rejected"
  );
}

export function renameRelationshipType(
  workspaceId: WorkspaceId,
  candidateRelationshipId: string,
  relationshipType: string
): WorkspaceRelationshipApprovalActionResult {
  const normalizedRelationshipType = normalizeRelationshipType(relationshipType);
  if (!normalizedRelationshipType) {
    return actionResult({
      success: false,
      workspaceId: workspaceId.trim() || null,
      approval: null,
      reason: "invalid_relationship_type",
      message: "Provide a relationship type before renaming.",
    });
  }

  return updateApproval(
    workspaceId,
    candidateRelationshipId,
    (approval, timestamp) =>
      Object.freeze({
        ...approval,
        relationshipType: normalizedRelationshipType,
        approvalReason: `Manager renamed relationship type to ${normalizedRelationshipType}.`,
        updatedAt: timestamp,
      }),
    "renamed"
  );
}

export function getApprovedRelationships(
  workspaceId: WorkspaceId
): readonly WorkspaceRelationshipApprovalRecord[] {
  return Object.freeze(
    getRelationshipApprovalState(workspaceId).approvals.filter(
      (approval) => approval.approvalStatus === "approved"
    )
  );
}

export function getRelationshipApprovalState(
  workspaceId?: WorkspaceId | null
): WorkspaceRelationshipApprovalState {
  return buildState(workspaceId);
}

export function filterRelationshipApprovals(
  approvals: readonly WorkspaceRelationshipApprovalRecord[],
  filter: WorkspaceRelationshipApprovalFilter
): readonly WorkspaceRelationshipApprovalRecord[] {
  return Object.freeze(
    approvals.filter((approval) => {
      const status = filter.status ?? "all";
      const category = filter.category ?? "all";
      const strength = filter.strength ?? "all";
      return (
        (status === "all" || approval.approvalStatus === status) &&
        (category === "all" || approval.relationshipCategory === category) &&
        (strength === "all" || approval.relationshipStrength === strength)
      );
    })
  );
}

export function subscribeWorkspaceRelationshipApprovalRegistry(
  listener: RelationshipApprovalListener
): () => void {
  hydrateRelationshipApprovalStore();
  relationshipApprovalListeners.add(listener);
  return () => relationshipApprovalListeners.delete(listener);
}

export function getWorkspaceRelationshipApprovalRegistryVersion(): number {
  hydrateRelationshipApprovalStore();
  return relationshipApprovalVersion;
}

export function resetWorkspaceRelationshipApprovalStoreForTests(): void {
  relationshipApprovalStore = {};
  relationshipApprovalHydrated = false;
  relationshipApprovalVersion = 0;
  relationshipApprovalListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
