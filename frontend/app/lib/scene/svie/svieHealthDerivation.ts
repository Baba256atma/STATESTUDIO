/**
 * SVIE:1:2 — Deterministic object health derivation (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import type { SvieHealthLevel } from "./svieRuntimeFoundationContract.ts";

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

function readObjectMetric(object: SceneObject, key: "impact" | "risk" | "confidence" | "status"): unknown {
  const direct = object[key];
  if (direct != null) return direct;
  const semantic = object.semantic?.[key];
  if (semantic != null) return semantic;
  return null;
}

function hasMvpHealthSignals(object: SceneObject): boolean {
  return (
    readObjectMetric(object, "impact") != null ||
    readObjectMetric(object, "risk") != null ||
    readObjectMetric(object, "confidence") != null ||
    readObjectMetric(object, "status") != null
  );
}

function deriveHealthFromMvpMetrics(object: SceneObject): SvieHealthLevel {
  const impact = normalizeNumericMetric(readObjectMetric(object, "impact"));
  const risk = normalizeNumericMetric(readObjectMetric(object, "risk"));
  const confidence = normalizeNumericMetric(readObjectMetric(object, "confidence"));
  const status = normalizeStatusToken(readObjectMetric(object, "status"));

  if (
    (risk != null && risk >= 0.75) ||
    (impact != null && impact >= 0.85) ||
    /critical|severe|failed|blocked/.test(status)
  ) {
    return "critical";
  }

  if (
    (risk != null && risk >= 0.45) ||
    (impact != null && impact >= 0.55) ||
    /warn|degraded|at_risk|attention/.test(status)
  ) {
    return "warning";
  }

  if (
    (confidence != null && confidence >= 0.7 && (risk == null || risk < 0.35)) ||
    /opportunity|growth|upside|positive/.test(status)
  ) {
    return "opportunity";
  }

  return "healthy";
}

function deriveHealthFromLegacySignals(object: SceneObject): SvieHealthLevel | null {
  const severity =
    typeof object.scanner_severity === "string"
      ? object.scanner_severity.trim().toLowerCase()
      : typeof object.risk_kind === "string"
        ? object.risk_kind.trim().toLowerCase()
        : "";

  const emphasis = typeof object.emphasis === "number" ? object.emphasis : 0;
  const scannerEmphasis =
    typeof object.scanner_emphasis === "number" ? object.scanner_emphasis : 0;

  if (
    severity.includes("critical") ||
    severity.includes("high") ||
    severity.includes("severe") ||
    emphasis >= 0.85 ||
    scannerEmphasis >= 0.85
  ) {
    return "critical";
  }

  if (
    severity.includes("warn") ||
    severity.includes("medium") ||
    emphasis >= 0.55 ||
    scannerEmphasis >= 0.55
  ) {
    return "warning";
  }

  if (
    object.scanner_highlighted === true ||
    severity.includes("opportunity") ||
    severity.includes("growth") ||
    (Array.isArray(object.tags) && object.tags.some((tag) => /opportunity|growth/i.test(tag)))
  ) {
    return "opportunity";
  }

  return null;
}

export function deriveSvieObjectHealthLevel(object: SceneObject): SvieHealthLevel {
  if (hasMvpHealthSignals(object)) {
    return deriveHealthFromMvpMetrics(object);
  }

  return deriveHealthFromLegacySignals(object) ?? "healthy";
}
