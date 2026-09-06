import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  createWorkspaceRisk,
  deleteWorkspaceRisk,
  getWorkspaceRisk,
  getWorkspaceRisks,
  updateWorkspaceRisk,
  type WorkspaceRisk,
  type WorkspaceRiskCategory,
} from "./workspaceRiskContract.ts";

export const CANONICAL_RISK_WRITER_IDENTITY = "DS-6:1/CanonicalRiskWriter" as const;

export type CanonicalRiskConfirmation = Readonly<{
  confirmed: true;
  source: "MANAGER_CONVERSATION";
  proposalId: string;
  turnId: string;
}>;

export type CanonicalRiskProvenance = Readonly<{
  createdBy: "MANAGER";
  creationSource: "MANAGER_CONVERSATION";
  proposalId: string;
  confirmationTurn: string;
  evidenceRefs: readonly string[];
}>;

export type CanonicalRiskWriteRequest = Readonly<{
  operation: "CREATE" | "UPDATE" | "REMOVE" | "RELATE";
  workspaceId: WorkspaceId;
  riskId?: string | null;
  name?: string | null;
  category?: WorkspaceRiskCategory;
  description?: string | null;
  relatedRiskId?: string | null;
  confirmation: CanonicalRiskConfirmation | null;
  provenance?: CanonicalRiskProvenance | null;
  dependencies?: readonly string[];
}>;

export type CanonicalRiskWriteResult = Readonly<{
  status: "CREATED" | "UPDATED" | "REMOVED" | "ALREADY_EXISTS" | "REJECTED";
  riskId: string | null;
  risk: WorkspaceRisk | null;
  reason: string;
}>;

function rejected(reason: string): CanonicalRiskWriteResult {
  return Object.freeze({ status: "REJECTED", riskId: null, risk: null, reason });
}

function normalized(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function confirmationValid(
  request: CanonicalRiskWriteRequest,
): request is CanonicalRiskWriteRequest & { confirmation: CanonicalRiskConfirmation } {
  return (
    request.confirmation?.confirmed === true &&
    request.confirmation.source === "MANAGER_CONVERSATION" &&
    request.confirmation.proposalId.trim().length > 0 &&
    request.confirmation.turnId.trim().length > 0 &&
    request.provenance?.proposalId === request.confirmation.proposalId
  );
}

function existingByName(workspaceId: WorkspaceId, name: string): WorkspaceRisk | null {
  const target = normalized(name);
  return getWorkspaceRisks(workspaceId).find((risk) => normalized(risk.title) === target) ?? null;
}

export function writeCanonicalRisk(
  request: CanonicalRiskWriteRequest,
): CanonicalRiskWriteResult {
  if (!confirmationValid(request)) return rejected("explicit_manager_confirmation_required");
  if (!request.workspaceId.trim()) return rejected("missing_workspace");

  if (request.operation === "RELATE") {
    return rejected("risk_relationship_writer_not_available");
  }

  if (request.operation === "CREATE") {
    const name = request.name?.trim() ?? "";
    if (!name) return rejected("missing_risk_name");
    const duplicate = existingByName(request.workspaceId, name);
    if (duplicate) {
      return Object.freeze({
        status: "ALREADY_EXISTS",
        riskId: duplicate.riskId,
        risk: duplicate,
        reason: "canonical_identity_match",
      });
    }
    const created = createWorkspaceRisk({
      workspaceId: request.workspaceId,
      title: name,
      description: request.description ?? "",
      category: request.category ?? "custom",
      ...(request.provenance ? { provenance: request.provenance } : {}),
    });
    return created.success && created.risk
      ? Object.freeze({ status: "CREATED", riskId: created.risk.riskId, risk: created.risk, reason: "created" })
      : rejected(created.reason);
  }

  const riskId = request.riskId?.trim() ?? "";
  const existing = riskId ? getWorkspaceRisk(request.workspaceId, riskId) : null;
  if (!existing) return rejected("risk_not_found");

  if (request.operation === "UPDATE") {
    const updated = updateWorkspaceRisk({
      workspaceId: request.workspaceId,
      riskId,
      title: request.name ?? undefined,
      description: request.description ?? undefined,
      category: request.category,
    });
    return updated.success && updated.risk
      ? Object.freeze({ status: "UPDATED", riskId: updated.risk.riskId, risk: updated.risk, reason: "updated" })
      : rejected(updated.reason);
  }

  if ((request.dependencies ?? []).length > 0) return rejected("dependencies_require_review");
  const removed = deleteWorkspaceRisk(request.workspaceId, riskId);
  return removed.success
    ? Object.freeze({ status: "REMOVED", riskId, risk: null, reason: "removed" })
    : rejected(removed.reason);
}