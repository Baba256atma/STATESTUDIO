import { VisualizationSuiteFoundationPlatform } from "./visualizationSuiteFoundation.ts";
import { VisualizationSuiteRegistryInventory } from "./visualizationSuiteRegistryInventory.ts";

const foundation = VisualizationSuiteFoundationPlatform;

export const VisualizationSuiteRegistryIdentity = Object.freeze({
  id: "EVE-9:2/VisualizationSuiteRegistry",
  name: "Visualization Suite Registry",
  version: "1.0.0",
  namespace: "nexora.eve.visualization-suite.registry",
  layer: "EVE",
  phase: "EVE-9:2",
  status: "ReadyForModel",
  stability: "Stable",
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteRegistryReadiness = Object.freeze({
  status: "ReadyForModel",
  foundationStatus: foundation.metadata.status,
  foundationReference: foundation.metadata.id,
  platformRegistryComplete: true,
  runtimeCheck: false,
  metadataOnly: true,
  immutable: true,
} as const);

export const VisualizationSuiteRegistryMetadataRecord = Object.freeze({
  ...VisualizationSuiteRegistryIdentity,
  foundationReference: foundation.metadata.id,
  foundation,
  inventory: VisualizationSuiteRegistryInventory,
  readiness: VisualizationSuiteRegistryReadiness,
  ownership: Object.freeze({
    owns: Object.freeze(["Suite registries", "Platform registries",
      "Public Index registries", "Registry categories", "Registry metadata",
      "Registry inventories", "Registry policies",
      "Extension classifications"]),
    doesNotOwn: Object.freeze(["Rendering execution",
      "Visualization orchestration", "Runtime composition",
      "Timeline playback", "Graph execution", "Dashboard rendering",
      "Animation runtime", "UI implementation", "Director orchestration",
      "Advisor logic", "Executive reasoning", "Business Objects",
      "Networking", "Persistence"]),
  }),
  dependency: Object.freeze({
    visualizationSuiteFoundationOnly: true,
    directModule: "visualizationSuiteFoundation.ts",
    directEveOneThroughEightImports: false,
    directInternalPhaseImports: false,
  }),
  registryRuntime: false,
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
