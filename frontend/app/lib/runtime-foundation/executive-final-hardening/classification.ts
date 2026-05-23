import type { ProductionCandidateClassification, StabilizationChecklistItem, StabilityRiskInventoryItem } from "./finalHardeningTypes.ts";

export function classifyProductionCandidate(input: {
  checklist: readonly StabilizationChecklistItem[];
  risks: readonly StabilityRiskInventoryItem[];
  verifiedExecutiveCount: number;
}): ProductionCandidateClassification {
  if (input.risks.some((risk) => risk.severity === "critical") || input.checklist.some((item) => item.required && item.state === "blocked")) return "not_ready";
  const warningCount = input.risks.filter((risk) => risk.severity === "warning").length + input.checklist.filter((item) => item.state === "warning").length;
  const verifiedCount = input.checklist.filter((item) => item.state === "verified" || item.state === "complete").length;
  if (verifiedCount === input.checklist.length && input.verifiedExecutiveCount >= 7 && warningCount === 0) return "publication_ready";
  if (verifiedCount >= input.checklist.length - 1 && input.verifiedExecutiveCount >= 6 && warningCount <= 1) return "production_candidate";
  if (verifiedCount >= Math.ceil(input.checklist.length * 0.7) && input.verifiedExecutiveCount >= 5) return "nearly_ready";
  return "stabilization_required";
}
