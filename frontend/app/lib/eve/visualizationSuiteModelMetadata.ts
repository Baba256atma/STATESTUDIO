import { VisualizationSuiteModelInventory } from "./visualizationSuiteModelInventory.ts";
import { VisualizationSuiteRegistryPlatform } from "./visualizationSuiteRegistry.ts";

const registry = VisualizationSuiteRegistryPlatform;

export const VisualizationSuiteModelIdentity = Object.freeze({
  id: "EVE-9:3/VisualizationSuiteModel",
  name: "Visualization Suite Model",
  version: "1.0.0",
  namespace: "nexora.eve.visualization-suite.model",
  layer: "EVE",
  phase: "EVE-9:3",
  status: "ReadyForValidation",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteModelReadiness = Object.freeze({
  status: "ReadyForValidation",
  registryStatus: registry.metadata.status,
  registryReference: registry.metadata.id,
  suiteCompositionComplete: true,
  runtimeCheck: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteModelMetadataRecord = Object.freeze({
  ...VisualizationSuiteModelIdentity,
  registryReference: registry.metadata.id,
  registry,
  inventory: VisualizationSuiteModelInventory,
  readiness: VisualizationSuiteModelReadiness,
  ownership: Object.freeze({
    owns: Object.freeze(["Typed Suite models", "Platform descriptors",
      "Relationship descriptors", "Model metadata", "Model inventories",
      "Suite identities"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Runtime composition", "Graph execution",
      "Timeline execution", "Dashboard rendering", "Animation runtime",
      "UI implementation", "Director orchestration", "Advisor logic",
      "Executive reasoning", "Business Objects", "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    visualizationSuiteRegistryOnly: true,
    directModule: "visualizationSuiteRegistry.ts",
    directFoundationImports: false,
    directEveOneThroughEightImports: false,
    directPublicIndexImports: false,
    directInternalPhaseImports: false,
  }),
  rendering: false,
  renderPipeline: false,
  visualizationOrchestration: false,
  runtimeComposition: false,
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
