import type { MultiPerspectiveRecommendation } from "./consensusForesightTypes";

export const CONSENSUS_FORESIGHT_MAX_RECOMMENDATIONS = 10;
export const CONSENSUS_FORESIGHT_MAX_SNAPSHOTS = 8;
export const CONSENSUS_FORESIGHT_MAX_PERSPECTIVE_SIGNALS = 12;
export const CONSENSUS_FORESIGHT_MAX_ALIGNMENT_SCORES = 8;
export const CONSENSUS_FORESIGHT_MAX_DISAGREEMENTS = 8;
export const CONSENSUS_FORESIGHT_MIN_EVAL_INTERVAL_MS = 500;
export const CONSENSUS_FORESIGHT_MAX_RECURSION_DEPTH = 2;
export const CONSENSUS_FORESIGHT_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let consensusDepth = 0;

export function beginConsensusForesightEvaluation(): boolean {
  if (consensusDepth >= CONSENSUS_FORESIGHT_MAX_RECURSION_DEPTH) return false;
  consensusDepth += 1;
  return true;
}

export function endConsensusForesightEvaluation(): void {
  consensusDepth = Math.max(0, consensusDepth - 1);
}

export function shouldEvaluateConsensusForesight(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CONSENSUS_FORESIGHT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateMultiPerspectiveRecommendation(
  recommendation: MultiPerspectiveRecommendation | null | undefined
): recommendation is MultiPerspectiveRecommendation {
  if (!recommendation) return false;
  if (!recommendation.consensusId.trim() || !recommendation.summary.trim()) return false;
  if (recommendation.confidence < CONSENSUS_FORESIGHT_MIN_CONFIDENCE) return false;
  if (recommendation.supportingPerspectives.length === 0 && recommendation.disagreements.length === 0) {
    return false;
  }
  return Number.isFinite(recommendation.generatedAt);
}

export function shouldRetainMultiPerspectiveRecommendation(
  recommendation: MultiPerspectiveRecommendation
): boolean {
  if (!validateMultiPerspectiveRecommendation(recommendation)) return false;
  if (recommendation.consensusState === "inconclusive" && recommendation.supportingPerspectives.length < 2) {
    return false;
  }
  if (recommendation.consensusStrength === "executive_grade" && recommendation.confidence < 0.82) {
    return false;
  }
  return true;
}

export function confidenceToConsensusLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function strengthRank(strength: MultiPerspectiveRecommendation["consensusStrength"]): number {
  const ranks: Record<MultiPerspectiveRecommendation["consensusStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    executive_grade: 4,
  };
  return ranks[strength];
}

export function resetConsensusForesightGuards(): void {
  lastEvalAtByOrg.clear();
  consensusDepth = 0;
}
