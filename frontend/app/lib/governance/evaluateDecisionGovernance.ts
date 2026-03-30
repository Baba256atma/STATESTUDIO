import type { DecisionGovernancePolicyContext } from "./buildDecisionGovernancePolicy";
import type { GovernanceDecisionMode, GovernanceRuleEvaluation } from "./decisionGovernanceTypes";

type EvaluationResult = {
  mode: GovernanceDecisionMode;
  rule_evaluations: GovernanceRuleEvaluation[];
  approval_required: boolean;
  approver_role: "executive" | "manager" | "system_owner" | null;
  escalation_required: boolean;
  escalation_reason: string | null;
};

const precedence: GovernanceDecisionMode[] = [
  "advisory_only",
  "preview_only",
  "simulation_allowed",
  "compare_required",
  "approval_required",
  "executive_review_required",
  "blocked",
];

function strongerMode(current: GovernanceDecisionMode, next: GovernanceDecisionMode): GovernanceDecisionMode {
  return precedence.indexOf(next) > precedence.indexOf(current) ? next : current;
}

export function evaluateDecisionGovernance(context: DecisionGovernancePolicyContext): EvaluationResult {
  let mode: GovernanceDecisionMode = context.current_action ? "simulation_allowed" : "advisory_only";
  let approvalRequired = false;
  let approverRole: EvaluationResult["approver_role"] = null;
  let escalationRequired = false;
  let escalationReason: string | null = null;
  const rules: GovernanceRuleEvaluation[] = [];

  const addRule = (
    id: string,
    label: string,
    passed: boolean,
    summary: string,
    severity: GovernanceRuleEvaluation["severity"] = "medium"
  ) => {
    rules.push({ id, label, passed, summary, severity });
  };

  const noRecommendation = !context.current_action;
  addRule(
    "recommendation_available",
    "Recommendation is actionable",
    !noRecommendation,
    noRecommendation
      ? "No strong recommendation is available yet, so Nexora remains advisory."
      : "A concrete recommendation is available for governance review.",
    "low"
  );
  if (noRecommendation) mode = "advisory_only";

  addRule(
    "environment_not_blocked",
    "Environment allows action",
    !context.blocked_environment,
    context.blocked_environment
      ? "The current environment is blocked or frozen, so stronger actions cannot proceed."
      : "The current environment does not impose a hard block.",
    "high"
  );
  if (context.blocked_environment) {
    mode = "blocked";
    escalationRequired = true;
    escalationReason = "The current environment is blocked or frozen.";
  }

  addRule(
    "evidence_strength",
    "Evidence is strong enough for stronger action",
    context.evidence_strength !== "weak",
    context.evidence_strength === "weak"
      ? "Evidence is still weak, so direct execution should remain tightly controlled."
      : "Evidence strength is sufficient for simulation or guided review.",
    "medium"
  );
  if (context.evidence_strength === "weak" && mode !== "blocked") {
    mode = strongerMode(mode, "preview_only");
  }

  addRule(
    "calibration_quality",
    "Calibration supports stronger action",
    context.calibration_label !== "overconfident",
    context.calibration_label === "overconfident"
      ? "Recent calibration suggests this recommendation class tends to overstate certainty."
      : "Calibration does not show a strong overconfidence warning.",
    "medium"
  );
  if (context.calibration_label === "overconfident" && mode !== "blocked") {
    mode = strongerMode(mode, "preview_only");
  }

  addRule(
    "comparison_not_required",
    "Comparison is not required before action",
    !(context.team_alignment === "low" || (context.org_warning && context.risk_level !== "low")),
    context.team_alignment === "low" || (context.org_warning && context.risk_level !== "low")
      ? "Cross-role disagreement or organizational warning means comparison should happen before stronger action."
      : "Comparison is helpful but not required by current policy.",
    "medium"
  );
  if ((context.team_alignment === "low" || (context.org_warning && context.risk_level !== "low")) && mode !== "blocked") {
    mode = strongerMode(mode, "compare_required");
  }

  addRule(
    "review_threshold",
    "Executive review is not required",
    !(context.risk_level === "high" && context.team_alignment !== "high"),
    context.risk_level === "high" && context.team_alignment !== "high"
      ? "Downside risk is material and the team is not fully aligned, so executive review is required."
      : "Risk and team alignment do not force executive review.",
    "high"
  );
  if (context.risk_level === "high" && context.team_alignment !== "high" && mode !== "blocked") {
    mode = strongerMode(mode, "executive_review_required");
    approvalRequired = true;
    approverRole = "executive";
    escalationRequired = true;
    escalationReason = "High risk and incomplete team alignment require executive review.";
  }

  addRule(
    "approval_needed",
    "Approval is not required before stronger action",
    !(context.confidence_level === "low" || context.action_posture === "recommend_more_evidence"),
    context.confidence_level === "low" || context.action_posture === "recommend_more_evidence"
      ? "Current confidence or action posture means a manager should approve stronger action."
      : "Approval is not currently required for simulation-grade action.",
    "medium"
  );
  if ((context.confidence_level === "low" || context.action_posture === "recommend_more_evidence") && mode !== "blocked" && mode !== "executive_review_required") {
    mode = strongerMode(mode, "approval_required");
    approvalRequired = true;
    approverRole = approverRole ?? "manager";
  }

  addRule(
    "safe_environment",
    "Environment allows more than preview",
    !context.safe_environment || mode === "blocked",
    context.safe_environment
      ? "The environment is in safe mode, so apply stays blocked and preview remains the safest direct action."
      : "The environment does not force preview-only control.",
    "medium"
  );
  if (context.safe_environment && mode !== "blocked" && precedence.indexOf(mode) < precedence.indexOf("preview_only")) {
    mode = "preview_only";
  }

  return {
    mode,
    rule_evaluations: rules,
    approval_required: approvalRequired,
    approver_role: approverRole,
    escalation_required: escalationRequired,
    escalation_reason: escalationReason,
  };
}
