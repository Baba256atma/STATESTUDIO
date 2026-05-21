import type { ExecutiveDecisionConfidence } from "./decisionConfidenceTypes";

export const DECISION_CONFIDENCE_MAX_CONFIDENCES = 10;
export const DECISION_CONFIDENCE_MAX_SNAPSHOTS = 8;
export const DECISION_CONFIDENCE_MAX_CERTAINTY_SIGNALS = 10;
export const DECISION_CONFIDENCE_MAX_UNCERTAINTY_FIELDS = 10;
export const DECISION_CONFIDENCE_MAX_AMBIGUITY_INDICATORS = 10;
export const DECISION_CONFIDENCE_MIN_EVAL_INTERVAL_MS = 500;
export const DECISION_CONFIDENCE_MAX_RECURSION_DEPTH = 2;
export const DECISION_CONFIDENCE_MIN_CONFIDENCE_SCORE = 0.48;
export const DECISION_CONFIDENCE_MAX_INFLATED_SCORE = 0.94;

const lastEvalAtByOrg = new Map<string, number>();
let confidenceDepth = 0;

export function beginDecisionConfidenceEvaluation(): boolean {
  if (confidenceDepth >= DECISION_CONFIDENCE_MAX_RECURSION_DEPTH) return false;
  confidenceDepth += 1;
  return true;
}

export function endDecisionConfidenceEvaluation(): void {
  confidenceDepth = Math.max(0, confidenceDepth - 1);
}

export function shouldEvaluateDecisionConfidence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DECISION_CONFIDENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampConfidenceScore(score: number): number {
  return Number(
    Math.min(
      DECISION_CONFIDENCE_MAX_INFLATED_SCORE,
      Math.max(DECISION_CONFIDENCE_MIN_CONFIDENCE_SCORE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveDecisionConfidence(
  confidence: ExecutiveDecisionConfidence | null | undefined
): confidence is ExecutiveDecisionConfidence {
  if (!confidence) return false;
  if (!confidence.confidenceId.trim() || !confidence.summary.trim()) return false;
  if (confidence.confidenceScore < DECISION_CONFIDENCE_MIN_CONFIDENCE_SCORE) return false;
  if (confidence.confidenceScore > DECISION_CONFIDENCE_MAX_INFLATED_SCORE) return false;
  return Number.isFinite(confidence.generatedAt);
}

export function shouldRetainExecutiveDecisionConfidence(
  confidence: ExecutiveDecisionConfidence
): boolean {
  if (!validateExecutiveDecisionConfidence(confidence)) return false;
  if (
    confidence.certaintyState === "uncertain" &&
    confidence.confidenceLevel === "executive_grade"
  ) {
    return false;
  }
  if (confidence.certaintyState === "fragmented" && confidence.confidenceScore > 0.88) {
    return false;
  }
  return true;
}

export function certaintyStateRank(state: ExecutiveDecisionConfidence["certaintyState"]): number {
  const ranks: Record<ExecutiveDecisionConfidence["certaintyState"], number> = {
    uncertain: 1,
    fragmented: 2,
    stabilizing: 3,
    reliable: 4,
    highly_confident: 5,
  };
  return ranks[state];
}

export function confidenceLevelRank(
  level: ExecutiveDecisionConfidence["confidenceLevel"]
): number {
  const ranks: Record<ExecutiveDecisionConfidence["confidenceLevel"], number> = {
    weak: 1,
    limited: 2,
    moderate: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[level];
}

export function scoreToConfidenceLevel(score: number): ExecutiveDecisionConfidence["confidenceLevel"] {
  if (score >= 0.9) return "executive_grade";
  if (score >= 0.78) return "strong";
  if (score >= 0.62) return "moderate";
  if (score >= 0.52) return "limited";
  return "weak";
}

export function resetDecisionConfidenceGuards(): void {
  lastEvalAtByOrg.clear();
  confidenceDepth = 0;
}
