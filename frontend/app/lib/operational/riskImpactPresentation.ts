import type {
  OperationalRiskExposureLevel,
  OperationalRiskImpactMap,
  OperationalRiskImpactNode,
} from "./riskImpactTypes.ts";

export function getOperationalExposureLabel(level: OperationalRiskExposureLevel | string): string {
  const L = typeof level === "string" ? level.trim().toLowerCase() : level;
  switch (L) {
    case "critical":
      return "Critical exposure";
    case "high":
      return "High exposure";
    case "elevated":
      return "Elevated exposure";
    case "minimal":
      return "Minimal exposure";
    default:
      return "Operational exposure";
  }
}

export function getOperationalExposureTone(level: OperationalRiskExposureLevel | string): string {
  const L = typeof level === "string" ? level.trim().toLowerCase() : level;
  switch (L) {
    case "critical":
      return "critical";
    case "high":
      return "negative";
    case "elevated":
      return "caution";
    case "minimal":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getOperationalRiskHeadlineTone(map: OperationalRiskImpactMap): string {
  return getOperationalExposureTone(map.highestExposureLevel);
}

export function getOperationalAttentionLabel(node: OperationalRiskImpactNode): string {
  switch (node.recommendedAttentionLevel) {
    case "urgent":
      return "Immediate executive attention";
    case "executive":
      return "Executive review within this session";
    case "heightened":
      return "Heightened monitoring";
    default:
      return "Routine watch";
  }
}
