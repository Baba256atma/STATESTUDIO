import type { CoordinationDependencyType } from "./enterpriseCoordinationTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the active operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" - ");
}

export function buildCoordinationTitle(params: {
  dependencyType: CoordinationDependencyType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.dependencyType === "cross_domain_sync") return `Cross-domain coordination required across ${path}`;
  if (params.dependencyType === "monitoring_dependency") return `Monitoring alignment needed across ${path}`;
  if (params.dependencyType === "resource_dependency") return `Resource coordination pressure around ${path}`;
  if (params.dependencyType === "execution_dependency") return `Execution alignment required around ${path}`;
  if (params.dependencyType === "communication_dependency") return `Communication dependency visible around ${path}`;
  return `Operational alignment pressure around ${path}`;
}

export function buildCoordinationSummary(params: {
  dependencyType: CoordinationDependencyType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.dependencyType === "cross_domain_sync") {
    return `Stabilization depends on coordinated cross-domain attention across ${path}.`;
  }
  if (params.dependencyType === "monitoring_dependency") {
    return `Shared monitoring visibility is needed to keep ${path} aligned.`;
  }
  if (params.dependencyType === "execution_dependency") {
    return `Execution timing across ${path} may affect stabilization progress.`;
  }
  if (params.dependencyType === "resource_dependency") {
    return `Resource allocation around ${path} may influence operational resilience.`;
  }
  if (params.dependencyType === "communication_dependency") {
    return `Communication gaps around ${path} may amplify operational uncertainty.`;
  }
  return `Operational recovery now depends on synchronized alignment across ${path}.`;
}

export function buildCoordinationExecutiveImpact(params: {
  dependencyType: CoordinationDependencyType;
}): string {
  if (params.dependencyType === "cross_domain_sync") return "Enterprise stabilization may depend on synchronized action across domains.";
  if (params.dependencyType === "monitoring_dependency") return "Visibility gaps may delay recognition of stabilization or escalation.";
  if (params.dependencyType === "execution_dependency") return "Delayed execution alignment may extend operational instability.";
  if (params.dependencyType === "resource_dependency") return "Resource coordination may determine whether stabilization efforts hold.";
  if (params.dependencyType === "communication_dependency") return "Communication alignment may reduce uncertainty across dependent systems.";
  return "Coordinated operational alignment may reduce synchronization friction.";
}

export function buildAlignmentGuidance(params: {
  dependencyType: CoordinationDependencyType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.dependencyType === "monitoring_dependency") return `Align monitoring visibility across ${path}.`;
  if (params.dependencyType === "cross_domain_sync") return `Coordinate stabilization timing across ${path}.`;
  if (params.dependencyType === "resource_dependency") return `Review resource allocation dependencies around ${path}.`;
  if (params.dependencyType === "execution_dependency") return `Align intervention execution cadence across ${path}.`;
  if (params.dependencyType === "communication_dependency") return `Increase communication clarity across ${path}.`;
  return `Coordinate operational alignment across ${path}.`;
}
