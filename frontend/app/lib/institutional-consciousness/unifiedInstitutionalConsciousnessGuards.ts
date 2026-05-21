import type { CivilizationScaleEnterpriseSnapshot } from "./unifiedInstitutionalConsciousnessTypes";

export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS = 8;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_HISTORY = 10;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_SUBSYSTEM_STATES = 9;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_RUNTIME_SIGNALS = 8;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_EVAL_INTERVAL_MS = 500;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_RECURSION_DEPTH = 2;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_CONFIDENCE = 0.48;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_INFLATED_CONFIDENCE = 0.94;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_STEWARDSHIP_DEPTH = 1;
export const UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_ACTIVE_SUBSYSTEMS = 5;

const lastEvalAtByOrg = new Map<string, number>();
let unifiedInstitutionalDepth = 0;

export function beginUnifiedInstitutionalConsciousnessEvaluation(): boolean {
  if (unifiedInstitutionalDepth >= UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_RECURSION_DEPTH) {
    return false;
  }
  unifiedInstitutionalDepth += 1;
  return true;
}

export function endUnifiedInstitutionalConsciousnessEvaluation(): void {
  unifiedInstitutionalDepth = Math.max(0, unifiedInstitutionalDepth - 1);
}

export function shouldEvaluateUnifiedInstitutionalConsciousness(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampUnifiedInstitutionalConsciousnessConfidence(score: number): number {
  return Number(
    Math.min(
      UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MAX_INFLATED_CONFIDENCE,
      Math.max(UNIFIED_INSTITUTIONAL_CONSCIOUSNESS_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCivilizationScaleEnterpriseSnapshot(
  snapshot: CivilizationScaleEnterpriseSnapshot | null | undefined
): snapshot is CivilizationScaleEnterpriseSnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (snapshot.activeSubsystems.length < 1) return false;
  if (snapshot.subsystemStates.length < 1) return false;
  if (!snapshot.summary.primaryMacroRisk.trim()) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function runtimeStatusRank(
  status: CivilizationScaleEnterpriseSnapshot["runtimeStatus"]
): number {
  const ranks: Record<CivilizationScaleEnterpriseSnapshot["runtimeStatus"], number> = {
    initializing: 1,
    pressured: 2,
    recovering: 3,
    adaptive: 4,
    stable: 5,
  };
  return ranks[status];
}

export function awarenessLevelRank(
  level: CivilizationScaleEnterpriseSnapshot["awarenessLevel"]
): number {
  const ranks: Record<CivilizationScaleEnterpriseSnapshot["awarenessLevel"], number> = {
    weak: 1,
    moderate: 2,
    systemic: 3,
    institutional_grade: 4,
    civilization_scale: 5,
  };
  return ranks[level];
}

export function resetUnifiedInstitutionalConsciousnessGuards(): void {
  lastEvalAtByOrg.clear();
  unifiedInstitutionalDepth = 0;
}
