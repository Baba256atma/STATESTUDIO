import { VisualizationModel } from "./visualizationModel.ts";
import { VisualizationValidationInventory } from "./visualizationValidationInventory.ts";

export const VisualizationValidationMetadata = Object.freeze({
  id: "EVE-1:4/VisualizationValidation",
  name: "Visualization Validation",
  version: "1.0.0",
  namespace: "nexora.eve.visualization.validation",
  layer: "Visualization Engine (EVE)",
  status: "Validation",
  readiness: "ReadyForManifest",
  modelReference: VisualizationModel.metadata.id,
  inventory: VisualizationValidationInventory,
  dependency: Object.freeze({
    visualizationModelOnly: true,
    directPreviousPhaseModule: "visualizationModel.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    otherEvePhases: false,
    externalDependencies: false,
  }),
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

