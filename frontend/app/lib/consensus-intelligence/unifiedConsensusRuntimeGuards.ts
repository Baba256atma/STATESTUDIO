import type { DistributedExecutiveCognitionSnapshot } from "./unifiedConsensusRuntimeTypes";

export const UNIFIED_CONSENSUS_RUNTIME_MAX_SNAPSHOTS = 8;
export const UNIFIED_CONSENSUS_RUNTIME_MAX_HISTORY = 10;
export const UNIFIED_CONSENSUS_RUNTIME_MAX_SUBSYSTEM_STATES = 9;
export const UNIFIED_CONSENSUS_RUNTIME_MIN_EVAL_INTERVAL_MS = 500;
export const UNIFIED_CONSENSUS_RUNTIME_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_CONSENSUS_RUNTIME_MIN_CONFIDENCE = 0.48;
export const UNIFIED_CONSENSUS_RUNTIME_MAX_INFLATED_CONFIDENCE = 0.94;
export const UNIFIED_CONSENSUS_RUNTIME_MIN_GOVERNANCE_DEPTH = 1;
export const UNIFIED_CONSENSUS_RUNTIME_MIN_ACTIVE_SUBSYSTEMS = 5;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedConsensusDepth = 0;

export function beginUnifiedConsensusRuntimeEvaluation(): boolean {
  if (unifiedConsensusDepth >= UNIFIED_CONSENSUS_RUNTIME_MAX_RECURSION_DEPTH) return false;
  unifiedConsensusDepth += 1;
  return true;
}

export function endUnifiedConsensusRuntimeEvaluation(): void {
  unifiedConsensusDepth = Math.max(0, unifiedConsensusDepth - 1);
}

export function shouldEvaluateUnifiedConsensusRuntime(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_CONSENSUS_RUNTIME_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampUnifiedConsensusConfidence(score: number): number {
  return Number(
    Math.min(
      UNIFIED_CONSENSUS_RUNTIME_MAX_INFLATED_CONFIDENCE,
      Math.max(UNIFIED_CONSENSUS_RUNTIME_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateDistributedExecutiveCognitionSnapshot(
  snapshot: DistributedExecutiveCognitionSnapshot | null | undefined
): snapshot is DistributedExecutiveCognitionSnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (snapshot.activeSubsystems.length < 1) return false;
  if (snapshot.subsystemStates.length < 1) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function runtimeStatusRank(
  status: DistributedExecutiveCognitionSnapshot["runtimeStatus"]
): number {
  const ranks: Record<DistributedExecutiveCognitionSnapshot["runtimeStatus"], number> = {
    initializing: 1,
    fragmented: 2,
    recovering: 3,
    adaptive: 4,
    stable: 5,
  };
  return ranks[status];
}

export function integrityLevelRank(
  level: DistributedExecutiveCognitionSnapshot["collectiveIntegrity"]
): number {
  const ranks: Record<DistributedExecutiveCognitionSnapshot["collectiveIntegrity"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    governed: 4,
    enterprise_grade: 5,
  };
  return ranks[level];
}

export function resetUnifiedConsensusRuntimeGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedConsensusDepth = 0;
}
