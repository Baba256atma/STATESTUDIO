import type { ExecutiveInsightSeverity, ExecutivePriorityTier } from "./executiveInsightTypes.ts";

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(Number.isFinite(value) ? value : 0)));
}

function severityWeight(severity: ExecutiveInsightSeverity): number {
  if (severity === "critical") return 92;
  if (severity === "high") return 74;
  if (severity === "medium") return 48;
  return 22;
}

export function priorityTierFromScore(priorityScore: number): ExecutivePriorityTier {
  if (priorityScore >= 76) return "critical";
  if (priorityScore >= 51) return "urgent";
  if (priorityScore >= 26) return "attention";
  return "monitor";
}

export function scoreExecutiveInsightPriority(params: {
  severity: ExecutiveInsightSeverity;
  confidence: number;
  propagationReach?: number;
  dependencyDensity?: number;
  relationshipStrength?: number;
  objectCentrality?: number;
  domainWeight?: number;
}): number {
  const confidence = Math.max(0, Math.min(1, params.confidence));
  const reach = Math.max(0, Math.min(8, params.propagationReach ?? 0));
  const density = Math.max(0, Math.min(8, params.dependencyDensity ?? 0));
  const strength = Math.max(0, Math.min(1, params.relationshipStrength ?? 0.5));
  const centrality = Math.max(0, Math.min(1, params.objectCentrality ?? 0));
  const domainWeight = Math.max(0.75, Math.min(1.25, params.domainWeight ?? 1));
  return clampScore(
    (
      severityWeight(params.severity) * 0.42 +
      confidence * 24 +
      reach * 3.5 +
      density * 2.5 +
      strength * 10 +
      centrality * 12
    ) * domainWeight
  );
}
