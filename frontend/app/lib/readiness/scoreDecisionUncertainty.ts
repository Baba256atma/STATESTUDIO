import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

export function scoreMonitoringMaturity(params: {
  relatedObjectIds: string[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const signals = (params.monitoringSignals ?? []).filter((signal) => overlaps(related, signal.relatedObjectIds));
  if (!signals.length) return 0.18;
  const score = signals.reduce((sum, signal) => {
    const status = signal.monitoringStatus === "stable" ? 0.86 :
      signal.monitoringStatus === "watch" ? 0.62 :
      signal.monitoringStatus === "elevated" ? 0.36 : 0.18;
    const trend = signal.trend === "improving" ? 0.1 :
      signal.trend === "stable" ? 0.04 :
      signal.trend === "degrading" ? -0.18 :
      signal.trend === "volatile" ? -0.24 : 0;
    return sum + clamp01(status + trend);
  }, 0) / signals.length;
  return clamp01(score);
}

export function scoreCoordinationReadiness(params: {
  relatedObjectIds: string[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const insights = (params.coordinationInsights ?? []).filter((insight) => overlaps(related, insight.relatedObjectIds));
  if (!insights.length) return 0.46;
  const highestPressure = Math.max(0, ...insights.map((insight) => Math.max(insight.coordinationComplexity ?? 0, insight.synchronizationRisk ?? 0)));
  return clamp01(1 - highestPressure);
}

export function scoreDecisionUncertainty(params: {
  relatedObjectIds: string[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  driftSignals?: StrategicDriftSignal[];
}): number {
  const related = new Set(params.relatedObjectIds);
  const confidenceSignals = params.confidenceSignals ?? [];
  const forecasts = (params.forecasts ?? []).filter((forecast) => overlaps(related, forecast.relatedObjectIds));
  const zones = (params.fragilityZones ?? []).filter((zone) => overlaps(related, zone.relatedObjectIds));
  const drift = (params.driftSignals ?? []).filter((signal) => overlaps(related, signal.relatedObjectIds));
  const confidencePressure = confidenceSignals.length
    ? 1 - Math.max(0, ...confidenceSignals.map((signal) => signal.confidenceScore))
    : 0.44;
  const uncertaintyFactorPressure = Math.min(1, confidenceSignals.flatMap((signal) => signal.uncertaintyFactors ?? []).length / 4);
  const forecastVolatility = Math.max(0, ...forecasts.map((forecast) => forecast.direction === "volatile" ? 0.86 : forecast.direction === "uncertain" ? 0.72 : forecast.direction === "degrading" ? 0.58 : 0.14));
  const propagationPressure = Math.max(0, ...zones.map((zone) => Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0)));
  const driftPressure = Math.max(0, ...drift.map((signal) => signal.driftIntensity));
  const monitoringImmaturity = 1 - scoreMonitoringMaturity({
    relatedObjectIds: params.relatedObjectIds,
    monitoringSignals: params.monitoringSignals,
  });
  const coordinationGap = 1 - scoreCoordinationReadiness({
    relatedObjectIds: params.relatedObjectIds,
    coordinationInsights: params.coordinationInsights,
  });

  return clamp01(
    confidencePressure * 0.2 +
      uncertaintyFactorPressure * 0.14 +
      forecastVolatility * 0.16 +
      propagationPressure * 0.18 +
      driftPressure * 0.14 +
      monitoringImmaturity * 0.1 +
      coordinationGap * 0.08
  );
}
