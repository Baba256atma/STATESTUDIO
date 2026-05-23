import type {
  ExecutiveLaunchGateResult,
  GovernanceClassification,
  LaunchBlockingItem,
  LaunchEvidenceItem,
  LaunchReadinessScorecard,
} from "./executiveLaunchGateTypes.ts";

function validScore(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateLaunchEvidenceItem(item: LaunchEvidenceItem | null | undefined): item is LaunchEvidenceItem {
  if (!item) return false;
  return Boolean(item.evidenceId.trim() && item.source.trim() && item.description.trim() && item.signature.trim() && validScore(item.confidence));
}

export function validateLaunchBlockingItem(item: LaunchBlockingItem | null | undefined): item is LaunchBlockingItem {
  if (!item) return false;
  return Boolean(item.blockerId.trim() && item.description.trim() && item.affectedCapability.trim() && item.rationale.trim() && item.recommendedResolution.trim());
}

export function validateGovernanceClassification(item: GovernanceClassification | null | undefined): item is GovernanceClassification {
  if (!item) return false;
  return Boolean(item.classificationId.trim() && item.explanation.trim() && item.source.trim() && item.recommendedAction.trim() && validScore(item.confidence));
}

export function validateLaunchReadinessScorecard(scorecard: LaunchReadinessScorecard | null | undefined): scorecard is LaunchReadinessScorecard {
  if (!scorecard) return false;
  return validScore(scorecard.readinessScore) && validScore(scorecard.trustScore) && validScore(scorecard.stabilityScore) && validScore(scorecard.validationScore) && validScore(scorecard.launchConfidence);
}

export function validateExecutiveLaunchGateResult(result: ExecutiveLaunchGateResult | null | undefined): result is ExecutiveLaunchGateResult {
  if (!result) return false;
  return Boolean(
    result.gateId.trim() &&
      result.organizationId.trim() &&
      result.signature.trim() &&
      result.advisoryOnly === true &&
      Number.isFinite(result.generatedAt) &&
      validateLaunchReadinessScorecard(result.scorecard) &&
      result.evidence.every(validateLaunchEvidenceItem) &&
      result.blockers.every(validateLaunchBlockingItem) &&
      result.classifications.every(validateGovernanceClassification)
  );
}

