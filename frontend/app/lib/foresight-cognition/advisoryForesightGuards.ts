import type { ExecutiveGuidanceRecommendation } from "./advisoryForesightTypes";

export const ADVISORY_FORESIGHT_MAX_RECOMMENDATIONS = 10;
export const ADVISORY_FORESIGHT_MAX_SNAPSHOTS = 8;
export const ADVISORY_FORESIGHT_MAX_SIGNALS = 10;
export const ADVISORY_FORESIGHT_MAX_FOCUS_SUGGESTIONS = 8;
export const ADVISORY_FORESIGHT_MAX_PRIORITY_FIELDS = 8;
export const ADVISORY_FORESIGHT_MIN_EVAL_INTERVAL_MS = 500;
export const ADVISORY_FORESIGHT_MAX_RECURSION_DEPTH = 2;
export const ADVISORY_FORESIGHT_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let advisoryDepth = 0;

export function beginAdvisoryForesightEvaluation(): boolean {
  if (advisoryDepth >= ADVISORY_FORESIGHT_MAX_RECURSION_DEPTH) return false;
  advisoryDepth += 1;
  return true;
}

export function endAdvisoryForesightEvaluation(): void {
  advisoryDepth = Math.max(0, advisoryDepth - 1);
}

export function shouldEvaluateAdvisoryForesight(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ADVISORY_FORESIGHT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateExecutiveGuidanceRecommendation(
  recommendation: ExecutiveGuidanceRecommendation | null | undefined
): recommendation is ExecutiveGuidanceRecommendation {
  if (!recommendation) return false;
  if (!recommendation.advisoryId.trim() || !recommendation.summary.trim()) return false;
  if (recommendation.confidence < ADVISORY_FORESIGHT_MIN_CONFIDENCE) return false;
  if (recommendation.recommendations.length === 0) return false;
  return Number.isFinite(recommendation.generatedAt);
}

export function shouldRetainExecutiveGuidanceRecommendation(
  recommendation: ExecutiveGuidanceRecommendation
): boolean {
  if (!validateExecutiveGuidanceRecommendation(recommendation)) return false;
  if (
    recommendation.recommendationPriority === "informational" &&
    recommendation.confidence < 0.65
  ) {
    return false;
  }
  if (recommendation.recommendationPriority === "critical" && recommendation.confidence < 0.8) {
    return false;
  }
  return true;
}

export function confidenceToGuidanceLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function priorityRank(
  priority: ExecutiveGuidanceRecommendation["recommendationPriority"]
): number {
  const ranks: Record<ExecutiveGuidanceRecommendation["recommendationPriority"], number> = {
    informational: 1,
    moderate: 2,
    elevated: 3,
    critical: 4,
  };
  return ranks[priority];
}

export function resetAdvisoryForesightGuards(): void {
  lastEvalAtByOrg.clear();
  advisoryDepth = 0;
}
