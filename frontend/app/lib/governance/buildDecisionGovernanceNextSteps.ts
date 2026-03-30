import type { DecisionGovernancePolicyContext } from "./buildDecisionGovernancePolicy";
import type { GovernanceDecisionMode } from "./decisionGovernanceTypes";

export function buildDecisionGovernanceNextSteps(params: {
  mode: GovernanceDecisionMode;
  context: DecisionGovernancePolicyContext;
}): string[] {
  if (params.mode === "blocked") {
    return [
      "Remain in advisory review until the environment block is cleared.",
      "Use timeline and memory to understand why the decision is restricted.",
      "Escalate to a system owner if the block is operational rather than strategic.",
    ];
  }
  if (params.mode === "executive_review_required") {
    return [
      "Run simulation before requesting executive review.",
      "Resolve cross-role disagreement before escalation if possible.",
      "Bring the downside risk summary into the approval conversation.",
    ];
  }
  if (params.mode === "approval_required") {
    return [
      "Gather approval from the required reviewer before stronger action.",
      "Use safe preview or simulation while approval is pending.",
      "Strengthen evidence around the weakest assumption first.",
    ];
  }
  if (params.mode === "compare_required") {
    return [
      "Compare the current recommendation with one lower-risk alternative.",
      "Use simulation to clarify the main trade-off before action.",
      "Return to the team decision view to check whether alignment improves.",
    ];
  }
  if (params.mode === "preview_only") {
    return [
      "Stay in safe preview mode for now.",
      "Capture stronger outcome evidence before any stronger action.",
      "Open compare or simulation if you need to reduce uncertainty.",
    ];
  }
  if (params.mode === "simulation_allowed") {
    return [
      "Run simulation before any stronger execution step.",
      "Keep compare available if a lower-risk path is needed.",
      "Save the scenario so outcome feedback can refine future governance.",
    ];
  }
  return [
    "Review confidence and team alignment first.",
    "Use safe preview or save scenario while evidence matures.",
    "Return once stronger recommendation context is available.",
  ];
}
