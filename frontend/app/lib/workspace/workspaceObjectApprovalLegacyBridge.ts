/**
 * Legacy DS-1:4 bridge for DS-1:5 object creation pipeline and panel facade.
 */

import type {
  ObjectApprovalMutationResult,
  ObjectApprovalRecord,
  ObjectApprovalStatus,
} from "./objectApprovalContract.ts";
import { OBJECT_APPROVAL_VERSION } from "./objectApprovalContract.ts";
import type { CandidateObjectConfidence } from "./candidateObjectContract.ts";
import type {
  WorkspaceCandidateApprovalMutationResult,
  WorkspaceCandidateApprovalState,
} from "./workspaceObjectApprovalContract.ts";

function mapConfidenceToLegacy(confidence: number): CandidateObjectConfidence {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

function mapStatusToLegacy(status: WorkspaceCandidateApprovalState["status"]): ObjectApprovalStatus {
  if (status === "approved") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
}

export function toLegacyObjectApprovalRecord(
  state: WorkspaceCandidateApprovalState
): ObjectApprovalRecord {
  return Object.freeze({
    contractVersion: OBJECT_APPROVAL_VERSION,
    approvalId: state.candidateId,
    candidateId: state.candidateId,
    workspaceId: state.workspaceId,
    dataSourceId: state.dataSourceId,
    objectName: state.objectName,
    displayName: state.objectName,
    status: mapStatusToLegacy(state.status),
    confidence: mapConfidenceToLegacy(state.confidence),
    sourceColumns: Object.freeze([...state.sourceColumns]),
    reason: state.reason,
    mergedFromCandidateIds: Object.freeze([]),
    manual: false,
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  });
}

export function toLegacyObjectApprovalMutationResult(
  result: WorkspaceCandidateApprovalMutationResult
): ObjectApprovalMutationResult {
  return Object.freeze({
    success: result.success,
    record: result.state ? toLegacyObjectApprovalRecord(result.state) : null,
    reason: result.reason,
  });
}
