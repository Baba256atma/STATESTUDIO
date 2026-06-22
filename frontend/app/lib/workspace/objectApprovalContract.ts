import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { CandidateObjectConfidence } from "./candidateObjectContract.ts";

export const OBJECT_APPROVAL_VERSION = "DS-1:4" as const;

export { WORKSPACE_OBJECT_APPROVAL_TAGS as OBJECT_APPROVAL_TAGS } from "./workspaceObjectApprovalContract.ts";

export type ObjectApprovalStatus = "pending" | "approved" | "rejected";

export type ObjectApprovalRecord = Readonly<{
  contractVersion: typeof OBJECT_APPROVAL_VERSION;
  approvalId: string;
  candidateId: string;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  objectName: string;
  displayName: string;
  status: ObjectApprovalStatus;
  confidence: CandidateObjectConfidence;
  sourceColumns: readonly string[];
  reason: string;
  mergedFromCandidateIds: readonly string[];
  manual: boolean;
  createdAt: string;
  updatedAt: string;
}>;

export type ApprovedWorkspaceObjectRecord = Readonly<{
  contractVersion: typeof OBJECT_APPROVAL_VERSION;
  approvedObjectId: string;
  workspaceId: WorkspaceId;
  candidateId: string;
  objectName: string;
  sourceColumns: readonly string[];
  approvedAt: string;
  queuedAt: string;
}>;

export type ObjectApprovalContract = Readonly<{
  contractVersion: typeof OBJECT_APPROVAL_VERSION;
  requiredManagerApproval: true;
  supportedActions: readonly ["approve", "reject", "rename", "merge", "manual_add", "create_selected"];
}>;

export const OBJECT_APPROVAL_CONTRACT: ObjectApprovalContract = Object.freeze({
  contractVersion: OBJECT_APPROVAL_VERSION,
  requiredManagerApproval: true,
  supportedActions: Object.freeze([
    "approve",
    "reject",
    "rename",
    "merge",
    "manual_add",
    "create_selected",
  ] as const),
});

export type ObjectApprovalMutationResult = Readonly<{
  success: boolean;
  record: ObjectApprovalRecord | null;
  reason: string;
}>;

export type ObjectApprovalBatchMutationResult = Readonly<{
  success: boolean;
  records: readonly ObjectApprovalRecord[];
  queuedObjects: readonly ApprovedWorkspaceObjectRecord[];
  reason: string;
  message: string;
}>;

export function objectApprovalRecordIsComplete(
  record: ObjectApprovalRecord | null | undefined
): record is ObjectApprovalRecord {
  if (!record || typeof record !== "object") return false;
  return (
    record.contractVersion === OBJECT_APPROVAL_VERSION &&
    typeof record.approvalId === "string" &&
    record.approvalId.trim().length > 0 &&
    typeof record.candidateId === "string" &&
    typeof record.workspaceId === "string" &&
    typeof record.objectName === "string" &&
    typeof record.displayName === "string" &&
    (record.status === "pending" || record.status === "approved" || record.status === "rejected") &&
    Array.isArray(record.sourceColumns) &&
    typeof record.reason === "string"
  );
}

export function buildManualCandidateId(workspaceId: WorkspaceId, objectName: string): string {
  const slug =
    objectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) || "object";
  return `cand_manual_${workspaceId}_${slug}_${Date.now()}`;
}

export function buildApprovedWorkspaceObjectId(input: {
  workspaceId: WorkspaceId;
  candidateId: string;
}): string {
  return `appr_${input.workspaceId}_${input.candidateId}`;
}
