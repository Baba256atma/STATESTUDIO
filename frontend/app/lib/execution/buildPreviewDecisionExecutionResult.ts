import type { DecisionExecutionResult } from "../executive/decisionExecutionTypes";
import type { DecisionExecutionIntent } from "./decisionExecutionIntent";

type BuildPreviewDecisionExecutionResultInput = {
  intent: DecisionExecutionIntent;
  responseData?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export function buildPreviewDecisionExecutionResult(
  input: BuildPreviewDecisionExecutionResultInput
): DecisionExecutionResult {
  const responseData = asRecord(input.responseData);
  const decisionSimulation = asRecord(responseData?.decision_simulation);
  const simulationImpact = asRecord(decisionSimulation?.impact);
  const decisionResult = asRecord(responseData?.decision_result);
  const simulationResult = asRecord(decisionResult?.simulation_result);
  const impactScore =
    Number(decisionSimulation?.confidence) ||
    Number(input.intent.confidence) ||
    0.64;
  const riskChange =
    Number(simulationImpact?.risk_change) ||
    Number(simulationResult?.risk_change) ||
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
