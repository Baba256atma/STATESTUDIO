import { ChartMetricVisualizationModelPlatform } from "./chartMetricVisualizationModel.ts";
import type {
  ChartMetricVisualizationValidationOutcome,
  ChartMetricVisualizationValidationSeverity,
} from "./chartMetricVisualizationValidationTypes.ts";

export const ChartMetricVisualizationValidationSeverityLevels:
readonly ChartMetricVisualizationValidationSeverity[] = Object.freeze([
  "Info", "Notice", "Warning", "Error", "Critical", "Fatal",
]);

export const ChartMetricVisualizationValidationOutcomes:
readonly ChartMetricVisualizationValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "Warning", "Failed", "Blocked", "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Identity", "Metric", "Chart", "Relationship", "Ownership", "Boundary", "Inventory",
  "Dependency",
] as const);

export const ChartMetricVisualizationValidationDiagnostics = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-5:4/Diagnostic/${name}` as const,
    name,
    description: `Metadata-only diagnostic classification: ${name}.`,
    severityReference: ChartMetricVisualizationValidationSeverityLevels[
      index % ChartMetricVisualizationValidationSeverityLevels.length
    ]!,
    outcomeReference: ChartMetricVisualizationValidationOutcomes[
      index % ChartMetricVisualizationValidationOutcomes.length
    ]!,
    modelReference: ChartMetricVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })),
);
