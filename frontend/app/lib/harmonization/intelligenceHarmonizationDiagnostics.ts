import { stableSignature } from "../intelligence/shared/dedupe.ts";
import { validateCanonicalExecutiveSummary, type CanonicalExecutiveSummary } from "./canonicalExecutiveSummary.ts";
import { validateIntelligenceSemanticsMap } from "./intelligenceSemanticsMap.ts";
import { validatePanelIdentityClarity } from "./panelIdentityMap.ts";
import { validateTypeCOperatingPhilosophy } from "./typeCOperatingPhilosophy.ts";

export type IntelligenceHarmonizationDiagnostics = {
  semanticAlignmentStatus: "aligned" | "watch";
  narrativeConsistency: "aligned" | "watch";
  executiveFocusConflicts: number;
  orchestrationHarmony: "aligned" | "watch";
  panelIdentityClarity: "aligned" | "watch";
  warnings: string[];
  signature: string;
};

export function buildIntelligenceHarmonizationDiagnostics(params: {
  summary?: CanonicalExecutiveSummary | null;
  executiveFocusConflicts?: number;
} = {}): IntelligenceHarmonizationDiagnostics {
  const semantic = validateIntelligenceSemanticsMap();
  const philosophy = validateTypeCOperatingPhilosophy();
  const panelIdentity = validatePanelIdentityClarity();
  const summaryValidation = params.summary
    ? validateCanonicalExecutiveSummary(params.summary)
    : { valid: true, warnings: [] };
  const warnings = [
    ...semantic.warnings,
    ...philosophy.warnings,
    ...panelIdentity.warnings,
    ...summaryValidation.warnings,
  ];
  const diagnostics = {
    semanticAlignmentStatus: semantic.valid && philosophy.valid ? "aligned" as const : "watch" as const,
    narrativeConsistency: summaryValidation.valid ? "aligned" as const : "watch" as const,
    executiveFocusConflicts: Math.max(0, params.executiveFocusConflicts ?? 0),
    orchestrationHarmony: semantic.valid ? "aligned" as const : "watch" as const,
    panelIdentityClarity: panelIdentity.valid ? "aligned" as const : "watch" as const,
    warnings,
  };
  return {
    ...diagnostics,
    signature: stableSignature(diagnostics),
  };
}

export function logIntelligenceHarmonizationDiagnostics(
  diagnostics: IntelligenceHarmonizationDiagnostics,
  options: { enabled?: boolean; previousSignature?: string | null } = {}
): string {
  if (
    options.enabled === true &&
    options.previousSignature !== diagnostics.signature &&
    typeof globalThis !== "undefined" &&
    typeof globalThis.console?.debug === "function"
  ) {
    globalThis.console.debug("[Nexora][IntelligenceHarmonization]", {
      semanticAlignmentStatus: diagnostics.semanticAlignmentStatus,
      narrativeConsistency: diagnostics.narrativeConsistency,
      executiveFocusConflicts: diagnostics.executiveFocusConflicts,
      orchestrationHarmony: diagnostics.orchestrationHarmony,
      panelIdentityClarity: diagnostics.panelIdentityClarity,
    });
  }
  return diagnostics.signature;
}
