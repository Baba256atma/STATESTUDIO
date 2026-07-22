import { DashboardExecutiveWorkspaceVisualizationModelPlatform } from "./dashboardExecutiveWorkspaceVisualizationModel.ts";
import type {
  DashboardExecutiveWorkspaceValidationOutcome,
  DashboardExecutiveWorkspaceValidationSeverity,
} from "./dashboardExecutiveWorkspaceVisualizationValidationTypes.ts";

export const DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels:
readonly DashboardExecutiveWorkspaceValidationSeverity[] = Object.freeze([
  "Information", "Advisory", "Warning", "Minor", "Major", "Critical",
]);

export const DashboardExecutiveWorkspaceVisualizationValidationOutcomes:
readonly DashboardExecutiveWorkspaceValidationOutcome[] = Object.freeze([
  "Passed", "PassedWithNotes", "ReviewRequired", "Deferred", "Blocked",
  "NotApplicable",
]);

const diagnosticNames = Object.freeze([
  "Identity", "References", "Relationships", "Composition", "Metadata",
  "Inventory", "Dependencies", "Compatibility",
] as const);

export const DashboardExecutiveWorkspaceVisualizationValidationDiagnostics =
  Object.freeze(diagnosticNames.map((name, index) => Object.freeze({
    id: `EVE-6:4/Diagnostic/${name}` as const,
    name,
    description: `Metadata-only diagnostic classification: ${name}.`,
    severityReference:
      DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels[
        index % DashboardExecutiveWorkspaceVisualizationValidationSeverityLevels.length
      ]!,
    outcomeReference:
      DashboardExecutiveWorkspaceVisualizationValidationOutcomes[
        index % DashboardExecutiveWorkspaceVisualizationValidationOutcomes.length
      ]!,
    modelReference:
      DashboardExecutiveWorkspaceVisualizationModelPlatform.metadata.id,
    deterministicOrder: index + 1,
    runtimeReporting: false,
    metadataOnly: true,
    immutable: true,
  })));
