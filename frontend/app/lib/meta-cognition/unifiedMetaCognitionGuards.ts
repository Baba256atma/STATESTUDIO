import type { EnterpriseSelfReflectiveSnapshot } from "./unifiedMetaCognitionTypes";

export const UNIFIED_META_COGNITION_MAX_SNAPSHOTS = 8;
export const UNIFIED_META_COGNITION_MAX_HISTORY = 10;
export const UNIFIED_META_COGNITION_MAX_TRUST_OBSERVATIONS = 10;
export const UNIFIED_META_COGNITION_MAX_SURVIVABILITY = 8;
export const UNIFIED_META_COGNITION_MAX_REGULATION_PATTERNS = 10;
export const UNIFIED_META_COGNITION_MAX_SUBSYSTEM_STATES = 9;
export const UNIFIED_META_COGNITION_MIN_EVAL_INTERVAL_MS = 500;
export const UNIFIED_META_COGNITION_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_META_COGNITION_MIN_CONFIDENCE = 0.48;
export const UNIFIED_META_COGNITION_MAX_INFLATED_CONFIDENCE = 0.94;
export const UNIFIED_META_COGNITION_MIN_GOVERNANCE_DEPTH = 1;
export const UNIFIED_META_COGNITION_MIN_ACTIVE_SUBSYSTEMS = 5;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedReflectionDepth = 0;

export function beginUnifiedMetaCognitionEvaluation(): boolean {
  if (unifiedReflectionDepth >= UNIFIED_META_COGNITION_MAX_RECURSION_DEPTH) return false;
  unifiedReflectionDepth += 1;
  return true;
}

export function endUnifiedMetaCognitionEvaluation(): void {
  unifiedReflectionDepth = Math.max(0, unifiedReflectionDepth - 1);
}

export function shouldEvaluateUnifiedMetaCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_META_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampUnifiedMetaCognitionConfidence(score: number): number {
  return Number(
    Math.min(
      UNIFIED_META_COGNITION_MAX_INFLATED_CONFIDENCE,
      Math.max(UNIFIED_META_COGNITION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateEnterpriseSelfReflectiveSnapshot(
  snapshot: EnterpriseSelfReflectiveSnapshot | null | undefined
): snapshot is EnterpriseSelfReflectiveSnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (snapshot.activeSubsystems.length < 1) return false;
  if (snapshot.subsystemStates.length < 1) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function runtimeStatusRank(status: EnterpriseSelfReflectiveSnapshot["runtimeStatus"]): number {
  const ranks: Record<EnterpriseSelfReflectiveSnapshot["runtimeStatus"], number> = {
    initializing: 1,
    degraded: 2,
    recovering: 3,
    adaptive: 4,
    stable: 5,
  };
  return ranks[status];
}

export function governanceHealthRank(
  level: EnterpriseSelfReflectiveSnapshot["governanceHealth"]
): number {
  const ranks: Record<EnterpriseSelfReflectiveSnapshot["governanceHealth"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    governed: 4,
    enterprise_grade: 5,
  };
  return ranks[level];
}

export function resetUnifiedMetaCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedReflectionDepth = 0;
}
