import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type { WarRoomFlowState, WarRoomStage } from "./warRoomFlowTypes.ts";

const STAGE_WEIGHT: Record<WarRoomStage, number> = {
  signal_review: 1,
  risk_analysis: 2,
  scenario_review: 3,
  scenario_compare: 4,
  recommendation_focus: 5,
  decision_focus: 6,
  monitoring: 7,
};

export function hasActiveComparisonContext(params: {
  comparisons?: ScenarioComparison[];
  comparedScenarioIds?: string[] | null;
  activePanelId?: string | null;
}): boolean {
  const panel = String(params.activePanelId ?? "").toLowerCase();
  if (panel.includes("compare") || panel.includes("comparison")) return true;
  if ((params.comparedScenarioIds ?? []).filter(Boolean).length >= 2) return true;
  return (params.comparisons ?? []).length > 0;
}

export function hasRecommendationContext(params: {
  comparisons?: ScenarioComparison[];
  insights?: ExecutiveInsight[];
  recommendationScenarioId?: string | null;
  activePanelId?: string | null;
}): boolean {
  const panel = String(params.activePanelId ?? "").toLowerCase();
  if (panel.includes("recommend") || panel.includes("advice")) return true;
  if (String(params.recommendationScenarioId ?? "").trim()) return true;
  return (params.comparisons ?? []).some((item) => String(item.recommendedScenarioId ?? "").trim());
}

export function hasDecisionContext(params: {
  selectedInsightId?: string | null;
  activePanelId?: string | null;
}): boolean {
  const panel = String(params.activePanelId ?? "").toLowerCase();
  return Boolean(
    String(params.selectedInsightId ?? "").trim() ||
      panel.includes("decision") ||
      panel.includes("executive")
  );
}

export function deriveCandidateWarRoomStage(params: {
  scenarios?: DomainScenario[];
  comparisons?: ScenarioComparison[];
  insights?: ExecutiveInsight[];
  activeScenarioId?: string | null;
  comparedScenarioIds?: string[] | null;
  selectedInsightId?: string | null;
  selectedObjectId?: string | null;
  activePanelId?: string | null;
  recommendationScenarioId?: string | null;
  monitoringActive?: boolean;
}): WarRoomStage {
  const panel = String(params.activePanelId ?? "").toLowerCase();
  const insights = params.insights ?? [];
  const topInsight = insights[0] ?? null;
  const scenarios = params.scenarios ?? [];

  if (params.monitoringActive || panel.includes("monitor") || panel.includes("execution")) return "monitoring";
  if (hasDecisionContext(params)) return "decision_focus";
  if (hasActiveComparisonContext(params)) return "scenario_compare";
  if (hasRecommendationContext(params)) return "recommendation_focus";
  if (String(params.activeScenarioId ?? "").trim() || scenarios.length > 0 || panel.includes("scenario") || panel.includes("war")) {
    return "scenario_review";
  }
  if (
    panel.includes("risk") ||
    topInsight?.severity === "critical" ||
    (topInsight?.severity === "high" && topInsight.priorityScore >= 70)
  ) {
    return "risk_analysis";
  }
  return "signal_review";
}

export function stabilizeWarRoomStage(params: {
  previousState?: WarRoomFlowState | null;
  candidateStage: WarRoomStage;
  comparisons?: ScenarioComparison[];
  comparedScenarioIds?: string[] | null;
  scenarios?: DomainScenario[];
  activeScenarioId?: string | null;
  monitoringActive?: boolean;
}): WarRoomStage {
  const previous = params.previousState?.currentStage;
  if (!previous || previous === params.candidateStage) return params.candidateStage;
  if (params.monitoringActive) return "monitoring";

  const hasComparison = hasActiveComparisonContext({
    comparisons: params.comparisons,
    comparedScenarioIds: params.comparedScenarioIds,
  });
  if (previous === "scenario_compare" && hasComparison) return previous;

  const hasScenario = Boolean(String(params.activeScenarioId ?? "").trim() || (params.scenarios ?? []).length > 0);
  if (previous === "scenario_review" && hasScenario && STAGE_WEIGHT[params.candidateStage] < STAGE_WEIGHT.scenario_review) {
    return previous;
  }

  return params.candidateStage;
}
