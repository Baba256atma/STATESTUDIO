import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function uniqueCount(values: unknown[]): number {
  return new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)).size;
}

export function scoreCoordinationComplexity(params: {
  relatedObjectIds: string[];
  relatedDomainIds?: string[];
  crossDomainInsights?: CrossDomainInsight[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  recommendations?: DecisionRecommendation[];
  decisionGraph?: StrategicDecisionGraph | null;
}): number {
  const related = new Set(params.relatedObjectIds);
  const objectLoad = Math.min(1, uniqueCount(params.relatedObjectIds) / 5);
  const domainLoad = Math.min(1, uniqueCount(params.relatedDomainIds ?? []) / 3);
  const crossDomainLoad = Math.min(1, (params.crossDomainInsights ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id))).length / 3);
  const zoneLoad = Math.min(1, (params.fragilityZones ?? []).filter((zone) => zone.relatedObjectIds.some((id) => related.has(id))).length / 3);
  const interventionLoad = Math.min(1, (params.interventions ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id))).length / 3);
  const monitoringOverlap = Math.min(1, (params.monitoringSignals ?? []).filter((item) => item.relatedObjectIds.some((id) => related.has(id))).length / 3);
  const recommendationLoad = Math.min(1, (params.recommendations ?? []).filter((item) => item.affectedObjectIds.some((id) => related.has(id))).length / 3);
  const graphDensity = params.decisionGraph ? Math.min(1, params.decisionGraph.edges.length / Math.max(1, params.decisionGraph.nodes.length * 2)) : 0;

  return clamp01(
    objectLoad * 0.18 +
      domainLoad * 0.18 +
      crossDomainLoad * 0.15 +
      zoneLoad * 0.13 +
      interventionLoad * 0.12 +
      monitoringOverlap * 0.1 +
      recommendationLoad * 0.08 +
      graphDensity * 0.06
  );
}
