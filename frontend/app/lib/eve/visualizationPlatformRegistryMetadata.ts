import { VisualizationPlatformFoundationPlatform } from "./visualizationPlatformFoundation.ts";
import { VisualizationPlatformRegistryInventory } from "./visualizationPlatformRegistryInventory.ts";

const foundation = VisualizationPlatformFoundationPlatform;

export const VisualizationPlatformRegistryIdentity = Object.freeze({
  id: "EVE-8:2/VisualizationPlatformRegistry",
  name: "Visualization Platform Registry",
  version: "1.0.0",
  namespace: "nexora.eve.visualization-platform.registry",
  layer: "EVE",
  phase: "EVE-8:2",
  status: "ReadyForModel",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationPlatformRegistryReadiness = Object.freeze({
  status: "ReadyForModel",
  foundationStatus: foundation.metadata.status,
  foundationReference: foundation.metadata.id,
  moduleRegistryComplete: true,
  runtimeCheck: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationPlatformRegistryMetadataRecord = Object.freeze({
  ...VisualizationPlatformRegistryIdentity,
  foundationReference: foundation.metadata.id,
  foundation,
  inventory: VisualizationPlatformRegistryInventory,
  readiness: VisualizationPlatformRegistryReadiness,
  ownership: Object.freeze({
    owns: Object.freeze(["Platform registries", "Platform identities",
      "Module registry", "Registry categories", "Registry metadata",
      "Registry inventories", "Registry policies", "Extension classifications"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Runtime composition",
      "Timeline execution", "Graph layout", "Dashboard rendering",
      "Animation runtime", "UI implementation", "Director orchestration",
      "Advisor logic", "Executive reasoning", "Business Objects",
      "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    visualizationPlatformFoundationOnly: true,
    directModule: "visualizationPlatformFoundation.ts",
    directEveOneThroughSevenImports: false,
    directInternalPhaseImports: false,
  }),
  registryRuntime: false,
  rendering: false,
  sceneRendering: false,
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
