import type { ExecutiveCognitiveStage } from "./executiveCognitiveWorkflowTypes.ts";

export function labelForCognitiveStage(stage: ExecutiveCognitiveStage): string {
  switch (stage) {
    case "awareness":
      return "Signal Awareness";
    case "risk_interpretation":
      return "Risk Interpretation";
    case "strategic_framing":
      return "Strategic Framing";
    case "comparison":
      return "Scenario Comparison";
    case "decision_focus":
      return "Decision Focus";
    case "confidence_review":
      return "Confidence Review";
    case "monitoring":
      return "Monitoring";
  }
}

export function buildCognitiveStageSummary(params: {
  stage: ExecutiveCognitiveStage;
  focus?: string;
}): string {
  const focus = String(params.focus ?? "").trim();
  switch (params.stage) {
    case "awareness":
      return "Review the current signals before narrowing executive attention.";
    case "risk_interpretation":
      return focus
        ? `Interpret the operational risk around ${focus}.`
        : "Interpret the operational risk before moving into scenario framing.";
    case "strategic_framing":
      return focus
        ? `Frame ${focus} as the primary strategic operating theme.`
        : "Frame the dominant operating pressure before comparing alternatives.";
    case "comparison":
      return "Multiple strategic alternatives now require executive evaluation.";
    case "decision_focus":
      return focus
        ? `Focus executive judgment on ${focus}.`
        : "Focus executive judgment on the leading recommendation and reasoning path.";
    case "confidence_review":
      return "Review recommendation confidence and uncertainty before committing executive attention.";
    case "monitoring":
      return focus
        ? `Continue monitoring ${focus} for propagation drift.`
        : "Operational stability should continue to be monitored for propagation drift.";
  }
}
