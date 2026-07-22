import { VisualizationSuiteModelPlatform } from "./visualizationSuiteModel.ts";
import type {
  VisualizationSuiteValidationOutcome,
  VisualizationSuiteValidationSeverity,
} from "./visualizationSuiteValidationTypes.ts";

export const VisualizationSuiteValidationSeverityLevels:
readonly VisualizationSuiteValidationSeverity[] = Object.freeze([
  "Information", "Advisory", "Warning", "Minor", "Major", "Critical",
]);

export const VisualizationSuiteValidationOutcomes:
readonly VisualizationSuiteValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "ReviewRequired", "Deferred", "Blocked",
  "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Suite Identity", "Public Indexes", "Registry References", "Models",
  "Relationships", "Architecture", "Inventory", "Dependencies",
] as const);

export const VisualizationSuiteValidationDiagnostics = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-9:4/Diagnostic/${index + 1}` as const,
    name,
    description: `Metadata-only diagnostic type: ${name}.`,
    severityReference: VisualizationSuiteValidationSeverityLevels[
      index % VisualizationSuiteValidationSeverityLevels.length]!,
    outcomeReference: VisualizationSuiteValidationOutcomes[
      index % VisualizationSuiteValidationOutcomes.length]!,
    modelReference: VisualizationSuiteModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const VisualizationSuiteValidationFailureCategories = Object.freeze([
  "Identity Failure", "Composition Failure", "Reference Failure",
  "Relationship Failure", "Architecture Failure", "Dependency Failure",
].map((name, index) => Object.freeze({
  id: `EVE-9:4/Failure/${index + 1}` as const,
  name,
  deterministicOrder: index + 1,
  runtimeReporting: false,
  metadataOnly: true,
  immutable: true,
})));

export const VisualizationSuiteValidationRecommendationCategories =
  Object.freeze([
    "Preserve Identity", "Restore Composition", "Restore Reference",
    "Correct Relationship", "Preserve Boundary", "Preserve Dependency",
  ].map((name, index) => Object.freeze({
    id: `EVE-9:4/Recommendation/${index + 1}` as const,
    name,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })));
