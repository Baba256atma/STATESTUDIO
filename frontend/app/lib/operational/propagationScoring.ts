import type { OperationalPropagationNode, OperationalPropagationRiskLevel } from "./propagationPreviewTypes.ts";

const RISK_ORDER: readonly OperationalPropagationRiskLevel[] = ["low", "medium", "high", "critical"];

/** Clamp numeric propagation score to [0, 1]. */
export function normalizePropagationScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function derivePropagationRiskLevel(score01: number): OperationalPropagationRiskLevel {
  const s = normalizePropagationScore(score01);
  if (s >= 0.88) return "critical";
  if (s >= 0.62) return "high";
  if (s >= 0.35) return "medium";
  return "low";
}

export function derivePropagationScore(input: Readonly<{ base01: number; hop: number; edgeWeight: number }>): number {
  const base = normalizePropagationScore(input.base01);
  const hop = Math.max(0, Math.floor(input.hop));
  const w = typeof input.edgeWeight === "number" && Number.isFinite(input.edgeWeight) ? Math.min(2, Math.max(0.25, input.edgeWeight)) : 1;
  const hopDecay = Math.pow(0.82, hop);
  return normalizePropagationScore(base * hopDecay * w);
}

function riskRank(level: OperationalPropagationRiskLevel): number {
  return RISK_ORDER.indexOf(level);
}

/** Stable comparator for sorting propagation nodes (higher risk first, then score, then id). */
export function comparePropagationNodes(a: OperationalPropagationNode, b: OperationalPropagationNode): number {
  const ra = riskRank(a.riskLevel);
  const rb = riskRank(b.riskLevel);
  if (rb !== ra) return rb - ra;
  if (b.propagationScore !== a.propagationScore) return b.propagationScore - a.propagationScore;
  return a.objectId.localeCompare(b.objectId);
}

export function maxPropagationRiskLevel(
  levels: readonly OperationalPropagationRiskLevel[]
): OperationalPropagationRiskLevel {
  let best: OperationalPropagationRiskLevel = "low";
  let bestRank = -1;
  for (const L of levels) {
    const r = riskRank(L);
    if (r > bestRank) {
      bestRank = r;
      best = L;
    }
  }
  return best;
}
