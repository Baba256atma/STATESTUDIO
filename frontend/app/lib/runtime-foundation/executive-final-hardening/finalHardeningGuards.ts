import type { ExecutiveFinalHardeningResult, HardeningRecommendation, StabilizationChecklistItem, StabilityRiskInventoryItem } from "./finalHardeningTypes.ts";

export function validateStabilizationChecklistItem(item: StabilizationChecklistItem): boolean {
  return Boolean(item.itemId.trim() && item.title.trim() && item.explanation.trim() && item.signature.trim());
}

export function validateStabilityRiskInventoryItem(item: StabilityRiskInventoryItem): boolean {
  return Boolean(item.riskId.trim() && item.description.trim() && item.confidence >= 0 && item.confidence <= 1 && item.signature.trim());
}

export function validateHardeningRecommendation(item: HardeningRecommendation): boolean {
  return Boolean(item.recommendationId.trim() && item.advisoryOnly === true && item.priority >= 0 && item.priority <= 1 && item.signature.trim());
}

export function validateExecutiveFinalHardeningResult(result: ExecutiveFinalHardeningResult): boolean {
  return Boolean(
    result.hardeningId.trim() &&
      result.organizationId.trim() &&
      result.checklist.every(validateStabilizationChecklistItem) &&
      result.riskInventory.every(validateStabilityRiskInventoryItem) &&
      result.recommendations.every(validateHardeningRecommendation) &&
      result.summary.headline.trim() &&
      result.trend.signature.trim() &&
      result.signature.trim()
  );
}
