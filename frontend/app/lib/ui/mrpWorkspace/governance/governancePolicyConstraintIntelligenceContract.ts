/**
 * MRP:5B:3 — Policy & Constraint intelligence surface contract.
 *
 * Read-only governance intelligence. No execution authority.
 */

export const GOVERNANCE_POLICY_INTELLIGENCE_TAG = "[MRP_5B3_POLICY]" as const;

export const GOVERNANCE_POLICY_CONSTRAINT_VERSION = "5B.3.0";

export type GovernanceIntelligenceVerdict = "PASS" | "WARNING" | "BLOCKED";

export type GovernancePolicyQuestionId =
  | "policies_affected"
  | "rules_apply"
  | "standards_involved";

export type GovernanceConstraintQuestionId =
  | "budget"
  | "resource"
  | "timeline"
  | "authority";

export type GovernanceIntelligenceRowView = Readonly<{
  id: GovernancePolicyQuestionId | GovernanceConstraintQuestionId;
  question: string;
  verdict: GovernanceIntelligenceVerdict;
  detail: string;
}>;

export type PolicyAlignmentIntelligenceSurface = Readonly<{
  panelId: "policy_alignment";
  label: "Policy Alignment";
  overallVerdict: GovernanceIntelligenceVerdict;
  readOnly: true;
  ownsExecutionAuthority: false;
  rows: readonly GovernanceIntelligenceRowView[];
}>;

export type ConstraintReviewIntelligenceSurface = Readonly<{
  panelId: "constraint_review";
  label: "Constraint Review";
  overallVerdict: GovernanceIntelligenceVerdict;
  readOnly: true;
  ownsExecutionAuthority: false;
  rows: readonly GovernanceIntelligenceRowView[];
}>;

export type GovernancePolicyConstraintIntelligenceSurface = Readonly<{
  policy: PolicyAlignmentIntelligenceSurface;
  constraint: ConstraintReviewIntelligenceSurface;
  source: "governance_policy_constraint_intelligence";
  tag: typeof GOVERNANCE_POLICY_INTELLIGENCE_TAG;
}>;

export const GOVERNANCE_POLICY_QUESTIONS: Readonly<
  Record<GovernancePolicyQuestionId, string>
> = Object.freeze({
  policies_affected: "Which policies are affected?",
  rules_apply: "Which rules apply?",
  standards_involved: "Which standards are involved?",
});

export const GOVERNANCE_CONSTRAINT_QUESTIONS: Readonly<
  Record<GovernanceConstraintQuestionId, string>
> = Object.freeze({
  budget: "Budget constraints",
  resource: "Resource constraints",
  timeline: "Timeline constraints",
  authority: "Authority constraints",
});

export type GovernancePolicyConstraintForbiddenAction =
  | "write_timeline"
  | "write_scenario"
  | "execute_decision";

export type GovernancePolicyConstraintBoundaryResult = Readonly<{
  allowed: boolean;
  tag: typeof GOVERNANCE_POLICY_INTELLIGENCE_TAG;
  reason: string;
  action: GovernancePolicyConstraintForbiddenAction;
}>;
