/** E2:58 — Executive scene readability audit (development only). */

export type ExecutiveSceneReadabilityReport = {
  objectCount: number;
  visibleNameCount: number;
  legacyTooltipCount: number;
  estimatedOverlapRisk: "low" | "medium" | "high";
  selectionClarity: "clear" | "mixed" | "weak";
  warnings: string[];
};

export type ExecutiveSceneReadabilityInput = {
  objectCount: number;
  visibleNameCount: number;
  legacyTooltipCount: number;
  selectedObjectId: string | null;
  densityTier: string;
};

const logKeys = new Set<string>();

export function auditExecutiveSceneReadability(
  input: ExecutiveSceneReadabilityInput
): ExecutiveSceneReadabilityReport {
  const warnings: string[] = [];

  if (input.legacyTooltipCount > 0) {
    warnings.push("legacy_floating_tooltips_detected");
  }

  if (input.visibleNameCount < input.objectCount * 0.5 && input.objectCount <= 50) {
    warnings.push("insufficient_persistent_name_coverage");
  }

  if (input.objectCount > 50 && input.visibleNameCount > input.objectCount * 0.35) {
    warnings.push("label_clutter_risk");
  }

  const estimatedOverlapRisk =
    input.objectCount > 75 ? "high" : input.objectCount > 35 ? "medium" : "low";

  const selectionClarity = input.selectedObjectId ? "clear" : input.objectCount <= 25 ? "mixed" : "weak";

  const report: ExecutiveSceneReadabilityReport = {
    objectCount: input.objectCount,
    visibleNameCount: input.visibleNameCount,
    legacyTooltipCount: input.legacyTooltipCount,
    estimatedOverlapRisk,
    selectionClarity,
    warnings,
  };

  logSceneReadability(report);
  return report;
}

export function logSceneReadability(payload: ExecutiveSceneReadabilityReport): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][SceneReadability]", payload);
}

export function resetExecutiveSceneReadabilityAuditLogsForTests(): void {
  logKeys.clear();
}
