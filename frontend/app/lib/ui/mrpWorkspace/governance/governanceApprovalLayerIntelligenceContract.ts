/**
 * MRP:5B:4 — Stakeholder & Approval layer intelligence contract.
 *
 * Governance may evaluate. Governance may not execute.
 */

export const GOVERNANCE_APPROVAL_LAYER_TAG = "[MRP_5B4_APPROVAL]" as const;

export const GOVERNANCE_APPROVAL_LAYER_VERSION = "5B.4.0";

export type GovernanceApprovalLayerStatus = "Approved" | "Pending" | "Rejected" | "Unknown";

export type ApprovalChainStepId =
  | "operational_lead"
  | "finance_controller"
  | "executive_sponsor";

export type StakeholderImpactId =
  | "operations_team"
  | "finance_unit"
  | "supply_chain_partners";

export type AuthorityReviewId =
  | "approval_authority"
  | "commitment_owner"
  | "decision_accountability";

export type GovernanceApprovalLayerRowView = Readonly<{
  id: string;
  label: string;
  status: GovernanceApprovalLayerStatus;
  detail: string;
}>;

export type ApprovalChainIntelligenceSurface = Readonly<{
  panelId: "approval_chain";
  label: "Approval Chain";
  question: "Who must approve?";
  overallStatus: GovernanceApprovalLayerStatus;
  readOnly: true;
  mayEvaluate: true;
  mayExecute: false;
  rows: readonly GovernanceApprovalLayerRowView[];
}>;

export type StakeholderImpactIntelligenceSurface = Readonly<{
  panelId: "stakeholder_impact";
  label: "Stakeholder Impact";
  question: "Who is affected?";
  overallStatus: GovernanceApprovalLayerStatus;
  readOnly: true;
  mayEvaluate: true;
  mayExecute: false;
  rows: readonly GovernanceApprovalLayerRowView[];
}>;

export type AuthorityReviewIntelligenceSurface = Readonly<{
  panelId: "authority_review";
  label: "Authority Review";
  question: "Who owns the decision?";
  overallStatus: GovernanceApprovalLayerStatus;
  readOnly: true;
  mayEvaluate: true;
  mayExecute: false;
  warRoomOwnsCommitment: true;
  rows: readonly GovernanceApprovalLayerRowView[];
}>;

export type GovernanceApprovalLayerIntelligenceSurface = Readonly<{
  approvalChain: ApprovalChainIntelligenceSurface;
  stakeholderImpact: StakeholderImpactIntelligenceSurface;
  authorityReview: AuthorityReviewIntelligenceSurface;
  source: "governance_approval_layer_intelligence";
  tag: typeof GOVERNANCE_APPROVAL_LAYER_TAG;
}>;

export const GOVERNANCE_APPROVAL_LAYER_QUESTIONS = Object.freeze({
  approval_chain: "Who must approve?",
  stakeholder_impact: "Who is affected?",
  authority_review: "Who owns the decision?",
});

export type GovernanceApprovalLayerForbiddenAction =
  | "commit_decision"
  | "select_strategy"
  | "create_action_plans"
  | "track_execution_status"
  | "monitor_active_decisions"
  | "claim_war_room_ownership";

export type GovernanceApprovalLayerBoundaryResult = Readonly<{
  allowed: boolean;
  tag: typeof GOVERNANCE_APPROVAL_LAYER_TAG;
  reason: string;
  action: GovernanceApprovalLayerForbiddenAction;
}>;
