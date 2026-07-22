import { VisualizationFoundation } from "./visualizationFoundation.ts";
import { VisualizationRegistryInventory } from "./visualizationRegistryInventory.ts";

export const VisualizationRegistryMetadata = Object.freeze({
  id: "EVE-1:2/VisualizationRegistry",
  name: "Visualization Registry",
  version: "1.0.0",
  namespace: "nexora.eve.visualization.registry",
  layer: "Visualization Engine (EVE)",
  status: "Registry",
  readiness: "ReadyForModel",
  foundationReference: VisualizationFoundation.identity.id,
  inventory: VisualizationRegistryInventory,
  dependency: Object.freeze({
    visualizationFoundationOnly: true,
    directPreviousPhaseModule: "visualizationFoundation.ts",
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

