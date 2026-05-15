import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import { describeWarRoomStage } from "./warRoomStageNarratives.ts";
import {
  deriveCandidateWarRoomStage,
  stabilizeWarRoomStage,
} from "./warRoomFlowTransitions.ts";
import type { WarRoomFlowState, WarRoomStage } from "./warRoomFlowTypes.ts";

const DETERMINISTIC_UPDATED_AT = 0;

function normalizeId(value: unknown): string | undefined {
  const next = String(value ?? "").trim();
  return next.length ? next : undefined;
}

function uniqueIds(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const id = normalizeId(value);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function severityRank(severity: ExecutiveInsight["severity"]): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function sortInsights(insights: ExecutiveInsight[]): ExecutiveInsight[] {
  return insights.slice().sort((left, right) => {
    if (right.priorityScore !== left.priorityScore) return right.priorityScore - left.priorityScore;
    const severityDelta = severityRank(right.severity) - severityRank(left.severity);
    if (severityDelta !== 0) return severityDelta;
    if (right.confidence !== left.confidence) return right.confidence - left.confidence;
    return left.id.localeCompare(right.id);
  });
}

function activeScenarioFor(params: {
  scenarios: DomainScenario[];
  activeScenarioId?: string;
  comparison?: ScenarioComparison | null;
  recommendationScenarioId?: string;
}): DomainScenario | null {
  if (params.activeScenarioId) {
    return params.scenarios.find((item) => item.id === params.activeScenarioId) ?? null;
  }
  if (params.recommendationScenarioId) {
    return params.scenarios.find((item) => item.id === params.recommendationScenarioId) ?? null;
  }
  if (params.comparison?.recommendedScenarioId) {
    return params.scenarios.find((item) => item.id === params.comparison?.recommendedScenarioId) ?? null;
  }
  return params.scenarios[0] ?? null;
}

function comparedIdsFor(params: {
  comparedScenarioIds?: string[] | null;
  comparison?: ScenarioComparison | null;
}): string[] {
  const explicit = uniqueIds(params.comparedScenarioIds ?? []);
  if (explicit.length) return explicit;
  if (!params.comparison) return [];
  return uniqueIds([params.comparison.scenarioAId, params.comparison.scenarioBId]);
}

function recommendedFocusFor(params: {
  stage: WarRoomStage;
  topInsight: ExecutiveInsight | null;
  activeScenario: DomainScenario | null;
  comparison: ScenarioComparison | null;
  recommendationScenarioId?: string;
  scenarios: DomainScenario[];
}): string | undefined {
  if (params.stage === "scenario_compare" && params.comparison) {
    const recommendedId = params.comparison.recommendedScenarioId;
    const recommendedScenario = recommendedId
      ? params.scenarios.find((scenario) => scenario.id === recommendedId)
      : null;
    return recommendedScenario?.recommendedFocus ??
      recommendedScenario?.title ??
      params.comparison.tradeoffs[0] ??
      "Compare scenario tradeoffs";
  }
  if (params.stage === "recommendation_focus") {
    const recommendedScenario = params.recommendationScenarioId
      ? params.scenarios.find((scenario) => scenario.id === params.recommendationScenarioId)
      : null;
    return recommendedScenario?.recommendedFocus ??
      recommendedScenario?.title ??
      params.topInsight?.recommendedFocus ??
      params.topInsight?.title ??
      "Validate the leading recommendation";
  }
  if (params.stage === "decision_focus") {
    return params.topInsight?.recommendedFocus ?? params.topInsight?.title ?? "Frame the executive decision";
  }
  if (params.stage === "monitoring") {
    return params.activeScenario?.recommendedFocus ?? params.topInsight?.recommendedFocus ?? "Track execution stability";
  }
  return params.activeScenario?.recommendedFocus ??
    params.activeScenario?.title ??
    params.topInsight?.recommendedFocus ??
    params.topInsight?.title;
}

function logWarRoomFlow(params: {
  flow: WarRoomFlowState;
  previousStage?: WarRoomStage;
  debug?: boolean;
}): void {
  if (!params.debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][WarRoomFlow]", {
    currentStage: params.flow.currentStage,
    activeScenario: params.flow.activeScenarioId ?? null,
    focus: params.flow.recommendedFocus ?? null,
    recommendation: params.flow.recommendedFocus ?? null,
    stageTransition: params.previousStage && params.previousStage !== params.flow.currentStage
      ? `${params.previousStage}->${params.flow.currentStage}`
      : "stable",
  });
}

export function deriveWarRoomFlow(params: {
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
  previousState?: WarRoomFlowState | null;
  now?: number;
  debug?: boolean;
}): WarRoomFlowState {
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios.slice() : [];
  const comparisons = Array.isArray(params.comparisons) ? params.comparisons.slice() : [];
  const insights = sortInsights(Array.isArray(params.insights) ? params.insights : []);
  const topInsight = insights[0] ?? null;
  const selectedInsightId = normalizeId(params.selectedInsightId) ?? topInsight?.id;
  const activeComparison = comparisons[0] ?? null;
  const recommendationScenarioId =
    normalizeId(params.recommendationScenarioId) ??
    normalizeId(activeComparison?.recommendedScenarioId);

  const candidateStage = deriveCandidateWarRoomStage({
    scenarios,
    comparisons,
    insights,
    activeScenarioId: params.activeScenarioId,
    comparedScenarioIds: params.comparedScenarioIds,
    selectedInsightId: params.selectedInsightId,
    selectedObjectId: params.selectedObjectId,
    activePanelId: params.activePanelId,
    recommendationScenarioId,
    monitoringActive: params.monitoringActive,
  });
  const currentStage = stabilizeWarRoomStage({
    previousState: params.previousState,
    candidateStage,
    comparisons,
    comparedScenarioIds: params.comparedScenarioIds,
    scenarios,
    activeScenarioId: params.activeScenarioId,
    monitoringActive: params.monitoringActive,
  });
  const activeScenario = activeScenarioFor({
    scenarios,
    activeScenarioId: normalizeId(params.activeScenarioId),
    comparison: activeComparison,
    recommendationScenarioId,
  });
  const comparedScenarioIds = comparedIdsFor({
    comparedScenarioIds: params.comparedScenarioIds,
    comparison: activeComparison,
  });
  const recommendedFocus = recommendedFocusFor({
    stage: currentStage,
    topInsight,
    activeScenario,
    comparison: activeComparison,
    recommendationScenarioId,
    scenarios,
  });

  const partialFlow: WarRoomFlowState = {
    currentStage,
    ...(activeScenario?.id ? { activeScenarioId: activeScenario.id } : {}),
    ...(comparedScenarioIds.length ? { comparedScenarioIds } : {}),
    ...(selectedInsightId ? { selectedInsightId } : {}),
    ...(recommendedFocus ? { recommendedFocus } : {}),
    updatedAt: typeof params.now === "number" ? params.now : DETERMINISTIC_UPDATED_AT,
  };

  const executiveSummary = describeWarRoomStage({
    flow: partialFlow,
    activeScenario,
    topInsight,
    activeComparison,
  });
  const flow = {
    ...partialFlow,
    executiveSummary,
  };

  logWarRoomFlow({
    flow,
    previousStage: params.previousState?.currentStage,
    debug: params.debug,
  });

  return flow;
}
