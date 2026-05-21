import type { StrategicStabilityOptimization } from "./stabilityOptimizationTypes";

export const STABILITY_OPTIMIZATION_MAX_OPTIMIZATIONS = 10;
export const STABILITY_OPTIMIZATION_MAX_SNAPSHOTS = 8;
export const STABILITY_OPTIMIZATION_MAX_PATHWAYS = 10;
export const STABILITY_OPTIMIZATION_MAX_SIGNALS = 10;
export const STABILITY_OPTIMIZATION_MAX_TOPOLOGIES = 8;
export const STABILITY_OPTIMIZATION_MAX_INDICATORS = 10;
export const STABILITY_OPTIMIZATION_MIN_EVAL_INTERVAL_MS = 500;
export const STABILITY_OPTIMIZATION_MAX_RECURSION_DEPTH = 2;
export const STABILITY_OPTIMIZATION_MIN_CONFIDENCE = 0.48;
export const STABILITY_OPTIMIZATION_MAX_INFLATED_CONFIDENCE = 0.94;

const lastEvalAtByOrg = new Map<string, number>();
let optimizationDepth = 0;

export function beginStabilityOptimizationEvaluation(): boolean {
  if (optimizationDepth >= STABILITY_OPTIMIZATION_MAX_RECURSION_DEPTH) return false;
  optimizationDepth += 1;
  return true;
}

export function endStabilityOptimizationEvaluation(): void {
  optimizationDepth = Math.max(0, optimizationDepth - 1);
}

export function shouldEvaluateStabilityOptimization(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STABILITY_OPTIMIZATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampOptimizationConfidence(score: number): number {
  return Number(
    Math.min(
      STABILITY_OPTIMIZATION_MAX_INFLATED_CONFIDENCE,
      Math.max(STABILITY_OPTIMIZATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicStabilityOptimization(
  optimization: StrategicStabilityOptimization | null | undefined
): optimization is StrategicStabilityOptimization {
  if (!optimization) return false;
  if (!optimization.optimizationId.trim() || !optimization.summary.trim()) return false;
  if (optimization.confidence < STABILITY_OPTIMIZATION_MIN_CONFIDENCE) return false;
  if (optimization.confidence > STABILITY_OPTIMIZATION_MAX_INFLATED_CONFIDENCE) return false;
  if (optimization.resilienceSignals.length < 1) return false;
  return Number.isFinite(optimization.generatedAt);
}

export function shouldRetainStrategicStabilityOptimization(
  optimization: StrategicStabilityOptimization
): boolean {
  if (!validateStrategicStabilityOptimization(optimization)) return false;
  if (optimization.optimizationState === "sustainable" && optimization.confidence < 0.72) {
    return false;
  }
  if (optimization.optimizationState === "unstable" && optimization.confidence > 0.85) {
    return false;
  }
  return true;
}

export function optimizationStateRank(
  state: StrategicStabilityOptimization["optimizationState"]
): number {
  const ranks: Record<StrategicStabilityOptimization["optimizationState"], number> = {
    unstable: 1,
    stabilizing: 2,
    resilient: 3,
    adaptive: 4,
    sustainable: 5,
  };
  return ranks[state];
}

export function optimizationStrengthRank(
  strength: StrategicStabilityOptimization["optimizationStrength"]
): number {
  const ranks: Record<StrategicStabilityOptimization["optimizationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
  };
  return ranks[strength];
}

export function resetStabilityOptimizationGuards(): void {
  lastEvalAtByOrg.clear();
  optimizationDepth = 0;
}
