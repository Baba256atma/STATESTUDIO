import type { StrategicPerspectiveNegotiation } from "./perspectiveNegotiationTypes";

export const PERSPECTIVE_NEGOTIATION_MAX_NEGOTIATIONS = 10;
export const PERSPECTIVE_NEGOTIATION_MAX_SNAPSHOTS = 8;
export const PERSPECTIVE_NEGOTIATION_MAX_TRADEOFFS = 10;
export const PERSPECTIVE_NEGOTIATION_MAX_SIGNALS = 10;
export const PERSPECTIVE_NEGOTIATION_MAX_RECONCILIATION_FIELDS = 8;
export const PERSPECTIVE_NEGOTIATION_MIN_EVAL_INTERVAL_MS = 500;
export const PERSPECTIVE_NEGOTIATION_MAX_RECURSION_DEPTH = 2;
export const PERSPECTIVE_NEGOTIATION_MIN_CONFIDENCE = 0.48;
export const PERSPECTIVE_NEGOTIATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const PERSPECTIVE_NEGOTIATION_MIN_UNIFIED_LAYERS = 3;
export const PERSPECTIVE_NEGOTIATION_MIN_CONSENSUS_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let negotiationDepth = 0;

export function beginPerspectiveNegotiationEvaluation(): boolean {
  if (negotiationDepth >= PERSPECTIVE_NEGOTIATION_MAX_RECURSION_DEPTH) return false;
  negotiationDepth += 1;
  return true;
}

export function endPerspectiveNegotiationEvaluation(): void {
  negotiationDepth = Math.max(0, negotiationDepth - 1);
}

export function shouldEvaluatePerspectiveNegotiation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PERSPECTIVE_NEGOTIATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampNegotiationConfidence(score: number): number {
  return Number(
    Math.min(
      PERSPECTIVE_NEGOTIATION_MAX_INFLATED_CONFIDENCE,
      Math.max(PERSPECTIVE_NEGOTIATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicPerspectiveNegotiation(
  negotiation: StrategicPerspectiveNegotiation | null | undefined
): negotiation is StrategicPerspectiveNegotiation {
  if (!negotiation) return false;
  if (!negotiation.negotiationId.trim() || !negotiation.summary.trim()) return false;
  if (negotiation.confidence < PERSPECTIVE_NEGOTIATION_MIN_CONFIDENCE) return false;
  if (negotiation.confidence > PERSPECTIVE_NEGOTIATION_MAX_INFLATED_CONFIDENCE) return false;
  if (negotiation.negotiationSignals.length < 1) return false;
  return Number.isFinite(negotiation.generatedAt);
}

export function shouldRetainStrategicPerspectiveNegotiation(
  negotiation: StrategicPerspectiveNegotiation
): boolean {
  if (!validateStrategicPerspectiveNegotiation(negotiation)) return false;
  if (negotiation.resolutionState === "reconciled" && negotiation.negotiationStrength === "weak") {
    return false;
  }
  if (negotiation.resolutionState === "unresolved" && negotiation.confidence > 0.9) {
    return false;
  }
  return true;
}

export function negotiationStrengthRank(
  strength: StrategicPerspectiveNegotiation["negotiationStrength"]
): number {
  const ranks: Record<StrategicPerspectiveNegotiation["negotiationStrength"], number> = {
    weak: 1,
    partial: 2,
    moderate: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[strength];
}

export function resolutionStateRank(
  state: StrategicPerspectiveNegotiation["resolutionState"]
): number {
  const ranks: Record<StrategicPerspectiveNegotiation["resolutionState"], number> = {
    unresolved: 1,
    contested: 2,
    negotiating: 3,
    partially_resolved: 4,
    reconciled: 5,
  };
  return ranks[state];
}

export function resetPerspectiveNegotiationGuards(): void {
  lastEvalAtByOrg.clear();
  negotiationDepth = 0;
}
