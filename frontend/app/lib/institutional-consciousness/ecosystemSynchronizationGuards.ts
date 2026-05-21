import type { OperationalSynchronizationObservation } from "./ecosystemSynchronizationTypes";

export const ECOSYSTEM_SYNC_MAX_OBSERVATIONS = 10;
export const ECOSYSTEM_SYNC_MAX_SNAPSHOTS = 8;
export const ECOSYSTEM_SYNC_MAX_SIGNALS = 10;
export const ECOSYSTEM_SYNC_MAX_FIELDS = 8;
export const ECOSYSTEM_SYNC_MAX_TOPOLOGIES = 10;
export const ECOSYSTEM_SYNC_MIN_EVAL_INTERVAL_MS = 500;
export const ECOSYSTEM_SYNC_MAX_RECURSION_DEPTH = 2;
export const ECOSYSTEM_SYNC_MIN_CONFIDENCE = 0.48;
export const ECOSYSTEM_SYNC_MAX_INFLATED_CONFIDENCE = 0.94;
export const ECOSYSTEM_SYNC_MIN_UNIFIED_LAYERS = 3;
export const ECOSYSTEM_SYNC_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const ECOSYSTEM_SYNC_MIN_CONSCIOUSNESS_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let syncDepth = 0;

export function beginEcosystemSynchronizationEvaluation(): boolean {
  if (syncDepth >= ECOSYSTEM_SYNC_MAX_RECURSION_DEPTH) return false;
  syncDepth += 1;
  return true;
}

export function endEcosystemSynchronizationEvaluation(): void {
  syncDepth = Math.max(0, syncDepth - 1);
}

export function shouldEvaluateEcosystemSynchronization(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < ECOSYSTEM_SYNC_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampEcosystemSyncConfidence(score: number): number {
  return Number(
    Math.min(
      ECOSYSTEM_SYNC_MAX_INFLATED_CONFIDENCE,
      Math.max(ECOSYSTEM_SYNC_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateOperationalSynchronizationObservation(
  observation: OperationalSynchronizationObservation | null | undefined
): observation is OperationalSynchronizationObservation {
  if (!observation) return false;
  if (!observation.synchronizationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < ECOSYSTEM_SYNC_MIN_CONFIDENCE) return false;
  if (observation.confidence > ECOSYSTEM_SYNC_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.synchronizationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainOperationalSynchronizationObservation(
  observation: OperationalSynchronizationObservation
): boolean {
  if (!validateOperationalSynchronizationObservation(observation)) return false;
  if (
    observation.coordinationState === "civilization_coherent" &&
    observation.synchronizationStrength === "weak"
  ) {
    return false;
  }
  if (observation.coordinationState === "disconnected" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function synchronizationStrengthRank(
  strength: OperationalSynchronizationObservation["synchronizationStrength"]
): number {
  const ranks: Record<OperationalSynchronizationObservation["synchronizationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function coordinationStateRank(
  state: OperationalSynchronizationObservation["coordinationState"]
): number {
  const ranks: Record<OperationalSynchronizationObservation["coordinationState"], number> = {
    disconnected: 1,
    partially_connected: 2,
    synchronized: 3,
    systemically_integrated: 4,
    civilization_coherent: 5,
  };
  return ranks[state];
}

export function resetEcosystemSynchronizationGuards(): void {
  lastEvalAtByOrg.clear();
  syncDepth = 0;
}
