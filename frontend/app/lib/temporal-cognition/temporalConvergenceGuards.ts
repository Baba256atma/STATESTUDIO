import type {
  ConvergenceStrength,
  StabilityConvergencePattern,
} from "./temporalConvergenceTypes";

export const TEMPORAL_CONVERGENCE_MAX_PATTERNS = 12;
export const TEMPORAL_CONVERGENCE_MAX_SNAPSHOTS = 8;
export const TEMPORAL_CONVERGENCE_MAX_SIGNALS = 10;
export const TEMPORAL_CONVERGENCE_MAX_TRAJECTORIES = 10;
export const TEMPORAL_CONVERGENCE_MAX_SEQUENCES = 10;
export const TEMPORAL_CONVERGENCE_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_CONVERGENCE_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_CONVERGENCE_MIN_CONFIDENCE = 0.45;

const lastEvalAtByOrg = new Map<string, number>();
let convergenceDepth = 0;

const VALID_STRENGTH = new Set<ConvergenceStrength>([
  "weak",
  "moderate",
  "strong",
  "accelerating",
]);

export function beginTemporalConvergenceEvaluation(): boolean {
  if (convergenceDepth >= TEMPORAL_CONVERGENCE_MAX_RECURSION_DEPTH) return false;
  convergenceDepth += 1;
  return true;
}

export function endTemporalConvergenceEvaluation(): void {
  convergenceDepth = Math.max(0, convergenceDepth - 1);
}

export function shouldEvaluateTemporalConvergence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_CONVERGENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateConvergencePattern(
  pattern: StabilityConvergencePattern | null | undefined
): pattern is StabilityConvergencePattern {
  if (!pattern) return false;
  if (!pattern.convergenceId.trim() || !pattern.summary.trim()) return false;
  if (!VALID_STRENGTH.has(pattern.convergenceStrength)) return false;
  if (pattern.confidence < TEMPORAL_CONVERGENCE_MIN_CONFIDENCE) return false;
  if (pattern.convergenceSignals.length === 0) return false;
  return Number.isFinite(pattern.generatedAt);
}

export function shouldRetainConvergencePattern(pattern: StabilityConvergencePattern): boolean {
  if (!validateConvergencePattern(pattern)) return false;
  if (pattern.convergenceStrength === "weak" && pattern.confidence < 0.6) return false;
  if (pattern.alignmentState === "emerging" && pattern.convergenceSignals.length < 2) {
    return false;
  }
  return true;
}

export function confidenceToConvergenceLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetTemporalConvergenceGuards(): void {
  lastEvalAtByOrg.clear();
  convergenceDepth = 0;
}
