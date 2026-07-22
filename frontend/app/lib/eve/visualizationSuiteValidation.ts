import { VisualizationSuiteModelPlatform } from "./visualizationSuiteModel.ts";
import {
  VisualizationSuiteValidationDiagnostics,
  VisualizationSuiteValidationFailureCategories,
  VisualizationSuiteValidationOutcomes,
  VisualizationSuiteValidationRecommendationCategories,
  VisualizationSuiteValidationSeverityLevels,
} from "./visualizationSuiteValidationDiagnostics.ts";
import { VisualizationSuiteValidationInventory } from "./visualizationSuiteValidationInventory.ts";
import {
  VisualizationSuiteValidationGates,
  VisualizationSuiteValidationReadinessDeclarations,
} from "./visualizationSuiteValidationMetadata.ts";
import { VisualizationSuiteValidationPolicies } from "./visualizationSuiteValidationPolicies.ts";
import {
  VisualizationSuiteValidationCategories,
  VisualizationSuiteValidationRules,
} from "./visualizationSuiteValidationRules.ts";

export const VisualizationSuiteValidationIdentityMetadata = Object.freeze({
  id: "EVE-9:4/VisualizationSuiteValidation",
  name: "Visualization Suite Validation",
  version: "1.0.0",
  namespace: "nexora.eve.visualization-suite.validation",
  layer: "EVE",
  phase: "EVE-9:4",
  status: "ReadyForManifest",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteValidationReadinessMetadata = Object.freeze({
  status: "ReadyForManifest",
  modelStatus: VisualizationSuiteModelPlatform.metadata.status,
  modelReference: VisualizationSuiteModelPlatform.metadata.id,
  declarations: VisualizationSuiteValidationReadinessDeclarations,
  runtimeCheck: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteValidationInventoryMetadata =
  VisualizationSuiteValidationInventory;

export const VisualizationSuiteValidationMetadata = Object.freeze({
  ...VisualizationSuiteValidationIdentityMetadata,
  modelReference: VisualizationSuiteModelPlatform.metadata.id,
  model: VisualizationSuiteModelPlatform,
  inventory: VisualizationSuiteValidationInventoryMetadata,
  readiness: VisualizationSuiteValidationReadinessMetadata,
  diagnostics: VisualizationSuiteValidationDiagnostics,
  ownership: Object.freeze({
    owns: Object.freeze(["Validation metadata", "Validation rules",
      "Validation gates", "Diagnostics", "Validation policies",
      "Validation inventories", "Readiness metadata"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Runtime validation",
      "Runtime composition", "Graph execution", "Timeline execution",
      "Dashboard rendering", "Animation runtime", "UI implementation",
      "Director orchestration", "Advisor logic", "Executive reasoning",
      "Business Objects", "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    visualizationSuiteModelOnly: true,
    directModule: "visualizationSuiteModel.ts",
    directRegistryImports: false,
    directFoundationImports: false,
    directEveOneThroughEightImports: false,
    directPublicIndexImports: false,
  }),
  validationEngine: false,
  runtimeValidation: false,
  rendering: false,
  visualizationExecution: false,
  runtimeComposition: false,
  graphExecution: false,
  timelineExecution: false,
  dashboardExecution: false,
  animationExecution: false,
  orchestration: false,
  ui: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);

export const VisualizationSuiteValidationPlatform = Object.freeze({
  metadata: VisualizationSuiteValidationMetadata,
  identity: VisualizationSuiteValidationIdentityMetadata,
  inventory: VisualizationSuiteValidationInventoryMetadata,
  readiness: VisualizationSuiteValidationReadinessMetadata,
  model: VisualizationSuiteModelPlatform,
  categories: VisualizationSuiteValidationCategories,
  rules: VisualizationSuiteValidationRules,
  gates: VisualizationSuiteValidationGates,
  diagnostics: VisualizationSuiteValidationDiagnostics,
  severityLevels: VisualizationSuiteValidationSeverityLevels,
  outcomes: VisualizationSuiteValidationOutcomes,
  failureCategories: VisualizationSuiteValidationFailureCategories,
  recommendationCategories:
    VisualizationSuiteValidationRecommendationCategories,
  policies: VisualizationSuiteValidationPolicies,
  readinessDeclarations: VisualizationSuiteValidationReadinessDeclarations,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const validationSummary = Object.freeze({
  identity: VisualizationSuiteValidationIdentityMetadata,
  status: VisualizationSuiteValidationIdentityMetadata.status,
  readiness: VisualizationSuiteValidationReadinessMetadata,
  inventory: VisualizationSuiteValidationInventoryMetadata,
  modelReference: VisualizationSuiteModelPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuiteValidationSummary = () => validationSummary;
export const getVisualizationSuiteValidationCount = () =>
  VisualizationSuiteValidationRules.length;
export const getVisualizationSuiteValidationReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuiteValidationIdentityMetadata,
    readiness: VisualizationSuiteValidationReadinessMetadata.status,
    modelReference: VisualizationSuiteModelPlatform.metadata.id,
  });
