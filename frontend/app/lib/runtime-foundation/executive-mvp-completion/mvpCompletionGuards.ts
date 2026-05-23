import type { ExecutiveCapabilityVerification, ExecutiveMVPCompletionResult, PublishRisk } from "./mvpCompletionTypes.ts";

export function validateExecutiveCapabilityVerification(item: ExecutiveCapabilityVerification): boolean {
  return Boolean(item.capabilityId && item.evidence.length > 0 && item.signature.trim());
}

export function validatePublishRisk(item: PublishRisk): boolean {
  return Boolean(item.riskId.trim() && item.rationale.trim() && item.impact.trim() && item.recommendedAction.trim() && item.signature.trim());
}

export function validateExecutiveMVPCompletionResult(result: ExecutiveMVPCompletionResult): boolean {
  return Boolean(
    result.completionId.trim() &&
      result.organizationId.trim() &&
      result.capabilities.every(validateExecutiveCapabilityVerification) &&
      result.risks.every(validatePublishRisk) &&
      result.scorecard.completionScore >= 0 &&
      result.scorecard.completionScore <= 1 &&
      result.summary.headline.trim() &&
      result.dashboard.signature.trim() &&
      result.advisoryOnly === true &&
      result.signature.trim()
  );
}
