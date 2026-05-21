import type { TotalSystemBalanceObservation } from "./strategicEquilibriumTypes";

export const STRATEGIC_EQUILIBRIUM_MAX_OBSERVATIONS = 10;
export const STRATEGIC_EQUILIBRIUM_MAX_SNAPSHOTS = 8;
export const STRATEGIC_EQUILIBRIUM_MAX_SIGNALS = 10;
export const STRATEGIC_EQUILIBRIUM_MAX_FIELDS = 8;
export const STRATEGIC_EQUILIBRIUM_MAX_IMBALANCE_INDICATORS = 10;
export const STRATEGIC_EQUILIBRIUM_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_EQUILIBRIUM_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_EQUILIBRIUM_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_EQUILIBRIUM_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_EQUILIBRIUM_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_EQUILIBRIUM_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_EQUILIBRIUM_MIN_STRATEGIC_COHERENCE_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicEquilibriumDepth = 0;

export function beginStrategicEquilibriumEvaluation(): boolean {
  if (strategicEquilibriumDepth >= STRATEGIC_EQUILIBRIUM_MAX_RECURSION_DEPTH) return false;
  strategicEquilibriumDepth += 1;
  return true;
}

export function endStrategicEquilibriumEvaluation(): void {
  strategicEquilibriumDepth = Math.max(0, strategicEquilibriumDepth - 1);
}

export function shouldEvaluateStrategicEquilibrium(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_EQUILIBRIUM_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicEquilibriumConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_EQUILIBRIUM_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_EQUILIBRIUM_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicEquilibriumObservation(
  observation: TotalSystemBalanceObservation | null | undefined
): observation is TotalSystemBalanceObservation {
  if (!observation) return false;
  if (!observation.equilibriumId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_EQUILIBRIUM_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_EQUILIBRIUM_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.balanceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainStrategicEquilibriumObservation(
  observation: TotalSystemBalanceObservation
): boolean {
  if (!validateStrategicEquilibriumObservation(observation)) return false;
  if (
    observation.equilibriumState === "strategically_stable" &&
    observation.balanceStrength === "weak"
  ) {
    return false;
  }
  if (observation.equilibriumState === "imbalanced" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function balanceStrengthRank(
  strength: TotalSystemBalanceObservation["balanceStrength"]
): number {
  const ranks: Record<TotalSystemBalanceObservation["balanceStrength"], number> = {
    weak: 1,
    moderate: 2,
    balanced: 3,
    stable: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function equilibriumStateRank(
  state: TotalSystemBalanceObservation["equilibriumState"]
): number {
  const ranks: Record<TotalSystemBalanceObservation["equilibriumState"], number> = {
    imbalanced: 1,
    unstable: 2,
    rebalancing: 3,
    balanced: 4,
    strategically_stable: 5,
  };
  return ranks[state];
}

export function resetStrategicEquilibriumGuards(): void {
  lastEvalAtByOrg.clear();
  strategicEquilibriumDepth = 0;
}
