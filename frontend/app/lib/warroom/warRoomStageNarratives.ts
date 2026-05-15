import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type { WarRoomFlowState, WarRoomStage } from "./warRoomFlowTypes.ts";

export function labelForWarRoomStage(stage: WarRoomStage): string {
  switch (stage) {
    case "signal_review":
      return "Signal Review";
    case "risk_analysis":
      return "Risk Analysis";
    case "scenario_review":
      return "Scenario Review";
    case "scenario_compare":
      return "Scenario Compare";
    case "recommendation_focus":
      return "Recommendation Focus";
    case "decision_focus":
      return "Decision Focus";
    case "monitoring":
      return "Monitoring";
  }
}

function scenarioTitle(scenario: DomainScenario | null | undefined): string | null {
  const title = String(scenario?.title ?? "").trim();
  return title.length ? title : null;
}

function insightTitle(insight: ExecutiveInsight | null | undefined): string | null {
  const title = String(insight?.title ?? "").trim();
  return title.length ? title : null;
}

export function describeWarRoomStage(params: {
  flow: Pick<WarRoomFlowState, "currentStage" | "recommendedFocus">;
  activeScenario?: DomainScenario | null;
  topInsight?: ExecutiveInsight | null;
  activeComparison?: ScenarioComparison | null;
}): string {
  const focus = String(params.flow.recommendedFocus ?? "").trim();
  const scenario = scenarioTitle(params.activeScenario);
  const insight = insightTitle(params.topInsight);
  const comparison = String(params.activeComparison?.comparisonTitle ?? "").trim();

  switch (params.flow.currentStage) {
    case "signal_review":
      return "Reviewing current system signals before narrowing executive attention.";
    case "risk_analysis":
      return insight
        ? `Current focus is operational risk assessment around ${insight}.`
        : "Current focus is operational risk assessment.";
    case "scenario_review":
      return scenario
        ? `Reviewing the executive scenario: ${scenario}.`
        : "Reviewing available strategic scenarios.";
    case "scenario_compare":
      return comparison
        ? `Comparing strategic alternatives through ${comparison}.`
        : "Comparing strategic alternatives and visible tradeoffs.";
    case "recommendation_focus":
      return focus
        ? `Recommendation focus is ${focus}.`
        : "Focusing the strongest current recommendation before decision framing.";
    case "decision_focus":
      return focus
        ? `Decision focus is ${focus}.`
        : "Framing the executive decision and the evidence behind it.";
    case "monitoring":
      return focus
        ? `Monitoring ${focus}.`
        : "Monitoring execution stability and propagation movement.";
  }
}

export function buildWarRoomDecisionFocus(params: {
  flow: WarRoomFlowState;
  insights?: ExecutiveInsight[];
  comparisons?: ScenarioComparison[];
  scenarios?: DomainScenario[];
}): string {
  const explicitFocus = String(params.flow.recommendedFocus ?? "").trim();
  if (explicitFocus.length) return explicitFocus;

  const topInsight = (params.insights ?? [])[0];
  if (topInsight?.recommendedFocus) return topInsight.recommendedFocus;
  if (topInsight?.title) return topInsight.title;

  const comparison = (params.comparisons ?? []).find((item) => item.recommendedScenarioId) ?? (params.comparisons ?? [])[0];
  if (comparison?.recommendedScenarioId) {
    const scenario = (params.scenarios ?? []).find((item) => item.id === comparison.recommendedScenarioId);
    return scenario?.recommendedFocus ?? scenario?.title ?? "Validate the leading strategic alternative";
  }

  const scenario = (params.scenarios ?? []).find((item) => item.id === params.flow.activeScenarioId) ?? (params.scenarios ?? [])[0];
  return scenario?.recommendedFocus ?? scenario?.title ?? "Maintain executive review cadence";
}
