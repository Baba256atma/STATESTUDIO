import type { ExecutiveReasoningTransparency } from "./executiveReasoningTransparencyTypes";

const emitted = new Set<string>();

export function logReasoningTransparencyDiagnostics(transparency: ExecutiveReasoningTransparency): void {
  if (process.env.NODE_ENV === "production") return;

  const warnings: string[] = [];
  if (!transparency.primarySignals.length) warnings.push("fragmented_reasoning_visibility");
  if (transparency.assumptions.some((a) => a.stability === "weak")) warnings.push("unstable_assumption_rendering");
  if (transparency.uncertaintySources.some((u) => u.severity === "high")) {
    warnings.push("confidence_explanation_drift");
  }
  if (transparency.confidenceFactors.length < 2) warnings.push("confidence_explanation_thin");
  if (!transparency.reasoningSummary) warnings.push("advisory_explanation_recomputation_risk");
  if (transparency.advisoryLimits.length === 0) warnings.push("reasoning_continuity_degradation");

  if (!warnings.length) return;

  const signature = `${transparency.signature}|${warnings.join(",")}`;
  if (emitted.has(signature)) return;
  emitted.add(signature);

  globalThis.console.debug("[Nexora][ReasoningTransparency][Diagnostics]", {
    advisoryId: transparency.advisoryId,
    signature: transparency.signature,
    warnings,
    uncertaintyCount: transparency.uncertaintySources.length,
    assumptionCount: transparency.assumptions.length,
  });
}
