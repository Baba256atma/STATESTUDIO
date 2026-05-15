import type {
  CrossDomainCluster,
  CrossDomainInsight,
  CrossDomainSeverity,
} from "./crossDomainTypes.ts";

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

function severityRank(severity: CrossDomainSeverity): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function strongestSeverity(values: CrossDomainSeverity[]): CrossDomainSeverity {
  return values.slice().sort((left, right) => severityRank(right) - severityRank(left))[0] ?? "low";
}

export function deriveCrossDomainClusters(params: {
  insights: CrossDomainInsight[];
}): CrossDomainCluster[] {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const byObject = new Map<string, CrossDomainInsight[]>();
  for (const insight of insights) {
    const key = insight.relatedObjectIds.slice(0, 2).sort().join("|") || `${insight.sourceDomainId}|${insight.targetDomainId}`;
    byObject.set(key, [...(byObject.get(key) ?? []), insight]);
  }
  return Array.from(byObject.entries()).map(([key, group]) => ({
    id: `cross_domain_cluster_${key.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase()}`,
    domainIds: unique(group.flatMap((insight) => [insight.sourceDomainId, insight.targetDomainId])),
    relatedObjectIds: unique(group.flatMap((insight) => insight.relatedObjectIds)),
    insightIds: group.map((insight) => insight.id),
    severity: strongestSeverity(group.map((insight) => insight.severity)),
    systemicImpactScore: Math.round(Math.max(...group.map((insight) => insight.confidence)) * 100) / 100,
  })).sort((left, right) => {
    if (severityRank(right.severity) !== severityRank(left.severity)) return severityRank(right.severity) - severityRank(left.severity);
    return left.id.localeCompare(right.id);
  });
}
