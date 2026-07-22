import { TimelineVisualizationModelPlatform } from "./timelineVisualizationModel.ts";
import type {
  TimelineVisualizationValidationOutcome,
  TimelineVisualizationValidationSeverity,
} from "./timelineVisualizationValidationTypes.ts";

export const TimelineVisualizationValidationSeverityLevels:
readonly TimelineVisualizationValidationSeverity[] = Object.freeze([
  "Informational", "Low", "Moderate", "High", "Critical", "Blocking",
]);

export const TimelineVisualizationValidationOutcomes:
readonly TimelineVisualizationValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "ReviewRequired", "Deferred", "Rejected",
  "CertifiedForManifest",
]);

const diagnosticNames = Object.freeze([
  "Identity", "Structure", "Relationship", "Compatibility",
  "Inventory", "Metadata", "Public Surface", "Architecture",
] as const);

export const TimelineVisualizationValidationDiagnostics = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-4:4/Diagnostic/${name.replaceAll(" ", "")}`,
    name,
    description: `Metadata-only diagnostic classification: ${name}.`,
    severityReference: TimelineVisualizationValidationSeverityLevels[
      index % TimelineVisualizationValidationSeverityLevels.length
    ]!,
    outcomeReference: TimelineVisualizationValidationOutcomes[
      index % TimelineVisualizationValidationOutcomes.length
    ]!,
    modelReference: TimelineVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })),
);
