import type { StrategicOpportunitySignal } from "./positiveDriftTypes";

export const POSITIVE_DRIFT_MAX_SIGNALS = 10;
export const POSITIVE_DRIFT_MAX_SNAPSHOTS = 8;
export const POSITIVE_DRIFT_MAX_PATTERNS = 8;
export const POSITIVE_DRIFT_MAX_OPPORTUNITY_FIELDS = 8;
export const POSITIVE_DRIFT_MAX_EVOLUTION_SIGNALS = 10;
export const POSITIVE_DRIFT_MIN_EVAL_INTERVAL_MS = 500;
export const POSITIVE_DRIFT_MAX_RECURSION_DEPTH = 2;
export const POSITIVE_DRIFT_MIN_CONFIDENCE = 0.5;

const lastEvalAtByOrg = new Map<string, number>();
let positiveDriftDepth = 0;

export function beginPositiveDriftEvaluation(): boolean {
  if (positiveDriftDepth >= POSITIVE_DRIFT_MAX_RECURSION_DEPTH) return false;
  positiveDriftDepth += 1;
  return true;
}

export function endPositiveDriftEvaluation(): void {
  positiveDriftDepth = Math.max(0, positiveDriftDepth - 1);
}

export function shouldEvaluatePositiveDrift(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < POSITIVE_DRIFT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateStrategicOpportunitySignal(
  signal: StrategicOpportunitySignal | null | undefined
): signal is StrategicOpportunitySignal {
  if (!signal) return false;
  if (!signal.opportunityId.trim() || !signal.summary.trim()) return false;
  if (signal.confidence < POSITIVE_DRIFT_MIN_CONFIDENCE) return false;
  if (signal.opportunitySignals.length === 0) return false;
  return Number.isFinite(signal.generatedAt);
}

export function shouldRetainStrategicOpportunitySignal(
  signal: StrategicOpportunitySignal,
  options?: { fragilityElevated?: boolean; pressureStressed?: boolean }
): boolean {
  if (!validateStrategicOpportunitySignal(signal)) return false;
  if (signal.opportunityStrength === "weak" && signal.confidence < 0.66) return false;

  const fragile = options?.fragilityElevated ?? false;
  const pressured = options?.pressureStressed ?? false;
  if (
    fragile &&
    pressured &&
    signal.category !== "resilience_growth" &&
    signal.category !== "recovery_acceleration" &&
    signal.confidence < 0.82
  ) {
    return false;
  }

  return true;
}

export function confidenceToPositiveDriftLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function strengthRank(strength: StrategicOpportunitySignal["opportunityStrength"]): number {
  const ranks: Record<StrategicOpportunitySignal["opportunityStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    accelerating: 4,
  };
  return ranks[strength];
}

export function resetPositiveDriftGuards(): void {
  lastEvalAtByOrg.clear();
  positiveDriftDepth = 0;
}
