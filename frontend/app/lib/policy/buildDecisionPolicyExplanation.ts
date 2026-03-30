import type { DecisionPolicyContext } from "./buildDecisionPolicyContext";
import type { DecisionPolicyPosture } from "./decisionPolicyTypes";

export function buildDecisionPolicyExplanation(params: {
  posture: DecisionPolicyPosture;
  context: DecisionPolicyContext;
  drivers: string[];
}): string {
  if (params.posture === "restricted") {
    return "This decision is currently restricted because the environment or control conditions do not support stronger action.";
  }
  if (params.posture === "executive_review") {
    return "This decision is currently in executive-review posture because risk is material and team alignment is not strong enough for direct progression.";
  }
  if (params.posture === "approval_gated") {
    return "This decision is approval-gated because confidence and evidence are not strong enough to justify stronger action without review.";
  }
  if (params.posture === "compare_first") {
    return "This decision is currently compare-first because trade-offs and warning signals remain material.";
  }
  if (params.posture === "simulation_first") {
    return "This decision is currently simulation-first because uncertainty and downstream exposure still need validation before stronger action.";
  }
  if (params.posture === "guarded") {
    return "This decision remains guarded because confidence, calibration, or organizational memory still support caution.";
  }
  return "This decision is currently permissive because evidence, confidence, and risk posture do not force a stronger control posture.";
}
