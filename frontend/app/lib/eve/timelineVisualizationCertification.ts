import { TimelineVisualizationPlatformPlatform } from "./timelineVisualizationPlatform.ts";
import { TimelineVisualizationCertificationCompatibility } from "./timelineVisualizationCertificationCompatibility.ts";
import { TimelineVisualizationCertificationCriteria } from "./timelineVisualizationCertificationCriteria.ts";
import { TimelineVisualizationCertificationGates } from "./timelineVisualizationCertificationGates.ts";
import { TimelineVisualizationCertificationInventory } from "./timelineVisualizationCertificationInventory.ts";
import { TimelineVisualizationCertificationMetadata } from "./timelineVisualizationCertificationMetadata.ts";

export const TimelineVisualizationCertificationId = TimelineVisualizationCertificationMetadata.id;
export const TimelineVisualizationCertificationVersion = TimelineVisualizationCertificationMetadata.version;
export const TimelineVisualizationCertificationNamespace = TimelineVisualizationCertificationMetadata.namespace;
export { TimelineVisualizationCertificationMetadata };

export const TimelineVisualizationCertificationPlatform = Object.freeze({
  metadata: TimelineVisualizationCertificationMetadata,
  platform: TimelineVisualizationPlatformPlatform,
  criteria: TimelineVisualizationCertificationCriteria,
  gates: TimelineVisualizationCertificationGates,
  compatibility: TimelineVisualizationCertificationCompatibility,
  inventory: TimelineVisualizationCertificationInventory,
  readiness: TimelineVisualizationCertificationMetadata.readinessMetadata,
  certificationEngine: false,
  runtimeCertification: false,
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

export function getTimelineVisualizationCertificationSummary() {
  return TimelineVisualizationCertificationMetadata;
}

export function getTimelineVisualizationCertificationCount() {
  return TimelineVisualizationCertificationInventory.counts.criteriaCount;
}

export function getTimelineVisualizationCertificationReleaseMetadata() {
  return Object.freeze({
    id: TimelineVisualizationCertificationId,
    name: TimelineVisualizationCertificationMetadata.name,
    version: TimelineVisualizationCertificationVersion,
    namespace: TimelineVisualizationCertificationNamespace,
    status: TimelineVisualizationCertificationMetadata.status,
    readiness: TimelineVisualizationCertificationMetadata.readiness,
    platformReference: TimelineVisualizationCertificationMetadata.platformReference,
  });
}
