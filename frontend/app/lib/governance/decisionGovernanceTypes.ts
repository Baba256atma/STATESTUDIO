export type GovernanceDecisionMode =
  | "advisory_only"
  | "preview_only"
  | "simulation_allowed"
  | "compare_required"
  | "approval_required"
  | "executive_review_required"
  | "blocked";

export type GovernanceRuleEvaluation = {
  id: string;
  label: string;
  passed: boolean;
  summary: string;
  severity?: "low" | "medium" | "high";
};

export type GovernanceApprovalRequirement = {
  required: boolean;
  approver_role?: "executive" | "analyst" | "operator" | "investor" | "manager" | "system_owner" | null;
  reason?: string | null;
};

export type DecisionGovernanceState = {
  decision_id?: string | null;
  mode: GovernanceDecisionMode;
  approval: GovernanceApprovalRequirement;
  escalation_required: boolean;
  escalation_reason?: string | null;
  blocked_actions: string[];
  allowed_actions: string[];
  rule_evaluations: GovernanceRuleEvaluation[];
  explanation: string;
  next_steps: string[];
};
