import type { EnterpriseStrategicActionSnapshot } from "./unifiedDecisionRuntimeTypes";

export const UNIFIED_DECISION_RUNTIME_MAX_SNAPSHOTS = 10;
export const UNIFIED_DECISION_RUNTIME_MAX_SUMMARIES = 8;
export const UNIFIED_DECISION_RUNTIME_MAX_ACTION_HISTORY = 10;
export const UNIFIED_DECISION_RUNTIME_MAX_SUBSYSTEM_RECORDS = 18;
export const UNIFIED_DECISION_RUNTIME_MIN_EVAL_INTERVAL_MS = 550;
export const UNIFIED_DECISION_RUNTIME_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_DECISION_RUNTIME_MIN_LAYER_DEPTH = 9;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedDepth = 0;

export function beginUnifiedDecisionRuntimeEvaluation(): boolean {
  if (unifiedDepth >= UNIFIED_DECISION_RUNTIME_MAX_RECURSION_DEPTH) return false;
  unifiedDepth += 1;
  return true;
}

export function endUnifiedDecisionRuntimeEvaluation(): void {
  unifiedDepth = Math.max(0, unifiedDepth - 1);
}

export function shouldEvaluateUnifiedDecisionRuntime(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_DECISION_RUNTIME_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEnterpriseStrategicActionSnapshot(
  snapshot: EnterpriseStrategicActionSnapshot | null | undefined
): snapshot is EnterpriseStrategicActionSnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.dominantPriority.trim() || !snapshot.summary.stabilizationFocus.trim()) {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function orchestrationHealthRank(
  level: EnterpriseStrategicActionSnapshot["orchestrationHealth"]
): number {
  const ranks = { weak: 1, moderate: 2, strong: 3, executive_grade: 4 } as const;
  return ranks[level];
}

export function runtimeSeverity(status: EnterpriseStrategicActionSnapshot["runtimeStatus"]): number {
  const ranks = {
    unstable: 1,
    degraded: 2,
    recovering: 3,
    initializing: 4,
    stable: 5,
  } as const;
  return ranks[status];
}

export function shouldRetainUnifiedDecisionSnapshot(
  snapshot: EnterpriseStrategicActionSnapshot,
  layerDepth: number
): boolean {
  if (!validateEnterpriseStrategicActionSnapshot(snapshot)) return false;
  if (layerDepth < UNIFIED_DECISION_RUNTIME_MIN_LAYER_DEPTH) return false;
  if (
    snapshot.orchestrationHealth === "executive_grade" &&
    snapshot.activeSubsystems.length < 5
  ) {
    return false;
  }
  if (snapshot.runtimeStatus === "stable" && snapshot.summary.confidenceState === "uncertain") {
    return false;
  }
  return true;
}

export function resetUnifiedDecisionRuntimeGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedDepth = 0;
}
