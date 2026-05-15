import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { CoordinationCluster } from "./enterpriseCoordinationTypes.ts";
import { deriveSynchronizationRisk } from "./deriveSynchronizationRisk.ts";
import { scoreCoordinationComplexity } from "./scoreCoordinationComplexity.ts";

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

export function detectCoordinationClusters(params: {
  crossDomainInsights?: CrossDomainInsight[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
}): CoordinationCluster[] {
  const seeds = [
    ...(params.fragilityZones ?? []).map((zone) => ({
      id: zone.id,
      objects: zone.relatedObjectIds,
      domains: zone.domainIds ?? [],
    })),
    ...(params.crossDomainInsights ?? []).map((insight) => ({
      id: insight.id,
      objects: insight.relatedObjectIds,
      domains: [insight.sourceDomainId, insight.targetDomainId],
    })),
    ...(params.interventions ?? []).map((item) => ({
      id: item.id,
      objects: item.relatedObjectIds,
      domains: item.domainIds ?? [],
    })),
  ];
  const clusters = new Map<string, CoordinationCluster>();

  for (const seed of seeds) {
    const relatedObjectIds = unique(seed.objects);
    if (!relatedObjectIds.length) continue;
    const key = relatedObjectIds.slice(0, 3).sort().join("|");
    const current = clusters.get(key);
    const relatedDomainIds = unique([...(current?.relatedDomainIds ?? []), ...seed.domains]);
    const sourceInsightIds = unique([...(current?.sourceInsightIds ?? []), seed.id]);
    const coordinationComplexity = scoreCoordinationComplexity({
      relatedObjectIds,
      relatedDomainIds,
      crossDomainInsights: params.crossDomainInsights,
      fragilityZones: params.fragilityZones,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
    });
    const synchronizationRisk = deriveSynchronizationRisk({
      relatedObjectIds,
      fragilityZones: params.fragilityZones,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
    });
    clusters.set(key, {
      id: `coordination_cluster_${normalizeIdPart(key)}`,
      relatedObjectIds,
      relatedDomainIds,
      sourceInsightIds,
      coordinationComplexity,
      synchronizationRisk,
    });
  }

  return Array.from(clusters.values()).sort((left, right) => {
    if (right.coordinationComplexity !== left.coordinationComplexity) return right.coordinationComplexity - left.coordinationComplexity;
    if (right.synchronizationRisk !== left.synchronizationRisk) return right.synchronizationRisk - left.synchronizationRisk;
    return left.id.localeCompare(right.id);
  });
}
