import { VisualizationPlatformModelInventory } from "./visualizationPlatformModelInventory.ts";
import { VisualizationPlatformRegistryPlatform } from "./visualizationPlatformRegistry.ts";

const registry = VisualizationPlatformRegistryPlatform;

export const VisualizationPlatformModelIdentity = Object.freeze({
  id: "EVE-8:3/VisualizationPlatformModel",
  name: "Visualization Platform Model",
  version: "1.0.0",
  namespace: "nexora.eve.visualization-platform.model",
  layer: "EVE",
  phase: "EVE-8:3",
  status: "ReadyForValidation",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationPlatformModelReadiness = Object.freeze({
  status: "ReadyForValidation",
  registryStatus: registry.metadata.status,
  registryReference: registry.metadata.id,
  moduleCompositionComplete: true,
  runtimeCheck: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationPlatformModelMetadataRecord = Object.freeze({
  ...VisualizationPlatformModelIdentity,
  registryReference: registry.metadata.id,
  registry,
  inventory: VisualizationPlatformModelInventory,
  readiness: VisualizationPlatformModelReadiness,
  ownership: Object.freeze({
    owns: Object.freeze(["Typed platform models", "Platform relationships",
      "Model metadata", "Model inventories", "Model identities",
      "Platform descriptors"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Timeline playback", "Graph execution",
      "Dashboard rendering", "Animation runtime", "UI implementation",
      "Director orchestration", "Advisor logic", "Executive reasoning",
      "Business Objects", "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    visualizationPlatformRegistryOnly: true,
    directModule: "visualizationPlatformRegistry.ts",
    directFoundationImports: false,
    directEveOneThroughSevenImports: false,
    directInternalPhaseImports: false,
  }),
  rendering: false,
  renderPipeline: false,
  visualizationOrchestration: false,
  graphExecution: false,
  timelineExecution: false,
  dashboardExecution: false,
  animationExecution: false,
  ui: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  deterministic: true,
} as const);
