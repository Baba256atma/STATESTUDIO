import { VisualizationModel } from "./visualizationModel.ts";
import {
  VisualizationValidationDiagnostics,
  VisualizationValidationResults,
  VisualizationValidationSeverityLevels,
} from "./visualizationValidationDiagnostics.ts";
import { VisualizationValidationInventory } from "./visualizationValidationInventory.ts";
import { VisualizationValidationMetadata } from "./visualizationValidationMetadata.ts";
import { VisualizationValidationPolicies } from "./visualizationValidationPolicies.ts";
import {
  VisualizationValidationCategories,
  VisualizationValidationGates,
  VisualizationValidationRules,
} from "./visualizationValidationRules.ts";

export const VisualizationValidationId = VisualizationValidationMetadata.id;
export const VisualizationValidationVersion = VisualizationValidationMetadata.version;
export const VisualizationValidationName = VisualizationValidationMetadata.name;
export const VisualizationValidationNamespace = VisualizationValidationMetadata.namespace;
export const VisualizationValidationStatus = VisualizationValidationMetadata.status;
export const VisualizationValidationReadiness = VisualizationValidationMetadata.readiness;

export { VisualizationValidationMetadata };

export const VisualizationValidation = Object.freeze({
  metadata: VisualizationValidationMetadata,
  model: VisualizationModel,
  categories: VisualizationValidationCategories,
  rules: VisualizationValidationRules,
  gates: VisualizationValidationGates,
  results: VisualizationValidationResults,
  severityLevels: VisualizationValidationSeverityLevels,
  diagnostics: VisualizationValidationDiagnostics,
  policies: VisualizationValidationPolicies,
  inventory: VisualizationValidationInventory,
  validationEngine: false,
  automaticRuleExecution: false,
  runtimeDiagnostics: false,
  services: false,
  factories: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

