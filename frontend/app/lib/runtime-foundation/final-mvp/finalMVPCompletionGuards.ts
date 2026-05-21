import type { FinalMVPCompletionSnapshot, PublishReadyStatus } from "./finalMVPCompletionTypes";

export const FINAL_MVP_COMPLETION_MAX_SNAPSHOTS = 8;
export const FINAL_MVP_COMPLETION_MAX_HISTORY = 10;
export const FINAL_MVP_COMPLETION_MAX_BLOCKERS = 12;
export const FINAL_MVP_COMPLETION_MAX_RISKS = 10;
export const FINAL_MVP_COMPLETION_MIN_EVAL_INTERVAL_MS = 500;
export const FINAL_MVP_COMPLETION_MAX_RECURSION_DEPTH = 2;
export const FINAL_MVP_COMPLETION_MIN_CONFIDENCE = 0.48;
export const FINAL_MVP_COMPLETION_MAX_INFLATED_CONFIDENCE = 0.93;

const lastEvalAtByOrg = new Map<string, number>();
const lastLoggedStatusByOrg = new Map<string, PublishReadyStatus>();
let finalMVPCompletionDepth = 0;

export function beginFinalMVPCompletionEvaluation(): boolean {
  if (finalMVPCompletionDepth >= FINAL_MVP_COMPLETION_MAX_RECURSION_DEPTH) return false;
  finalMVPCompletionDepth += 1;
  return true;
}

export function endFinalMVPCompletionEvaluation(): void {
  finalMVPCompletionDepth = Math.max(0, finalMVPCompletionDepth - 1);
}

export function shouldEvaluateFinalMVPCompletion(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < FINAL_MVP_COMPLETION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampFinalMVPCompletionConfidence(score: number): number {
  return Number(
    Math.min(
      FINAL_MVP_COMPLETION_MAX_INFLATED_CONFIDENCE,
      Math.max(FINAL_MVP_COMPLETION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function publishReadyStatusRank(status: PublishReadyStatus): number {
  const ranks: Record<PublishReadyStatus, number> = {
    not_ready: 1,
    blocked: 2,
    demo_ready: 3,
    pilot_ready: 4,
    publish_candidate: 5,
  };
  return ranks[status];
}

export function preventFalsePublishReadyStatus(
  proposed: PublishReadyStatus,
  hasBlockers: boolean,
  evidenceComplete: boolean,
  hardeningBlocked: boolean
): { status: PublishReadyStatus; prevented: boolean } {
  if (hasBlockers || hardeningBlocked) {
    return { status: "blocked", prevented: proposed === "publish_candidate" };
  }
  if (!evidenceComplete && proposed === "publish_candidate") {
    return { status: "pilot_ready", prevented: true };
  }
  return { status: proposed, prevented: false };
}

export function stabilizePublishReadyOscillation(
  proposed: PublishReadyStatus,
  prior: PublishReadyStatus | null
): PublishReadyStatus {
  if (!prior) return proposed;
  if (publishReadyStatusRank(proposed) - publishReadyStatusRank(prior) > 2) {
    return prior === "blocked" ? "not_ready" : prior;
  }
  return proposed;
}

export function shouldLogPublishReadyChange(
  organizationId: string,
  status: PublishReadyStatus
): boolean {
  const prior = lastLoggedStatusByOrg.get(organizationId);
  if (prior === status) return false;
  lastLoggedStatusByOrg.set(organizationId, status);
  return true;
}

export function validateFinalMVPCompletionSnapshot(
  snapshot: FinalMVPCompletionSnapshot | null | undefined
): snapshot is FinalMVPCompletionSnapshot {
  if (!snapshot) return false;
  if (!snapshot.finalMVPId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.trim() || !snapshot.signature.trim()) return false;
  if (!snapshot.recommendedNextAction.trim()) return false;
  if (snapshot.confidence < FINAL_MVP_COMPLETION_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > FINAL_MVP_COMPLETION_MAX_INFLATED_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function resetFinalMVPCompletionGuards(): void {
  lastEvalAtByOrg.clear();
  lastLoggedStatusByOrg.clear();
  finalMVPCompletionDepth = 0;
}
