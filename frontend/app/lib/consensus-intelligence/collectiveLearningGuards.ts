import type { EnterpriseIntelligenceEvolution } from "./collectiveLearningTypes";

export const COLLECTIVE_LEARNING_MAX_EVOLUTIONS = 10;
export const COLLECTIVE_LEARNING_MAX_SNAPSHOTS = 8;
export const COLLECTIVE_LEARNING_MAX_SIGNALS = 10;
export const COLLECTIVE_LEARNING_MAX_MATURITY = 10;
export const COLLECTIVE_LEARNING_MAX_FIELDS = 8;
export const COLLECTIVE_LEARNING_MIN_EVAL_INTERVAL_MS = 500;
export const COLLECTIVE_LEARNING_MAX_RECURSION_DEPTH = 2;
export const COLLECTIVE_LEARNING_MIN_CONFIDENCE = 0.48;
export const COLLECTIVE_LEARNING_MAX_INFLATED_CONFIDENCE = 0.94;
export const COLLECTIVE_LEARNING_MIN_UNIFIED_LAYERS = 3;
export const COLLECTIVE_LEARNING_MIN_DIVERSITY_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let learningDepth = 0;

export function beginCollectiveLearningEvaluation(): boolean {
  if (learningDepth >= COLLECTIVE_LEARNING_MAX_RECURSION_DEPTH) return false;
  learningDepth += 1;
  return true;
}

export function endCollectiveLearningEvaluation(): void {
  learningDepth = Math.max(0, learningDepth - 1);
}

export function shouldEvaluateCollectiveLearning(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COLLECTIVE_LEARNING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampLearningConfidence(score: number): number {
  return Number(
    Math.min(
      COLLECTIVE_LEARNING_MAX_INFLATED_CONFIDENCE,
      Math.max(COLLECTIVE_LEARNING_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateEnterpriseIntelligenceEvolution(
  evolution: EnterpriseIntelligenceEvolution | null | undefined
): evolution is EnterpriseIntelligenceEvolution {
  if (!evolution) return false;
  if (!evolution.learningId.trim() || !evolution.summary.trim()) return false;
  if (evolution.confidence < COLLECTIVE_LEARNING_MIN_CONFIDENCE) return false;
  if (evolution.confidence > COLLECTIVE_LEARNING_MAX_INFLATED_CONFIDENCE) return false;
  if (evolution.learningSignals.length < 1) return false;
  return Number.isFinite(evolution.generatedAt);
}

export function shouldRetainEnterpriseIntelligenceEvolution(
  evolution: EnterpriseIntelligenceEvolution
): boolean {
  if (!validateEnterpriseIntelligenceEvolution(evolution)) return false;
  if (
    evolution.learningState === "strategically_mature" &&
    evolution.evolutionStrength === "weak"
  ) {
    return false;
  }
  if (evolution.learningState === "fragmented" && evolution.confidence > 0.92) {
    return false;
  }
  return true;
}

export function evolutionStrengthRank(
  strength: EnterpriseIntelligenceEvolution["evolutionStrength"]
): number {
  const ranks: Record<EnterpriseIntelligenceEvolution["evolutionStrength"], number> = {
    weak: 1,
    developing: 2,
    adaptive: 3,
    mature: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function learningStateRank(state: EnterpriseIntelligenceEvolution["learningState"]): number {
  const ranks: Record<EnterpriseIntelligenceEvolution["learningState"], number> = {
    fragmented: 1,
    emerging: 2,
    evolving: 3,
    consolidating: 4,
    strategically_mature: 5,
  };
  return ranks[state];
}

export function resetCollectiveLearningGuards(): void {
  lastEvalAtByOrg.clear();
  learningDepth = 0;
}
