import type {
  SceneRenderingValidationDiagnostic,
  SceneRenderingValidationOutcome,
  SceneRenderingValidationSeverity,
} from "./sceneRenderingValidationTypes.ts";

export const SceneRenderingValidationSeverityLevels: readonly SceneRenderingValidationSeverity[] =
  Object.freeze(["Information", "Warning", "Error"]);

export const SceneRenderingValidationOutcomes: readonly SceneRenderingValidationOutcome[] =
  Object.freeze(["Compliant", "NonCompliant", "NotEvaluated"]);

const failureCategories = Object.freeze([
  "NoFailure", "ArchitecturalDeviation", "IncompleteEvidence",
] as const);
const recommendationCategories = Object.freeze([
  "NoAction", "ReviewMetadata", "CompleteDeclaration",
] as const);

export const SceneRenderingValidationDiagnostics: readonly SceneRenderingValidationDiagnostic[] =
  Object.freeze(SceneRenderingValidationSeverityLevels.map((severity, index) => Object.freeze({
    id: `EVE-2:4/Diagnostic/${severity}`,
    name: `${severity} Diagnostic Metadata`,
    severity,
    outcome: SceneRenderingValidationOutcomes[index]!,
    failureCategory: failureCategories[index]!,
    recommendationCategory: recommendationCategories[index]!,
    runtimeReporting: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));
