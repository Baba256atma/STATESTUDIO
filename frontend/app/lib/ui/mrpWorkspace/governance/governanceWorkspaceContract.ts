/**
 * MRP:5B:1 — Governance workspace contract.
 *
 * Governance owns compliance review — not forecasts, scenarios, execution,
 * recommendations (Advisory), or commitment (War Room).
 */

export const GOVERNANCE_FOUNDATION_TAG = "[MRP_5B1_FOUNDATION]" as const;

export const GOVERNANCE_RUNTIME_TAG = "[MRP_5B2_RUNTIME]" as const;

export const GOVERNANCE_POLICY_INTELLIGENCE_TAG = "[MRP_5B3_POLICY]" as const;

export const GOVERNANCE_APPROVAL_LAYER_TAG = "[MRP_5B4_APPROVAL]" as const;

export const GOVERNANCE_DECISION_GATE_TAG = "[MRP_5B5_GATE]" as const;

export const MRP_GOVERNANCE_CERTIFIED_TAG = "[MRP_GOVERNANCE_CERTIFIED]" as const;
export const MRP_PHASE5B_COMPLETE_TAG = "[MRP_PHASE5B_COMPLETE]" as const;

export const GOVERNANCE_WORKSPACE_VERSION = "5B.6.0";

export const CANONICAL_GOVERNANCE_WORKSPACE_OWNER = "GovernanceWorkspace" as const;

export const GOVERNANCE_WORKSPACE_TITLE = "Governance" as const;

export const GOVERNANCE_WORKSPACE_SUBTITLE = "Approval • Policy • Authority" as const;

export const GOVERNANCE_SCAN_PURPOSE =
  "Determine whether proposed actions, recommendations, plans, and decisions comply with policies, constraints, approval rules, executive authority, and governance requirements." as const;

import type {
  ConstraintReviewIntelligenceSurface,
  PolicyAlignmentIntelligenceSurface,
} from "./governancePolicyConstraintIntelligenceContract.ts";
import type { GovernanceApprovalLayerIntelligenceSurface } from "./governanceApprovalLayerIntelligenceContract.ts";
import type { GovernanceDecisionGateSurface } from "./governanceDecisionGateContract.ts";

export type GovernanceWorkspaceSectionId =
  | "governance_summary"
  | "policy_alignment"
  | "constraint_review"
  | "approval_chain"
  | "stakeholder_impact"
  | "authority_review";

export type GovernanceWorkspacePanelTone =
  | "neutral"
  | "muted"
  | "success"
  | "warning";

export type GovernanceWorkspacePanelView = Readonly<{
  id: GovernanceWorkspaceSectionId;
  label: string;
  headline: string;
  detail: string;
  tone: GovernanceWorkspacePanelTone;
}>;

export type GovernanceWorkspaceView = Readonly<{
  workspaceId: "governance";
  title: typeof GOVERNANCE_WORKSPACE_TITLE;
  subtitle: typeof GOVERNANCE_WORKSPACE_SUBTITLE;
  panels: readonly GovernanceWorkspacePanelView[];
  policyIntelligence: PolicyAlignmentIntelligenceSurface;
  constraintIntelligence: ConstraintReviewIntelligenceSurface;
  approvalLayerIntelligence: GovernanceApprovalLayerIntelligenceSurface;
  decisionGate: GovernanceDecisionGateSurface;
  scanPurpose: typeof GOVERNANCE_SCAN_PURPOSE;
  phase: "loading" | "ready" | "empty";
  revision: number;
  selectedObjectId: string | null;
  source: "governance_workspace_foundation" | "governance_workspace_runtime_state";
  ownsGovernanceReviewOnly: true;
}>;

export const GOVERNANCE_WORKSPACE_SECTION_ORDER: readonly GovernanceWorkspaceSectionId[] =
  Object.freeze([
    "governance_summary",
    "policy_alignment",
    "constraint_review",
    "approval_chain",
    "stakeholder_impact",
    "authority_review",
  ]);

export const GOVERNANCE_WORKSPACE_SECTION_LABELS: Readonly<
  Record<GovernanceWorkspaceSectionId, string>
> = Object.freeze({
  governance_summary: "Governance Summary",
  policy_alignment: "Policy Alignment",
  constraint_review: "Constraint Review",
  approval_chain: "Approval Chain",
  stakeholder_impact: "Stakeholder Impact",
  authority_review: "Authority Review",
});
