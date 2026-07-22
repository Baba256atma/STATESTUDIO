import { TimelineVisualizationManifestPlatform } from "./timelineVisualizationManifest.ts";
import { TimelineVisualizationPlatformCapabilities } from "./timelineVisualizationPlatformCapabilities.ts";
import { TimelineVisualizationPlatformCompatibility } from "./timelineVisualizationPlatformCompatibility.ts";
import { TimelineVisualizationPlatformComposition } from "./timelineVisualizationPlatformComposition.ts";
import { TimelineVisualizationPlatformGuarantees } from "./timelineVisualizationPlatformGuarantees.ts";
import {
  TimelineVisualizationPlatformInventory,
  TimelineVisualizationPlatformMetadata,
} from "./timelineVisualizationPlatformMetadata.ts";

export const TimelineVisualizationPlatformId = TimelineVisualizationPlatformMetadata.id;
export const TimelineVisualizationPlatformVersion = TimelineVisualizationPlatformMetadata.version;
export const TimelineVisualizationPlatformNamespace = TimelineVisualizationPlatformMetadata.namespace;
export { TimelineVisualizationPlatformMetadata };

export const TimelineVisualizationPlatformPlatform = Object.freeze({
  metadata: TimelineVisualizationPlatformMetadata,
  manifest: TimelineVisualizationManifestPlatform,
  composition: TimelineVisualizationPlatformComposition,
  capabilities: TimelineVisualizationPlatformCapabilities,
  guarantees: TimelineVisualizationPlatformGuarantees,
  compatibility: TimelineVisualizationPlatformCompatibility,
  inventory: TimelineVisualizationPlatformInventory,
  readiness: TimelineVisualizationPlatformMetadata.readinessMetadata,
  validationExecution: false,
  certificationExecution: false,
  playbackExecution: false,
  animationExecution: false,
  scheduling: false,
  simulation: false,
  rendering: false,
  services: false,
  factories: false,
  runtimeExecution: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getTimelineVisualizationPlatformSummary() {
  return TimelineVisualizationPlatformMetadata;
}

export function getTimelineVisualizationPlatformCount() {
  return TimelineVisualizationPlatformInventory.counts.phaseCount;
}

export function getTimelineVisualizationPlatformReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationPlatformId,
    name: TimelineVisualizationPlatformMetadata.name,
    version: TimelineVisualizationPlatformVersion,
    namespace: TimelineVisualizationPlatformNamespace,
    status: TimelineVisualizationPlatformMetadata.status,
    manifestReference: TimelineVisualizationPlatformMetadata.manifestReference,
  });
}
