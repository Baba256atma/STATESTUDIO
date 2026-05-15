import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { OrganizationalResilienceSignal } from "../resilience/organizationalResilienceTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import type { AdaptationState } from "./enterpriseAdaptationTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function overlaps(ids: Set<string>, values: string[]): boolean {
  return values.some((value) => ids.has(value));
}

export function adaptationStateFromScore(score: number): AdaptationState {
  if (score >= 0.82) return "evolving";
  if (score >= 0.66) return "adaptive";
  if (score >= 0.48) return "adjusting";
  if (score >= 0.3) return "strained";
  return "rigid";
}

export function scoreEnterpriseFlexibility(params: {
  relatedObjectIds: string[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  resilienceSignals?: OrganizationalResilienceSignal[];
  driftSignals?: StrategicDriftSignal[];
  decisionReviews?: DecisionReviewRecord[];
}): {
  flexibilityScore: number;
  adaptationCapacity: number;
  coordinationAdaptability: number;
  adaptationState: AdaptationState;
  confidence: number;
} {
  const related = new Set(params.relatedObjectIds);
  const interventions = (params.interventions ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const coordination = (params.coordinationInsights ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const monitoring = (params.monitoringSignals ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const forecasts = (params.forecasts ?? []).filter((item) => overlaps(related, item.relatedObjectIds));
  const zones = (params.fragilityZones ?? []).filter((zone) => overlaps(related, zone.relatedObjectIds));
  const resilience = (params.resilienceSignals ?? []).filter((signal) => overlaps(related, signal.relatedObjectIds));
  const drift = (params.driftSignals ?? []).filter((signal) => overlaps(related, signal.relatedObjectIds));
  const reviews = (params.decisionReviews ?? []).filter((review) => overlaps(related, review.relatedObjectIds ?? []));

  const dependencyFlexibility = Math.max(0, ...interventions.map((item) =>
    item.category === "diversify" || item.category === "reduce_dependency" || item.category === "reduce_coupling"
      ? (item.propagationReductionPotential ?? 0.42) + 0.16
      : item.category === "rebalance_resources"
        ? 0.56
        : 0.28
  ));
  const coordinationAdaptability = coordination.length
    ? clamp01(1 - Math.max(0, ...coordination.map((item) => Math.max(item.coordinationComplexity ?? 0, item.synchronizationRisk ?? 0))) + 0.08)
    : 0.42;
  const monitoringResponsiveness = Math.max(0, ...monitoring.map((signal) => {
    if (signal.trend === "improving") return 0.82;
    if (signal.monitoringStatus === "stable") return 0.72;
    if (signal.monitoringStatus === "watch") return 0.5;
    if (signal.monitoringStatus === "elevated") return 0.28;
    return 0.16;
  }));
  const forecastAdaptation = Math.max(0, ...forecasts.map((forecast) => forecast.direction === "improving" ? 0.86 : forecast.direction === "stable" ? 0.62 : forecast.direction === "uncertain" ? 0.34 : 0.18));
  const resilienceCapacity = Math.max(0, ...resilience.map((signal) => Math.max(signal.adaptationCapacity ?? 0, signal.resilienceScore)));
  const reviewLearning = Math.max(0, ...reviews.map((review) => review.reviewStatus === "resolved" ? 0.74 : review.reviewStatus === "stabilized" ? 0.66 : review.reviewStatus === "monitoring" ? 0.42 : 0.22));
  const rigidityPenalty = Math.max(0, ...zones.map((zone) => Math.max(zone.propagationIntensity, zone.fragilityScore / 100, zone.systemicReach ?? 0))) * 0.22;
  const driftPenalty = Math.max(0, ...drift.map((signal) => signal.driftIntensity)) * 0.22;

  const adaptationCapacity = clamp01(
    dependencyFlexibility * 0.26 +
      coordinationAdaptability * 0.2 +
      monitoringResponsiveness * 0.16 +
      forecastAdaptation * 0.16 +
      resilienceCapacity * 0.16 +
      reviewLearning * 0.06
  );
  const flexibilityScore = clamp01(
    adaptationCapacity * 0.58 +
      dependencyFlexibility * 0.16 +
      coordinationAdaptability * 0.14 +
      monitoringResponsiveness * 0.12 -
      rigidityPenalty -
      driftPenalty
  );
  const evidenceCount = interventions.length + coordination.length + monitoring.length + forecasts.length + zones.length + resilience.length + drift.length + reviews.length;

  return {
    flexibilityScore,
    adaptationCapacity,
    coordinationAdaptability,
    adaptationState: adaptationStateFromScore(flexibilityScore),
    confidence: clamp01(Math.min(0.94, 0.22 + Math.min(1, evidenceCount / 6) * 0.44 + Math.max(adaptationCapacity, flexibilityScore) * 0.28)),
  };
}
