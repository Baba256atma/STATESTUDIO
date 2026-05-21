import type { ExecutiveStrategicDebate } from "./strategicDebateTypes";

export const STRATEGIC_DEBATE_MAX_DEBATES = 10;
export const STRATEGIC_DEBATE_MAX_SNAPSHOTS = 8;
export const STRATEGIC_DEBATE_MAX_PROJECTIONS = 10;
export const STRATEGIC_DEBATE_MAX_SIGNALS = 10;
export const STRATEGIC_DEBATE_MAX_STRESS_FIELDS = 8;
export const STRATEGIC_DEBATE_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_DEBATE_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_DEBATE_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_DEBATE_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_DEBATE_MIN_UNIFIED_LAYERS = 3;
export const STRATEGIC_DEBATE_MIN_ADVISORY_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let debateDepth = 0;

export function beginStrategicDebateEvaluation(): boolean {
  if (debateDepth >= STRATEGIC_DEBATE_MAX_RECURSION_DEPTH) return false;
  debateDepth += 1;
  return true;
}

export function endStrategicDebateEvaluation(): void {
  debateDepth = Math.max(0, debateDepth - 1);
}

export function shouldEvaluateStrategicDebate(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_DEBATE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampDebateConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_DEBATE_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_DEBATE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveStrategicDebate(
  debate: ExecutiveStrategicDebate | null | undefined
): debate is ExecutiveStrategicDebate {
  if (!debate) return false;
  if (!debate.debateId.trim() || !debate.summary.trim()) return false;
  if (debate.confidence < STRATEGIC_DEBATE_MIN_CONFIDENCE) return false;
  if (debate.confidence > STRATEGIC_DEBATE_MAX_INFLATED_CONFIDENCE) return false;
  if (debate.counterfactualSignals.length < 1) return false;
  return Number.isFinite(debate.generatedAt);
}

export function shouldRetainExecutiveStrategicDebate(debate: ExecutiveStrategicDebate): boolean {
  if (!validateExecutiveStrategicDebate(debate)) return false;
  if (
    debate.counterfactualState === "strategically_resolved" &&
    debate.debateStrength === "weak"
  ) {
    return false;
  }
  if (debate.counterfactualState === "exploratory" && debate.confidence > 0.92) {
    return false;
  }
  return true;
}

export function debateStrengthRank(strength: ExecutiveStrategicDebate["debateStrength"]): number {
  const ranks: Record<ExecutiveStrategicDebate["debateStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    executive_grade: 4,
  };
  return ranks[strength];
}

export function counterfactualStateRank(
  state: ExecutiveStrategicDebate["counterfactualState"]
): number {
  const ranks: Record<ExecutiveStrategicDebate["counterfactualState"], number> = {
    exploratory: 1,
    contested: 2,
    simulated: 3,
    stress_tested: 4,
    strategically_resolved: 5,
  };
  return ranks[state];
}

export function resetStrategicDebateGuards(): void {
  lastEvalAtByOrg.clear();
  debateDepth = 0;
}
