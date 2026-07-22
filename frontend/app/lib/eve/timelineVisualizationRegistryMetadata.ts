import { TimelineVisualizationFoundationPlatform } from "./timelineVisualizationFoundation.ts";
import { TimelineVisualizationRegistryCatalog } from "./timelineVisualizationRegistryCatalog.ts";
import { TimelineVisualizationRegistryExtensions } from "./timelineVisualizationRegistryExtensions.ts";
import { TimelineVisualizationRegistryInventory } from "./timelineVisualizationRegistryInventory.ts";
import { TimelineVisualizationRegistryPolicies } from "./timelineVisualizationRegistryPolicies.ts";

export const TimelineVisualizationRegistryMetadata = Object.freeze({
  id: "EVE-4:2/TimelineVisualizationRegistry",
  name: "Timeline & Temporal Visualization Registry",
  version: "1.0.0",
  namespace: "nexora.eve.timeline-visualization.registry",
  layer: "EVE",
  phase: "EVE-4:2",
  status: "ReadyForModel",
  readiness: "ReadyForModel",
  foundationReference: TimelineVisualizationFoundationPlatform.metadata.id,
  foundation: TimelineVisualizationFoundationPlatform,
  categories: TimelineVisualizationRegistryCatalog,
  policies: TimelineVisualizationRegistryPolicies,
  extensions: TimelineVisualizationRegistryExtensions,
  inventory: TimelineVisualizationRegistryInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Timeline vocabularies", "Temporal vocabularies", "Registry identities",
      "Registry categories", "Registry metadata", "Extension classifications",
    ] as const),
    doesNotOwn: Object.freeze([
      "Scheduling", "Playback engines", "Animation engines", "Rendering",
      "Simulation", "Business calendars", "Business reasoning",
    ] as const),
  }),
  dependency: Object.freeze({
    timelineVisualizationFoundationOnly: true,
    directPreviousPhaseModule: "timelineVisualizationFoundation.ts",
    directGraphVisualizationPublicIndexImport: false,
    directEveThreeImports: false,
    directEveTwoImports: false,
    externalDependencies: false,
  }),
  playbackExecution: false,
  animationExecution: false,
  scheduling: false,
  simulation: false,
  rendering: false,
  graphProcessing: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
