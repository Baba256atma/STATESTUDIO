import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import { detectInterventionOpportunities } from "./detectInterventionOpportunities.ts";
import {
  buildExecutiveInterventionRationale,
  buildExpectedInterventionImpact,
  buildInterventionSummary,
  buildInterventionTitle,
} from "./interventionNarratives.ts";
import {
  interventionPriorityFromImpact,
  scoreInterventionImpact,
} from "./scoreInterventionImpact.ts";
import type {
  InterventionOpportunity,
  StrategicIntervention,
  StrategicInterventionOverlayState,
} from "./strategicInterventionTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_INTERVENTIONS = 6;

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

function targetZonesFor(opportunity: InterventionOpportunity, zones: EnterpriseFragilityZone[]): EnterpriseFragilityZone[] {
  const zoneIds = new Set(opportunity.targetZoneIds);
  const explicit = zones.filter((zone) => zoneIds.has(zone.id));
  if (explicit.length) return explicit;
  return zones.filter((zone) => zone.relatedObjectIds.some((id) => opportunity.relatedObjectIds.includes(id)));
}

function recommendationOpportunity(recommendation: DecisionRecommendation): InterventionOpportunity {
  const category = recommendation.category === "diversify"
    ? "diversify"
    : recommendation.category === "monitor"
      ? "strengthen_monitoring"
      : recommendation.category === "rebalance"
        ? "rebalance_resources"
        : recommendation.category === "protect"
          ? "contain_propagation"
          : recommendation.category === "reduce_risk"
            ? "stabilize"
            : "stabilize";
  return {
    id: `intervention_opportunity_recommendation_${normalizeIdPart(recommendation.id)}`,
    category,
    relatedObjectIds: recommendation.affectedObjectIds,
    targetZoneIds: [],
    domainIds: unique([recommendation.domainId]),
    leverageScore: recommendation.priority === "critical" ? 0.7 : recommendation.priority === "high" ? 0.58 : recommendation.priority === "medium" ? 0.38 : 0.22,
    rationale: recommendation.rationale,
  };
}

function logIntervention(intervention: StrategicIntervention, impactScore: number, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][StrategicIntervention]", {
    category: intervention.category,
    impactScore,
    propagationReductionPotential: intervention.propagationReductionPotential ?? 0,
    relatedZones: intervention.targetZoneIds ?? [],
    executiveRationale: intervention.executiveRationale ?? null,
  });
}

export function deriveStrategicInterventions(params: {
  zones?: EnterpriseFragilityZone[];
  recommendations?: DecisionRecommendation[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  decisionGraph?: StrategicDecisionGraph | null;
  crossDomainInsights?: CrossDomainInsight[];
  debug?: boolean;
}): StrategicIntervention[] {
  const zones = Array.isArray(params.zones) ? params.zones : [];
  const baseOpportunities = detectInterventionOpportunities({
    zones,
    monitoringSignals: params.monitoringSignals,
    strategicMemory: params.strategicMemory,
    crossDomainInsights: params.crossDomainInsights,
  });
  const recommendationOpportunities = (params.recommendations ?? []).map(recommendationOpportunity);
  const opportunities = [...baseOpportunities, ...recommendationOpportunities];
  const interventions = opportunities.map((opportunity): StrategicIntervention => {
    const targetZones = targetZonesFor(opportunity, zones);
    const impactScore = scoreInterventionImpact({
      category: opportunity.category,
      targetZones,
      monitoringSignals: params.monitoringSignals,
      strategicMemory: params.strategicMemory,
      crossDomainInsights: params.crossDomainInsights,
      decisionGraph: params.decisionGraph,
    });
    const combinedImpact = Math.round(Math.min(1, Math.max(0, impactScore * 0.75 + opportunity.leverageScore * 0.25)) * 100) / 100;
    const priority = interventionPriorityFromImpact(combinedImpact);
    const intervention: StrategicIntervention = {
      id: `strategic_intervention_${normalizeIdPart(opportunity.category)}_${normalizeIdPart(opportunity.relatedObjectIds.join("_") || opportunity.id)}`,
      title: buildInterventionTitle({
        category: opportunity.category,
        relatedObjectIds: opportunity.relatedObjectIds,
      }),
      summary: buildInterventionSummary({
        category: opportunity.category,
        relatedObjectIds: opportunity.relatedObjectIds,
      }),
      category: opportunity.category,
      relatedObjectIds: opportunity.relatedObjectIds,
      ...(opportunity.targetZoneIds.length ? { targetZoneIds: opportunity.targetZoneIds } : {}),
      expectedImpact: buildExpectedInterventionImpact({
        category: opportunity.category,
        priority,
      }),
      propagationReductionPotential: combinedImpact,
      confidence: Math.round(Math.min(0.95, Math.max(0.22, combinedImpact * 0.68 + opportunity.leverageScore * 0.32)) * 100) / 100,
      priority,
      executiveRationale: buildExecutiveInterventionRationale({
        category: opportunity.category,
        priority,
      }),
      ...(opportunity.domainIds.length ? { domainIds: opportunity.domainIds } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logIntervention(intervention, combinedImpact, params.debug);
    return intervention;
  });

  const deduped = new Map<string, StrategicIntervention>();
  for (const intervention of interventions) {
    const key = `${intervention.category}|${intervention.relatedObjectIds.slice().sort().join("|")}`;
    const current = deduped.get(key);
    if (!current || (intervention.propagationReductionPotential ?? 0) > (current.propagationReductionPotential ?? 0)) {
      deduped.set(key, intervention);
    }
  }

  return Array.from(deduped.values()).sort((left, right) => {
    if ((right.propagationReductionPotential ?? 0) !== (left.propagationReductionPotential ?? 0)) {
      return (right.propagationReductionPotential ?? 0) - (left.propagationReductionPotential ?? 0);
    }
    const rank = { critical: 4, high: 3, medium: 2, low: 1 };
    if (rank[right.priority] !== rank[left.priority]) return rank[right.priority] - rank[left.priority];
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_INTERVENTIONS);
}

export function buildStrategicInterventionOverlayState(params: {
  interventions: StrategicIntervention[];
}): StrategicInterventionOverlayState {
  const interventions = Array.isArray(params.interventions) ? params.interventions : [];
  const top = interventions[0] ?? null;
  return {
    ...(top ? { topInterventionId: top.id } : {}),
    headline: top?.title ?? "No strategic intervention is available yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough stabilization evidence to identify intervention leverage.",
    priority: top?.priority ?? "low",
    relatedObjectIds: unique(interventions.flatMap((item) => item.relatedObjectIds)),
  };
}
