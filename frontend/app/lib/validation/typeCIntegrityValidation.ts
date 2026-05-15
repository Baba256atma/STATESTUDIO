import { buildIntelligenceHarmonizationDiagnostics } from "../harmonization/intelligenceHarmonizationDiagnostics.ts";
import { validateTypeCOperatingPhilosophy } from "../harmonization/typeCOperatingPhilosophy.ts";

export type TypeCIntegrityDimension =
  | "calm_intelligence"
  | "low_noise_ux"
  | "propagation_first_reasoning"
  | "executive_cognition_support"
  | "strategic_timing_discipline"
  | "resilience_oriented_thinking"
  | "overlay_based_architecture"
  | "disciplined_orchestration";

export type TypeCIntegrityValidation = {
  valid: boolean;
  dimensions: Record<TypeCIntegrityDimension, "pass" | "watch" | "fail">;
  warnings: string[];
};

export function validateTypeCIntegrity(): TypeCIntegrityValidation {
  const philosophy = validateTypeCOperatingPhilosophy();
  const harmonization = buildIntelligenceHarmonizationDiagnostics();
  const dimensions: Record<TypeCIntegrityDimension, "pass" | "watch" | "fail"> = {
    calm_intelligence: philosophy.valid ? "pass" : "fail",
    low_noise_ux: harmonization.executiveFocusConflicts === 0 ? "pass" : "watch",
    propagation_first_reasoning: harmonization.semanticAlignmentStatus === "aligned" ? "pass" : "watch",
    executive_cognition_support: harmonization.panelIdentityClarity === "aligned" ? "pass" : "watch",
    strategic_timing_discipline: harmonization.orchestrationHarmony === "aligned" ? "pass" : "watch",
    resilience_oriented_thinking: philosophy.valid ? "pass" : "fail",
    overlay_based_architecture: philosophy.valid ? "pass" : "fail",
    disciplined_orchestration: harmonization.orchestrationHarmony === "aligned" ? "pass" : "watch",
  };
  const warnings = [
    ...philosophy.warnings,
    ...harmonization.warnings,
  ];
  return {
    valid: Object.values(dimensions).every((status) => status === "pass") && warnings.length === 0,
    dimensions,
    warnings,
  };
}
