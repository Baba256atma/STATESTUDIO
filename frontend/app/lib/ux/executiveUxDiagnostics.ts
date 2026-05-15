import { stableSignature } from "../intelligence/shared/dedupe.ts";
import { deriveExecutiveFocusSummary, type ExecutiveFocusSummary } from "./deriveExecutiveFocusSummary.ts";
import type { ExecutiveUxSignal } from "./executiveSignalHierarchy.ts";

export type ExecutiveUxDiagnostics = {
  activePrimarySignals: number;
  compressedSignalCount: number;
  panelAttentionWeights: ExecutiveFocusSummary["panelAttentionWeights"];
  executiveFocus: string;
  overlayNoiseReduction: number;
  signature: string;
};

export function buildExecutiveUxDiagnostics(params: {
  signals?: ExecutiveUxSignal[] | null;
}): ExecutiveUxDiagnostics {
  const summary = deriveExecutiveFocusSummary({ signals: params.signals });
  const activePrimarySignals = (params.signals ?? []).filter((signal) =>
    ["critical", "urgent", "high"].includes(String(signal.severity ?? signal.priority ?? "").toLowerCase())
  ).length;
  const diagnostics = {
    activePrimarySignals,
    compressedSignalCount: summary.noiseReductionCount,
    panelAttentionWeights: summary.panelAttentionWeights,
    executiveFocus: summary.headline,
    overlayNoiseReduction: summary.noiseReductionCount,
  };
  return {
    ...diagnostics,
    signature: stableSignature(diagnostics),
  };
}

export function logExecutiveUxDiagnostics(
  diagnostics: ExecutiveUxDiagnostics,
  options: { enabled?: boolean; previousSignature?: string | null } = {}
): string {
  if (
    options.enabled === true &&
    options.previousSignature !== diagnostics.signature &&
    typeof globalThis !== "undefined" &&
    typeof globalThis.console?.log === "function"
  ) {
    globalThis.console.log("[Nexora][ExecutiveUX]", {
      activePrimarySignals: diagnostics.activePrimarySignals,
      compressedSignalCount: diagnostics.compressedSignalCount,
      panelAttentionWeights: diagnostics.panelAttentionWeights,
      executiveFocus: diagnostics.executiveFocus,
      overlayNoiseReduction: diagnostics.overlayNoiseReduction,
    });
  }
  return diagnostics.signature;
}
