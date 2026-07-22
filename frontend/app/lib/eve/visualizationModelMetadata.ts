import { VisualizationRegistry } from "./visualizationRegistry.ts";
import { VisualizationModelInventory } from "./visualizationModelInventory.ts";

export const VisualizationModelMetadata = Object.freeze({
  id: "EVE-1:3/VisualizationModel",
  name: "Visualization Model",
  version: "1.0.0",
  namespace: "nexora.eve.visualization.model",
  layer: "Visualization Engine (EVE)",
  status: "Model",
  readiness: "ReadyForValidation",
  registryReference: VisualizationRegistry.metadata.id,
  inventory: VisualizationModelInventory,
  dependency: Object.freeze({
    visualizationRegistryOnly: true,
    directPreviousPhaseModule: "visualizationRegistry.ts",
    directFoundationImport: false,
    otherEvePhases: false,
    externalDependencies: false,
  }),
  services: false,
  factories: false,
  execution: false,
  rendering: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

