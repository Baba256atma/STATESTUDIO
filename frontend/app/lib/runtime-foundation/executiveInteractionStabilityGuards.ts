import type { ExecutiveInteractionStabilitySnapshot } from "./executiveInteractionStabilityTypes";

export const EXECUTIVE_INTERACTION_STABILITY_MAX_SNAPSHOTS = 8;
export const EXECUTIVE_INTERACTION_STABILITY_MAX_HISTORY = 10;
export const EXECUTIVE_INTERACTION_STABILITY_MAX_OBSERVATIONS = 8;
export const EXECUTIVE_INTERACTION_STABILITY_MAX_UI_SIGNALS = 8;
export const EXECUTIVE_INTERACTION_STABILITY_MIN_EVAL_INTERVAL_MS = 500;
export const EXECUTIVE_INTERACTION_STABILITY_MAX_RECURSION_DEPTH = 2;
export const EXECUTIVE_INTERACTION_STABILITY_MIN_CONFIDENCE = 0.48;
export const EXECUTIVE_INTERACTION_STABILITY_MAX_INFLATED_CONFIDENCE = 0.93;
export const EXECUTIVE_INTERACTION_STABILITY_MIN_OPERATIONAL_RELIABILITY_DEPTH = 1;
export const EXECUTIVE_INTERACTION_STABILITY_MIN_ACTIVE_CATEGORIES = 5;

const lastEvalAtByOrg = new Map<string, number>();
let executiveInteractionStabilityDepth = 0;

export function beginExecutiveInteractionStabilityEvaluation(): boolean {
  if (
    executiveInteractionStabilityDepth >= EXECUTIVE_INTERACTION_STABILITY_MAX_RECURSION_DEPTH
  ) {
    return false;
  }
  executiveInteractionStabilityDepth += 1;
  return true;
}

export function endExecutiveInteractionStabilityEvaluation(): void {
  executiveInteractionStabilityDepth = Math.max(0, executiveInteractionStabilityDepth - 1);
}

export function shouldEvaluateExecutiveInteractionStability(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < EXECUTIVE_INTERACTION_STABILITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampExecutiveInteractionStabilityConfidence(score: number): number {
  return Number(
    Math.min(
      EXECUTIVE_INTERACTION_STABILITY_MAX_INFLATED_CONFIDENCE,
      Math.max(EXECUTIVE_INTERACTION_STABILITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveInteractionStabilitySnapshot(
  snapshot: ExecutiveInteractionStabilitySnapshot | null | undefined
): snapshot is ExecutiveInteractionStabilitySnapshot {
  if (!snapshot) return false;
  if (!snapshot.signature.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.interactionStabilityId.trim() || !snapshot.summary.trim()) return false;
  if (snapshot.stabilitySignals.length < 1) return false;
  if (snapshot.activeStabilityCategories.length < 1) return false;
  if (snapshot.stabilityObservations.length < 1) return false;
  if (snapshot.confidence < EXECUTIVE_INTERACTION_STABILITY_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > EXECUTIVE_INTERACTION_STABILITY_MAX_INFLATED_CONFIDENCE) {
    return false;
  }
  if (snapshot.uiState === "mvp_ready" && snapshot.reliabilityLevel === "weak") {
    return false;
  }
  if (
    snapshot.reliabilityLevel === "executive_grade" &&
    snapshot.uiState !== "mvp_ready" &&
    snapshot.uiState !== "production_safe"
  ) {
    return false;
  }
  return Number.isFinite(snapshot.generatedAt);
}

export function uiStateRank(state: ExecutiveInteractionStabilitySnapshot["uiState"]): number {
  const ranks: Record<ExecutiveInteractionStabilitySnapshot["uiState"], number> = {
    unstable: 1,
    monitored: 2,
    stable: 3,
    production_safe: 4,
    mvp_ready: 5,
  };
  return ranks[state];
}

export function interactionReliabilityLevelRank(
  level: ExecutiveInteractionStabilitySnapshot["reliabilityLevel"]
): number {
  const ranks: Record<ExecutiveInteractionStabilitySnapshot["reliabilityLevel"], number> = {
    weak: 1,
    moderate: 2,
    reliable: 3,
    stable: 4,
    executive_grade: 5,
  };
  return ranks[level];
}

export function resetExecutiveInteractionStabilityGuards(): void {
  lastEvalAtByOrg.clear();
  executiveInteractionStabilityDepth = 0;
}
