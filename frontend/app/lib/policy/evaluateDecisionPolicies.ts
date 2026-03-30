import type { DecisionPolicyContext } from "./buildDecisionPolicyContext";
import type { DecisionPolicyEvaluation, DecisionPolicyPosture, DecisionPolicyRule } from "./decisionPolicyTypes";

type EvaluateDecisionPoliciesResult = {
  posture: DecisionPolicyPosture;
  evaluations: DecisionPolicyEvaluation[];
  active_rules: DecisionPolicyRule[];
  constraints: string[];
  policy_drivers: string[];
};

const posturePriority: DecisionPolicyPosture[] = [
  "permissive",
  "guarded",
  "simulation_first",
  "compare_first",
  "approval_gated",
  "executive_review",
  "restricted",
];

function strongerPosture(current: DecisionPolicyPosture, next: DecisionPolicyPosture): DecisionPolicyPosture {
  return posturePriority.indexOf(next) > posturePriority.indexOf(current) ? next : current;
}

export function evaluateDecisionPolicies(params: {
  context: DecisionPolicyContext;
  rules: DecisionPolicyRule[];
}): EvaluateDecisionPoliciesResult {
  const { context, rules } = params;
  let posture: DecisionPolicyPosture =
    context.confidence_level === "high" &&
    context.evidence_strength === "strong" &&
    context.risk_level === "low"
      ? "permissive"
      : "guarded";
  const evaluations: DecisionPolicyEvaluation[] = [];
  const activeRules: DecisionPolicyRule[] = [];
  const constraints: string[] = [];
  const drivers: string[] = [];

  const pushEvaluation = (
    rule: DecisionPolicyRule,
    passed: boolean,
    impact: DecisionPolicyEvaluation["impact"],
    summary: string
  ) => {
    evaluations.push({
      rule_id: rule.id,
      label: rule.label,
      passed,
      impact,
      summary,
    });
    if (passed && impact !== "allow") {
      activeRules.push(rule);
      drivers.push(summary);
    }
  };

  const byId = new Map(rules.map((rule) => [rule.id, rule]));

  const impactRule = byId.get("policy_evidence_vs_impact")!;
  const needsSimulation =
    (context.evidence_strength === "weak" && context.downstream_exposure !== "low") ||
    (context.uncertainty_level === "high" && context.downstream_exposure === "high");
  pushEvaluation(
    impactRule,
    needsSimulation,
    needsSimulation ? "simulate_first" : "allow",
    needsSimulation
      ? "Downstream impact remains meaningful relative to the current evidence strength."
      : "Evidence strength is not forcing simulation-first review."
  );
  if (needsSimulation) {
    posture = strongerPosture(posture, "simulation_first");
    constraints.push("Direct apply should not be the first move.");
  }

  const calibrationRule = byId.get("policy_calibration_guardrail")!;
  const calibrationCaution = context.calibration_label === "overconfident";
  pushEvaluation(
    calibrationRule,
    calibrationCaution,
    calibrationCaution ? "caution" : "allow",
    calibrationCaution
      ? "Calibration suggests similar recommendations have overstated certainty."
      : "Calibration is not currently forcing additional caution."
  );
  if (calibrationCaution) posture = strongerPosture(posture, "guarded");

  const teamRule = byId.get("policy_team_alignment")!;
  const needsReview = context.team_alignment === "low" && context.risk_level === "high";
  const needsCompare = context.team_alignment === "low" && !needsReview;
  pushEvaluation(
    teamRule,
    needsReview || needsCompare,
    needsReview ? "executive_review" : needsCompare ? "compare_first" : "allow",
    needsReview
      ? "Cross-role disagreement remains too high for a non-reviewed high-risk decision."
      : needsCompare
        ? "Cross-role disagreement suggests comparing alternatives before stronger action."
        : "Team alignment is not forcing additional review."
  );
  if (needsReview) {
    posture = strongerPosture(posture, "executive_review");
    constraints.push("Executive review should resolve the current disagreement.");
  } else if (needsCompare) {
    posture = strongerPosture(posture, "compare_first");
    constraints.push("Compare should happen before stronger action.");
  }

  const orgRule = byId.get("policy_org_memory")!;
  pushEvaluation(
    orgRule,
    context.org_warning || context.org_gap,
    context.org_warning ? "compare_first" : context.org_gap ? "caution" : "allow",
    context.org_warning
      ? "Organization memory shows underperformance or weak calibration in similar cases."
      : context.org_gap
        ? "Organization memory coverage is still too thin for a permissive posture."
        : "Organization memory is not forcing additional caution."
  );
  if (context.org_warning) {
    posture = strongerPosture(posture, "compare_first");
    constraints.push("Cross-project warning signals should be addressed before apply.");
  } else if (context.org_gap) {
    posture = strongerPosture(posture, "guarded");
  }

  const environmentRule = byId.get("policy_environment")!;
  pushEvaluation(
    environmentRule,
    context.blocked_environment || context.safe_environment,
    context.blocked_environment ? "block" : context.safe_environment ? "simulate_first" : "allow",
    context.blocked_environment
      ? "The current environment is blocked or frozen."
      : context.safe_environment
        ? "The environment is in safe mode, so stronger action should stay constrained."
        : "The environment is not adding extra restrictions."
  );
  if (context.blocked_environment) {
    posture = "restricted";
    constraints.push("The current environment blocks stronger execution.");
  } else if (context.safe_environment) {
    posture = strongerPosture(posture, "simulation_first");
    constraints.push("Safe mode favors simulation or preview before any stronger move.");
  }

  const confidenceRule = byId.get("policy_confidence_quality")!;
  const approvalGated = Boolean(
    context.confidence_level === "low" && context.evidence_strength === "weak" && context.current_action
  );
  pushEvaluation(
    confidenceRule,
    approvalGated || (context.confidence_level === "low"),
    approvalGated ? "approval_required" : context.confidence_level === "low" ? "caution" : "allow",
    approvalGated
      ? "Low confidence and weak evidence mean stronger action should not proceed without approval."
      : context.confidence_level === "low"
        ? "Confidence is low enough to keep the posture guarded."
        : "Confidence quality is not adding new restrictions."
  );
  if (approvalGated) {
    posture = strongerPosture(posture, "approval_gated");
    constraints.push("Approval should precede direct application.");
  } else if (context.confidence_level === "low") {
    posture = strongerPosture(posture, "guarded");
  }

  return {
    posture,
    evaluations,
    active_rules: activeRules,
    constraints: Array.from(new Set(constraints)).slice(0, 4),
    policy_drivers: Array.from(new Set(drivers)).slice(0, 4),
  };
}
