import type { ExecutiveReasoningTrace } from "./explainabilityTypes";

export const EXPLAINABILITY_MAX_TRACES = 10;
export const EXPLAINABILITY_MAX_SNAPSHOTS = 8;
export const EXPLAINABILITY_MAX_SIGNALS = 10;
export const EXPLAINABILITY_MAX_PATHWAYS = 10;
export const EXPLAINABILITY_MAX_CONFIDENCE_FIELDS = 8;
export const EXPLAINABILITY_MIN_EVAL_INTERVAL_MS = 500;
export const EXPLAINABILITY_MAX_RECURSION_DEPTH = 2;
export const EXPLAINABILITY_MIN_CONFIDENCE = 0.48;
export const EXPLAINABILITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const EXPLAINABILITY_MIN_UNIFIED_LAYERS = 3;
export const EXPLAINABILITY_MIN_UNCERTAINTY_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let explainabilityDepth = 0;

export function beginExplainabilityEvaluation(): boolean {
  if (explainabilityDepth >= EXPLAINABILITY_MAX_RECURSION_DEPTH) return false;
  explainabilityDepth += 1;
  return true;
}

export function endExplainabilityEvaluation(): void {
  explainabilityDepth = Math.max(0, explainabilityDepth - 1);
}

export function shouldEvaluateExplainability(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < EXPLAINABILITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampExplainabilityConfidence(score: number): number {
  return Number(
    Math.min(
      EXPLAINABILITY_MAX_INFLATED_CONFIDENCE,
      Math.max(EXPLAINABILITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveReasoningTrace(
  trace: ExecutiveReasoningTrace | null | undefined
): trace is ExecutiveReasoningTrace {
  if (!trace) return false;
  if (!trace.explainabilityId.trim() || !trace.summary.trim()) return false;
  if (trace.confidence < EXPLAINABILITY_MIN_CONFIDENCE) return false;
  if (trace.confidence > EXPLAINABILITY_MAX_INFLATED_CONFIDENCE) return false;
  if (trace.reasoningPathways.length < 1) return false;
  return Number.isFinite(trace.generatedAt);
}

export function shouldRetainExecutiveReasoningTrace(trace: ExecutiveReasoningTrace): boolean {
  if (!validateExecutiveReasoningTrace(trace)) return false;
  if (trace.transparencyState === "fully_transparent" && trace.explanationStrength === "weak") {
    return false;
  }
  if (trace.transparencyState === "partial" && trace.confidence > 0.9) {
    return false;
  }
  return true;
}

export function explanationStrengthRank(
  strength: ExecutiveReasoningTrace["explanationStrength"]
): number {
  const ranks: Record<ExecutiveReasoningTrace["explanationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    executive_grade: 4,
  };
  return ranks[strength];
}

export function transparencyStateRank(
  state: ExecutiveReasoningTrace["transparencyState"]
): number {
  const ranks: Record<ExecutiveReasoningTrace["transparencyState"], number> = {
    partial: 1,
    traceable: 2,
    coherent: 3,
    explainable: 4,
    fully_transparent: 5,
  };
  return ranks[state];
}

export function resetExplainabilityGuards(): void {
  lastEvalAtByOrg.clear();
  explainabilityDepth = 0;
}
