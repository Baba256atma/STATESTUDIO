import type {
  VisualizationValidationDiagnostic,
  VisualizationValidationResult,
  VisualizationValidationSeverity,
} from "./visualizationValidationTypes.ts";

export const VisualizationValidationSeverityLevels: readonly VisualizationValidationSeverity[] =
  Object.freeze(["Information", "Warning", "Error"]);

export const VisualizationValidationResults: readonly VisualizationValidationResult[] =
  Object.freeze(["Compliant", "NonCompliant", "NotEvaluated"]);

export const VisualizationValidationDiagnostics: readonly VisualizationValidationDiagnostic[] =
  Object.freeze(VisualizationValidationSeverityLevels.map((severity, index) =>
    Object.freeze({
      id: `EVE-1:4/Diagnostic/${severity}`,
      name: `${severity} Diagnostic Metadata`,
      severity,
      resultType: VisualizationValidationResults[index]!,
      runtimeDiagnostic: false,
      deterministicOrder: index + 1,
      metadataOnly: true,
      immutable: true,
    })),
);

