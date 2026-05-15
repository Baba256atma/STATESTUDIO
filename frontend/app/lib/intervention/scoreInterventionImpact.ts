import type { CrossDomainInsight } from "../crossdomain/crossDomainTypes.ts";
import type { StrategicDecisionGraph } from "../decisionGraph/strategicDecisionGraphTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type {
  InterventionCategory,
  StrategicInterventionPriority,
} from "./strategicInterventionTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function priorityBoost(category: InterventionCategory): number {
  if (category === "contain_propagation" || category === "reduce_coupling") return 0.12;
  if (category === "reduce_dependency" || category === "diversify") return 0.1;
  if (category === "strengthen_monitoring" || category === "increase_visibility") return 0.06;
  return 0.04;
}

export function scoreInterventionImpact(params: {
  category: InterventionCategory;
  targetZones?: EnterpriseFragilityZone[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  crossDomainInsights?: CrossDomainInsight[];
  decisionGraph?: StrategicDecisionGraph | null;
}): number {
  const zones = params.targetZones ?? [];
  const maxReach = Math.max(0, ...zones.map((zone) => zone.systemicReach ?? 0));
  const maxPropagation = Math.max(0, ...zones.map((zone) => zone.propagationIntensity));
  const maxFragility = Math.max(0, ...zones.map((zone) => zone.fragilityScore / 100));
  const monitoringPressure = Math.min(1, (params.monitoringSignals ?? []).filter((item) => item.monitoringStatus === "elevated" || item.monitoringStatus === "critical").length / 2);
  const recurrencePressure = Math.min(1, (params.strategicMemory ?? []).reduce((sum, item) => sum + (item.recurrenceCount ?? 1), 0) / 8);
  const crossDomainPressure = Math.min(1, (params.crossDomainInsights ?? []).length / 3);
  const graphPressure = params.decisionGraph && params.decisionGraph.nodes.length >= 3 && params.decisionGraph.edges.length >= 2 ? 0.1 : 0;

  return clamp01(
    maxReach * 0.28 +
      maxPropagation * 0.22 +
      maxFragility * 0.2 +
      monitoringPressure * 0.1 +
      recurrencePressure * 0.08 +
      crossDomainPressure * 0.08 +
      graphPressure +
      priorityBoost(params.category)
  );
}

export function interventionPriorityFromImpact(score: number): StrategicInterventionPriority {
  if (score >= 0.78) return "critical";
  if (score >= 0.58) return "high";
  if (score >= 0.34) return "medium";
  return "low";
}
