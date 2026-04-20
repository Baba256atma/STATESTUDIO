/**
 * B.23 — Governance types + signature helper (no heavy imports; safe for scenario builder).
 */

export type NexoraBiasGovernanceConfig = {
  enabled: boolean;
  strength: number;
  minRatedRuns: number;
  allowPreferredOptionBias: boolean;
  allowDiscouragedOptionBias: boolean;
};

export type NexoraBiasGovernanceResult = {
  enabled: boolean;
  effectiveStrength: number;
  blocked: boolean;
  blockReason?: string | null;
  summary: string | null;
};

export const DEFAULT_NEXORA_BIAS_GOVERNANCE: NexoraBiasGovernanceConfig = {
  enabled: true,
  strength: 0.35,
  minRatedRuns: 3,
  allowPreferredOptionBias: true,
  allowDiscouragedOptionBias: true,
};

/** @param operatorMode B.24 — affects compare/simulate signature without ingestion. */
export function biasGovernanceSignaturePart(
  gov: NexoraBiasGovernanceResult | null | undefined,
  operatorMode: "adaptive" | "pure" = "adaptive"
): string {
  const m = operatorMode === "pure" ? "p" : "a";
  if (!gov) return `|gov:-|m:${m}`;
  const br = String(gov.blockReason ?? "").slice(0, 12);
  return `|gov:${gov.blocked ? 1 : 0}:${gov.effectiveStrength.toFixed(3)}:${br}|m:${m}`;
}
