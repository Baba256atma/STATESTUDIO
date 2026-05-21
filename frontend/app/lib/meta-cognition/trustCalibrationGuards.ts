import type { StrategicTrustAdjustment } from "./trustCalibrationTypes";

export const TRUST_CALIBRATION_MAX_ADJUSTMENTS = 10;
export const TRUST_CALIBRATION_MAX_SNAPSHOTS = 8;
export const TRUST_CALIBRATION_MAX_SIGNALS = 10;
export const TRUST_CALIBRATION_MAX_FIELDS = 10;
export const TRUST_CALIBRATION_MAX_INDICATORS = 8;
export const TRUST_CALIBRATION_MIN_EVAL_INTERVAL_MS = 500;
export const TRUST_CALIBRATION_MAX_RECURSION_DEPTH = 2;
export const TRUST_CALIBRATION_MIN_CONFIDENCE = 0.48;
export const TRUST_CALIBRATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const TRUST_CALIBRATION_MIN_UNIFIED_LAYERS = 3;
export const TRUST_CALIBRATION_MIN_EXPLAINABILITY_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let trustDepth = 0;

export function beginTrustCalibrationEvaluation(): boolean {
  if (trustDepth >= TRUST_CALIBRATION_MAX_RECURSION_DEPTH) return false;
  trustDepth += 1;
  return true;
}

export function endTrustCalibrationEvaluation(): void {
  trustDepth = Math.max(0, trustDepth - 1);
}

export function shouldEvaluateTrustCalibration(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TRUST_CALIBRATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampTrustCalibrationConfidence(score: number): number {
  return Number(
    Math.min(
      TRUST_CALIBRATION_MAX_INFLATED_CONFIDENCE,
      Math.max(TRUST_CALIBRATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicTrustAdjustment(
  adjustment: StrategicTrustAdjustment | null | undefined
): adjustment is StrategicTrustAdjustment {
  if (!adjustment) return false;
  if (!adjustment.trustCalibrationId.trim() || !adjustment.summary.trim()) return false;
  if (adjustment.confidence < TRUST_CALIBRATION_MIN_CONFIDENCE) return false;
  if (adjustment.confidence > TRUST_CALIBRATION_MAX_INFLATED_CONFIDENCE) return false;
  if (adjustment.reliabilitySignals.length < 1) return false;
  return Number.isFinite(adjustment.generatedAt);
}

export function shouldRetainStrategicTrustAdjustment(adjustment: StrategicTrustAdjustment): boolean {
  if (!validateStrategicTrustAdjustment(adjustment)) return false;
  if (adjustment.trustState === "highly_trustworthy" && adjustment.reliabilityStrength === "weak") {
    return false;
  }
  if (adjustment.trustState === "cautious" && adjustment.confidence > 0.9) {
    return false;
  }
  return true;
}

export function reliabilityStrengthRank(
  strength: StrategicTrustAdjustment["reliabilityStrength"]
): number {
  const ranks: Record<StrategicTrustAdjustment["reliabilityStrength"], number> = {
    weak: 1,
    limited: 2,
    moderate: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[strength];
}

export function trustStateRank(state: StrategicTrustAdjustment["trustState"]): number {
  const ranks: Record<StrategicTrustAdjustment["trustState"], number> = {
    cautious: 1,
    monitored: 2,
    conditionally_reliable: 3,
    reliable: 4,
    highly_trustworthy: 5,
  };
  return ranks[state];
}

export function resetTrustCalibrationGuards(): void {
  lastEvalAtByOrg.clear();
  trustDepth = 0;
}
