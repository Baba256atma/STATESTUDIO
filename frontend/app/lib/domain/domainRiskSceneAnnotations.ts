import type { DomainFragilityScore } from "./domainFragilityScoring.ts";
import type { DomainRiskSignalResult } from "./domainRiskSignals.ts";

function severityRank(value: string | undefined): number {
  if (value === "critical") return 4;
  if (value === "high") return 3;
  if (value === "medium") return 2;
  if (value === "low") return 1;
  return 0;
}

function priorityFor(severity: string | undefined): string {
  if (severity === "critical" || severity === "high") return "high";
  if (severity === "medium") return "medium";
  return "low";
}

export function buildDomainRiskSceneAnnotations(params: {
  signals: DomainRiskSignalResult[];
  fragilityScores: DomainFragilityScore[];
}): {
  objectAnnotations: Record<string, unknown>;
  edgeAnnotations: Record<string, unknown>;
} {
  const objectAnnotations: Record<string, unknown> = {};
  const edgeAnnotations: Record<string, unknown> = {};

  for (const score of params.fragilityScores) {
    objectAnnotations[score.objectId] = {
      ...(objectAnnotations[score.objectId] as Record<string, unknown> | undefined),
      fragilityScore: score.score,
      fragilityLevel: score.level,
    };
  }

  for (const signal of params.signals) {
    for (const objectId of signal.relatedObjectIds) {
      const current = (objectAnnotations[objectId] as Record<string, unknown> | undefined) ?? {};
      const currentSeverity = String(current.severity ?? "");
      const nextSeverity =
        severityRank(signal.severity) > severityRank(currentSeverity) ? signal.severity : currentSeverity || signal.severity;
      objectAnnotations[objectId] = {
        ...current,
        severity: nextSeverity,
        executivePriority: priorityFor(nextSeverity),
        riskSignalIds: Array.from(new Set([...(Array.isArray(current.riskSignalIds) ? current.riskSignalIds : []), signal.id])),
      };
    }
    for (const edgeId of signal.relatedEdgeIds ?? []) {
      const current = (edgeAnnotations[edgeId] as Record<string, unknown> | undefined) ?? {};
      edgeAnnotations[edgeId] = {
        ...current,
        severity: signal.severity,
        propagationPotential: signal.signalType === "delay" || signal.signalType === "dependency" || signal.signalType === "exposure",
        executivePriority: priorityFor(signal.severity),
        riskSignalIds: Array.from(new Set([...(Array.isArray(current.riskSignalIds) ? current.riskSignalIds : []), signal.id])),
      };
    }
  }

  return { objectAnnotations, edgeAnnotations };
}
