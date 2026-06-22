/**
 * DS-1:4 — Workspace object approval contract.
 * Approval workflow only — no workspace objects, scene nodes, or relationships.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_OBJECT_APPROVAL_VERSION = "DS-1:4" as const;

export const WORKSPACE_OBJECT_APPROVAL_TAGS = Object.freeze([
  "[DS14_OBJECT_APPROVAL]",
  "[OBJECT_REVIEW_WORKFLOW]",
  "[APPROVAL_PERSISTENCE_READY]",
  "[DS15_READY]",
  "[DS_1_4_COMPLETE]",
] as const);

export const NEXORA_OBJECT_APPROVAL_LOG_PREFIX = "[NexoraObjectApproval]" as const;

export type WorkspaceCandidateApprovalStatus = "suggested" | "approved" | "rejected";

export type WorkspaceCandidateApprovalAction = "approve" | "reject" | "rename";

export type WorkspaceCandidateApprovalState = Readonly<{
  contractVersion: typeof WORKSPACE_OBJECT_APPROVAL_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  candidateId: string;
  objectName: string;
  originalObjectName: string;
  status: WorkspaceCandidateApprovalStatus;
  confidence: number;
  primaryIdentifier: string | null;
  sourceColumns: readonly string[];
  sourceColumnCount: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspaceCandidateApprovalMap = Readonly<
  Record<string, WorkspaceCandidateApprovalState>
>;

export type WorkspaceDataSourceCandidateApprovalProfile = Readonly<{
  contractVersion: typeof WORKSPACE_OBJECT_APPROVAL_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  approvals: WorkspaceCandidateApprovalMap;
  updatedAt: string;
}>;

export type WorkspaceObjectApprovalStore = Readonly<
  Record<WorkspaceId, Readonly<Record<string, WorkspaceDataSourceCandidateApprovalProfile>>>
>;

export type WorkspaceCandidateApprovalMutationResult = Readonly<{
  success: boolean;
  state: WorkspaceCandidateApprovalState | null;
  reason: string;
}>;

export const WORKSPACE_CANDIDATE_APPROVAL_STATUSES: readonly WorkspaceCandidateApprovalStatus[] =
  Object.freeze(["suggested", "approved", "rejected"]);

export function workspaceCandidateApprovalStateIsComplete(
  state: WorkspaceCandidateApprovalState | null | undefined
): state is WorkspaceCandidateApprovalState {
  if (!state || typeof state !== "object") return false;
  if (state.contractVersion !== WORKSPACE_OBJECT_APPROVAL_VERSION) return false;
  if (typeof state.workspaceId !== "string" || !state.workspaceId.trim()) return false;
  if (typeof state.dataSourceId !== "string" || !state.dataSourceId.trim()) return false;
  if (typeof state.candidateId !== "string" || !state.candidateId.trim()) return false;
  if (typeof state.objectName !== "string" || !state.objectName.trim()) return false;
  if (!WORKSPACE_CANDIDATE_APPROVAL_STATUSES.includes(state.status)) return false;
  if (!Number.isFinite(state.confidence) || state.confidence < 0 || state.confidence > 1) return false;
  if (!Array.isArray(state.sourceColumns)) return false;
  if (state.sourceColumnCount !== state.sourceColumns.length) return false;
  if (typeof state.reason !== "string" || !state.reason.trim()) return false;
  return true;
}
