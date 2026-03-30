import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { DecisionExecutionIntent } from "./decisionExecutionIntent";

type BuildPreviewDecisionExecutionResultInput = {
  intent: DecisionExecutionIntent;
  responseData?: any | null;
};

export function buildPreviewDecisionExecutionResult(
  input: BuildPreviewDecisionExecutionResultInput
): DecisionExecutionResult {
  const impactScore =
    Number(input.responseData?.decision_simulation?.confidence) ||
    Number(input.intent.confidence) ||
    0.64;
  const riskChange =
    Number(input.responseData?.decision_simulation?.impact?.risk_change) ||
    Number(input.responseData?.decision_result?.simulation_result?.risk_change) ||
    -0.08;

  return {
    simulation_result: {
      impact_score: Number.isFinite(impactScore) ? impactScore : 0.64,
      risk_change: Number.isFinite(riskChange) ? riskChange : -0.08,
      kpi_effects: [],
      affected_objects: input.intent.target_ids,
    },
    comparison: [],
    scene_actions: {
      highlight: input.intent.target_ids,
      dim: [],
    },
  };
}
