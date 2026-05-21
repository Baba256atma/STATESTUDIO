import type {
  HardeningCheckStatus,
  MVPFinalHardeningSnapshot,
  MVPReleaseCandidateStatus,
} from "./finalStabilizationChecklistTypes";

export const FINAL_HARDENING_MAX_SNAPSHOTS = 8;
export const FINAL_HARDENING_MAX_HISTORY = 10;
export const FINAL_HARDENING_MAX_BLOCKERS = 12;
export const FINAL_HARDENING_MAX_RECOMMENDATIONS = 8;
export const FINAL_HARDENING_MIN_EVAL_INTERVAL_MS = 500;
export const FINAL_HARDENING_MAX_RECURSION_DEPTH = 2;
export const FINAL_HARDENING_MIN_CONFIDENCE = 0.48;
export const FINAL_HARDENING_MAX_INFLATED_CONFIDENCE = 0.92;

const lastEvalAtByOrg = new Map<string, number>();
const lastLoggedStatusByOrg = new Map<string, MVPReleaseCandidateStatus>();
let finalHardeningEvaluationDepth = 0;

export function beginFinalHardeningEvaluation(): boolean {
  if (finalHardeningEvaluationDepth >= FINAL_HARDENING_MAX_RECURSION_DEPTH) return false;
  finalHardeningEvaluationDepth += 1;
  return true;
}

export function endFinalHardeningEvaluation(): void {
  finalHardeningEvaluationDepth = Math.max(0, finalHardeningEvaluationDepth - 1);
}

export function shouldEvaluateFinalHardening(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < FINAL_HARDENING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampFinalHardeningConfidence(score: number): number {
  return Number(
    Math.min(
      FINAL_HARDENING_MAX_INFLATED_CONFIDENCE,
      Math.max(FINAL_HARDENING_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function releaseCandidateStatusRank(status: MVPReleaseCandidateStatus): number {
  const ranks: Record<MVPReleaseCandidateStatus, number> = {
    not_checked: 0,
    not_ready: 1,
    blocked: 2,
    warn: 3,
    ready: 4,
  };
  return ranks[status];
}

export function preventFalseReleaseCandidateStatus(
  proposed: MVPReleaseCandidateStatus,
  hasCriticalBlocker: boolean,
  hasFalseReadyRisk: boolean,
  requiredFailures: number
): { status: MVPReleaseCandidateStatus; prevented: boolean } {
  if (hasCriticalBlocker || requiredFailures > 0) {
    return {
      status: hasCriticalBlocker ? "blocked" : "not_ready",
      prevented: proposed === "ready" || proposed === "warn",
    };
  }
  if (hasFalseReadyRisk && proposed === "ready") {
    return { status: "warn", prevented: true };
  }
  return { status: proposed, prevented: false };
}

export function stabilizeReleaseCandidateOscillation(
  proposed: MVPReleaseCandidateStatus,
  prior: MVPReleaseCandidateStatus | null
): MVPReleaseCandidateStatus {
  if (!prior) return proposed;
  if (releaseCandidateStatusRank(proposed) - releaseCandidateStatusRank(prior) > 2) {
    return prior === "blocked" ? "not_ready" : prior;
  }
  return proposed;
}

export function shouldLogReleaseCandidateChange(
  organizationId: string,
  status: MVPReleaseCandidateStatus
): boolean {
  const prior = lastLoggedStatusByOrg.get(organizationId);
  if (prior === status) return false;
  lastLoggedStatusByOrg.set(organizationId, status);
  return true;
}

export function checkStatusSeverity(status: HardeningCheckStatus): number {
  const ranks: Record<HardeningCheckStatus, number> = {
    pass: 0,
    not_checked: 1,
    warn: 2,
    fail: 3,
    blocked: 4,
  };
  return ranks[status];
}

export function validateMVPFinalHardeningSnapshot(
  snapshot: MVPFinalHardeningSnapshot | null | undefined
): snapshot is MVPFinalHardeningSnapshot {
  if (!snapshot) return false;
  if (!snapshot.hardeningId.trim() || !snapshot.organizationId.trim()) return false;
  if (!snapshot.summary.trim() || !snapshot.signature.trim()) return false;
  if (snapshot.confidence < FINAL_HARDENING_MIN_CONFIDENCE) return false;
  if (snapshot.confidence > FINAL_HARDENING_MAX_INFLATED_CONFIDENCE) return false;
  return Number.isFinite(snapshot.generatedAt);
}

export function resetFinalHardeningGuards(): void {
  lastEvalAtByOrg.clear();
  lastLoggedStatusByOrg.clear();
  finalHardeningEvaluationDepth = 0;
}
