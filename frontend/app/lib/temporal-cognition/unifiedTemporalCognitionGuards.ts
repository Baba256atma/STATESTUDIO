import type { EnterpriseTimeIntelligenceSnapshot } from "./unifiedTemporalCognitionTypes";

export const UNIFIED_TEMPORAL_COGNITION_MAX_SNAPSHOTS = 10;
export const UNIFIED_TEMPORAL_COGNITION_MAX_EVOLUTION_SUMMARIES = 8;
export const UNIFIED_TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS = 550;
export const UNIFIED_TEMPORAL_COGNITION_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_TEMPORAL_COGNITION_MIN_LAYER_DEPTH = 8;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedDepth = 0;

export function beginUnifiedTemporalCognitionEvaluation(): boolean {
  if (unifiedDepth >= UNIFIED_TEMPORAL_COGNITION_MAX_RECURSION_DEPTH) return false;
  unifiedDepth += 1;
  return true;
}

export function endUnifiedTemporalCognitionEvaluation(): void {
  unifiedDepth = Math.max(0, unifiedDepth - 1);
}

export function shouldEvaluateUnifiedTemporalCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_TEMPORAL_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateEnterpriseTimeSnapshot(
  snapshot: EnterpriseTimeIntelligenceSnapshot | null | undefined
): snapshot is EnterpriseTimeIntelligenceSnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.dominantTrajectory.trim()) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function temporalHealthRank(level: EnterpriseTimeIntelligenceSnapshot["temporalHealth"]): number {
  const ranks = { weak: 1, moderate: 2, strong: 3, verified: 4 } as const;
  return ranks[level];
}

export function runtimeSeverity(status: EnterpriseTimeIntelligenceSnapshot["runtimeStatus"]): number {
  const ranks = {
    unstable: 1,
    degraded: 2,
    recovering: 3,
    initializing: 4,
    stable: 5,
  } as const;
  return ranks[status];
}

export function shouldRetainUnifiedTemporalSnapshot(
  snapshot: EnterpriseTimeIntelligenceSnapshot,
  layerDepth: number
): boolean {
  if (!validateEnterpriseTimeSnapshot(snapshot)) return false;
  if (layerDepth < UNIFIED_TEMPORAL_COGNITION_MIN_LAYER_DEPTH) return false;
  if (snapshot.temporalHealth === "verified" && snapshot.activeSubsystems.length < 5) {
    return false;
  }
  return true;
}

export function resetUnifiedTemporalCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedDepth = 0;
}
