import { TimelineVisualizationFoundationCapabilities } from "./timelineVisualizationFoundationCapabilities.ts";
import { TimelineVisualizationFoundationContracts } from "./timelineVisualizationFoundationContracts.ts";
import { TimelineVisualizationFoundationLifecycle } from "./timelineVisualizationFoundationLifecycle.ts";
import {
  TimelineVisualizationFoundationInventory,
  TimelineVisualizationFoundationMetadata,
} from "./timelineVisualizationFoundationMetadata.ts";
import {
  TimelineVisualizationFoundationBoundaries,
  TimelineVisualizationFoundationOwnership,
} from "./timelineVisualizationFoundationOwnership.ts";

export const TimelineVisualizationFoundationId =
  TimelineVisualizationFoundationMetadata.id;
export const TimelineVisualizationFoundationVersion =
  TimelineVisualizationFoundationMetadata.version;
export const TimelineVisualizationFoundationNamespace =
  TimelineVisualizationFoundationMetadata.namespace;
export { TimelineVisualizationFoundationMetadata };

export const TimelineVisualizationFoundationPlatform = Object.freeze({
  metadata: TimelineVisualizationFoundationMetadata,
  upstreamPublicPlatform: TimelineVisualizationFoundationMetadata.upstreamPublicPlatform,
  contracts: TimelineVisualizationFoundationContracts,
  ownership: TimelineVisualizationFoundationOwnership,
  boundaries: TimelineVisualizationFoundationBoundaries,
  lifecycle: TimelineVisualizationFoundationLifecycle,
  capabilities: TimelineVisualizationFoundationCapabilities,
  inventory: TimelineVisualizationFoundationInventory,
  animation: false,
  playbackExecution: false,
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

export function getTimelineVisualizationFoundationSummary() {
  return TimelineVisualizationFoundationMetadata;
}

export function getTimelineVisualizationFoundationCount() {
  return TimelineVisualizationFoundationPlatform.contracts.length;
}

export function getTimelineVisualizationFoundationReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationFoundationId,
    name: TimelineVisualizationFoundationMetadata.name,
    version: TimelineVisualizationFoundationVersion,
    namespace: TimelineVisualizationFoundationNamespace,
    status: TimelineVisualizationFoundationMetadata.status,
    upstreamReference: TimelineVisualizationFoundationMetadata.upstreamPublicIndexReference,
  });
}
