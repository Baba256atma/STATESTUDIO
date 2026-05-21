import type { ExecutivePriorityArbitration } from "./priorityArbitrationTypes";

export const PRIORITY_ARBITRATION_MAX_ARBITRATIONS = 10;
export const PRIORITY_ARBITRATION_MAX_SNAPSHOTS = 8;
export const PRIORITY_ARBITRATION_MAX_CONFLICTS = 10;
export const PRIORITY_ARBITRATION_MAX_TRADEOFFS = 10;
export const PRIORITY_ARBITRATION_MAX_SIGNALS = 10;
export const PRIORITY_ARBITRATION_MIN_EVAL_INTERVAL_MS = 500;
export const PRIORITY_ARBITRATION_MAX_RECURSION_DEPTH = 2;
export const PRIORITY_ARBITRATION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let arbitrationDepth = 0;

export function beginPriorityArbitrationEvaluation(): boolean {
  if (arbitrationDepth >= PRIORITY_ARBITRATION_MAX_RECURSION_DEPTH) return false;
  arbitrationDepth += 1;
  return true;
}

export function endPriorityArbitrationEvaluation(): void {
  arbitrationDepth = Math.max(0, arbitrationDepth - 1);
}

export function shouldEvaluatePriorityArbitration(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PRIORITY_ARBITRATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateExecutivePriorityArbitration(
  arbitration: ExecutivePriorityArbitration | null | undefined
): arbitration is ExecutivePriorityArbitration {
  if (!arbitration) return false;
  if (!arbitration.arbitrationId.trim() || !arbitration.summary.trim()) return false;
  if (arbitration.confidence < PRIORITY_ARBITRATION_MIN_CONFIDENCE) return false;
  if (arbitration.competingPriorities.length < 2) return false;
  return Number.isFinite(arbitration.generatedAt);
}

export function shouldRetainExecutivePriorityArbitration(
  arbitration: ExecutivePriorityArbitration
): boolean {
  if (!validateExecutivePriorityArbitration(arbitration)) return false;
  if (arbitration.arbitrationState === "unstable" && arbitration.confidence < 0.65) {
    return false;
  }
  return true;
}

export function arbitrationStateRank(state: ExecutivePriorityArbitration["arbitrationState"]): number {
  const ranks: Record<ExecutivePriorityArbitration["arbitrationState"], number> = {
    unstable: 1,
    constrained: 2,
    tension: 3,
    balanced: 4,
    aligned: 5,
  };
  return ranks[state];
}

export function confidenceToArbitrationLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetPriorityArbitrationGuards(): void {
  lastEvalAtByOrg.clear();
  arbitrationDepth = 0;
}
