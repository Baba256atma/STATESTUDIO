import type { StrategicReadinessSignal } from "./preparednessCognitionTypes";

export const PREPAREDNESS_COGNITION_MAX_SIGNALS = 10;
export const PREPAREDNESS_COGNITION_MAX_SNAPSHOTS = 8;
export const PREPAREDNESS_COGNITION_MAX_CAPABILITIES = 8;
export const PREPAREDNESS_COGNITION_MAX_GAP_INDICATORS = 8;
export const PREPAREDNESS_COGNITION_MAX_RESPONSE_READINESS = 10;
export const PREPAREDNESS_COGNITION_MIN_EVAL_INTERVAL_MS = 500;
export const PREPAREDNESS_COGNITION_MAX_RECURSION_DEPTH = 2;
export const PREPAREDNESS_COGNITION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let preparednessDepth = 0;

export function beginPreparednessCognitionEvaluation(): boolean {
  if (preparednessDepth >= PREPAREDNESS_COGNITION_MAX_RECURSION_DEPTH) return false;
  preparednessDepth += 1;
  return true;
}

export function endPreparednessCognitionEvaluation(): void {
  preparednessDepth = Math.max(0, preparednessDepth - 1);
}

export function shouldEvaluatePreparednessCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PREPAREDNESS_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateStrategicReadinessSignal(
  signal: StrategicReadinessSignal | null | undefined
): signal is StrategicReadinessSignal {
  if (!signal) return false;
  if (!signal.preparednessId.trim() || !signal.summary.trim()) return false;
  if (signal.confidence < PREPAREDNESS_COGNITION_MIN_CONFIDENCE) return false;
  if (signal.preparednessSignals.length === 0) return false;
  return Number.isFinite(signal.generatedAt);
}

export function shouldRetainStrategicReadinessSignal(signal: StrategicReadinessSignal): boolean {
  if (!validateStrategicReadinessSignal(signal)) return false;
  if (signal.preparednessLevel === "weak" && signal.confidence < 0.62) return false;
  if (signal.readinessState === "unprepared" && signal.preparednessLevel === "weak") return false;
  if (signal.preparednessLevel === "resilient" && signal.confidence < 0.75) return false;
  return true;
}

export function confidenceToPreparednessLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function preparednessRank(level: StrategicReadinessSignal["preparednessLevel"]): number {
  const ranks: Record<StrategicReadinessSignal["preparednessLevel"], number> = {
    weak: 1,
    limited: 2,
    moderate: 3,
    strong: 4,
    resilient: 5,
  };
  return ranks[level];
}

export function resetPreparednessCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  preparednessDepth = 0;
}
