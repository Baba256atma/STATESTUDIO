import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveStabilizationSummary, ProductionCandidateClassification, StabilizationChecklistItem, StabilityRiskInventoryItem } from "./finalHardeningTypes.ts";

export function generateExecutiveStabilizationSummary(input: {
  classification: ProductionCandidateClassification;
  checklist: readonly StabilizationChecklistItem[];
  risks: readonly StabilityRiskInventoryItem[];
}): ExecutiveStabilizationSummary {
  const remainingUnstable = input.risks.filter((risk) => risk.source.includes("stability") || risk.source.includes("workflow")).map((risk) => risk.description).slice(0, 4);
  const remainingRisky = input.risks.map((risk) => risk.description).slice(0, 5);
  const verified = input.checklist.filter((item) => item.state === "verified" || item.state === "complete").map((item) => item.title).slice(0, 6);
  const requiresAttention = input.checklist.filter((item) => item.state === "warning" || item.state === "blocked" || item.state === "pending").map((item) => item.title).slice(0, 6);
  const isProductionCandidate = input.classification === "production_candidate" || input.classification === "publication_ready";

  return {
    remainingUnstable: Object.freeze(remainingUnstable.length ? remainingUnstable : ["No unstable path detected."]),
    remainingRisky: Object.freeze(remainingRisky.length ? remainingRisky : ["No material hardening risk detected."]),
    verified: Object.freeze(verified),
    requiresAttention: Object.freeze(requiresAttention.length ? requiresAttention : ["Maintain evidence through final release review."]),
    isProductionCandidate,
    headline: isProductionCandidate ? "Nexora is a production candidate." : "Nexora requires stabilization before publication.",
    signature: stableSignature(["d10-stabilization-summary", input.classification, remainingUnstable, remainingRisky, verified, requiresAttention]),
  };
}
