import type { DecisionPipelineState } from "./decisionPipelineTypes";

export type DecisionPipelineSummary = {
  overview: string;
  expected: string;
  observed: string;
  confidenceChange: string;
  learning: string;
  nextMove: string;
};

function text(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function buildDecisionPipelineSummary(state: DecisionPipelineState): DecisionPipelineSummary {
  return {
    overview:
      text(state.recommendation?.primary?.action) ||
      text(state.reasoning?.trace?.selected_path_reason) ||
      "Nexora assembled a decision lifecycle view from the currently available evidence.",
    expected:
      text(state.recommendation?.primary?.impact_summary) ||
      text(state.simulation?.impact?.summary) ||
      "No expected outcome has been captured yet.",
    observed:
      text(state.outcome_feedback?.observed_summary) ||
      text(state.observed_outcome?.observed_summary) ||
      "No observed outcome evidence is available yet.",
    confidenceChange:
      state.calibration?.calibration_label
        ? `${state.calibration.calibration_label.replace(/_/g, " ")}${
            state.calibration.adjusted_confidence_level
              ? ` -> ${state.calibration.adjusted_confidence_level}`
              : ""
          }`
        : "Calibration pending",
    learning:
      text(state.pattern_context?.recommendation_hint) ||
      text(state.pattern_context?.top_failure_patterns?.[0]) ||
      text(state.pattern_context?.top_success_patterns?.[0]) ||
      "Pattern evidence is still limited.",
    nextMove:
      text(state.outcome_feedback?.guidance) ||
      text(state.pattern_context?.recommendation_hint) ||
      "Run simulation or compare alternatives before escalating the recommendation.",
  };
}
