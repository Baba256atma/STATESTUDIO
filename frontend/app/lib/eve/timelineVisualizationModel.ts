import { TimelineVisualizationRegistryPlatform } from "./timelineVisualizationRegistry.ts";
import {
  TimelineVisualizationModelDescriptors,
  TimelineVisualizationStructuralComposition,
} from "./timelineVisualizationModelDescriptors.ts";
import { TimelineVisualizationModelInventory } from "./timelineVisualizationModelInventory.ts";
import { TimelineVisualizationModelMetadata } from "./timelineVisualizationModelMetadata.ts";
import { TimelineVisualizationModelPolicies } from "./timelineVisualizationModelPolicies.ts";
import { TimelineVisualizationModelRelationships } from "./timelineVisualizationModelRelationships.ts";

export const TimelineVisualizationModelId = TimelineVisualizationModelMetadata.id;
export const TimelineVisualizationModelVersion = TimelineVisualizationModelMetadata.version;
export const TimelineVisualizationModelNamespace = TimelineVisualizationModelMetadata.namespace;
export { TimelineVisualizationModelMetadata };

export const TimelineVisualizationModelPlatform = Object.freeze({
  metadata: TimelineVisualizationModelMetadata,
  registry: TimelineVisualizationRegistryPlatform,
  descriptors: TimelineVisualizationModelDescriptors,
  relationships: TimelineVisualizationModelRelationships,
  composition: TimelineVisualizationStructuralComposition,
  policies: TimelineVisualizationModelPolicies,
  inventory: TimelineVisualizationModelInventory,
  playbackExecution: false,
  animationExecution: false,
  scheduling: false,
  simulation: false,
  graphProcessing: false,
  rendering: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getTimelineVisualizationModelSummary() {
  return TimelineVisualizationModelMetadata;
}

export function getTimelineVisualizationModelCount() {
  return TimelineVisualizationModelInventory.counts.modelCount;
}

export function getTimelineVisualizationModelReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationModelId,
    name: TimelineVisualizationModelMetadata.name,
    version: TimelineVisualizationModelVersion,
    namespace: TimelineVisualizationModelNamespace,
    status: TimelineVisualizationModelMetadata.status,
    registryReference: TimelineVisualizationModelMetadata.registryReference,
  });
}
