import { TimelineVisualizationRegistryPlatform } from "./timelineVisualizationRegistry.ts";
import { TimelineVisualizationModelInventory } from "./timelineVisualizationModelInventory.ts";

export const TimelineVisualizationModelMetadata = Object.freeze({
  id: "EVE-4:3/TimelineVisualizationModel",
  name: "Timeline & Temporal Visualization Model",
  version: "1.0.0",
  namespace: "nexora.eve.timeline-visualization.model",
  layer: "EVE",
  phase: "EVE-4:3",
  status: "ReadyForValidation",
  readiness: "ReadyForValidation",
  registryReference: TimelineVisualizationRegistryPlatform.metadata.id,
  registry: TimelineVisualizationRegistryPlatform,
  inventory: TimelineVisualizationModelInventory,
  ownership: Object.freeze({
    owns: Object.freeze([
      "Typed timeline models", "Model descriptors", "Structural composition metadata",
      "Timeline metadata", "Inventories",
    ] as const),
    doesNotOwn: Object.freeze([
      "Scheduling", "Playback engine", "Animation engine", "Rendering",
      "Business calendars", "Business reasoning", "Executive reasoning",
    ] as const),
  }),
  dependency: Object.freeze({
    timelineVisualizationRegistryOnly: true,
    directPreviousPhaseModule: "timelineVisualizationRegistry.ts",
    directFoundationImport: false,
    directGraphVisualizationImport: false,
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
