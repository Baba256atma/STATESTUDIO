import type { DomainScenarioSeverity } from "./domainScenarioTypes.ts";

export type DomainScenarioIntelligencePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DomainScenarioIntelligenceScore = {
  confidence: number;
  severity: DomainScenarioSeverity;
  priority: DomainScenarioIntelligencePriority;
};

function severityRank(severity: DomainScenarioSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function priorityFromScore(score: number): DomainScenarioIntelligencePriority {
  if (score >= 0.86) return "critical";
  if (score >= 0.68) return "high";
  if (score >= 0.42) return "medium";
  return "low";
}

export function scoreDomainScenarioIntelligence(params: {
  severity: DomainScenarioSeverity;
  baseConfidence: number;
  propagationReach?: number;
  relationshipStrength?: number;
  fragilityScore?: number;
}): DomainScenarioIntelligenceScore {
  const reach = Math.max(0, Math.min(8, params.propagationReach ?? 0));
  const strength = clamp01(params.relationshipStrength ?? 0.55);
  const fragility = Math.max(0, Math.min(100, params.fragilityScore ?? 0));
  const confidence = clamp01(
    params.baseConfidence * 0.55 +
      severityRank(params.severity) * 0.075 +
      reach * 0.035 +
      strength * 0.12 +
      fragility / 800
  );
  return {
    confidence: Number(confidence.toFixed(2)),
    severity: params.severity,
    priority: priorityFromScore(confidence),
  };
}
