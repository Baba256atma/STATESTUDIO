import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { HardeningFinding, StabilityRiskInventoryItem } from "./finalHardeningTypes.ts";

export function buildStabilityRiskInventory(findings: readonly HardeningFinding[]): readonly StabilityRiskInventoryItem[] {
  return Object.freeze(
    findings.map((finding) => ({
      riskId: stableSignature(["d10-hardening-risk", finding.findingId]).slice(0, 56),
      description: finding.description,
      severity: finding.severity,
      impact: finding.impact,
      confidence: finding.confidence,
      recommendedMitigation: finding.recommendedMitigation,
      source: finding.area,
      signature: stableSignature(["d10-hardening-risk", finding.signature]),
    }))
  );
}
