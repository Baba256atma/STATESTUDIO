import type { FinalStrategicIntelligenceSnapshot } from "./unifiedCognitiveSingularityRuntimeTypes";

export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SNAPSHOTS = 8;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_HISTORY = 10;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_SUBSYSTEM_STATES = 9;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INTELLIGENCE_SIGNALS = 8;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_EVAL_INTERVAL_MS = 500;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_CONFIDENCE = 0.48;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INFLATED_CONFIDENCE = 0.95;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_FINAL_INTEGRATION_OBSERVATIONS = 1;
export const UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_ACTIVE_SUBSYSTEMS = 7;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedCognitiveSingularityRuntimeDepth = 0;

export function beginUnifiedCognitiveSingularityRuntimeEvaluation(): boolean {
  if (
    unifiedCognitiveSingularityRuntimeDepth >=
    UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_RECURSION_DEPTH
  ) {
    return false;
  }
  unifiedCognitiveSingularityRuntimeDepth += 1;
  return true;
}

export function endUnifiedCognitiveSingularityRuntimeEvaluation(): void {
  unifiedCognitiveSingularityRuntimeDepth = Math.max(
    0,
    unifiedCognitiveSingularityRuntimeDepth - 1
  );
}

export function shouldEvaluateUnifiedCognitiveSingularityRuntime(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampUnifiedCognitiveSingularityRuntimeConfidence(score: number): number {
  return Number(
    Math.min(
      UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INFLATED_CONFIDENCE,
      Math.max(UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateFinalStrategicIntelligenceSnapshot(
  snapshot: FinalStrategicIntelligenceSnapshot | null | undefined
): snapshot is FinalStrategicIntelligenceSnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.runtimeId.trim() || !snapshot.summary.trim()) return false;
  if (snapshot.unifiedSignals.length < 1) return false;
  if (snapshot.activeSubsystems.length < 1) return false;
  if (snapshot.subsystemStates.length < 1) return false;
  if (snapshot.confidence < UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > UNIFIED_COGNITIVE_SINGULARITY_RUNTIME_MAX_INFLATED_CONFIDENCE) {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function runtimeStatusRank(
  status: FinalStrategicIntelligenceSnapshot["runtimeStatus"]
): number {
  const ranks: Record<FinalStrategicIntelligenceSnapshot["runtimeStatus"], number> = {
    degraded: 1,
    initializing: 2,
    recovering: 3,
    stable: 4,
    unified: 5,
  };
  return ranks[status];
}

export function intelligenceLevelRank(
  level: FinalStrategicIntelligenceSnapshot["intelligenceLevel"]
): number {
  const ranks: Record<FinalStrategicIntelligenceSnapshot["intelligenceLevel"], number> = {
    weak: 1,
    moderate: 2,
    coherent: 3,
    unified: 4,
    enterprise_grade: 5,
  };
  return ranks[level];
}

export function resetUnifiedCognitiveSingularityRuntimeGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedCognitiveSingularityRuntimeDepth = 0;
}
