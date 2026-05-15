import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import type { ResilienceState } from "./organizationalResilienceTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

function pressureFromZone(zone: EnterpriseFragilityZone): number {
  return Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0);
}

export function resilienceStateFromScore(score: number): ResilienceState {
  if (score >= 0.82) return "resilient";
  if (score >= 0.66) return "adaptive";
  if (score >= 0.5) return "stable";
  if (score >= 0.34) return "recovering";
  return "fragile";
}

export function scoreOrganizationalResilience(params: {
  relatedObjectIds: string[];
  recoveryCapacity?: number;
  adaptationCapacity?: number;
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  strategicMemory?: StrategicMemoryRecord[];
  decisionReviews?: DecisionReviewRecord[];
  driftSignals?: StrategicDriftSignal[];
}): {
  resilienceScore: number;
  recoveryCapacity: number;
  adaptationCapacity: number;
  resilienceState: ResilienceState;
  confidence: number;
} {
  const related = new Set(params.relatedObjectIds);
  const interventions = (params.interventions ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const monitoring = (params.monitoringSignals ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const forecasts = (params.forecasts ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const zones = (params.fragilityZones ?? []).filter((zone) => overlaps(related, zone.relatedObjectIds));
  const coordination = (params.coordinationInsights ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const reviews = (params.decisionReviews ?? []).filter((item) => overlaps(related, item.relatedObjectIds ?? []));
  const drift = (params.driftSignals ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const memory = (params.strategicMemory ?? []).filter((item) => overlaps(related, item.relatedObjectIds));

  const monitoringQuality = Math.max(0, ...monitoring.map((signal) => {
    if (signal.monitoringStatus === "stable" || signal.trend === "improving") return 0.86;
    if (signal.monitoringStatus === "watch" || signal.trend === "stable") return 0.58;
    if (signal.monitoringStatus === "elevated") return 0.34;
    return 0.14;
  }));
  const forecastQuality = Math.max(0, ...forecasts.map((forecast) => {
    if (forecast.direction === "improving") return 0.9;
    if (forecast.direction === "stable") return 0.72;
    if (forecast.direction === "uncertain") return 0.4;
    if (forecast.direction === "volatile") return 0.24;
    return 0.16;
  }));
  const reviewQuality = Math.max(0, ...reviews.map((review) => review.reviewStatus === "resolved" ? 0.88 : review.reviewStatus === "stabilized" ? 0.78 : review.reviewStatus === "monitoring" ? 0.52 : 0.28));
  const interventionQuality = Math.max(0, ...interventions.map((item) => {
    const priorityLoad = item.priority === "critical" ? 0.18 : item.priority === "high" ? 0.14 : item.priority === "medium" ? 0.08 : 0.04;
    return clamp01((item.propagationReductionPotential ?? 0.35) + priorityLoad);
  }));
  const fragilityPenalty = Math.max(0, ...zones.map(pressureFromZone)) * 0.38;
  const coordinationPenalty = Math.max(0, ...coordination.map((item) => Math.max(item.coordinationComplexity ?? 0, item.synchronizationRisk ?? 0))) * 0.18;
  const driftPenalty = Math.max(0, ...drift.map((item) => item.driftIntensity)) * 0.22;
  const memoryPenalty = Math.min(0.18, memory.reduce((sum, item) => sum + Math.max(0, (item.recurrenceCount ?? 1) - 1) * 0.03, 0));

  const recoveryCapacity = clamp01(params.recoveryCapacity ?? (monitoringQuality * 0.28 + forecastQuality * 0.24 + reviewQuality * 0.22 + interventionQuality * 0.26));
  const adaptationCapacity = clamp01(params.adaptationCapacity ?? 0.35);
  const resilienceScore = clamp01(
    recoveryCapacity * 0.36 +
      adaptationCapacity * 0.3 +
      monitoringQuality * 0.12 +
      forecastQuality * 0.12 +
      interventionQuality * 0.1 -
      fragilityPenalty -
      coordinationPenalty -
      driftPenalty -
      memoryPenalty
  );
  const evidenceCount = interventions.length + monitoring.length + forecasts.length + zones.length + coordination.length + reviews.length + drift.length + memory.length;

  return {
    resilienceScore,
    recoveryCapacity,
    adaptationCapacity,
    resilienceState: resilienceStateFromScore(resilienceScore),
    confidence: clamp01(Math.min(0.94, 0.24 + Math.min(1, evidenceCount / 6) * 0.42 + Math.max(recoveryCapacity, adaptationCapacity) * 0.28)),
  };
}
