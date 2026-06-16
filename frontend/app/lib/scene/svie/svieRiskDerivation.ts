/**
 * SVIE:2:1 — Deterministic object risk score derivation (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieRiskLevel } from "./svieRiskRuntimeContract.ts";

function normalizeNumericMetric(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normalizeStatusToken(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function toRiskPercent(value: number): number {
  const normalized = value <= 1 ? value * 100 : value;
  return Math.round(Math.min(100, Math.max(0, normalized)));
}

function readObjectMetric(object: SceneObject, key: "impact" | "risk" | "confidence" | "status"): unknown {
  const direct = object[key];
  if (direct != null) return direct;
  const semantic = object.semantic?.[key];
  if (semantic != null) return semantic;
  return null;
}

function hasRiskInputSignals(object: SceneObject): boolean {
  return (
    readObjectMetric(object, "risk") != null ||
    readObjectMetric(object, "impact") != null ||
    readObjectMetric(object, "confidence") != null ||
    readObjectMetric(object, "status") != null
  );
}

export function classifySvieRiskLevel(riskScore: number): SvieRiskLevel {
  const score = Math.round(Math.min(100, Math.max(0, riskScore)));
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function deriveSvieObjectRiskScore(object: SceneObject): number {
  if (!hasRiskInputSignals(object)) {
    return 0;
  }

  const risk = normalizeNumericMetric(readObjectMetric(object, "risk"));
  const impact = normalizeNumericMetric(readObjectMetric(object, "impact"));
  const confidence = normalizeNumericMetric(readObjectMetric(object, "confidence"));
  const status = normalizeStatusToken(readObjectMetric(object, "status"));

  let weightedScore = 0;
  let totalWeight = 0;

  if (risk != null) {
    weightedScore += toRiskPercent(risk) * 0.5;
    totalWeight += 0.5;
  }
  if (impact != null) {
    weightedScore += toRiskPercent(impact) * 0.3;
    totalWeight += 0.3;
  }
  if (confidence != null) {
    weightedScore += (100 - toRiskPercent(confidence)) * 0.2;
    totalWeight += 0.2;
  }

  let score = totalWeight > 0 ? weightedScore / totalWeight : 0;

  if (/critical|severe|failed|blocked/.test(status)) {
    score = Math.max(score, 85);
  } else if (/warn|degraded|at_risk|attention|watch/.test(status)) {
    score = Math.max(score, 50);
  } else if (/opportunity|growth|upside|positive/.test(status)) {
    score = Math.min(score, 30);
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}
