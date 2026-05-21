import type { ExecutiveOperationalReliabilitySnapshot } from "./operationalReliabilityTypes";

export const OPERATIONAL_RELIABILITY_MAX_SNAPSHOTS = 8;
export const OPERATIONAL_RELIABILITY_MAX_HISTORY = 10;
export const OPERATIONAL_RELIABILITY_MAX_OBSERVATIONS = 8;
export const OPERATIONAL_RELIABILITY_MAX_TRUST_SIGNALS = 8;
export const OPERATIONAL_RELIABILITY_MIN_EVAL_INTERVAL_MS = 500;
export const OPERATIONAL_RELIABILITY_MAX_RECURSION_DEPTH = 2;
export const OPERATIONAL_RELIABILITY_MIN_CONFIDENCE = 0.48;
export const OPERATIONAL_RELIABILITY_MAX_INFLATED_CONFIDENCE = 0.93;
export const OPERATIONAL_RELIABILITY_MIN_RUNTIME_FOUNDATION_DEPTH = 1;
export const OPERATIONAL_RELIABILITY_MIN_ACTIVE_CATEGORIES = 5;

const lastEvalAtByOrg = new Map<string, number>();
let operationalReliabilityDepth = 0;

export function beginOperationalReliabilityEvaluation(): boolean {
  if (operationalReliabilityDepth >= OPERATIONAL_RELIABILITY_MAX_RECURSION_DEPTH) {
    return false;
  }
  operationalReliabilityDepth += 1;
  return true;
}

export function endOperationalReliabilityEvaluation(): void {
  operationalReliabilityDepth = Math.max(0, operationalReliabilityDepth - 1);
}

export function shouldEvaluateOperationalReliability(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < OPERATIONAL_RELIABILITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampOperationalReliabilityConfidence(score: number): number {
  return Number(
    Math.min(
      OPERATIONAL_RELIABILITY_MAX_INFLATED_CONFIDENCE,
      Math.max(OPERATIONAL_RELIABILITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveOperationalReliabilitySnapshot(
  snapshot: ExecutiveOperationalReliabilitySnapshot | null | undefined
): snapshot is ExecutiveOperationalReliabilitySnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.reliabilityId.trim() || !snapshot.summary.trim()) return false;
  if (snapshot.reliabilitySignals.length < 1) return false;
  if (snapshot.activeReliabilityCategories.length < 1) return false;
  if (snapshot.reliabilityObservations.length < 1) return false;
  if (snapshot.confidence < OPERATIONAL_RELIABILITY_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > OPERATIONAL_RELIABILITY_MAX_INFLATED_CONFIDENCE) return false;
  if (snapshot.trustState === "executive_grade" && snapshot.reliabilityLevel !== "production_ready") {
    return false;
  }
  if (snapshot.reliabilityLevel === "production_ready" && snapshot.trustState === "untrusted") {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function trustStateRank(state: ExecutiveOperationalReliabilitySnapshot["trustState"]): number {
  const ranks: Record<ExecutiveOperationalReliabilitySnapshot["trustState"], number> = {
    untrusted: 1,
    monitored: 2,
    conditionally_trusted: 3,
    trusted: 4,
    executive_grade: 5,
  };
  return ranks[state];
}

export function operationalReliabilityLevelRank(
  level: ExecutiveOperationalReliabilitySnapshot["reliabilityLevel"]
): number {
  const ranks: Record<ExecutiveOperationalReliabilitySnapshot["reliabilityLevel"], number> = {
    weak: 1,
    moderate: 2,
    reliable: 3,
    stable: 4,
    production_ready: 5,
  };
  return ranks[level];
}

export function resetOperationalReliabilityGuards(): void {
  lastEvalAtByOrg.clear();
  operationalReliabilityDepth = 0;
}
