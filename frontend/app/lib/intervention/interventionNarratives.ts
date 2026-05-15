import type {
  InterventionCategory,
  StrategicInterventionPriority,
} from "./strategicInterventionTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the active operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" -> ");
}

export function buildInterventionTitle(params: {
  category: InterventionCategory;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.category === "reduce_dependency") return `Reduce dependency concentration around ${path}`;
  if (params.category === "increase_visibility") return `Increase operational visibility across ${path}`;
  if (params.category === "contain_propagation") return `Contain propagation through ${path}`;
  if (params.category === "rebalance_resources") return `Rebalance resources around ${path}`;
  if (params.category === "diversify") return `Diversify resilience options for ${path}`;
  if (params.category === "strengthen_monitoring") return `Strengthen monitoring across ${path}`;
  if (params.category === "reduce_coupling") return `Reduce operational coupling across ${path}`;
  return `Stabilize ${path}`;
}

export function buildInterventionSummary(params: {
  category: InterventionCategory;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.category === "reduce_dependency") {
    return `Reducing dependency concentration may improve resilience across ${path}.`;
  }
  if (params.category === "increase_visibility" || params.category === "strengthen_monitoring") {
    return `Increasing operational visibility may reduce uncertainty across ${path}.`;
  }
  if (params.category === "contain_propagation") {
    return `Containing propagation may reduce downstream exposure through ${path}.`;
  }
  if (params.category === "reduce_coupling") {
    return `Reducing operational coupling may limit fragility amplification across ${path}.`;
  }
  if (params.category === "diversify") {
    return `Diversification may reduce single-path exposure across ${path}.`;
  }
  if (params.category === "rebalance_resources") {
    return `Resource rebalancing may reduce operating pressure around ${path}.`;
  }
  return `Stabilization may reduce fragility pressure around ${path}.`;
}

export function buildExpectedInterventionImpact(params: {
  category: InterventionCategory;
  priority: StrategicInterventionPriority;
}): string {
  const prefix = params.priority === "critical" || params.priority === "high"
    ? "Meaningful"
    : "Targeted";
  if (params.category === "contain_propagation") return `${prefix} reduction in downstream propagation exposure.`;
  if (params.category === "reduce_coupling") return `${prefix} reduction in operational fragility amplification.`;
  if (params.category === "reduce_dependency" || params.category === "diversify") return `${prefix} improvement in dependency resilience.`;
  if (params.category === "increase_visibility" || params.category === "strengthen_monitoring") return `${prefix} improvement in monitoring clarity and uncertainty reduction.`;
  return `${prefix} stabilization of the active operating pressure.`;
}

export function buildExecutiveInterventionRationale(params: {
  category: InterventionCategory;
  priority: StrategicInterventionPriority;
}): string {
  if (params.priority === "critical") {
    return "This intervention targets the highest-leverage stabilization point currently visible.";
  }
  if (params.priority === "high") {
    return "This intervention addresses a material operating pressure before it expands further.";
  }
  if (params.category === "increase_visibility" || params.category === "strengthen_monitoring") {
    return "This intervention improves executive visibility without requiring immediate structural change.";
  }
  return "This intervention provides a controlled stabilization option for executive review.";
}
