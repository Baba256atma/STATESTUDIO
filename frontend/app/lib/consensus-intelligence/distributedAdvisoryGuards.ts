import type { DistributedExecutiveAdvisory } from "./distributedAdvisoryTypes";

export const DISTRIBUTED_ADVISORY_MAX_ADVISORIES = 10;
export const DISTRIBUTED_ADVISORY_MAX_SNAPSHOTS = 8;
export const DISTRIBUTED_ADVISORY_MAX_CONSENSUS = 10;
export const DISTRIBUTED_ADVISORY_MAX_SIGNALS = 10;
export const DISTRIBUTED_ADVISORY_MAX_FIELDS = 8;
export const DISTRIBUTED_ADVISORY_MIN_EVAL_INTERVAL_MS = 500;
export const DISTRIBUTED_ADVISORY_MAX_RECURSION_DEPTH = 2;
export const DISTRIBUTED_ADVISORY_MIN_CONFIDENCE = 0.48;
export const DISTRIBUTED_ADVISORY_MAX_INFLATED_CONFIDENCE = 0.94;
export const DISTRIBUTED_ADVISORY_MIN_UNIFIED_LAYERS = 3;
export const DISTRIBUTED_ADVISORY_MIN_WEIGHTING_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let advisoryDepth = 0;

export function beginDistributedAdvisoryEvaluation(): boolean {
  if (advisoryDepth >= DISTRIBUTED_ADVISORY_MAX_RECURSION_DEPTH) return false;
  advisoryDepth += 1;
  return true;
}

export function endDistributedAdvisoryEvaluation(): void {
  advisoryDepth = Math.max(0, advisoryDepth - 1);
}

export function shouldEvaluateDistributedAdvisory(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DISTRIBUTED_ADVISORY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampAdvisoryConfidence(score: number): number {
  return Number(
    Math.min(
      DISTRIBUTED_ADVISORY_MAX_INFLATED_CONFIDENCE,
      Math.max(DISTRIBUTED_ADVISORY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateDistributedExecutiveAdvisory(
  advisory: DistributedExecutiveAdvisory | null | undefined
): advisory is DistributedExecutiveAdvisory {
  if (!advisory) return false;
  if (!advisory.advisoryId.trim() || !advisory.summary.trim()) return false;
  if (advisory.confidence < DISTRIBUTED_ADVISORY_MIN_CONFIDENCE) return false;
  if (advisory.confidence > DISTRIBUTED_ADVISORY_MAX_INFLATED_CONFIDENCE) return false;
  if (advisory.advisorySignals.length < 1) return false;
  return Number.isFinite(advisory.generatedAt);
}

export function shouldRetainDistributedExecutiveAdvisory(
  advisory: DistributedExecutiveAdvisory
): boolean {
  if (!validateDistributedExecutiveAdvisory(advisory)) return false;
  if (
    advisory.coordinationState === "collectively_aligned" &&
    advisory.guidanceStrength === "weak"
  ) {
    return false;
  }
  if (advisory.coordinationState === "fragmented" && advisory.confidence > 0.92) {
    return false;
  }
  return true;
}

export function guidanceStrengthRank(
  strength: DistributedExecutiveAdvisory["guidanceStrength"]
): number {
  const ranks: Record<DistributedExecutiveAdvisory["guidanceStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    executive_grade: 4,
  };
  return ranks[strength];
}

export function coordinationStateRank(
  state: DistributedExecutiveAdvisory["coordinationState"]
): number {
  const ranks: Record<DistributedExecutiveAdvisory["coordinationState"], number> = {
    fragmented: 1,
    partially_aligned: 2,
    coordinated: 3,
    converging: 4,
    collectively_aligned: 5,
  };
  return ranks[state];
}

export function resetDistributedAdvisoryGuards(): void {
  lastEvalAtByOrg.clear();
  advisoryDepth = 0;
}
