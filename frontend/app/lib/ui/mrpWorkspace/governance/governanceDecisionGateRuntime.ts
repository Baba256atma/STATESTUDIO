/**
 * MRP:5B:5 — Derive governance decision gate outcome from review intelligence.
 */

import type { GovernanceApprovalLayerIntelligenceSurface } from "./governanceApprovalLayerIntelligenceContract.ts";
import {
  GOVERNANCE_DECISION_GATE_TAG,
  GOVERNANCE_OWNERSHIP_RULE,
  type GovernanceDecisionGateSurface,
  type GovernanceDecisionOutcome,
} from "./governanceDecisionGateContract.ts";
import type { GovernancePolicyConstraintIntelligenceSurface } from "./governancePolicyConstraintIntelligenceContract.ts";
import type { GovernanceWorkspaceState } from "./governanceWorkspaceState.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function hasRejectedApproval(
  approvalLayer: GovernanceApprovalLayerIntelligenceSurface
): boolean {
  const statuses = [
    approvalLayer.approvalChain.overallStatus,
    approvalLayer.stakeholderImpact.overallStatus,
    approvalLayer.authorityReview.overallStatus,
  ];
  return statuses.includes("Rejected");
}

function buildConditions(
  outcome: GovernanceDecisionOutcome,
  state: GovernanceWorkspaceState
): readonly string[] {
  if (outcome === "APPROVED") {
    return Object.freeze(["All governance review dimensions cleared for readiness."]);
  }
  if (outcome === "BLOCKED") {
    return Object.freeze([
      "Blocking constraint or rejected approval detected.",
      "Resolve blockers before resubmitting for governance clearance.",
    ]);
  }
  if (outcome === "APPROVED WITH CONDITIONS") {
    return Object.freeze([
      state.policyStatus === "partial"
        ? "Policy alignment partial — conditions must be documented."
        : "Conditional clearance — pending approvers must confirm remaining items.",
      "War Room must not execute until conditions are satisfied.",
    ]);
  }
  return Object.freeze([
    state.selectedObjectId
      ? "Review incomplete — additional governance evaluation required."
      : "Select review scope to evaluate governance readiness.",
  ]);
}

function buildReadinessSummary(
  outcome: GovernanceDecisionOutcome,
  state: GovernanceWorkspaceState
): string {
  const scope = state.selectedObjectId ?? "executive scope";
  switch (outcome) {
    case "APPROVED":
      return `Governance readiness confirmed for ${scope}. Approval posture is clear — War Room may proceed when authorized.`;
    case "APPROVED WITH CONDITIONS":
      return `Conditional governance clearance for ${scope}. Readiness granted with documented conditions — no execution authority.`;
    case "BLOCKED":
      return `Governance clearance blocked for ${scope}. Resolve constraints and approval rejections before proceeding.`;
    default:
      return state.selectedObjectId
        ? `Governance review in progress for ${scope}. Readiness outcome pending further evaluation.`
        : "Governance readiness cannot be determined without review scope.";
  }
}

export function deriveGovernanceDecisionOutcome(input: {
  state: GovernanceWorkspaceState;
  policyConstraint: GovernancePolicyConstraintIntelligenceSurface;
  approvalLayer: GovernanceApprovalLayerIntelligenceSurface;
}): GovernanceDecisionOutcome {
  const { state, policyConstraint, approvalLayer } = input;

  if (!state.selectedObjectId) {
    return "REVIEW REQUIRED";
  }

  if (
    policyConstraint.constraint.overallVerdict === "BLOCKED" ||
    hasRejectedApproval(approvalLayer)
  ) {
    return "BLOCKED";
  }

  const policyPass = policyConstraint.policy.overallVerdict === "PASS";
  const constraintPass = policyConstraint.constraint.overallVerdict === "PASS";
  const chainApproved = approvalLayer.approvalChain.overallStatus === "Approved";

  if (policyPass && constraintPass && chainApproved) {
    return "APPROVED";
  }

  if (
    state.policyStatus === "partial" ||
    policyConstraint.policy.overallVerdict === "WARNING" ||
    policyConstraint.constraint.overallVerdict === "WARNING" ||
    approvalLayer.approvalChain.overallStatus === "Pending"
  ) {
    return "APPROVED WITH CONDITIONS";
  }

  return "REVIEW REQUIRED";
}

export function deriveGovernanceDecisionGate(input: {
  state: GovernanceWorkspaceState;
  policyConstraint: GovernancePolicyConstraintIntelligenceSurface;
  approvalLayer: GovernanceApprovalLayerIntelligenceSurface;
}): GovernanceDecisionGateSurface {
  const outcome = deriveGovernanceDecisionOutcome(input);
  return Object.freeze({
    panelId: "governance_decision_gate",
    label: "Governance Decision Gate",
    outcome,
    readinessSummary: buildReadinessSummary(outcome, input.state),
    ownershipRule: GOVERNANCE_OWNERSHIP_RULE,
    readOnly: true,
    decidesReadiness: true,
    mayExecute: false,
    mayForecast: false,
    mayRecommendAlternatives: false,
    advisoryRecommends: true,
    warRoomExecutes: true,
    conditions: buildConditions(outcome, input.state),
    source: "governance_decision_gate",
    tag: GOVERNANCE_DECISION_GATE_TAG,
  });
}

export function traceGovernanceDecisionGateOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_DECISION_GATE_TAG, {
    action: "governance_decision_gate_active",
    mountKey: mountKey ?? null,
    ownershipRule: GOVERNANCE_OWNERSHIP_RULE,
    decidesReadiness: true,
    mayExecute: false,
  });
}

export function resetGovernanceDecisionGateForTests(): void {
  loggedKeys.clear();
}
