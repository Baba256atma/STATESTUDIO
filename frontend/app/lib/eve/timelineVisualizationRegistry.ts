import { TimelineVisualizationFoundationPlatform } from "./timelineVisualizationFoundation.ts";
import { TimelineVisualizationRegistryCatalog } from "./timelineVisualizationRegistryCatalog.ts";
import { TimelineVisualizationRegistryExtensions } from "./timelineVisualizationRegistryExtensions.ts";
import { TimelineVisualizationRegistryInventory } from "./timelineVisualizationRegistryInventory.ts";
import { TimelineVisualizationRegistryMetadata } from "./timelineVisualizationRegistryMetadata.ts";
import { TimelineVisualizationRegistryPolicies } from "./timelineVisualizationRegistryPolicies.ts";

export const TimelineVisualizationRegistryId = TimelineVisualizationRegistryMetadata.id;
export const TimelineVisualizationRegistryVersion = TimelineVisualizationRegistryMetadata.version;
export const TimelineVisualizationRegistryNamespace = TimelineVisualizationRegistryMetadata.namespace;
export { TimelineVisualizationRegistryMetadata };

export const TimelineVisualizationRegistryPlatform = Object.freeze({
  metadata: TimelineVisualizationRegistryMetadata,
  foundation: TimelineVisualizationFoundationPlatform,
  catalog: TimelineVisualizationRegistryCatalog,
  policies: TimelineVisualizationRegistryPolicies,
  extensions: TimelineVisualizationRegistryExtensions,
  inventory: TimelineVisualizationRegistryInventory,
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

export function getTimelineVisualizationRegistrySummary() {
  return TimelineVisualizationRegistryMetadata;
}

export function getTimelineVisualizationRegistryCount() {
  return TimelineVisualizationRegistryInventory.counts.registryEntryCount;
}

export function getTimelineVisualizationRegistryReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationRegistryId,
    name: TimelineVisualizationRegistryMetadata.name,
    version: TimelineVisualizationRegistryVersion,
    namespace: TimelineVisualizationRegistryNamespace,
    status: TimelineVisualizationRegistryMetadata.status,
    foundationReference: TimelineVisualizationRegistryMetadata.foundationReference,
  });
}
