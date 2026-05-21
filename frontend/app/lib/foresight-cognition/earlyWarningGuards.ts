import type { PreEscalationSignal } from "./earlyWarningTypes";

export const EARLY_WARNING_MAX_SIGNALS = 10;
export const EARLY_WARNING_MAX_SNAPSHOTS = 8;
export const EARLY_WARNING_MAX_PATTERNS = 8;
export const EARLY_WARNING_MAX_PRECURSOR_FIELDS = 8;
export const EARLY_WARNING_MAX_INDICATORS = 10;
export const EARLY_WARNING_MIN_EVAL_INTERVAL_MS = 500;
export const EARLY_WARNING_MAX_RECURSION_DEPTH = 2;
export const EARLY_WARNING_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let warningDepth = 0;

export function beginEarlyWarningEvaluation(): boolean {
  if (warningDepth >= EARLY_WARNING_MAX_RECURSION_DEPTH) return false;
  warningDepth += 1;
  return true;
}

export function endEarlyWarningEvaluation(): void {
  warningDepth = Math.max(0, warningDepth - 1);
}

export function shouldEvaluateEarlyWarning(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < EARLY_WARNING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validatePreEscalationSignal(
  signal: PreEscalationSignal | null | undefined
): signal is PreEscalationSignal {
  if (!signal) return false;
  if (!signal.warningId.trim() || !signal.summary.trim()) return false;
  if (signal.confidence < EARLY_WARNING_MIN_CONFIDENCE) return false;
  if (signal.warningSignals.length === 0) return false;
  return Number.isFinite(signal.generatedAt);
}

export function shouldRetainPreEscalationSignal(signal: PreEscalationSignal): boolean {
  if (!validatePreEscalationSignal(signal)) return false;
  if (signal.warningSeverity === "low" && signal.confidence < 0.62) return false;
  if (signal.escalationState === "dormant" && signal.warningSeverity === "low") return false;
  return true;
}

export function confidenceToEarlyWarningLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function severityRank(severity: PreEscalationSignal["warningSeverity"]): number {
  const ranks: Record<PreEscalationSignal["warningSeverity"], number> = {
    low: 1,
    moderate: 2,
    elevated: 3,
    critical: 4,
  };
  return ranks[severity];
}

export function resetEarlyWarningGuards(): void {
  lastEvalAtByOrg.clear();
  warningDepth = 0;
}
