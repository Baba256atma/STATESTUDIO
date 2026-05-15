import type { DomainScenarioComparison } from "../domain/domainScenarioComparison.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function average(values: number[], fallback: number): number {
  if (!values.length) return fallback;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function timelineStability(item: TimelineIntelligence): number {
  const trend =
    item.trend === "improving" ? 0.82 :
    item.trend === "stable" ? 0.74 :
    item.trend === "degrading" ? 0.48 :
    item.trend === "critical" ? 0.42 :
    0.32;
  return clamp01(trend * 0.52 + item.confidence * 0.48);
}

function memoryEvidence(record: StrategicMemoryRecord): number {
  const recurrence = Math.min(1, (record.recurrenceCount ?? 1) / 4);
  const confidence = record.confidence ?? 0.45;
  const severityPenalty = record.severity === "critical" ? 0.12 : record.severity === "high" ? 0.06 : 0;
  return clamp01(confidence * 0.62 + recurrence * 0.38 - severityPenalty);
}

function monitoringStability(signal: ExecutiveMonitoringSignal): number {
  const status =
    signal.monitoringStatus === "stable" ? 0.82 :
    signal.monitoringStatus === "watch" ? 0.66 :
    signal.monitoringStatus === "elevated" ? 0.48 :
    0.34;
  const trendPenalty = signal.trend === "volatile" ? 0.14 : signal.trend === "degrading" ? 0.08 : 0;
  return clamp01(status * 0.55 + signal.confidence * 0.45 - trendPenalty);
}

function comparisonEvidence(comparison: ScenarioComparison | DomainScenarioComparison): number {
  if ("confidenceDelta" in comparison) {
    const separation = Math.min(1, Math.abs(comparison.confidenceDelta) / 24);
    const stability = comparison.recommendedScenarioId ? 0.62 : 0.42;
    return clamp01(stability + separation * 0.3);
  }
  return comparison.recommendation ? 0.62 : 0.42;
}

export function scoreDecisionConfidence(params: {
  recommendation?: DecisionRecommendation | null;
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  scenarioComparisons?: Array<ScenarioComparison | DomainScenarioComparison>;
  uncertaintyFactors?: string[];
}): number {
  const recommendation = params.recommendation ?? null;
  const recommendationSignal = recommendation?.confidence ?? 0.45;
  const timelines = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence.map(timelineStability) : [];
  const memory = Array.isArray(params.strategicMemory) ? params.strategicMemory.map(memoryEvidence) : [];
  const insights = Array.isArray(params.executiveInsights) ? params.executiveInsights.map((insight) => insight.confidence) : [];
  const monitoring = Array.isArray(params.monitoringSignals) ? params.monitoringSignals.map(monitoringStability) : [];
  const comparisons = Array.isArray(params.scenarioComparisons) ? params.scenarioComparisons.map(comparisonEvidence) : [];
  const evidence = [
    recommendationSignal,
    average(timelines, 0.5),
    average(memory, 0.5),
    average(insights, 0.5),
    average(monitoring, 0.5),
    average(comparisons, 0.5),
  ];
  const coverage = [recommendation, timelines.length, memory.length, insights.length, monitoring.length, comparisons.length]
    .filter(Boolean).length;
  const uncertaintyPenalty = Math.min(0.22, (params.uncertaintyFactors?.length ?? 0) * 0.055);
  const coverageBonus = Math.min(0.12, coverage * 0.02);
  return Math.round(clamp01(average(evidence, 0.45) + coverageBonus - uncertaintyPenalty) * 100) / 100;
}
