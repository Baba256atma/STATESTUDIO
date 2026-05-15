import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

export function deriveAdaptationCapacity(params: {
  relatedObjectIds: string[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  confidenceSignals?: DecisionConfidence[];
  strategicMemory?: StrategicMemoryRecord[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const interventions = (params.interventions ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const coordination = (params.coordinationInsights ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const monitoring = (params.monitoringSignals ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const forecasts = (params.forecasts ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const memory = (params.strategicMemory ?? []).filter((item) => overlaps(related, item.relatedObjectIds));

  const diversification = interventions.some((item) => item.category === "diversify" || item.category === "reduce_coupling" || item.category === "reduce_dependency") ? 0.24 : 0;
  const visibility = interventions.some((item) => item.category === "increase_visibility" || item.category === "strengthen_monitoring") ? 0.16 : 0;
  const improvingForecast = forecasts.some((forecast) => forecast.direction === "improving") ? 0.18 : 0;
  const stableMonitoring = monitoring.some((signal) => signal.monitoringStatus === "stable" || signal.trend === "improving") ? 0.14 : 0;
  const coordinationQuality = Math.max(0, ...coordination.map((item) => 1 - Math.max(item.coordinationComplexity ?? 0, item.synchronizationRisk ?? 0))) * 0.14;
  const confidenceQuality = Math.max(0, ...(params.confidenceSignals ?? []).map((signal) => signal.confidenceScore ?? 0)) * 0.08;
  const recurringPressurePenalty = Math.min(0.22, memory.reduce((sum, item) => sum + Math.max(0, (item.recurrenceCount ?? 1) - 1) * 0.04, 0));

  return clamp01(0.18 + diversification + visibility + improvingForecast + stableMonitoring + coordinationQuality + confidenceQuality - recurringPressurePenalty);
}
