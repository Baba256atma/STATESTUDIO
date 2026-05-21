import type { MVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationTypes";

export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_SNAPSHOTS = 8;
export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_HISTORY = 10;
export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_OBSERVATIONS = 8;
export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_GOVERNANCE_SIGNALS = 8;
export const ENTERPRISE_RUNTIME_FOUNDATION_MIN_EVAL_INTERVAL_MS = 500;
export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_RECURSION_DEPTH = 2;
export const ENTERPRISE_RUNTIME_FOUNDATION_MIN_CONFIDENCE = 0.48;
export const ENTERPRISE_RUNTIME_FOUNDATION_MAX_INFLATED_CONFIDENCE = 0.95;
export const ENTERPRISE_RUNTIME_FOUNDATION_MIN_UNIFIED_SINGULARITY_DEPTH = 1;
export const ENTERPRISE_RUNTIME_FOUNDATION_MIN_ACTIVE_CATEGORIES = 5;

const lastEvalAtByOrg = new Map<string, number>();
let enterpriseRuntimeFoundationDepth = 0;

export function beginEnterpriseRuntimeFoundationEvaluation(): boolean {
  if (enterpriseRuntimeFoundationDepth >= ENTERPRISE_RUNTIME_FOUNDATION_MAX_RECURSION_DEPTH) {
    return false;
  }
  enterpriseRuntimeFoundationDepth += 1;
  return true;
}

export function endEnterpriseRuntimeFoundationEvaluation(): void {
  enterpriseRuntimeFoundationDepth = Math.max(0, enterpriseRuntimeFoundationDepth - 1);
}

export function shouldEvaluateEnterpriseRuntimeFoundation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ENTERPRISE_RUNTIME_FOUNDATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampEnterpriseRuntimeFoundationConfidence(score: number): number {
  return Number(
    Math.min(
      ENTERPRISE_RUNTIME_FOUNDATION_MAX_INFLATED_CONFIDENCE,
      Math.max(ENTERPRISE_RUNTIME_FOUNDATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateMVPStrategicReadinessSnapshot(
  snapshot: MVPStrategicReadinessSnapshot | null | undefined
): snapshot is MVPStrategicReadinessSnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.runtimeFoundationId.trim() || !snapshot.summary.trim()) return false;
  if (snapshot.readinessSignals.length < 1) return false;
  if (snapshot.activeFoundationCategories.length < 1) return false;
  if (snapshot.reliabilityObservations.length < 1) return false;
  if (snapshot.confidence < ENTERPRISE_RUNTIME_FOUNDATION_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > ENTERPRISE_RUNTIME_FOUNDATION_MAX_INFLATED_CONFIDENCE) {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function runtimeFoundationStatusRank(
  status: MVPStrategicReadinessSnapshot["runtimeStatus"]
): number {
  const ranks: Record<MVPStrategicReadinessSnapshot["runtimeStatus"], number> = {
    unstable: 1,
    stabilizing: 2,
    operational: 3,
    hardened: 4,
    mvp_ready: 5,
  };
  return ranks[status];
}

export function reliabilityLevelRank(
  level: MVPStrategicReadinessSnapshot["reliabilityLevel"]
): number {
  const ranks: Record<MVPStrategicReadinessSnapshot["reliabilityLevel"], number> = {
    weak: 1,
    moderate: 2,
    reliable: 3,
    stable: 4,
    enterprise_grade: 5,
  };
  return ranks[level];
}

export function resetEnterpriseRuntimeFoundationGuards(): void {
  lastEvalAtByOrg.clear();
  enterpriseRuntimeFoundationDepth = 0;
}
