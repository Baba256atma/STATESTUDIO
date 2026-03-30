import type { DecisionPolicyPosture } from "./decisionPolicyTypes";

export function buildDecisionPolicyNextSteps(posture: DecisionPolicyPosture): string[] {
  if (posture === "restricted") {
    return [
      "Keep the decision in advisory or preview mode.",
      "Wait for the environment restriction to clear before stronger action.",
      "Use timeline and memory to understand what is blocking progress.",
    ];
  }
  if (posture === "executive_review") {
    return [
      "Escalate to executive review.",
      "Resolve the biggest cross-role disagreement before apply.",
      "Use simulation to sharpen the review packet.",
    ];
  }
  if (posture === "approval_gated") {
    return [
      "Request approval before stronger action.",
      "Run simulation first so approval has stronger evidence behind it.",
      "Do not apply until approval is resolved.",
    ];
  }
  if (posture === "compare_first") {
    return [
      "Compare the recommendation against one lower-risk alternative.",
      "Use the compare result to resolve the main trade-off.",
      "Return to governance once comparison is complete.",
    ];
  }
  if (posture === "simulation_first") {
    return [
      "Run simulation before stronger action.",
      "Use preview or compare if uncertainty remains high afterward.",
      "Capture the simulated outcome for later calibration.",
    ];
  }
  if (posture === "guarded") {
    return [
      "Proceed cautiously with preview, simulation, or compare.",
      "Strengthen the weakest evidence area before apply.",
      "Treat organization-memory warnings as a real caution signal.",
    ];
  }
  return [
    "Proceed with the clearest next action.",
    "Keep simulation and compare available as safety checks.",
    "Capture outcome feedback after action.",
  ];
}
