import type { EnterpriseRiskConstellation } from "./riskConstellationTypes";

export const RISK_CONSTELLATION_MAX_CONSTELLATIONS = 10;
export const RISK_CONSTELLATION_MAX_SNAPSHOTS = 8;
export const RISK_CONSTELLATION_MAX_CORRELATIONS = 10;
export const RISK_CONSTELLATION_MAX_PATTERNS = 8;
export const RISK_CONSTELLATION_MAX_EMERGENCES = 8;
export const RISK_CONSTELLATION_MAX_CLUSTERS = 8;
export const RISK_CONSTELLATION_MIN_EVAL_INTERVAL_MS = 500;
export const RISK_CONSTELLATION_MAX_RECURSION_DEPTH = 2;
export const RISK_CONSTELLATION_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let constellationDepth = 0;

export function beginRiskConstellationEvaluation(): boolean {
  if (constellationDepth >= RISK_CONSTELLATION_MAX_RECURSION_DEPTH) return false;
  constellationDepth += 1;
  return true;
}

export function endRiskConstellationEvaluation(): void {
  constellationDepth = Math.max(0, constellationDepth - 1);
}

export function shouldEvaluateRiskConstellation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < RISK_CONSTELLATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateRiskConstellation(
  constellation: EnterpriseRiskConstellation | null | undefined
): constellation is EnterpriseRiskConstellation {
  if (!constellation) return false;
  if (!constellation.constellationId.trim() || !constellation.summary.trim()) return false;
  if (constellation.confidence < RISK_CONSTELLATION_MIN_CONFIDENCE) return false;
  if (constellation.correlatedSignals.length < 2) return false;
  return Number.isFinite(constellation.generatedAt);
}

export function shouldRetainRiskConstellation(
  constellation: EnterpriseRiskConstellation
): boolean {
  if (!validateRiskConstellation(constellation)) return false;
  if (constellation.correlationStrength === "weak" && constellation.confidence < 0.62) {
    return false;
  }
  return true;
}

export function confidenceToConstellationLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function correlationRank(strength: EnterpriseRiskConstellation["correlationStrength"]): number {
  const ranks: Record<EnterpriseRiskConstellation["correlationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
  };
  return ranks[strength];
}

export function resetRiskConstellationGuards(): void {
  lastEvalAtByOrg.clear();
  constellationDepth = 0;
}
