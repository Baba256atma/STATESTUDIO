import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type {
  InterventionCategory,
  InterventionOpportunity,
} from "./strategicInterventionTypes.ts";

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

function categoryForZone(zone: EnterpriseFragilityZone): InterventionCategory {
  if (zone.zoneType === "critical_corridor") return "contain_propagation";
  if (zone.zoneType === "systemic") return "reduce_coupling";
  if (zone.zoneType === "amplifying") return "reduce_dependency";
  if (zone.propagationIntensity >= 0.58) return "stabilize";
  return "increase_visibility";
}

function leverageForZone(zone: EnterpriseFragilityZone): number {
  return Math.round(Math.min(1, Math.max(0, (zone.systemicReach ?? 0) * 0.45 + zone.propagationIntensity * 0.3 + (zone.fragilityScore / 100) * 0.25)) * 100) / 100;
}

function addOpportunity(
  opportunities: Map<string, InterventionOpportunity>,
  opportunity: InterventionOpportunity,
): void {
  const current = opportunities.get(opportunity.id);
  if (!current || opportunity.leverageScore > current.leverageScore) {
    opportunities.set(opportunity.id, opportunity);
  }
}

export function detectInterventionOpportunities(params: {
  zones?: EnterpriseFragilityZone[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  crossDomainInsights?: CrossDomainInsight[];
}): InterventionOpportunity[] {
  const opportunities = new Map<string, InterventionOpportunity>();

  for (const zone of params.zones ?? []) {
    const category = categoryForZone(zone);
    addOpportunity(opportunities, {
      id: `intervention_opportunity_${normalizeIdPart(category)}_${normalizeIdPart(zone.id)}`,
      category,
      relatedObjectIds: zone.relatedObjectIds,
      targetZoneIds: [zone.id],
      domainIds: unique(zone.domainIds ?? []),
      leverageScore: leverageForZone(zone),
      rationale: zone.executiveImpact ?? zone.summary,
    });
  }

  const monitoringObjects = unique((params.monitoringSignals ?? [])
    .filter((signal) => signal.monitoringStatus === "elevated" || signal.monitoringStatus === "critical")
    .flatMap((signal) => signal.relatedObjectIds));
  if (monitoringObjects.length) {
    addOpportunity(opportunities, {
      id: `intervention_opportunity_strengthen_monitoring_${normalizeIdPart(monitoringObjects.join("_"))}`,
      category: "strengthen_monitoring",
      relatedObjectIds: monitoringObjects,
      targetZoneIds: [],
      domainIds: unique((params.monitoringSignals ?? []).map((signal) => signal.domainId)),
      leverageScore: 0.52,
      rationale: "Monitoring pressure remains elevated across related operating nodes.",
    });
  }

  const recurringDependencyObjects = unique((params.strategicMemory ?? [])
    .filter((record) => (record.category === "dependency" || record.category === "fragility") && (record.recurrenceCount ?? 1) >= 2)
    .flatMap((record) => record.relatedObjectIds));
  if (recurringDependencyObjects.length) {
    addOpportunity(opportunities, {
      id: `intervention_opportunity_diversify_${normalizeIdPart(recurringDependencyObjects.join("_"))}`,
      category: "diversify",
      relatedObjectIds: recurringDependencyObjects,
      targetZoneIds: [],
      domainIds: unique((params.strategicMemory ?? []).map((record) => record.domainId)),
      leverageScore: 0.58,
      rationale: "Recurring dependency fragility indicates a diversification opportunity.",
    });
  }

  const crossDomainObjects = unique((params.crossDomainInsights ?? [])
    .filter((insight) => insight.severity === "high" || insight.severity === "critical")
    .flatMap((insight) => insight.relatedObjectIds));
  if (crossDomainObjects.length) {
    addOpportunity(opportunities, {
      id: `intervention_opportunity_contain_propagation_${normalizeIdPart(crossDomainObjects.join("_"))}`,
      category: "contain_propagation",
      relatedObjectIds: crossDomainObjects,
      targetZoneIds: [],
      domainIds: unique((params.crossDomainInsights ?? []).flatMap((insight) => [insight.sourceDomainId, insight.targetDomainId])),
      leverageScore: 0.64,
      rationale: "Cross-domain pressure indicates a containment opportunity.",
    });
  }

  return Array.from(opportunities.values()).sort((left, right) => {
    if (right.leverageScore !== left.leverageScore) return right.leverageScore - left.leverageScore;
    return left.id.localeCompare(right.id);
  });
}
