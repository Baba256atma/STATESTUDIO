import { VisualizationPlatformModelPlatform } from "./visualizationPlatformModel.ts";
import type {
  VisualizationPlatformValidationOutcome,
  VisualizationPlatformValidationSeverity,
} from "./visualizationPlatformValidationTypes.ts";

export const VisualizationPlatformValidationSeverityLevels:
readonly VisualizationPlatformValidationSeverity[] = Object.freeze([
  "Information", "Advisory", "Warning", "Minor", "Major", "Critical",
]);

export const VisualizationPlatformValidationOutcomes:
readonly VisualizationPlatformValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "ReviewRequired", "Deferred", "Blocked",
  "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Identity", "Modules", "Registry References", "Models", "Relationships",
  "Architecture", "Inventory", "Dependencies",
] as const);

export const VisualizationPlatformValidationDiagnostics = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-8:4/Diagnostic/${index + 1}` as const,
    name,
    description: `Metadata-only diagnostic type: ${name}.`,
    severityReference:
      VisualizationPlatformValidationSeverityLevels[
        index % VisualizationPlatformValidationSeverityLevels.length
      ]!,
    outcomeReference:
      VisualizationPlatformValidationOutcomes[
        index % VisualizationPlatformValidationOutcomes.length
      ]!,
    modelReference: VisualizationPlatformModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const VisualizationPlatformValidationFailureCategories = Object.freeze([
  "Identity Failure", "Composition Failure", "Reference Failure",
  "Relationship Failure", "Architecture Failure", "Dependency Failure",
].map((name, index) => Object.freeze({
  id: `EVE-8:4/Failure/${index + 1}` as const,
  name,
  deterministicOrder: index + 1,
  runtimeReporting: false,
  metadataOnly: true,
  immutable: true,
})));

export const VisualizationPlatformValidationRecommendationCategories =
  Object.freeze([
    "Preserve Identity", "Restore Composition", "Restore Reference",
    "Correct Relationship", "Preserve Boundary", "Preserve Dependency",
  ].map((name, index) => Object.freeze({
    id: `EVE-8:4/Recommendation/${index + 1}` as const,
    name,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })));
