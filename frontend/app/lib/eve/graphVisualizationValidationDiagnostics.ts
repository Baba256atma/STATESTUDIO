import { GraphVisualizationModel } from "./graphVisualizationModel.ts";
import type {
  GraphVisualizationValidationDiagnostic,
  GraphVisualizationValidationOutcome,
  GraphVisualizationValidationSeverity,
} from "./graphVisualizationValidationTypes.ts";

export const GraphVisualizationValidationSeverityLevels:
readonly GraphVisualizationValidationSeverity[] = Object.freeze([
  "Info", "Notice", "Warning", "Error", "Critical", "Fatal",
]);

export const GraphVisualizationValidationOutcomes:
readonly GraphVisualizationValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "Warning", "Failed", "Blocked", "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Identity", "Structure", "Relationship", "Ownership", "Boundary",
  "Compatibility", "Inventory", "Dependency",
] as const);

export const GraphVisualizationValidationDiagnostics:
readonly GraphVisualizationValidationDiagnostic[] = Object.freeze(
  diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-3:4/Diagnostic/${name}`,
    name,
    severity: GraphVisualizationValidationSeverityLevels[
      index % GraphVisualizationValidationSeverityLevels.length
    ]!,
    outcome: GraphVisualizationValidationOutcomes[
      index % GraphVisualizationValidationOutcomes.length
    ]!,
    modelReference: GraphVisualizationModel.metadata.id,
    runtimeReporting: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
