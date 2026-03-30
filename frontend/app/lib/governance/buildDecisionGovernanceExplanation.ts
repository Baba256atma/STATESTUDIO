import type { DecisionGovernancePolicyContext } from "./buildDecisionGovernancePolicy";
import type { GovernanceDecisionMode } from "./decisionGovernanceTypes";

export function buildDecisionGovernanceExplanation(params: {
  mode: GovernanceDecisionMode;
  context: DecisionGovernancePolicyContext;
}): string {
  if (params.mode === "blocked") {
    return "This decision is currently blocked because the environment does not allow stronger action under the current conditions.";
  }
  if (params.mode === "executive_review_required") {
    return "Executive review is required because downside risk is material and team alignment is not yet strong enough for direct action.";
  }
  if (params.mode === "approval_required") {
    return "This decision requires approval before stronger action because confidence or evidence remains too weak for unreviewed execution.";
  }
  if (params.mode === "compare_required") {
    return "This decision currently requires comparison before stronger action because team alignment or organizational memory warns that trade-offs are still material.";
  }
  if (params.mode === "preview_only") {
    return "This decision is currently limited to preview-first review because calibration, evidence, or environment safety signals do not justify stronger action yet.";
  }
  if (params.mode === "simulation_allowed") {
    return "This decision is cleared for simulation-first review, but direct apply remains gated until stronger evidence or approval is available.";
  }
  return "This decision remains advisory because Nexora does not yet have enough recommendation or execution context to safely expand action options.";
}
