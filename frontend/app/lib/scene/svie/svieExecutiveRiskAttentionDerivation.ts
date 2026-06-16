/**
 * SVIE:2:3 — Deterministic executive attention score derivation (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieExecutiveAttentionTier } from "./svieExecutiveRiskAttentionContract.ts";

function normalizeNumericMetric(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toUnitWeight(value: number): number {
  const normalized = value <= 1 ? value : value / 100;
  return Math.min(1.5, Math.max(0.5, normalized + 0.5));
}

function readObjectMetric(object: SceneObject, key: "impact" | "confidence"): unknown {
  const direct = object[key];
  if (direct != null) return direct;
  const semantic = object.semantic?.[key];
  if (semantic != null) return semantic;
  return null;
}

export function deriveExecutiveImpactWeight(object: SceneObject | null | undefined): number {
  if (!object) return 1;
  const impact = normalizeNumericMetric(readObjectMetric(object, "impact"));
  return impact != null ? toUnitWeight(impact) : 1;
}

export function deriveExecutiveConfidenceWeight(object: SceneObject | null | undefined): number {
  if (!object) return 1;
  const confidence = normalizeNumericMetric(readObjectMetric(object, "confidence"));
  if (confidence == null) return 1;
  const normalized = confidence <= 1 ? confidence : confidence / 100;
  return Math.min(1.5, Math.max(0.5, 1.25 - normalized * 0.5));
}

export function deriveExecutiveAttentionScore(input: {
  riskScore: number;
  impactWeight: number;
  confidenceWeight: number;
}): number {
  const score = input.riskScore * input.impactWeight * input.confidenceWeight;
  return Math.round(Math.min(10000, Math.max(0, score)) * 100) / 100;
}

export function resolveExecutiveAttentionTier(rank: number): SvieExecutiveAttentionTier {
  if (rank === 1) return "top1";
  if (rank <= 3) return "top3";
  if (rank <= 5) return "top5";
  return "normal";
}
