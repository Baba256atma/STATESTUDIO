/**
 * MRP:5B:4 — Derive read-only stakeholder & approval intelligence from governance state.
 */

import {
  GOVERNANCE_APPROVAL_LAYER_QUESTIONS,
  GOVERNANCE_APPROVAL_LAYER_TAG,
  type ApprovalChainIntelligenceSurface,
  type AuthorityReviewIntelligenceSurface,
  type GovernanceApprovalLayerIntelligenceSurface,
  type GovernanceApprovalLayerRowView,
  type GovernanceApprovalLayerStatus,
  type StakeholderImpactIntelligenceSurface,
} from "./governanceApprovalLayerIntelligenceContract.ts";
import type { GovernanceWorkspaceState } from "./governanceWorkspaceState.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function worstStatus(
  statuses: readonly GovernanceApprovalLayerStatus[]
): GovernanceApprovalLayerStatus {
  if (statuses.some((status) => status === "Rejected")) return "Rejected";
  if (statuses.some((status) => status === "Pending")) return "Pending";
  if (statuses.some((status) => status === "Unknown")) return "Unknown";
  return "Approved";
}

function approvalStatusFromState(state: GovernanceWorkspaceState): GovernanceApprovalLayerStatus {
  switch (state.approvalStatus) {
    case "ready_for_review":
      return "Pending";
    case "awaiting_authority":
      return "Pending";
    case "pending_review":
      return "Unknown";
    default:
      return "Unknown";
  }
}

function buildApprovalChainRows(state: GovernanceWorkspaceState): readonly GovernanceApprovalLayerRowView[] {
  const scoped = state.selectedObjectId;
  const scopeLabel = scoped ?? "executive scope";

  return Object.freeze([
    Object.freeze({
      id: "operational_lead",
      label: "Operational Lead",
      status: scoped ? "Pending" : "Unknown",
      detail: scoped
        ? `Must approve operational impact for ${scopeLabel}.`
        : "Approver unknown until review scope is selected.",
    }),
    Object.freeze({
      id: "finance_controller",
      label: "Finance Controller",
      status: scoped ? "Approved" : "Unknown",
      detail: scoped
        ? "Financial controls pre-check completed for scoped review."
        : "Finance approval status unavailable without scope.",
    }),
    Object.freeze({
      id: "executive_sponsor",
      label: "Executive Sponsor",
      status: approvalStatusFromState(state),
      detail: scoped
        ? "Final executive sign-off required before governance clearance."
        : "Executive sponsor not yet assigned to review scope.",
    }),
  ]);
}

function buildStakeholderRows(state: GovernanceWorkspaceState): readonly GovernanceApprovalLayerRowView[] {
  const scoped = state.selectedObjectId;
  const scopeLabel = scoped ?? "executive scope";

  return Object.freeze([
    Object.freeze({
      id: "operations_team",
      label: "Operations Team",
      status: scoped ? "Pending" : "Unknown",
      detail: scoped
        ? `Operations workflows may be affected by changes to ${scopeLabel}.`
        : "Stakeholder impact unscoped.",
    }),
    Object.freeze({
      id: "finance_unit",
      label: "Finance Unit",
      status: scoped ? "Approved" : "Unknown",
      detail: scoped
        ? "Finance unit notified — budget exposure within review tolerance."
        : "Finance stakeholder impact not yet assessed.",
    }),
    Object.freeze({
      id: "supply_chain_partners",
      label: "Supply Chain Partners",
      status: scoped ? "Unknown" : "Unknown",
      detail: scoped
        ? "Partner notification status pending external confirmation."
        : "External stakeholder impact requires scoped object selection.",
    }),
  ]);
}

function buildAuthorityRows(state: GovernanceWorkspaceState): readonly GovernanceApprovalLayerRowView[] {
  const scoped = state.selectedObjectId;

  return Object.freeze([
    Object.freeze({
      id: "approval_authority",
      label: "Approval Authority",
      status: approvalStatusFromState(state),
      detail: scoped
        ? "Governance evaluates whether required approvers have cleared the review."
        : "Approval authority evaluation pending scope selection.",
    }),
    Object.freeze({
      id: "commitment_owner",
      label: "Commitment Owner (War Room)",
      status: "Approved",
      detail:
        "War Room owns commitment execution. Governance does not execute or claim War Room ownership.",
    }),
    Object.freeze({
      id: "decision_accountability",
      label: "Decision Accountability",
      status: scoped ? "Pending" : "Unknown",
      detail: scoped
        ? "Executive sponsor holds decision accountability — governance reviews compliance only."
        : "Decision accountability unassigned until scope is defined.",
    }),
  ]);
}

export function deriveApprovalChainIntelligence(
  state: GovernanceWorkspaceState
): ApprovalChainIntelligenceSurface {
  const rows = buildApprovalChainRows(state);
  return Object.freeze({
    panelId: "approval_chain",
    label: "Approval Chain",
    question: GOVERNANCE_APPROVAL_LAYER_QUESTIONS.approval_chain,
    overallStatus: worstStatus(rows.map((row) => row.status)),
    readOnly: true,
    mayEvaluate: true,
    mayExecute: false,
    rows,
  });
}

export function deriveStakeholderImpactIntelligence(
  state: GovernanceWorkspaceState
): StakeholderImpactIntelligenceSurface {
  const rows = buildStakeholderRows(state);
  return Object.freeze({
    panelId: "stakeholder_impact",
    label: "Stakeholder Impact",
    question: GOVERNANCE_APPROVAL_LAYER_QUESTIONS.stakeholder_impact,
    overallStatus: worstStatus(rows.map((row) => row.status)),
    readOnly: true,
    mayEvaluate: true,
    mayExecute: false,
    rows,
  });
}

export function deriveAuthorityReviewIntelligence(
  state: GovernanceWorkspaceState
): AuthorityReviewIntelligenceSurface {
  const rows = buildAuthorityRows(state);
  return Object.freeze({
    panelId: "authority_review",
    label: "Authority Review",
    question: GOVERNANCE_APPROVAL_LAYER_QUESTIONS.authority_review,
    overallStatus: worstStatus(rows.map((row) => row.status)),
    readOnly: true,
    mayEvaluate: true,
    mayExecute: false,
    warRoomOwnsCommitment: true,
    rows,
  });
}

export function deriveGovernanceApprovalLayerIntelligence(
  state: GovernanceWorkspaceState
): GovernanceApprovalLayerIntelligenceSurface {
  return Object.freeze({
    approvalChain: deriveApprovalChainIntelligence(state),
    stakeholderImpact: deriveStakeholderImpactIntelligence(state),
    authorityReview: deriveAuthorityReviewIntelligence(state),
    source: "governance_approval_layer_intelligence",
    tag: GOVERNANCE_APPROVAL_LAYER_TAG,
  });
}

export function traceGovernanceApprovalLayerOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_APPROVAL_LAYER_TAG, {
    action: "governance_approval_layer_active",
    mountKey: mountKey ?? null,
    mayEvaluate: true,
    mayExecute: false,
    warRoomOwnsCommitment: true,
  });
}

export function resetGovernanceApprovalLayerIntelligenceForTests(): void {
  loggedKeys.clear();
}
