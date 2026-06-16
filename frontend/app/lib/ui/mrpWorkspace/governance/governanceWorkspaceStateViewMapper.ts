/**
 * MRP:5B:2 — Map governance runtime state to workspace view panels.
 */

import {
  GOVERNANCE_SCAN_PURPOSE,
  GOVERNANCE_WORKSPACE_SECTION_LABELS,
  GOVERNANCE_WORKSPACE_SECTION_ORDER,
  GOVERNANCE_WORKSPACE_SUBTITLE,
  GOVERNANCE_WORKSPACE_TITLE,
  type GovernanceWorkspacePanelView,
  type GovernanceWorkspaceView,
} from "./governanceWorkspaceContract.ts";
import { deriveGovernancePolicyConstraintIntelligence } from "./governancePolicyConstraintIntelligenceRuntime.ts";
import { deriveGovernanceApprovalLayerIntelligence } from "./governanceApprovalLayerIntelligenceRuntime.ts";
import { deriveGovernanceDecisionGate } from "./governanceDecisionGateRuntime.ts";
import type {
  GovernanceConstraintStatus,
  GovernancePolicyStatus,
  GovernanceWorkspaceState,
} from "./governanceWorkspaceState.ts";

function policyHeadline(status: GovernancePolicyStatus): string {
  switch (status) {
    case "aligned":
      return "Policy alignment confirmed";
    case "partial":
      return "Partial policy alignment";
    default:
      return "Policy alignment pending";
  }
}

function constraintHeadline(status: GovernanceConstraintStatus): string {
  switch (status) {
    case "clear":
      return "No blocking constraints detected";
    case "review_required":
      return "Constraint review required";
    default:
      return "Constraint status pending";
  }
}

function buildPanels(
  state: GovernanceWorkspaceState,
  intelligence: ReturnType<typeof deriveGovernancePolicyConstraintIntelligence>,
  approvalLayer: ReturnType<typeof deriveGovernanceApprovalLayerIntelligence>
): readonly GovernanceWorkspacePanelView[] {
  const objectScope = state.selectedObjectId
    ? `Review scope: ${state.selectedObjectId}`
    : "No object selected — governance review uses executive scope.";

  const panelContent: Readonly<
    Record<
      (typeof GOVERNANCE_WORKSPACE_SECTION_ORDER)[number],
      Pick<GovernanceWorkspacePanelView, "headline" | "detail" | "tone">
    >
  > = Object.freeze({
    governance_summary: Object.freeze({
      headline: state.selectedObjectId
        ? "Governance review active for selected object"
        : "Governance review posture — foundation runtime",
      detail: `${objectScope} Governance evaluates compliance only — no execution authority.`,
      tone: "neutral",
    }),
    policy_alignment: Object.freeze({
      headline: `${policyHeadline(state.policyStatus)} — ${intelligence.policy.overallVerdict}`,
      detail: `Read-only policy intelligence across ${intelligence.policy.rows.length} review questions.`,
      tone:
        intelligence.policy.overallVerdict === "PASS"
          ? "success"
          : intelligence.policy.overallVerdict === "WARNING"
            ? "warning"
            : "muted",
    }),
    constraint_review: Object.freeze({
      headline: `${constraintHeadline(state.constraintStatus)} — ${intelligence.constraint.overallVerdict}`,
      detail: `Read-only constraint intelligence across ${intelligence.constraint.rows.length} constraint dimensions.`,
      tone:
        intelligence.constraint.overallVerdict === "PASS"
          ? "success"
          : intelligence.constraint.overallVerdict === "BLOCKED"
            ? "warning"
            : "warning",
    }),
    approval_chain: Object.freeze({
      headline: `Approval chain — ${approvalLayer.approvalChain.overallStatus}`,
      detail: approvalLayer.approvalChain.question,
      tone: approvalLayer.approvalChain.overallStatus === "Approved" ? "success" : "neutral",
    }),
    stakeholder_impact: Object.freeze({
      headline: `Stakeholder impact — ${approvalLayer.stakeholderImpact.overallStatus}`,
      detail: approvalLayer.stakeholderImpact.question,
      tone: approvalLayer.stakeholderImpact.overallStatus === "Rejected" ? "warning" : "muted",
    }),
    authority_review: Object.freeze({
      headline: `Authority review — ${approvalLayer.authorityReview.overallStatus}`,
      detail: `${approvalLayer.authorityReview.question} War Room owns commitment.`,
      tone: "neutral",
    }),
  });

  return Object.freeze(
    GOVERNANCE_WORKSPACE_SECTION_ORDER.map((id) =>
      Object.freeze({
        id,
        label: GOVERNANCE_WORKSPACE_SECTION_LABELS[id],
        headline: panelContent[id].headline,
        detail: panelContent[id].detail,
        tone: panelContent[id].tone,
      })
    )
  );
}

export function buildGovernanceWorkspaceViewFromState(
  state: GovernanceWorkspaceState
): GovernanceWorkspaceView {
  const intelligence = deriveGovernancePolicyConstraintIntelligence(state);
  const approvalLayer = deriveGovernanceApprovalLayerIntelligence(state);
  const decisionGate = deriveGovernanceDecisionGate({
    state,
    policyConstraint: intelligence,
    approvalLayer,
  });
  return Object.freeze({
    workspaceId: "governance",
    title: GOVERNANCE_WORKSPACE_TITLE,
    subtitle: GOVERNANCE_WORKSPACE_SUBTITLE,
    panels: buildPanels(state, intelligence, approvalLayer),
    policyIntelligence: intelligence.policy,
    constraintIntelligence: intelligence.constraint,
    approvalLayerIntelligence: approvalLayer,
    decisionGate,
    scanPurpose: GOVERNANCE_SCAN_PURPOSE,
    phase: state.phase === "closed" ? "empty" : state.phase,
    revision: state.revision,
    selectedObjectId: state.selectedObjectId,
    source: "governance_workspace_runtime_state",
    ownsGovernanceReviewOnly: true,
  });
}
