import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { HardeningFinding, HardeningFindingSeverity, ProductionCandidateArea } from "./finalHardeningTypes.ts";

export function hardeningSeverityRank(severity: HardeningFindingSeverity): number {
  return { informational: 0, caution: 1, warning: 2, critical: 3 }[severity];
}

export function createHardeningFinding(
  area: ProductionCandidateArea,
  severity: HardeningFindingSeverity,
  description: string,
  impact: string,
  confidence: number,
  recommendedMitigation: string
): HardeningFinding {
  const clamped = Math.max(0, Math.min(1, Number(confidence.toFixed(4))));
  return {
    findingId: stableSignature(["d10-hardening-finding", area, severity, description]).slice(0, 56),
    area,
    severity,
    description,
    impact,
    confidence: clamped,
    recommendedMitigation,
    signature: stableSignature(["d10-hardening-finding", area, severity, description, impact, clamped, recommendedMitigation]),
  };
}
