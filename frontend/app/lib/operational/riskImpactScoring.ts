import { clamp01, severityRank } from "../intelligence/shared/normalization.ts";
import type {
  OperationalAttentionRecommendation,
  OperationalRiskExposureLevel,
  OperationalRiskImpactNode,
} from "./riskImpactTypes.ts";

const EXPOSURE_ORDER: readonly OperationalRiskExposureLevel[] = ["minimal", "elevated", "high", "critical"];

export function normalizeOperationalRisk(value: number): number {
  return clamp01(value);
}

/** Weighted blend of operational severity, propagation stress, and optional structural fragility. */
export function combinePropagationAndSeverity(
  operationalSeverity01: number,
  propagationScore01: number,
  fragility01?: number
): number {
  const o = normalizeOperationalRisk(operationalSeverity01);
  const p = normalizeOperationalRisk(propagationScore01);
  const f = fragility01 == null || !Number.isFinite(fragility01) ? undefined : normalizeOperationalRisk(fragility01);
  if (f == null) return normalizeOperationalRisk(o * 0.58 + p * 0.42);
  return normalizeOperationalRisk(o * 0.48 + p * 0.34 + f * 0.18);
}

export function deriveOperationalImpactScore(input: Readonly<{ combined01: number; worseningBias: number }>): number {
  const c = normalizeOperationalRisk(input.combined01);
  const b = normalizeOperationalRisk(input.worseningBias);
  return normalizeOperationalRisk(c * (0.88 + 0.12 * b));
}

export function deriveOperationalExposureLevel(score01: number): OperationalRiskExposureLevel {
  const s = normalizeOperationalRisk(score01);
  if (s >= 0.82) return "critical";
  if (s >= 0.58) return "high";
  if (s >= 0.32) return "elevated";
  return "minimal";
}

export function attentionFromExposure(level: OperationalRiskExposureLevel): OperationalAttentionRecommendation {
  switch (level) {
    case "critical":
      return "urgent";
    case "high":
      return "executive";
    case "elevated":
      return "heightened";
    default:
      return "watch";
  }
}

function exposureRank(level: OperationalRiskExposureLevel): number {
  return EXPOSURE_ORDER.indexOf(level);
}

export function maxOperationalExposureLevel(
  levels: readonly OperationalRiskExposureLevel[]
): OperationalRiskExposureLevel {
  let best: OperationalRiskExposureLevel = "minimal";
  let br = -1;
  for (const L of levels) {
    const rr = exposureRank(L);
    if (rr > br) {
      br = rr;
      best = L;
    }
  }
  return best;
}

/** Sort: higher exposure first, then higher combined operational severity proxy (severity+prop), then id. */
export function compareOperationalRiskNodes(a: OperationalRiskImpactNode, b: OperationalRiskImpactNode): number {
  const re = exposureRank(b.exposureLevel) - exposureRank(a.exposureLevel);
  if (re !== 0) return re;
  const sa = a.operationalSeverity + a.propagationScore;
  const sb = b.operationalSeverity + b.propagationScore;
  if (sb !== sa) return sb - sa;
  return a.objectId.localeCompare(b.objectId);
}

/** Map scene / scanner hints to a 0–1 structural fragility hint (thin adapter over shared normalization). */
export function sceneObjectFragility01(input: Readonly<{ scannerEmphasis?: unknown; emphasis?: unknown; scannerSeverity?: unknown }>): number | undefined {
  const e1 = input.scannerEmphasis ?? input.emphasis;
  const n1 = typeof e1 === "number" && Number.isFinite(e1) ? clamp01(e1) : 0;
  if (n1 > 0.02) return n1;
  const raw = input.scannerSeverity;
  if (raw == null) return undefined;
  return normalizeOperationalRisk(severityRank(raw) / 4);
}

export function propagationLevelToScore01(level: string): number {
  const L = String(level ?? "").trim().toLowerCase();
  if (L === "critical") return 1;
  if (L === "high") return 0.72;
  if (L === "medium") return 0.48;
  if (L === "low") return 0.22;
  return 0.35;
}
