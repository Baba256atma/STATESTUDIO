import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import { deriveAdaptationCapacity } from "./deriveAdaptationCapacity.ts";
import type { ResilienceCluster } from "./organizationalResilienceTypes.ts";
import { scoreOrganizationalResilience } from "./scoreOrganizationalResilience.ts";

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function addCluster(map: Map<string, string[]>, objectIds: string[]): void {
  const normalized = unique(objectIds).sort();
  if (!normalized.length) return;
  const key = normalized.slice(0, 4).join("|");
  map.set(key, unique([...(map.get(key) ?? []), ...normalized]));
}

export function detectResilienceClusters(params: {
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  decisionReviews?: DecisionReviewRecord[];
  confidenceSignals?: DecisionConfidence[];
  strategicMemory?: StrategicMemoryRecord[];
  driftSignals?: StrategicDriftSignal[];
}): ResilienceCluster[] {
  const clusterMap = new Map<string, string[]>();

  for (const forecast of params.forecasts ?? []) {
    if (forecast.direction === "improving" || forecast.direction === "stable") addCluster(clusterMap, forecast.relatedObjectIds);
  }
  for (const signal of params.monitoringSignals ?? []) {
    if (signal.monitoringStatus === "stable" || signal.trend === "improving") addCluster(clusterMap, signal.relatedObjectIds);
  }
  for (const intervention of params.interventions ?? []) {
    if ((intervention.propagationReductionPotential ?? 0) >= 0.42 || intervention.priority === "high" || intervention.priority === "critical") addCluster(clusterMap, intervention.relatedObjectIds);
  }
  for (const review of params.decisionReviews ?? []) {
    if (review.reviewStatus === "stabilized" || review.reviewStatus === "resolved") addCluster(clusterMap, review.relatedObjectIds ?? []);
  }
  for (const zone of params.fragilityZones ?? []) {
    if (zone.propagationIntensity <= 0.35 || zone.fragilityScore <= 45) addCluster(clusterMap, zone.relatedObjectIds);
  }

  return Array.from(clusterMap.values()).map((relatedObjectIds): ResilienceCluster => {
    const relatedZoneIds = unique((params.fragilityZones ?? [])
      .filter((zone) => zone.relatedObjectIds.some((id) => relatedObjectIds.includes(id)))
      .map((zone) => zone.id));
    const domainIds = unique([
      ...(params.forecasts ?? []).filter((item) => item.relatedObjectIds.some((id) => relatedObjectIds.includes(id))).flatMap((item) => item.domainIds ?? []),
      ...(params.fragilityZones ?? []).filter((item) => item.relatedObjectIds.some((id) => relatedObjectIds.includes(id))).flatMap((item) => item.domainIds ?? []),
      ...(params.interventions ?? []).filter((item) => item.relatedObjectIds.some((id) => relatedObjectIds.includes(id))).flatMap((item) => item.domainIds ?? []),
      ...(params.monitoringSignals ?? []).filter((item) => item.relatedObjectIds.some((id) => relatedObjectIds.includes(id))).map((item) => item.domainId),
    ]);
    const adaptationCapacity = deriveAdaptationCapacity({
      relatedObjectIds,
      interventions: params.interventions,
      coordinationInsights: params.coordinationInsights,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
      confidenceSignals: params.confidenceSignals,
      strategicMemory: params.strategicMemory,
    });
    const scored = scoreOrganizationalResilience({
      relatedObjectIds,
      adaptationCapacity,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
      fragilityZones: params.fragilityZones,
      coordinationInsights: params.coordinationInsights,
      strategicMemory: params.strategicMemory,
      decisionReviews: params.decisionReviews,
      driftSignals: params.driftSignals,
    });
    return {
      id: `resilience_cluster_${normalizeIdPart(relatedObjectIds.join("_"))}`,
      relatedObjectIds,
      relatedZoneIds,
      domainIds,
      resilienceScore: scored.resilienceScore,
      recoveryCapacity: scored.recoveryCapacity,
      adaptationCapacity: scored.adaptationCapacity,
    };
  }).sort((left, right) => {
    if (right.resilienceScore !== left.resilienceScore) return right.resilienceScore - left.resilienceScore;
    return left.id.localeCompare(right.id);
  });
}
