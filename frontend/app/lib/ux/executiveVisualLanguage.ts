import type { NormalizedSeverity } from "../intelligence/shared/normalization.ts";
import { normalizeSeverity } from "../intelligence/shared/normalization.ts";
import type { ExecutiveUxSignalLevel } from "./executiveSignalHierarchy.ts";

export type ExecutiveVisualIntensity =
  | "quiet"
  | "watch"
  | "focused"
  | "urgent";

export type ExecutiveVisualTreatment = {
  severity: NormalizedSeverity;
  intensity: ExecutiveVisualIntensity;
  emphasis: "minimal" | "standard" | "elevated";
  animation: "none" | "subtle";
  maxVisibleActions: number;
  allowFlash: false;
  colorRole: "neutral" | "information" | "attention" | "critical";
};

export function getExecutiveVisualTreatment(params: {
  severity?: string | null;
  level?: ExecutiveUxSignalLevel | null;
  active?: boolean | null;
}): ExecutiveVisualTreatment {
  const severity = normalizeSeverity(params.severity);
  const active = params.active === true;
  const level = params.level ?? "supporting_intelligence";

  if (severity === "critical" && level === "immediate_focus") {
    return {
      severity,
      intensity: "urgent",
      emphasis: "elevated",
      animation: active ? "subtle" : "none",
      maxVisibleActions: 1,
      allowFlash: false,
      colorRole: "critical",
    };
  }

  if (severity === "high" || level === "immediate_focus") {
    return {
      severity,
      intensity: "focused",
      emphasis: "elevated",
      animation: active ? "subtle" : "none",
      maxVisibleActions: 1,
      allowFlash: false,
      colorRole: "attention",
    };
  }

  if (severity === "medium" || level === "strategic_context") {
    return {
      severity,
      intensity: "watch",
      emphasis: "standard",
      animation: "none",
      maxVisibleActions: 1,
      allowFlash: false,
      colorRole: "information",
    };
  }

  return {
    severity,
    intensity: "quiet",
    emphasis: "minimal",
    animation: "none",
    maxVisibleActions: 0,
    allowFlash: false,
    colorRole: "neutral",
  };
}

export function limitExecutiveActionLabels(labels: string[], treatment: ExecutiveVisualTreatment): string[] {
  return labels
    .map((label) => String(label ?? "").trim())
    .filter(Boolean)
    .slice(0, Math.max(0, treatment.maxVisibleActions));
}
