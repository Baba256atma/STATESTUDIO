import { TimelineVisualizationValidationPlatform } from "./timelineVisualizationValidation.ts";
import {
  TimelineVisualizationManifestComposition,
  TimelineVisualizationManifestReadiness,
} from "./timelineVisualizationManifestComposition.ts";
import { TimelineVisualizationManifestCompatibility } from "./timelineVisualizationManifestCompatibility.ts";
import { TimelineVisualizationManifestGuarantees } from "./timelineVisualizationManifestGuarantees.ts";
import { TimelineVisualizationManifestInventory } from "./timelineVisualizationManifestInventory.ts";
import { TimelineVisualizationManifestMetadata } from "./timelineVisualizationManifestMetadata.ts";

export const TimelineVisualizationManifestId = TimelineVisualizationManifestMetadata.id;
export const TimelineVisualizationManifestVersion = TimelineVisualizationManifestMetadata.version;
export const TimelineVisualizationManifestNamespace = TimelineVisualizationManifestMetadata.namespace;
export { TimelineVisualizationManifestMetadata };

export const TimelineVisualizationManifestPlatform = Object.freeze({
  metadata: TimelineVisualizationManifestMetadata,
  validation: TimelineVisualizationValidationPlatform,
  composition: TimelineVisualizationManifestComposition,
  guarantees: TimelineVisualizationManifestGuarantees,
  compatibility: TimelineVisualizationManifestCompatibility,
  readiness: TimelineVisualizationManifestReadiness,
  inventory: TimelineVisualizationManifestInventory,
  validationExecution: false,
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

export function getTimelineVisualizationManifestSummary() {
  return TimelineVisualizationManifestMetadata;
}

export function getTimelineVisualizationManifestCount() {
  return TimelineVisualizationManifestInventory.counts.phaseCount;
}

export function getTimelineVisualizationManifestReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationManifestId,
    name: TimelineVisualizationManifestMetadata.name,
    version: TimelineVisualizationManifestVersion,
    namespace: TimelineVisualizationManifestNamespace,
    status: TimelineVisualizationManifestMetadata.status,
    validationReference: TimelineVisualizationManifestMetadata.validationReference,
  });
}
