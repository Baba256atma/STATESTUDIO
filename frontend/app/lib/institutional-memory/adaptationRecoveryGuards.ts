import type {
  AdaptationBehaviorType,
  OrganizationalAdaptationRecord,
  RecoveryStabilityLevel,
} from "./adaptationRecoveryTypes";

export const ADAPTATION_RECOVERY_MAX_ADAPTATIONS = 32;
export const ADAPTATION_RECOVERY_MAX_PATTERNS = 16;
export const ADAPTATION_RECOVERY_MAX_SIGNALS = 24;
export const ADAPTATION_RECOVERY_MAX_RESILIENCE_OBS = 16;
export const ADAPTATION_RECOVERY_MIN_EVAL_INTERVAL_MS = 480;
export const ADAPTATION_RECOVERY_MAX_RECURSION_DEPTH = 2;
export const ADAPTATION_RECOVERY_MIN_CONFIDENCE = 0.35;

const lastEvalAtByOrg = new Map<string, number>();
let adaptationDepth = 0;

const VALID_ADAPTATION_TYPES = new Set<AdaptationBehaviorType>([
  "operational_adjustment",
  "coordination_recovery",
  "governance_stabilization",
  "fragility_reduction",
  "resilience_growth",
  "pressure_absorption",
  "recovery_cycle",
  "unknown",
]);

const VALID_STABILITY = new Set<RecoveryStabilityLevel>([
  "weak",
  "unstable",
  "adaptive",
  "resilient",
  "highly_resilient",
]);

export function beginAdaptationRecoveryEvaluation(): boolean {
  if (adaptationDepth >= ADAPTATION_RECOVERY_MAX_RECURSION_DEPTH) return false;
  adaptationDepth += 1;
  return true;
}

export function endAdaptationRecoveryEvaluation(): void {
  adaptationDepth = Math.max(0, adaptationDepth - 1);
}

export function shouldEvaluateAdaptationRecovery(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ADAPTATION_RECOVERY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateAdaptationRecord(
  record: OrganizationalAdaptationRecord | null | undefined
): record is OrganizationalAdaptationRecord {
  if (!record) return false;
  if (!record.adaptationId.trim() || !record.summary.trim()) return false;
  if (!VALID_ADAPTATION_TYPES.has(record.adaptationType)) return false;
  if (!VALID_STABILITY.has(record.recoveryStability)) return false;
  if (record.confidence < ADAPTATION_RECOVERY_MIN_CONFIDENCE) return false;
  return Number.isFinite(record.generatedAt);
}

/** Suppress false-positive recovery when no recovery-linked memory exists. */
export function shouldRetainAdaptationRecord(
  record: OrganizationalAdaptationRecord,
  hasRecoverySignal: boolean
): boolean {
  if (!validateAdaptationRecord(record)) return false;
  if (
    !hasRecoverySignal &&
    (record.adaptationType === "recovery_cycle" || record.adaptationType === "resilience_growth")
  ) {
    return false;
  }
  if (record.recoveryStability === "weak" && record.occurrenceCount < 2) return false;
  return true;
}

export function resetAdaptationRecoveryGuards(): void {
  lastEvalAtByOrg.clear();
  adaptationDepth = 0;
}
