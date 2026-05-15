import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import {
  buildAlignmentGuidance,
  buildCoordinationExecutiveImpact,
  buildCoordinationSummary,
  buildCoordinationTitle,
} from "./coordinationNarratives.ts";
import { deriveSynchronizationRisk } from "./deriveSynchronizationRisk.ts";
import { detectCoordinationClusters } from "./detectCoordinationClusters.ts";
import type {
  CoordinationDependencyType,
  EnterpriseCoordinationInsight,
  EnterpriseCoordinationOverlayState,
} from "./enterpriseCoordinationTypes.ts";
import { scoreCoordinationComplexity } from "./scoreCoordinationComplexity.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_COORDINATION_INSIGHTS = 5;

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

function dependencyTypeFor(params: {
  relatedDomainIds: string[];
  relatedObjectIds: string[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  interventions?: StrategicIntervention[];
  recommendations?: DecisionRecommendation[];
  crossDomainInsights?: CrossDomainInsight[];
}): CoordinationDependencyType {
  if (params.relatedDomainIds.length >= 2 || (params.crossDomainInsights ?? []).length > 0) return "cross_domain_sync";
  if ((params.monitoringSignals ?? []).some((item) => item.relatedObjectIds.some((id) => params.relatedObjectIds.includes(id)))) return "monitoring_dependency";
  if ((params.interventions ?? []).some((item) => item.relatedObjectIds.some((id) => params.relatedObjectIds.includes(id)))) return "execution_dependency";
  if ((params.recommendations ?? []).some((item) => item.category === "rebalance")) return "resource_dependency";
  return "operational_alignment";
}

function logCoordination(insight: EnterpriseCoordinationInsight, clusterSize: number, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][EnterpriseCoordination]", {
    dependencyType: insight.dependencyType,
    coordinationComplexity: insight.coordinationComplexity ?? 0,
    synchronizationRisk: insight.synchronizationRisk ?? 0,
    relatedDomains: insight.relatedDomainIds ?? [],
    coordinationClusterSize: clusterSize,
  });
}

export function deriveEnterpriseCoordinationInsights(params: {
  crossDomainInsights?: CrossDomainInsight[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  recommendations?: DecisionRecommendation[];
  decisionGraph?: StrategicDecisionGraph | null;
  forecasts?: ExecutiveStabilityForecast[];
  debug?: boolean;
}): EnterpriseCoordinationInsight[] {
  const clusters = detectCoordinationClusters({
    crossDomainInsights: params.crossDomainInsights,
    fragilityZones: params.fragilityZones,
    interventions: params.interventions,
    monitoringSignals: params.monitoringSignals,
  });
  const insights = clusters.map((cluster): EnterpriseCoordinationInsight => {
    const dependencyType = dependencyTypeFor({
      relatedDomainIds: cluster.relatedDomainIds,
      relatedObjectIds: cluster.relatedObjectIds,
      monitoringSignals: params.monitoringSignals,
      interventions: params.interventions,
      recommendations: params.recommendations,
      crossDomainInsights: params.crossDomainInsights?.filter((item) => item.relatedObjectIds.some((id) => cluster.relatedObjectIds.includes(id))),
    });
    const coordinationComplexity = scoreCoordinationComplexity({
      relatedObjectIds: cluster.relatedObjectIds,
      relatedDomainIds: cluster.relatedDomainIds,
      crossDomainInsights: params.crossDomainInsights,
      fragilityZones: params.fragilityZones,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
      recommendations: params.recommendations,
      decisionGraph: params.decisionGraph,
    });
    const synchronizationRisk = deriveSynchronizationRisk({
      relatedObjectIds: cluster.relatedObjectIds,
      fragilityZones: params.fragilityZones,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
    });
    const confidence = Math.round(Math.min(0.95, Math.max(0.22, coordinationComplexity * 0.55 + synchronizationRisk * 0.35 + 0.1)) * 100) / 100;
    const insight: EnterpriseCoordinationInsight = {
      id: `enterprise_coordination_${normalizeIdPart(dependencyType)}_${normalizeIdPart(cluster.relatedObjectIds.join("_"))}`,
      title: buildCoordinationTitle({
        dependencyType,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      summary: buildCoordinationSummary({
        dependencyType,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      dependencyType,
      relatedObjectIds: cluster.relatedObjectIds,
      ...(cluster.relatedDomainIds.length ? { relatedDomainIds: cluster.relatedDomainIds } : {}),
      coordinationComplexity,
      synchronizationRisk,
      executiveImpact: buildCoordinationExecutiveImpact({ dependencyType }),
      recommendedFocus: buildAlignmentGuidance({
        dependencyType,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      confidence,
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logCoordination(insight, cluster.relatedObjectIds.length, params.debug);
    return insight;
  });

  const deduped = new Map<string, EnterpriseCoordinationInsight>();
  for (const insight of insights) {
    const key = `${insight.dependencyType}|${insight.relatedObjectIds.slice().sort().join("|")}`;
    const current = deduped.get(key);
    if (!current || (insight.coordinationComplexity ?? 0) > (current.coordinationComplexity ?? 0)) {
      deduped.set(key, insight);
    }
  }

  return Array.from(deduped.values()).sort((left, right) => {
    if ((right.coordinationComplexity ?? 0) !== (left.coordinationComplexity ?? 0)) return (right.coordinationComplexity ?? 0) - (left.coordinationComplexity ?? 0);
    if ((right.synchronizationRisk ?? 0) !== (left.synchronizationRisk ?? 0)) return (right.synchronizationRisk ?? 0) - (left.synchronizationRisk ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_COORDINATION_INSIGHTS);
}

export function buildEnterpriseCoordinationOverlayState(params: {
  insights: EnterpriseCoordinationInsight[];
}): EnterpriseCoordinationOverlayState {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const top = insights[0] ?? null;
  return {
    ...(top ? { topInsightId: top.id } : {}),
    headline: top?.title ?? "No enterprise coordination pressure is visible yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough evidence to identify coordination dependencies.",
    dependencyType: top?.dependencyType ?? "operational_alignment",
    relatedObjectIds: unique(insights.flatMap((item) => item.relatedObjectIds)),
    relatedDomainIds: unique(insights.flatMap((item) => item.relatedDomainIds ?? [])),
    coordinationComplexity: top?.coordinationComplexity ?? 0,
  };
}
