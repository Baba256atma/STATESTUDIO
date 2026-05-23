import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { HardeningRecommendation, StabilityRiskInventoryItem } from "./finalHardeningTypes.ts";

function areaFor(source: string): HardeningRecommendation["area"] {
  if (source.includes("trust")) return "trust_improvement";
  if (source.includes("validation")) return "validation_improvement";
  if (source.includes("dashboard") || source.includes("pilot")) return "UX_refinement";
  if (source.includes("workflow")) return "workflow_refinement";
  if (source.includes("readiness")) return "readiness_improvement";
  return "stability_improvement";
}

export function generateHardeningRecommendations(risks: readonly StabilityRiskInventoryItem[]): readonly HardeningRecommendation[] {
  if (risks.length === 0) {
    return Object.freeze([
      {
        recommendationId: stableSignature(["d10-hardening-recommendation", "maintain"]).slice(0, 56),
        area: "stability_improvement",
        priority: 0.42,
        summary: "Maintain final stabilization evidence through D10 completion.",
        rationale: "No blocking hardening risk was detected.",
        advisoryOnly: true,
        signature: stableSignature(["d10-hardening-recommendation", "maintain", 0.42]),
      },
    ]);
  }

  return Object.freeze(
    risks
      .slice(0, 8)
      .map((risk) => ({
        recommendationId: stableSignature(["d10-hardening-recommendation", risk.riskId]).slice(0, 56),
        area: areaFor(risk.source),
        priority: Math.max(0, Math.min(1, Number((risk.confidence * (risk.severity === "critical" ? 1 : 0.82)).toFixed(4)))),
        summary: `Resolve ${risk.description}.`,
        rationale: risk.impact,
        advisoryOnly: true as const,
        signature: stableSignature(["d10-hardening-recommendation", risk.signature]),
      }))
      .sort((a, b) => b.priority - a.priority || a.recommendationId.localeCompare(b.recommendationId))
  );
}
