import type { EnterpriseAnticipatorySnapshot } from "./unifiedForesightRuntimeTypes";

export const UNIFIED_FORESIGHT_RUNTIME_MAX_SNAPSHOTS = 10;
export const UNIFIED_FORESIGHT_RUNTIME_MAX_SUMMARIES = 8;
export const UNIFIED_FORESIGHT_RUNTIME_MIN_EVAL_INTERVAL_MS = 550;
export const UNIFIED_FORESIGHT_RUNTIME_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_FORESIGHT_RUNTIME_MIN_LAYER_DEPTH = 6;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedDepth = 0;

export function beginUnifiedForesightRuntimeEvaluation(): boolean {
  if (unifiedDepth >= UNIFIED_FORESIGHT_RUNTIME_MAX_RECURSION_DEPTH) return false;
  unifiedDepth += 1;
  return true;
}

export function endUnifiedForesightRuntimeEvaluation(): void {
  unifiedDepth = Math.max(0, unifiedDepth - 1);
}

export function shouldEvaluateUnifiedForesightRuntime(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_FORESIGHT_RUNTIME_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEnterpriseAnticipatorySnapshot(
  snapshot: EnterpriseAnticipatorySnapshot | null | undefined
): snapshot is EnterpriseAnticipatorySnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.dominantRisk.trim() || !snapshot.summary.recommendedFocus.trim()) {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function foresightHealthRank(
  level: EnterpriseAnticipatorySnapshot["foresightHealth"]
): number {
  const ranks = { weak: 1, moderate: 2, strong: 3, executive_grade: 4 } as const;
  return ranks[level];
}

export function runtimeSeverity(status: EnterpriseAnticipatorySnapshot["runtimeStatus"]): number {
  const ranks = {
    unstable: 1,
    degraded: 2,
    recovering: 3,
    initializing: 4,
    stable: 5,
  } as const;
  return ranks[status];
}

export function shouldRetainUnifiedForesightSnapshot(
  snapshot: EnterpriseAnticipatorySnapshot,
  layerDepth: number
): boolean {
  if (!validateEnterpriseAnticipatorySnapshot(snapshot)) return false;
  if (layerDepth < UNIFIED_FORESIGHT_RUNTIME_MIN_LAYER_DEPTH) return false;
  if (snapshot.foresightHealth === "executive_grade" && snapshot.activeSubsystems.length < 4) {
    return false;
  }
  return true;
}

export function resetUnifiedForesightRuntimeGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedDepth = 0;
}
