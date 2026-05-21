import type { EmergingStrategicSignal } from "./foresightCognitionTypes";

export const FORESIGHT_COGNITION_MAX_SIGNALS = 12;
export const FORESIGHT_COGNITION_MAX_SNAPSHOTS = 8;
export const FORESIGHT_COGNITION_MAX_WEAK_SIGNALS = 10;
export const FORESIGHT_COGNITION_MAX_PATTERNS = 8;
export const FORESIGHT_COGNITION_MAX_PRESSURE_EMERGENCES = 8;
export const FORESIGHT_COGNITION_MAX_INDICATORS = 10;
export const FORESIGHT_COGNITION_MIN_EVAL_INTERVAL_MS = 500;
export const FORESIGHT_COGNITION_MAX_RECURSION_DEPTH = 2;
export const FORESIGHT_COGNITION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let foresightDepth = 0;

export function beginForesightCognitionEvaluation(): boolean {
  if (foresightDepth >= FORESIGHT_COGNITION_MAX_RECURSION_DEPTH) return false;
  foresightDepth += 1;
  return true;
}

export function endForesightCognitionEvaluation(): void {
  foresightDepth = Math.max(0, foresightDepth - 1);
}

export function shouldEvaluateForesightCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < FORESIGHT_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEmergingSignal(
  signal: EmergingStrategicSignal | null | undefined
): signal is EmergingStrategicSignal {
  if (!signal) return false;
  if (!signal.foresightId.trim() || !signal.summary.trim()) return false;
  if (signal.confidence < FORESIGHT_COGNITION_MIN_CONFIDENCE) return false;
  if (signal.weakSignals.length === 0) return false;
  return Number.isFinite(signal.generatedAt);
}

export function shouldRetainEmergingSignal(signal: EmergingStrategicSignal): boolean {
  if (!validateEmergingSignal(signal)) return false;
  if (signal.emergenceLevel === "weak" && signal.confidence < 0.62) return false;
  if (signal.foresightState === "dissipating" && signal.emergenceLevel === "weak") return false;
  return true;
}

export function confidenceToForesightLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function emergenceRank(level: EmergingStrategicSignal["emergenceLevel"]): number {
  const ranks: Record<EmergingStrategicSignal["emergenceLevel"], number> = {
    weak: 1,
    developing: 2,
    strengthening: 3,
    significant: 4,
  };
  return ranks[level];
}

export function resetForesightCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  foresightDepth = 0;
}
