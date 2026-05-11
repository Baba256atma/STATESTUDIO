import type { DomainRiskSignalResult } from "./domainRiskSignals.ts";

const SEVERITY_RANK = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

export function summarizeDomainRiskSignals(params: {
  signals: DomainRiskSignalResult[];
}): string {
  const signals = Array.isArray(params.signals) ? params.signals : [];
  if (signals.length === 0) return "No domain risk signals detected.";

  const top = [...signals].sort((a, b) => {
    const severityDelta = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (severityDelta !== 0) return severityDelta;
    return b.confidence - a.confidence;
  })[0];

  const related = top.relatedObjectIds.slice(0, 2).join(" and ");
  const scope = related ? ` around ${related}` : "";
  if (top.signalType === "dependency") {
    return `${top.severity[0].toUpperCase()}${top.severity.slice(1)} dependency concentration detected${scope}.`;
  }
  if (top.signalType === "exposure") {
    return `${top.severity[0].toUpperCase()}${top.severity.slice(1)} exposure path detected${scope}.`;
  }
  return `${top.severity[0].toUpperCase()}${top.severity.slice(1)} ${top.label.toLowerCase()} detected${scope}.`;
}
