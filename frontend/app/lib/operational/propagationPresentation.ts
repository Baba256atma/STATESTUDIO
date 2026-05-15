import type { OperationalPropagationPreview, OperationalPropagationRiskLevel } from "./propagationPreviewTypes.ts";

export function getPropagationRiskLabel(level: OperationalPropagationRiskLevel | string): string {
  const L = typeof level === "string" ? level.trim().toLowerCase() : level;
  switch (L) {
    case "critical":
      return "Critical propagation risk";
    case "high":
      return "High propagation risk";
    case "medium":
      return "Moderate propagation risk";
    case "low":
      return "Low propagation risk";
    default:
      return "Propagation risk";
  }
}

/** Presentation tone token (no JSX); aligns with monitoring tone vocabulary. */
export function getPropagationRiskTone(level: OperationalPropagationRiskLevel | string): string {
  const L = typeof level === "string" ? level.trim().toLowerCase() : level;
  switch (L) {
    case "critical":
      return "critical";
    case "high":
      return "negative";
    case "medium":
      return "caution";
    case "low":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getPropagationExecutiveSummary(preview: OperationalPropagationPreview): string {
  const n = preview.propagationNodes.length;
  if (n === 0) return preview.summary;
  const top = preview.propagationNodes[0];
  if (!top) return preview.summary;
  const head = `${getPropagationRiskLabel(preview.highestRiskLevel)} · ${n} adjacent system${n === 1 ? "" : "s"}`;
  return `${head}. Next pressure target: ${top.objectId}.`;
}
