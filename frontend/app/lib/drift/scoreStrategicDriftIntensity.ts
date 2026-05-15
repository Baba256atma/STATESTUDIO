import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { StabilityBaseline, StrategicDriftType } from "./strategicDriftTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

function severityLoad(value: string | undefined): number {
  if (value === "critical") return 1;
  if (value === "high") return 0.78;
  if (value === "medium") return 0.48;
  if (value === "low") return 0.22;
  return 0;
}

function forecastLoad(forecast: ExecutiveStabilityForecast): number {
  if (forecast.direction === "degrading") return 0.92;
  if (forecast.direction === "volatile") return 0.78;
  if (forecast.direction === "uncertain") return 0.46;
  if (forecast.direction === "stable") return 0.14;
  return 0;
}

function monitoringLoad(signal: ExecutiveMonitoringSignal): number {
  const status = signal.monitoringStatus === "critical" ? 1 :
    signal.monitoringStatus === "elevated" ? 0.76 :
    signal.monitoringStatus === "watch" ? 0.42 : 0.08;
  const trend = signal.trend === "degrading" ? 0.24 :
    signal.trend === "volatile" ? 0.18 :
    signal.trend === "improving" ? -0.12 : 0;
  return clamp01(status + trend);
}

export function calculateStabilityDeviation(params: {
  baseline?: StabilityBaseline | null;
  currentPressure: number;
}): number {
  const baselineScore = params.baseline?.stabilityScore ?? 0.35;
  return clamp01(params.currentPressure - (1 - baselineScore) * 0.45);
}

export function scoreStrategicDriftIntensity(params: {
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
  baseline?: StabilityBaseline | null;
  forecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  strategicMemory?: StrategicMemoryRecord[];
}): {
  driftIntensity: number;
  stabilityDeviation: number;
  confidence: number;
} {
  const related = new Set(params.relatedObjectIds);
  const relevantForecasts = (params.forecasts ?? []).filter((forecast) => overlaps(related, forecast.relatedObjectIds));
  const relevantMonitoring = (params.monitoringSignals ?? []).filter((signal) => overlaps(related, signal.relatedObjectIds));
  const relevantZones = (params.fragilityZones ?? []).filter((zone) => overlaps(related, zone.relatedObjectIds));
  const relevantInterventions = (params.interventions ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const relevantCoordination = (params.coordinationInsights ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const relevantMemory = (params.strategicMemory ?? []).filter((item) => overlaps(related, item.relatedObjectIds));

  const forecastPressure = Math.max(0, ...relevantForecasts.map(forecastLoad));
  const monitoringPressure = Math.max(0, ...relevantMonitoring.map(monitoringLoad));
  const fragilityPressure = Math.max(0, ...relevantZones.map((zone) => Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0)));
  const coordinationPressure = Math.max(0, ...relevantCoordination.map((item) => Math.max(item.coordinationComplexity ?? 0, item.synchronizationRisk ?? 0)));
  const interventionPressure = Math.max(0, ...relevantInterventions.map((item) => {
    const priority = severityLoad(item.priority);
    const lowRelief = 1 - (item.propagationReductionPotential ?? 0.35);
    return clamp01(priority * 0.62 + lowRelief * 0.38);
  }));
  const recurrencePressure = Math.max(0, ...relevantMemory.map((item) => Math.min(1, (item.recurrenceCount ?? 1) / 4) * severityLoad(item.severity)));

  const typeWeight = params.driftType === "propagation_expansion" ? fragilityPressure * 0.18 :
    params.driftType === "coordination_decay" ? coordinationPressure * 0.2 :
    params.driftType === "monitoring_gap" ? monitoringPressure * 0.2 :
    params.driftType === "intervention_decay" ? interventionPressure * 0.2 :
    params.driftType === "confidence_erosion" ? forecastPressure * 0.12 + monitoringPressure * 0.08 :
    params.driftType === "fragility_reemergence" ? recurrencePressure * 0.14 + fragilityPressure * 0.08 :
    forecastPressure * 0.18;

  const currentPressure = clamp01(
    forecastPressure * 0.22 +
      monitoringPressure * 0.18 +
      fragilityPressure * 0.2 +
      coordinationPressure * 0.12 +
      interventionPressure * 0.1 +
      recurrencePressure * 0.1 +
      typeWeight
  );
  const stabilityDeviation = calculateStabilityDeviation({
    baseline: params.baseline,
    currentPressure,
  });
  const baselineConfidence = params.baseline ? Math.max(params.baseline.baselineStrength, params.baseline.stabilityScore) : 0.36;
  const evidenceCount = relevantForecasts.length + relevantMonitoring.length + relevantZones.length + relevantInterventions.length + relevantCoordination.length + relevantMemory.length;

  return {
    driftIntensity: clamp01(currentPressure * 0.72 + stabilityDeviation * 0.28),
    stabilityDeviation,
    confidence: clamp01(Math.min(0.94, baselineConfidence * 0.34 + Math.min(1, evidenceCount / 5) * 0.36 + currentPressure * 0.3)),
  };
}
